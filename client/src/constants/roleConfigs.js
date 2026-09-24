/**
 * roleConfigs.js (Client)
 * Single source of truth for role-based interview calibrations.
 * Aligned with server-side role calibrations.
 */

export const ROLE_PROFILES = {
  frontend_developer: {
    id: "frontend_developer",
    title: "Frontend Developer / UI Engineer",
    badge: "Frontend Track",
    color: "#3b82f6",
    aliases: [
      "frontend",
      "front-end",
      "frontend developer",
      "front-end developer",
      "ui engineer",
      "ui developer",
      "react developer",
      "web developer",
      "javascript developer",
      "vue developer",
      "angular developer",
      "client engineer"
    ],
    core_pillars: [
      "Virtual DOM Reconciliation & React Fiber Architecture",
      "Core Web Vitals (LCP, INP, CLS) & Browser Rendering Performance",
      "Frontend State Management (Context API vs Zustand vs Redux)",
      "CSS Layout Engines: Flexbox vs CSS Grid & Stacking Contexts",
      "Client-Side Security: Mitigating XSS, CSRF & Content Security Policy (CSP)",
      "Asynchronous UI, Microtasks & DOM Event Delegation"
    ],
    corePillars: [
      "Virtual DOM Reconciliation & React Fiber Architecture",
      "Core Web Vitals (LCP, INP, CLS) & Browser Rendering Performance",
      "Frontend State Management (Context API vs Zustand vs Redux)",
      "CSS Layout Engines: Flexbox vs CSS Grid & Stacking Contexts",
      "Client-Side Security: Mitigating XSS, CSRF & Content Security Policy (CSP)",
      "Asynchronous UI, Microtasks & DOM Event Delegation"
    ],
    allowedTopics: [
      "DOM manipulation", "Virtual DOM", "Browser rendering", "Event loop", "React",
      "State management", "Core Web Vitals", "CSS Flexbox/Grid", "XSS/CSP"
    ],
    prohibitedTopics: [
      "python gil", "jvm", "spring boot", "kubernetes", "terraform", "data science"
    ],
    strict_instruction: (
      "Focus strictly on browser runtime internals, component architecture, " +
      "web performance, and state management. Avoid backend infrastructure questions."
    ),
    strictInstruction: (
      "Focus strictly on browser runtime internals, component architecture, " +
      "web performance, and state management. Avoid backend infrastructure questions."
    )
  },

  software_engineer: {
    id: "software_engineer",
    title: "Software Development Engineer (Backend / Core)",
    badge: "Backend & Core SDE",
    color: "#06b6d4",
    aliases: [
      "software engineer",
      "backend engineer",
      "backend",
      "back-end",
      "software development engineer",
      "core engineer",
      "systems developer",
      "sde",
      "backend developer",
      "back-end developer",
      "api developer",
      "server engineer"
    ],
    core_pillars: [
      "Data Structures & Algorithms (Time/Space trade-offs)",
      "System Design & Scalability (Caching, Partitioning, CAP theorem)",
      "Concurrency, Threading & Memory Management",
      "Database Internals (ACID, Indexes, B-Trees vs LSM)",
      "Clean Code, API Design, and Error Handling"
    ],
    corePillars: [
      "Data Structures & Algorithms (Time/Space trade-offs)",
      "System Design & Scalability (Caching, Partitioning, CAP theorem)",
      "Concurrency, Threading & Memory Management",
      "Database Internals (ACID, Indexes, B-Trees vs LSM)",
      "Clean Code, API Design, and Error Handling"
    ],
    allowedTopics: [
      "data structures", "concurrency", "database indexing", "caching", "rest/grpc apis"
    ],
    prohibitedTopics: ["css flexbox", "virtual dom", "core web vitals", "react fiber"],
    strict_instruction: (
      "Focus strictly on core computer science fundamentals, backend logic, " +
      "and distributed system principles. Avoid soft-skill questions."
    ),
    strictInstruction: (
      "Focus strictly on core computer science fundamentals, backend logic, " +
      "and distributed system principles. Avoid soft-skill questions."
    )
  },

  fullstack_developer: {
    id: "fullstack_developer",
    title: "Full Stack Developer",
    badge: "Full Stack Track",
    color: "#6366f1",
    aliases: [
      "full stack",
      "fullstack",
      "full-stack",
      "full stack developer",
      "fullstack developer",
      "full-stack developer",
      "full stack engineer",
      "fullstack engineer"
    ],
    core_pillars: [
      "Full-Stack Security: Mitigating CSRF, XSS, and SQL Injection",
      "Stateful Sessions vs Stateless JWT: Pros, Cons & Revocation",
      "End-to-End API Design & Data Flow",
      "Database Indexing & Caching Strategies",
      "Frontend Component Architecture & Real-Time Sync"
    ],
    corePillars: [
      "Full-Stack Security: Mitigating CSRF, XSS, and SQL Injection",
      "Stateful Sessions vs Stateless JWT: Pros, Cons & Revocation",
      "End-to-End API Design & Data Flow",
      "Database Indexing & Caching Strategies",
      "Frontend Component Architecture & Real-Time Sync"
    ],
    allowedTopics: [
      "rest api", "jwt", "database indexing", "react", "caching", "full-stack security"
    ],
    prohibitedTopics: ["kernel tuning", "transformer self-attention", "kolmogorov-smirnov"],
    strict_instruction: (
      "Focus on full-stack architecture, API integration, auth mechanics, and database persistence."
    ),
    strictInstruction: (
      "Focus on full-stack architecture, API integration, auth mechanics, and database persistence."
    )
  },

  data_scientist: {
    id: "data_scientist",
    title: "Data Scientist & ML Engineer",
    badge: "Data & AI Track",
    color: "#f59e0b",
    aliases: [
      "data scientist",
      "ml engineer",
      "machine learning engineer",
      "ai engineer",
      "data science",
      "deep learning",
      "artificial intelligence",
      "ml scientist",
      "nlp engineer"
    ],
    core_pillars: [
      "Statistical Inference, Hypothesis Testing & Probability Distributions",
      "Core ML Algorithms (Loss functions, Optimization, Bias-Variance trade-off)",
      "Feature Engineering & Data Leakage Prevention",
      "Model Evaluation Metrics (PR Curves, ROC-AUC, F1 in imbalanced regimes)",
      "Productionization & Model Drift Monitoring"
    ],
    corePillars: [
      "Statistical Inference, Hypothesis Testing & Probability Distributions",
      "Core ML Algorithms (Loss functions, Optimization, Bias-Variance trade-off)",
      "Feature Engineering & Data Leakage Prevention",
      "Model Evaluation Metrics (PR Curves, ROC-AUC, F1 in imbalanced regimes)",
      "Productionization & Model Drift Monitoring"
    ],
    allowedTopics: [
      "statistics", "machine learning", "feature engineering", "roc-auc", "model drift", "pandas"
    ],
    prohibitedTopics: ["css flexbox", "virtual dom", "react fiber", "kubernetes ingress"],
    strict_instruction: (
      "Focus strictly on statistical validity, mathematical underpinnings of ML, " +
      "and production nuances. Challenge assumptions on metrics."
    ),
    strictInstruction: (
      "Focus strictly on statistical validity, mathematical underpinnings of ML, " +
      "and production nuances. Challenge assumptions on metrics."
    )
  },

  devops_cloud_engineer: {
    id: "devops_cloud_engineer",
    title: "DevOps & Cloud Infrastructure Engineer",
    badge: "DevOps & SRE Track",
    color: "#8b5cf6",
    aliases: [
      "devops",
      "cloud engineer",
      "infrastructure engineer",
      "sre",
      "site reliability engineer",
      "platform engineer",
      "cloud infrastructure",
      "devops engineer"
    ],
    core_pillars: [
      "CI/CD Pipelines, Rollback Strategies & Blast Radius Mitigation",
      "Container Orchestration & Internals (Kubernetes cgroups, networking, ingress)",
      "Infrastructure as Code (State management, drift detection)",
      "Cloud Security & Networking (VPC, Subnets, IAM least-privilege)",
      "Site Reliability Engineering (SLI/SLO, Prometheus/Grafana, Chaos Engineering)"
    ],
    corePillars: [
      "CI/CD Pipelines, Rollback Strategies & Blast Radius Mitigation",
      "Container Orchestration & Internals (Kubernetes cgroups, networking, ingress)",
      "Infrastructure as Code (State management, drift detection)",
      "Cloud Security & Networking (VPC, Subnets, IAM least-privilege)",
      "Site Reliability Engineering (SLI/SLO, Prometheus/Grafana, Chaos Engineering)"
    ],
    allowedTopics: [
      "ci/cd", "kubernetes", "docker", "terraform", "cloud networking", "sli/slo", "monitoring"
    ],
    prohibitedTopics: ["react fiber", "css flexbox", "virtual dom", "data drift"],
    strict_instruction: (
      "Focus strictly on resilience, automated deployments, zero-downtime operations, " +
      "and systems reliability."
    ),
    strictInstruction: (
      "Focus strictly on resilience, automated deployments, zero-downtime operations, " +
      "and systems reliability."
    )
  },

  cybersecurity_analyst: {
    id: "cybersecurity_analyst",
    title: "Information Security & Cyber Defense Analyst",
    badge: "Security Track",
    color: "#ef4444",
    aliases: [
      "cybersecurity",
      "security analyst",
      "security engineer",
      "infosec",
      "cyber defense",
      "penetration tester",
      "appsec",
      "information security",
      "soc analyst"
    ],
    core_pillars: [
      "Network Defense & Packet Analysis (TCP handshakes, Wireshark, DNS exploits)",
      "Threat Modeling & OWASP Top 10 Application Vulnerabilities",
      "Cryptographic Fundamentals (Public key infra, hashing, salt/pepper, TLS)",
      "Incident Response, Forensics, and Threat Hunting (SIEM, log analysis)",
      "Access Controls & Zero Trust Architecture"
    ],
    corePillars: [
      "Network Defense & Packet Analysis (TCP handshakes, Wireshark, DNS exploits)",
      "Threat Modeling & OWASP Top 10 Application Vulnerabilities",
      "Cryptographic Fundamentals (Public key infra, hashing, salt/pepper, TLS)",
      "Incident Response, Forensics, and Threat Hunting (SIEM, log analysis)",
      "Access Controls & Zero Trust Architecture"
    ],
    allowedTopics: [
      "owasp top 10", "network defense", "wireshark", "cryptography", "incident response", "siem"
    ],
    prohibitedTopics: ["css flexbox", "virtual dom", "react fiber", "core web vitals"],
    strict_instruction: (
      "Focus strictly on attack vectors, defense in depth, exploit mechanics, " +
      "and triage workflows."
    ),
    strictInstruction: (
      "Focus strictly on attack vectors, defense in depth, exploit mechanics, " +
      "and triage workflows."
    )
  },

  qa_automation_sdet: {
    id: "qa_automation_sdet",
    title: "QA Automation & SDET / Software Test Engineer",
    badge: "QA & SDET Track",
    color: "#10b981",
    aliases: [
      "qa",
      "test",
      "sdet",
      "automation engineer",
      "test engineer",
      "qa engineer",
      "quality assurance",
      "qa automation",
      "software test engineer"
    ],
    core_pillars: [
      "Test Automation Framework Architecture (Page Object Model & Fixtures)",
      "Mitigating Flaky Tests & Asynchronous Race Conditions in CI/CD",
      "Black-Box Test Design (Boundary Value Analysis & Equivalence Partitioning)",
      "API & Integration Testing (Consumer-Driven Contracts with Pact)",
      "Performance, Load, Spike & Stress Testing with k6 / JMeter"
    ],
    corePillars: [
      "Test Automation Framework Architecture (Page Object Model & Fixtures)",
      "Mitigating Flaky Tests & Asynchronous Race Conditions in CI/CD",
      "Black-Box Test Design (Boundary Value Analysis & Equivalence Partitioning)",
      "API & Integration Testing (Consumer-Driven Contracts with Pact)",
      "Performance, Load, Spike & Stress Testing with k6 / JMeter"
    ],
    allowedTopics: [
      "test automation", "page object model", "selenium", "playwright", "bva", "api testing", "k6"
    ],
    prohibitedTopics: ["css flexbox", "react fiber", "sharding", "snowflake id"],
    strict_instruction: (
      "Focus strictly on test design techniques, framework architecture, " +
      "flakiness elimination, defect triage, and automated CI/CD quality gates."
    ),
    strictInstruction: (
      "Focus strictly on test design techniques, framework architecture, " +
      "flakiness elimination, defect triage, and automated CI/CD quality gates."
    )
  },

  system_architect: {
    id: "system_architect",
    title: "System Architect / Principal Engineer",
    badge: "Architecture Track",
    color: "#ec4899",
    aliases: [
      "system architect",
      "solutions architect",
      "principal engineer",
      "staff engineer",
      "system design",
      "systems architect"
    ],
    core_pillars: [
      "Distributed 64-bit Unique ID Generator (Snowflake ID)",
      "Database Sharding vs Read Replicas & Partitioning",
      "CAP Theorem & Distributed Consensus in Distributed Systems",
      "Transactional Outbox Pattern & Change Data Capture (CDC)",
      "Multi-Tier Caching & Consistency Architecture"
    ],
    corePillars: [
      "Distributed 64-bit Unique ID Generator (Snowflake ID)",
      "Database Sharding vs Read Replicas & Partitioning",
      "CAP Theorem & Distributed Consensus in Distributed Systems",
      "Transactional Outbox Pattern & Change Data Capture (CDC)",
      "Multi-Tier Caching & Consistency Architecture"
    ],
    allowedTopics: [
      "system design", "distributed systems", "sharding", "cap theorem", "caching patterns", "cdc"
    ],
    prohibitedTopics: ["css flexbox", "bva", "virtual dom", "cumulative layout shift"],
    strict_instruction: (
      "Focus strictly on high-level system architecture, distributed trade-offs, " +
      "failure modes, and scalability bottlenecks."
    ),
    strictInstruction: (
      "Focus strictly on high-level system architecture, distributed trade-offs, " +
      "failure modes, and scalability bottlenecks."
    )
  }
};

/**
 * Resolve a role string and domain to its corresponding ROLE_PROFILE using deterministic matching
 */
export function getRoleProfile(role = '', domain = '') {
  const cleanRole = (role || '').trim().toLowerCase();
  const cleanDomain = (domain || '').trim().toLowerCase();

  // 1. Direct ID match
  if (ROLE_PROFILES[cleanRole]) {
    return ROLE_PROFILES[cleanRole];
  }

  // 2. Exact match on aliases
  for (const key of Object.keys(ROLE_PROFILES)) {
    const prof = ROLE_PROFILES[key];
    if (prof.aliases.some(alias => alias.toLowerCase() === cleanRole)) {
      return prof;
    }
  }

  // 3. Word-boundary regex match against aliases (ordered by specificity)
  const priorityKeys = [
    'qa_automation_sdet',
    'frontend_developer',
    'devops_cloud_engineer',
    'cybersecurity_analyst',
    'data_scientist',
    'system_architect',
    'fullstack_developer',
    'software_engineer'
  ];

  for (const key of priorityKeys) {
    const prof = ROLE_PROFILES[key];
    for (const alias of prof.aliases) {
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(^|\\b)${escaped}(\\b|$)`, 'i');
      if (regex.test(cleanRole)) {
        return prof;
      }
    }
  }

  // 4. Domain-assisted fallback for generic titles
  if (cleanRole.includes('front') || cleanRole.includes('react') || cleanRole.includes('ui') || cleanDomain.includes('frontend')) {
    return ROLE_PROFILES.frontend_developer;
  }
  if (cleanRole.includes('data') || cleanRole.includes('machine learning') || cleanRole.includes('ml') || cleanRole.includes('ai') || cleanDomain.includes('data') || cleanDomain.includes('machine learning')) {
    return ROLE_PROFILES.data_scientist;
  }
  if (cleanRole.includes('devops') || cleanRole.includes('cloud') || cleanRole.includes('sre') || cleanRole.includes('infra') || cleanDomain.includes('devops') || cleanDomain.includes('cloud')) {
    return ROLE_PROFILES.devops_cloud_engineer;
  }
  if (cleanRole.includes('security') || cleanRole.includes('cyber') || cleanRole.includes('infosec') || cleanDomain.includes('cybersecurity')) {
    return ROLE_PROFILES.cybersecurity_analyst;
  }
  if (cleanRole.includes('qa') || cleanRole.includes('test') || cleanRole.includes('sdet') || cleanDomain.includes('testing') || cleanDomain.includes('qa')) {
    return ROLE_PROFILES.qa_automation_sdet;
  }
  if (cleanRole.includes('architect') || cleanRole.includes('principal') || cleanRole.includes('system design') || cleanDomain.includes('system design')) {
    return ROLE_PROFILES.system_architect;
  }
  if (cleanRole.includes('full stack') || cleanRole.includes('fullstack')) {
    return ROLE_PROFILES.fullstack_developer;
  }

  return ROLE_PROFILES.software_engineer;
}
