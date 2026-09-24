/**
 * questionValidator.js (Server)
 * Comprehensive post-generation question validation layer.
 * Strictly verifies role relevance, language constraints, category alignment,
 * difficulty depth, prohibited topics, and prevents duplicates.
 */

import { getRoleProfile } from '../config/roleConfigs.js';
import { getLanguageProfile } from '../config/languageConfigs.js';

const QUESTION_STOP_WORDS = new Set([
  'the', 'and', 'how', 'from', 'between', 'for', 'with', 'that', 'this',
  'are', 'was', 'were', 'what', 'why', 'who', 'does', 'explain', 'describe',
  'which', 'when', 'where', 'can', 'you', 'your', 'about', 'into', 'differ', 'difference'
]);

/**
 * Tokenize and normalize text for similarity checking
 */
function tokenizeText(text = '') {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !QUESTION_STOP_WORDS.has(w));
}

/**
 * Calculate Jaccard similarity between two text strings
 */
export function calculateTextSimilarity(textA = '', textB = '') {
  const setA = new Set(tokenizeText(textA));
  const setB = new Set(tokenizeText(textB));
  if (setA.size === 0 || setB.size === 0) return 0;

  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

/**
 * Validate a single interview question against the authoritative session configuration
 * @param {object} question
 * @param {object} sessionConfig
 * @returns {{ isValid: boolean, reasons: string[] }}
 */
export function validateQuestion(question, sessionConfig = {}) {
  const reasons = [];
  if (!question || typeof question !== 'object') {
    return { isValid: false, reasons: ['Question must be a valid object.'] };
  }

  const promptText = (question.questionText || question.title || '').trim();
  if (promptText.length < 20) {
    reasons.push(`Question prompt too brief (${promptText.length} characters). Must be at least 20 characters.`);
  }

  const role = sessionConfig.targetRole || 'Software Engineer';
  const roleProfile = sessionConfig.roleProfile || getRoleProfile(role, sessionConfig.domain || '');
  const langName = sessionConfig.programmingLanguage || 'Python';
  const langProfile = sessionConfig.languageProfile || getLanguageProfile(langName);
  const category = (sessionConfig.category || 'TECHNICAL').toUpperCase();
  const difficulty = (sessionConfig.difficulty || 'INTERMEDIATE').toUpperCase();

  const promptLower = promptText.toLowerCase();
  const topicsLower = (question.topics || []).map(t => String(t).toLowerCase());
  const combinedInspection = `${promptLower} ${topicsLower.join(' ')}`;

  // 1. ROLE RELEVANCE & PROHIBITED TOPICS (Section 5)
  if (roleProfile) {
    // Prohibited topics / anti-keywords check
    const prohibited = [
      ...(roleProfile.prohibitedTopics || []),
      ...(roleProfile.anti_keywords || [])
    ];

    for (const forbidden of prohibited) {
      const cleanForbidden = forbidden.toLowerCase().trim();
      if (!cleanForbidden) continue;
      // Word boundary match
      const escaped = cleanForbidden.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(^|\\b)${escaped}(\\b|$)`, 'i');
      if (regex.test(combinedInspection)) {
        reasons.push(`ROLE_PROHIBITED_TOPIC: Violates prohibited topic for role "${roleProfile.title}": contains forbidden concept "${cleanForbidden}".`);
        break;
      }
    }

    // Explicit role metadata match if present
    if (question.role) {
      const qRoleLower = String(question.role).toLowerCase();
      const profTitleLower = roleProfile.title.toLowerCase();
      const profIdLower = roleProfile.id.toLowerCase();
      const roleAliases = (roleProfile.aliases || []).map(a => a.toLowerCase());
      const roleMatches = qRoleLower === profTitleLower ||
                          qRoleLower === profIdLower ||
                          roleAliases.some(a => qRoleLower.includes(a) || a.includes(qRoleLower));
      if (!roleMatches) {
        reasons.push(`ROLE_IRRELEVANT: Question role metadata "${question.role}" does not match locked session role "${roleProfile.title}".`);
      }
    }
  }

  // 2. PROGRAMMING LANGUAGE ENFORCEMENT (Section 6 & 7)
  // Hard constraint for TECHNICAL and CODING categories
  if (category === 'TECHNICAL' || category === 'CODING') {
    if (langProfile) {
      // Prohibited language topics
      const forbiddenLangs = langProfile.prohibitedTopics || [];
      for (const forbidden of forbiddenLangs) {
        const cleanForbidden = forbidden.toLowerCase().trim();
        if (!cleanForbidden) continue;
        const escaped = cleanForbidden.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(^|\\b)${escaped}(\\b|$)`, 'i');
        if (regex.test(combinedInspection)) {
          reasons.push(`LANGUAGE_CONTAMINATION: Violates programming language constraint: question mentions "${cleanForbidden}" which is prohibited when selected language is ${langProfile.name}.`);
          break;
        }
      }

      // Cross-language foreign signature detection
      const foreignSignatures = {
        python: ['python', 'gil', 'global interpreter lock', 'cpython', 'pydantic', 'celery'],
        java: ['jvm', 'java bytecode', 'g1 gc', 'zgc', 'spring boot'],
        cpp: ['c++ pointers', 'raii', 'vtable', 'unique_ptr', 'shared_ptr'],
        golang: ['goroutine', 'goroutines', 'go channels'],
        rust: ['rust borrow checker', 'cargo clippy'],
        swift: ['swiftui', 'swift arc']
      };

      const currentLangId = langProfile.id;
      for (const [foreignLangId, sigs] of Object.entries(foreignSignatures)) {
        if (foreignLangId === currentLangId) continue;
        if ((currentLangId === 'javascript' && foreignLangId === 'typescript') ||
            (currentLangId === 'typescript' && foreignLangId === 'javascript')) {
          continue;
        }
        for (const sig of sigs) {
          const escaped = sig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`(^|\\b)${escaped}(\\b|$)`, 'i');
          if (regex.test(combinedInspection)) {
            reasons.push(`LANGUAGE_CONTAMINATION: Question contains foreign language technology "${sig}" (${foreignLangId}) which violates isolation for ${langProfile.name}.`);
            break;
          }
        }
      }

      // Explicit language metadata match if present
      if (question.programmingLanguage) {
        const qLangLower = String(question.programmingLanguage).toLowerCase();
        const lNameLower = langProfile.name.toLowerCase();
        const lIdLower = langProfile.id.toLowerCase();
        const lAliases = (langProfile.aliases || []).map(a => a.toLowerCase());
        const langMatches = qLangLower === lNameLower ||
                            qLangLower === lIdLower ||
                            lAliases.some(a => qLangLower === a || qLangLower.includes(a));
        if (!langMatches) {
          reasons.push(`LANGUAGE_CONTAMINATION: Question programming language metadata "${question.programmingLanguage}" does not match locked language "${langProfile.name}".`);
        }
      }
    }
  }

  // 3. CATEGORY ENFORCEMENT (Section 8)
  if (category === 'HR') {
    // HR interviews must focus on culture, motivation, teamwork, conflict. Must NOT test deep technical internals.
    const deepTechIndicators = [
      'v8 engine', 'garbage collection', 'kubernetes', 'terraform', 'b-tree',
      'cap theorem', 'memory leaks', 'cgroups', 'wireshark', 'asyncio', 'multiprocessing'
    ];
    for (const tech of deepTechIndicators) {
      if (promptLower.includes(tech)) {
        reasons.push(`HR category violation: question asks technical deep dive "${tech}". HR questions must focus on workplace behavior, communication, and fit.`);
        break;
      }
    }
  } else if (category === 'BEHAVIORAL') {
    // Behavioral questions should evaluate situational experiences, conflict, leadership, or STAR scenarios
    const pureCodeSyntaxIndicators = [
      'write a function', 'syntax of', 'implement a class that extends', 'big-o time complexity of'
    ];
    for (const ind of pureCodeSyntaxIndicators) {
      if (promptLower.includes(ind)) {
        reasons.push(`Behavioral category violation: question asks for pure code implementation ("${ind}"). Behavioral track requires situational STAR scenarios.`);
        break;
      }
    }
  } else if (category === 'CODING') {
    // Coding questions should demand implementation, algorithm, or data structure problem solving
    if (!promptLower.includes('write') &&
        !promptLower.includes('implement') &&
        !promptLower.includes('function') &&
        !promptLower.includes('code') &&
        !promptLower.includes('algorithm') &&
        !promptLower.includes('complexity') &&
        !promptLower.includes('data structure')) {
      reasons.push(`Coding category question should involve code implementation or algorithmic problem solving.`);
    }
  }

  // 4. DIFFICULTY LEVEL CHECK (Section 9)
  if (question.difficulty) {
    const qDiff = String(question.difficulty).toUpperCase();
    const validDiffs = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];
    if (validDiffs.includes(qDiff) && validDiffs.includes(difficulty)) {
      // Flag gross mismatches (e.g. EXPERT question when user chose BEGINNER)
      if (difficulty === 'BEGINNER' && qDiff === 'EXPERT') {
        reasons.push(`Difficulty mismatch: candidate chose BEGINNER but question is marked as EXPERT.`);
      }
    }
  }

  return {
    isValid: reasons.length === 0,
    reasons
  };
}

/**
 * Validate an entire batch of questions, checking both individual constraints
 * and cross-question duplicate prevention (Section 18).
 * @param {Array<object>} questions
 * @param {object} sessionConfig
 * @returns {{ validQuestions: Array<object>, rejectedQuestions: Array<{ question: object, reasons: string[] }> }}
 */
export function validateQuestionBatch(questions = [], sessionConfig = {}) {
  if (!Array.isArray(questions)) {
    return { validQuestions: [], rejectedQuestions: [] };
  }

  const validQuestions = [];
  const rejectedQuestions = [];

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const validation = validateQuestion(q, sessionConfig);

    if (!validation.isValid) {
      rejectedQuestions.push({ question: q, reasons: validation.reasons });
      continue;
    }

    // Duplicate Prevention Check within this batch (Section 18)
    const currentText = q.questionText || q.title || '';
    let isDuplicate = false;

    for (const existing of validQuestions) {
      const existingText = existing.questionText || existing.title || '';
      // Exact check
      if (currentText.trim().toLowerCase() === existingText.trim().toLowerCase()) {
        isDuplicate = true;
        rejectedQuestions.push({
          question: q,
          reasons: [`DUPLICATE: Exact duplicate of question ${existing.orderIndex || 'already in batch'}.`]
        });
        break;
      }

      // Near-duplicate check using Jaccard token similarity
      const similarity = calculateTextSimilarity(currentText, existingText);
      if (similarity >= 0.60) {
        isDuplicate = true;
        rejectedQuestions.push({
          question: q,
          reasons: [`DUPLICATE: Near duplicate (similarity ${(similarity * 100).toFixed(0)}%) of question ${existing.orderIndex || 'already in batch'}.`]
        });
        break;
      }
    }

    if (!isDuplicate) {
      validQuestions.push(q);
    }
  }

  return { validQuestions, rejectedQuestions };
}
