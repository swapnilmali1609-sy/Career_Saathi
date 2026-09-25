/**
 * languages.js (Client)
 * Supported programming languages for technical interview calibration.
 */

export const PROGRAMMING_LANGUAGES = [
  {
    id: 'python',
    name: 'Python',
    icon: '🐍',
    badge: 'Python Specialist',
    tag: 'Data Science, AI & Backend',
    color: '#38bdf8',
    popular: true,
    summary: 'GIL, memory management, asyncio, generators, dataclasses & Pythonic architecture.'
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: '⚡',
    badge: 'JavaScript Specialist',
    tag: 'Web Engines & Node.js',
    color: '#facc15',
    popular: true,
    summary: 'Event Loop, microtasks, V8 garbage collection, closures & Node.js streams.'
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: '🔷',
    badge: 'TypeScript Specialist',
    tag: 'Type-Safe Fullstack',
    color: '#60a5fa',
    popular: true,
    summary: 'Conditional types, infer keyword, discriminated unions & compile-time safety.'
  },
  {
    id: 'java',
    name: 'Java',
    icon: '☕',
    badge: 'Java / JVM Specialist',
    tag: 'Enterprise & Systems',
    color: '#f97316',
    popular: true,
    summary: 'JVM internals, G1/ZGC, Java Memory Model, virtual threads & Spring architecture.'
  },
  {
    id: 'cpp',
    name: 'C++',
    icon: '⚙️',
    badge: 'C++ Systems Specialist',
    tag: 'Low-Latency & Systems',
    color: '#a855f7',
    popular: true,
    summary: 'RAII, smart pointers, move semantics, vtables & zero-cost abstractions.'
  },
  {
    id: 'golang',
    name: 'Go (Golang)',
    icon: '🐹',
    badge: 'Go Systems Specialist',
    tag: 'Cloud Native & Microservices',
    color: '#06b6d4',
    popular: true,
    summary: 'Goroutines, GMP scheduler, channels, memory escape analysis & sync.Pool.'
  },
  {
    id: 'csharp',
    name: 'C# (.NET)',
    icon: '🎯',
    badge: 'C# / .NET Specialist',
    tag: 'Enterprise & Cloud',
    color: '#818cf8',
    popular: true,
    summary: 'CLR GC, async state machines, Span<T>, LINQ & ASP.NET Core architecture.'
  },
  {
    id: 'rust',
    name: 'Rust',
    icon: '🦀',
    badge: 'Rust Systems Specialist',
    tag: 'Memory-Safe Systems',
    color: '#f87171',
    popular: true,
    summary: 'Ownership, borrow checker, lifetimes, Send/Sync & interior mutability.'
  },
  {
    id: 'sql',
    name: 'SQL & Databases',
    icon: '🗄️',
    badge: 'Database Specialist',
    tag: 'RDBMS & Query Optimization',
    color: '#10b981',
    popular: false,
    summary: 'Execution plans, composite indexing, MVCC, vacuuming & transaction isolation.'
  },
  {
    id: 'kotlin',
    name: 'Kotlin',
    icon: '📱',
    badge: 'Kotlin Specialist',
    tag: 'Android & Modern JVM',
    color: '#a855f7',
    popular: false,
    summary: 'Coroutines, null safety, inline functions, flows & JVM interoperability.'
  },
  {
    id: 'swift',
    name: 'Swift',
    icon: '🍏',
    badge: 'Swift Specialist',
    tag: 'iOS & Apple Ecosystem',
    color: '#f43f5e',
    popular: false,
    summary: 'ARC memory management, actors, Swift concurrency, protocols & value types.'
  },
  {
    id: 'php',
    name: 'PHP',
    icon: '🐘',
    badge: 'PHP Specialist',
    tag: 'Modern Web & Laravel',
    color: '#818cf8',
    popular: false,
    summary: 'Zend engine, opcache, PHP 8+ attributes, fibers & Laravel architecture.'
  },
  {
    id: 'ruby',
    name: 'Ruby',
    icon: '💎',
    badge: 'Ruby Specialist',
    tag: 'Ruby on Rails & Web',
    color: '#ef4444',
    popular: false,
    summary: 'YJIT compilation, GIL, blocks/procs/lambdas, metaprogramming & Rails patterns.'
  }
];

import { getRoleProfile } from './roleConfigs.js';

export const ROLE_LANGUAGES_CONFIG = {
  frontend_developer: {
    defaultLanguage: 'JavaScript',
    popularLanguages: ['javascript', 'typescript'],
    allowedLanguages: ['javascript', 'typescript']
  },
  data_scientist: {
    defaultLanguage: 'Python',
    popularLanguages: ['python', 'sql'],
    allowedLanguages: ['python', 'sql', 'cpp']
  },
  devops_cloud_engineer: {
    defaultLanguage: 'Go (Golang)',
    popularLanguages: ['golang', 'python'],
    allowedLanguages: ['golang', 'python', 'rust']
  },
  cybersecurity_analyst: {
    defaultLanguage: 'Python',
    popularLanguages: ['python', 'cpp', 'golang'],
    allowedLanguages: ['python', 'cpp', 'golang', 'rust', 'sql']
  },
  qa_automation_sdet: {
    defaultLanguage: 'Java',
    popularLanguages: ['java', 'python', 'javascript'],
    allowedLanguages: ['java', 'python', 'javascript', 'typescript', 'csharp']
  },
  system_architect: {
    defaultLanguage: 'Java',
    popularLanguages: ['java', 'golang', 'cpp'],
    allowedLanguages: ['java', 'golang', 'cpp', 'rust', 'csharp', 'python', 'sql']
  },
  fullstack_developer: {
    defaultLanguage: 'TypeScript',
    popularLanguages: ['typescript', 'javascript', 'python'],
    allowedLanguages: ['typescript', 'javascript', 'python', 'java', 'csharp', 'golang', 'php', 'ruby', 'sql']
  },
  software_engineer: {
    defaultLanguage: 'Java',
    popularLanguages: ['java', 'python', 'golang', 'cpp'],
    allowedLanguages: ['java', 'python', 'golang', 'cpp', 'csharp', 'rust', 'typescript', 'javascript', 'php', 'ruby', 'sql']
  }
};

/**
 * Retrieve only the programming languages strictly calibrated for the selected role
 */
export function getLanguagesForRole(role = '', domain = '') {
  const cleanRole = String(role || '').toLowerCase();

  // Mobile specific roles
  if (cleanRole.includes('android')) {
    const list = ['kotlin', 'java'];
    return PROGRAMMING_LANGUAGES.filter(l => list.includes(l.id)).map(l => ({
      ...l,
      popular: true
    }));
  }
  if (cleanRole.includes('ios') || cleanRole.includes('swift')) {
    return PROGRAMMING_LANGUAGES.filter(l => l.id === 'swift').map(l => ({
      ...l,
      popular: true
    }));
  }
  if (cleanRole.includes('mobile') || cleanRole.includes('react native') || cleanRole.includes('flutter')) {
    const list = ['typescript', 'javascript', 'kotlin', 'swift'];
    return PROGRAMMING_LANGUAGES.filter(l => list.includes(l.id)).map(l => ({
      ...l,
      popular: ['typescript', 'javascript'].includes(l.id)
    }));
  }

  const roleProfile = getRoleProfile(role, domain);
  const config = ROLE_LANGUAGES_CONFIG[roleProfile?.id] || ROLE_LANGUAGES_CONFIG.software_engineer;

  const allowedIds = new Set(config.allowedLanguages);
  const popularIds = new Set(config.popularLanguages);

  const matched = PROGRAMMING_LANGUAGES
    .filter(l => allowedIds.has(l.id))
    .map(l => ({
      ...l,
      popular: popularIds.has(l.id)
    }));

  return matched.length > 0 ? matched : PROGRAMMING_LANGUAGES;
}

/**
 * Automatically determine the most fitting default programming language based on target role
 */
export function getDefaultLanguageForRole(role = '', domain = '') {
  const cleanRole = String(role || '').toLowerCase();

  if (cleanRole.includes('android')) return 'Kotlin';
  if (cleanRole.includes('ios') || cleanRole.includes('swift')) return 'Swift';
  if (cleanRole.includes('mobile')) return 'TypeScript';

  const roleProfile = getRoleProfile(role, domain);
  const config = ROLE_LANGUAGES_CONFIG[roleProfile?.id] || ROLE_LANGUAGES_CONFIG.software_engineer;
  return config.defaultLanguage || 'Python';
}

/**
 * Check whether a programming language is valid/calibrated for the chosen role
 */
export function isLanguageAllowedForRole(langNameOrId = '', role = '', domain = '') {
  if (!langNameOrId) return false;
  const allowed = getLanguagesForRole(role, domain);
  const clean = langNameOrId.trim().toLowerCase();
  return allowed.some(l => l.id === clean || l.name.toLowerCase() === clean);
}

/**
 * Resolve language item by name or id with deterministic matching
 */
export function getLanguageProfile(lang = '') {
  if (!lang) return PROGRAMMING_LANGUAGES[0];
  const clean = lang.trim().toLowerCase();

  // 1. Direct ID or Name match
  const exact = PROGRAMMING_LANGUAGES.find(
    l => l.id === clean || l.name.toLowerCase() === clean
  );
  if (exact) return exact;

  // 2. Alias match
  const aliasMap = {
    'js': 'javascript',
    'node': 'javascript',
    'nodejs': 'javascript',
    'ts': 'typescript',
    'py': 'python',
    'python3': 'python',
    'c++': 'cpp',
    'golang': 'golang',
    'go': 'golang',
    'c#': 'csharp',
    'dotnet': 'csharp',
    '.net': 'csharp',
    'postgres': 'sql',
    'postgresql': 'sql',
    'mysql': 'sql',
    'kt': 'kotlin',
    'rb': 'ruby',
    'rails': 'ruby'
  };

  if (aliasMap[clean]) {
    const found = PROGRAMMING_LANGUAGES.find(l => l.id === aliasMap[clean]);
    if (found) return found;
  }

  // 3. Token-boundary match
  for (const l of PROGRAMMING_LANGUAGES) {
    const escaped = l.name.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|\\b)${escaped}(\\b|$)`, 'i');
    if (regex.test(clean)) return l;
  }

  return {
    id: clean.replace(/[^a-z0-9]/gi, '_'),
    name: lang.trim(),
    icon: '💻',
    badge: `${lang.trim()} Specialist`,
    tag: 'Custom Language',
    color: '#6366f1',
    summary: `Calibrating questions to the syntax, idioms, and architecture of ${lang.trim()}.`
  };
}
