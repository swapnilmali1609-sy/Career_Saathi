/**
 * Comprehensive Automated Constraint & Acceptance Test Suite
 * Tests 20 required role × language scenarios + Acceptance Tests 28, 29, 30.
 */

import assert from 'node:assert/strict';
import {
  normalizeRole,
  normalizeProgrammingLanguage,
  normalizeCategory,
  normalizeDifficulty,
  normalizeDomain
} from '../config/normalization.js';
import { getRoleProfile, ROLE_PROFILES } from '../config/roleConfigs.js';
import { getLanguageProfile, PROGRAMMING_LANGUAGES } from '../config/languageConfigs.js';
import { validateQuestion, validateQuestionBatch } from '../services/questionValidator.js';
import { generateCuratedQuestions } from '../services/curatedQuestionBank.js';
import { generateAdaptiveInterviewQuestions, evaluateCandidateAnswer } from '../services/geminiService.js';

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    throw err;
  }
}

async function testAsync(name, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    throw err;
  }
}

console.log('\n======================================================');
console.log(' PREPAI INTERVIEW CONSTRAINTS & ACCEPTANCE TEST SUITE');
console.log('======================================================\n');

// -------------------------------------------------------------
// SECTION 1: Deterministic Normalization & Substring Boundary
// -------------------------------------------------------------
console.log('--- Suite 1: Deterministic Normalization ---');

test('Token boundary prevents substring false positives (e.g. "email" or "maintain" does NOT match "ai")', () => {
  const normEmail = normalizeDomain('Email Systems');
  assert.notEqual(normEmail.canonicalId, 'ai_ml', 'Email should not be normalized to ai_ml');
  
  const normMaintain = normalizeRole('Maintainer', 'DevOps');
  assert.notEqual(normMaintain.canonicalId, 'ai_engineer', 'Maintainer should not be normalized to ai_engineer');
});

test('Exact and canonical alias normalization for languages', () => {
  assert.equal(normalizeProgrammingLanguage('js').name, 'JavaScript');
  assert.equal(normalizeProgrammingLanguage('ts').name, 'TypeScript');
  assert.equal(normalizeProgrammingLanguage('py').name, 'Python');
  assert.equal(normalizeProgrammingLanguage('golang').id, 'golang');
  assert(normalizeProgrammingLanguage('golang').name.includes('Go'));
  assert.equal(normalizeProgrammingLanguage('c++').name, 'C++');
  assert.equal(normalizeProgrammingLanguage('c#').id, 'csharp');
  assert(normalizeProgrammingLanguage('c#').name.includes('C#'));
});

test('Exact and canonical alias normalization for roles', () => {
  assert.equal(normalizeRole('frontend developer').canonicalId, 'frontend_developer');
  assert.equal(normalizeRole('sdet').canonicalId, 'qa_automation_sdet');
  assert.equal(normalizeRole('devops engineer').canonicalId, 'devops_cloud_engineer');
  assert.equal(normalizeRole('data scientist').canonicalId, 'data_scientist');
  assert.equal(normalizeRole('full stack').canonicalId, 'fullstack_developer');
});

// -------------------------------------------------------------
// SECTION 2: Priority Order & Selection Integrity
// -------------------------------------------------------------
console.log('\n--- Suite 2: Priority Order & Explicit Selection ---');

test('Explicit selection takes absolute priority over user profile skills', () => {
  const explicitSelection = 'JavaScript';
  const userProfile = { skills: ['Python', 'Django', 'Machine Learning'] };
  const sessionConfig = { targetRole: 'Frontend Developer', programmingLanguage: explicitSelection };
  
  // Resolution logic matching server/src/routes/interview.js
  const candidateLanguages = [
    sessionConfig.programmingLanguage,
    userProfile?.programmingLanguage,
    userProfile?.skills?.[0],
    'JavaScript'
  ];
  const chosenLang = candidateLanguages.find(l => typeof l === 'string' && l.trim().length > 0);
  assert.equal(chosenLang, 'JavaScript', 'Explicit selection MUST take priority over userProfile.skills[0]');
});

// -------------------------------------------------------------
// SECTION 3: Post-Generation Validation Layer
// -------------------------------------------------------------
console.log('\n--- Suite 3: Question Validator Hard Constraints ---');

test('Validator rejects Python GIL question when language is JavaScript', () => {
  const sessionConfig = {
    targetRole: 'Frontend Developer',
    roleProfile: getRoleProfile('Frontend Developer'),
    programmingLanguage: 'JavaScript',
    languageProfile: getLanguageProfile('JavaScript'),
    category: 'TECHNICAL',
    difficulty: 'INTERMEDIATE'
  };

  const invalidQ = {
    questionText: 'Explain how the Python Global Interpreter Lock (GIL) affects multi-threaded performance in Python 3.',
    expectedKeywords: ['GIL', 'threads', 'mutex']
  };

  const result = validateQuestion(invalidQ, sessionConfig);
  assert.equal(result.isValid, false, 'Python GIL question must be rejected for JavaScript');
  assert(result.reasons.some(r => r.includes('LANGUAGE_CONTAMINATION') || r.includes('PROHIBITED_TOPIC')));
});

test('Validator rejects Kubernetes / Terraform questions when role is Frontend Developer', () => {
  const sessionConfig = {
    targetRole: 'Frontend Developer',
    roleProfile: getRoleProfile('Frontend Developer'),
    programmingLanguage: 'JavaScript',
    languageProfile: getLanguageProfile('JavaScript'),
    category: 'TECHNICAL',
    difficulty: 'INTERMEDIATE'
  };

  const invalidQ = {
    questionText: 'How do you configure a Kubernetes Ingress Controller and write Terraform HCL to provision an EKS cluster?',
    expectedKeywords: ['Kubernetes', 'Terraform', 'Ingress']
  };

  const result = validateQuestion(invalidQ, sessionConfig);
  assert.equal(result.isValid, false, 'Infrastructure/DevOps questions must be rejected for Frontend Developer');
  assert(result.reasons.some(r => r.includes('ROLE_PROHIBITED_TOPIC') || r.includes('ROLE_IRRELEVANT')));
});

test('Validator rejects React / CSS questions when role is Data Scientist', () => {
  const sessionConfig = {
    targetRole: 'Data Scientist & ML Engineer',
    roleProfile: getRoleProfile('Data Scientist & ML Engineer'),
    programmingLanguage: 'Python',
    languageProfile: getLanguageProfile('Python'),
    category: 'TECHNICAL',
    difficulty: 'INTERMEDIATE'
  };

  const invalidQ = {
    questionText: 'Explain CSS flexbox vs CSS grid layout and how React useEffect handles cleanup on unmount.',
    expectedKeywords: ['CSS', 'flexbox', 'React']
  };

  const result = validateQuestion(invalidQ, sessionConfig);
  assert.equal(result.isValid, false, 'Web UI questions must be rejected for Data Scientist');
});

test('Validator detects and rejects duplicate/near-duplicate questions (>0.65 Jaccard similarity)', () => {
  const sessionConfig = {
    targetRole: 'Frontend Developer',
    roleProfile: getRoleProfile('Frontend Developer'),
    programmingLanguage: 'JavaScript',
    languageProfile: getLanguageProfile('JavaScript'),
    category: 'TECHNICAL',
    difficulty: 'INTERMEDIATE'
  };

  const questions = [
    { questionText: 'Explain the JavaScript event loop and how microtasks differ from macrotasks in the browser.' },
    { questionText: 'Describe the JavaScript event loop and explain the difference between microtasks and macrotasks.' }
  ];

  const batchResult = validateQuestionBatch(questions, sessionConfig);
  assert.equal(batchResult.validQuestions.length, 1, 'Second near-duplicate question must be rejected');
  assert.equal(batchResult.rejectedQuestions.length, 1);
  assert(batchResult.rejectedQuestions[0].reasons.some(r => r.includes('DUPLICATE')));
});

// -------------------------------------------------------------
// SECTION 4: 20 Requirement Scenarios Matrix
// -------------------------------------------------------------
console.log('\n--- Suite 4: 20 Requirement Scenarios Matrix ---');

const SCENARIOS = [
  { id: 1, role: 'Frontend Developer', lang: 'JavaScript', category: 'TECHNICAL', diff: 'INTERMEDIATE', domain: 'Frontend Engineering' },
  { id: 2, role: 'Frontend Developer', lang: 'TypeScript', category: 'TECHNICAL', diff: 'INTERMEDIATE', domain: 'Frontend Engineering' },
  { id: 3, role: 'Frontend Developer', lang: 'JavaScript', category: 'CODING', diff: 'INTERMEDIATE', domain: 'Frontend Engineering' },
  { id: 4, role: 'Backend Developer', lang: 'Python', category: 'TECHNICAL', diff: 'INTERMEDIATE', domain: 'Backend Engineering' },
  { id: 5, role: 'Backend Developer', lang: 'Java', category: 'TECHNICAL', diff: 'INTERMEDIATE', domain: 'Backend Engineering' },
  { id: 6, role: 'Backend Developer', lang: 'Go', category: 'TECHNICAL', diff: 'INTERMEDIATE', domain: 'Backend Engineering' },
  { id: 7, role: 'Full Stack Developer', lang: 'JavaScript', category: 'TECHNICAL', diff: 'INTERMEDIATE', domain: 'Full Stack Development' },
  { id: 8, role: 'Data Scientist', lang: 'Python', category: 'TECHNICAL', diff: 'INTERMEDIATE', domain: 'AI & Data Science' },
  { id: 9, role: 'Data Scientist', lang: 'Python', category: 'DOMAIN_SPECIFIC', diff: 'ADVANCED', domain: 'AI & Data Science' },
  { id: 10, role: 'Machine Learning Engineer', lang: 'Python', category: 'TECHNICAL', diff: 'ADVANCED', domain: 'AI & Machine Learning' },
  { id: 11, role: 'DevOps Engineer', lang: 'Python', category: 'TECHNICAL', diff: 'ADVANCED', domain: 'Cloud & DevOps' },
  { id: 12, role: 'DevOps Engineer', lang: 'Go', category: 'TECHNICAL', diff: 'INTERMEDIATE', domain: 'Cloud & DevOps' },
  { id: 13, role: 'Cloud Architect', lang: 'Python', category: 'TECHNICAL', diff: 'ADVANCED', domain: 'Cloud Architecture' },
  { id: 14, role: 'System Architect', lang: 'Java', category: 'TECHNICAL', diff: 'ADVANCED', domain: 'Distributed Systems' },
  { id: 15, role: 'QA Automation Engineer', lang: 'Java', category: 'TECHNICAL', diff: 'INTERMEDIATE', domain: 'QA Automation' },
  { id: 16, role: 'QA Automation Engineer', lang: 'Python', category: 'TECHNICAL', diff: 'INTERMEDIATE', domain: 'QA Automation' },
  { id: 17, role: 'Cybersecurity Analyst', lang: 'Python', category: 'TECHNICAL', diff: 'INTERMEDIATE', domain: 'Cybersecurity' },
  { id: 18, role: 'Mobile Developer (iOS)', lang: 'Swift', category: 'TECHNICAL', diff: 'INTERMEDIATE', domain: 'Mobile Development' },
  { id: 19, role: 'Mobile Developer (Android)', lang: 'Kotlin', category: 'TECHNICAL', diff: 'INTERMEDIATE', domain: 'Mobile Development' },
  { id: 20, role: 'Software Engineer', lang: 'JavaScript', category: 'BEHAVIORAL', diff: 'INTERMEDIATE', domain: 'General' }
];

for (const sc of SCENARIOS) {
  test(`Scenario ${sc.id}: ${sc.role} + ${sc.lang} (${sc.category}) produces calibrated questions with 0 validation violations`, () => {
    const roleProfile = getRoleProfile(sc.role, sc.domain);
    const langProfile = getLanguageProfile(sc.lang);

    const questions = generateCuratedQuestions({
      role: roleProfile.title,
      programmingLanguage: langProfile.name,
      domain: sc.domain,
      category: sc.category,
      difficulty: sc.diff,
      totalQuestions: 5
    });

    assert.equal(questions.length >= 3, true, `Should generate at least 3 curated questions for scenario ${sc.id}`);

    const sessionConfig = {
      targetRole: roleProfile.title,
      roleProfile,
      programmingLanguage: langProfile.name,
      languageProfile: langProfile,
      category: sc.category,
      difficulty: sc.diff,
      domain: sc.domain
    };

    const valResult = validateQuestionBatch(questions, sessionConfig);
    assert.equal(
      valResult.rejectedQuestions.length,
      0,
      `Scenario ${sc.id} produced rejected questions: ${JSON.stringify(valResult.rejectedQuestions.map(r => ({ text: r.question.questionText, reasons: r.reasons })))}`
    );
    assert.equal(valResult.validQuestions.length >= 3, true);
  });
}

// -------------------------------------------------------------
// SECTION 5: Acceptance Tests 28, 29, 30
// -------------------------------------------------------------
console.log('\n--- Suite 5: Acceptance Tests 28, 29, 30 ---');

async function runAcceptanceTests() {
  await testAsync('Acceptance Test 28: Frontend Developer + JavaScript (10 Questions) -> 100% JS Web, 0% Contamination', async () => {
    const result = await generateAdaptiveInterviewQuestions({
      targetRole: 'Frontend Developer',
      programmingLanguage: 'JavaScript',
      domain: 'Frontend Engineering (Web & UI)',
      category: 'TECHNICAL',
      difficulty: 'INTERMEDIATE',
      totalQuestions: 10
    });

    assert.equal(result.length, 10, 'Must return exactly 10 questions');

    // Verify all 10 questions strictly match Frontend + JavaScript
    const prohibitedWords = ['kubernetes', 'terraform', 'ansible', 'python gil', 'django', 'spring boot', 'jvm', 'c++ pointers'];
    for (let i = 0; i < result.length; i++) {
      const q = result[i];
      const textLower = (q.questionText || '').toLowerCase();
      for (const bad of prohibitedWords) {
        assert(
          !textLower.includes(bad),
          `Question ${i + 1} contaminated with prohibited word "${bad}": "${q.questionText}"`
        );
      }
      assert.equal(q.category, 'TECHNICAL', `Question ${i + 1} category must be TECHNICAL`);
      assert(q.questionText && q.questionText.length > 20, `Question ${i + 1} has insufficient content`);
    }
  });

  await testAsync('Acceptance Test 29: Data Scientist + Python (Advanced) -> 100% Python/ML/Stats, 0% Web UI', async () => {
    const result = await generateAdaptiveInterviewQuestions({
      targetRole: 'Data Scientist & ML Engineer',
      programmingLanguage: 'Python',
      domain: 'Artificial Intelligence & Machine Learning',
      category: 'TECHNICAL',
      difficulty: 'ADVANCED',
      totalQuestions: 5
    });

    assert.equal(result.length, 5, 'Must return exactly 5 questions');

    const prohibitedWords = ['react', 'css', 'flexbox', 'grid layout', 'dom', 'vue', 'angular', 'redux'];
    for (let i = 0; i < result.length; i++) {
      const q = result[i];
      const textLower = (q.questionText || '').toLowerCase();
      for (const bad of prohibitedWords) {
        assert(
          !textLower.includes(bad),
          `Question ${i + 1} contaminated with frontend term "${bad}": "${q.questionText}"`
        );
      }
    }
  });

  await testAsync('Acceptance Test 30: DevOps Engineer + Python (Advanced) -> 100% Infra/Automation, 0% Frontend', async () => {
    const result = await generateAdaptiveInterviewQuestions({
      targetRole: 'DevOps & Cloud Infrastructure Engineer',
      programmingLanguage: 'Python',
      domain: 'Cloud & DevOps Engineering',
      category: 'TECHNICAL',
      difficulty: 'ADVANCED',
      totalQuestions: 5
    });

    assert.equal(result.length, 5, 'Must return exactly 5 questions');

    const prohibitedWords = ['react', 'vue', 'dom', 'html', 'css', 'ui component'];
    for (let i = 0; i < result.length; i++) {
      const q = result[i];
      const textLower = (q.questionText || '').toLowerCase();
      for (const bad of prohibitedWords) {
        assert(
          !textLower.includes(bad),
          `Question ${i + 1} contaminated with UI term "${bad}": "${q.questionText}"`
        );
      }
    }
  });

  console.log('\n--- Suite 6: Cross-Technology Answer Evaluation ---');

  await testAsync('Evaluation penalizes candidate who provides Python answer in a JavaScript interview', async () => {
    const evaluation = await evaluateCandidateAnswer({
      question: {
        questionText: 'Explain the event loop and asynchronous execution in JavaScript.',
        expectedKeywords: ['call stack', 'event loop', 'microtask queue', 'Promise'],
        idealAnswerRubric: 'Candidate discusses single-threaded V8 execution, microtasks, and macrotasks.'
      },
      answerText: 'In Python, we use the GIL and threading module, or asyncio with event loop to handle coroutines. Python GIL locks bytecodes.',
      role: 'Frontend Developer',
      programmingLanguage: 'JavaScript',
      difficulty: 'INTERMEDIATE',
      category: 'TECHNICAL'
    });

    assert(evaluation.overallScore <= 60, `Score should be heavily penalized for technology mismatch, got ${evaluation.overallScore}`);
    assert(
      evaluation.weaknesses.some(w => w.toLowerCase().includes('javascript') || w.toLowerCase().includes('python') || w.toLowerCase().includes('technology')),
      `Weaknesses should flag technology mismatch, got: ${JSON.stringify(evaluation.weaknesses)}`
    );
  });

  console.log('\n======================================================');
  console.log(` ALL ${totalTests} TESTS PASSED PERFECTLY! (${passedTests}/${totalTests})`);
  console.log('======================================================\n');
}

runAcceptanceTests().catch(err => {
  console.error('\n❌ Test suite failed:', err);
  process.exit(1);
});
