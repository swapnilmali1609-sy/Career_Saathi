/**
 * normalization.js (Server)
 * Centralized, deterministic normalization layer for interview configurations.
 * Replaces loose substring checks with exact and token-boundary alias resolution.
 */

import { ROLE_PROFILES } from './roleConfigs.js';
import { LANGUAGE_PROFILES } from './languageConfigs.js';

// Canonical Categories
export const VALID_CATEGORIES = [
  'TECHNICAL',
  'CODING',
  'BEHAVIORAL',
  'HR',
  'SYSTEM_DESIGN',
  'COMMUNICATION',
  'DOMAIN_SPECIFIC'
];

export const CATEGORY_ALIASES = {
  'tech': 'TECHNICAL',
  'technical': 'TECHNICAL',
  'technical interview': 'TECHNICAL',
  'coding': 'CODING',
  'coding & logic': 'CODING',
  'programming': 'CODING',
  'algorithm': 'CODING',
  'behavioral': 'BEHAVIORAL',
  'behavioral (star)': 'BEHAVIORAL',
  'star': 'BEHAVIORAL',
  'hr': 'HR',
  'hr & culture': 'HR',
  'culture': 'HR',
  'system design': 'SYSTEM_DESIGN',
  'system_design': 'SYSTEM_DESIGN',
  'system design & architecture': 'SYSTEM_DESIGN',
  'architecture': 'SYSTEM_DESIGN',
  'communication': 'COMMUNICATION',
  'communication & pitch': 'COMMUNICATION',
  'domain': 'DOMAIN_SPECIFIC',
  'domain-specific': 'DOMAIN_SPECIFIC',
  'domain_specific': 'DOMAIN_SPECIFIC'
};

// Canonical Difficulties
export const VALID_DIFFICULTIES = [
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED',
  'EXPERT'
];

export const DIFFICULTY_ALIASES = {
  'beginner': 'BEGINNER',
  'intern': 'BEGINNER',
  'junior': 'BEGINNER',
  'entry': 'BEGINNER',
  'intermediate': 'INTERMEDIATE',
  'mid': 'INTERMEDIATE',
  'mid-level': 'INTERMEDIATE',
  'advanced': 'ADVANCED',
  'senior': 'ADVANCED',
  'lead': 'ADVANCED',
  'staff': 'ADVANCED',
  'expert': 'EXPERT',
  'principal': 'EXPERT'
};

/**
 * Clean and standardize string for matching
 */
function cleanString(str = '') {
  return String(str).trim().toLowerCase().replace(/[\s\-_]+/g, ' ');
}

/**
 * Deterministically normalize Job Role
 * @param {string} roleInput
 * @param {string} [domainInput]
 * @returns {{ isValid: boolean, roleId: string, roleTitle: string, roleProfile: object, error: string|null }}
 */
export function normalizeRole(roleInput = '', domainInput = '') {
  if (!roleInput || typeof roleInput !== 'string' || !roleInput.trim()) {
    return {
      isValid: false,
      roleId: null,
      roleTitle: null,
      roleProfile: null,
      error: 'Job role is required and cannot be empty.'
    };
  }

  const cleanRole = cleanString(roleInput);
  const cleanDomain = cleanString(domainInput);

  // 1. Direct key match
  if (ROLE_PROFILES[cleanRole]) {
    const prof = ROLE_PROFILES[cleanRole];
    return {
      isValid: true,
      id: prof.id,
      roleId: prof.id,
      canonicalId: prof.id,
      title: prof.title,
      roleTitle: prof.title,
      roleProfile: prof,
      error: null
    };
  }

  // 2. Exact match against aliases
  for (const [key, prof] of Object.entries(ROLE_PROFILES)) {
    const aliases = prof.aliases.map(a => cleanString(a));
    if (aliases.includes(cleanRole)) {
      return {
        isValid: true,
        id: prof.id,
        roleId: prof.id,
        canonicalId: prof.id,
        title: prof.title,
        roleTitle: prof.title,
        roleProfile: prof,
        error: null
      };
    }
  }

  // 3. Word boundary regex match on cleanRole
  // Ordered by specificity (e.g. Full Stack before Software Engineer, SDET/QA before generic)
  const rolePriority = [
    'qa_automation_sdet',
    'frontend_developer',
    'devops_cloud_engineer',
    'cybersecurity_analyst',
    'data_scientist',
    'system_architect',
    'fullstack_developer',
    'software_engineer'
  ];

  for (const key of rolePriority) {
    const prof = ROLE_PROFILES[key];
    if (!prof) continue;
    for (const alias of prof.aliases) {
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(^|\\b)${escaped}(\\b|$)`, 'i');
      if (regex.test(cleanRole)) {
        return {
          isValid: true,
          id: prof.id,
          roleId: prof.id,
          canonicalId: prof.id,
          title: prof.title,
          roleTitle: prof.title,
          roleProfile: prof,
          error: null
        };
      }
    }
  }

  // 4. Domain-assisted fallback if role is generic (e.g. "Engineer", "Developer")
  if (/^(engineer|developer|specialist|lead|analyst|architect)$/i.test(cleanRole)) {
    if (cleanDomain.includes('frontend') || cleanDomain.includes('web') || cleanDomain.includes('ui')) {
      return { isValid: true, roleId: 'frontend_developer', roleTitle: ROLE_PROFILES.frontend_developer.title, roleProfile: ROLE_PROFILES.frontend_developer, error: null };
    }
    if (cleanDomain.includes('qa') || cleanDomain.includes('testing') || cleanDomain.includes('quality')) {
      return { isValid: true, roleId: 'qa_automation_sdet', roleTitle: ROLE_PROFILES.qa_automation_sdet.title, roleProfile: ROLE_PROFILES.qa_automation_sdet, error: null };
    }
    if (cleanDomain.includes('devops') || cleanDomain.includes('cloud') || cleanDomain.includes('sre')) {
      return { isValid: true, roleId: 'devops_cloud_engineer', roleTitle: ROLE_PROFILES.devops_cloud_engineer.title, roleProfile: ROLE_PROFILES.devops_cloud_engineer, error: null };
    }
    if (cleanDomain.includes('data') || cleanDomain.includes('machine learning') || cleanDomain.includes('ai')) {
      return { isValid: true, roleId: 'data_scientist', roleTitle: ROLE_PROFILES.data_scientist.title, roleProfile: ROLE_PROFILES.data_scientist, error: null };
    }
    if (cleanDomain.includes('security') || cleanDomain.includes('cyber')) {
      return { isValid: true, roleId: 'cybersecurity_analyst', roleTitle: ROLE_PROFILES.cybersecurity_analyst.title, roleProfile: ROLE_PROFILES.cybersecurity_analyst, error: null };
    }
    if (cleanDomain.includes('architect') || cleanDomain.includes('system design')) {
      return { isValid: true, roleId: 'system_architect', roleTitle: ROLE_PROFILES.system_architect.title, roleProfile: ROLE_PROFILES.system_architect, error: null };
    }
    if (cleanDomain.includes('full stack') || cleanDomain.includes('fullstack')) {
      return { isValid: true, roleId: 'fullstack_developer', roleTitle: ROLE_PROFILES.fullstack_developer.title, roleProfile: ROLE_PROFILES.fullstack_developer, error: null };
    }
  }

  // If cannot resolve safely, return clear validation error
  return {
    isValid: false,
    roleId: null,
    roleTitle: null,
    roleProfile: null,
    error: `Unrecognized or unsupported job role: "${roleInput}". Supported roles include Frontend Developer, Backend / Core SDE, Data Scientist, DevOps & Cloud Engineer, Cybersecurity Analyst, QA Automation SDET, Full Stack Developer, and System Architect.`
  };
}

/**
 * Deterministically normalize Programming Language
 * @param {string} langInput
 * @returns {{ isValid: boolean, languageId: string, languageName: string, languageProfile: object, error: string|null }}
 */
export function normalizeProgrammingLanguage(langInput = '') {
  if (!langInput || typeof langInput !== 'string' || !langInput.trim()) {
    return {
      isValid: false,
      languageId: null,
      languageName: null,
      languageProfile: null,
      error: 'Programming language is required for technical and coding interview calibrations.'
    };
  }

  const cleanLang = cleanString(langInput);

  // 1. Direct ID match
  if (LANGUAGE_PROFILES[cleanLang]) {
    const prof = LANGUAGE_PROFILES[cleanLang];
    return {
      isValid: true,
      id: prof.id,
      languageId: prof.id,
      canonicalId: prof.id,
      name: prof.name,
      languageName: prof.name,
      languageProfile: prof,
      error: null
    };
  }

  // 2. Exact match against aliases
  for (const [key, prof] of Object.entries(LANGUAGE_PROFILES)) {
    const aliases = (prof.aliases || []).map(a => cleanString(a));
    if (cleanString(prof.name) === cleanLang || aliases.includes(cleanLang)) {
      return {
        isValid: true,
        id: prof.id,
        languageId: prof.id,
        canonicalId: prof.id,
        name: prof.name,
        languageName: prof.name,
        languageProfile: prof,
        error: null
      };
    }
  }

  // 3. Strict token-boundary match (avoid substring traps like 'c' matching 'python')
  for (const [key, prof] of Object.entries(LANGUAGE_PROFILES)) {
    const candidates = [prof.name, ...(prof.aliases || [])];
    for (const cand of candidates) {
      const cleanCand = cleanString(cand);
      if (cleanCand.length < 2 && cleanLang !== cleanCand) continue; // single letter like 'c' must be exact
      const escaped = cleanCand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(^|\\b)${escaped}(\\b|$)`, 'i');
      if (regex.test(cleanLang)) {
        return {
          isValid: true,
          id: prof.id,
          languageId: prof.id,
          canonicalId: prof.id,
          name: prof.name,
          languageName: prof.name,
          languageProfile: prof,
          error: null
        };
      }
    }
  }

  // 4. Custom clean alphanumeric language fallback if explicitly provided
  const sanitizedCustom = langInput.trim();
  if (/^[a-zA-Z0-9#+.\s]{2,30}$/.test(sanitizedCustom)) {
    const customId = sanitizedCustom.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const customProfile = {
      id: customId,
      name: sanitizedCustom,
      icon: '💻',
      badge: `${sanitizedCustom} Specialist`,
      color: '#6366f1',
      aliases: [sanitizedCustom.toLowerCase()],
      corePillars: [
        `Core Syntax, Idioms & Standard Library of ${sanitizedCustom}`,
        `Memory Management, Allocation & Resource Cleanup in ${sanitizedCustom}`,
        `Concurrency, Threading & Asynchronous Patterns in ${sanitizedCustom}`,
        `Error Handling, Exceptions & Diagnostic Logging in ${sanitizedCustom}`,
        `Performance Profiling, Optimization & Tooling for ${sanitizedCustom}`
      ],
      allowedTopics: [sanitizedCustom, `${sanitizedCustom} syntax`, `${sanitizedCustom} concurrency`, `${sanitizedCustom} memory`],
      prohibitedTopics: [],
      strictInstruction: `Calibrate technical questions, code snippets, and implementation discussions specifically to the syntax, semantics, and standard patterns of ${sanitizedCustom}.`,
      questions: []
    };
    return {
      isValid: true,
      id: customId,
      languageId: customId,
      canonicalId: customId,
      name: sanitizedCustom,
      languageName: sanitizedCustom,
      languageProfile: customProfile,
      error: null
    };
  }

  return {
    isValid: false,
    id: null,
    languageId: null,
    canonicalId: null,
    name: null,
    languageName: null,
    languageProfile: null,
    error: `Unrecognized or invalid programming language: "${langInput}". Please select a supported language (e.g. JavaScript, Python, TypeScript, Java, C++, Go, C#, Rust, SQL, Kotlin, Swift, PHP, Ruby).`
  };
}

/**
 * Deterministically normalize Category
 * @param {string} catInput
 * @returns {{ isValid: boolean, category: string, error: string|null }}
 */
export function normalizeCategory(catInput = 'TECHNICAL') {
  if (!catInput || typeof catInput !== 'string') {
    return { isValid: true, category: 'TECHNICAL', error: null };
  }

  const clean = cleanString(catInput);
  if (VALID_CATEGORIES.includes(clean.toUpperCase())) {
    return { isValid: true, category: clean.toUpperCase(), error: null };
  }

  if (CATEGORY_ALIASES[clean]) {
    return { isValid: true, category: CATEGORY_ALIASES[clean], error: null };
  }

  return {
    isValid: false,
    category: null,
    error: `Invalid interview category: "${catInput}". Supported categories: ${VALID_CATEGORIES.join(', ')}.`
  };
}

/**
 * Deterministically normalize Difficulty
 * @param {string} diffInput
 * @returns {{ isValid: boolean, difficulty: string, error: string|null }}
 */
export function normalizeDifficulty(diffInput = 'INTERMEDIATE') {
  if (!diffInput || typeof diffInput !== 'string') {
    return { isValid: true, difficulty: 'INTERMEDIATE', error: null };
  }

  const clean = cleanString(diffInput);
  if (VALID_DIFFICULTIES.includes(clean.toUpperCase())) {
    return { isValid: true, difficulty: clean.toUpperCase(), error: null };
  }

  if (DIFFICULTY_ALIASES[clean]) {
    return { isValid: true, difficulty: DIFFICULTY_ALIASES[clean], error: null };
  }

  return {
    isValid: false,
    difficulty: null,
    error: `Invalid difficulty level: "${diffInput}". Supported levels: ${VALID_DIFFICULTIES.join(', ')}.`
  };
}

/**
 * Normalize Domain
 * @param {string} domainInput
 * @param {string} [roleTitle]
 * @returns {string|String}
 */
export function normalizeDomain(domainInput = '', roleTitle = '') {
  let resolved = 'Software Development';
  if (domainInput && typeof domainInput === 'string' && domainInput.trim()) {
    resolved = domainInput.trim();
  } else if (roleTitle.toLowerCase().includes('frontend')) {
    resolved = 'Frontend Engineering (Web & UI)';
  } else if (roleTitle.toLowerCase().includes('data')) {
    resolved = 'Artificial Intelligence & Machine Learning';
  } else if (roleTitle.toLowerCase().includes('devops') || roleTitle.toLowerCase().includes('cloud')) {
    resolved = 'Cloud & DevOps Engineering';
  } else if (roleTitle.toLowerCase().includes('security')) {
    resolved = 'Cybersecurity & InfoSec';
  } else if (roleTitle.toLowerCase().includes('qa') || roleTitle.toLowerCase().includes('test')) {
    resolved = 'QA Automation & SDET';
  } else if (roleTitle.toLowerCase().includes('architect')) {
    resolved = 'System Design & Distributed Architecture';
  }

  const canonicalId = resolved.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const result = new String(resolved);
  result.isValid = true;
  result.id = canonicalId;
  result.canonicalId = canonicalId;
  result.name = resolved;
  result.domainName = resolved;
  return result;
}
