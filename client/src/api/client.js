const BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001/api' : '/api');

export async function api(path, options = {}) {
  const token = localStorage.getItem('token');
  const isFormData = options.body instanceof FormData;

  let timeZone = 'UTC';
  try {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {}

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'x-timezone': timeZone,
    ...options.headers
  };

  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
}

export const apiService = {
  // Authentication
  login: (email, password) => api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (payload) => api('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => api('/auth/me'),
  forgotPassword: (email) => api('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  // Profile
  getProfile: () => api('/profile'),
  updateProfile: (profile) => api('/profile', { method: 'PUT', body: JSON.stringify(profile) }),

  // Resume Intelligence & JD Matcher
  uploadResume: (payload) => {
    if (payload instanceof FormData) {
      return api('/resume/upload', { method: 'POST', body: payload });
    }
    const body = typeof payload === 'string' ? { resumeText: payload } : payload;
    return api('/resume/upload', { method: 'POST', body: JSON.stringify(body) });
  },
  getAllResumes: async () => {
    try {
      const res = await api('/resume');
      return Array.isArray(res) ? res : (res?.resumes || (res ? [res] : []));
    } catch (err) {
      console.warn('[apiService.getAllResumes]:', err.message);
      return [];
    }
  },
  getLatestResume: async () => {
    try {
      const res = await api('/resume/latest');
      return res || null;
    } catch (err) {
      if (err.message?.includes('No resume') || err.message?.includes('404')) {
        return null;
      }
      console.warn('[apiService.getLatestResume]:', err.message);
      return null;
    }
  },
  setActiveResume: (id) => api(`/resume/${id}/set-active`, { method: 'PUT' }),
  deleteResume: (id) => api(`/resume/${id}`, { method: 'DELETE' }),
  analyzeJobDescription: (jobDescriptionText, resumeText, resumeId = null) =>
    api('/resume/analyze-jd', { method: 'POST', body: JSON.stringify({ jobDescriptionText, resumeText, resumeId }) }),

  // Interview Sessions
  createInterview: (config) => api('/interview/create', { method: 'POST', body: JSON.stringify(config) }),
  getInterview: (sessionId) => api(`/interview/${sessionId}`),
  startInterview: (sessionId) => api(`/interview/${sessionId}/start`, { method: 'POST' }),
  submitAnswer: (sessionId, payload) => api(`/interview/${sessionId}/answer`, { method: 'POST', body: JSON.stringify(payload) }),
  requestFollowUp: (sessionId, payload) => api(`/interview/${sessionId}/follow-up`, { method: 'POST', body: JSON.stringify(payload) }),
  finishInterview: (sessionId) => api(`/interview/${sessionId}/finish`, { method: 'POST' }),
  terminateInterview: (sessionId, payload) => api(`/interview/${sessionId}/terminate`, { method: 'POST', body: JSON.stringify(payload) }),
  getInterviewReport: (sessionId) => api(`/interview/${sessionId}/report`),

  // Coding Module
  getCodingProblems: (params = '') => api(`/coding/problems${params}`),
  getCodingProblem: (slug) => api(`/coding/problems/${slug}`),
  runCode: (payload) => api('/coding/run', { method: 'POST', body: JSON.stringify(payload) }),
  submitCode: (payload) => api('/coding/submit', { method: 'POST', body: JSON.stringify(payload) }),

  // Question Bank
  getQuestionBank: (params = '') => api(`/question-bank${params}`),
  addQuestionToBank: (payload) => api('/question-bank', { method: 'POST', body: JSON.stringify(payload) }),
  upvoteQuestion: (id) => api(`/question-bank/${id}/upvote`, { method: 'POST' }),

  // Analytics & Gamification
  getDashboardAnalytics: () => api('/analytics/dashboard'),
  getSessionHistory: () => api('/analytics/history'),
  getGamificationStatus: () => api('/gamification/status'),
  dailyCheckIn: () => api('/gamification/check-in', { method: 'POST' }),
  getLeaderboard: () => api('/gamification/leaderboard'),

  // Schedule Rehearsals
  getSchedules: () => api('/schedule'),
  createSchedule: (payload) => api('/schedule', { method: 'POST', body: JSON.stringify(payload) }),
  deleteSchedule: (id) => api(`/schedule/${id}`, { method: 'DELETE' }),

  // Admin
  getAdminUsers: () => api('/admin/users'),
  updateUserRole: (id, role) => api(`/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
  getAdminStats: () => api('/admin/stats')
};
