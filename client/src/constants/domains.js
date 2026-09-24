/**
 * Centralized Specialization Domains Configuration
 * Organized by industry verticals with deep coverage for Software & Testing roles.
 */

export const DOMAIN_GROUPS = [
  {
    group: 'Software Engineering',
    options: [
      'Software Engineering (General)',
      'Software Development',
      'Frontend Engineering (Web & UI)',
      'Backend & Distributed Systems',
      'Full Stack Development',
      'Mobile App Development (iOS & Android)',
      'Cloud & DevOps Engineering',
      'Site Reliability Engineering (SRE)',
      'System Design & Distributed Architecture',
      'API & Microservices Engineering',
      'Embedded Systems & IoT'
    ]
  },
  {
    group: 'Software Testing & Quality Assurance',
    options: [
      'Software Testing & QA (Manual & Functional)',
      'QA Automation & SDET',
      'API & Integration Testing',
      'Performance, Load & Stress Testing',
      'Mobile App Testing & Automation',
      'Security & Penetration Testing',
      'Test Architecture & CI/CD Quality Gates',
      'Database & Data Pipeline Testing'
    ]
  },
  {
    group: 'Data, AI & Infrastructure',
    options: [
      'Data Science & Analytics',
      'Data Engineering & Big Data',
      'Artificial Intelligence & Machine Learning',
      'Cybersecurity & InfoSec',
      'Cloud Computing & Infrastructure'
    ]
  },
  {
    group: 'Product & Business Management',
    options: [
      'Product Management',
      'Business & Management',
      'Marketing & Growth',
      'Finance & Fintech',
      'Human Resources'
    ]
  }
];

// Flat array of all distinct domains
export const ALL_DOMAINS = Array.from(
  new Set(DOMAIN_GROUPS.flatMap((g) => g.options))
);

export const DEFAULT_DOMAIN = 'Software Development';
