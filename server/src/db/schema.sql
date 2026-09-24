-- PrepAI PostgreSQL Relational Database Schema
-- Supports users, multi-resume management, adaptive interview sessions,
-- proctoring logs, coding challenges, question bank, and gamification.

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(32) DEFAULT 'USER',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_profiles (
  user_id VARCHAR(64) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  headline TEXT,
  target_role VARCHAR(255) DEFAULT 'Software Engineer',
  target_domain VARCHAR(255) DEFAULT 'Software Development',
  experience_years INTEGER DEFAULT 0,
  skills JSONB DEFAULT '[]'::jsonb,
  education JSONB,
  linkedin_url TEXT,
  github_url TEXT,
  preferred_difficulty VARCHAR(32) DEFAULT 'INTERMEDIATE',
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resumes (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  file_size INTEGER DEFAULT 0,
  mime_type VARCHAR(64) DEFAULT 'application/pdf',
  raw_text TEXT,
  extracted_skills JSONB DEFAULT '[]'::jsonb,
  parsed_data JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT false,
  uploaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_is_active ON resumes(user_id, is_active);

CREATE TABLE IF NOT EXISTS job_descriptions (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  company VARCHAR(255),
  raw_text TEXT NOT NULL,
  extracted_keywords JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS interview_sessions (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(64) NOT NULL,
  domain VARCHAR(128) NOT NULL,
  difficulty VARCHAR(32) NOT NULL,
  target_role VARCHAR(255) NOT NULL,
  normalized_role VARCHAR(64),
  programming_language VARCHAR(64) DEFAULT 'Python',
  normalized_programming_language VARCHAR(64),
  job_description TEXT,
  resume_id VARCHAR(64),
  selected_skills JSONB DEFAULT '[]'::jsonb,
  role_profile JSONB DEFAULT '{}'::jsonb,
  language_profile JSONB DEFAULT '{}'::jsonb,
  questions JSONB DEFAULT '[]'::jsonb,
  answers JSONB DEFAULT '[]'::jsonb,
  proctor_logs JSONB DEFAULT '[]'::jsonb,
  total_questions INTEGER DEFAULT 0,
  overall_score INTEGER,
  technical_score INTEGER,
  communication_score INTEGER,
  confidence_score INTEGER,
  summary_feedback JSONB DEFAULT '{}'::jsonb,
  status VARCHAR(32) DEFAULT 'CREATED',
  is_terminated BOOLEAN DEFAULT false,
  termination_reason TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE IF EXISTS interview_sessions ADD COLUMN IF NOT EXISTS normalized_role VARCHAR(64);
ALTER TABLE IF EXISTS interview_sessions ADD COLUMN IF NOT EXISTS normalized_programming_language VARCHAR(64);
ALTER TABLE IF EXISTS interview_sessions ADD COLUMN IF NOT EXISTS job_description TEXT;
ALTER TABLE IF EXISTS interview_sessions ADD COLUMN IF NOT EXISTS resume_id VARCHAR(64);
ALTER TABLE IF EXISTS interview_sessions ADD COLUMN IF NOT EXISTS selected_skills JSONB DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON interview_sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON interview_sessions(created_at DESC);

CREATE TABLE IF NOT EXISTS schedules (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL,
  domain VARCHAR(128) NOT NULL,
  difficulty VARCHAR(32) NOT NULL,
  target_role VARCHAR(255),
  scheduled_for TIMESTAMPTZ NOT NULL,
  notes TEXT,
  status VARCHAR(32) DEFAULT 'CONFIRMED',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_schedules_user_id ON schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_schedules_date ON schedules(scheduled_for ASC);

CREATE TABLE IF NOT EXISTS user_progress (
  user_id VARCHAR(64) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_interviews INTEGER DEFAULT 0,
  total_answers INTEGER DEFAULT 0,
  average_score NUMERIC(5,2) DEFAULT 0,
  technical_average NUMERIC(5,2) DEFAULT 0,
  communication_avg NUMERIC(5,2) DEFAULT 0,
  confidence_avg NUMERIC(5,2) DEFAULT 0,
  current_streak_days INTEGER DEFAULT 1,
  longest_streak_days INTEGER DEFAULT 1,
  total_xp_points INTEGER DEFAULT 50,
  level INTEGER DEFAULT 1,
  strongest_topics JSONB DEFAULT '[]'::jsonb,
  weakest_topics JSONB DEFAULT '[]'::jsonb,
  last_active_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS coding_submissions (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_slug VARCHAR(128) NOT NULL,
  code TEXT NOT NULL,
  language VARCHAR(32) NOT NULL,
  status VARCHAR(32) NOT NULL,
  passed_tests INTEGER DEFAULT 0,
  total_tests INTEGER DEFAULT 0,
  runtime_ms INTEGER DEFAULT 0,
  submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_coding_sub_user ON coding_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_coding_sub_problem ON coding_submissions(problem_slug);

CREATE TABLE IF NOT EXISTS question_bank (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL,
  domain VARCHAR(128) NOT NULL,
  difficulty VARCHAR(32) NOT NULL,
  question_type VARCHAR(64),
  question_text TEXT NOT NULL,
  expected_keywords JSONB DEFAULT '[]'::jsonb,
  ideal_answer_rubric TEXT,
  core_competency_tested TEXT,
  sample_answer TEXT,
  explanation TEXT,
  key_concepts JSONB DEFAULT '[]'::jsonb,
  upvotes INTEGER DEFAULT 0,
  target_roles JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_question_bank_domain ON question_bank(domain);
CREATE INDEX IF NOT EXISTS idx_question_bank_category ON question_bank(category);

CREATE TABLE IF NOT EXISTS coding_problems (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(128) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  difficulty VARCHAR(32) NOT NULL,
  category VARCHAR(64) NOT NULL,
  target_roles JSONB DEFAULT '[]'::jsonb,
  function_name VARCHAR(128),
  param_names JSONB DEFAULT '[]'::jsonb,
  description TEXT NOT NULL,
  input_format TEXT,
  output_format TEXT,
  constraints JSONB DEFAULT '[]'::jsonb,
  starter_code JSONB DEFAULT '{}'::jsonb,
  hints JSONB DEFAULT '[]'::jsonb,
  test_cases JSONB DEFAULT '[]'::jsonb,
  time_complexity VARCHAR(64),
  space_complexity VARCHAR(64)
);

CREATE INDEX IF NOT EXISTS idx_coding_problems_slug ON coding_problems(slug);
CREATE INDEX IF NOT EXISTS idx_coding_problems_difficulty ON coding_problems(difficulty);

CREATE TABLE IF NOT EXISTS user_badges (
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  badge_id VARCHAR(64) NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, badge_id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(32) DEFAULT 'INFO',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
