import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { questionBankData } from '../data.js';
import { getRoleProfile } from '../config/roleConfigs.js';
import { getLanguageProfile } from '../config/languageConfigs.js';
import {
  normalizeRole,
  normalizeProgrammingLanguage,
  normalizeDomain,
  normalizeCategory,
  normalizeDifficulty
} from '../config/normalization.js';
import { validateQuestion, validateQuestionBatch } from './questionValidator.js';
import { generateCuratedQuestions } from './curatedQuestionBank.js';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
let aiClient = null;

if (apiKey && apiKey !== 'your_gemini_api_key_here') {
  try {
    aiClient = new GoogleGenAI({ apiKey });
    console.log('[GeminiService] Initialized Google Gemini API client successfully.');
  } catch (err) {
    console.warn('[GeminiService] Failed to initialize GoogleGenAI client:', err.message);
  }
} else {
  console.log('[GeminiService] No GEMINI_API_KEY detected. Running in intelligent hybrid fallback mode.');
}

/**
 * Clean and parse JSON from an LLM response (handling potential markdown code fences)
 */
function parseJsonSafe(text) {
  try {
    const cleaned = text.replace(/```json\s*/i, '').replace(/```\s*$/i, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    return null;
  }
}

/**
 * Sanitize text inputs before inserting into prompts (prevent injection / format breaks)
 */
function sanitizePromptText(text = '', maxLength = 2500) {
  if (!text || typeof text !== 'string') return '';
  return text
    .slice(0, maxLength)
    .replace(/[^\x20-\x7E\t\n\r]/g, ' ')
    .replace(/["`]/g, "'")
    .trim();
}

/**
 * 1. Generate Interview Questions with Strict Configuration Enforcement
 */
export async function generateInterviewQuestions({
  role = 'Software Engineer',
  targetRole = null,
  domain = 'Software Development',
  difficulty = 'INTERMEDIATE',
  category = 'TECHNICAL',
  totalQuestions = 5,
  skills = [],
  resumeSummary = '',
  jobDescription = '',
  roleProfile = null,
  programmingLanguage = 'Python'
}) {
  const effectiveRole = targetRole || role;
  // Deterministic Normalization
  const normRole = normalizeRole(effectiveRole, domain);
  const resolvedRoleProfile = roleProfile || normRole.roleProfile || getRoleProfile(effectiveRole, domain);
  const normLang = normalizeProgrammingLanguage(programmingLanguage);
  const resolvedLangProfile = normLang.languageProfile || getLanguageProfile(programmingLanguage);
  const normCat = normalizeCategory(category);
  const resolvedCategory = normCat.category || 'TECHNICAL';
  const normDiff = normalizeDifficulty(difficulty);
  const resolvedDifficulty = normDiff.difficulty || 'INTERMEDIATE';
  const resolvedDomain = normalizeDomain(domain, resolvedRoleProfile.title);
  const targetCount = Math.min(10, Math.max(3, Number(totalQuestions) || 5));

  const sessionConfig = {
    targetRole: resolvedRoleProfile.title,
    normalizedRole: resolvedRoleProfile.id,
    roleProfile: resolvedRoleProfile,
    programmingLanguage: resolvedLangProfile.name,
    normalizedProgrammingLanguage: resolvedLangProfile.id,
    languageProfile: resolvedLangProfile,
    domain: resolvedDomain,
    category: resolvedCategory,
    difficulty: resolvedDifficulty,
    totalQuestions: targetCount
  };

  const cleanResume = sanitizePromptText(resumeSummary, 1500);
  const cleanJD = sanitizePromptText(jobDescription, 1500);
  const cleanSkills = (Array.isArray(skills) ? skills : []).map(s => sanitizePromptText(String(s), 50)).filter(Boolean);

  let candidateQuestions = [];

  // Attempt AI generation if Gemini client is active
  if (aiClient) {
    try {
      const prompt = `You are an elite principal hiring bar-raiser and specialized technical interviewer.
You MUST generate interview questions ONLY for the exact selected configuration below.

==================================================
LOCKED INTERVIEW CONFIGURATION (MANDATORY & AUTHORITATIVE):
- Target Role: "${resolvedRoleProfile.title}" (ID: ${resolvedRoleProfile.id})
- Selected Programming Language: "${resolvedLangProfile.name}"
- Domain: "${resolvedDomain}"
- Category / Track: "${resolvedCategory}"
- Difficulty Level: "${resolvedDifficulty}"
- Total Questions Requested: ${targetCount}
==================================================

CRITICAL ROLE & PROGRAMMING LANGUAGE ENFORCEMENT RULES:
1. HARD PROGRAMMING LANGUAGE CONSTRAINT:
   - The candidate has explicitly chosen "${resolvedLangProfile.name}".
   - For TECHNICAL and CODING categories: ALL technical deep dives, code snippets, syntax questions, memory management questions, and concurrency discussions MUST be specifically based on "${resolvedLangProfile.name}".
   - Directive for ${resolvedLangProfile.name}: "${resolvedLangProfile.strictInstruction}"
   - Allowed Core Topics for ${resolvedLangProfile.name}: ${(resolvedLangProfile.allowedTopics || []).join(', ')}
   - Strictly Forbidden Topics for ${resolvedLangProfile.name}: ${(resolvedLangProfile.prohibitedTopics || []).join(', ')}
   - NEVER ask questions about another programming language (e.g. do NOT ask Python GIL or decorators if JavaScript is selected; do NOT ask JavaScript event loop if Python is selected; do NOT ask JVM/Spring if C++ is selected).

2. STRICT ROLE ANCHORING:
   - Every question MUST evaluate the core responsibilities, engineering duties, and architecture of a "${resolvedRoleProfile.title}".
   - Role Strict Directive: "${resolvedRoleProfile.strictInstruction || resolvedRoleProfile.strict_instruction}"
   - Role Core Pillars:
${(resolvedRoleProfile.corePillars || resolvedRoleProfile.core_pillars || []).map((p, i) => `     ${i + 1}. ${p}`).join('\n')}
   - Allowed Role Topics: ${(resolvedRoleProfile.allowedTopics || []).join(', ')}
   - Strictly Prohibited Role Topics: ${(resolvedRoleProfile.prohibitedTopics || []).join(', ')}
   - NEVER ask out-of-scope questions (e.g. do NOT ask CSS Flexbox to a Backend Engineer or Data Scientist; do NOT ask Kubernetes to a Frontend Developer; do NOT ask Data Science to a DevOps engineer).

3. INTERVIEW TRACK / CATEGORY ALIGNMENT:
   - TECHNICAL: Evaluate technical architecture, engineering trade-offs, language runtime, and system design.
   - CODING: Must involve problem-solving, algorithms, data structures, and code implementation in ${resolvedLangProfile.name}.
   - BEHAVIORAL: Situational STAR scenarios (Situation, Task, Action, Result). Do NOT force pure syntax into behavioral questions.
   - HR: Focus on culture, communication, career motivations, and fit. NEVER ask deep technical infrastructure questions in HR.

4. DIFFICULTY CALIBRATION:
   - Calibrate strictly to "${resolvedDifficulty}".

Candidate Background (Personalize ONLY when compatible with ${resolvedRoleProfile.title} and ${resolvedLangProfile.name}):
- Candidate Known Skills: ${cleanSkills.join(', ') || 'Standard role skills'}
- Candidate Resume Background: ${cleanResume || 'None provided'}
- Target Job Description: ${cleanJD || 'Standard requirements'}

Format requirements:
Return ONLY valid JSON matching this schema:
{
  "questions": [
    {
      "orderIndex": 1,
      "questionText": "string (the question prompt, specifically referencing ${resolvedLangProfile.name} syntax, runtime, and architecture for ${resolvedRoleProfile.title})",
      "questionType": "SCENARIO" | "TECHNICAL_DEEP_DIVE" | "BEHAVIORAL_STAR" | "SHORT_ANSWER" | "CODING",
      "difficulty": "${resolvedDifficulty}",
      "role": "${resolvedRoleProfile.title}",
      "programmingLanguage": "${resolvedLangProfile.name}",
      "domain": "${resolvedDomain}",
      "category": "${resolvedCategory}",
      "topics": ["topic1", "topic2"],
      "expectedKeywords": ["keyword1", "keyword2", "keyword3"],
      "idealAnswerRubric": "Summary of what a top candidate should cover",
      "coreCompetencyTested": "Specific core competency tested"
    }
  ]
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = parseJsonSafe(response.text);
      if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        // Run Post-Generation Question Validation Layer (Section 12)
        const { validQuestions, rejectedQuestions } = validateQuestionBatch(parsed.questions, sessionConfig);

        if (rejectedQuestions.length > 0) {
          console.warn(`[GeminiService] Question Validator rejected ${rejectedQuestions.length} questions:`,
            rejectedQuestions.map(r => r.reasons.join('; ')));
        }

        candidateQuestions.push(...validQuestions);

        // Targeted Regeneration if we still need questions and some were rejected
        if (candidateQuestions.length < targetCount && rejectedQuestions.length > 0) {
          const needed = targetCount - candidateQuestions.length;
          const retryPrompt = `Generate exactly ${needed} replacement interview questions strictly for Role: "${resolvedRoleProfile.title}" and Language: "${resolvedLangProfile.name}".
Category: "${resolvedCategory}", Difficulty: "${resolvedDifficulty}".
PREVIOUS QUESTIONS WERE REJECTED FOR THE FOLLOWING VIOLATIONS:
${rejectedQuestions.map((r, i) => `${i + 1}. ${r.reasons.join(' ')}`).join('\n')}
DO NOT mention any of those prohibited topics. Focus 100% on ${resolvedRoleProfile.title} + ${resolvedLangProfile.name}.
Return ONLY valid JSON matching the schema with key "questions".`;

          try {
            const retryRes = await aiClient.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: retryPrompt,
              config: { responseMimeType: 'application/json' }
            });
            const retryParsed = parseJsonSafe(retryRes.text);
            if (retryParsed && Array.isArray(retryParsed.questions)) {
              const retryVal = validateQuestionBatch(retryParsed.questions, sessionConfig);
              candidateQuestions.push(...retryVal.validQuestions);
            }
          } catch (retryErr) {
            console.warn('[GeminiService] Targeted retry failed:', retryErr.message);
          }
        }
      }
    } catch (err) {
      console.warn('[GeminiService] Error calling Gemini generateContent:', err.message);
    }
  }

  // If questions are still insufficient or AI failed, draw from Safe Fallback Generator (Section 13)
  if (candidateQuestions.length < targetCount) {
    const needed = targetCount - candidateQuestions.length;
    const fallbackQuestions = generateCuratedQuestions({
      role: resolvedRoleProfile.title,
      programmingLanguage: resolvedLangProfile.name,
      domain: resolvedDomain,
      category: resolvedCategory,
      difficulty: resolvedDifficulty,
      totalQuestions: targetCount
    });

    for (const fbq of fallbackQuestions) {
      if (candidateQuestions.length >= targetCount) break;
      const isDuplicate = candidateQuestions.some(cq =>
        (cq.questionText || '').trim().toLowerCase() === (fbq.questionText || '').trim().toLowerCase()
      );
      if (!isDuplicate) {
        candidateQuestions.push(fbq);
      }
    }
  }

  // Final validation pass on the entire batch to guarantee 100% adherence
  const finalBatch = validateQuestionBatch(candidateQuestions, sessionConfig);
  const guaranteedQuestions = finalBatch.validQuestions.slice(0, targetCount).map((q, idx) => ({
    orderIndex: idx + 1,
    questionText: q.questionText,
    questionType: q.questionType || 'TECHNICAL_DEEP_DIVE',
    difficulty: q.difficulty || resolvedDifficulty,
    role: resolvedRoleProfile.title,
    programmingLanguage: resolvedLangProfile.name,
    domain: resolvedDomain,
    category: resolvedCategory,
    topics: q.topics || [resolvedRoleProfile.title, resolvedLangProfile.name],
    expectedKeywords: q.expectedKeywords || [],
    idealAnswerRubric: q.idealAnswerRubric || q.explanation || '',
    coreCompetencyTested: q.coreCompetencyTested || resolvedRoleProfile.title
  }));

  return guaranteedQuestions;
}

/**
 * 2. Multi-Factor Answer Evaluation with Cross-Technology Mismatch Detection
 */
export async function evaluateCandidateAnswer({
  question,
  answerText,
  role = 'Software Engineer',
  difficulty = 'INTERMEDIATE',
  category = 'TECHNICAL',
  deliveryMetrics = null,
  roleProfile = null,
  programmingLanguage = 'Python'
}) {
  const normRole = normalizeRole(role);
  const resolvedProfile = roleProfile || normRole.roleProfile || getRoleProfile(role, category);
  const normLang = normalizeProgrammingLanguage(programmingLanguage);
  const langProfile = normLang.languageProfile || getLanguageProfile(programmingLanguage);
  const words = (answerText || '').trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const questionPrompt = question.questionText || question;
  const expectedKeywords = Array.isArray(question.expectedKeywords) ? question.expectedKeywords : [];
  const idealRubric = question.idealAnswerRubric || '';
  const coreCompetency = question.coreCompetencyTested || category;

  if (aiClient && wordCount >= 3) {
    try {
      const prompt = `You are an executive hiring bar-raiser, principal technical interviewer, and communication coach.
Evaluate the candidate's answer with rigorous, objective, and actionable feedback.

Interview Context:
- Target Role: "${role}" (${resolvedProfile?.title || role})
- Selected Programming Language: "${langProfile.name}"
- Role Specialization Directive: "${resolvedProfile?.strictInstruction || resolvedProfile?.strict_instruction || 'Focus on technical fundamentals.'}"
- Language Calibration Directive: "${langProfile.strictInstruction}"
- Core Pillars Evaluated: ${(resolvedProfile?.corePillars || resolvedProfile?.core_pillars || []).join('; ')}
- Category: "${category}"
- Difficulty Level: "${difficulty}"
- Core Competency Tested: "${coreCompetency}"
- Question Asked: "${questionPrompt}"
- Question Type: "${question.questionType || 'GENERAL'}"
- Expected Key Concepts & Keywords: ${JSON.stringify(expectedKeywords)}
- Ideal Answer Rubric: "${idealRubric}"
- Candidate Answer Submitted: "${answerText}"
- Candidate Delivery Telemetry: ${deliveryMetrics ? JSON.stringify(deliveryMetrics) : 'None provided'}

MANDATORY SCORING & MONITORING CRITERIA:
1. RIGOROUS RELEVANCE & EVASION CHECK:
   - Does the candidate genuinely answer the specific question asked?
   - If the candidate's answer is evasive ("I don't know", "no idea", "pass", "skip", "not sure"), nonsensical, or too brief (< 12 words) without substantive content:
     YOU MUST ASSIGN overallScore <= 20, accuracyScore <= 15, relevanceScore <= 15, technicalScore <= 15.

2. TECHNOLOGY & TOPIC ALIGNMENT (CRITICAL):
   - The candidate is being evaluated for "${resolvedProfile?.title || role}" and "${langProfile.name}".
   - If the candidate provides an answer about a DIFFERENT programming language or off-topic technology (e.g. discussing Python in a JavaScript interview, or Java in a C++ interview), YOU MUST penalize relevanceScore <= 30, accuracyScore <= 30, technicalScore <= 30, and explicitly flag the technology mismatch in weaknesses!

3. SUBSTANTIVE & TECHNICAL DEPTH IN ${langProfile.name.toUpperCase()}:
   - Check if the answer addresses the expected keywords, rubric, and idiomatic ${langProfile.name} patterns.

4. DELIVERY TELEMETRY AUDIT:
   - Incorporate monitored delivery metrics into clarity and confidence scores.

Return ONLY valid JSON matching this schema:
{
  "overallScore": number (0-100),
  "accuracyScore": number (0-100),
  "relevanceScore": number (0-100),
  "clarityScore": number (0-100),
  "confidenceScore": number (0-100),
  "technicalScore": number (0-100),
  "completenessScore": number (0-100),
  "coveredKeywords": ["string"],
  "missingKeywords": ["string"],
  "telemetryAudit": {
    "paceAssessment": "string",
    "fillerAssessment": "string"
  },
  "strengths": ["string"],
  "weaknesses": ["string"],
  "improvedAnswer": "string",
  "idealModelAnswer": "string",
  "conceptStudyLinks": [
    { "title": "string", "topic": "string" }
  ],
  "followUpSuggestions": ["string"]
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const parsed = parseJsonSafe(response.text);
      if (parsed && typeof parsed.overallScore === 'number') {
        return parsed;
      }
    } catch (err) {
      console.warn('[GeminiService] Error calling Gemini evaluateCandidateAnswer:', err.message);
    }
  }

  // Heuristic-based Intelligent Evaluation Fallback
  return evaluateAnswerHeuristically({
    question,
    answerText,
    role: resolvedProfile?.title || role,
    difficulty,
    deliveryMetrics,
    programmingLanguage: langProfile.name,
    langProfile,
    roleProfile: resolvedProfile
  });
}

/**
 * 3. Dynamic In-Session Follow-Up Generator
 */
export async function generateFollowUpQuestion({
  question,
  answerText,
  role = 'Software Engineer',
  roleProfile = null,
  programmingLanguage = 'Python',
  languageProfile = null,
  domain = 'Software Development',
  category = 'TECHNICAL',
  difficulty = 'INTERMEDIATE'
}) {
  const normRole = normalizeRole(role, domain);
  const resolvedProfile = roleProfile || normRole.roleProfile || getRoleProfile(role, domain);
  const normLang = normalizeProgrammingLanguage(programmingLanguage);
  const langProfile = languageProfile || normLang.languageProfile || getLanguageProfile(programmingLanguage);

  const sessionConfig = {
    targetRole: resolvedProfile?.title || role,
    roleProfile: resolvedProfile,
    programmingLanguage: langProfile.name,
    languageProfile: langProfile,
    domain,
    category,
    difficulty
  };

  if (aiClient) {
    try {
      const prompt = `You are an interviewer conducting a live mock interview strictly for:
Role: "${resolvedProfile?.title || role}"
Programming Language: "${langProfile.name}"
Category: "${category}", Difficulty: "${difficulty}"

Role Specialization Directive: "${resolvedProfile?.strictInstruction || resolvedProfile?.strict_instruction || 'Focus on core engineering competencies.'}"
Programming Language Directive: "${langProfile.strictInstruction}"

Question Asked: "${question}"
Candidate Answer: "${answerText}"

Formulate a sharp, natural follow-up question in "${langProfile.name}" for "${resolvedProfile?.title || role}".
HARD CONSTRAINTS:
- Must stay strictly within "${langProfile.name}".
- Must NOT ask questions about other programming languages.
- Must challenge an edge case, performance trade-off, or concrete implementation detail.
Return JSON:
{
  "followUpQuestion": "string",
  "rationale": "string"
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const parsed = parseJsonSafe(response.text);
      if (parsed && parsed.followUpQuestion) {
        const val = validateQuestion({ questionText: parsed.followUpQuestion }, sessionConfig);
        if (val.isValid) {
          return parsed.followUpQuestion;
        }
      }
    } catch (err) {
      console.warn('[GeminiService] Error calling follow-up generator:', err.message);
    }
  }

  // Intersection-calibrated follow-up fallbacks
  if (resolvedProfile?.id === 'frontend_developer' || resolvedProfile?.title?.toLowerCase().includes('frontend')) {
    if (langProfile.id === 'javascript' || langProfile.id === 'typescript') {
      return `In your ${langProfile.name} implementation, how does that pattern avoid layout thrashing, minimize main-thread jank, and handle DOM event cleanup?`;
    }
  }

  if (resolvedProfile?.id === 'data_scientist') {
    return `In Python, how would you validate that feature pipeline against data leakage, test for statistical significance, and monitor for model drift post-deployment?`;
  }

  if (resolvedProfile?.id === 'devops_cloud_engineer') {
    return `In that cloud deployment scenario, what automated rollback strategy and blast-radius mitigation would you employ to guarantee zero-downtime reliability?`;
  }

  if (resolvedProfile?.id === 'qa_automation_sdet') {
    return `In your test framework using ${langProfile.name}, how do you eliminate asynchronous race conditions and guarantee thread safety during parallel multi-browser execution?`;
  }

  if (resolvedProfile?.id === 'cybersecurity_analyst') {
    return `From a defense-in-depth perspective, what attack vectors could bypass that control, and how would your SIEM correlate the anomalous telemetry?`;
  }

  if (resolvedProfile?.id === 'system_architect') {
    return `From an architectural perspective, how does that design handle network partitions under the CAP theorem and ensure cache consistency at scale?`;
  }

  // Language-specific fallback
  if (langProfile?.id === 'python') {
    return `In Python, how would you optimize that implementation to avoid GIL contention, handle cyclic references, or leverage asyncio under high load?`;
  }
  if (langProfile?.id === 'java') {
    return `In Java, what concurrency controls, Virtual Threads, or JVM garbage collection implications would you monitor under high throughput for that approach?`;
  }
  if (langProfile?.id === 'javascript' || langProfile?.id === 'typescript') {
    return `In ${langProfile.name}, how does that pattern interact with the event loop and prevent microtask queue starvation or memory retention?`;
  }

  return `You mentioned your approach to resolving that—could you share a specific trade-off or constraint you faced in ${langProfile.name}, and what quantitative metric demonstrated your success?`;
}

/**
 * 4. Parse Resume and Extract Skills & Missing Gaps
 */
export async function parseResumeWithAI(resumeText, targetRole = 'Software Engineer') {
  if (aiClient && resumeText.length > 50) {
    try {
      const prompt = `You are an expert technical talent analyst.
Analyze the following resume text for a candidate targeting: "${targetRole}".

Resume Text:
"""
${sanitizePromptText(resumeText, 4000)}
"""

Extract structured attributes and identify missing skills for modern industry standards.
Return JSON:
{
  "candidateName": "string",
  "headline": "string",
  "yearsOfExperience": number,
  "extractedSkills": ["string"],
  "projects": [{ "title": "string", "techStack": ["string"], "summary": "string" }],
  "education": [{ "degree": "string", "school": "string", "year": "string" }],
  "missingRecommendedSkills": ["string"],
  "resumeQualityScore": number (0-100),
  "actionableSuggestions": ["string"]
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const parsed = parseJsonSafe(response.text);
      if (parsed && Array.isArray(parsed.extractedSkills)) return parsed;
    } catch (err) {
      console.warn('[GeminiService] Error calling resume parser:', err.message);
    }
  }

  return parseResumeHeuristically(resumeText, targetRole);
}

/**
 * 5. Compare Resume against Job Description
 */
export async function matchResumeToJobDescription(resumeText, jdText) {
  if (aiClient && resumeText && jdText) {
    try {
      const prompt = `You are an ATS and hiring committee analyst.
Compare the Candidate Resume against the Target Job Description.

Resume:
"""
${sanitizePromptText(resumeText, 3000)}
"""

Job Description:
"""
${sanitizePromptText(jdText, 3000)}
"""

Calculate an authentic match percentage and provide targeted recommendations.
Return JSON:
{
  "matchScore": number (0-100),
  "matchedSkills": ["string"],
  "missingSkills": ["string"],
  "topMatchingStrengths": ["string"],
  "criticalGaps": ["string"],
  "customInterviewQuestions": ["string", "string", "string"],
  "recommendations": ["string"]
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const parsed = parseJsonSafe(response.text);
      if (parsed && typeof parsed.matchScore === 'number') return parsed;
    } catch (err) {
      console.warn('[GeminiService] Error matching JD:', err.message);
    }
  }

  return matchJobDescriptionHeuristically(resumeText, jdText);
}

// Backwards-compatible role archetypes export
export const ROLE_ARCHETYPES = {
  QA_SDET: { id: 'QA_SDET', label: 'QA Automation & SDET / Software Test Engineer', keywords: ['qa', 'test', 'sdet', 'automation'] },
  FRONTEND: { id: 'FRONTEND', label: 'Frontend Developer / UI Engineer', keywords: ['frontend', 'react', 'ui', 'vue'] },
  BACKEND: { id: 'BACKEND', label: 'Software Development Engineer (Backend / Core)', keywords: ['backend', 'api', 'server', 'node'] },
  DEVOPS_SRE: { id: 'DEVOPS_SRE', label: 'DevOps & Cloud Infrastructure Engineer', keywords: ['devops', 'cloud', 'sre'] },
  DATA_AI: { id: 'DATA_AI', label: 'Data Scientist & ML Engineer', keywords: ['data', 'ml', 'ai'] },
  SYSTEM_ARCHITECT: { id: 'SYSTEM_ARCHITECT', label: 'System Architect / Principal Engineer', keywords: ['architect', 'system design'] },
  CYBERSECURITY: { id: 'CYBERSECURITY', label: 'Information Security & Cyber Defense Analyst', keywords: ['security', 'cyber', 'infosec'] },
  FULLSTACK: { id: 'FULLSTACK', label: 'Full Stack Developer', keywords: ['full stack', 'fullstack'] }
};

export function detectRoleArchetype(role = '', domain = '') {
  const norm = normalizeRole(role, domain);
  if (norm.isValid) {
    if (norm.roleId === 'qa_automation_sdet') return 'QA_SDET';
    if (norm.roleId === 'frontend_developer') return 'FRONTEND';
    if (norm.roleId === 'devops_cloud_engineer') return 'DEVOPS_SRE';
    if (norm.roleId === 'data_scientist') return 'DATA_AI';
    if (norm.roleId === 'cybersecurity_analyst') return 'CYBERSECURITY';
    if (norm.roleId === 'system_architect') return 'SYSTEM_ARCHITECT';
    if (norm.roleId === 'fullstack_developer') return 'FULLSTACK';
    return 'BACKEND';
  }
  return 'BACKEND';
}

/**
 * Heuristic Evaluation Fallback with Cross-Technology Mismatch Recognition (Section 15)
 */
function evaluateAnswerHeuristically({
  question,
  answerText,
  role,
  difficulty,
  deliveryMetrics,
  programmingLanguage = 'Python',
  langProfile = null,
  roleProfile = null
}) {
  const text = (answerText || '').trim();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const questionPrompt = question.questionText || question.title || (typeof question === 'string' ? question : '');
  const expectedKeywords = Array.isArray(question.expectedKeywords) ? question.expectedKeywords : [];
  const coreCompetency = question.coreCompetencyTested || 'Technical Proficiency';

  // 1. Monitored Telemetry Processing
  const wpm = deliveryMetrics?.wpm || (wordCount > 0 && deliveryMetrics?.durationSeconds > 0 ? Math.round(wordCount / (deliveryMetrics.durationSeconds / 60)) : 0);
  const fillerWordRegex = /\b(um|uh|like|basically|actually|literally|you know|sort of|i mean)\b/gi;
  const rawFillerMatches = text.match(fillerWordRegex) || [];
  const fillerCount = deliveryMetrics?.fillerWordsCount ?? rawFillerMatches.length;
  const fillerRatio = wordCount > 0 ? fillerCount / wordCount : 0;

  let paceAssessment = 'Conversational and well-paced.';
  let paceDeduction = 0;
  if (wpm > 210) {
    paceAssessment = `Rushed delivery (${wpm} WPM). Slow down slightly to emphasize key technical concepts.`;
    paceDeduction = 6;
  } else if (wpm > 0 && wpm < 70) {
    paceAssessment = `Deliberate or halting pace (${wpm} WPM). Practice smoother transitions to project confidence.`;
    paceDeduction = 8;
  } else if (wpm >= 110 && wpm <= 165) {
    paceAssessment = `Optimal interview cadence (${wpm} WPM). Clear and authoritative.`;
  }

  let fillerAssessment = 'Minimal filler words detected. Clean articulation.';
  let fillerDeduction = 0;
  if (fillerRatio > 0.05 || fillerCount >= 5) {
    fillerAssessment = `High filler word density (${fillerCount} fillers, ${(fillerRatio * 100).toFixed(1)}% of speech). Replace filler sounds with deliberate pauses.`;
    fillerDeduction = Math.min(18, Math.round(fillerRatio * 120) + (fillerCount > 6 ? 6 : 0));
  } else if (fillerCount > 2) {
    fillerAssessment = `Moderate filler words noted (${fillerCount} fillers). Practice intentional breathing during topic transitions.`;
    fillerDeduction = 5;
  }

  // 2. Detect Evasion / Non-Answers
  const isEvasive = /\b(i don'?t know|no idea|not sure|skip|pass|have no clue|cannot answer|don'?t remember|no answer|asdf|qwerty)\b/i.test(text) || wordCount < 10;

  if (isEvasive) {
    const baseline = Math.min(22, Math.max(8, wordCount * 2));
    return {
      overallScore: baseline,
      accuracyScore: Math.max(5, baseline - 4),
      relevanceScore: Math.max(5, baseline - 2),
      clarityScore: 35,
      confidenceScore: 20,
      technicalScore: 10,
      completenessScore: 8,
      coveredKeywords: [],
      missingKeywords: expectedKeywords.slice(0, 5),
      telemetryAudit: { paceAssessment, fillerAssessment },
      strengths: ['Acknowledged knowledge boundary promptly rather than speculating with false information.'],
      weaknesses: [
        'Response was evasive or too brief to evaluate competence on this question.',
        `To pass this evaluation, address the core competency: ${coreCompetency}.`,
        expectedKeywords.length ? `Missing critical domain concepts: ${expectedKeywords.slice(0, 3).join(', ')}.` : 'Provide a structured answer with concrete examples.'
      ],
      improvedAnswer: question.sampleAnswer ? `Here is how a prepared candidate would respond: "${question.sampleAnswer}"` : `Structure a complete answer by defining the core principle, explaining its practical implementation in ${role}, and discussing the primary architectural trade-offs.`,
      idealModelAnswer: question.sampleAnswer || `A top-tier answer addresses: 1) The definition and mechanics; 2) The trade-offs or failure modes; and 3) Verifiable production impact or KPIs.`,
      conceptStudyLinks: [
        { title: `${coreCompetency} Fundamentals`, topic: 'Interview Preparation' },
        { title: 'STAR Method & Executive Communication', topic: 'Interview Delivery' }
      ],
      followUpSuggestions: [
        `What fundamental concepts of ${coreCompetency} are you most comfortable discussing?`,
        'Can you share a related scenario where you encountered a similar technical challenge?'
      ]
    };
  }

  // 3. Cross-Technology Mismatch Detection (Section 15)
  // E.g. Question is JavaScript, candidate speaks about Python GIL or decorators
  let hasTechMismatch = false;
  let mismatchDetails = '';
  const textLower = text.toLowerCase();
  const langLower = programmingLanguage.toLowerCase();

  if (langLower.includes('javascript') || langLower.includes('typescript')) {
    if (textLower.includes('python') || textLower.includes('gil') || textLower.includes('cpython') || textLower.includes('django') || textLower.includes('fastapi')) {
      hasTechMismatch = true;
      mismatchDetails = `Question asks about JavaScript/TypeScript, but response discusses Python concepts (e.g. GIL, Python frameworks).`;
    }
  } else if (langLower.includes('python')) {
    if (textLower.includes('v8 engine') || textLower.includes('event loop') || textLower.includes('microtask') || textLower.includes('useeffect') || textLower.includes('react fiber')) {
      hasTechMismatch = true;
      mismatchDetails = `Question asks about Python, but response discusses JavaScript/browser engine concepts.`;
    }
  }

  // 4. Keyword and Concept Relevance
  const coveredKeywords = [];
  const missingKeywords = [];

  expectedKeywords.forEach(kw => {
    const rawMatch = textLower.includes(kw.toLowerCase());
    const cleanKw = kw.replace(/[-/\\^$*+?.()|[\]{}]/g, ' ').trim().replace(/\s+/g, '[\\s-_]+');
    const regexMatch = cleanKw.length > 0 ? new RegExp(`\\b${cleanKw}(?:s|es)?\\b`, 'i').test(text) : false;
    if (rawMatch || regexMatch) {
      coveredKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const keywordCoverageRatio = expectedKeywords.length > 0 ? coveredKeywords.length / expectedKeywords.length : 0.5;

  // 5. Structural Checks
  const hasSTAR = /situation|task|action|result|when|first|then|finally|impact|outcome|achieved|deployed/i.test(text);
  const hasMetrics = /\d+|%|percent|reduced|increased|improved|scaled|saved|latency|seconds|minutes|kpi|roi/i.test(text);
  const hasTradeoffs = /trade-off|however|alternative|instead of|considers|balanced|versus|vs|drawback|benefit/i.test(text);
  const hasTechDepth = /database|cache|architecture|algorithm|async|thread|design|schema|index|protocol|service|api|cluster|node|component|framework/i.test(text);

  // 6. Dimension Scoring
  let accuracyScore = Math.round(38 + (keywordCoverageRatio * 44) + (hasTechDepth ? 10 : 3) + (hasMetrics ? 6 : 0));
  if (wordCount < 25) accuracyScore -= 15;
  accuracyScore = Math.min(96, Math.max(20, accuracyScore));

  let relevanceScore = Math.round(42 + (keywordCoverageRatio * 46) + (hasSTAR ? 8 : 4));
  relevanceScore = Math.min(98, Math.max(25, relevanceScore));

  let clarityScore = Math.round(88 - fillerDeduction - paceDeduction);
  if (wordCount > 160) clarityScore -= 6;
  clarityScore = Math.min(96, Math.max(30, clarityScore));

  const hasHedging = /\b(i think|i guess|maybe|sort of|probably|not sure if)\b/i.test(text);
  let confidenceScore = Math.round(84 - (hasHedging ? 10 : 0) - (fillerDeduction / 2) - (paceDeduction / 2));
  if (wordCount >= 40) confidenceScore += 8;
  confidenceScore = Math.min(95, Math.max(25, confidenceScore));

  let technicalScore = Math.round(36 + (keywordCoverageRatio * 42) + (hasTechDepth ? 14 : 3) + (hasTradeoffs ? 8 : 0));
  technicalScore = Math.min(96, Math.max(20, technicalScore));

  let completenessScore = Math.round(35 + Math.min(35, (wordCount / 70) * 35) + (keywordCoverageRatio * 25));
  completenessScore = Math.min(95, Math.max(20, completenessScore));

  // If Technology Mismatch is detected, cap scores severely (Section 15)
  if (hasTechMismatch) {
    accuracyScore = Math.min(25, accuracyScore);
    relevanceScore = Math.min(25, relevanceScore);
    technicalScore = Math.min(25, technicalScore);
  }

  const overallScore = Math.round(
    accuracyScore * 0.28 +
    relevanceScore * 0.24 +
    technicalScore * 0.20 +
    clarityScore * 0.14 +
    confidenceScore * 0.08 +
    completenessScore * 0.06
  );

  const strengths = [];
  const weaknesses = [];

  if (hasTechMismatch) {
    weaknesses.push(`Technology Mismatch: ${mismatchDetails} Ensure your answers specifically target ${programmingLanguage}.`);
  }

  if (coveredKeywords.length > 0) {
    strengths.push(`Addressed key concepts: ${coveredKeywords.slice(0, 3).join(', ')}.`);
  }
  if (hasMetrics) {
    strengths.push('Effectively grounded the outcome in measurable metrics.');
  }
  if (hasTradeoffs) {
    strengths.push('Demonstrated architectural maturity by analyzing trade-offs.');
  }
  if (hasSTAR) {
    strengths.push('Exhibited clear narrative structure adhering to the STAR methodology.');
  }

  if (missingKeywords.length > 0) {
    weaknesses.push(`Missing key expected concepts: ${missingKeywords.slice(0, 3).join(', ')}.`);
  }
  if (wordCount < 45) {
    weaknesses.push('Response is too brief; elaborate with concrete architectural details or production experience.');
  }

  if (strengths.length === 0) strengths.push('Directly engaged with the prompt without deflecting.');
  if (weaknesses.length === 0) weaknesses.push('Consider elaborating on edge cases and failure modes.');

  return {
    overallScore,
    accuracyScore,
    relevanceScore,
    clarityScore,
    confidenceScore,
    technicalScore,
    completenessScore,
    coveredKeywords,
    missingKeywords,
    telemetryAudit: { paceAssessment, fillerAssessment },
    strengths,
    weaknesses,
    improvedAnswer: question.sampleAnswer
      ? `To elevate your response: "${question.sampleAnswer}"`
      : `Structure your answer by explaining the core principle in ${programmingLanguage}, the practical implementation trade-offs for ${role}, and verifiable impact.`,
    idealModelAnswer: question.sampleAnswer || question.idealAnswerRubric || `An exemplary answer articulates: 1) Theoretical definition in ${programmingLanguage}; 2) Practical production trade-offs; and 3) Quantitative outcomes.`,
    conceptStudyLinks: [
      { title: `${coreCompetency} Masterclass`, topic: 'Interview Preparation' },
      { title: `${programmingLanguage} Architecture`, topic: 'Technical Standards' }
    ],
    followUpSuggestions: [
      `How does this approach change under extreme concurrency in ${programmingLanguage}?`,
      'What failure modes have you encountered when deploying this in production?'
    ]
  };
}

function parseResumeHeuristically(text, targetRole) {
  const commonSkills = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'Express',
    'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Git',
    'CI/CD', 'GraphQL', 'REST APIs', 'System Design', 'Agile', 'Machine Learning', 'Linux'
  ];

  const foundSkills = commonSkills.filter(skill =>
    new RegExp(`\\b${skill.replace('+', '\\+')}\\b`, 'i').test(text)
  );

  const missingSkills = ['Docker', 'System Design', 'CI/CD', 'Kubernetes', 'Cloud Infrastructure']
    .filter(s => !foundSkills.includes(s))
    .slice(0, 4);

  return {
    candidateName: text.match(/^([A-Z][a-z]+\s+[A-Z][a-z]+)/m)?.[1] || 'Candidate',
    headline: `${targetRole} Specialist`,
    yearsOfExperience: text.match(/(\d+)\+?\s*years/i)?.[1] ? parseInt(RegExp.$1, 10) : 3,
    extractedSkills: foundSkills.length ? foundSkills : ['JavaScript', 'React', 'Problem Solving'],
    projects: [
      {
        title: 'Core Platform Engineering',
        techStack: foundSkills.slice(0, 3),
        summary: 'Designed and deployed responsive web services with automated testing.'
      }
    ],
    education: [
      { degree: 'B.S. in Computer Science', school: 'University Program', year: '2022' }
    ],
    missingRecommendedSkills: missingSkills,
    resumeQualityScore: Math.min(95, Math.max(60, 50 + foundSkills.length * 5)),
    actionableSuggestions: [
      'Quantify your project achievements using specific percentages or user counts.',
      'Highlight specific cloud architecture and containerization experience prominently.',
      'Ensure your GitHub or portfolio links are clearly visible at the top.'
    ]
  };
}

function matchJobDescriptionHeuristically(resumeText, jdText) {
  const resumeTokens = new Set((resumeText || '').toLowerCase().match(/[a-z0-9+#.]{2,}/g) || []);
  const jdTokens = [...new Set((jdText || '').toLowerCase().match(/[a-z0-9+#.]{2,}/g) || [])]
    .filter(t => !['the', 'and', 'with', 'for', 'you', 'will', 'this', 'that', 'from', 'our'].includes(t));

  const matched = jdTokens.filter(t => resumeTokens.has(t));
  const missing = jdTokens.filter(t => !resumeTokens.has(t)).slice(0, 8);

  const matchRatio = jdTokens.length ? matched.length / jdTokens.length : 0.65;
  const matchScore = Math.min(98, Math.max(45, Math.round(matchRatio * 100)));

  return {
    matchScore,
    matchedSkills: matched.slice(0, 10),
    missingSkills: missing.slice(0, 6),
    topMatchingStrengths: [
      'Strong overlap in foundational software engineering and programming competencies.',
      'Demonstrated experience with collaborative software development workflows.'
    ],
    criticalGaps: missing.slice(0, 3).map(m => `Experience with: ${m}`),
    customInterviewQuestions: [
      `How have you used ${matched[0] || 'core technologies'} in a production environment?`,
      `This role requires familiarity with ${missing[0] || 'modern cloud paradigms'}. How would you get up to speed?`,
      'Describe a project where you solved a performance bottleneck in your code.'
    ],
    recommendations: [
      missing.length ? `Incorporate keywords for ${missing.slice(0, 3).join(', ')} into your project descriptions.` : 'Align your resume bullet points with the core responsibilities in the JD.',
      'Prepare concrete STAR stories that highlight skills matching the top 3 requirements in the JD.'
    ]
  };
}

export { generateCuratedQuestions };
export const generateAdaptiveInterviewQuestions = generateInterviewQuestions;
