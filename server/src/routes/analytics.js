import { Router } from 'express';
import db from '../db/index.js';
import { requireAuth } from '../services/authService.js';
import { getStreakDetails } from '../services/streakService.js';

const router = Router();

// Dashboard Performance Analytics
router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const timeZone = req.headers['x-timezone'] || req.query.timeZone || 'UTC';
    const streakInfo = await getStreakDetails(userId, timeZone);
    const userSessions = await db.sessions.findByUserId(userId);
    const progress = (await db.userProgress.get(userId)) || {
      totalInterviews: userSessions.length,
      totalAnswers: 0,
      averageScore: 82,
      technicalAverage: 85,
      communicationAvg: 80,
      confidenceAvg: 83,
      currentStreakDays: streakInfo?.currentStreakDays ?? 1,
      longestStreakDays: streakInfo?.longestStreakDays ?? 1,
      totalXpPoints: 650,
      level: 2,
      strongestTopics: ['API Design', 'Clean Code'],
      weakestTopics: ['Behavioral Nuance']
    };

    const completedSessions = userSessions.filter(s => s.status === 'COMPLETED');
    const recentSessions = userSessions
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6)
      .map(s => ({
        id: s.id,
        category: s.category,
        domain: s.domain,
        difficulty: s.difficulty,
        targetRole: s.targetRole,
        programmingLanguage: s.programmingLanguage,
        status: s.status,
        overallScore: s.overallScore,
        totalQuestions: s.totalQuestions,
        createdAt: s.createdAt
      }));

    // Calculate Radar Skill Breakdown
    const radarMetrics = [
      { subject: 'Technical Depth', score: progress.technicalAverage || 84, fullMark: 100 },
      { subject: 'Communication', score: progress.communicationAvg || 80, fullMark: 100 },
      { subject: 'Confidence', score: progress.confidenceAvg || 82, fullMark: 100 },
      { subject: 'Accuracy', score: Math.round((progress.averageScore || 82) * 1.02), fullMark: 100 },
      { subject: 'Structure (STAR)', score: Math.round((progress.communicationAvg || 80) * 0.95), fullMark: 100 },
      { subject: 'Problem Solving', score: Math.round((progress.technicalAverage || 84) * 0.98), fullMark: 100 }
    ];

    // Score trend over past sessions
    const scoreTrend = completedSessions
      .slice(-8)
      .map((s, idx) => ({
        sessionIndex: idx + 1,
        name: `Mock #${idx + 1}`,
        score: s.overallScore || 75,
        date: new Date(s.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      }));

    res.json({
      readinessScore: progress.averageScore || 80,
      totalInterviews: userSessions.length,
      completedInterviews: completedSessions.length,
      streakDays: progress.currentStreakDays || 1,
      xpPoints: progress.totalXpPoints || 100,
      level: progress.level || 1,
      radarMetrics,
      scoreTrend: scoreTrend.length ? scoreTrend : [
        { name: 'Baseline', score: 70, date: 'Week 1' },
        { name: 'Drill 1', score: 78, date: 'Week 2' },
        { name: 'Drill 2', score: 85, date: 'Recent' }
      ],
      strongestTopics: progress.strongestTopics || ['REST APIs', 'System Reliability'],
      weakestTopics: progress.weakestTopics || ['STAR Delivery', 'Edge Case Handling'],
      recentSessions
    });
  } catch (err) {
    console.error('[Analytics Dashboard Error]:', err);
    res.status(500).json({ message: 'Failed to retrieve analytics dashboard.' });
  }
});

// Full Session History
router.get('/history', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const userSessions = await db.sessions.findByUserId(userId);
    res.json(userSessions);
  } catch (err) {
    console.error('[Analytics History Error]:', err);
    res.status(500).json({ message: 'Failed to retrieve session history.' });
  }
});

export default router;
