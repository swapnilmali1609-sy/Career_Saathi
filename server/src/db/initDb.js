import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, testConnection, isPgConfigured } from './pool.js';
import {
  users as seedUsers,
  userProfiles as seedUserProfiles,
  schedules as seedSchedules,
  userProgress as seedUserProgress,
  questionBankData as seedQuestionBank,
  codingProblemsData as seedCodingProblems
} from '../data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Initialize PostgreSQL schema and seed baseline records if empty
 */
export async function initDb() {
  if (!isPgConfigured()) {
    return {
      isPostgres: false,
      activeMode: 'IN_MEMORY_FALLBACK',
      message: 'DATABASE_URL not set. Running with resilient In-Memory store.'
    };
  }

  const conn = await testConnection();
  if (!conn.success) {
    console.warn(`[Database] PostgreSQL connection warning: ${conn.reason}. Falling back to in-memory store.`);
    return {
      isPostgres: false,
      activeMode: 'IN_MEMORY_FALLBACK',
      message: conn.reason
    };
  }

  try {
    // 1. Run DDL migration script
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    await query(schemaSql);
    console.log(`[Database] PostgreSQL schema verified on database "${conn.database}".`);

    // 2. Seed Baseline Data if users table is empty
    const userCountRes = await query('SELECT COUNT(*) FROM users;');
    const userCount = parseInt(userCountRes.rows[0]?.count || '0', 10);

    if (userCount === 0) {
      console.log('[Database] Seeding initial baseline accounts and content into PostgreSQL...');

      // Seed Users
      for (const u of seedUsers) {
        await query(
          `INSERT INTO users (id, name, email, password, role, avatar_url, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO NOTHING;`,
          [u.id, u.name, u.email, u.password, u.role, u.avatarUrl, u.createdAt || new Date().toISOString()]
        );
      }

      // Seed User Profiles
      for (const [userId, p] of seedUserProfiles.entries()) {
        await query(
          `INSERT INTO user_profiles (user_id, headline, target_role, target_domain, experience_years, skills, education, linkedin_url, github_url, preferred_difficulty, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           ON CONFLICT (user_id) DO NOTHING;`,
          [
            userId,
            p.headline || '',
            p.targetRole || 'Software Engineer',
            p.targetDomain || 'Software Development',
            p.experienceYears || 0,
            JSON.stringify(p.skills || []),
            JSON.stringify(p.education || null),
            p.linkedinUrl || '',
            p.githubUrl || '',
            p.preferredDifficulty || 'INTERMEDIATE',
            p.updatedAt || new Date().toISOString()
          ]
        );
      }

      // Seed Schedules
      for (const [id, s] of seedSchedules.entries()) {
        await query(
          `INSERT INTO schedules (id, user_id, title, category, domain, difficulty, target_role, scheduled_for, notes, status, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           ON CONFLICT (id) DO NOTHING;`,
          [
            s.id || id,
            s.userId,
            s.title,
            s.category,
            s.domain,
            s.difficulty,
            s.targetRole,
            s.scheduledFor,
            s.notes || '',
            s.status || 'CONFIRMED',
            s.createdAt || new Date().toISOString()
          ]
        );
      }

      // Seed User Progress
      for (const [userId, prog] of seedUserProgress.entries()) {
        await query(
          `INSERT INTO user_progress (user_id, total_interviews, total_answers, average_score, technical_average, communication_avg, confidence_avg, current_streak_days, longest_streak_days, total_xp_points, level, strongest_topics, weakest_topics, last_active_date)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
           ON CONFLICT (user_id) DO NOTHING;`,
          [
            userId,
            prog.totalInterviews || 0,
            prog.totalAnswers || 0,
            prog.averageScore || 0,
            prog.technicalAverage || 0,
            prog.communicationAvg || 0,
            prog.confidenceAvg || 0,
            prog.currentStreakDays || 1,
            prog.longestStreakDays || 1,
            prog.totalXpPoints || 50,
            prog.level || 1,
            JSON.stringify(prog.strongestTopics || []),
            JSON.stringify(prog.weakestTopics || []),
            prog.lastActiveDate || new Date().toISOString()
          ]
        );
      }

      // Seed Question Bank
      if (Array.isArray(seedQuestionBank)) {
        for (const q of seedQuestionBank) {
          await query(
            `INSERT INTO question_bank (id, title, category, domain, difficulty, question_type, question_text, expected_keywords, ideal_answer_rubric, core_competency_tested, sample_answer, explanation, key_concepts, upvotes, target_roles, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
             ON CONFLICT (id) DO NOTHING;`,
            [
              q.id,
              q.title,
              q.category,
              q.domain,
              q.difficulty,
              q.questionType,
              q.questionText,
              JSON.stringify(q.expectedKeywords || []),
              q.idealAnswerRubric || '',
              q.coreCompetencyTested || '',
              q.sampleAnswer || '',
              q.explanation || '',
              JSON.stringify(q.keyConcepts || []),
              q.upvotes || 0,
              JSON.stringify(q.targetRoles || []),
              new Date().toISOString()
            ]
          );
        }
      }

      // Seed Coding Problems
      if (Array.isArray(seedCodingProblems)) {
        for (const cp of seedCodingProblems) {
          await query(
            `INSERT INTO coding_problems (id, slug, title, difficulty, category, target_roles, function_name, param_names, description, input_format, output_format, constraints, starter_code, hints, test_cases, time_complexity, space_complexity)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
             ON CONFLICT (slug) DO NOTHING;`,
            [
              cp.id,
              cp.slug,
              cp.title,
              cp.difficulty,
              cp.category,
              JSON.stringify(cp.targetRoles || []),
              cp.functionName || '',
              JSON.stringify(cp.paramNames || []),
              cp.description || '',
              cp.inputFormat || '',
              cp.outputFormat || '',
              JSON.stringify(cp.constraints || []),
              JSON.stringify(cp.starterCode || {}),
              JSON.stringify(cp.hints || []),
              JSON.stringify(cp.testCases || []),
              cp.timeComplexity || '',
              cp.spaceComplexity || ''
            ]
          );
        }
      }

      console.log('[Database] PostgreSQL initial seed completed successfully.');
    }

    return {
      isPostgres: true,
      activeMode: 'POSTGRESQL',
      database: conn.database,
      timestamp: conn.timestamp
    };
  } catch (err) {
    console.error('[Database] Failed to initialize PostgreSQL tables:', err);
    return {
      isPostgres: false,
      activeMode: 'IN_MEMORY_FALLBACK',
      message: err.message
    };
  }
}

export default initDb;
