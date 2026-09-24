import bcrypt from 'bcryptjs';

// Pre-seeded hashed password for demo accounts ("password123")
const DEMO_PASSWORD_HASH = bcrypt.hashSync('password123', 10);

export const users = [
  {
    id: 'user-demo-1',
    name: 'Alex Rivera',
    email: 'alex@example.com',
    password: DEMO_PASSWORD_HASH,
    role: 'USER',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date('2026-01-15').toISOString()
  },
  {
    id: 'admin-demo-1',
    name: 'Sarah Chen (Admin)',
    email: 'admin@prepai.com',
    password: DEMO_PASSWORD_HASH,
    role: 'ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date('2026-01-01').toISOString()
  }
];

export const userProfiles = new Map([
  [
    'user-demo-1',
    {
      userId: 'user-demo-1',
      headline: 'Full-Stack Developer & Aspiring Cloud Architect',
      targetRole: 'Senior Software Engineer',
      targetDomain: 'Software Development',
      experienceYears: 4,
      skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'REST APIs', 'Git'],
      education: { degree: 'B.S. in Computer Science', institution: 'State University', year: '2022' },
      linkedinUrl: 'https://linkedin.com/in/alexrivera',
      githubUrl: 'https://github.com/alexrivera',
      preferredDifficulty: 'INTERMEDIATE',
      updatedAt: new Date().toISOString()
    }
  ]
]);

export const resumes = new Map([
  [
    'user-demo-1',
    [
      {
        id: 'res-demo-alex-1',
        userId: 'user-demo-1',
        title: 'Full-Stack & Cloud Architecture Resume',
        targetRole: 'Senior Software Engineer',
        filename: 'Alex_Rivera_FullStack_Resume.pdf',
        fileName: 'Alex_Rivera_FullStack_Resume.pdf',
        fileSize: 1048576,
        mimeType: 'application/pdf',
        rawText: `Alex Rivera
Senior Software Engineer | Full-Stack Developer & Cloud Architect
alex@example.com | San Francisco, CA | linkedin.com/in/alexrivera | github.com/alexrivera

SUMMARY:
Results-driven Full-Stack Engineer with 4+ years of experience architecting distributed backend services, high-throughput RESTful APIs, and responsive web applications using React, Node.js, TypeScript, PostgreSQL, and Docker. Proven track record in optimizing database queries, microservices orchestration, and building resilient CI/CD pipelines.

CORE SKILLS:
- Languages & Runtimes: JavaScript, TypeScript, Node.js, Python, SQL
- Frontend: React, Redux Toolkit, Next.js, HTML5, CSS3, Tailwind CSS
- Backend & DB: Express, PostgreSQL, Redis, REST APIs, GraphQL, Microservices
- Cloud & DevOps: Docker, Kubernetes, AWS (ECS, S3, RDS), CI/CD (GitHub Actions), Git
- Engineering Practices: System Design, Agile/Scrum, Automated Testing (Jest), Clean Architecture

EXPERIENCE:
Senior Software Engineer | CloudScale Systems (2023 - Present)
- Architected and deployed a multi-tenant telemetry ingestion service processing over 12,000 req/sec with Node.js and PostgreSQL.
- Reduced p99 query latency by 42% through indexing strategies, Redis write-through caching, and connection pool optimization.
- Led the migration of legacy monolithic payment services to Dockerized microservices.

Software Engineer | Apex FinTech Labs (2021 - 2023)
- Built responsive customer-facing dashboard interfaces in React and Node.js serving 150,000+ daily active users.
- Designed secure OAuth2 authentication and role-based access control (RBAC) microservices.
- Created end-to-end integration test suites boosting code coverage from 68% to 92%.

EDUCATION:
B.S. in Computer Science | State University (2018 - 2022)`,
        parsedData: {
          candidateName: 'Alex Rivera',
          headline: 'Full-Stack Developer & Cloud Architect',
          yearsOfExperience: 4,
          extractedSkills: ['JavaScript', 'TypeScript', 'Node.js', 'React', 'PostgreSQL', 'Docker', 'Redis', 'REST APIs', 'AWS', 'System Design'],
          technicalSkills: ['JavaScript', 'TypeScript', 'Node.js', 'React', 'PostgreSQL', 'Docker', 'Redis', 'AWS'],
          softSkills: ['Leadership', 'Cross-Functional Collaboration', 'Agile Delivery', 'Problem Solving'],
          projects: [
            {
              name: 'Multi-Tenant Telemetry Ingestion Service',
              technologies: ['Node.js', 'PostgreSQL', 'Redis', 'Docker'],
              summary: 'Engineered high-throughput event pipeline handling 12,000+ req/sec with sub-50ms latency.'
            },
            {
              name: 'FinTech RBAC & Payments Migration',
              technologies: ['React', 'Node.js', 'Docker', 'AWS'],
              summary: 'Migrated legacy billing workflows to decoupled microservices with OAuth2 and 92% test coverage.'
            }
          ],
          education: [
            { degree: 'B.S. in Computer Science', institution: 'State University', graduationYear: '2022' }
          ],
          missingRecommendedSkills: ['Kubernetes', 'GraphQL', 'Terraform'],
          resumeQualityScore: 88,
          actionableSuggestions: [
            'Quantify the impact of cloud infrastructure cost reductions on AWS.',
            'Highlight experience with observability tooling such as Prometheus, Grafana, or OpenTelemetry.',
            'Add depth on distributed consensus or message queue architectures (Kafka, RabbitMQ).'
          ]
        },
        extractedSkills: ['JavaScript', 'TypeScript', 'Node.js', 'React', 'PostgreSQL', 'Docker', 'Redis', 'REST APIs', 'AWS', 'System Design'],
        missingSkills: ['Kubernetes', 'GraphQL', 'Terraform'],
        overallScore: 88,
        isActive: true,
        uploadedAt: new Date('2026-01-20T10:00:00Z').toISOString(),
        createdAt: new Date('2026-01-20T10:00:00Z').toISOString(),
        updatedAt: new Date('2026-01-20T10:00:00Z').toISOString()
      }
    ]
  ]
]);
export const jobDescriptions = new Map();
export const sessions = new Map();
export const codingSubmissions = [];

export const schedules = new Map([
  [
    'sched-demo-1',
    {
      id: 'sched-demo-1',
      userId: 'user-demo-1',
      title: 'Full-Stack Architecture & Systems Drill',
      category: 'TECHNICAL',
      domain: 'Software Development',
      difficulty: 'INTERMEDIATE',
      targetRole: 'Senior Software Engineer',
      scheduledFor: new Date(Date.now() + 86400000).toISOString(),
      notes: 'Focus on distributed cache consistency and database pooling',
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    }
  ]
]);

export const userProgress = new Map([
  [
    'user-demo-1',
    {
      userId: 'user-demo-1',
      totalInterviews: 5,
      totalAnswers: 22,
      averageScore: 84.5,
      technicalAverage: 86.0,
      communicationAvg: 83.0,
      confidenceAvg: 85.0,
      currentStreakDays: 4,
      longestStreakDays: 9,
      totalXpPoints: 1250,
      level: 3,
      strongestTopics: ['System Design', 'React & State', 'Database Normalization'],
      weakestTopics: ['STAR Method Nuance', 'Time Complexity Analysis', 'Behavioral Conflict Resolution'],
      lastActiveDate: new Date().toISOString()
    }
  ]
]);

export const achievements = [
  {
    id: 'ach-1',
    code: 'FIRST_MOCK',
    title: 'First Step to Mastery',
    description: 'Completed your first full mock interview rehearsal',
    badgeIcon: '🎯',
    xpReward: 100
  },
  {
    id: 'ach-2',
    code: 'STREAK_3',
    title: 'Consistency Champion',
    description: 'Practiced 3 days in a row without breaking streak',
    badgeIcon: '🔥',
    xpReward: 150
  },
  {
    id: 'ach-3',
    code: 'SCORE_90',
    title: 'Ace Performer',
    description: 'Achieved an interview score of 90% or higher',
    badgeIcon: '⭐',
    xpReward: 250
  },
  {
    id: 'ach-4',
    code: 'STAR_PRO',
    title: 'STAR Storyteller',
    description: 'Delivered an answer with perfect Situation, Task, Action, and Result structure',
    badgeIcon: '🏆',
    xpReward: 200
  },
  {
    id: 'ach-5',
    code: 'CODE_WIZARD',
    title: 'Algorithm Wizard',
    description: 'Successfully passed all test cases on an Advanced coding challenge',
    badgeIcon: '⚡',
    xpReward: 300
  }
];

export const userBadges = new Map([
  ['user-demo-1', ['ach-1', 'ach-2']]
]);

export const notifications = new Map([
  [
    'user-demo-1',
    [
      {
        id: 'notif-1',
        title: 'Streak Active!',
        message: "You're on a 4-day practice streak! Do a 5-minute drill today to keep it going.",
        type: 'REMINDER',
        read: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'notif-2',
        title: 'Recommended Drill Available',
        message: 'Based on your recent mock, we recommend practicing: "Handling Conflicting Team Priorities".',
        type: 'RECOMMENDATION',
        read: false,
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
      }
    ]
  ]
]);

export const questionBankData = [
  {
    "id": "qb-1",
    "title": "Explain Database Indexing & B-Trees",
    "category": "TECHNICAL",
    "domain": "Software Development",
    "difficulty": "INTERMEDIATE",
    "questionType": "TECHNICAL_DEEP_DIVE",
    "questionText": "How do database indexes improve read performance, what data structure do they typically use, and what is the trade-off during write operations?",
    "expectedKeywords": [
      "B-Tree",
      "O(log N)",
      "write overhead",
      "pointers",
      "rebalancing",
      "index fragmentation"
    ],
    "idealAnswerRubric": "Explains balanced tree traversal O(log N) vs full table scan O(N), row storage pointers, and write amplification on insert/update/delete.",
    "coreCompetencyTested": "Database Systems & Data Structures",
    "sampleAnswer": "Database indexes use balanced tree structures (B-Trees or B+Trees) to allow O(log N) lookup times instead of full table scans O(N). The leaf nodes contain pointers to actual row storage. The trade-off is write overhead: whenever an INSERT, UPDATE, or DELETE occurs, the index must also be re-balanced and updated, increasing write latency and storage disk requirements.",
    "explanation": "Testing candidate depth regarding physical data structures, storage mechanics, and architectural trade-offs.",
    "keyConcepts": [
      "B-Trees",
      "Full Table Scan",
      "Write Amplification",
      "Index Fragmentation"
    ],
    "upvotes": 42,
    "targetRoles": [
      "Software Engineer",
      "Backend Engineer",
      "Full Stack Developer"
    ]
  },
  {
    "id": "qb-2",
    "title": "Resolving a Critical Cross-Team Production Outage",
    "category": "BEHAVIORAL",
    "domain": "Software Development",
    "difficulty": "ADVANCED",
    "questionType": "BEHAVIORAL_STAR",
    "questionText": "Describe a time when a critical production issue affected multiple teams. How did you lead communication, prioritize recovery, and implement post-incident prevention?",
    "expectedKeywords": [
      "situation",
      "incident bridge",
      "rollback",
      "root cause",
      "post-mortem",
      "circuit breaker"
    ],
    "idealAnswerRubric": "Uses STAR framework: outlines calm triage, communication protocols with stakeholders, rapid rollback/mitigation, and systemic preventive measures.",
    "coreCompetencyTested": "Incident Leadership & Crisis Communication",
    "sampleAnswer": "In my previous role, a database connection pool exhaustion took down our authentication gateway. (Situation) Over 50k active sessions were stalled. (Task) As the on-call engineer, I established an incident bridge, appointed a dedicated communication lead for customer support, and rolled back the recent config release within 12 minutes. (Action) Post-incident, I introduced automated circuit-breakers and chaos testing. (Result) Downtime was reduced by 85% across future releases.",
    "explanation": "Examines leadership under stress, STAR format adherence, clarity, and blame-free post-mortem culture.",
    "keyConcepts": [
      "Incident Management",
      "STAR Framework",
      "Circuit Breakers",
      "Blameless Post-Mortem"
    ],
    "upvotes": 38,
    "targetRoles": [
      "Software Engineer",
      "Engineering Manager / Lead",
      "DevOps & Cloud Engineer"
    ]
  },
  {
    "id": "qb-3",
    "title": "Handling Negative or Ambiguous Feedback",
    "category": "HR",
    "domain": "Human Resources",
    "difficulty": "BEGINNER",
    "questionType": "BEHAVIORAL_STAR",
    "questionText": "Can you tell me about a time you received constructive criticism or negative feedback from a manager or peer? How did you respond, and what did you learn?",
    "expectedKeywords": [
      "feedback",
      "listen",
      "defensive",
      "growth mindset",
      "actionable change",
      "outcome"
    ],
    "idealAnswerRubric": "Demonstrates psychological safety, absence of defensiveness, objective reflection, and concrete behavioral changes with positive results.",
    "coreCompetencyTested": "Receptiveness & Growth Mindset",
    "sampleAnswer": "Early in my career, my manager noted that my pull requests were too large and difficult to review thoroughly. Initially I felt defensive, but I stepped back and realized it slowed down my teammates. I researched Git hygiene, adopted conventional commits, and started breaking PRs into atomic chunks of fewer than 250 lines. Review turnaround time dropped from 3 days to under 4 hours, and my lead commended the turnaround in my next 1-on-1.",
    "explanation": "Assesses coachability, emotional intelligence, maturity, and actionable follow-through.",
    "keyConcepts": [
      "Growth Mindset",
      "Active Listening",
      "Atomic Pull Requests"
    ],
    "upvotes": 29,
    "targetRoles": [
      "Software Engineer",
      "Frontend Developer",
      "Backend Engineer",
      "All Roles"
    ]
  },
  {
    "id": "qb-4",
    "title": "Overfitting vs. Underfitting in Machine Learning",
    "category": "TECHNICAL",
    "domain": "Artificial Intelligence",
    "difficulty": "INTERMEDIATE",
    "questionType": "TECHNICAL_DEEP_DIVE",
    "questionText": "What is the bias-variance tradeoff? How do you diagnose whether a deep learning model is overfitting or underfitting, and what remedies would you apply?",
    "expectedKeywords": [
      "bias",
      "variance",
      "validation loss",
      "regularization",
      "dropout",
      "data augmentation"
    ],
    "idealAnswerRubric": "Articulates training vs validation curve divergences, high bias (underfitting) vs high variance (overfitting), and lists concrete regularization techniques.",
    "coreCompetencyTested": "Statistical Learning Theory & Model Diagnostics",
    "sampleAnswer": "High bias causes underfitting (model cannot capture data patterns), leading to high training and validation error. High variance causes overfitting (model memorizes noise), leading to low training error but high validation error. Remedies for overfitting include L1/L2 regularization, Dropout, data augmentation, early stopping, and simplifying model architecture. Remedies for underfitting include increasing model capacity, engineering richer features, and reducing regularization.",
    "explanation": "Fundamental ML theory questions testing core diagnostic instincts and regularization strategies.",
    "keyConcepts": [
      "Bias-Variance Tradeoff",
      "Regularization",
      "Dropout",
      "Cross-Validation"
    ],
    "upvotes": 51,
    "targetRoles": [
      "Data Scientist / AI Engineer",
      "Software Engineer"
    ]
  },
  {
    "id": "qb-5",
    "title": "Zero-Trust Architecture Principles",
    "category": "TECHNICAL",
    "domain": "Cybersecurity",
    "difficulty": "ADVANCED",
    "questionType": "SCENARIO",
    "questionText": "How would you explain the core tenets of Zero-Trust architecture to an executive team, and what are the foundational steps to implement it across an enterprise network?",
    "expectedKeywords": [
      "never trust always verify",
      "micro-segmentation",
      "least privilege",
      "IAM",
      "continuous authentication",
      "perimeter"
    ],
    "idealAnswerRubric": "Contrasts castle-and-moat perimeter security with identity-centric verification, continuous posture checks, and least-privilege RBAC.",
    "coreCompetencyTested": "Enterprise Security Architecture",
    "sampleAnswer": "Zero-Trust operates on the principle \"Never Trust, Always Verify.\" Rather than trusting everything inside a perimeter firewall, every access request—regardless of origin—must be authenticated, authorized, and continuously validated based on identity, device posture, location, and least-privilege principles. Implementation begins with strict Identity and Access Management (IAM), micro-segmentation, continuous telemetry, and automated policy enforcement.",
    "explanation": "Evaluates architectural security knowledge and ability to translate technical concepts for business stakeholders.",
    "keyConcepts": [
      "Zero Trust",
      "Micro-segmentation",
      "Least Privilege",
      "Continuous Authentication"
    ],
    "upvotes": 35,
    "targetRoles": [
      "Cybersecurity Engineer",
      "System Architect",
      "DevOps & Cloud Engineer"
    ]
  },
  {
    "id": "qb-6",
    "title": "Why Are You Looking to Leave Your Current Role?",
    "category": "HR",
    "domain": "Human Resources",
    "difficulty": "BEGINNER",
    "questionType": "SHORT_ANSWER",
    "questionText": "What motivated you to explore new opportunities at this stage in your career, and why is our organization specifically appealing to you?",
    "expectedKeywords": [
      "career growth",
      "new challenges",
      "company mission",
      "scale",
      "positive framing"
    ],
    "idealAnswerRubric": "Maintains strict professionalism without speaking ill of past employers, highlighting authentic pursuit of growth, technical scale, and alignment with target company mission.",
    "coreCompetencyTested": "Professional Diplomacy & Career Intentionality",
    "sampleAnswer": "I have had a rewarding tenure at my current company where I honed my core engineering and team collaboration skills. However, I am eager to work on high-scale distributed systems and mentor junior developers, which aligns directly with the architectural challenges your engineering team is solving in cloud infrastructure. Your product focus on reliability and engineer-first culture made this role a natural next step.",
    "explanation": "Checks professional diplomacy, positive framing, and genuine interest in the prospective employer.",
    "keyConcepts": [
      "Positive Framing",
      "Company Alignment",
      "Career Growth"
    ],
    "upvotes": 31,
    "targetRoles": [
      "Software Engineer",
      "Frontend Developer",
      "Backend Engineer",
      "All Roles"
    ]
  },
  {
    "id": "qb-7",
    "title": "Designing a Scalable Distributed Caching Layer",
    "category": "TECHNICAL",
    "domain": "Software Development",
    "difficulty": "ADVANCED",
    "questionType": "SCENARIO",
    "questionText": "How would you architect a distributed caching layer using Redis or Memcached to prevent cache stampedes, handle cache invalidation, and ensure high availability?",
    "expectedKeywords": [
      "cache stampede",
      "cache invalidation",
      "TTL",
      "read-through",
      "write-through",
      "Redis Sentinel",
      "consistent hashing",
      "mutex"
    ],
    "idealAnswerRubric": "Discusses cache stampede mitigation (probabilistic early expiration or distributed locks), cache consistency strategies (write-through vs cache-aside), and cluster replication.",
    "coreCompetencyTested": "Distributed Systems & High Availability",
    "sampleAnswer": "To prevent cache stampedes (dog-piling) when popular keys expire, I utilize probabilistic early expiration (XFetch algorithm) or a distributed mutex (Redlock) so only one worker queries the database while others wait. For invalidation, I prefer Cache-Aside with short TTLs and event-driven invalidation via CDC (Change Data Capture) over direct dual writes. High availability is achieved using Redis Cluster with replica shards and Sentinel auto-failover across availability zones.",
    "explanation": "Evaluates caching mechanics, consistency guarantees, concurrency controls, and failure recovery.",
    "keyConcepts": [
      "Cache Stampede",
      "Cache-Aside",
      "Consistent Hashing",
      "Redis Cluster"
    ],
    "upvotes": 47,
    "targetRoles": [
      "Backend Engineer",
      "System Architect",
      "Full Stack Developer"
    ]
  },
  {
    "id": "qb-8",
    "title": "REST vs. GraphQL: Architectural Trade-Offs",
    "category": "TECHNICAL",
    "domain": "Software Development",
    "difficulty": "INTERMEDIATE",
    "questionType": "TECHNICAL_DEEP_DIVE",
    "questionText": "Compare REST APIs and GraphQL. Under what circumstances would you select one over the other, and how do their caching strategies differ?",
    "expectedKeywords": [
      "over-fetching",
      "under-fetching",
      "HTTP caching",
      "schema",
      "resolvers",
      "N+1 problem",
      "DataLoader"
    ],
    "idealAnswerRubric": "Examines data fetching granularity, network round trips, HTTP status code leverage, CDN caching simplicity in REST vs query flexibility and DataLoader patterns in GraphQL.",
    "coreCompetencyTested": "API Architecture & Protocol Design",
    "sampleAnswer": "REST is ideal for resource-oriented, standard HTTP caching via edge CDNs (leveraging Cache-Control headers and ETags). However, REST can suffer from over-fetching or under-fetching across deeply nested relations. GraphQL solves this by allowing clients to request exact fields in a single POST request, making it superb for mobile devices and diverse client UIs. The trade-offs in GraphQL include loss of native HTTP status caching, complex query cost analysis, and vulnerability to the N+1 query problem, which requires batching via DataLoader.",
    "explanation": "Assesses practical frontend/backend protocol trade-offs and caching awareness.",
    "keyConcepts": [
      "Over-fetching",
      "DataLoader",
      "HTTP Caching",
      "Schema Stitching"
    ],
    "upvotes": 39,
    "targetRoles": [
      "System Architect",
      "Backend Engineer",
      "Full Stack Developer"
    ]
  },
  {
    "id": "qb-9",
    "title": "Design a High-Throughput URL Shortener (System Design)",
    "category": "SYSTEM_DESIGN",
    "domain": "Software Development",
    "difficulty": "ADVANCED",
    "questionType": "SCENARIO",
    "questionText": "Design a globally scalable URL shortening service like Bitly handling 100M new URLs created per month and a 10:1 read-to-write ratio. Outline data storage, hashing, and redirect latency optimization.",
    "expectedKeywords": [
      "Base62",
      "hashing",
      "collision",
      "Cassandra",
      "Redis",
      "301 vs 302",
      "bloom filter",
      "snowflake ID"
    ],
    "idealAnswerRubric": "Estimates storage/QPS numbers, compares MD5 truncation vs auto-increment Base62 encoding (using ZooKeeper/Snowflake counter), explains HTTP 301 vs 302 redirect analytics, and details cache architecture.",
    "coreCompetencyTested": "System Design & High-Volume Storage",
    "sampleAnswer": "100M URLs/month equates to ~40 writes/sec and ~400 reads/sec, with 5-year storage around 3TB. For short URL generation, I prefer a distributed unique ID generator (e.g. Twitter Snowflake) encoded with Base62 (62^7 yields 3.5 trillion URLs) to eliminate collision checks. For storage, a distributed NoSQL key-value store like Cassandra or DynamoDB is optimal for read latency. HTTP 301 permanently caches the redirect in browsers (reducing server load), while HTTP 302 allows real-time click analytics. A Redis cache layer holds the top 20% most accessed URLs.",
    "explanation": "Tests classic end-to-end system design: capacity math, hashing strategies, HTTP protocol semantics, and storage tiers.",
    "keyConcepts": [
      "Base62 Encoding",
      "Distributed ID Generation",
      "HTTP 301/302",
      "Cache Sharding"
    ],
    "upvotes": 64,
    "targetRoles": [
      "System Architect",
      "Backend Engineer",
      "Software Engineer"
    ]
  },
  {
    "id": "qb-10",
    "title": "Designing an API Rate Limiter",
    "category": "SYSTEM_DESIGN",
    "domain": "Software Development",
    "difficulty": "INTERMEDIATE",
    "questionType": "SCENARIO",
    "questionText": "How would you design a distributed API rate limiter to protect an application from denial-of-service and brute force abuse? Compare Token Bucket, Leaky Bucket, and Sliding Window algorithms.",
    "expectedKeywords": [
      "Token Bucket",
      "Leaky Bucket",
      "Sliding Window",
      "Redis Lua scripts",
      "HTTP 429",
      "race conditions"
    ],
    "idealAnswerRubric": "Contrasts burst handling in Token Bucket with smooth traffic shaping in Leaky Bucket; explains Sliding Window Log vs Counter, and how Redis atomic Lua scripts prevent race conditions.",
    "coreCompetencyTested": "Traffic Management & Concurrency",
    "sampleAnswer": "The Token Bucket algorithm allows configurable bursts up to bucket capacity and refills steadily; Leaky Bucket guarantees a smooth, constant output rate; Sliding Window Counter provides high accuracy with low memory by weighting adjacent window counts. In a distributed setting, we store client counters in Redis and execute increment logic via atomic Lua scripts to eliminate race conditions between concurrent requests. When limits are exceeded, we return HTTP 429 Too Many Requests with a Retry-After header.",
    "explanation": "Checks knowledge of rate-limiting algorithms, distributed state management, and HTTP standards.",
    "keyConcepts": [
      "Token Bucket",
      "Sliding Window Counter",
      "Redis Lua",
      "HTTP 429"
    ],
    "upvotes": 44,
    "targetRoles": [
      "Cybersecurity Engineer",
      "Backend Engineer",
      "Full Stack Developer"
    ]
  },
  {
    "id": "qb-11",
    "title": "Understanding the CAP Theorem in Distributed Systems",
    "category": "TECHNICAL",
    "domain": "Software Development",
    "difficulty": "INTERMEDIATE",
    "questionType": "TECHNICAL_DEEP_DIVE",
    "questionText": "Explain the CAP theorem. Why is it impossible for a distributed data store to guarantee both Consistency and Availability in the presence of a Network Partition? Give real-world examples.",
    "expectedKeywords": [
      "consistency",
      "availability",
      "partition tolerance",
      "network split",
      "CP vs AP",
      "Cassandra",
      "PostgreSQL"
    ],
    "idealAnswerRubric": "Clarifies that P (partition tolerance) is non-negotiable in real networks; demonstrates why a partition forces a trade-off: fail the write (CP) or return stale data (AP).",
    "coreCompetencyTested": "Distributed Consensus & Data Guarantees",
    "sampleAnswer": "In distributed systems, network partitions (packet drops, link breaks) are inevitable, so Partition Tolerance (P) is a mandatory reality. When a network splits nodes into disconnected halves, a write request forces a choice: if you accept writes on one partition without synchronizing to the other, reads become inconsistent (sacrificing C for Availability - AP systems like Apache Cassandra). If you reject writes until full quorum consistency is verified, the system becomes unavailable to clients (sacrificing A for Consistency - CP systems like etcd or MongoDB with strict majorities).",
    "explanation": "Fundamental distributed systems concept for understanding tradeoffs between consistency models and availability.",
    "keyConcepts": [
      "CAP Theorem",
      "Quorum Consensus",
      "CP vs AP Systems",
      "Split-Brain"
    ],
    "upvotes": 48,
    "targetRoles": [
      "Software Engineer",
      "Engineering Manager / Lead",
      "All Roles"
    ]
  },
  {
    "id": "qb-12",
    "title": "Managing Race Conditions and Concurrency in Node.js & Databases",
    "category": "TECHNICAL",
    "domain": "Software Development",
    "difficulty": "INTERMEDIATE",
    "questionType": "TECHNICAL_DEEP_DIVE",
    "questionText": "Node.js is single-threaded on its event loop, yet race conditions still occur. How do they happen, and how do you protect against them using database transactions and optimistic or pessimistic locking?",
    "expectedKeywords": [
      "event loop",
      "asynchronous interleaved",
      "optimistic locking",
      "pessimistic locking",
      "SELECT FOR UPDATE",
      "atomic operations"
    ],
    "idealAnswerRubric": "Explains how async/await interleaved I/O operations create race conditions in business logic; contrasts version-based optimistic locking with SELECT FOR UPDATE pessimistic locking.",
    "coreCompetencyTested": "Concurrency Control & Data Integrity",
    "sampleAnswer": "While Node.js executes JavaScript synchronously on one thread, asynchronous operations (like awaiting a DB query) yield the thread. Two requests can read the same bank balance simultaneously before either finishes writing the debit. To prevent this, we use database-level concurrency controls: Optimistic Locking uses a version column (UPDATE ... WHERE id = x AND version = v) which rolls back if updated concurrently. Pessimistic Locking uses SELECT ... FOR UPDATE within a transaction to lock the specific row until the transaction commits.",
    "explanation": "Highlights critical distinction between JS thread concurrency and asynchronous distributed race conditions.",
    "keyConcepts": [
      "Event Loop Yielding",
      "Optimistic Locking",
      "Pessimistic Locking",
      "ACID Transactions"
    ],
    "upvotes": 41,
    "targetRoles": [
      "Backend Engineer",
      "Full Stack Developer",
      "Software Engineer"
    ]
  },
  {
    "id": "qb-13",
    "title": "How Transformer Self-Attention Works in LLMs",
    "category": "TECHNICAL",
    "domain": "Artificial Intelligence",
    "difficulty": "ADVANCED",
    "questionType": "TECHNICAL_DEEP_DIVE",
    "questionText": "Explain the core mechanics of Scaled Dot-Product Attention: Query, Key, and Value matrices. How does multi-head attention allow Large Language Models to capture complex relationships?",
    "expectedKeywords": [
      "Query",
      "Key",
      "Value",
      "scaled dot-product",
      "softmax",
      "multi-head attention",
      "context vector",
      "O(N^2)"
    ],
    "idealAnswerRubric": "Explains Q, K, V projection matrices, dot product similarity calculation scaled by sqrt(d_k), softmax normalization, and how multiple attention heads focus on distinct linguistic subspaces.",
    "coreCompetencyTested": "Deep Learning & Modern AI Architectures",
    "sampleAnswer": "Scaled Dot-Product Attention maps input token embeddings into Query (Q), Key (K), and Value (V) matrices via learned linear projections. For every token, its Query vector is dot-producted with all Key vectors to calculate raw relevance scores. These scores are divided by the square root of the key dimension (to prevent softmax gradient saturation) and passed through Softmax to produce an attention probability distribution. Multiplying by Value (V) produces the contextualized embedding. Multi-head attention repeats this across independent projection subspaces, allowing the model to simultaneously attend to syntactic, semantic, and positional relationships.",
    "explanation": "Deep learning core question evaluating modern foundation model principles.",
    "keyConcepts": [
      "Scaled Dot-Product",
      "Multi-Head Attention",
      "Softmax Normalization",
      "Contextual Embeddings"
    ],
    "upvotes": 56,
    "targetRoles": [
      "Data Scientist / AI Engineer",
      "Software Engineer"
    ]
  },
  {
    "id": "qb-14",
    "title": "Designing a Production Retrieval-Augmented Generation (RAG) System",
    "category": "SYSTEM_DESIGN",
    "domain": "Artificial Intelligence",
    "difficulty": "ADVANCED",
    "questionType": "SCENARIO",
    "questionText": "How would you architect a production RAG pipeline for enterprise documents? Discuss document chunking, vector embedding models, hybrid search, and hallucination guardrails.",
    "expectedKeywords": [
      "chunking",
      "vector database",
      "embeddings",
      "hybrid search",
      "BM25",
      "re-ranking",
      "hallucination",
      "guardrails"
    ],
    "idealAnswerRubric": "Walks through ingestion chunking strategies (semantic/sliding window), vector indexing, hybrid retrieval (dense vectors + sparse BM25), cross-encoder re-ranking, and response validation guardrails.",
    "coreCompetencyTested": "Enterprise GenAI Architecture & Information Retrieval",
    "sampleAnswer": "A robust production RAG pipeline consists of: 1) Ingestion: Recursive semantic chunking with overlapping windows (500 tokens, 10% overlap) preserving document metadata. 2) Indexing: Dense embeddings generated via high-quality models (e.g. text-embedding-004) stored in a vector database like Pinecone or pgvector with HNSW indexing. 3) Hybrid Retrieval: Combining dense vector cosine similarity with sparse lexical search (BM25) via Reciprocal Rank Fusion (RRF) to capture exact keywords. 4) Re-ranking: A cross-encoder model ranks top 10 chunks down to top 3. 5) Guardrails: Prompting the LLM with strict grounding instructions and validating outputs with an automated hallucination check against cited chunk sources.",
    "explanation": "Covers modern enterprise generative AI patterns, vector storage, and hallucination reduction.",
    "keyConcepts": [
      "Chunking Strategies",
      "Hybrid Search (Dense + Sparse)",
      "Cross-Encoder Re-ranking",
      "Hallucination Mitigation"
    ],
    "upvotes": 62,
    "targetRoles": [
      "Data Scientist / AI Engineer",
      "System Architect",
      "Software Engineer"
    ]
  },
  {
    "id": "qb-15",
    "title": "Detecting and Remediating Data & Concept Drift in Production ML",
    "category": "TECHNICAL",
    "domain": "Artificial Intelligence",
    "difficulty": "INTERMEDIATE",
    "questionType": "TECHNICAL_DEEP_DIVE",
    "questionText": "What is the distinction between Data Drift and Concept Drift? What statistical tests and telemetry do you use to detect them, and what automated remediation strategies do you establish?",
    "expectedKeywords": [
      "data drift",
      "concept drift",
      "covariate shift",
      "Kolmogorov-Smirnov",
      "PSI",
      "ground truth",
      "retraining"
    ],
    "idealAnswerRubric": "Defines covariate shift P(X) vs concept shift P(Y|X); lists metrics like Population Stability Index (PSI) and KS-test; details automated alerting and shadow retraining loops.",
    "coreCompetencyTested": "MLOps & Model Lifecycle Reliability",
    "sampleAnswer": "Data drift (covariate shift) occurs when the distribution of input features P(X) changes over time (e.g., user demographics shift). Concept drift occurs when the underlying statistical relationship between features and target labels P(Y|X) changes (e.g., macroeconomic shifts changing credit risk behavior). We detect data drift using the Kolmogorov-Smirnov test for continuous variables and Population Stability Index (PSI) for categorical distributions. Remediation includes automated alerts, falling back to rule-based heuristic ensembles, and triggering automated pipeline retraining on recent rolling windows.",
    "explanation": "Evaluates real-world machine learning operations, statistical monitoring, and continuous deployment.",
    "keyConcepts": [
      "Data Drift vs Concept Drift",
      "Population Stability Index (PSI)",
      "KS Test",
      "Automated Retraining"
    ],
    "upvotes": 43,
    "targetRoles": [
      "Data Scientist / AI Engineer",
      "Software Engineer"
    ]
  },
  {
    "id": "qb-16",
    "title": "Preventing OWASP Top 10: SQL Injection & Cross-Site Scripting (XSS)",
    "category": "TECHNICAL",
    "domain": "Cybersecurity",
    "difficulty": "BEGINNER",
    "questionType": "TECHNICAL_DEEP_DIVE",
    "questionText": "Explain how SQL Injection and Stored vs Reflected XSS vulnerabilities occur in modern web applications. What defense-in-depth measures should engineers enforce?",
    "expectedKeywords": [
      "parameterized queries",
      "prepared statements",
      "sanitization",
      "Content Security Policy",
      "escaping",
      "stored XSS",
      "reflected XSS"
    ],
    "idealAnswerRubric": "Explains string concatenation flaws in SQL; details parameterized queries/ORMs; explains script execution in browsers and defenses: context-aware HTML escaping, CSP headers, and HttpOnly cookies.",
    "coreCompetencyTested": "Application Security & Secure Coding",
    "sampleAnswer": "SQL Injection occurs when untrusted user input is directly concatenated into a SQL statement, altering execution logic. The definitive defense is Parameterized Queries (Prepared Statements) or ORMs that separate query structure from parameters. XSS occurs when malicious JavaScript is injected into web pages: Stored XSS persists in databases and attacks all viewers; Reflected XSS reflects off an immediate request (e.g., search params). Defenses include context-aware HTML/JS output escaping, enforcing strict Content Security Policy (CSP) headers, and setting the HttpOnly flag on authentication cookies to prevent token theft.",
    "explanation": "Core web security hygiene expected of all professional full-stack and backend engineers.",
    "keyConcepts": [
      "Prepared Statements",
      "Content Security Policy (CSP)",
      "HttpOnly Cookies",
      "Contextual Escaping"
    ],
    "upvotes": 50,
    "targetRoles": [
      "DevOps & Cloud Engineer",
      "Cybersecurity Engineer",
      "Backend Engineer"
    ]
  },
  {
    "id": "qb-17",
    "title": "OAuth 2.0 Authorization Code Flow vs. JWT Bearer Tokens",
    "category": "TECHNICAL",
    "domain": "Cybersecurity",
    "difficulty": "INTERMEDIATE",
    "questionType": "TECHNICAL_DEEP_DIVE",
    "questionText": "How does the OAuth 2.0 Authorization Code Flow with PKCE work, and what are the security trade-offs of using stateless JWTs versus stateful database session tokens?",
    "expectedKeywords": [
      "OAuth 2.0",
      "PKCE",
      "authorization code",
      "access token",
      "refresh token",
      "JWT",
      "revocation",
      "stateless"
    ],
    "idealAnswerRubric": "Explains why PKCE prevents code interception on public clients; compares stateless JWT benefits (no DB lookup) with drawbacks (difficult revocation, token size) vs stateful sessions.",
    "coreCompetencyTested": "Identity, Authentication & Token Security",
    "sampleAnswer": "OAuth 2.0 with PKCE (Proof Key for Code Exchange) protects client apps by generating a dynamic code verifier and challenge, preventing authorization code interception during browser redirects. Stateless JWTs encode user identity and claims signed with a private key (RS256) or secret (HS256), allowing microservices to verify authentication without database lookups. The main trade-off is revocation: once issued, a JWT cannot be easily invalidated before expiration without maintaining a token blacklist or using short-lived access tokens (15 mins) paired with stateful refresh tokens.",
    "explanation": "Assesses modern identity federation, secure authorization standards, and token lifecycle management.",
    "keyConcepts": [
      "OAuth 2.0 + PKCE",
      "JWT Claims & Signing",
      "Token Revocation",
      "Refresh Token Rotation"
    ],
    "upvotes": 46,
    "targetRoles": [
      "Engineering Manager / Lead",
      "Software Engineer",
      "All Roles"
    ]
  },
  {
    "id": "qb-18",
    "title": "Hardening Kubernetes Cluster Security & Pod Isolation",
    "category": "TECHNICAL",
    "domain": "Cloud & DevOps",
    "difficulty": "ADVANCED",
    "questionType": "SCENARIO",
    "questionText": "An enterprise is moving sensitive workloads to Kubernetes. What security controls would you implement across Pods, Network Policies, RBAC, and container images?",
    "expectedKeywords": [
      "Pod Security Standards",
      "Network Policies",
      "RBAC",
      "read-only root filesystem",
      "non-root",
      "distroless",
      "secrets management"
    ],
    "idealAnswerRubric": "Discusses Pod Security Admission (restricted profile), default-deny NetworkPolicies, minimal RBAC service accounts, distroless images, and external secrets injection.",
    "coreCompetencyTested": "Cloud-Native Security & Infrastructure Orchestration",
    "sampleAnswer": "I implement a multi-layered defense: 1) Pod Security: Enforce Kubernetes Pod Security Admission at the Restricted level (runAsNonRoot, readOnlyRootFilesystem, drop all Linux capabilities except NET_BIND_SERVICE). 2) Network: Establish default-deny NetworkPolicies so pods can only communicate with explicitly whitelisted services via mTLS. 3) RBAC: Apply least-privilege role bindings and avoid default service accounts. 4) Images: Use minimal distroless base images scanned for CVEs in CI, signed via Sigstore/Cosign. 5) Secrets: Never store secrets in plain ConfigMaps; integrate HashiCorp Vault or Cloud Secret Manager via external-secrets-operator.",
    "explanation": "Deep-dive cloud-native security question assessing production container governance.",
    "keyConcepts": [
      "Pod Security Admission",
      "NetworkPolicies",
      "Least-Privilege RBAC",
      "Distroless Images"
    ],
    "upvotes": 37,
    "targetRoles": [
      "Software Engineer",
      "Engineering Manager / Lead",
      "All Roles"
    ]
  },
  {
    "id": "qb-19",
    "title": "Designing a Zero-Downtime CI/CD Deployment Strategy",
    "category": "TECHNICAL",
    "domain": "Cloud & DevOps",
    "difficulty": "INTERMEDIATE",
    "questionType": "SCENARIO",
    "questionText": "Compare Blue-Green, Canary, and Rolling deployment strategies. How do you manage backward-incompatible database schema migrations during zero-downtime releases?",
    "expectedKeywords": [
      "Blue-Green",
      "Canary",
      "Rolling",
      "Expand-Contract",
      "schema migration",
      "backward compatibility",
      "feature flag"
    ],
    "idealAnswerRubric": "Contrasts traffic routing mechanics across deployment patterns; details the Expand-Contract (Parallel Run) pattern for schema migrations.",
    "coreCompetencyTested": "Release Engineering & Continuous Delivery",
    "sampleAnswer": "Blue-Green runs two identical environments and switches the load balancer instantly; Canary routes 5-10% of real user traffic to the new version to monitor error rates and latency before full rollout; Rolling updates pods sequentially to conserve resources. For database schema changes that are breaking (e.g. renaming a column), we apply the Expand-Contract pattern: Step 1 (Expand) add the new column and write to both columns in code; Step 2 backfill historical data; Step 3 read from the new column; Step 4 (Contract) deprecate and drop the old column in a subsequent release.",
    "explanation": "Tests operational rigor, release safety, and database versioning under continuous traffic.",
    "keyConcepts": [
      "Canary Deployments",
      "Blue-Green Switching",
      "Expand-Contract Pattern",
      "Automated Health Checks"
    ],
    "upvotes": 49,
    "targetRoles": [
      "DevOps & Cloud Engineer",
      "Backend Engineer",
      "Site Reliability Engineering (SRE)"
    ]
  },
  {
    "id": "qb-20",
    "title": "Disagreeing with a Technical Decision and Committing to the Team",
    "category": "BEHAVIORAL",
    "domain": "Software Development",
    "difficulty": "INTERMEDIATE",
    "questionType": "BEHAVIORAL_STAR",
    "questionText": "Tell me about a time when you strongly disagreed with an architectural direction or technical choice proposed by a team lead or colleague. How did you handle the debate, and what was the outcome?",
    "expectedKeywords": [
      "disagree and commit",
      "data-driven",
      "prototype",
      "benchmarks",
      "consensus",
      "team alignment"
    ],
    "idealAnswerRubric": "Adheres to STAR format: shows professional advocacy using empirical data or spikes, respectful dialogue, and full commitment once the team decision is made.",
    "coreCompetencyTested": "Collaborative Conflict Resolution & Professional Alignment",
    "sampleAnswer": "Our lead architect proposed adopting a complex microservices architecture for an internal service with only 5k daily users. (Situation) I was concerned the operational overhead of Kubernetes and distributed tracing would delay our launch by months. (Task) Rather than arguing opinions, I built a quick benchmark spike comparing deployment complexity and wrote a 1-page trade-off document showing a modular monolith would meet our SLA with 70% lower compute cost. (Action) We held an architecture review; while the lead decided to move forward with a hybrid model, I fully committed to writing clean service contracts and assisting with CI/CD setup. (Result) We launched on time and our modular boundaries allowed clean separation.",
    "explanation": "Demonstrates Amazon principle \"Have Backbone; Disagree and Commit\" with emotional intelligence and empirical reasoning.",
    "keyConcepts": [
      "STAR Framework",
      "Disagree and Commit",
      "Empirical Proof-of-Concept",
      "Constructive Advocacy"
    ],
    "upvotes": 45,
    "targetRoles": [
      "System Architect",
      "Backend Engineer",
      "Software Engineer"
    ]
  },
  {
    "id": "qb-21",
    "title": "Managing Competing Priorities and Missed Deadlines",
    "category": "BEHAVIORAL",
    "domain": "Software Development",
    "difficulty": "INTERMEDIATE",
    "questionType": "BEHAVIORAL_STAR",
    "questionText": "Describe a situation where unexpected technical blockers made it clear your team would miss an upcoming product milestone. How did you communicate with stakeholders and manage the scope?",
    "expectedKeywords": [
      "early communication",
      "blockers",
      "MVP scope",
      "trade-offs",
      "stakeholder transparency",
      "mitigation"
    ],
    "idealAnswerRubric": "Highlights proactive communication well before the deadline, presenting solutions instead of excuses, de-scoping non-critical features, and delivering the core value.",
    "coreCompetencyTested": "Accountability & Project Risk Mitigation",
    "sampleAnswer": "Two weeks before a major enterprise client launch, we discovered a third-party payment gateway integration suffered undocumented rate limits. (Situation) We could not fulfill the promised batch processing throughput in time. (Task) I immediately flagged the blocker to our engineering manager and product lead 10 days before the milestone, rather than waiting until the last minute. (Action) I proposed a phased mitigation: ship Phase 1 with a queued asynchronous fallback for immediate transactions, while parallelizing the enterprise bulk ingestion in Phase 2 three weeks later. (Result) The client accepted the revised scope with appreciation for transparent transparency, and Phase 1 launched with zero transaction failures.",
    "explanation": "Evaluates transparency, risk management, and bias for action under deadline pressure.",
    "keyConcepts": [
      "Proactive Communication",
      "Scope Triaging",
      "Asynchronous Queuing",
      "Stakeholder Trust"
    ],
    "upvotes": 40,
    "targetRoles": [
      "Data Scientist / AI Engineer",
      "Software Engineer"
    ]
  },
  {
    "id": "qb-22",
    "title": "Balancing Technical Debt Against Rapid Feature Delivery",
    "category": "BEHAVIORAL",
    "domain": "Software Development",
    "difficulty": "ADVANCED",
    "questionType": "BEHAVIORAL_STAR",
    "questionText": "How do you negotiate dedicating engineering sprints to paying down technical debt when product managers are pushing hard for new business features?",
    "expectedKeywords": [
      "technical debt",
      "business metrics",
      "velocity",
      "refactoring",
      "20% allocation",
      "reliability"
    ],
    "idealAnswerRubric": "Connects technical debt to concrete business impact (reduced developer velocity, customer churn from bugs, AWS costs) and establishes systematic allocation (e.g. 20% debt rule).",
    "coreCompetencyTested": "Technical Strategy & Business Translation",
    "sampleAnswer": "Our monolithic billing service had accumulated significant legacy code, causing intermittent timeout errors and inflating PR review times from 2 days to over a week. (Situation) Product leadership wanted to prioritize three new conversion widgets. (Task) I gathered telemetry showing that 18% of developer hours were being lost to manual bug triage and automated test flakiness. (Action) During sprint planning, I translated tech debt into revenue risk and negotiated a continuous \"20% allocation rule\" dedicated to stability and modularizing the payment gateway. (Result) Within 3 sprints, flakiness dropped by 90%, deploy frequency doubled, and the team shipped the remaining product widgets ahead of schedule.",
    "explanation": "Assesses business acumen and ability to advocate for code health using business-relevant metrics.",
    "keyConcepts": [
      "Developer Velocity",
      "20% Debt Allocation",
      "Telemetry-Driven Advocacy",
      "Reliability Engineering"
    ],
    "upvotes": 52,
    "targetRoles": [
      "DevOps & Cloud Engineer",
      "System Architect",
      "Backend Engineer"
    ]
  },
  {
    "id": "qb-23",
    "title": "Navigating Cross-Functional Roadblocks and Silos",
    "category": "BEHAVIORAL",
    "domain": "Product Management",
    "difficulty": "INTERMEDIATE",
    "questionType": "BEHAVIORAL_STAR",
    "questionText": "Tell me about a time when progress on a key deliverable was stalled due to dependencies on another team or department with competing roadmaps. How did you unblock the initiative?",
    "expectedKeywords": [
      "cross-functional",
      "shared incentives",
      "empathy",
      "executive sponsor",
      "unblocking",
      "relationship building"
    ],
    "idealAnswerRubric": "Demonstrates constructive empathy for the other team’s roadmap constraints, finding shared incentives, and creative compromises (e.g. co-authoring code or API contracts).",
    "coreCompetencyTested": "Cross-Functional Collaboration & Influence",
    "sampleAnswer": "Our search feature revamp required a new user telemetry event endpoint from the core infrastructure team, but their sprint was fully booked with database migration work. (Situation) Our roadmap was blocked for at least a month. (Task) I scheduled a 30-minute sync with their tech lead to understand their constraints instead of escalating immediately. (Action) I offered to have our senior engineer write the PR for the event schema directly adhering to their review guidelines, minimizing their effort to code review only. (Result) They approved the PR in 48 hours, unblocking our search launch while maintaining their primary migration timeline.",
    "explanation": "Checks interpersonal negotiation, avoiding territorial friction, and pragmatic problem-solving.",
    "keyConcepts": [
      "Shared Incentives",
      "Inner-Sourcing / Co-Authoring",
      "Empathetic Negotiation",
      "Roadmap Alignment"
    ],
    "upvotes": 36,
    "targetRoles": [
      "Engineering Manager / Lead",
      "Software Engineer",
      "All Roles"
    ]
  },
  {
    "id": "qb-24",
    "title": "Designing a Real-Time Distributed Notification System",
    "category": "SYSTEM_DESIGN",
    "domain": "Software Development",
    "difficulty": "ADVANCED",
    "questionType": "SCENARIO",
    "questionText": "Design an omnichannel notification service (Push, SMS, Email) delivering 50M notifications daily with deduplication, priority queuing, and rate-limiting per user.",
    "expectedKeywords": [
      "Kafka",
      "RabbitMQ",
      "idempotency key",
      "priority queue",
      "worker pools",
      "APNs / FCM",
      "rate limiting"
    ],
    "idealAnswerRubric": "Covers message queue topology, priority tiers (transactional 2FA vs promotional), idempotency deduplication with Redis TTLs, and third-party provider failovers.",
    "coreCompetencyTested": "Event-Driven Architecture & Scalable Messaging",
    "sampleAnswer": "I architect this with: 1) API Gateway: Validates requests and issues an Idempotency Key stored in Redis (with a 24-hour TTL) to prevent duplicate sends. 2) Message Broker: Apache Kafka or RabbitMQ with separate topic partitions for High Priority (OTPs, password resets) and Low Priority (marketing digests). 3) Worker Fleet: Horizontally auto-scaling consumer microservices pulling from queues with token bucket rate-limiters per user (e.g., max 1 marketing email/day). 4) Provider Adapters: Circuit-breaker wrapped adapters for third-party gateways (Twilio, SendGrid, Apple APNs, Firebase Cloud Messaging) with automatic failover to backup providers.",
    "explanation": "Evaluates asynchronous message delivery, idempotency, rate-limiting, and resilient external API consumption.",
    "keyConcepts": [
      "Idempotency Keys",
      "Kafka Topic Partitioning",
      "Circuit Breaker Pattern",
      "Priority Queues"
    ],
    "upvotes": 59,
    "targetRoles": [
      "Software Engineer",
      "Engineering Manager / Lead",
      "All Roles"
    ]
  },
  {
    "id": "qb-25",
    "title": "Deep Dive into Database Sharding vs. Read Replicas",
    "category": "SYSTEM_DESIGN",
    "domain": "Software Development",
    "difficulty": "ADVANCED",
    "questionType": "TECHNICAL_DEEP_DIVE",
    "questionText": "At what point does adding Read Replicas stop solving database scale issues, and what architectural challenges arise when implementing Horizontal Database Sharding?",
    "expectedKeywords": [
      "write saturation",
      "replication lag",
      "shard key",
      "cross-shard joins",
      "re-sharding",
      "consistent hashing"
    ],
    "idealAnswerRubric": "Explains write saturation bottleneck on primary node and replication lag; details shard key selection pitfalls, cross-shard transactions, and distributed re-sharding complexity.",
    "coreCompetencyTested": "Database Scalability & Partitioning",
    "sampleAnswer": "Read Replicas scale read throughput by offloading SELECT queries, but they do not solve write bottlenecks since all INSERT/UPDATE operations must hit the single primary writer, and replication lag can cause dirty reads. When write IOPS or dataset size exceeds a single physical server limit, Horizontal Sharding becomes necessary. Sharding introduces major complexities: 1) Shard Key Selection: Bad keys cause hotspotting. 2) Cross-Shard Queries: Joins across shards require distributed scatter-gather queries which decimate performance. 3) Cross-Shard ACID Transactions: Require complex 2-Phase Commit (2PC) or Sagas. 4) Re-sharding: Moving data partitions during growth requires consistent hashing to minimize data migration.",
    "explanation": "Distinguishes between horizontal read scaling and physical partition scaling.",
    "keyConcepts": [
      "Read Replication Lag",
      "Shard Key Selection",
      "Scatter-Gather Joins",
      "Consistent Hashing"
    ],
    "upvotes": 53,
    "targetRoles": [
      "Backend Engineer",
      "System Architect",
      "Software Engineer"
    ]
  },
  {
    "id": "qb-26",
    "title": "Explain CSS Layout Engines: Flexbox vs. CSS Grid & Modern Responsive Design",
    "category": "TECHNICAL",
    "domain": "Software Development",
    "difficulty": "BEGINNER",
    "questionType": "TECHNICAL_DEEP_DIVE",
    "questionText": "What is the fundamental design difference between Flexbox and CSS Grid? When would you choose one over the other, and how do you ensure accessible responsive typography?",
    "expectedKeywords": [
      "one-dimensional",
      "two-dimensional",
      "flex-direction",
      "grid-template-columns",
      "fluid typography",
      "clamp()",
      "rem vs px"
    ],
    "idealAnswerRubric": "Explains 1D (content-first rows/columns in Flexbox) vs 2D (layout-first simultaneous rows and columns in Grid); mentions modern fluid sizing with clamp().",
    "coreCompetencyTested": "Frontend UI Architecture & Web Standards",
    "sampleAnswer": "Flexbox is a one-dimensional layout system designed for distributing space along a single axis (either row or column), making it ideal for navigation bars, button groups, and fluid linear item alignment. CSS Grid is a two-dimensional layout system designed for placing elements across rows and columns simultaneously, making it ideal for full-page scaffolding, dashboard card grids, and magazine-style layouts. For modern responsive typography, using rem units alongside CSS clamp() (e.g. font-size: clamp(1rem, 2.5vw, 2rem)) ensures fluid scaling between mobile and desktop without rigid media queries, while respecting user browser accessibility zoom settings.",
    "explanation": "Validates core frontend engineering fundamentals and modern CSS best practices.",
    "keyConcepts": [
      "1D vs 2D Layouts",
      "CSS Grid Fr Units",
      "Fluid clamp()",
      "Accessibility Sizing"
    ],
    "upvotes": 34,
    "targetRoles": [
      "Frontend Developer",
      "Full Stack Developer",
      "Software Engineer"
    ]
  },
  {
    "id": "qb-27",
    "title": "React 18 Concurrent Rendering & State Management Patterns",
    "category": "TECHNICAL",
    "domain": "Software Development",
    "difficulty": "INTERMEDIATE",
    "questionType": "TECHNICAL_DEEP_DIVE",
    "questionText": "How does React 18 Concurrent Rendering differ from legacy synchronous rendering? How do hooks like useTransition and useDeferredValue improve user experience?",
    "expectedKeywords": [
      "concurrent rendering",
      "fiber architecture",
      "interruptible",
      "useTransition",
      "useDeferredValue",
      "non-blocking UI"
    ],
    "idealAnswerRubric": "Explains interruptible rendering where high-priority interactions (typing, clicking) interrupt background render jobs (large lists, filtering); explains useTransition.",
    "coreCompetencyTested": "Modern React Architecture & Frontend Performance",
    "sampleAnswer": "In previous React versions, once a render cycle began, it was synchronous and could not be paused, causing frames to drop and UI freezes during heavy computations. React 18 Concurrent Mode makes rendering interruptible via the Fiber reconciler. Urgent updates (typing in an input, clicking a button) take priority over non-urgent updates (re-rendering a large data table). The useTransition hook allows developers to mark state updates as transitions, keeping the input responsive while the expensive view renders in the background. Similarly, useDeferredValue defers recomputing derived values until high-priority renders finish.",
    "explanation": "Tests deep knowledge of the React reconciliation engine and client-side responsiveness.",
    "keyConcepts": [
      "Concurrent Mode",
      "useTransition",
      "Fiber Reconciler",
      "Non-blocking UI"
    ],
    "upvotes": 46,
    "targetRoles": [
      "Frontend Developer",
      "Full Stack Developer"
    ]
  },
  {
    "id": "qb-28",
    "title": "Salary & Compensation Negotiation: Professional Framing",
    "category": "HR",
    "domain": "Human Resources",
    "difficulty": "BEGINNER",
    "questionType": "SHORT_ANSWER",
    "questionText": "When an HR recruiter asks for your current compensation or expectations early in the screening process, how do you handle the question professionally to preserve negotiation leverage?",
    "expectedKeywords": [
      "market research",
      "total compensation",
      "defer negotiation",
      "mutual fit",
      "range"
    ],
    "idealAnswerRubric": "Deflects premature anchors politely by focusing on role scope and mutual fit; shares a researched market range based on total compensation.",
    "coreCompetencyTested": "Commercial Acumen & Professional Negotiation",
    "sampleAnswer": "I respond with polite transparency focused on mutual value: \"Right now, my primary focus is understanding the specific challenges and impact of this role to ensure we are a strong mutual fit. Once we establish that, I am confident we can agree on a fair figure. Based on my research of market benchmarks for this seniority in our location, I am targeting a total compensation package in the $X to $Y range, factoring in base, bonus, and equity. Does that align with your approved budget for this opening?\"",
    "explanation": "Evaluates negotiation tact, professional boundary setting, and market awareness.",
    "keyConcepts": [
      "Market Anchoring",
      "Total Compensation Framing",
      "Collaborative Negotiation"
    ],
    "upvotes": 38,
    "targetRoles": [
      "All Roles",
      "Software Engineer"
    ]
  },
  {
    "id": "qb-29",
    "title": "Handling a Team Culture Crisis: Toxic Behavior or Burnout",
    "category": "BEHAVIORAL",
    "domain": "Human Resources",
    "difficulty": "ADVANCED",
    "questionType": "BEHAVIORAL_STAR",
    "questionText": "Describe a time when you recognized signs of developer burnout or toxic communication within your engineering team. What concrete steps did you take to protect team morale and psychological safety?",
    "expectedKeywords": [
      "psychological safety",
      "burnout",
      "1-on-1",
      "workload rebalancing",
      "sustainable pace",
      "blameless culture"
    ],
    "idealAnswerRubric": "Recognizes subtle early warning signs (snapping in PRs, missed standups); outlines empathetic 1-on-1 conversations, workload triage, and establishing healthy operational norms.",
    "coreCompetencyTested": "Empathy, Psychological Safety & Team Health",
    "sampleAnswer": "During a grueling multi-month product migration, I noticed two senior engineers displaying severe signs of exhaustion—skipping team standups, cynical comments during code reviews, and working late into the night. (Situation) Morale was deteriorating and psychological safety was eroding. (Task) As a team lead, I initiated private 1-on-1 check-ins to listen without judgment and validate their stress. (Action) I took three concrete actions: 1) Rebalanced on-call rotations to introduce mandatory cooldown weeks; 2) Triaged the backlog with our PM to cut non-critical deliverables; 3) Instituted a strict \"no Slack mentions after 7 PM\" policy. (Result) Voluntary attrition stayed at zero, team engagement rebounded, and the release delivered with highest code quality.",
    "explanation": "Evaluates emotional intelligence, supportive leadership, and operational culture development.",
    "keyConcepts": [
      "Psychological Safety",
      "Burnout Mitigation",
      "Empathetic 1-on-1s",
      "Sustainable Pace"
    ],
    "upvotes": 42,
    "targetRoles": [
      "Engineering Manager / Lead",
      "Software Engineer",
      "All Roles"
    ]
  },
  {
    "id": "qb-30",
    "title": "Optimizing SQL Queries: Execution Plans and Composite Indexes",
    "category": "TECHNICAL",
    "domain": "Software Development",
    "difficulty": "INTERMEDIATE",
    "questionType": "TECHNICAL_DEEP_DIVE",
    "questionText": "A slow SQL query filtering on `status = active` and `created_at > date` ordered by `priority` is causing high CPU spikes. How do you analyze its EXPLAIN plan, and how does index column order affect composite index performance?",
    "expectedKeywords": [
      "EXPLAIN ANALYZE",
      "index scan",
      "sequential scan",
      "composite index",
      "left-to-right rule",
      "covering index"
    ],
    "idealAnswerRubric": "Walks through reading EXPLAIN output (seq scan vs index scan); details the Leftmost Prefix rule for composite index order: equality columns first, then range/sort columns.",
    "coreCompetencyTested": "Query Optimization & Relational Database Tuning",
    "sampleAnswer": "I start by running EXPLAIN (ANALYZE, BUFFERS) to inspect the execution plan, checking for Sequential Scans (Seq Scan) and heavy Disk Spill sorts. For a composite index to satisfy both filtering and sorting without an extra Sort step, the index column order matters strictly according to the Leftmost Prefix rule: 1) Equality columns first (status), 2) Range and Sort columns next (created_at, priority). Creating an index on (status, created_at, priority) allows the engine to jump directly to active rows and perform an Index Range Scan. If we also include selected columns via an INCLUDE clause, we achieve a Covering Index where the engine never touches the physical table heap.",
    "explanation": "Deep technical query optimization question essential for senior database performance.",
    "keyConcepts": [
      "EXPLAIN ANALYZE",
      "Composite Index Column Ordering",
      "Covering Index",
      "Leftmost Prefix Rule"
    ],
    "upvotes": 48,
    "targetRoles": [
      "Backend Engineer",
      "Database Administrator",
      "Software Engineer"
    ]
  },
  {
    "id": "qb-31",
    "title": "Event-Driven Microservices: Sagas vs. Two-Phase Commit (2PC)",
    "category": "SYSTEM_DESIGN",
    "domain": "Software Development",
    "difficulty": "ADVANCED",
    "questionType": "TECHNICAL_DEEP_DIVE",
    "questionText": "Why is Two-Phase Commit (2PC) considered an anti-pattern in modern cloud microservices, and how does the Saga Pattern (Choreography vs Orchestration) ensure eventual consistency across distributed services?",
    "expectedKeywords": [
      "Two-Phase Commit",
      "blocking",
      "Saga pattern",
      "compensating transactions",
      "choreography",
      "orchestration",
      "eventual consistency"
    ],
    "idealAnswerRubric": "Explains synchronous blocking and coordinator single point of failure in 2PC; contrasts Choreography (event-driven pub/sub) with Orchestration (central workflow coordinator) and compensating actions.",
    "coreCompetencyTested": "Distributed Transactions & Event-Driven Patterns",
    "sampleAnswer": "Two-Phase Commit (2PC) enforces strict ACID consistency by holding distributed locks across all participating nodes until all agree to commit. In cloud environments with network partitions, 2PC is an anti-pattern because it is synchronous, blocking, and creates a single point of failure at the coordinator. The Saga Pattern solves this through Eventual Consistency: a business transaction is broken into local transactions in each service. If a step fails (e.g. payment rejected), the Saga executes explicit Compensating Transactions in reverse order (e.g. unreserve inventory). Choreography relies on services listening to domain events; Orchestration uses a central orchestrator (like Temporal or AWS Step Functions) to manage execution state.",
    "explanation": "Advanced microservices distributed consistency pattern question.",
    "keyConcepts": [
      "Saga Pattern",
      "Compensating Transactions",
      "Orchestration vs Choreography",
      "Eventual Consistency"
    ],
    "upvotes": 55,
    "targetRoles": [
      "DevOps & Cloud Engineer",
      "System Architect",
      "Backend Engineer"
    ]
  },
  {
    "id": "qb-32",
    "title": "Handling Ambiguity in Product & Technical Requirements",
    "category": "BEHAVIORAL",
    "domain": "Product Management",
    "difficulty": "INTERMEDIATE",
    "questionType": "BEHAVIORAL_STAR",
    "questionText": "Describe a project where you were handed an ambiguous high-level prompt with little guidance (e.g., \"build an AI-powered onboarding system\"). How did you discover requirements, validate assumptions, and deliver results?",
    "expectedKeywords": [
      "ambiguity",
      "user research",
      "assumptions",
      "prototyping",
      "iterative delivery",
      "success metrics"
    ],
    "idealAnswerRubric": "Shows comfort with ambiguity: breaks down problem into customer jobs-to-be-done, interviews users/stakeholders, formulates testable hypotheses, and ships early MVPs.",
    "coreCompetencyTested": "Ownership, Self-Direction & Product Discovery",
    "sampleAnswer": "Our executive team asked us to \"make our user onboarding AI-driven\" with zero written specifications. (Situation) Rather than writing code blindly, I took ownership of discovery. (Task) I conducted 6 customer interviews, analyzed analytics where 34% of new users dropped off during workspace configuration, and formulated a hypothesis: users didn’t want a generic chatbot; they wanted intelligent pre-population of their profile based on their GitHub or LinkedIn URL. (Action) I created a lightweight clickable prototype in 3 days, validated it with 10 beta users, defined core success metrics (time-to-first-project), and built a simple 3-step wizard. (Result) Onboarding completion increased by 42% and time-to-value dropped from 15 minutes to under 3 minutes.",
    "explanation": "Evaluates senior autonomous thinking, customer empathy, and bias for rapid validation.",
    "keyConcepts": [
      "Discovery & De-risking",
      "Rapid Prototyping",
      "Hypothesis-Driven Development",
      "STAR Framework"
    ],
    "upvotes": 49,
    "targetRoles": [
      "Software Engineer",
      "Full Stack Developer",
      "Engineering Manager / Lead"
    ]
  },
  {
    "id": "qb-fe-1",
    "title": "React Fiber Architecture & Virtual DOM Reconciliation",
    "category": "TECHNICAL",
    "domain": "Software Development",
    "difficulty": "ADVANCED",
    "targetRoles": [
      "Frontend Developer",
      "Full Stack Developer",
      "Software Engineer"
    ],
    "questionType": "TECHNICAL_DEEP_DIVE",
    "questionText": "How does React Fiber differ from the legacy stack reconciler, and how does it enable incremental rendering and concurrent features?",
    "expectedKeywords": [
      "Fiber node",
      "reconciliation",
      "render phase",
      "commit phase",
      "time slicing",
      "requestIdleCallback",
      "workInProgress"
    ],
    "idealAnswerRubric": "Explains fiber tree structure, split between interruptible render phase and atomic commit phase, and cooperative scheduling.",
    "coreCompetencyTested": "Frontend Architecture & Rendering Engine",
    "sampleAnswer": "React Fiber reimplemented the reconciliation algorithm as a linked list of Fiber nodes representing components. Unlike the synchronous, call-stack-bound legacy reconciler, Fiber splits work into chunks. The Render Phase is asynchronous and interruptible via cooperative time-slicing, calculating diffs without DOM mutations. Once complete, the Commit Phase synchronously applies changes to the actual DOM in one atomic batch, enabling Concurrent Mode, Suspense, and smooth UI frame rates.",
    "explanation": "Assesses deep knowledge of modern frontend frameworks and performance optimization.",
    "keyConcepts": [
      "React Fiber",
      "WorkInProgress Tree",
      "Concurrent Rendering",
      "Time Slicing"
    ],
    "upvotes": 45
  },
  {
    "id": "qb-fe-2",
    "title": "Mastering Core Web Vitals (LCP, INP, CLS)",
    "category": "TECHNICAL",
    "domain": "Software Development",
    "difficulty": "INTERMEDIATE",
    "targetRoles": [
      "Frontend Developer",
      "Full Stack Developer"
    ],
    "questionType": "SCENARIO",
    "questionText": "A high-traffic e-commerce landing page has poor Core Web Vitals (high LCP and CLS). How do you diagnose and systematically fix these issues?",
    "expectedKeywords": [
      "LCP",
      "CLS",
      "INP",
      "critical CSS",
      "font-display",
      "fetchpriority",
      "layout shift",
      "aspect-ratio"
    ],
    "idealAnswerRubric": "Breaks down metrics: LCP optimization (hero image preloading, CDN caching), CLS stabilization (explicit image dimensions, font swapping).",
    "coreCompetencyTested": "Web Performance Engineering & User Experience",
    "sampleAnswer": "For Largest Contentful Paint (LCP), I would identify the hero element, preload it with fetchpriority=\"high\", inline critical CSS, and serve AVIF/WebP through an edge CDN. For Cumulative Layout Shift (CLS), I would specify explicit width and height attributes or CSS aspect-ratio on all images and ad containers, reserve layout space for dynamic widgets, and use font-display: optional or size-adjust to eliminate FOIT/FOUT shift.",
    "explanation": "Evaluates production frontend diagnostic instincts and modern Google Web Vitals remediation.",
    "keyConcepts": [
      "Core Web Vitals",
      "Largest Contentful Paint",
      "Cumulative Layout Shift",
      "Resource Hints"
    ],
    "upvotes": 39
  },
  {
    "id": "qb-fe-3",
    "title": "CSS Stacking Context, Specificity & Scalable Architecture",
    "category": "TECHNICAL",
    "domain": "Software Development",
    "difficulty": "BEGINNER",
    "targetRoles": [
      "Frontend Developer",
      "Software Engineer"
    ],
    "questionType": "TECHNICAL_DEEP_DIVE",
    "questionText": "Why does a z-index of 9999 sometimes fail to bring an element above another? Explain stacking context creation and how you organize scalable CSS.",
    "expectedKeywords": [
      "stacking context",
      "z-index",
      "opacity",
      "transform",
      "isolation",
      "specificity hierarchy",
      "BEM"
    ],
    "idealAnswerRubric": "Explains rules triggering stacking context (transform, opacity < 1, filter, isolation: isolate) and CSS specificity calculation.",
    "coreCompetencyTested": "CSS Mechanics & Layout Mastery",
    "sampleAnswer": "A high z-index fails when the element is trapped inside an ancestor that has formed its own isolated stacking context with a lower z-index than sibling trees. Properties like transform, opacity < 1, filter, and will-change create new stacking contexts. To prevent z-index wars in large projects, I use isolation: isolate on component boundaries, design a centralized z-index token scale, and adopt CSS modules or BEM to keep specificity low and flat.",
    "explanation": "Tests fundamental browser rendering and styling architecture.",
    "keyConcepts": [
      "Stacking Context",
      "Z-Index Wars",
      "CSS Specificity",
      "Component Isolation"
    ],
    "upvotes": 34
  },
  {
    "id": "qb-fe-4",
    "title": "Frontend State Management: Context API vs Zustand vs Redux",
    "category": "TECHNICAL",
    "domain": "Software Development",
    "difficulty": "INTERMEDIATE",
    "targetRoles": [
      "Frontend Developer",
      "Full Stack Developer"
    ],
    "questionType": "TECHNICAL_DEEP_DIVE",
    "questionText": "When would you reach for React Context vs an external store like Zustand or Redux Toolkit? What are the performance implications regarding re-renders?",
    "expectedKeywords": [
      "re-renders",
      "selector pattern",
      "context consumer",
      "store subscription",
      "boilerplate",
      "immutability"
    ],
    "idealAnswerRubric": "Identifies that Context re-renders all consumers on any value change, whereas Zustand/Redux use selector-based subscriptions to prevent unnecessary renders.",
    "coreCompetencyTested": "State Architecture & React Performance",
    "sampleAnswer": "React Context is designed for low-frequency global state like theme or authenticated user. When Context value changes, all consuming components re-render regardless of which slice they use. For high-frequency, complex state, external stores like Zustand or Redux Toolkit are superior because they use fine-grained selector subscriptions—components only re-render if their selected derived state changes, avoiding cascade re-renders.",
    "explanation": "Evaluates architectural judgment on state granularity and component lifecycle optimization.",
    "keyConcepts": [
      "State Management",
      "Selector Pattern",
      "Re-render Optimization",
      "Zustand vs Redux"
    ],
    "upvotes": 41
  },
  {
    "id": "qb-be-1",
    "title": "Database Connection Pool Exhaustion & PgBouncer",
    "category": "TECHNICAL",
    "domain": "Software Development",
    "difficulty": "ADVANCED",
    "targetRoles": [
      "Backend Engineer",
      "System Architect",
      "Software Engineer"
    ],
    "questionType": "TECHNICAL_DEEP_DIVE",
    "questionText": "Why is having 10,000 direct database connections inefficient in PostgreSQL, and how does connection pooling like PgBouncer solve this?",
    "expectedKeywords": [
      "process-per-connection",
      "RAM overhead",
      "context switching",
      "pgbouncer",
      "transaction pooling",
      "connection leak"
    ],
    "idealAnswerRubric": "Explains PostgreSQL fork/process memory overhead (10MB+ per conn), CPU context switching thrash, and transaction-level vs session pooling.",
    "coreCompetencyTested": "Database Systems & High-Concurrency Backend",
    "sampleAnswer": "PostgreSQL allocates a dedicated backend process for each direct connection, consuming 5-10MB+ of RAM and creating intense OS context switching when thousands of connections compete for CPU cores. PgBouncer sits as a lightweight proxy, maintaining a small pool of persistent database connections (e.g. 50-100) while accepting thousands of client sockets. In transaction pooling mode, a connection is borrowed only for the duration of a transaction and returned immediately, multiplying throughput.",
    "explanation": "Crucial for senior backend engineers dealing with horizontal scaling and microservices.",
    "keyConcepts": [
      "Connection Pooling",
      "PgBouncer",
      "Context Switching",
      "Process Overhead"
    ],
    "upvotes": 52
  },
  {
    "id": "qb-be-2",
    "title": "Caching Topologies: Cache-Aside vs Write-Through vs Write-Back",
    "category": "TECHNICAL",
    "domain": "Software Development",
    "difficulty": "INTERMEDIATE",
    "targetRoles": [
      "Backend Engineer",
      "System Architect",
      "Full Stack Developer"
    ],
    "questionType": "TECHNICAL_DEEP_DIVE",
    "questionText": "Compare Cache-Aside, Write-Through, and Write-Back caching strategies. What are the consistency and failure trade-offs of each?",
    "expectedKeywords": [
      "cache-aside",
      "write-through",
      "write-back",
      "cache invalidation",
      "thundering herd",
      "data loss risk",
      "stale reads"
    ],
    "idealAnswerRubric": "Compares read/write latencies, risk of data loss in write-back, and cache consistency handling during high write volumes.",
    "coreCompetencyTested": "Caching Architecture & Distributed Consistency",
    "sampleAnswer": "In Cache-Aside (Lazy Loading), application queries cache first; on miss, queries DB and populates cache. Writes go directly to DB and invalidate cache. In Write-Through, data is written to cache and DB synchronously, ensuring high consistency at the cost of higher write latency. In Write-Back (Write-Behind), data is written to cache immediately and asynchronously flushed to DB in batches, providing ultra-low write latency but risking data loss if cache nodes crash before persistence.",
    "explanation": "Evaluates architectural judgment on speed vs data durability.",
    "keyConcepts": [
      "Cache-Aside",
      "Write-Through",
      "Write-Back",
      "Cache Invalidation"
    ],
    "upvotes": 44
  },
  {
    "id": "qb-be-3",
    "title": "Message Queues: Apache Kafka vs RabbitMQ",
    "category": "TECHNICAL",
    "domain": "Software Development",
    "difficulty": "ADVANCED",
    "targetRoles": [
      "Backend Engineer",
      "System Architect",
      "DevOps & Cloud Engineer"
    ],
    "questionType": "TECHNICAL_DEEP_DIVE",
    "questionText": "When would you select RabbitMQ over Apache Kafka, and vice versa? Detail the differences in message consumption and persistence models.",
    "expectedKeywords": [
      "log-based",
      "smart broker dumb consumer",
      "dumb broker smart consumer",
      "partitioning",
      "replayability",
      "AMQP routing"
    ],
    "idealAnswerRubric": "Contrasts RabbitMQ (message broker, queue-based, complex routing, message deleted after ack) with Kafka (distributed commit log, partitioned, durable replay, massive streaming throughput).",
    "coreCompetencyTested": "Event-Driven Architecture & Distributed Messaging",
    "sampleAnswer": "RabbitMQ is an AMQP message broker best suited for complex routing (topic/direct exchanges), transactional task distribution, and per-message acknowledgments where messages are deleted once consumed. Kafka is a distributed, append-only commit log designed for high-throughput event streaming, log retention, and replayability. Consumers track their own offsets in partitions, allowing multiple independent consumer groups to read history at their own pace.",
    "explanation": "Tests architectural selection criteria for asynchronous communication pipelines.",
    "keyConcepts": [
      "Kafka vs RabbitMQ",
      "Commit Log",
      "Partition Rebalancing",
      "Message Replay"
    ],
    "upvotes": 47
  },
  {
    "id": "qb-be-4",
    "title": "gRPC & Protocol Buffers vs RESTful JSON",
    "category": "TECHNICAL",
    "domain": "Software Development",
    "difficulty": "INTERMEDIATE",
    "targetRoles": [
      "Backend Engineer",
      "System Architect",
      "Software Engineer"
    ],
    "questionType": "TECHNICAL_DEEP_DIVE",
    "questionText": "Why do high-throughput internal microservices prefer gRPC with Protocol Buffers over RESTful HTTP/1.1 JSON APIs?",
    "expectedKeywords": [
      "HTTP/2",
      "binary serialization",
      "multiplexing",
      "strongly typed",
      "code generation",
      "streaming"
    ],
    "idealAnswerRubric": "Highlights binary encoding density (smaller payload), HTTP/2 multiplexing, bi-directional streaming, and compile-time contract enforcement.",
    "coreCompetencyTested": "Inter-Service Communication & Microservice Protocols",
    "sampleAnswer": "gRPC operates over HTTP/2, providing TCP connection reuse, multiplexed concurrent streams without head-of-line blocking, and header compression. Protocol Buffers (protobuf) serialize structured data into compact binary rather than human-readable text JSON, reducing CPU deserialization overhead by up to 70% and slashing payload size. Furthermore, Protobuf enforces strict contracts through generated client/server stubs.",
    "explanation": "Tests knowledge of backend networking, serialization costs, and microservice RPC.",
    "keyConcepts": [
      "gRPC",
      "Protocol Buffers",
      "HTTP/2 Multiplexing",
      "Binary Serialization"
    ],
    "upvotes": 38
  },
  {
    "id": "qb-fs-1",
    "title": "Full-Stack Security: Mitigating CSRF, XSS, and SQL Injection",
    "category": "TECHNICAL",
    "domain": "Software Development",
    "difficulty": "INTERMEDIATE",
    "targetRoles": [
      "Full Stack Developer",
      "Software Engineer",
      "Cybersecurity Engineer"
    ],
    "questionType": "SCENARIO",
    "questionText": "How do you safeguard a React frontend and Node.js/PostgreSQL backend against XSS, CSRF, and SQL Injection vulnerabilities?",
    "expectedKeywords": [
      "parameterized queries",
      "Content Security Policy (CSP)",
      "SameSite cookies",
      "HttpOnly",
      "escaping",
      "CORS"
    ],
    "idealAnswerRubric": "Covers parameterized SQL queries, HttpOnly + SameSite=Strict cookies for session management, and robust Content Security Policy against XSS.",
    "coreCompetencyTested": "End-to-End Application Security",
    "sampleAnswer": "To prevent SQL Injection, use parameterized queries or trusted ORMs rather than string concatenation. To prevent Cross-Site Scripting (XSS), avoid dangerouslySetInnerHTML, sanitize user inputs, and enforce a strict Content Security Policy (CSP) header. To prevent CSRF, store authentication tokens in HttpOnly, Secure cookies with SameSite=Strict/Lax, or validate an anti-CSRF token header on state-changing requests.",
    "explanation": "Critical full-stack competency examining defense-in-depth across frontend and backend.",
    "keyConcepts": [
      "CSRF Mitigation",
      "XSS Prevention",
      "Parameterized Queries",
      "HttpOnly Cookies"
    ],
    "upvotes": 43
  },
  {
    "id": "qb-fs-2",
    "title": "Stateful Sessions vs Stateless JWT: Pros, Cons & Revocation",
    "category": "TECHNICAL",
    "domain": "Software Development",
    "difficulty": "INTERMEDIATE",
    "targetRoles": [
      "Full Stack Developer",
      "Backend Engineer",
      "Software Engineer"
    ],
    "questionType": "TECHNICAL_DEEP_DIVE",
    "questionText": "Compare stateful server-side sessions (e.g. Redis) with stateless JWT tokens. How do you implement instant token revocation in JWT?",
    "expectedKeywords": [
      "stateless",
      "token revocation",
      "Redis blacklist",
      "refresh token rotation",
      "payload size",
      "cryptographic signature"
    ],
    "idealAnswerRubric": "Explains JWT benefits (decentralized validation) vs challenge of instant logout/ban, contrasting with Redis-backed session stores and refresh token rotation.",
    "coreCompetencyTested": "Authentication & Session Architecture",
    "sampleAnswer": "Stateless JWTs eliminate database lookups for auth validation because identity and roles are cryptographically signed. However, invalidating a leaked token before its expiry requires maintaining a blacklist in a centralized store like Redis, effectively re-introducing state. Stateful sessions (Redis session IDs) allow instant revocation, permission updates, and device logout at the cost of centralized lookups. An optimal hybrid approach uses short-lived access JWTs (10 min) paired with revolving refresh tokens stored in Redis.",
    "explanation": "Tests real-world auth architecture and security trade-offs.",
    "keyConcepts": [
      "JWT vs Sessions",
      "Token Revocation",
      "Refresh Token Rotation",
      "Redis Session Store"
    ],
    "upvotes": 46
  },
  {
    "id": "qb-ds-1",
    "title": "Production RAG Architecture: Chunking, Embeddings & Reranking",
    "category": "TECHNICAL",
    "domain": "Artificial Intelligence",
    "difficulty": "ADVANCED",
    "targetRoles": [
      "Data Scientist / AI Engineer",
      "Software Engineer",
      "System Architect"
    ],
    "questionType": "TECHNICAL_DEEP_DIVE",
    "questionText": "Walk through the pipeline of a production-grade Retrieval-Augmented Generation (RAG) system. How do chunking strategy, vector search, and cross-encoder reranking impact accuracy?",
    "expectedKeywords": [
      "vector embeddings",
      "chunk overlap",
      "cosine similarity",
      "HNSW index",
      "cross-encoder reranker",
      "hallucination reduction",
      "context window"
    ],
    "idealAnswerRubric": "Details document ingestion (semantic chunking with overlap), approximate nearest neighbor vector retrieval, two-stage cross-encoder reranking, and prompt grounding.",
    "coreCompetencyTested": "GenAI & Information Retrieval Systems",
    "sampleAnswer": "A production RAG pipeline starts with ingestion: documents are parsed and split using semantic chunking (e.g. 512 tokens with 10% overlap). High-dimensional embeddings are indexed in a vector database using HNSW. At query time, top-k candidate chunks (e.g. k=25) are retrieved via bi-encoder cosine similarity. Next, a computationally intensive Cross-Encoder Reranker scores query-document pairs to filter down to the top 3-5 most relevant chunks. Finally, these chunks ground the LLM prompt to minimize hallucinations.",
    "explanation": "Tests cutting-edge Generative AI engineering and information retrieval best practices.",
    "keyConcepts": [
      "RAG Pipeline",
      "Vector Embeddings",
      "Cross-Encoder Reranking",
      "Semantic Chunking"
    ],
    "upvotes": 54
  },
  {
    "id": "qb-ds-2",
    "title": "Imbalanced Classification: Precision, Recall & PR-AUC vs ROC-AUC",
    "category": "TECHNICAL",
    "domain": "Data Science",
    "difficulty": "INTERMEDIATE",
    "targetRoles": [
      "Data Scientist / AI Engineer"
    ],
    "questionType": "TECHNICAL_DEEP_DIVE",
    "questionText": "When evaluating fraud detection where positive cases are only 0.1%, why is ROC-AUC dangerously misleading, and why is PR-AUC preferred?",
    "expectedKeywords": [
      "class imbalance",
      "false positive rate",
      "true positive rate",
      "precision-recall curve",
      "ROC-AUC",
      "F1-score"
    ],
    "idealAnswerRubric": "Explains that False Positive Rate in ROC uses total negatives as denominator, masking huge absolute false positive numbers when negatives overwhelmingly dominate.",
    "coreCompetencyTested": "Model Evaluation Metrics & Statistical Rigor",
    "sampleAnswer": "In severe class imbalance, ROC-AUC evaluates True Positive Rate against False Positive Rate (FP / (FP + TN)). Because True Negatives (TN) are vast, the FPR remains near zero even if false positives outnumber actual fraud cases 100 to 1, creating an artificially high ROC-AUC. Precision-Recall AUC (PR-AUC) evaluates Precision (TP / (TP + FP)) against Recall, directly measuring how many flagged transactions were true fraud and exposing high false-alarm rates.",
    "explanation": "Fundamental data science question testing real-world evaluation metrics in imbalanced domains.",
    "keyConcepts": [
      "Class Imbalance",
      "PR-AUC vs ROC-AUC",
      "Precision-Recall",
      "Fraud Detection Metrics"
    ],
    "upvotes": 48
  },
  {
    "id": "qb-do-1",
    "title": "Kubernetes Pod Autoscaling (HPA) & Resource Management",
    "category": "TECHNICAL",
    "domain": "Cloud Computing",
    "difficulty": "INTERMEDIATE",
    "targetRoles": [
      "DevOps & Cloud Engineer",
      "System Architect",
      "Backend Engineer"
    ],
    "questionType": "TECHNICAL_DEEP_DIVE",
    "questionText": "How does the Kubernetes Horizontal Pod Autoscaler (HPA) make scaling decisions, and what happens when CPU limits are set too aggressively?",
    "expectedKeywords": [
      "HPA",
      "metrics-server",
      "requests vs limits",
      "CPU throttling",
      "OOMKilled",
      "target utilization"
    ],
    "idealAnswerRubric": "Explains HPA formula (desiredReplicas = ceil[currentReplicas * (currentMetric / targetMetric)]), and CFS CPU throttling vs OOMKilled memory termination.",
    "coreCompetencyTested": "Kubernetes Orchestration & Infrastructure Tuning",
    "sampleAnswer": "The HPA controller queries the metrics-server periodically and calculates desired replicas using the ratio of current metric utilization to target utilization relative to pod resource requests. When CPU limits are set too restrictively, Linux Completely Fair Scheduler (CFS) enforces hard CPU throttling rather than pod restarts, degrading API response times and latency. Conversely, exceeding memory limits immediately triggers kernel OOMKilled pod termination.",
    "explanation": "Evaluates production Kubernetes container lifecycle and scaling diagnostics.",
    "keyConcepts": [
      "Horizontal Pod Autoscaler",
      "CPU Throttling",
      "OOMKilled",
      "Resource Requests & Limits"
    ],
    "upvotes": 42
  },
  {
    "id": "qb-do-2",
    "title": "Zero-Downtime Releases: Blue-Green vs Canary Deployments",
    "category": "TECHNICAL",
    "domain": "Cloud Computing",
    "difficulty": "INTERMEDIATE",
    "targetRoles": [
      "DevOps & Cloud Engineer",
      "Backend Engineer",
      "Software Engineer"
    ],
    "questionType": "SCENARIO",
    "questionText": "Compare Blue-Green deployment with Canary deployment. How do you implement progressive traffic shifting and automated rollbacks?",
    "expectedKeywords": [
      "traffic shifting",
      "ingress router",
      "automated canary analysis",
      "rollback trigger",
      "service mesh",
      "database schema migration"
    ],
    "idealAnswerRubric": "Details instant switchover (Blue-Green) vs incremental percentage rollout (Canary: 1% -> 5% -> 25% -> 100%) with error rate monitoring and backward-compatible migrations.",
    "coreCompetencyTested": "Continuous Delivery & Release Engineering",
    "sampleAnswer": "In Blue-Green deployment, two identical environments exist. Traffic is instantly flipped 100% from Blue to Green at the router level, allowing fast rollback but requiring 2x infrastructure cost. In Canary deployment, new versions are deployed to a tiny subset of pods receiving 1-5% of traffic. Telemetry (error rates, p99 latency) is continuously compared against the baseline. If errors spike, the canary is automatically aborted. Both require backward-compatible database schema migrations.",
    "explanation": "Evaluates production deployment risk management and automated CD pipelines.",
    "keyConcepts": [
      "Canary Deployment",
      "Blue-Green Deployment",
      "Progressive Delivery",
      "Automated Rollback"
    ],
    "upvotes": 39
  },
  {
    "id": "qb-sa-1",
    "title": "Design a 64-bit Distributed Unique ID Generator (Snowflake ID)",
    "category": "TECHNICAL",
    "domain": "Software Development",
    "difficulty": "ADVANCED",
    "targetRoles": [
      "System Architect",
      "Backend Engineer",
      "Software Engineer"
    ],
    "questionType": "TECHNICAL_DEEP_DIVE",
    "questionText": "Why can we not rely on auto-incrementing database primary keys across distributed clusters? Design a 64-bit Snowflake ID generation scheme.",
    "expectedKeywords": [
      "Twitter Snowflake",
      "timestamp bits",
      "machine ID",
      "sequence number",
      "clock drift",
      "monotonically increasing",
      "64-bit integer"
    ],
    "idealAnswerRubric": "Breaks down 64-bit layout (1 sign bit, 41 timestamp bits for ~69 years, 10 machine/datacenter bits for 1024 nodes, 12 sequence bits for 4096 IDs/ms per node), and explains clock drift handling.",
    "coreCompetencyTested": "Distributed Systems & Architecture Design",
    "sampleAnswer": "Centralized auto-incrementing database IDs introduce a single point of failure and bottleneck when sharded across databases. Twitter Snowflake generates unique, roughly time-sorted 64-bit integers without inter-node coordination: 1 unused sign bit; 41 bits for epoch timestamp (giving 69 years of millisecond precision); 10 bits for Datacenter & Worker Machine IDs (supporting 1,024 servers); and 12 bits for a local sequence counter (allowing 4,096 IDs per millisecond per node). NTP clock drift is handled by refusing generation if current time is behind last timestamp.",
    "explanation": "Classic distributed systems design question testing bitwise layout, scalability, and time synchronization.",
    "keyConcepts": [
      "Snowflake ID",
      "Distributed Unique Keys",
      "Clock Drift Mitigation",
      "Bitwise Allocation"
    ],
    "upvotes": 58
  },
  {
    "id": "qb-sec-1",
    "title": "Mutual TLS (mTLS) & Service Mesh Zero-Trust Communication",
    "category": "TECHNICAL",
    "domain": "Cybersecurity",
    "difficulty": "ADVANCED",
    "targetRoles": [
      "Cybersecurity Engineer",
      "DevOps & Cloud Engineer",
      "System Architect"
    ],
    "questionType": "TECHNICAL_DEEP_DIVE",
    "questionText": "How does Mutual TLS (mTLS) provide both cryptographic encryption and cryptographic identity verification between microservices?",
    "expectedKeywords": [
      "mTLS",
      "X.509 certificate",
      "Public Key Infrastructure (PKI)",
      "SPIFFE/SPIRE",
      "sidecar proxy",
      "handshake",
      "service mesh"
    ],
    "idealAnswerRubric": "Explains bidirectional certificate validation (client verifies server, server verifies client against trusted CA), traffic encryption, and SPIFFE identity embedding.",
    "coreCompetencyTested": "Network Cryptography & Zero-Trust Architecture",
    "sampleAnswer": "Standard TLS validates only the server identity. In Mutual TLS (mTLS), during the TLS handshake, both client and server present X.509 digital certificates issued by a trusted internal Certificate Authority (CA). Both parties verify each others signatures, establish session keys, and encrypt all packet data in transit. In a service mesh (Istio/Envoy), sidecar proxies handle mTLS transparently, embedding cryptographic SPIFFE IDs into the Subject Alternative Name (SAN) for zero-trust authorization.",
    "explanation": "Evaluates advanced cryptographic infrastructure and identity verification.",
    "keyConcepts": [
      "Mutual TLS",
      "X.509 Certificates",
      "Service Mesh Security",
      "SPIFFE ID"
    ],
    "upvotes": 43
  },
  {
    "id": "qb-qa-1",
    "title": "Page Object Model (POM) vs. App Actions in E2E Automation",
    "category": "TECHNICAL",
    "domain": "QA Automation & SDET",
    "difficulty": "INTERMEDIATE",
    "targetRoles": [
      "QA Automation & SDET",
      "Software Test Engineer",
      "Full Stack Developer"
    ],
    "questionType": "TECHNICAL_DEEP_DIVE",
    "questionText": "What are the core design principles of the Page Object Model (POM) in UI test automation (Playwright/Selenium/Cypress)? When would you favor App Actions or Component Objects over traditional monolithic POM classes?",
    "expectedKeywords": [
      "Page Object Model",
      "encapsulation",
      "locator abstraction",
      "maintainability",
      "App Actions",
      "Playwright fixtures",
      "Component Object Model"
    ],
    "idealAnswerRubric": "Demonstrates clear separation of test logic from selector logic, encapsulation of UI interactions, mitigation of brittle tests, and explains why modern test runners like Cypress and Playwright leverage App Actions / API state injection or modular Component Objects to avoid bloated POM hierarchies.",
    "coreCompetencyTested": "Test Automation Architecture & Maintainability",
    "sampleAnswer": "Page Object Model encapsulates web page structure and user interactions into reusable class abstractions, hiding DOM selectors (CSS/XPath) and assertions from the test script. This localizes UI refactoring so a selector change only updates a single page class. However, traditional POMs can become bloated god objects. Modern frameworks like Playwright and Cypress favor Component Objects (smaller reusable widgets like Navbar or Modal) or App Actions (seeding application state directly via API/cookies/session rather than automating 10 UI clicks to log in), yielding drastically faster and less brittle tests.",
    "explanation": "Tests fundamental test automation design patterns, selector encapsulation, and modern execution optimizations.",
    "keyConcepts": [
      "Page Object Model (POM)",
      "App Actions",
      "Selector Encapsulation",
      "Playwright & Cypress Patterns",
      "UI Test Maintainability"
    ],
    "upvotes": 64
  },
  {
    "id": "qb-qa-2",
    "title": "Mitigating Flaky Tests and Async Race Conditions in CI/CD Suites",
    "category": "TECHNICAL",
    "domain": "QA Automation & SDET",
    "difficulty": "ADVANCED",
    "targetRoles": [
      "QA Automation & SDET",
      "DevOps & Cloud Engineer",
      "Software Engineer"
    ],
    "questionType": "SCENARIO",
    "questionText": "A 500-test CI/CD automation suite has an 8% flaky failure rate causing blocked PR merges. What systematic steps do you take to identify, isolate, diagnose, and permanently eliminate flakiness without resorting to arbitrary sleep delays?",
    "expectedKeywords": [
      "flaky tests",
      "explicit waits",
      "polling vs sleep",
      "test isolation",
      "database seeding",
      "network interception",
      "auto-waiting",
      "quarantine pipeline"
    ],
    "idealAnswerRubric": "Addresses root causes of flakiness: asynchronous timing (replacing thread sleeps with dynamic wait-for-condition/auto-waiting), shared test state (database teardown/seeding per worker), race conditions, and network dependency (mocking/har recording), along with operational controls like quarantining flaky tests.",
    "coreCompetencyTested": "Test Reliability & CI/CD Pipeline Stability",
    "sampleAnswer": "To eliminate flaky tests systematically: First, quarantine consistently failing tests to an isolated non-blocking monitoring build to keep production PRs flowing while gathering execution logs, video replays, and trace files. Second, eliminate all hardcoded sleeps (time.sleep/Thread.sleep) and replace them with event-driven web assertions and dynamic auto-waiting (such as Playwright expect.toBeVisible or WebDriverWait). Third, ensure atomic test isolation: every test must create its own isolated user and clean test fixture via database transactions or dedicated API seeds rather than relying on previous test states. Fourth, stub third-party external networks via API mocking to remove internet volatility.",
    "explanation": "Key interview scenario assessing an SDET's ability to maintain high-velocity developer pipelines.",
    "keyConcepts": [
      "Flaky Test Resolution",
      "Dynamic Explicit Waits",
      "Test Quarantine Strategy",
      "State Isolation & Teardown"
    ],
    "upvotes": 71
  },
  {
    "id": "qb-qa-3",
    "title": "Equivalence Partitioning & Boundary Value Analysis (BVA)",
    "category": "TECHNICAL",
    "domain": "Software Testing & QA (Manual & Functional)",
    "difficulty": "BEGINNER",
    "targetRoles": [
      "Software Test Engineer",
      "QA Automation & SDET",
      "Software Engineer"
    ],
    "questionType": "TECHNICAL_DEEP_DIVE",
    "questionText": "Explain the difference between Equivalence Partitioning and Boundary Value Analysis (BVA). If an input field accepts candidate age between 18 and 65 inclusive, what test cases would you construct using 2-point and 3-point boundary value testing?",
    "expectedKeywords": [
      "Equivalence Partitioning",
      "Boundary Value Analysis",
      "valid partitions",
      "invalid partitions",
      "boundary edges",
      "off-by-one errors"
    ],
    "idealAnswerRubric": "Defines valid and invalid equivalence classes. Details exact boundary values for 18 and 65: 2-point BVA (17, 18, 65, 66) and 3-point BVA (17, 18, 19, 64, 65, 66), plus mid-range valid and invalid non-numeric cases.",
    "coreCompetencyTested": "Black-Box Test Design Techniques",
    "sampleAnswer": "Equivalence Partitioning divides input domain data into valid and invalid partitions where all members are assumed to be processed identically by the system. For an age field [18, 65]: Invalid Partition (<18), Valid Partition (18-65), and Invalid Partition (>65). Boundary Value Analysis focuses on the boundaries between partitions where defects (like off-by-one errors) statistically cluster. Using 2-point BVA (on the boundary and just outside): we test 17 (invalid), 18 (valid min), 65 (valid max), and 66 (invalid). For 3-point BVA (just below, on, and just above): we test 17, 18, 19 and 64, 65, 66.",
    "explanation": "Tests fundamental test case design methodology and precision in edge-case enumeration.",
    "keyConcepts": [
      "Boundary Value Analysis",
      "Equivalence Partitioning",
      "Edge-Case Identification",
      "Test Case Optimization"
    ],
    "upvotes": 53
  },
  {
    "id": "qb-qa-4",
    "title": "API Testing & Consumer-Driven Contract Testing with Pact",
    "category": "TECHNICAL",
    "domain": "API & Integration Testing",
    "difficulty": "INTERMEDIATE",
    "targetRoles": [
      "QA Automation & SDET",
      "Backend Engineer",
      "Software Test Engineer"
    ],
    "questionType": "TECHNICAL_DEEP_DIVE",
    "questionText": "How does Consumer-Driven Contract Testing (e.g. using Pact) bridge the gap between unit tests and heavy end-to-end integration tests in a microservices ecosystem?",
    "expectedKeywords": [
      "Contract Testing",
      "Pact",
      "Consumer-Driven",
      "Provider verification",
      "Pact Broker",
      "breaking changes",
      "microservices testing"
    ],
    "idealAnswerRubric": "Contrasts slow, brittle integrated environments with contract testing. Explains consumer generating contract (Pact file), provider validating against contract in CI, and Pact Broker preventing breaking API changes before deployment.",
    "coreCompetencyTested": "Distributed System Testing & API Architecture",
    "sampleAnswer": "In microservices, end-to-end integration tests are slow, flaky, and expensive to stand up, while isolated unit mocks cannot catch breaking API schema changes between teams. Consumer-Driven Contract Testing solves this: the consuming service defines the exact HTTP requests and responses it expects in code, generating a contract (Pact JSON). This contract is published to a Pact Broker. During the provider service's independent CI pipeline, the provider replays the contract requests against its actual endpoints. If any field is renamed, deleted, or altered in type, the provider build fails immediately before deploying, ensuring decoupled continuous delivery with zero broken consumer contracts.",
    "explanation": "Critical modern QA skill for testing distributed microservices and contract integrity.",
    "keyConcepts": [
      "Consumer-Driven Contracts",
      "Pact Broker",
      "API Schema Governance",
      "Breaking Change Detection"
    ],
    "upvotes": 59
  },
  {
    "id": "qb-qa-5",
    "title": "Designing Stress, Spike, and Soak Performance Tests with k6 / JMeter",
    "category": "TECHNICAL",
    "domain": "Performance, Load & Stress Testing",
    "difficulty": "ADVANCED",
    "targetRoles": [
      "QA Automation & SDET",
      "Site Reliability Engineering (SRE)",
      "Backend Engineer"
    ],
    "questionType": "SCENARIO",
    "questionText": "An e-commerce platform is anticipating a flash sale with 10x normal traffic. How do you design and execute a comprehensive performance testing suite covering Load, Spike, Stress, and Soak testing? What specific metrics define success?",
    "expectedKeywords": [
      "k6",
      "JMeter",
      "Load vs Spike vs Stress vs Soak",
      "p95 and p99 latency",
      "throughput (RPS)",
      "error rate",
      "memory leaks",
      "breaking point"
    ],
    "idealAnswerRubric": "Defines the 4 test types: Load (expected peak), Spike (instantaneous surge), Stress (scaling to failure/breaking point), and Soak (extended duration for memory leaks). Defines SLIs/SLOs: p95/p99 response times, error rates under 0.1%, CPU/memory saturation, and recovery characteristics.",
    "coreCompetencyTested": "Performance Engineering & Capacity Planning",
    "sampleAnswer": "I structure a performance campaign into 4 stages using k6 or JMeter: 1) Load Testing: simulate expected peak traffic (e.g. 5,000 concurrent virtual users) to verify baseline SLAs (p95 latency < 300ms, error rate < 0.05%). 2) Spike Testing: rapidly step from baseline to 10x traffic in seconds to evaluate autoscaling lag, connection pool queuing, and circuit-breaker behavior. 3) Stress Testing: continually ramp traffic beyond capacity until the system degrades to determine the exact breaking point and verify graceful degradation (HTTP 429/503 without database crashes). 4) Soak/Endurance Testing: maintain 70% load for 12-24 hours to uncover memory leaks, connection leaks, and disk exhaustion.",
    "explanation": "Evaluates full-spectrum performance test design, tooling, metric thresholds, and production resilience.",
    "keyConcepts": [
      "Performance Testing Types",
      "Latency Percentiles (p95/p99)",
      "k6 Performance Scripting",
      "Memory Leak Detection"
    ],
    "upvotes": 67
  },
  {
    "id": "qb-qa-6",
    "title": "Handling a Critical Severity-1 Bug Found Hours Before a Major Release",
    "category": "BEHAVIORAL",
    "domain": "Software Testing & QA (Manual & Functional)",
    "difficulty": "INTERMEDIATE",
    "targetRoles": [
      "Software Test Engineer",
      "QA Automation & SDET",
      "Software Engineer"
    ],
    "questionType": "BEHAVIORAL_STAR",
    "questionText": "Tell me about a time you discovered a high-severity bug right before a major production release deadline when stakeholders were eager to ship. How did you document it, communicate with leadership, and manage the release decision?",
    "expectedKeywords": [
      "Severity vs Priority",
      "Root Cause Analysis",
      "stakeholder management",
      "reproducibility",
      "risk assessment",
      "go/no-go decision",
      "hotfix rollback"
    ],
    "idealAnswerRubric": "Uses STAR method. Emphasizes objective data, reproducible defect reports, business risk assessment, calm cross-functional communication with Engineering and Product, and championing customer quality without creating panic.",
    "coreCompetencyTested": "Quality Leadership & Stakeholder Communication",
    "sampleAnswer": "In a previous release, 3 hours prior to a scheduled core payments rollout, exploratory testing revealed an edge-case concurrency issue where double-clicking a submit button under packet delay triggered duplicate billing transactions. Situation: Marketing and leadership were prepared to launch worldwide. Task: My duty was to protect user trust and financial compliance while providing clear data. Action: Rather than simply blocking the release with panic, I quickly captured a deterministic repro with network logs, calculated the blast radius (affecting ~3-5% of mobile users on slow connections), and filed a Sev-1 ticket. I scheduled an immediate 15-minute triage with the VP of Engineering and Product Lead, presenting two options: delay 24 hours for an idempotent transaction hotfix, or ship with feature-flag gating off the new gateway. Result: The team agreed to a 24-hour delay; the backend team added a unique idempotency key, my automated test verified the fix, and we launched with zero customer billing duplicates.",
    "explanation": "Behavioral STAR question demonstrating QA leadership, risk analysis, and engineering integrity under pressure.",
    "keyConcepts": [
      "STAR Methodology",
      "Release Gatekeeper",
      "Risk vs Speed Trade-offs",
      "Defect Triage"
    ],
    "upvotes": 48
  },
  {
    "id": "qb-qa-7",
    "title": "Mobile Test Automation Strategy Across Fragmented Devices",
    "category": "TECHNICAL",
    "domain": "Mobile App Testing & Automation",
    "difficulty": "ADVANCED",
    "targetRoles": [
      "QA Automation & SDET",
      "Mobile App Development (iOS & Android)",
      "Software Test Engineer"
    ],
    "questionType": "TECHNICAL_DEEP_DIVE",
    "questionText": "How do you architect a scalable automated test pipeline for iOS and Android apps across hundreds of device configurations, screen resolutions, and OS versions using Appium, Espresso, and XCUITest on cloud device farms?",
    "expectedKeywords": [
      "Appium",
      "Espresso",
      "XCUITest",
      "device farm",
      "device fragmentation",
      "parallel execution",
      "real devices vs emulators",
      "native context"
    ],
    "idealAnswerRubric": "Compares Appium (cross-platform, black-box) with native Espresso/XCUITest (fast, grey-box with direct access to app memory). Explains hybrid strategy (native for fast PR feedback, Appium on cloud farms like BrowserStack/SauceLabs/Firebase Test Lab for nightly cross-device matrix).",
    "coreCompetencyTested": "Mobile QA Strategy & Device Matrix Architecture",
    "sampleAnswer": "Mobile automation faces unique challenges: OS fragmentation, hardware differences, biometric authentication, and network volatility. I design a tiered mobile pipeline: Tier 1 (PR Checks): Fast native grey-box tests using Espresso (Android) and XCUITest (iOS) running on local headless emulators/simulators inside CI; these run in under 8 minutes with direct access to application state and network mocking. Tier 2 (Nightly Matrix): Cloud device farm (Firebase Test Lab / BrowserStack) using Appium running on real physical devices across top 20 representative hardware profiles (different chipsets, screen aspect ratios, and OS versions). We handle push notifications, deep links, and biometric logins via mocked system intents and test hooks.",
    "explanation": "Tests advanced mobile test architecture, native vs cross-platform tooling, and device cloud integration.",
    "keyConcepts": [
      "Mobile Automation Architecture",
      "Espresso & XCUITest",
      "Appium Device Farms",
      "Device Matrix Optimization"
    ],
    "upvotes": 56
  },
  {
    "id": "qb-qa-8",
    "title": "Testing Microservices: The Testing Pyramid vs The Testing Trophy",
    "category": "TECHNICAL",
    "domain": "Test Architecture & CI/CD Quality Gates",
    "difficulty": "INTERMEDIATE",
    "targetRoles": [
      "QA Automation & SDET",
      "Software Engineer",
      "System Architect"
    ],
    "questionType": "TECHNICAL_DEEP_DIVE",
    "questionText": "Compare Mike Cohn's traditional Testing Pyramid with Kent C. Dodds' Testing Trophy model. Why do modern full-stack web and microservice teams often shift emphasis toward integration and component testing over isolated unit tests?",
    "expectedKeywords": [
      "Testing Pyramid",
      "Testing Trophy",
      "integration testing",
      "unit testing",
      "confidence vs cost",
      "mocking tax",
      "end-to-end testing"
    ],
    "idealAnswerRubric": "Explains the layers: Unit, Integration, E2E vs Static, Unit, Integration, E2E. Details why over-mocked unit tests can pass while user features break (mocking tax), and why integration tests deliver higher return on investment (ROI) for confidence per time spent.",
    "coreCompetencyTested": "Quality Architecture & Test Strategy ROI",
    "sampleAnswer": "The classic Testing Pyramid advocates a heavy base of Unit tests, fewer Integration tests, and minimal E2E tests. While unit tests are fast, in modern component-driven architectures (like React) and distributed backends, unit tests often incur a high 'mocking tax'—they test internal implementation details and mocks rather than actual behavior, allowing broken user flows to pass with 100% test coverage. The Testing Trophy rebalances this by placing the thickest layer at Integration Testing: testing how components, routes, database queries, and APIs interact together with real or lightweight dependencies. This provides the highest confidence with minimal brittle maintenance, supported by static analysis (TypeScript/ESLint) at the base and targeted E2E smoke tests at the top.",
    "explanation": "Assesses foundational understanding of test strategy, ROI, and architectural paradigms.",
    "keyConcepts": [
      "Testing Pyramid vs Trophy",
      "Integration Test ROI",
      "Mocking Tax Mitigation",
      "Continuous Quality Strategy"
    ],
    "upvotes": 62
  }
];

export const codingProblemsData = [
  {
    "id": "cp-1",
    "slug": "two-sum",
    "title": "Two Sum",
    "difficulty": "BEGINNER",
    "category": "Algorithms",
    "targetRoles": [
      "Software Engineer",
      "Backend Engineer",
      "Full Stack Developer"
    ],
    "functionName": "twoSum",
    "paramNames": [
      "nums",
      "target"
    ],
    "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    "inputFormat": "nums: number[], target: number",
    "outputFormat": "number[] (indices [i, j])",
    "constraints": [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "Exactly one valid answer exists."
    ],
    "starterCode": {
      "javascript": "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}",
      "python": "def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        if target - num in seen:\n            return [seen[target - num], i]\n        seen[num] = i\n    return []"
    },
    "hints": [
      "Store each number and its index in a hash map as you iterate.",
      "Check if (target - num) is already in the map in O(1) time."
    ],
    "testCases": [
      {
        "input": "{\"nums\":[2,7,11,15],\"target\":9}",
        "expectedOutput": "[0,1]"
      },
      {
        "input": "{\"nums\":[3,2,4],\"target\":6}",
        "expectedOutput": "[1,2]"
      },
      {
        "input": "{\"nums\":[3,3],\"target\":6}",
        "expectedOutput": "[0,1]"
      }
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)"
  },
  {
    "id": "cp-2",
    "slug": "valid-parentheses",
    "title": "Valid Parentheses",
    "difficulty": "BEGINNER",
    "category": "Strings & Stack",
    "targetRoles": [
      "Software Engineer",
      "Frontend Developer",
      "Full Stack Developer"
    ],
    "functionName": "isValid",
    "paramNames": [
      "s"
    ],
    "description": "Given a string `s` containing just the characters \"(\", \")\", \"{\", \"}\", \"[\" and \"]\", determine if the input string is valid. Brackets must close in the correct order, and each open bracket must have a corresponding close bracket of the same type.",
    "inputFormat": "s: string",
    "outputFormat": "boolean",
    "constraints": [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only ()[]{}"
    ],
    "starterCode": {
      "javascript": "function isValid(s) {\n  const stack = [];\n  const map = { \")\": \"(\", \"}\": \"{\", \"]\": \"[\" };\n  for (const char of s) {\n    if (char === \"(\" || char === \"{\" || char === \"[\") {\n      stack.push(char);\n    } else {\n      if (stack.pop() !== map[char]) return false;\n    }\n  }\n  return stack.length === 0;\n}",
      "python": "def is_valid(s):\n    stack = []\n    mapping = {\")\": \"(\", \"}\": \"{\", \"]\": \"[\"}\n    for char in s:\n        if char in mapping.values():\n            stack.append(char)\n        elif char in mapping:\n            if not stack or stack.pop() != mapping[char]:\n                return False\n    return not stack"
    },
    "hints": [
      "Use a Last-In, First-Out (LIFO) stack to track unmatched opening brackets.",
      "When seeing a closing bracket, verify the top of the stack matches."
    ],
    "testCases": [
      {
        "input": "{\"s\":\"()\"}",
        "expectedOutput": "true"
      },
      {
        "input": "{\"s\":\"()[]{}\"}",
        "expectedOutput": "true"
      },
      {
        "input": "{\"s\":\"(]\"}",
        "expectedOutput": "false"
      },
      {
        "input": "{\"s\":\"([)]\"}",
        "expectedOutput": "false"
      }
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)"
  },
  {
    "id": "cp-3",
    "slug": "longest-substring-without-repeating",
    "title": "Longest Substring Without Repeating Characters",
    "difficulty": "INTERMEDIATE",
    "category": "Sliding Window",
    "targetRoles": [
      "Software Engineer",
      "Frontend Developer",
      "Full Stack Developer"
    ],
    "functionName": "lengthOfLongestSubstring",
    "paramNames": [
      "s"
    ],
    "description": "Given a string `s`, find the length of the longest substring without duplicate characters.",
    "inputFormat": "s: string",
    "outputFormat": "number",
    "constraints": [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    "starterCode": {
      "javascript": "function lengthOfLongestSubstring(s) {\n  let maxLen = 0, left = 0;\n  const set = new Set();\n  for (let right = 0; right < s.length; right++) {\n    while (set.has(s[right])) {\n      set.delete(s[left++]);\n    }\n    set.add(s[right]);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}",
      "python": "def length_of_longest_substring(s):\n    seen = set()\n    left = max_len = 0\n    for right in range(len(s)):\n        while s[right] in seen:\n            seen.remove(s[left])\n            left += 1\n        seen.add(s[right])\n        max_len = max(max_len, right - left + 1)\n    return max_len"
    },
    "hints": [
      "Use a sliding window with two pointers (left and right).",
      "Maintain a Set of characters in the current window."
    ],
    "testCases": [
      {
        "input": "{\"s\":\"abcabcbb\"}",
        "expectedOutput": "3"
      },
      {
        "input": "{\"s\":\"bbbbb\"}",
        "expectedOutput": "1"
      },
      {
        "input": "{\"s\":\"pwwkew\"}",
        "expectedOutput": "3"
      },
      {
        "input": "{\"s\":\"\"}",
        "expectedOutput": "0"
      }
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(min(N, M))"
  },
  {
    "id": "cp-4",
    "slug": "flatten-nested-array",
    "title": "Flatten Multi-Dimensional Array with Depth Limit",
    "difficulty": "INTERMEDIATE",
    "category": "Frontend & JS",
    "targetRoles": [
      "Frontend Developer",
      "Full Stack Developer",
      "Software Engineer"
    ],
    "functionName": "flattenArray",
    "paramNames": [
      "arr",
      "depth"
    ],
    "description": "Implement a function that takes a multi-dimensional array `arr` and an integer `depth`, and returns a flattened version of the array up to `depth` levels deep. If `depth` is 0 or negative, return the array unchanged.",
    "inputFormat": "arr: any[], depth: number",
    "outputFormat": "any[]",
    "constraints": [
      "0 <= arr.length <= 1000",
      "0 <= depth <= 1000"
    ],
    "starterCode": {
      "javascript": "function flattenArray(arr, depth) {\n  if (depth <= 0) return arr;\n  const result = [];\n  for (const item of arr) {\n    if (Array.isArray(item) && depth > 0) {\n      result.push(...flattenArray(item, depth - 1));\n    } else {\n      result.push(item);\n    }\n  }\n  return result;\n}",
      "python": "def flatten_array(arr, depth):\n    if depth <= 0:\n        return arr\n    result = []\n    for item in arr:\n        if isinstance(item, list) and depth > 0:\n            result.extend(flatten_array(item, depth - 1))\n        else:\n            result.append(item)\n    return result"
    },
    "hints": [
      "Iterate through the array. Check if each item is an Array.",
      "If it is an Array and depth > 0, recursively call with depth - 1."
    ],
    "testCases": [
      {
        "input": "{\"arr\":[1,[2,[3,[4]],5]],\"depth\":1}",
        "expectedOutput": "[1,2,[3,[4]],5]"
      },
      {
        "input": "{\"arr\":[1,[2,[3,[4]],5]],\"depth\":2}",
        "expectedOutput": "[1,2,3,[4],5]"
      },
      {
        "input": "{\"arr\":[[1,2],[3,4]],\"depth\":1}",
        "expectedOutput": "[1,2,3,4]"
      },
      {
        "input": "{\"arr\":[1,2,3],\"depth\":0}",
        "expectedOutput": "[1,2,3]"
      }
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)"
  },
  {
    "id": "cp-5",
    "slug": "deep-clone-object",
    "title": "Deep Clone Complex Object",
    "difficulty": "INTERMEDIATE",
    "category": "Frontend & JS",
    "targetRoles": [
      "Frontend Developer",
      "Full Stack Developer"
    ],
    "functionName": "deepClone",
    "paramNames": [
      "obj"
    ],
    "description": "Create a deep clone function in JavaScript that copies nested objects, arrays, and primitive values without sharing references.",
    "inputFormat": "obj: object",
    "outputFormat": "object (deep copy)",
    "constraints": [
      "Object contains JSON-serializable types (objects, arrays, strings, numbers, booleans)"
    ],
    "starterCode": {
      "javascript": "function deepClone(obj) {\n  if (obj === null || typeof obj !== \"object\") return obj;\n  if (Array.isArray(obj)) {\n    return obj.map(item => deepClone(item));\n  }\n  const copy = {};\n  for (const key of Object.keys(obj)) {\n    copy[key] = deepClone(obj[key]);\n  }\n  return copy;\n}",
      "python": "def deep_clone(obj):\n    import copy\n    return copy.deepcopy(obj)"
    },
    "hints": [
      "Check for primitive values and null first.",
      "Recursively branch for Arrays vs plain Objects."
    ],
    "testCases": [
      {
        "input": "{\"obj\":{\"a\":1,\"b\":{\"c\":2}}}",
        "expectedOutput": "{\"a\":1,\"b\":{\"c\":2}}"
      },
      {
        "input": "{\"obj\":{\"nums\":[1,2,3],\"nested\":{\"str\":\"hello\"}}}",
        "expectedOutput": "{\"nums\":[1,2,3],\"nested\":{\"str\":\"hello\"}}"
      },
      {
        "input": "{\"obj\":42}",
        "expectedOutput": "42"
      }
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)"
  },
  {
    "id": "cp-6",
    "slug": "lru-cache-capacity",
    "title": "LRU Cache Simulation",
    "difficulty": "ADVANCED",
    "category": "Backend & Systems",
    "targetRoles": [
      "Backend Engineer",
      "System Architect",
      "Software Engineer"
    ],
    "functionName": "simulateLRUCache",
    "paramNames": [
      "capacity",
      "operations"
    ],
    "description": "Implement an LRU (Least Recently Used) cache simulation. Given `capacity` and a sequence of `operations` in format `[\"put\", key, value]` or `[\"get\", key]`, return an array of the results of all \"get\" operations (or -1 if key not found).",
    "inputFormat": "capacity: number, operations: any[][]",
    "outputFormat": "number[] (results of all \"get\" operations)",
    "constraints": [
      "1 <= capacity <= 3000",
      "0 <= key, value <= 10^4"
    ],
    "starterCode": {
      "javascript": "function simulateLRUCache(capacity, operations) {\n  const map = new Map();\n  const results = [];\n  for (const op of operations) {\n    if (op[0] === \"get\") {\n      const key = op[1];\n      if (!map.has(key)) {\n        results.push(-1);\n      } else {\n        const val = map.get(key);\n        map.delete(key);\n        map.set(key, val);\n        results.push(val);\n      }\n    } else if (op[0] === \"put\") {\n      const key = op[1], val = op[2];\n      if (map.has(key)) map.delete(key);\n      map.set(key, val);\n      if (map.size > capacity) {\n        const oldestKey = map.keys().next().value;\n        map.delete(oldestKey);\n      }\n    }\n  }\n  return results;\n}",
      "python": "def simulate_lru_cache(capacity, operations):\n    from collections import OrderedDict\n    cache = OrderedDict()\n    results = []\n    for op in operations:\n        if op[0] == \"get\":\n            key = op[1]\n            if key not in cache:\n                results.append(-1)\n            else:\n                cache.move_to_end(key)\n                results.append(cache[key])\n        elif op[0] == \"put\":\n            key, val = op[1], op[2]\n            if key in cache:\n                cache.move_to_end(key)\n            cache[key] = val\n            if len(cache) > capacity:\n                cache.popitem(last=False)\n    return results"
    },
    "hints": [
      "In JavaScript, Map preserves insertion order!",
      "Re-inserting a key (`delete` then `set`) marks it as recently used."
    ],
    "testCases": [
      {
        "input": "{\"capacity\":2,\"operations\":[[\"put\",1,1],[\"put\",2,2],[\"get\",1],[\"put\",3,3],[\"get\",2],[\"put\",4,4],[\"get\",1],[\"get\",3],[\"get\",4]]}",
        "expectedOutput": "[1,-1,-1,3,4]"
      }
    ],
    "timeComplexity": "O(1) per operation",
    "spaceComplexity": "O(capacity)"
  },
  {
    "id": "cp-7",
    "slug": "rate-limiter-token-bucket",
    "title": "Sliding Window Rate Limiter",
    "difficulty": "INTERMEDIATE",
    "category": "Backend & Systems",
    "targetRoles": [
      "Backend Engineer",
      "System Architect",
      "DevOps & Cloud Engineer"
    ],
    "functionName": "checkRateLimit",
    "paramNames": [
      "timestamps",
      "maxRequests",
      "windowMs"
    ],
    "description": "Given an ascending array of millisecond `timestamps` of incoming requests, a `maxRequests` limit, and a sliding time window `windowMs`, return an array of booleans indicating whether each request is accepted (`true`) or rate-limited (`false`).",
    "inputFormat": "timestamps: number[], maxRequests: number, windowMs: number",
    "outputFormat": "boolean[]",
    "constraints": [
      "1 <= timestamps.length <= 10^4",
      "1 <= maxRequests <= 1000",
      "1 <= windowMs <= 60000"
    ],
    "starterCode": {
      "javascript": "function checkRateLimit(timestamps, maxRequests, windowMs) {\n  const queue = [];\n  const results = [];\n  for (const ts of timestamps) {\n    while (queue.length > 0 && queue[0] <= ts - windowMs) {\n      queue.shift();\n    }\n    if (queue.length < maxRequests) {\n      queue.push(ts);\n      results.push(true);\n    } else {\n      results.push(false);\n    }\n  }\n  return results;\n}",
      "python": "def check_rate_limit(timestamps, max_requests, window_ms):\n    queue = []\n    results = []\n    for ts in timestamps:\n        while queue and queue[0] <= ts - window_ms:\n            queue.pop(0)\n        if len(queue) < max_requests:\n            queue.append(ts)\n            results.append(True)\n        else:\n            results.append(False)\n    return results"
    },
    "hints": [
      "Use a sliding window queue storing the timestamps of accepted requests.",
      "Evict timestamps that fall outside `[ts - windowMs, ts]` before checking the count."
    ],
    "testCases": [
      {
        "input": "{\"timestamps\":[100,200,300,400],\"maxRequests\":3,\"windowMs\":500}",
        "expectedOutput": "[true,true,true,false]"
      },
      {
        "input": "{\"timestamps\":[100,200,800],\"maxRequests\":2,\"windowMs\":500}",
        "expectedOutput": "[true,true,true]"
      }
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(maxRequests)"
  },
  {
    "id": "cp-8",
    "slug": "group-anagrams",
    "title": "Group Anagrams",
    "difficulty": "INTERMEDIATE",
    "category": "Algorithms",
    "targetRoles": [
      "Software Engineer",
      "Backend Engineer",
      "Full Stack Developer"
    ],
    "functionName": "groupAnagrams",
    "paramNames": [
      "strs"
    ],
    "description": "Given an array of strings `strs`, group the anagrams together. You can return the answer with groups sorted by their first element.",
    "inputFormat": "strs: string[]",
    "outputFormat": "string[][]",
    "constraints": [
      "1 <= strs.length <= 10^4",
      "0 <= strs[i].length <= 100",
      "strs[i] consists of lowercase English letters."
    ],
    "starterCode": {
      "javascript": "function groupAnagrams(strs) {\n  const map = new Map();\n  for (const s of strs) {\n    const key = s.split(\"\").sort().join(\"\");\n    if (!map.has(key)) map.set(key, []);\n    map.get(key).push(s);\n  }\n  return Array.from(map.values()).map(g => g.sort()).sort((a, b) => a[0].localeCompare(b[0]));\n}",
      "python": "def group_anagrams(strs):\n    from collections import defaultdict\n    groups = defaultdict(list)\n    for s in strs:\n        groups[\"\".join(sorted(s))].append(s)\n    return sorted([sorted(g) for g in groups.values()])"
    },
    "hints": [
      "Strings that are anagrams will be identical when their letters are sorted.",
      "Use the sorted string as a hash map key."
    ],
    "testCases": [
      {
        "input": "{\"strs\":[\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]}",
        "expectedOutput": "[[\"ate\",\"eat\",\"tea\"],[\"bat\"],[\"nat\",\"tan\"]]"
      },
      {
        "input": "{\"strs\":[\"\"]}",
        "expectedOutput": "[[\"\"]]"
      },
      {
        "input": "{\"strs\":[\"a\"]}",
        "expectedOutput": "[[\"a\"]]"
      }
    ],
    "timeComplexity": "O(N * K log K)",
    "spaceComplexity": "O(N * K)"
  },
  {
    "id": "cp-9",
    "slug": "binary-search",
    "title": "Binary Search in Sorted Array",
    "difficulty": "BEGINNER",
    "category": "Algorithms",
    "targetRoles": [
      "Software Engineer",
      "Backend Engineer",
      "Data Scientist / AI Engineer"
    ],
    "functionName": "binarySearch",
    "paramNames": [
      "nums",
      "target"
    ],
    "description": "Given a sorted integer array `nums` in ascending order and a `target` value, write a function to search `target` in `nums`. If `target` exists, return its index; otherwise, return -1. Your algorithm must run in O(log N) time.",
    "inputFormat": "nums: number[], target: number",
    "outputFormat": "number",
    "constraints": [
      "1 <= nums.length <= 10^4",
      "-10^4 < nums[i], target < 10^4",
      "All integers in nums are unique and sorted."
    ],
    "starterCode": {
      "javascript": "function binarySearch(nums, target) {\n  let low = 0, high = nums.length - 1;\n  while (low <= high) {\n    const mid = Math.floor((low + high) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) low = mid + 1;\n    else high = mid - 1;\n  }\n  return -1;\n}",
      "python": "def binary_search(nums, target):\n    low, high = 0, len(nums) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1"
    },
    "hints": [
      "Maintain low and high pointers.",
      "Calculate mid = floor((low + high) / 2) and eliminate half the search space."
    ],
    "testCases": [
      {
        "input": "{\"nums\":[-1,0,3,5,9,12],\"target\":9}",
        "expectedOutput": "4"
      },
      {
        "input": "{\"nums\":[-1,0,3,5,9,12],\"target\":2}",
        "expectedOutput": "-1"
      },
      {
        "input": "{\"nums\":[5],\"target\":5}",
        "expectedOutput": "0"
      }
    ],
    "timeComplexity": "O(log N)",
    "spaceComplexity": "O(1)"
  },
  {
    "id": "cp-10",
    "slug": "climbing-stairs",
    "title": "Climbing Stairs (Dynamic Programming)",
    "difficulty": "BEGINNER",
    "category": "Dynamic Programming",
    "targetRoles": [
      "Software Engineer",
      "Data Scientist / AI Engineer"
    ],
    "functionName": "climbStairs",
    "paramNames": [
      "n"
    ],
    "description": "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    "inputFormat": "n: number",
    "outputFormat": "number",
    "constraints": [
      "1 <= n <= 45"
    ],
    "starterCode": {
      "javascript": "function climbStairs(n) {\n  if (n <= 2) return n;\n  let prev2 = 1, prev1 = 2;\n  for (let i = 3; i <= n; i++) {\n    const current = prev1 + prev2;\n    prev2 = prev1;\n    prev1 = current;\n  }\n  return prev1;\n}",
      "python": "def climb_stairs(n):\n    if n <= 2:\n        return n\n    a, b = 1, 2\n    for _ in range(3, n + 1):\n        a, b = b, a + b\n    return b"
    },
    "hints": [
      "To reach step n, you must come from either step n-1 or step n-2.",
      "Total ways(n) = ways(n-1) + ways(n-2), exactly like the Fibonacci sequence!"
    ],
    "testCases": [
      {
        "input": "{\"n\":2}",
        "expectedOutput": "2"
      },
      {
        "input": "{\"n\":3}",
        "expectedOutput": "3"
      },
      {
        "input": "{\"n\":5}",
        "expectedOutput": "8"
      }
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)"
  },
  {
    "id": "cp-11",
    "slug": "matrix-transpose",
    "title": "Matrix Transpose",
    "difficulty": "BEGINNER",
    "category": "Data & Matrix",
    "targetRoles": [
      "Data Scientist / AI Engineer",
      "Software Engineer"
    ],
    "functionName": "transposeMatrix",
    "paramNames": [
      "matrix"
    ],
    "description": "Given a 2D integer matrix `matrix`, return the transpose of `matrix`. The transpose of a matrix is the matrix flipped over its main diagonal, switching the row and column indices of the matrix.",
    "inputFormat": "matrix: number[][]",
    "outputFormat": "number[][]",
    "constraints": [
      "1 <= matrix.length, matrix[0].length <= 100",
      "-10^9 <= matrix[i][j] <= 10^9"
    ],
    "starterCode": {
      "javascript": "function transposeMatrix(matrix) {\n  const rows = matrix.length;\n  const cols = matrix[0].length;\n  const result = Array.from({ length: cols }, () => Array(rows).fill(0));\n  for (let r = 0; r < rows; r++) {\n    for (let c = 0; c < cols; c++) {\n      result[c][r] = matrix[r][c];\n    }\n  }\n  return result;\n}",
      "python": "def transpose_matrix(matrix):\n    return [[matrix[r][c] for r in range(len(matrix))] for c in range(len(matrix[0]))]"
    },
    "hints": [
      "An R x C matrix becomes a C x R transposed matrix.",
      "Set result[col][row] = matrix[row][col]."
    ],
    "testCases": [
      {
        "input": "{\"matrix\":[[1,2,3],[4,5,6]]}",
        "expectedOutput": "[[1,4],[2,5],[3,6]]"
      },
      {
        "input": "{\"matrix\":[[1,2],[3,4]]}",
        "expectedOutput": "[[1,3],[2,4]]"
      }
    ],
    "timeComplexity": "O(R * C)",
    "spaceComplexity": "O(R * C)"
  },
  {
    "id": "cp-12",
    "slug": "merge-sorted-arrays",
    "title": "Merge Two Sorted Arrays",
    "difficulty": "BEGINNER",
    "category": "Arrays",
    "targetRoles": [
      "Software Engineer",
      "Backend Engineer",
      "Full Stack Developer"
    ],
    "functionName": "mergeSorted",
    "paramNames": [
      "nums1",
      "nums2"
    ],
    "description": "Given two sorted integer arrays `nums1` and `nums2`, merge them into a single sorted array and return it.",
    "inputFormat": "nums1: number[], nums2: number[]",
    "outputFormat": "number[]",
    "constraints": [
      "0 <= nums1.length, nums2.length <= 1000"
    ],
    "starterCode": {
      "javascript": "function mergeSorted(nums1, nums2) {\n  let i = 0, j = 0;\n  const merged = [];\n  while (i < nums1.length && j < nums2.length) {\n    if (nums1[i] <= nums2[j]) merged.push(nums1[i++]);\n    else merged.push(nums2[j++]);\n  }\n  while (i < nums1.length) merged.push(nums1[i++]);\n  while (j < nums2.length) merged.push(nums2[j++]);\n  return merged;\n}",
      "python": "def merge_sorted(nums1, nums2):\n    return sorted(nums1 + nums2)"
    },
    "hints": [
      "Use two pointers, comparing elements from nums1 and nums2 one by one."
    ],
    "testCases": [
      {
        "input": "{\"nums1\":[1,3,5],\"nums2\":[2,4,6]}",
        "expectedOutput": "[1,2,3,4,5,6]"
      },
      {
        "input": "{\"nums1\":[1],\"nums2\":[]}",
        "expectedOutput": "[1]"
      },
      {
        "input": "{\"nums1\":[2,5],\"nums2\":[1,3,7]}",
        "expectedOutput": "[1,2,3,5,7]"
      }
    ],
    "timeComplexity": "O(N + M)",
    "spaceComplexity": "O(N + M)"
  },
  {
    "id": "cp-13",
    "slug": "palindrome-check",
    "title": "Valid Palindrome (Ignore Non-Alphanumeric)",
    "difficulty": "BEGINNER",
    "category": "Strings",
    "targetRoles": [
      "Software Engineer",
      "Frontend Developer"
    ],
    "functionName": "isPalindrome",
    "paramNames": [
      "s"
    ],
    "description": "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.",
    "inputFormat": "s: string",
    "outputFormat": "boolean",
    "constraints": [
      "1 <= s.length <= 2 * 10^5"
    ],
    "starterCode": {
      "javascript": "function isPalindrome(s) {\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, \"\");\n  let left = 0, right = clean.length - 1;\n  while (left < right) {\n    if (clean[left++] !== clean[right--]) return false;\n  }\n  return true;\n}",
      "python": "def is_palindrome(s):\n    import re\n    clean = re.sub(r\"[^a-zA-Z0-9]\", \"\", s).lower()\n    return clean == clean[::-1]"
    },
    "hints": [
      "Filter out characters that are not letters or numbers.",
      "Compare characters from both ends towards the center."
    ],
    "testCases": [
      {
        "input": "{\"s\":\"A man, a plan, a canal: Panama\"}",
        "expectedOutput": "true"
      },
      {
        "input": "{\"s\":\"race a car\"}",
        "expectedOutput": "false"
      },
      {
        "input": "{\"s\":\" \"}",
        "expectedOutput": "true"
      }
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)"
  },
  {
    "id": "cp-14",
    "slug": "count-vowels-consonants",
    "title": "Vowel & Consonant Counter",
    "difficulty": "BEGINNER",
    "category": "Strings",
    "targetRoles": [
      "Frontend Developer",
      "Software Engineer"
    ],
    "functionName": "analyzeString",
    "paramNames": [
      "str"
    ],
    "description": "Given a string `str`, return an object `{ vowels: number, consonants: number }` counting the number of English vowels (a, e, i, o, u case-insensitively) and consonants in the string, ignoring spaces and non-alphabetical characters.",
    "inputFormat": "str: string",
    "outputFormat": "{ vowels: number, consonants: number }",
    "constraints": [
      "0 <= str.length <= 10^4"
    ],
    "starterCode": {
      "javascript": "function analyzeString(str) {\n  let vowels = 0, consonants = 0;\n  const vSet = new Set([\"a\", \"e\", \"i\", \"o\", \"u\"]);\n  for (const char of str.toLowerCase()) {\n    if (char >= \"a\" && char <= \"z\") {\n      if (vSet.has(char)) vowels++;\n      else consonants++;\n    }\n  }\n  return { vowels, consonants };\n}",
      "python": "def analyze_string(str):\n    vowels = consonants = 0\n    v_set = set(\"aeiou\")\n    for char in str.lower():\n        if \"a\" <= char <= \"z\":\n            if char in v_set:\n                vowels += 1\n            else:\n                consonants += 1\n    return {\"vowels\": vowels, \"consonants\": consonants}"
    },
    "hints": [
      "Normalize the string to lowercase first.",
      "Use a Set to quickly check if a letter is a vowel."
    ],
    "testCases": [
      {
        "input": "{\"str\":\"hello world\"}",
        "expectedOutput": "{\"vowels\":3,\"consonants\":7}"
      },
      {
        "input": "{\"str\":\"Career Saathi\"}",
        "expectedOutput": "{\"vowels\":6,\"consonants\":6}"
      }
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)"
  }
];
