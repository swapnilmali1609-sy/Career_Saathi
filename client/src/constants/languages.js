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

/**
 * Automatically determine the most fitting default programming language based on target role
 */
export function getDefaultLanguageForRole(role = '', domain = '') {
  const text = `${role} ${domain}`.toLowerCase();

  if (text.includes('data') || text.includes('ai') || text.includes('ml') || text.includes('machine learning')) {
    return 'Python';
  }
  if (text.includes('front') || text.includes('ui') || text.includes('web') || text.includes('react')) {
    return 'TypeScript';
  }
  if (text.includes('devops') || text.includes('cloud') || text.includes('sre') || text.includes('infrastructure')) {
    return 'Go (Golang)';
  }
  if (text.includes('security') || text.includes('cyber') || text.includes('infosec')) {
    return 'Python';
  }
  if (text.includes('qa') || text.includes('test') || text.includes('sdet')) {
    return 'Python';
  }
  if (text.includes('system') || text.includes('embedded') || text.includes('kernel') || text.includes('performance')) {
    return 'C++';
  }
  if (text.includes('android') || text.includes('mobile')) {
    return 'Kotlin';
  }
  if (text.includes('ios')) {
    return 'Swift';
  }

  return 'Python';
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
