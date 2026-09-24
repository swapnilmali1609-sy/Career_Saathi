import React, { useState, useEffect } from 'react';
import { apiService } from './api/client.js';

import Navbar from './components/common/Navbar.jsx';
import LoginForm from './components/auth/LoginForm.jsx';
import RegisterForm from './components/auth/RegisterForm.jsx';
import DashboardView from './components/dashboard/DashboardView.jsx';
import InterviewSetup from './components/interview/InterviewSetup.jsx';
import LiveMockInterview from './components/interview/LiveMockInterview.jsx';
import InterviewReport from './components/interview/InterviewReport.jsx';
import ScheduleView from './components/schedule/ScheduleView.jsx';
import ProfileModal from './components/profile/ProfileModal.jsx';
import ResumeView from './components/resume/ResumeView.jsx';
import JobMatcherView from './components/jobMatcher/JobMatcherView.jsx';
import CodingPracticeView from './components/coding/CodingPracticeView.jsx';
import QuestionBankView from './components/questionBank/QuestionBankView.jsx';
import AnalyticsView from './components/analytics/AnalyticsView.jsx';
import AchievementsView from './components/gamification/AchievementsView.jsx';
import AdminView from './components/admin/AdminView.jsx';

import {
  BrainCircuit,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Mic,
  Code2,
  BarChart3,
  Database,
  Moon,
  Sun,
  Activity,
  FileText,
  Award,
  Layers,
  Target
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });

  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [page, setPage] = useState('dashboard');
  const [theme, setTheme] = useState('dark');

  // Shared state
  const [profile, setProfile] = useState(null);
  const [resume, setResume] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [gamification, setGamification] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [loadingLaunch, setLoadingLaunch] = useState(false);
  const [loadingResume, setLoadingResume] = useState(false);

  // Sync theme to body element
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Load user data on authentication
  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user]);

  const loadInitialData = async () => {
    try {
      const [prof, resumeList, an, gam, sched] = await Promise.all([
        apiService.getProfile().catch(() => null),
        apiService.getAllResumes().catch(() => []),
        apiService.getDashboardAnalytics().catch(() => null),
        apiService.getGamificationStatus().catch(() => null),
        apiService.getSchedules().catch(() => [])
      ]);
      setProfile(prof);
      const list = Array.isArray(resumeList) ? resumeList : (resumeList ? [resumeList] : []);
      setResumes(list);
      const active = list.find(r => r.isActive) || list[0] || null;
      setResume(active);
      setAnalytics(an);
      setGamification(gam);
      setSchedules(sched || []);
    } catch (e) {
      console.warn('[Initial load error]:', e);
    }
  };

  const fetchResumes = async () => {
    try {
      const resumeList = await apiService.getAllResumes();
      const list = Array.isArray(resumeList) ? resumeList : (resumeList ? [resumeList] : []);
      setResumes(list);
      setResume(prev => {
        if (prev && list.some(r => r.id === prev.id)) {
          return list.find(r => r.id === prev.id);
        }
        return list.find(r => r.isActive) || list[0] || null;
      });
      return list;
    } catch (err) {
      console.warn('[fetchResumes error]:', err.message);
      return [];
    }
  };

  // Re-fetch resumes when navigating to tabs that require fresh resume state
  useEffect(() => {
    if (user && (page === 'resume' || page === 'interview-setup' || page === 'job-matcher')) {
      fetchResumes();
    }
    if (user && (page === 'dashboard' || page === 'achievements')) {
      apiService.getGamificationStatus().then(setGamification).catch(() => {});
      apiService.getDashboardAnalytics().then(setAnalytics).catch(() => {});
    }
  }, [page, user]);

  // Handle Login / Register
  const handleAuth = async (mode, form) => {
    const data = mode === 'login'
      ? await apiService.login(form.email, form.password)
      : await apiService.register(form);

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    setPage('dashboard');
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setPage('dashboard');
    setActiveSession(null);
  };

  // Interview Launch Handlers
  const handleLaunchMock = async (config) => {
    setLoadingLaunch(true);
    try {
      const session = await apiService.createInterview(config);
      await apiService.startInterview(session.id);
      setActiveSession(session);
      setPage('live-interview');
    } catch (err) {
      alert('Failed to initialize mock interview: ' + err.message);
    } finally {
      setLoadingLaunch(false);
    }
  };

  const handleSubmitAnswer = async (payload) => {
    if (!activeSession) return;
    const res = await apiService.submitAnswer(activeSession.id, payload);
    // Refresh gamification in background
    apiService.getGamificationStatus().then(setGamification).catch(() => {});
    return res;
  };

  const handleRequestFollowUp = async (payload) => {
    if (!activeSession) return;
    const followUp = await apiService.requestFollowUp(activeSession.id, payload);
    setActiveSession(prev => ({
      ...prev,
      questions: [...prev.questions, followUp]
    }));
    return followUp;
  };

  const handleFinishSession = async () => {
    if (!activeSession) return;
    try {
      const completed = await apiService.finishInterview(activeSession.id);
      setActiveSession(completed);
      setPage('interview-report');
      // Refresh analytics
      apiService.getDashboardAnalytics().then(setAnalytics).catch(() => {});
      apiService.getGamificationStatus().then(setGamification).catch(() => {});
    } catch (err) {
      alert('Error finishing session: ' + err.message);
    }
  };

  const handleTerminateSession = async (payload) => {
    if (!activeSession) return;
    try {
      const terminated = await apiService.terminateInterview(activeSession.id, payload);
      setActiveSession(terminated.session || activeSession);
      apiService.getDashboardAnalytics().then(setAnalytics).catch(() => {});
    } catch (err) {
      console.warn('[Session Terminate Error]:', err.message);
    }
  };

  // Resume Handlers
  const handleUploadResume = async (data, options = {}) => {
    setLoadingResume(true);
    try {
      const payload = data instanceof FormData ? data : { resumeText: data, ...options };
      const parsedResume = await apiService.uploadResume(payload);
      setResumes(prev => [parsedResume, ...prev.map(r => ({ ...r, isActive: false }))]);
      setResume(parsedResume);
      // Refresh profile skills
      apiService.getProfile().then(setProfile).catch(() => {});
      return parsedResume;
    } catch (err) {
      alert('Resume processing failed: ' + err.message);
      throw err;
    } finally {
      setLoadingResume(false);
    }
  };

  const handleSetActiveResume = async (resumeId) => {
    try {
      const res = await apiService.setActiveResume(resumeId);
      if (res.resumes) {
        setResumes(res.resumes);
      } else {
        setResumes(prev => prev.map(r => ({ ...r, isActive: r.id === resumeId })));
      }
      const target = res.activeResume || resumes.find(r => r.id === resumeId);
      if (target) setResume(target);
      apiService.getProfile().then(setProfile).catch(() => {});
    } catch (err) {
      alert('Failed to switch active resume: ' + err.message);
    }
  };

  const handleDeleteResume = async (resumeId) => {
    try {
      const res = await apiService.deleteResume(resumeId);
      const remaining = res.remainingResumes || resumes.filter(r => r.id !== resumeId);
      setResumes(remaining);
      if (resume?.id === resumeId) {
        setResume(res.activeResume || remaining[0] || null);
      }
    } catch (err) {
      alert('Failed to delete resume: ' + err.message);
    }
  };

  // If user is not authenticated, render the Executive Hero Landing & Auth Cockpit
  if (!user) {
    return (
      <div className="app-container">
        <div className="hero-landing-shell">
          {/* Executive Landing Top Navigation */}
          <header className="hero-landing-header">
            <div className="brand" style={{ cursor: 'default' }}>
              <div className="brand-icon">
                <BrainCircuit size={22} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span className="brand-title">Career Saathi</span>
                <span className="brand-badge">Executive Cockpit</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.28)',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--accent-emerald)'
              }}>
                <span className="pulse-dot pulse-green" />
                <span>Engine Online • PostgreSQL Ready</span>
              </div>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={toggleTheme}
                title="Toggle Dark / Light Theme"
                style={{ padding: '0.45rem', borderRadius: 'var(--radius-full)' }}
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
          </header>

          {/* Hero Grid: Showcase (Left) + Auth Cockpit (Right) */}
          <div className="hero-landing-grid">
            <div className="hero-showcase">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                <div className="hero-eyebrow">
                  <Sparkles size={13} />
                  <span>Next-Gen Candidate Intelligence</span>
                </div>
                <div className="glass-badge" style={{ color: 'var(--accent-emerald)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                  <span className="pulse-dot pulse-green" style={{ width: 6, height: 6 }} />
                  <span>v2.4 Production Engine</span>
                </div>
              </div>

              <h1 className="hero-title">
                Master Technical Interviews with{' '}
                <span className="text-gradient-cyan">Real-Time AI Precision.</span>
              </h1>

              <p className="hero-subtitle">
                Simulate rigorous, role-calibrated technical rehearsals with live speech telemetry, acoustic anti-cheat proctoring, multi-resume targeting, and instantaneous 10-factor rubrics.
              </p>

              {/* Value Metric Pills */}
              <div className="value-metric-strip">
                <div className="value-metric-pill">
                  <CheckCircle2 size={14} color="var(--primary)" />
                  <span>40+ Role Specializations</span>
                </div>
                <div className="value-metric-pill">
                  <CheckCircle2 size={14} color="var(--accent-emerald)" />
                  <span>10-Factor STAR Rubrics</span>
                </div>
                <div className="value-metric-pill">
                  <CheckCircle2 size={14} color="var(--accent-amber)" />
                  <span>Audio & Video Anti-Cheat</span>
                </div>
                <div className="value-metric-pill">
                  <CheckCircle2 size={14} color="#a78bfa" />
                  <span>Zero Installation Required</span>
                </div>
              </div>

              {/* 4 Core Pillars Matrix */}
              <div className="hero-features-grid">
                <div className="feature-pill-card" style={{ borderTop: '2px solid var(--primary)' }}>
                  <div className="feature-pill-icon" style={{ background: 'rgba(76, 215, 246, 0.16)', color: 'var(--primary)' }}>
                    <Target size={20} />
                  </div>
                  <h4 className="feature-pill-title">Role & Language Calibrated</h4>
                  <p className="feature-pill-desc">
                    CS fundamentals, algorithms & system design calibrated to 40+ roles & 20+ programming languages.
                  </p>
                </div>

                <div className="feature-pill-card" style={{ borderTop: '2px solid var(--accent-emerald)' }}>
                  <div className="feature-pill-icon" style={{ background: 'rgba(16, 185, 129, 0.16)', color: 'var(--accent-emerald)' }}>
                    <Mic size={20} />
                  </div>
                  <h4 className="feature-pill-title">Acoustic & Visual Proctoring</h4>
                  <p className="feature-pill-desc">
                    Real-time decibel tracking, speech activity detection (VAD), and multi-person presence anomaly detection.
                  </p>
                </div>

                <div className="feature-pill-card" style={{ borderTop: '2px solid var(--accent-amber)' }}>
                  <div className="feature-pill-icon" style={{ background: 'rgba(245, 158, 11, 0.16)', color: 'var(--accent-amber)' }}>
                    <Award size={20} />
                  </div>
                  <h4 className="feature-pill-title">10-Factor Executive Rubric</h4>
                  <p className="feature-pill-desc">
                    STAR framework scoring, time/space complexity analysis, edge-case scrutiny, and delivery confidence.
                  </p>
                </div>

                <div className="feature-pill-card" style={{ borderTop: '2px solid #a78bfa' }}>
                  <div className="feature-pill-icon" style={{ background: 'rgba(139, 92, 246, 0.16)', color: '#a78bfa' }}>
                    <FileText size={20} />
                  </div>
                  <h4 className="feature-pill-title">Multi-Resume Target Vault</h4>
                  <p className="feature-pill-desc">
                    Upload multiple resumes, match job descriptions, uncover skill gaps, and drill project-specific questions.
                  </p>
                </div>
              </div>

              {/* Telemetry Bar */}
              <div className="telemetry-bar">
                <div className="telemetry-item">
                  <span className="pulse-dot pulse-cyan" />
                  <span>Gemini Adaptive Engine Active</span>
                </div>
                <div className="telemetry-item">
                  <span className="pulse-dot pulse-green" />
                  <span>Dual-Mode PostgreSQL</span>
                </div>
                <div className="telemetry-item">
                  <span className="pulse-dot pulse-green" />
                  <span>Live Speech VAD & Anti-Cheat</span>
                </div>
              </div>
            </div>

            {/* Auth Cockpit Card */}
            <div>
              <div className="auth-card">
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--radius-lg)',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    color: '#003640',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 18px var(--primary-glow)',
                    marginBottom: '0.65rem'
                  }}>
                    <BrainCircuit size={26} />
                  </div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                    Candidate Access
                  </h2>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    Sign in to resume rehearsal or choose a 1-click demo persona
                  </p>
                </div>

                <div className="auth-tabs">
                  <button
                    type="button"
                    className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
                    onClick={() => setAuthMode('login')}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    className={`auth-tab ${authMode === 'register' ? 'active' : ''}`}
                    onClick={() => setAuthMode('register')}
                  >
                    Create Account
                  </button>
                </div>

                {authMode === 'login' ? (
                  <LoginForm onAuth={handleAuth} />
                ) : (
                  <RegisterForm onAuth={handleAuth} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Application Shell
  return (
    <div className="app-container">
      <Navbar
        page={page}
        setPage={setPage}
        user={user}
        onSignOut={handleSignOut}
        theme={theme}
        toggleTheme={toggleTheme}
        gamification={gamification}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {isProfileOpen && (
        <ProfileModal
          isOpen={isProfileOpen}
          profile={profile}
          onClose={() => setIsProfileOpen(false)}
          onUpdated={(newProf) => setProfile(newProf)}
        />
      )}

      <main className="main-content">
        {page === 'dashboard' && (
          <DashboardView
            user={user}
            profile={profile}
            analytics={analytics}
            gamification={gamification}
            schedules={schedules}
            onNavigate={setPage}
            onStartQuickMock={handleLaunchMock}
            onOpenProfile={() => setIsProfileOpen(true)}
          />
        )}

        {page === 'schedule' && (
          <ScheduleView
            onLaunchMock={handleLaunchMock}
          />
        )}

        {page === 'interview-setup' && (
          <InterviewSetup
            profile={profile}
            latestResume={resume}
            resumes={resumes}
            onLaunch={handleLaunchMock}
            loading={loadingLaunch}
          />
        )}

        {page === 'live-interview' && activeSession && (
          <LiveMockInterview
            session={activeSession}
            onSubmitAnswer={handleSubmitAnswer}
            onRequestFollowUp={handleRequestFollowUp}
            onFinishSession={handleFinishSession}
            onTerminateSession={handleTerminateSession}
            onExit={() => setPage('dashboard')}
          />
        )}

        {page === 'interview-report' && activeSession && (
          <InterviewReport
            session={activeSession}
            onRestart={() => setPage('interview-setup')}
            onDashboard={() => setPage('dashboard')}
          />
        )}

        {page === 'resume' && (
          <ResumeView
            resume={resume}
            resumes={resumes}
            onSelectResume={(r) => setResume(r)}
            onUploadResume={handleUploadResume}
            onSetActiveResume={handleSetActiveResume}
            onDeleteResume={handleDeleteResume}
            onRefreshResumes={fetchResumes}
            onLaunchTailoredMock={(res) => {
              const primarySkillLang = res.parsedData?.technicalSkills?.[0] || res.parsedData?.skills?.[0];
              handleLaunchMock({
                category: 'TECHNICAL',
                role: res.parsedData?.headline || res.targetRole || 'Software Engineer',
                programmingLanguage: primarySkillLang,
                useResume: true,
                resumeId: res.id
              });
            }}
            loading={loadingResume}
          />
        )}

        {page === 'job-matcher' && (
          <JobMatcherView
            resume={resume}
            resumes={resumes}
            onSelectResume={(r) => setResume(r)}
            onAnalyzeJD={(jdText, rText, rId) => apiService.analyzeJobDescription(jdText, rText, rId)}
            onLaunchCustomMock={(params) => {
              handleLaunchMock({
                category: 'TECHNICAL',
                difficulty: 'INTERMEDIATE',
                ...params
              });
            }}
            loading={false}
          />
        )}

        {page === 'coding' && (
          <CodingPracticeView />
        )}

        {page === 'question-bank' && (
          <QuestionBankView />
        )}

        {page === 'analytics' && (
          <AnalyticsView analytics={analytics} />
        )}

        {page === 'achievements' && (
          <AchievementsView />
        )}

        {page === 'admin' && user?.role === 'ADMIN' && (
          <AdminView />
        )}
      </main>
    </div>
  );
}
