/**
 * roleConfigs.js (Server)
 * Single source of truth for role-based interview calibrations.
 * Contains core pillars, allowed topics, prohibited topics, and strict instructions.
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
    corePillars: [
      "Virtual DOM Reconciliation & React Fiber Architecture",
      "Core Web Vitals (LCP, INP, CLS) & Browser Rendering Performance",
      "Frontend State Management (Context API vs Zustand vs Redux)",
      "CSS Layout Engines: Flexbox vs CSS Grid & Stacking Contexts",
      "Client-Side Security: Mitigating XSS, CSRF & Content Security Policy (CSP)",
      "Asynchronous UI, Microtasks & DOM Event Delegation",
      "Accessibility (a11y), Semantic HTML5 & Component Design Systems"
    ],
    core_pillars: [
      "Virtual DOM Reconciliation & React Fiber Architecture",
      "Core Web Vitals (LCP, INP, CLS) & Browser Rendering Performance",
      "Frontend State Management (Context API vs Zustand vs Redux)",
      "CSS Layout Engines: Flexbox vs CSS Grid & Stacking Contexts",
      "Client-Side Security: Mitigating XSS, CSRF & Content Security Policy (CSP)"
    ],
    allowedTopics: [
      "DOM manipulation",
      "virtual DOM",
      "browser rendering pipeline",
      "event loop and microtasks in browser",
      "react",
      "hooks",
      "state management",
      "core web vitals",
      "css flexbox",
      "css grid",
      "responsive design",
      "accessibility",
      "a11y",
      "xss",
      "csrf in browser",
      "csp",
      "browser storage",
      "service workers",
      "webpack",
      "vite",
      "bundle optimization",
      "code splitting",
      "tree shaking",
      "hydration",
      "server components (RSC)",
      "client-side routing"
    ],
    prohibitedTopics: [
      "python gil",
      "java garbage collection",
      "jvm",
      "spring boot",
      "kubernetes cluster",
      "kubernetes pod",
      "terraform",
      "aws vpc",
      "data science",
      "statistical inference",
      "roc-auc",
      "database sharding",
      "b-tree index internals",
      "snowflake id",
      "istio service mesh",
      "cgroups",
      "siem",
      "pcap analysis",
      "jmeter",
      "appium"
    ],
    anti_keywords: [
      "database indexing", "kubernetes pod", "snowflake id", "sharding",
      "pact broker", "jmeter", "b-tree", "connection pool", "scaled dot-product",
      "transformer", "istio", "flagger", "data drift", "concept drift", "smote",
      "bva", "boundary value analysis", "pgbouncer"
    ],
    strictInstruction: (
      "Focus strictly on browser runtime internals, component architecture, " +
      "web performance, DOM manipulation, client security, and state management. Never ask backend infrastructure, distributed sharding, or data science questions."
    ),
    strict_instruction: (
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
    corePillars: [
      "Data Structures & Algorithms (Time/Space complexity trade-offs)",
      "System Design & Scalability (Caching, Partitioning, CAP theorem)",
      "Concurrency, Multi-Threading, Race Conditions & Memory Management",
      "Database Internals (ACID, Indexes, B-Trees vs LSM, Connection Pools)",
      "Clean Architecture, API Design (REST/gRPC), Error Handling & Resilience"
    ],
    core_pillars: [
      "Data Structures & Algorithms (Time/Space trade-offs)",
      "System Design & Scalability (Caching, Partitioning, CAP theorem)",
      "Concurrency, Threading & Memory Management",
      "Database Internals (ACID, Indexes, B-Trees vs LSM)",
      "Clean Code, API Design, and Error Handling"
    ],
    allowedTopics: [
      "data structures",
      "algorithms",
      "concurrency",
      "threading",
      "async io",
      "database indexing",
      "acid transactions",
      "caching",
      "redis",
      "api design",
      "rest",
      "grpc",
      "microservices",
      "memory leaks",
      "garbage collection",
      "message queues",
      "kafka",
      "rabbitmq",
      "rate limiting",
      "connection pooling"
    ],
    prohibitedTopics: [
      "css flexbox",
      "css grid",
      "react fiber",
      "core web vitals",
      "virtual dom",
      "cumulative layout shift",
      "stacking context",
      "appium",
      "scaled dot-product",
      "transformer self-attention",
      "data drift",
      "concept drift"
    ],
    anti_keywords: [
      "css flexbox", "css grid", "react fiber", "appium espresso", "playwright pom",
      "core web vitals", "virtual dom", "cumulative layout shift", "scaled dot-product",
      "transformer self-attention", "data drift", "concept drift", "kolmogorov-smirnov",
      "bva", "boundary value"
    ],
    strictInstruction: (
      "Focus strictly on core computer science fundamentals, backend logic, " +
      "data structures, database internals, and distributed system principles. Avoid frontend UI questions."
    ),
    strict_instruction: (
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
    corePillars: [
      "End-to-End API Design, Contract-First Architecture & Data Flow",
      "Full-Stack Security: Mitigating CSRF, XSS, and SQL Injection",
      "Authentication Paradigms: Stateful Sessions vs Stateless JWT & Token Revocation",
      "Database Indexing, Caching Strategies & ORM Trade-offs",
      "Frontend Component Architecture, Server-Side Rendering & Real-Time Sync"
    ],
    core_pillars: [
      "Full-Stack Security: Mitigating CSRF, XSS, and SQL Injection",
      "Stateful Sessions vs Stateless JWT: Pros, Cons & Revocation",
      "End-to-End API Design & Data Flow",
      "Database Indexing & Caching Strategies",
      "Frontend Component Architecture & Real-Time Sync"
    ],
    allowedTopics: [
      "rest api",
      "graphql",
      "full-stack architecture",
      "jwt vs session",
      "cors",
      "csrf",
      "xss",
      "database querying",
      "orm optimization",
      "caching",
      "client state management",
      "ssr",
      "websockets",
      "component design"
    ],
    prohibitedTopics: [
      "kubernetes cgroups",
      "kernel tuning",
      "transformer self-attention",
      "kolmogorov-smirnov test",
      "wireshark pcap parsing",
      "packet sniffing"
    ],
    anti_keywords: [
      "kernel tuning", "transformer self-attention", "kolmogorov-smirnov"
    ],
    strictInstruction: (
      "Focus on end-to-end full stack architecture: bridging frontend UI components, secure REST/GraphQL APIs, authentication, and database queries. Balance client and server concerns."
    ),
    strict_instruction: (
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
      "nlp engineer",
      "computer vision engineer"
    ],
    corePillars: [
      "Statistical Inference, Hypothesis Testing, p-values & Probability Distributions",
      "Core ML Algorithms: Loss functions, Optimization (SGD/Adam), Bias-Variance trade-off",
      "Feature Engineering, Imbalanced Data (SMOTE) & Data Leakage Prevention",
      "Model Evaluation Metrics: PR Curves, ROC-AUC, F1, Log-Loss in imbalanced regimes",
      "Productionization, Model Serving, Monitoring & Detecting Data/Concept Drift"
    ],
    core_pillars: [
      "Statistical Inference, Hypothesis Testing & Probability Distributions",
      "Core ML Algorithms (Loss functions, Optimization, Bias-Variance trade-off)",
      "Feature Engineering & Data Leakage Prevention",
      "Model Evaluation Metrics (PR Curves, ROC-AUC, F1 in imbalanced regimes)",
      "Productionization & Model Drift Monitoring"
    ],
    allowedTopics: [
      "statistics",
      "hypothesis testing",
      "linear and logistic regression",
      "decision trees",
      "gradient boosting",
      "xgboost",
      "random forest",
      "neural networks",
      "feature engineering",
      "data leakage",
      "cross-validation",
      "roc-auc",
      "precision recall",
      "f1 score",
      "data preprocessing",
      "model drift",
      "concept drift",
      "pandas",
      "numpy",
      "scikit-learn",
      "pytorch",
      "tensorflow",
      "vectorization",
      "embeddings"
    ],
    prohibitedTopics: [
      "css flexbox",
      "css grid",
      "react fiber",
      "core web vitals",
      "virtual dom",
      "cumulative layout shift",
      "stacking context",
      "kubernetes ingress",
      "terraform state",
      "bva",
      "boundary value analysis",
      "selenium page object model"
    ],
    anti_keywords: [
      "css flexbox", "app actions", "appium espresso", "css grid", "flexbox",
      "react fiber", "concurrent rendering", "usetransition", "usedeferredvalue",
      "virtual dom", "cumulative layout shift", "stacking context", "pgbouncer", "istio"
    ],
    strictInstruction: (
      "Focus strictly on statistical validity, machine learning theory, data preprocessing, " +
      "feature engineering, metrics evaluation, and ML production nuances. Never ask frontend CSS/HTML or cloud infrastructure questions."
    ),
    strict_instruction: (
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
      "cloud architect",
      "devops engineer"
    ],
    corePillars: [
      "CI/CD Pipelines, Blue-Green / Canary Deployments & Blast Radius Mitigation",
      "Container Orchestration Internals (Kubernetes cgroups, kube-proxy, CNI, ingress)",
      "Infrastructure as Code (Terraform state locking, drift detection, modularity)",
      "Cloud Security & Networking (VPC peering, Subnets, Security Groups, IAM least-privilege)",
      "Site Reliability Engineering (SLI/SLO/SLA, Prometheus, Grafana, Distributed Tracing, Chaos Testing)"
    ],
    core_pillars: [
      "CI/CD Pipelines, Rollback Strategies & Blast Radius Mitigation",
      "Container Orchestration & Internals (Kubernetes cgroups, networking, ingress)",
      "Infrastructure as Code (State management, drift detection)",
      "Cloud Security & Networking (VPC, Subnets, IAM least-privilege)",
      "Site Reliability Engineering (SLI/SLO, Prometheus/Grafana, Chaos Engineering)"
    ],
    allowedTopics: [
      "ci/cd",
      "docker",
      "kubernetes",
      "helm",
      "terraform",
      "infrastructure as code",
      "cloud networking",
      "vpc",
      "iam",
      "observability",
      "prometheus",
      "grafana",
      "sli",
      "slo",
      "canary deployment",
      "blue-green",
      "zero-downtime",
      "chaos engineering",
      "bash",
      "automation scripting",
      "linux internals"
    ],
    prohibitedTopics: [
      "react fiber",
      "css flexbox",
      "css grid",
      "virtual dom",
      "core web vitals",
      "cumulative layout shift",
      "scaled dot-product",
      "transformer self-attention",
      "data drift",
      "concept drift",
      "kolmogorov-smirnov",
      "bva",
      "boundary value analysis"
    ],
    anti_keywords: [
      "react fiber", "css grid", "context api", "bva", "boundary value",
      "virtual dom", "cumulative layout shift", "scaled dot-product",
      "transformer self-attention", "data drift", "concept drift",
      "kolmogorov-smirnov", "smote"
    ],
    strictInstruction: (
      "Focus strictly on automation, resilience, automated deployments, zero-downtime operations, " +
      "Kubernetes, infrastructure as code, cloud security, and observability. Never ask frontend UI questions."
    ),
    strict_instruction: (
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
      "soc analyst",
      "security consultant"
    ],
    corePillars: [
      "Network Defense & Packet Analysis (TCP/IP handshakes, Wireshark, DNS/BGP exploits)",
      "Threat Modeling & OWASP Top 10 Application Vulnerabilities (SQLi, XSS, SSRF, IDOR)",
      "Cryptographic Fundamentals (Public Key Infrastructure, symmetric vs asymmetric, hashing, salt/pepper, TLS)",
      "Incident Response, Digital Forensics, Threat Hunting & SIEM Log Correlation",
      "Identity & Access Management (IAM, OAuth2/OIDC, RBAC, Zero Trust Architecture)"
    ],
    core_pillars: [
      "Network Defense & Packet Analysis (TCP handshakes, Wireshark, DNS exploits)",
      "Threat Modeling & OWASP Top 10 Application Vulnerabilities",
      "Cryptographic Fundamentals (Public key infra, hashing, salt/pepper, TLS)",
      "Incident Response, Forensics, and Threat Hunting (SIEM, log analysis)",
      "Access Controls & Zero Trust Architecture"
    ],
    allowedTopics: [
      "owasp top 10",
      "network security",
      "wireshark",
      "packet analysis",
      "incident response",
      "siem",
      "threat hunting",
      "cryptography",
      "pki",
      "tls",
      "oauth2",
      "oidc",
      "zero trust",
      "penetration testing",
      "vulnerability management",
      "sql injection",
      "ssrf",
      "idor",
      "security auditing"
    ],
    prohibitedTopics: [
      "css flexbox",
      "css grid",
      "react fiber",
      "virtual dom",
      "cumulative layout shift",
      "core web vitals",
      "scaled dot-product",
      "transformer self-attention",
      "data drift"
    ],
    anti_keywords: [
      "css flexbox", "react fiber", "css grid", "virtual dom",
      "cumulative layout shift", "scaled dot-product"
    ],
    strictInstruction: (
      "Focus strictly on attack vectors, defense-in-depth, exploit mechanics, threat modeling, " +
      "incident response, network packet analysis, and security triage workflows. Never ask frontend styling or machine learning training questions."
    ),
    strict_instruction: (
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
      "software test engineer",
      "test automation engineer"
    ],
    corePillars: [
      "Test Automation Framework Architecture (Page Object Model, Fixtures, Thread-Safety)",
      "Mitigating Flaky Tests, Race Conditions, Dynamic Waits & CI/CD Pipeline Integration",
      "Black-Box & Grey-Box Test Design (Boundary Value Analysis & Equivalence Partitioning)",
      "API & Integration Testing (Contract Testing with Pact, Mocking, Test Containers)",
      "Performance, Load, Spike & Stress Testing with k6 / JMeter / Locust",
      "Defect Management, Root-Cause Analysis, Severity vs Priority Triage & Release Quality Gates"
    ],
    core_pillars: [
      "Test Automation Framework Architecture (Page Object Model & Fixtures)",
      "Mitigating Flaky Tests & Asynchronous Race Conditions in CI/CD",
      "Black-Box Test Design (Boundary Value Analysis & Equivalence Partitioning)",
      "API & Integration Testing (Consumer-Driven Contracts with Pact)",
      "Performance, Load, Spike & Stress Testing with k6 / JMeter"
    ],
    allowedTopics: [
      "test automation frameworks",
      "page object model",
      "selenium",
      "playwright",
      "cypress",
      "testng",
      "junit",
      "flaky test mitigation",
      "boundary value analysis",
      "equivalence partitioning",
      "api testing",
      "contract testing",
      "pact",
      "load testing",
      "k6",
      "jmeter",
      "test pyramid",
      "ci/cd test gates",
      "defect lifecycle"
    ],
    prohibitedTopics: [
      "css flexbox",
      "css grid",
      "react fiber",
      "sharding vs read replicas",
      "snowflake id",
      "b-tree index internals",
      "scaled dot-product",
      "transformer self-attention",
      "model drift"
    ],
    anti_keywords: [
      "css flexbox", "css grid", "react fiber", "sharding vs read replicas",
      "snowflake id", "b-tree index", "context api", "scaled dot-product",
      "transformer self-attention", "concurrent rendering", "zustand"
    ],
    strictInstruction: (
      "Focus strictly on test design techniques, framework architecture, " +
      "flakiness elimination, defect triage, automated test execution, and CI/CD quality gates. Never ask deep system architecture or frontend CSS questions."
    ),
    strict_instruction: (
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
      "systems architect",
      "enterprise architect",
      "technical architect"
    ],
    corePillars: [
      "High-Throughput Distributed Systems: 64-bit Unique ID Generators (Snowflake ID)",
      "Database Sharding, Partitioning, Read Replicas & Multi-Region Replication",
      "CAP Theorem, PACELC, Eventual Consistency & Distributed Consensus (Raft/Paxos)",
      "Transactional Outbox Pattern, Change Data Capture (CDC) & Event Sourcing",
      "Multi-Tier Caching Architectures (Write-Through, Write-Behind, Cache-Aside, Stampede Mitigation)",
      "Distributed Rate Limiting (Token Bucket, Leaky Bucket, Sliding Window Counter)"
    ],
    core_pillars: [
      "Distributed 64-bit Unique ID Generator (Snowflake ID)",
      "Database Sharding vs Read Replicas & Partitioning",
      "CAP Theorem & Distributed Consensus in Distributed Systems",
      "Transactional Outbox Pattern & Change Data Capture (CDC)",
      "Multi-Tier Caching & Consistency Architecture"
    ],
    allowedTopics: [
      "system design",
      "distributed systems",
      "scalability",
      "sharding",
      "replication",
      "cap theorem",
      "eventual consistency",
      "consensus algorithms",
      "raft",
      "paxos",
      "caching patterns",
      "message queues",
      "event-driven architecture",
      "cdc",
      "outbox pattern",
      "rate limiting",
      "high availability",
      "fault tolerance",
      "disaster recovery"
    ],
    prohibitedTopics: [
      "css flexbox",
      "css grid",
      "bva",
      "boundary value analysis",
      "virtual dom",
      "cumulative layout shift",
      "appium",
      "selenium locators"
    ],
    anti_keywords: [
      "css flexbox", "css grid", "bva", "boundary value analysis", "virtual dom",
      "cumulative layout shift", "appium"
    ],
    strictInstruction: (
      "Focus strictly on high-level system architecture, distributed trade-offs, " +
      "failure modes, consensus, caching, partitioning, and scalability bottlenecks. Avoid low-level UI styling or simple syntax questions."
    ),
    strict_instruction: (
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

  // 1. Direct key match
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
