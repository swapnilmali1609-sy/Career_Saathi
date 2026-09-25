import { query, isPgConfigured } from './pool.js';
import {
  users as memUsers,
  userProfiles as memUserProfiles,
  resumes as memResumes,
  sessions as memSessions,
  schedules as memSchedules,
  userProgress as memUserProgress,
  questionBankData as memQuestionBank,
  codingProblemsData as memCodingProblems,
  codingSubmissions as memCodingSubmissions
} from '../data.js';

// ==========================================
// 1. USERS REPOSITORY
// ==========================================
export const users = {
  async findByEmail(email) {
    const normalized = (email || '').toLowerCase().trim();
    if (isPgConfigured()) {
      try {
        const res = await query('SELECT * FROM users WHERE LOWER(email) = $1 LIMIT 1;', [normalized]);
        if (res.rows.length === 0) return null;
        const row = res.rows[0];
        return {
          id: row.id,
          name: row.name,
          email: row.email,
          password: row.password,
          role: row.role,
          avatarUrl: row.avatar_url,
          createdAt: row.created_at
        };
      } catch (err) {
        console.warn('[DB Fallback users.findByEmail]:', err.message);
      }
    }
    return memUsers.find(u => u.email.toLowerCase() === normalized) || null;
  },

  async findById(id) {
    if (isPgConfigured()) {
      try {
        const res = await query('SELECT * FROM users WHERE id = $1 LIMIT 1;', [id]);
        if (res.rows.length === 0) return null;
        const row = res.rows[0];
        return {
          id: row.id,
          name: row.name,
          email: row.email,
          password: row.password,
          role: row.role,
          avatarUrl: row.avatar_url,
          createdAt: row.created_at
        };
      } catch (err) {
        console.warn('[DB Fallback users.findById]:', err.message);
      }
    }
    return memUsers.find(u => u.id === id) || null;
  },

  async create(user) {
    if (isPgConfigured()) {
      try {
        await query(
          `INSERT INTO users (id, name, email, password, role, avatar_url, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7);`,
          [user.id, user.name, user.email, user.password, user.role || 'USER', user.avatarUrl, user.createdAt || new Date().toISOString()]
        );
        return user;
      } catch (err) {
        console.warn('[DB Fallback users.create]:', err.message);
      }
    }
    memUsers.push(user);
    return user;
  },

  async getAll() {
    if (isPgConfigured()) {
      try {
        const res = await query('SELECT id, name, email, role, avatar_url, created_at FROM users ORDER BY created_at DESC;');
        return res.rows.map(r => ({
          id: r.id,
          name: r.name,
          email: r.email,
          role: r.role,
          avatarUrl: r.avatar_url,
          createdAt: r.created_at
        }));
      } catch (err) {
        console.warn('[DB Fallback users.getAll]:', err.message);
      }
    }
    return memUsers.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      avatarUrl: u.avatarUrl,
      createdAt: u.createdAt
    }));
  },

  async updateRole(id, role) {
    if (isPgConfigured()) {
      try {
        const res = await query(
          'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role, avatar_url, created_at;',
          [role, id]
        );
        if (res.rows.length > 0) {
          const r = res.rows[0];
          return { id: r.id, name: r.name, email: r.email, role: r.role, avatarUrl: r.avatar_url, createdAt: r.created_at };
        }
      } catch (err) {
        console.warn('[DB Fallback users.updateRole]:', err.message);
      }
    }
    const memUser = memUsers.find(u => u.id === id);
    if (memUser) memUser.role = role;
    return memUser;
  },

  async count() {
    if (isPgConfigured()) {
      try {
        const res = await query('SELECT COUNT(*) FROM users;');
        return parseInt(res.rows[0]?.count || '0', 10);
      } catch (err) {
        console.warn('[DB Fallback users.count]:', err.message);
      }
    }
    return memUsers.length;
  }
};

// ==========================================
// 2. USER PROFILES REPOSITORY
// ==========================================
export const userProfiles = {
  async get(userId) {
    if (isPgConfigured()) {
      try {
        const res = await query('SELECT * FROM user_profiles WHERE user_id = $1 LIMIT 1;', [userId]);
        if (res.rows.length > 0) {
          const r = res.rows[0];
          return {
            userId: r.user_id,
            headline: r.headline,
            targetRole: r.target_role,
            targetDomain: r.target_domain,
            experienceYears: r.experience_years,
            skills: typeof r.skills === 'string' ? JSON.parse(r.skills) : (r.skills || []),
            education: typeof r.education === 'string' ? JSON.parse(r.education) : r.education,
            linkedinUrl: r.linkedin_url,
            githubUrl: r.github_url,
            preferredDifficulty: r.preferred_difficulty,
            updatedAt: r.updated_at
          };
        }
      } catch (err) {
        console.warn('[DB Fallback userProfiles.get]:', err.message);
      }
    }
    return memUserProfiles.get(userId) || null;
  },

  async upsert(userId, profileData) {
    if (isPgConfigured()) {
      try {
        const existing = await this.get(userId) || {};
        const merged = { ...existing, ...profileData, userId, updatedAt: new Date().toISOString() };
        await query(
          `INSERT INTO user_profiles (user_id, headline, target_role, target_domain, experience_years, skills, education, linkedin_url, github_url, preferred_difficulty, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           ON CONFLICT (user_id) DO UPDATE SET
             headline = EXCLUDED.headline,
             target_role = EXCLUDED.target_role,
             target_domain = EXCLUDED.target_domain,
             experience_years = EXCLUDED.experience_years,
             skills = EXCLUDED.skills,
             education = EXCLUDED.education,
             linkedin_url = EXCLUDED.linkedin_url,
             github_url = EXCLUDED.github_url,
             preferred_difficulty = EXCLUDED.preferred_difficulty,
             updated_at = EXCLUDED.updated_at;`,
          [
            userId,
            merged.headline || '',
            merged.targetRole || 'Software Engineer',
            merged.targetDomain || 'Software Development',
            merged.experienceYears || 0,
            JSON.stringify(merged.skills || []),
            JSON.stringify(merged.education || null),
            merged.linkedinUrl || '',
            merged.githubUrl || '',
            merged.preferredDifficulty || 'INTERMEDIATE',
            merged.updatedAt
          ]
        );
        return merged;
      } catch (err) {
        console.warn('[DB Fallback userProfiles.upsert]:', err.message);
      }
    }
    const existing = memUserProfiles.get(userId) || { userId };
    const updated = { ...existing, ...profileData, userId, updatedAt: new Date().toISOString() };
    memUserProfiles.set(userId, updated);
    return updated;
  }
};

// ==========================================
// 3. RESUMES REPOSITORY
// ==========================================
function normalizeResumeRecord(r) {
  if (!r) return null;
  const parsed = typeof r.parsedData === 'object' && r.parsedData !== null
    ? r.parsedData
    : (typeof r.parsed_data === 'string' ? JSON.parse(r.parsed_data) : (r.parsed_data || {}));

  const extracted = Array.isArray(r.extractedSkills) && r.extractedSkills.length > 0
    ? r.extractedSkills
    : (typeof r.extracted_skills === 'string'
        ? JSON.parse(r.extracted_skills)
        : (Array.isArray(r.extracted_skills) ? r.extracted_skills : (parsed.extractedSkills || [])));

  const missing = Array.isArray(r.missingSkills) && r.missingSkills.length > 0
    ? r.missingSkills
    : (parsed.missingRecommendedSkills || []);

  const filename = r.fileName || r.filename || 'Resume.pdf';
  const title = r.title || (filename ? filename.replace(/\.[^/.]+$/, "") : 'Resume');
  const targetRole = r.targetRole || r.target_role || parsed.headline || 'Software Engineer';
  const overallScore = r.overallScore || r.overall_score || parsed.resumeQualityScore || 80;

  return {
    id: r.id,
    userId: r.userId || r.user_id,
    title,
    targetRole,
    filename,
    fileName: filename,
    fileSize: r.fileSize || r.file_size || (r.rawText ? r.rawText.length : 0),
    mimeType: r.mimeType || r.mime_type || 'application/pdf',
    rawText: r.rawText || r.raw_text || '',
    extractedSkills: extracted,
    parsedData: parsed,
    missingSkills: missing,
    overallScore,
    isActive: Boolean(r.isActive ?? r.is_active),
    uploadedAt: r.uploadedAt || r.uploaded_at || r.createdAt || new Date().toISOString(),
    createdAt: r.createdAt || r.uploadedAt || r.uploaded_at || new Date().toISOString(),
    updatedAt: r.updatedAt || r.uploadedAt || r.uploaded_at || new Date().toISOString()
  };
}

export const resumes = {
  async getByUserId(userId) {
    if (isPgConfigured()) {
      try {
        const res = await query('SELECT * FROM resumes WHERE user_id = $1 ORDER BY uploaded_at DESC;', [userId]);
        return res.rows.map(normalizeResumeRecord);
      } catch (err) {
        console.warn('[DB Fallback resumes.getByUserId]:', err.message);
      }
    }
    const data = memResumes.get(userId);
    if (!data) return [];
    const list = Array.isArray(data) ? data : [data];
    return list.map(normalizeResumeRecord);
  },

  async getById(id) {
    if (isPgConfigured()) {
      try {
        const res = await query('SELECT * FROM resumes WHERE id = $1 LIMIT 1;', [id]);
        if (res.rows.length > 0) {
          return normalizeResumeRecord(res.rows[0]);
        }
      } catch (err) {
        console.warn('[DB Fallback resumes.getById]:', err.message);
      }
    }
    for (const list of memResumes.values()) {
      const arr = Array.isArray(list) ? list : [list];
      const found = arr.find(r => r.id === id);
      if (found) return normalizeResumeRecord(found);
    }
    return null;
  },

  async getActive(userId, specificResumeId = null) {
    const list = await this.getByUserId(userId);
    if (specificResumeId) {
      const specific = list.find(r => r.id === specificResumeId);
      if (specific) return specific;
    }
    return list.find(r => r.isActive) || list[0] || null;
  },

  async create(resume) {
    if (isPgConfigured()) {
      try {
        if (resume.isActive) {
          await query('UPDATE resumes SET is_active = false WHERE user_id = $1;', [resume.userId]);
        }
        await query(
          `INSERT INTO resumes (id, user_id, filename, file_size, mime_type, raw_text, extracted_skills, parsed_data, is_active, uploaded_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
          [
            resume.id,
            resume.userId,
            resume.filename,
            resume.fileSize || 0,
            resume.mimeType || 'application/pdf',
            resume.rawText || '',
            JSON.stringify(resume.extractedSkills || []),
            JSON.stringify(resume.parsedData || {}),
            Boolean(resume.isActive),
            resume.uploadedAt || new Date().toISOString()
          ]
        );
        return resume;
      } catch (err) {
        console.warn('[DB Fallback resumes.create]:', err.message);
      }
    }
    const current = memResumes.get(resume.userId);
    const list = Array.isArray(current) ? current : (current ? [current] : []);
    if (resume.isActive) {
      list.forEach(r => { r.isActive = false; });
    }
    list.unshift(resume);
    memResumes.set(resume.userId, list);
    return resume;
  },

  async setActive(userId, resumeId) {
    if (isPgConfigured()) {
      try {
        await query('UPDATE resumes SET is_active = false WHERE user_id = $1;', [userId]);
        const res = await query('UPDATE resumes SET is_active = true WHERE id = $1 AND user_id = $2 RETURNING *;', [resumeId, userId]);
        if (res.rows.length > 0) {
          return this.getByUserId(userId);
        }
      } catch (err) {
        console.warn('[DB Fallback resumes.setActive]:', err.message);
      }
    }
    const list = await this.getByUserId(userId);
    list.forEach(r => {
      r.isActive = r.id === resumeId;
    });
    memResumes.set(userId, list);
    return list;
  },

  async delete(id, userId) {
    if (isPgConfigured()) {
      try {
        const delRes = await query('DELETE FROM resumes WHERE id = $1 AND user_id = $2 RETURNING id, is_active;', [id, userId]);
        if (delRes.rows.length > 0 && delRes.rows[0].is_active) {
          const remaining = await query('SELECT id FROM resumes WHERE user_id = $1 ORDER BY uploaded_at DESC LIMIT 1;', [userId]);
          if (remaining.rows.length > 0) {
            await query('UPDATE resumes SET is_active = true WHERE id = $1;', [remaining.rows[0].id]);
          }
        }
        return true;
      } catch (err) {
        console.warn('[DB Fallback resumes.delete]:', err.message);
      }
    }
    const list = await this.getByUserId(userId);
    const idx = list.findIndex(r => r.id === id);
    if (idx === -1) return false;
    const wasActive = list[idx].isActive;
    list.splice(idx, 1);
    if (wasActive && list.length > 0) {
      list[0].isActive = true;
    }
    memResumes.set(userId, list);
    return true;
  }
};

// ==========================================
// 4. INTERVIEW SESSIONS REPOSITORY
// ==========================================
// 6. INTERVIEW SESSIONS REPOSITORY
// ==========================================
export const sessions = {
  async getById(id) {
    if (isPgConfigured()) {
      try {
        const res = await query('SELECT * FROM interview_sessions WHERE id = $1 LIMIT 1;', [id]);
        if (res.rows.length > 0) {
          const r = res.rows[0];
          return {
            id: r.id,
            userId: r.user_id,
            category: r.category,
            domain: r.domain,
            difficulty: r.difficulty,
            targetRole: r.target_role,
            normalizedRole: r.normalized_role || r.target_role,
            programmingLanguage: r.programming_language,
            normalizedProgrammingLanguage: r.normalized_programming_language || r.programming_language,
            jobDescription: r.job_description || '',
            resumeId: r.resume_id || null,
            selectedSkills: typeof r.selected_skills === 'string' ? JSON.parse(r.selected_skills) : (r.selected_skills || []),
            roleProfile: typeof r.role_profile === 'string' ? JSON.parse(r.role_profile) : (r.role_profile || {}),
            languageProfile: typeof r.language_profile === 'string' ? JSON.parse(r.language_profile) : (r.language_profile || {}),
            questions: typeof r.questions === 'string' ? JSON.parse(r.questions) : (r.questions || []),
            answers: typeof r.answers === 'string' ? JSON.parse(r.answers) : (r.answers || []),
            proctorLogs: typeof r.proctor_logs === 'string' ? JSON.parse(r.proctor_logs) : (r.proctor_logs || []),
            totalQuestions: r.total_questions,
            overallScore: r.overall_score,
            technicalScore: r.technical_score,
            communicationScore: r.communication_score,
            confidenceScore: r.confidence_score,
            summaryFeedback: typeof r.summary_feedback === 'string' ? JSON.parse(r.summary_feedback) : (r.summary_feedback || {}),
            status: r.status,
            isTerminated: r.is_terminated,
            terminationReason: r.termination_reason,
            startedAt: r.started_at,
            completedAt: r.completed_at,
            createdAt: r.created_at
          };
        }
      } catch (err) {
        console.warn('[DB Fallback sessions.getById]:', err.message);
      }
    }
    return memSessions.get(id) || null;
  },

  async findByUserId(userId) {
    if (isPgConfigured()) {
      try {
        const res = await query('SELECT * FROM interview_sessions WHERE user_id = $1 ORDER BY created_at DESC;', [userId]);
        return res.rows.map(r => ({
          id: r.id,
          userId: r.user_id,
          category: r.category,
          domain: r.domain,
          difficulty: r.difficulty,
          targetRole: r.target_role,
          normalizedRole: r.normalized_role || r.target_role,
          programmingLanguage: r.programming_language,
          normalizedProgrammingLanguage: r.normalized_programming_language || r.programming_language,
          jobDescription: r.job_description || '',
          resumeId: r.resume_id || null,
          selectedSkills: typeof r.selected_skills === 'string' ? JSON.parse(r.selected_skills) : (r.selected_skills || []),
          roleProfile: typeof r.role_profile === 'string' ? JSON.parse(r.role_profile) : (r.role_profile || {}),
          languageProfile: typeof r.language_profile === 'string' ? JSON.parse(r.language_profile) : (r.language_profile || {}),
          questions: typeof r.questions === 'string' ? JSON.parse(r.questions) : (r.questions || []),
          answers: typeof r.answers === 'string' ? JSON.parse(r.answers) : (r.answers || []),
          proctorLogs: typeof r.proctor_logs === 'string' ? JSON.parse(r.proctor_logs) : (r.proctor_logs || []),
          totalQuestions: r.total_questions,
          overallScore: r.overall_score,
          technicalScore: r.technical_score,
          communicationScore: r.communication_score,
          confidenceScore: r.confidence_score,
          summaryFeedback: typeof r.summary_feedback === 'string' ? JSON.parse(r.summary_feedback) : (r.summary_feedback || {}),
          status: r.status,
          isTerminated: r.is_terminated,
          terminationReason: r.termination_reason,
          startedAt: r.started_at,
          completedAt: r.completed_at,
          createdAt: r.created_at
        }));
      } catch (err) {
        console.warn('[DB Fallback sessions.findByUserId]:', err.message);
      }
    }
    return Array.from(memSessions.values())
      .filter(s => s.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async create(sess) {
    if (isPgConfigured()) {
      try {
        await query(
          `INSERT INTO interview_sessions (
            id, user_id, category, domain, difficulty, target_role, normalized_role,
            programming_language, normalized_programming_language, job_description, resume_id, selected_skills,
            role_profile, language_profile, questions, answers, proctor_logs,
            total_questions, overall_score, technical_score, communication_score, confidence_score,
            summary_feedback, status, is_terminated, termination_reason, started_at, completed_at, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29);`,
          [
            sess.id,
            sess.userId,
            sess.category,
            sess.domain,
            sess.difficulty,
            sess.targetRole,
            sess.normalizedRole || null,
            sess.programmingLanguage || 'Python',
            sess.normalizedProgrammingLanguage || null,
            sess.jobDescription || null,
            sess.resumeId || null,
            JSON.stringify(sess.selectedSkills || []),
            JSON.stringify(sess.roleProfile || {}),
            JSON.stringify(sess.languageProfile || {}),
            JSON.stringify(sess.questions || []),
            JSON.stringify(sess.answers || []),
            JSON.stringify(sess.proctorLogs || []),
            sess.totalQuestions || (sess.questions ? sess.questions.length : 0),
            sess.overallScore || null,
            sess.technicalScore || null,
            sess.communicationScore || null,
            sess.confidenceScore || null,
            JSON.stringify(sess.summaryFeedback || {}),
            sess.status || 'CREATED',
            Boolean(sess.isTerminated),
            sess.terminationReason || null,
            sess.startedAt || null,
            sess.completedAt || null,
            sess.createdAt || new Date().toISOString()
          ]
        );
        return sess;
      } catch (err) {
        console.warn('[DB Fallback sessions.create]:', err.message);
      }
    }
    memSessions.set(sess.id, sess);
    return sess;
  },

  async update(id, updateData) {
    const existing = await this.getById(id);
    if (!existing) return null;
    const merged = { ...existing, ...updateData };

    if (isPgConfigured()) {
      try {
        await query(
          `UPDATE interview_sessions SET
             questions = $1,
             answers = $2,
             proctor_logs = $3,
             overall_score = $4,
             technical_score = $5,
             communication_score = $6,
             confidence_score = $7,
             summary_feedback = $8,
             status = $9,
             is_terminated = $10,
             termination_reason = $11,
             started_at = $12,
             completed_at = $13
           WHERE id = $14;`,
          [
            JSON.stringify(merged.questions || []),
            JSON.stringify(merged.answers || []),
            JSON.stringify(merged.proctorLogs || []),
            merged.overallScore || null,
            merged.technicalScore || null,
            merged.communicationScore || null,
            merged.confidenceScore || null,
            JSON.stringify(merged.summaryFeedback || {}),
            merged.status || 'IN_PROGRESS',
            Boolean(merged.isTerminated),
            merged.terminationReason || null,
            merged.startedAt || null,
            merged.completedAt || null,
            id
          ]
        );
        return merged;
      } catch (err) {
        console.warn('[DB Fallback sessions.update]:', err.message);
      }
    }
    memSessions.set(id, merged);
    return merged;
  },

  async count() {
    if (isPgConfigured()) {
      try {
        const res = await query('SELECT COUNT(*) FROM interview_sessions;');
        return parseInt(res.rows[0]?.count || '0', 10);
      } catch (err) {
        console.warn('[DB Fallback sessions.count]:', err.message);
      }
    }
    return memSessions.size;
  }
};

// ==========================================
// 5. SCHEDULES REPOSITORY
// ==========================================
export const schedules = {
  async findByUserId(userId) {
    if (isPgConfigured()) {
      try {
        const res = await query('SELECT * FROM schedules WHERE user_id = $1 ORDER BY scheduled_for ASC;', [userId]);
        return res.rows.map(r => ({
          id: r.id,
          userId: r.user_id,
          title: r.title,
          category: r.category,
          domain: r.domain,
          difficulty: r.difficulty,
          targetRole: r.target_role,
          scheduledFor: r.scheduled_for,
          notes: r.notes,
          status: r.status,
          createdAt: r.created_at
        }));
      } catch (err) {
        console.warn('[DB Fallback schedules.findByUserId]:', err.message);
      }
    }
    return Array.from(memSchedules.values())
      .filter(s => s.userId === userId)
      .sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor));
  },

  async getById(id) {
    if (isPgConfigured()) {
      try {
        const res = await query('SELECT * FROM schedules WHERE id = $1 LIMIT 1;', [id]);
        if (res.rows.length > 0) {
          const r = res.rows[0];
          return {
            id: r.id,
            userId: r.user_id,
            title: r.title,
            category: r.category,
            domain: r.domain,
            difficulty: r.difficulty,
            targetRole: r.target_role,
            scheduledFor: r.scheduled_for,
            notes: r.notes,
            status: r.status,
            createdAt: r.created_at
          };
        }
      } catch (err) {
        console.warn('[DB Fallback schedules.getById]:', err.message);
      }
    }
    return memSchedules.get(id) || null;
  },

  async create(sched) {
    if (isPgConfigured()) {
      try {
        await query(
          `INSERT INTO schedules (id, user_id, title, category, domain, difficulty, target_role, scheduled_for, notes, status, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`,
          [
            sched.id,
            sched.userId,
            sched.title,
            sched.category,
            sched.domain,
            sched.difficulty,
            sched.targetRole,
            sched.scheduledFor,
            sched.notes || '',
            sched.status || 'CONFIRMED',
            sched.createdAt || new Date().toISOString()
          ]
        );
        return sched;
      } catch (err) {
        console.warn('[DB Fallback schedules.create]:', err.message);
      }
    }
    memSchedules.set(sched.id, sched);
    return sched;
  },

  async delete(id, userId, isAdmin = false) {
    if (isPgConfigured()) {
      try {
        const sql = isAdmin
          ? 'DELETE FROM schedules WHERE id = $1 RETURNING id;'
          : 'DELETE FROM schedules WHERE id = $1 AND user_id = $2 RETURNING id;';
        const params = isAdmin ? [id] : [id, userId];
        const res = await query(sql, params);
        return res.rows.length > 0;
      } catch (err) {
        console.warn('[DB Fallback schedules.delete]:', err.message);
      }
    }
    const item = memSchedules.get(id);
    if (!item || (item.userId !== userId && !isAdmin)) return false;
    return memSchedules.delete(id);
  }
};

// ==========================================
// 6. USER PROGRESS & GAMIFICATION
// ==========================================
export const userProgress = {
  async get(userId) {
    if (isPgConfigured()) {
      try {
        const res = await query('SELECT * FROM user_progress WHERE user_id = $1 LIMIT 1;', [userId]);
        if (res.rows.length > 0) {
          const r = res.rows[0];
          return {
            userId: r.user_id,
            totalInterviews: r.total_interviews,
            totalAnswers: r.total_answers,
            averageScore: parseFloat(r.average_score || '0'),
            technicalAverage: parseFloat(r.technical_average || '0'),
            communicationAvg: parseFloat(r.communication_avg || '0'),
            confidenceAvg: parseFloat(r.confidence_avg || '0'),
            currentStreakDays: r.current_streak_days,
            longestStreakDays: r.longest_streak_days,
            totalXpPoints: r.total_xp_points,
            level: r.level,
            strongestTopics: typeof r.strongest_topics === 'string' ? JSON.parse(r.strongest_topics) : (r.strongest_topics || []),
            weakestTopics: typeof r.weakest_topics === 'string' ? JSON.parse(r.weakest_topics) : (r.weakest_topics || []),
            lastActiveDate: r.last_active_date
          };
        }
      } catch (err) {
        console.warn('[DB Fallback userProgress.get]:', err.message);
      }
    }
    return memUserProgress.get(userId) || null;
  },

  async update(userId, progressData) {
    if (isPgConfigured()) {
      try {
        const existing = await this.get(userId) || { userId };
        const merged = { ...existing, ...progressData };
        await query(
          `INSERT INTO user_progress (
             user_id, total_interviews, total_answers, average_score, technical_average,
             communication_avg, confidence_avg, current_streak_days, longest_streak_days,
             total_xp_points, level, strongest_topics, weakest_topics, last_active_date
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
           ON CONFLICT (user_id) DO UPDATE SET
             total_interviews = EXCLUDED.total_interviews,
             total_answers = EXCLUDED.total_answers,
             average_score = EXCLUDED.average_score,
             technical_average = EXCLUDED.technical_average,
             communication_avg = EXCLUDED.communication_avg,
             confidence_avg = EXCLUDED.confidence_avg,
             current_streak_days = EXCLUDED.current_streak_days,
             longest_streak_days = EXCLUDED.longest_streak_days,
             total_xp_points = EXCLUDED.total_xp_points,
             level = EXCLUDED.level,
             strongest_topics = EXCLUDED.strongest_topics,
             weakest_topics = EXCLUDED.weakest_topics,
             last_active_date = EXCLUDED.last_active_date;`,
          [
            userId,
            merged.totalInterviews ?? 0,
            merged.totalAnswers ?? 0,
            merged.averageScore ?? 0,
            merged.technicalAverage ?? 0,
            merged.communicationAvg ?? 0,
            merged.confidenceAvg ?? 0,
            merged.currentStreakDays ?? 0,
            merged.longestStreakDays ?? 0,
            merged.totalXpPoints ?? 0,
            merged.level ?? 1,
            JSON.stringify(merged.strongestTopics || []),
            JSON.stringify(merged.weakestTopics || []),
            merged.lastActiveDate !== undefined ? merged.lastActiveDate : null
          ]
        );
        return merged;
      } catch (err) {
        console.warn('[DB Fallback userProgress.update]:', err.message);
      }
    }
    const existing = memUserProgress.get(userId) || { userId };
    const merged = { ...existing, ...progressData };
    memUserProgress.set(userId, merged);
    return merged;
  },

  async getLeaderboard() {
    if (isPgConfigured()) {
      try {
        const res = await query(
          `SELECT u.id, u.name, u.avatar_url, p.total_xp_points, p.level, p.total_interviews, p.average_score
           FROM users u
           JOIN user_progress p ON u.id = p.user_id
           ORDER BY p.total_xp_points DESC LIMIT 20;`
        );
        return res.rows.map((r, idx) => ({
          rank: idx + 1,
          userId: r.id,
          name: r.name,
          avatarUrl: r.avatar_url,
          xp: r.total_xp_points,
          level: r.level,
          interviewsCompleted: r.total_interviews,
          averageScore: Math.round(parseFloat(r.average_score || '0'))
        }));
      } catch (err) {
        console.warn('[DB Fallback userProgress.getLeaderboard]:', err.message);
      }
    }
    const entries = [];
    for (const [userId, prog] of memUserProgress.entries()) {
      const u = memUsers.find(user => user.id === userId);
      entries.push({
        userId,
        name: u?.name || 'Practitioner',
        avatarUrl: u?.avatarUrl,
        xp: prog.totalXpPoints || 50,
        level: prog.level || 1,
        interviewsCompleted: prog.totalInterviews || 0,
        averageScore: Math.round(prog.averageScore || 0)
      });
    }
    return entries.sort((a, b) => b.xp - a.xp).map((e, idx) => ({ rank: idx + 1, ...e }));
  }
};

// ==========================================
// 7. CODING REPOSITORY
// ==========================================
export const coding = {
  async getProblems(category = null, difficulty = null) {
    if (isPgConfigured()) {
      try {
        let sql = 'SELECT * FROM coding_problems WHERE 1=1';
        const params = [];
        if (category) {
          params.push(category);
          sql += ` AND category = $${params.length}`;
        }
        if (difficulty) {
          params.push(difficulty.toUpperCase());
          sql += ` AND difficulty = $${params.length}`;
        }
        const res = await query(sql, params);
        return res.rows.map(r => ({
          id: r.id,
          slug: r.slug,
          title: r.title,
          difficulty: r.difficulty,
          category: r.category,
          targetRoles: typeof r.target_roles === 'string' ? JSON.parse(r.target_roles) : (r.target_roles || []),
          functionName: r.function_name,
          paramNames: typeof r.param_names === 'string' ? JSON.parse(r.param_names) : (r.param_names || []),
          description: r.description,
          inputFormat: r.input_format,
          outputFormat: r.output_format,
          constraints: typeof r.constraints === 'string' ? JSON.parse(r.constraints) : (r.constraints || []),
          starterCode: typeof r.starter_code === 'string' ? JSON.parse(r.starter_code) : (r.starter_code || {}),
          hints: typeof r.hints === 'string' ? JSON.parse(r.hints) : (r.hints || []),
          testCases: typeof r.test_cases === 'string' ? JSON.parse(r.test_cases) : (r.test_cases || []),
          timeComplexity: r.time_complexity,
          spaceComplexity: r.space_complexity
        }));
      } catch (err) {
        console.warn('[DB Fallback coding.getProblems]:', err.message);
      }
    }
    let list = memCodingProblems;
    if (category) list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
    if (difficulty) list = list.filter(p => p.difficulty.toLowerCase() === difficulty.toLowerCase());
    return list;
  },

  async getProblemBySlug(slug) {
    if (isPgConfigured()) {
      try {
        const res = await query('SELECT * FROM coding_problems WHERE slug = $1 LIMIT 1;', [slug]);
        if (res.rows.length > 0) {
          const r = res.rows[0];
          return {
            id: r.id,
            slug: r.slug,
            title: r.title,
            difficulty: r.difficulty,
            category: r.category,
            targetRoles: typeof r.target_roles === 'string' ? JSON.parse(r.target_roles) : (r.target_roles || []),
            functionName: r.function_name,
            paramNames: typeof r.param_names === 'string' ? JSON.parse(r.param_names) : (r.param_names || []),
            description: r.description,
            inputFormat: r.input_format,
            outputFormat: r.output_format,
            constraints: typeof r.constraints === 'string' ? JSON.parse(r.constraints) : (r.constraints || []),
            starterCode: typeof r.starter_code === 'string' ? JSON.parse(r.starter_code) : (r.starter_code || {}),
            hints: typeof r.hints === 'string' ? JSON.parse(r.hints) : (r.hints || []),
            testCases: typeof r.test_cases === 'string' ? JSON.parse(r.test_cases) : (r.test_cases || []),
            timeComplexity: r.time_complexity,
            spaceComplexity: r.space_complexity
          };
        }
      } catch (err) {
        console.warn('[DB Fallback coding.getProblemBySlug]:', err.message);
      }
    }
    return memCodingProblems.find(p => p.slug === slug) || null;
  },

  async createSubmission(sub) {
    if (isPgConfigured()) {
      try {
        await query(
          `INSERT INTO coding_submissions (id, user_id, problem_slug, code, language, status, passed_tests, total_tests, runtime_ms, submitted_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
          [
            sub.id,
            sub.userId,
            sub.problemSlug,
            sub.code,
            sub.language,
            sub.status,
            sub.passedTests || 0,
            sub.totalTests || 0,
            sub.runtimeMs || 0,
            sub.submittedAt || new Date().toISOString()
          ]
        );
        return sub;
      } catch (err) {
        console.warn('[DB Fallback coding.createSubmission]:', err.message);
      }
    }
    memCodingSubmissions.push(sub);
    return sub;
  },

  async countSubmissions() {
    if (isPgConfigured()) {
      try {
        const res = await query('SELECT COUNT(*) FROM coding_submissions;');
        return parseInt(res.rows[0]?.count || '0', 10);
      } catch (err) {
        console.warn('[DB Fallback coding.countSubmissions]:', err.message);
      }
    }
    return memCodingSubmissions.length;
  }
};

// ==========================================
// 8. QUESTION BANK REPOSITORY
// ==========================================
export const questionBank = {
  async getAll(domain = null, difficulty = null, category = null) {
    if (isPgConfigured()) {
      try {
        let sql = 'SELECT * FROM question_bank WHERE 1=1';
        const params = [];
        if (domain && domain !== 'All') {
          params.push(domain);
          sql += ` AND domain = $${params.length}`;
        }
        if (difficulty && difficulty !== 'ALL') {
          params.push(difficulty.toUpperCase());
          sql += ` AND difficulty = $${params.length}`;
        }
        if (category && category !== 'ALL') {
          params.push(category.toUpperCase());
          sql += ` AND category = $${params.length}`;
        }
        sql += ' ORDER BY upvotes DESC, created_at DESC;';
        const res = await query(sql, params);
        return res.rows.map(r => ({
          id: r.id,
          title: r.title,
          category: r.category,
          domain: r.domain,
          difficulty: r.difficulty,
          questionType: r.question_type,
          questionText: r.question_text,
          expectedKeywords: typeof r.expected_keywords === 'string' ? JSON.parse(r.expected_keywords) : (r.expected_keywords || []),
          idealAnswerRubric: r.ideal_answer_rubric,
          coreCompetencyTested: r.core_competency_tested,
          sampleAnswer: r.sample_answer,
          explanation: r.explanation,
          keyConcepts: typeof r.key_concepts === 'string' ? JSON.parse(r.key_concepts) : (r.key_concepts || []),
          upvotes: r.upvotes,
          targetRoles: typeof r.target_roles === 'string' ? JSON.parse(r.target_roles) : (r.target_roles || []),
          createdAt: r.created_at
        }));
      } catch (err) {
        console.warn('[DB Fallback questionBank.getAll]:', err.message);
      }
    }
    let list = [...memQuestionBank];
    if (domain && domain !== 'All') list = list.filter(q => q.domain === domain);
    if (difficulty && difficulty !== 'ALL') list = list.filter(q => q.difficulty === difficulty.toUpperCase());
    if (category && category !== 'ALL') list = list.filter(q => q.category === category.toUpperCase());
    return list;
  },

  async create(q) {
    if (isPgConfigured()) {
      try {
        await query(
          `INSERT INTO question_bank (id, title, category, domain, difficulty, question_type, question_text, expected_keywords, ideal_answer_rubric, core_competency_tested, sample_answer, explanation, key_concepts, upvotes, target_roles, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16);`,
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
        return q;
      } catch (err) {
        console.warn('[DB Fallback questionBank.create]:', err.message);
      }
    }
    memQuestionBank.unshift(q);
    return q;
  },

  async upvote(id) {
    if (isPgConfigured()) {
      try {
        const res = await query('UPDATE question_bank SET upvotes = upvotes + 1 WHERE id = $1 RETURNING upvotes;', [id]);
        if (res.rows.length > 0) return res.rows[0].upvotes;
      } catch (err) {
        console.warn('[DB Fallback questionBank.upvote]:', err.message);
      }
    }
    const q = memQuestionBank.find(item => item.id === id);
    if (q) {
      q.upvotes = (q.upvotes || 0) + 1;
      return q.upvotes;
    }
    return null;
  },

  async count() {
    if (isPgConfigured()) {
      try {
        const res = await query('SELECT COUNT(*) FROM question_bank;');
        return parseInt(res.rows[0]?.count || '0', 10);
      } catch (err) {
        console.warn('[DB Fallback questionBank.count]:', err.message);
      }
    }
    return memQuestionBank.length;
  }
};

// ==========================================
// 9. ADMIN & STATS REPOSITORY
// ==========================================
export const admin = {
  async getStats() {
    const totalUsers = await users.count();
    const totalSessions = await sessions.count();
    const totalQuestions = await questionBank.count();
    const totalSubmissions = await coding.countSubmissions();
    return {
      totalUsers,
      totalSessions,
      totalQuestions,
      totalSubmissions,
      activeDatabase: isPgConfigured() ? 'PostgreSQL' : 'In-Memory Store (Active)',
      systemHealth: 'OPERATIONAL',
      timestamp: new Date().toISOString()
    };
  }
};

export default {
  users,
  userProfiles,
  resumes,
  sessions,
  schedules,
  userProgress,
  coding,
  questionBank,
  admin
};
