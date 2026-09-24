import { Router } from 'express';
import crypto from 'crypto';
import db from '../db/index.js';
import { requireAuth } from '../services/authService.js';
import { getActiveResume } from './resume.js';
import { getRoleProfile } from '../config/roleConfigs.js';
import { getLanguageProfile } from '../config/languageConfigs.js';
import {
  generateInterviewQuestions,
  evaluateCandidateAnswer,
  generateFollowUpQuestion
} from '../services/geminiService.js';
import { recordUserActivity } from '../services/streakService.js';

const router = Router();

import {
  normalizeRole,
  normalizeProgrammingLanguage,
  normalizeDomain,
  normalizeCategory,
  normalizeDifficulty
} from '../config/normalization.js';

// Create new personalized interview session with strict configuration locking
router.post('/create', requireAuth, async (req, res) => {
  try {
    const {
      category = 'TECHNICAL',
      domain = 'Software Development',
      difficulty = 'INTERMEDIATE',
      role = 'Software Engineer',
      totalQuestions = 5,
      jobDescriptionKeywords = '',
      jobDescription = '',
      useResume = true,
      resumeId = null,
      programmingLanguage = '',
      language = '',
      selectedSkills = []
    } = req.body;

    const userProfile = (await db.userProfiles.get(req.user.id)) || {};
    const userResume = useResume ? (await getActiveResume(req.user.id, resumeId)) : null;

    // 1. Role Normalization (Deterministic & Safe)
    const rawRole = role || userProfile.targetRole || 'Software Engineer';
    const normRole = normalizeRole(rawRole, domain);
    if (!normRole.isValid) {
      return res.status(400).json({ message: normRole.error });
    }
    const resolvedRole = normRole.roleTitle;
    const roleProfile = normRole.roleProfile;

    // 2. Programming Language Normalization (Rule 25: Never override explicit choice with userProfile.skills[0])
    const rawLanguage = programmingLanguage || language || (userProfile.preferredLanguage) || (normRole.roleId === 'frontend_developer' ? 'JavaScript' : 'Python');
    const normLang = normalizeProgrammingLanguage(rawLanguage);
    if (!normLang.isValid) {
      return res.status(400).json({ message: normLang.error });
    }
    const resolvedLanguage = normLang.languageName;
    const languageProfile = normLang.languageProfile;

    // 3. Category & Difficulty Normalization
    const normCat = normalizeCategory(category);
    if (!normCat.isValid) {
      return res.status(400).json({ message: normCat.error });
    }
    const resolvedCategory = normCat.category;

    const normDiff = normalizeDifficulty(difficulty);
    if (!normDiff.isValid) {
      return res.status(400).json({ message: normDiff.error });
    }
    const resolvedDifficulty = normDiff.difficulty;

    const resolvedDomain = normalizeDomain(domain, resolvedRole);
    const resolvedJD = jobDescription || jobDescriptionKeywords || '';
    const resolvedSkills = Array.isArray(selectedSkills) && selectedSkills.length > 0
      ? selectedSkills
      : (userProfile.skills || userResume?.extractedSkills || []);

    // Generate Adaptive Questions with Gemini and Strict Post-Generation Validation
    const questions = await generateInterviewQuestions({
      role: resolvedRole,
      domain: resolvedDomain,
      difficulty: resolvedDifficulty,
      category: resolvedCategory,
      totalQuestions: Math.min(10, Math.max(3, Number(totalQuestions))),
      skills: resolvedSkills,
      resumeSummary: userResume?.parsedData?.headline || '',
      jobDescription: resolvedJD,
      roleProfile,
      programmingLanguage: resolvedLanguage
    });

    const sessionId = `sess-${crypto.randomUUID()}`;
    const newSession = {
      id: sessionId,
      userId: req.user.id,
      category: resolvedCategory,
      domain: resolvedDomain,
      difficulty: resolvedDifficulty,
      targetRole: resolvedRole,
      normalizedRole: normRole.roleId,
      programmingLanguage: resolvedLanguage,
      normalizedProgrammingLanguage: normLang.languageId,
      jobDescription: resolvedJD,
      resumeId: userResume ? userResume.id : null,
      selectedSkills: resolvedSkills,
      languageProfile: {
        id: languageProfile.id,
        name: languageProfile.name,
        icon: languageProfile.icon,
        badge: languageProfile.badge,
        corePillars: languageProfile.corePillars,
        strictInstruction: languageProfile.strictInstruction
      },
      roleProfile: {
        id: roleProfile.id,
        title: roleProfile.title,
        badge: roleProfile.badge,
        color: roleProfile.color,
        corePillars: roleProfile.corePillars || roleProfile.core_pillars,
        core_pillars: roleProfile.corePillars || roleProfile.core_pillars,
        strictInstruction: roleProfile.strictInstruction || roleProfile.strict_instruction,
        strict_instruction: roleProfile.strictInstruction || roleProfile.strict_instruction
      },
      resumeTitle: userResume ? (userResume.title || userResume.fileName) : null,
      status: 'CONFIGURING',
      totalQuestions: questions.length,
      timeLimitMinutes: Math.max(15, questions.length * 5),
      questions: questions.map((q, idx) => ({
        id: `q-${sessionId}-${idx + 1}`,
        orderIndex: idx + 1,
        questionText: q.questionText,
        questionType: q.questionType,
        difficulty: q.difficulty || resolvedDifficulty,
        role: resolvedRole,
        programmingLanguage: resolvedLanguage,
        domain: resolvedDomain,
        category: resolvedCategory,
        topics: q.topics || [],
        expectedKeywords: q.expectedKeywords || [],
        idealAnswerRubric: q.idealAnswerRubric || '',
        coreCompetencyTested: q.coreCompetencyTested || resolvedCategory,
        isFollowUp: false
      })),
      answers: [],
      evaluations: [],
      proctorLogs: [],
      overallScore: null,
      technicalScore: null,
      communicationScore: null,
      confidenceScore: null,
      summaryFeedback: null,
      startedAt: null,
      completedAt: null,
      createdAt: new Date().toISOString()
    };

    await db.sessions.create(newSession);
    res.status(201).json(newSession);
  } catch (err) {
    console.error('[Interview Create Error]:', err);
    res.status(500).json({ message: 'Failed to create interview session.' });
  }
});

// Get session details
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const session = await db.sessions.getById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Interview session not found.' });
    }
    if (session.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied.' });
    }
    res.json(session);
  } catch (err) {
    console.error('[Interview Get Error]:', err);
    res.status(500).json({ message: 'Failed to retrieve session.' });
  }
});

// Start session
router.post('/:id/start', requireAuth, async (req, res) => {
  try {
    const session = await db.sessions.getById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }
    const updated = await db.sessions.update(session.id, {
      status: 'IN_PROGRESS',
      startedAt: session.startedAt || new Date().toISOString()
    });

    const timeZone = req.headers['x-timezone'] || req.body?.timeZone || 'UTC';
    await recordUserActivity(req.user.id, 'INTERVIEW_STARTED', { sessionId: session.id }, timeZone);

    res.json(updated);
  } catch (err) {
    console.error('[Interview Start Error]:', err);
    res.status(500).json({ message: 'Failed to start interview.' });
  }
});

// Submit answer for a specific question & get instant multi-factor evaluation
router.post('/:id/answer', requireAuth, async (req, res) => {
  try {
    const { questionId, answerText, inputMode = 'TEXT', deliveryMetrics = null, durationSeconds = 0 } = req.body;
    const session = await db.sessions.getById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }

    const question = session.questions?.find(q => q.id === questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found in session.' });
    }

    if (!answerText || answerText.trim().length === 0) {
      return res.status(400).json({ message: 'Answer text cannot be empty.' });
    }

    // AI Multi-Factor Evaluation
    const evaluation = await evaluateCandidateAnswer({
      question,
      answerText,
      role: session.targetRole,
      difficulty: session.difficulty,
      category: session.category,
      deliveryMetrics,
      roleProfile: session.roleProfile,
      programmingLanguage: session.programmingLanguage || 'Python'
    });

    const answerRecord = {
      id: `ans-${crypto.randomUUID()}`,
      questionId,
      answerText,
      inputMode,
      durationSeconds,
      deliveryMetrics,
      evaluation,
      createdAt: new Date().toISOString()
    };

    // Upsert answer in session
    const currentAnswers = [...(session.answers || [])];
    const existingIndex = currentAnswers.findIndex(a => a.questionId === questionId);
    if (existingIndex >= 0) {
      currentAnswers[existingIndex] = answerRecord;
    } else {
      currentAnswers.push(answerRecord);
    }

    await db.sessions.update(session.id, { answers: currentAnswers });

    // Increment user XP points and advance daily streak
    const timeZone = req.headers['x-timezone'] || 'UTC';
    const progress = (await db.userProgress.get(req.user.id)) || {};
    const totalAnswers = (progress.totalAnswers || 0) + 1;
    const totalXpPoints = (progress.totalXpPoints || 0) + 25;
    const level = Math.floor(totalXpPoints / 300) + 1;
    await db.userProgress.update(req.user.id, {
      totalAnswers,
      totalXpPoints,
      level
    });
    await recordUserActivity(req.user.id, 'ANSWER_SUBMITTED', { sessionId: session.id }, timeZone);

    res.json({
      answer: answerRecord,
      evaluation
    });
  } catch (err) {
    console.error('[Interview Answer Error]:', err);
    res.status(500).json({ message: 'Error evaluating answer.' });
  }
});

// Dynamic AI Follow-up Question
router.post('/:id/follow-up', requireAuth, async (req, res) => {
  try {
    const { questionId, previousAnswer } = req.body;
    const session = await db.sessions.getById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found.' });

    const question = session.questions?.find(q => q.id === questionId);
    const followUpText = await generateFollowUpQuestion({
      question: question?.questionText || 'Your previous point',
      answerText: previousAnswer,
      role: session.targetRole,
      roleProfile: session.roleProfile,
      programmingLanguage: session.programmingLanguage || 'Python',
      domain: session.domain || 'Software Development',
      category: session.category || 'TECHNICAL',
      difficulty: session.difficulty || 'INTERMEDIATE'
    });

    const currentQuestions = [...(session.questions || [])];
    const followUpQuestion = {
      id: `q-followup-${crypto.randomUUID()}`,
      orderIndex: currentQuestions.length + 1,
      questionText: followUpText,
      questionType: 'SHORT_ANSWER',
      difficulty: session.difficulty,
      expectedKeywords: [],
      idealAnswerRubric: 'Candidate provides concrete specifics, metrics, or trade-offs.',
      coreCompetencyTested: 'Depth & Nuance',
      isFollowUp: true,
      parentQuestionId: questionId
    };

    currentQuestions.push(followUpQuestion);
    await db.sessions.update(session.id, {
      questions: currentQuestions,
      totalQuestions: currentQuestions.length
    });

    res.json(followUpQuestion);
  } catch (err) {
    console.error('[Followup Error]:', err);
    res.status(500).json({ message: 'Failed to generate follow-up question.' });
  }
});

// Finalize interview session & calculate aggregated scores
router.post('/:id/finish', requireAuth, async (req, res) => {
  try {
    const session = await db.sessions.getById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found.' });

    const answers = session.answers || [];
    const answersWithScores = answers.filter(a => a.evaluation?.overallScore != null);

    let avgOverall = 75;
    let avgTech = 75;
    let avgComm = 75;
    let avgConf = 75;
    let summaryFeedback = {};

    if (answersWithScores.length > 0) {
      avgOverall = Math.round(
        answersWithScores.reduce((acc, cur) => acc + cur.evaluation.overallScore, 0) / answersWithScores.length
      );
      avgTech = Math.round(
        answersWithScores.reduce((acc, cur) => acc + (cur.evaluation.technicalScore || cur.evaluation.overallScore), 0) / answersWithScores.length
      );
      avgComm = Math.round(
        answersWithScores.reduce((acc, cur) => acc + (cur.evaluation.clarityScore || cur.evaluation.overallScore), 0) / answersWithScores.length
      );
      avgConf = Math.round(
        answersWithScores.reduce((acc, cur) => acc + (cur.evaluation.confidenceScore || cur.evaluation.overallScore), 0) / answersWithScores.length
      );

      const allStrengths = answersWithScores.flatMap(a => a.evaluation.strengths || []);
      const allWeaknesses = answersWithScores.flatMap(a => a.evaluation.weaknesses || []);

      summaryFeedback = {
        overallVerdict: avgOverall >= 85 ? 'Strong Hire / High Readiness' : avgOverall >= 70 ? 'Promising Candidate / Minor Refinements Needed' : 'Further Practice Recommended',
        keyStrengths: allStrengths.slice(0, 4),
        areasForImprovement: allWeaknesses.slice(0, 4),
        recommendedNextSteps: [
          'Practice STAR storytelling for behavioral conflict questions.',
          'Review architecture trade-offs for high-scale distributed systems.',
          'Conduct a targeted coding sprint on data structures.'
        ]
      };

      // Update User Progress
      const progress = (await db.userProgress.get(req.user.id)) || {
        userId: req.user.id,
        totalInterviews: 0,
        totalAnswers: 0,
        averageScore: 0,
        totalXpPoints: 0,
        level: 1,
        currentStreakDays: 1,
        longestStreakDays: 1
      };

      const newTotalInterviews = (progress.totalInterviews || 0) + 1;
      const newAverageScore = Math.round(((progress.averageScore * (newTotalInterviews - 1)) + avgOverall) / newTotalInterviews);
      const newTechnicalAverage = Math.round((((progress.technicalAverage || avgTech) * (newTotalInterviews - 1)) + avgTech) / newTotalInterviews);
      const newCommunicationAvg = Math.round((((progress.communicationAvg || avgComm) * (newTotalInterviews - 1)) + avgComm) / newTotalInterviews);
      const newConfidenceAvg = Math.round((((progress.confidenceAvg || avgConf) * (newTotalInterviews - 1)) + avgConf) / newTotalInterviews);
      const newTotalXp = (progress.totalXpPoints || 0) + 100;
      const newLevel = Math.floor(newTotalXp / 300) + 1;

      await db.userProgress.update(req.user.id, {
        totalInterviews: newTotalInterviews,
        averageScore: newAverageScore,
        technicalAverage: newTechnicalAverage,
        communicationAvg: newCommunicationAvg,
        confidenceAvg: newConfidenceAvg,
        totalXpPoints: newTotalXp,
        level: newLevel,
        lastActiveDate: new Date().toISOString()
      });

      const timeZone = req.headers['x-timezone'] || 'UTC';
      await recordUserActivity(req.user.id, 'INTERVIEW_COMPLETED', { sessionId: session.id }, timeZone);
    }

    const updated = await db.sessions.update(session.id, {
      status: 'COMPLETED',
      completedAt: new Date().toISOString(),
      overallScore: avgOverall,
      technicalScore: avgTech,
      communicationScore: avgComm,
      confidenceScore: avgConf,
      summaryFeedback
    });

    res.json(updated);
  } catch (err) {
    console.error('[Interview Finish Error]:', err);
    res.status(500).json({ message: 'Failed to finalize interview.' });
  }
});

// Terminate session due to automated proctoring violation
router.post('/:id/terminate', requireAuth, async (req, res) => {
  try {
    const session = await db.sessions.getById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found.' });

    const { violationType, reason } = req.body;

    const updated = await db.sessions.update(session.id, {
      status: 'TERMINATED_PROCTOR_VIOLATION',
      isTerminated: true,
      terminationReason: reason || violationType || 'Proctoring integrity violation',
      completedAt: new Date().toISOString()
    });

    res.json({ success: true, session: updated });
  } catch (err) {
    console.error('[Interview Terminate Error]:', err);
    res.status(500).json({ message: 'Failed to terminate interview.' });
  }
});

// Full Session Performance Report
router.get('/:id/report', requireAuth, async (req, res) => {
  try {
    const session = await db.sessions.getById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found.' });
    res.json(session);
  } catch (err) {
    console.error('[Interview Report Error]:', err);
    res.status(500).json({ message: 'Failed to load report.' });
  }
});

export default router;
