import React from 'react';
import {
  Sparkles,
  Mic,
  FileText,
  Briefcase,
  Code2,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Flame,
  Calendar,
  Clock,
  Play,
  UserCog,
  BookOpen
} from 'lucide-react';
import { getDefaultLanguageForRole } from '../../constants/languages.js';

export default function DashboardView({
  user,
  profile,
  analytics,
  gamification,
  schedules = [],
  onNavigate,
  onStartQuickMock,
  onOpenProfile
}) {
  const readiness = analytics?.readinessScore ?? 84;
  const totalMocks = analytics?.completedInterviews ?? 5;
  const streak = gamification?.currentStreakDays ?? 1;
  const longestStreak = gamification?.longestStreakDays ?? streak;
  const todayCompleted = Boolean(gamification?.todayCompleted);
  const streakPending = Boolean(gamification?.streakPending);
  const streakBroken = Boolean(gamification?.streakBroken);
  const rolling7Days = gamification?.rolling7Days || [];
  const xp = gamification?.xpPoints ?? 1250;
  const level = gamification?.level ?? 3;

  const targetRole = profile?.targetRole || 'Senior Software Engineer';
  const recentSessions = analytics?.recentSessions || [];

  const currentHour = new Date().getHours();
  const timeGreeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      {/* Header Profile Summary */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem' }}>
          <div style={{ position: 'relative' }}>
            <img
              src={user?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`}
              alt={user?.name || 'Candidate'}
              style={{
                width: 62,
                height: 62,
                borderRadius: 'var(--radius-xl)',
                border: '2px solid var(--border-glow)',
                boxShadow: '0 4px 20px var(--primary-glow)',
                objectFit: 'cover'
              }}
            />
            <span
              className="pulse-dot pulse-green"
              style={{
                position: 'absolute',
                bottom: 2,
                right: 2,
                width: 11,
                height: 11,
                border: '2px solid var(--bg-canvas)'
              }}
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span className="eyebrow" style={{ margin: 0 }}>CANDIDATE COCKPIT</span>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'var(--accent-emerald)',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.28)',
                padding: '0.12rem 0.5rem',
                borderRadius: 'var(--radius-full)'
              }}>
                Telemetry Active
              </span>
            </div>
            <h1 className="page-title" style={{ fontSize: '1.85rem', marginBottom: '0.2rem' }}>
              {timeGreeting}, {user?.name || 'Candidate'}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <p className="page-subtitle" style={{ marginBottom: 0, fontSize: '0.9rem' }}>
                Targeting <strong style={{ color: 'var(--text-primary)' }}>{targetRole}</strong> • Level {level} Rehearsal Pro
              </p>
              {onOpenProfile && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={onOpenProfile}
                  style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', gap: '0.35rem' }}
                  title="Edit Target Role, Domain & Skills"
                >
                  <UserCog size={12} />
                  <span>Edit Target Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="btn-group">
          <button
            type="button"
            className="btn btn-outline btn-md"
            onClick={() => onNavigate('schedule')}
            style={{ gap: '0.5rem' }}
          >
            <Calendar size={17} />
            <span>Manage Schedule</span>
          </button>
          <button
            type="button"
            className="btn btn-primary btn-md"
            onClick={() => onNavigate('interview-setup')}
            style={{ gap: '0.5rem', fontWeight: 700 }}
          >
            <Mic size={17} />
            <span>Start New Rehearsal</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {/* Card 1: Readiness */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.15rem', borderTop: '2px solid var(--primary)' }}>
          <div className="score-ring-container" style={{ width: 84, height: 84, flexShrink: 0 }}>
            <svg width="84" height="84" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="readinessGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--bg-surface-elevated)" strokeWidth="10" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#readinessGrad)"
                strokeWidth="10"
                strokeDasharray={`${readiness * 2.51} 251`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="score-ring-text">
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{readiness}%</span>
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Readiness Score
            </span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.15rem 0' }}>
              {readiness >= 85 ? 'Strong Hire' : readiness >= 70 ? 'Interview Ready' : 'In Training'}
            </h3>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.74rem',
              color: 'var(--accent-emerald)',
              fontWeight: 700
            }}>
              <CheckCircle2 size={12} />
              <span>+5% vs last week</span>
            </span>
          </div>
        </div>

        {/* Card 2: Completed Sessions */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.15rem', borderTop: '2px solid #38bdf8' }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(56, 189, 248, 0.15)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(56, 189, 248, 0.18)'
          }}>
            <TrendingUp size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Mocks Completed
            </span>
            <h3 style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1, margin: '0.15rem 0' }}>
              {totalMocks}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {analytics?.totalAnswers || 22} answers evaluated
            </span>
          </div>
        </div>

        {/* Card 3: Daily Streak */}
        <div className="card" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.15rem',
          borderTop: `2px solid ${todayCompleted ? 'var(--accent-emerald)' : streakPending ? 'var(--accent-amber)' : 'var(--accent-rose)'}`
        }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: 'var(--radius-lg)',
            background: todayCompleted ? 'rgba(16, 185, 129, 0.15)' : streakPending ? 'rgba(245, 158, 11, 0.15)' : 'rgba(244, 63, 94, 0.15)',
            color: todayCompleted ? 'var(--accent-emerald)' : streakPending ? 'var(--accent-amber)' : 'var(--accent-rose)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: todayCompleted ? '0 4px 12px rgba(16, 185, 129, 0.2)' : '0 4px 12px rgba(245, 158, 11, 0.18)'
          }}>
            <Flame size={26} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Practice Cadence
              </span>
              {todayCompleted ? (
                <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-emerald)', fontSize: '0.68rem', fontWeight: 700, padding: '0.1rem 0.45rem' }}>
                  ✓ Today Active
                </span>
              ) : streakPending ? (
                <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: 'var(--accent-amber)', fontSize: '0.68rem', fontWeight: 700, padding: '0.1rem 0.45rem' }}>
                  Practice Today
                </span>
              ) : (
                <span className="badge" style={{ background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)', fontSize: '0.68rem', fontWeight: 700, padding: '0.1rem 0.45rem' }}>
                  Inactive
                </span>
              )}
            </div>
            <h3 style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1, margin: '0.15rem 0' }}>
              {streak} {streak === 1 ? 'Day' : 'Days'}
            </h3>
            <span style={{ fontSize: '0.75rem', color: todayCompleted ? 'var(--accent-emerald)' : streakPending ? 'var(--accent-amber)' : 'var(--text-tertiary)', fontWeight: 600 }}>
              {todayCompleted ? 'Daily rehearsal goal met' : streakPending ? 'Practice today to maintain streak' : 'Start a new streak today'}
            </span>
          </div>
        </div>

        {/* Card 4: Level & XP */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.15rem', borderTop: '2px solid var(--accent-emerald)' }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(16, 185, 129, 0.15)',
            color: 'var(--accent-emerald)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.18)'
          }}>
            <Award size={26} />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Candidate Level
            </span>
            <h3 style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1, margin: '0.15rem 0' }}>
              Level {level}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.35rem' }}>
              <div style={{ flex: 1, height: 4, background: 'var(--bg-surface-elevated)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (xp % 500) / 5)}%`, height: '100%', background: 'var(--accent-emerald)', borderRadius: 999 }} />
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{xp} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Habit Cadence Tracker */}
      {rolling7Days && rolling7Days.length > 0 && (
        <div className="card" style={{
          marginBottom: '2rem',
          padding: '1.25rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.06), rgba(99, 102, 241, 0.04))',
          border: '1px solid rgba(245, 158, 11, 0.22)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              background: 'rgba(245, 158, 11, 0.15)',
              color: 'var(--accent-amber)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Flame size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                7-Day Consistency Tracker
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                {todayCompleted
                  ? 'Great work! You have completed your daily practice session today.'
                  : streakPending
                  ? `Keep your ${streak}-day streak alive! Complete a quick mock interview or coding drill today.`
                  : 'Start your streak today with a practice drill.'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {rolling7Days.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <span style={{ fontSize: '0.7rem', fontWeight: item.isToday ? 800 : 600, color: item.isToday ? 'var(--primary)' : 'var(--text-tertiary)' }}>
                  {item.isToday ? 'Today' : item.day}
                </span>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    background: item.active
                      ? 'rgba(16, 185, 129, 0.2)'
                      : item.isToday
                      ? 'rgba(245, 158, 11, 0.15)'
                      : 'var(--bg-surface-elevated)',
                    border: `1.5px solid ${
                      item.active
                        ? 'var(--accent-emerald)'
                        : item.isToday
                        ? 'var(--accent-amber)'
                        : 'var(--border-subtle)'
                    }`,
                    color: item.active
                      ? 'var(--accent-emerald)'
                      : item.isToday
                      ? 'var(--accent-amber)'
                      : 'var(--text-tertiary)'
                  }}
                  title={`${item.date}: ${item.active ? 'Practiced' : item.isToday ? 'Pending practice today' : 'No activity'}`}
                >
                  {item.active ? '✓' : item.isToday ? '🔥' : '·'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Rehearsal Spotlight Banner */}
      {Array.isArray(schedules) && schedules.length > 0 && schedules[0] ? (() => {
        const sched = schedules[0];
        const dateObj = sched.scheduledFor ? new Date(sched.scheduledFor) : null;
        const validDate = dateObj && !isNaN(dateObj.getTime());
        const dateDisplay = validDate
          ? `${dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} at ${dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`
          : 'Scheduled Rehearsal';

        return (
          <div className="card-elevated" style={{
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.08))',
            border: '1px solid rgba(99, 102, 241, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            padding: '1.25rem 1.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(99, 102, 241, 0.25)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Calendar size={24} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span className="badge badge-category" style={{ fontSize: '0.72rem' }}>
                    {sched.category || 'TECHNICAL'}
                  </span>
                  <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-emerald)', fontSize: '0.72rem', fontWeight: 700 }}>
                    Next Scheduled Session
                  </span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                  {sched.title || 'Upcoming Rehearsal'}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {dateDisplay} • Targeting {sched.targetRole || 'Software Engineer'}
                </p>
              </div>
            </div>
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => onNavigate('schedule')}
              >
                Manage Schedule
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => onStartQuickMock({
                  category: sched.category || 'TECHNICAL',
                  domain: sched.domain || 'Software Development',
                  difficulty: sched.difficulty || 'INTERMEDIATE',
                  role: sched.targetRole || 'Software Engineer',
                  programmingLanguage: sched.programmingLanguage || getDefaultLanguageForRole(sched.targetRole || 'Software Engineer', sched.domain || 'Software Development')
                })}
                style={{ gap: '0.4rem', fontWeight: 700 }}
              >
                <Play size={14} />
                <span>Launch Drill Now</span>
              </button>
            </div>
          </div>
        );
      })() : null}

      {/* Quick Launch Action Center */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Preparation Modules
        </h2>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>
          5 Integrated Training Pillars
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.15rem', marginBottom: '2.5rem' }}>
        <div
          className="card card-interactive"
          style={{ borderTop: '2px solid var(--primary)' }}
          onClick={() => onNavigate('interview-setup')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(56, 189, 248, 0.18)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(56, 189, 248, 0.15)' }}>
              <Mic size={22} />
            </div>
            <ArrowRight size={18} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem' }}>Mock Rehearsal</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Practice questions with voice/text, live timer, and 10-factor scorecard.
          </p>
        </div>

        <div
          className="card card-interactive"
          style={{ borderTop: '2px solid var(--secondary)' }}
          onClick={() => onNavigate('schedule')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(78, 222, 163, 0.18)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(78, 222, 163, 0.15)' }}>
              <Calendar size={22} />
            </div>
            <ArrowRight size={18} color="var(--secondary)" />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem' }}>Scheduler & Agendas</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Book targeted mock slots, set focus areas, and maintain practice cadence.
          </p>
        </div>

        <div
          className="card card-interactive"
          style={{ borderTop: '2px solid var(--accent-cyan)' }}
          onClick={() => onNavigate('resume')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(6, 182, 212, 0.18)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(6, 182, 212, 0.15)' }}>
              <FileText size={22} />
            </div>
            <ArrowRight size={18} color="var(--accent-cyan)" />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem' }}>Resume Intelligence</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Extract skills, uncover missing capabilities, and tailor questions to projects.
          </p>
        </div>

        <div
          className="card card-interactive"
          style={{ borderTop: '2px solid var(--accent-amber)' }}
          onClick={() => onNavigate('job-matcher')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.18)', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)' }}>
              <Briefcase size={22} />
            </div>
            <ArrowRight size={18} color="var(--accent-amber)" />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem' }}>JD Gap Matcher</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Paste target JD, calculate match score %, and generate custom drills.
          </p>
        </div>

        <div
          className="card card-interactive"
          style={{ borderTop: '2px solid var(--accent-emerald)' }}
          onClick={() => onNavigate('coding')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.18)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)' }}>
              <Code2 size={22} />
            </div>
            <ArrowRight size={18} color="var(--accent-emerald)" />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem' }}>Coding Sandbox</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Solve algorithm problems in isolated VM with test runner & complexity audits.
          </p>
        </div>
      </div>

      {/* Competencies Breakdown: Strongest vs Weakest */}
      <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <CheckCircle2 size={20} color="var(--accent-emerald)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Your Strongest Competencies</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Topics where your responses consistently exhibit strong technical depth and clarity:
          </p>
          <div className="tags-cloud">
            {(analytics?.strongestTopics || ['REST API Design', 'System Scalability', 'Clean Architecture']).map((topic, i) => (
              <span key={i} className="tag-pill tag-pill-matched">
                ✓ {topic}
              </span>
            ))}
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <AlertTriangle size={20} color="var(--accent-amber)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Focus Areas for Next Rehearsal</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            High-leverage areas where mentioning measurable metrics and STAR structure will elevate scores:
          </p>
          <div className="tags-cloud">
            {(analytics?.weakestTopics || ['Behavioral STAR Metrics', 'Time Complexity Nuance', 'Edge Cases']).map((topic, i) => (
              <span key={i} className="tag-pill tag-pill-missing">
                ! {topic}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Interview History Table */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Rehearsal Sessions</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Track your past performance across different interview tracks</p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => onNavigate('analytics')}>
            View Analytics & History
          </button>
        </div>

        {recentSessions.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p style={{ marginBottom: '1rem' }}>No mock interview sessions recorded yet.</p>
            <button className="btn btn-primary btn-sm" onClick={() => onNavigate('interview-setup')}>
              Launch Your First Mock Now
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-prominent)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Target Role & Category</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Difficulty</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Questions</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Score</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map((s) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>
                      {s.targetRole}
                      <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-tertiary)' }}>
                        {s.category} • {s.domain}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className={`badge badge-${(s.difficulty || 'intermediate').toLowerCase()}`}>
                        {s.difficulty}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                      {s.totalQuestions} Qs
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {s.overallScore ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.2rem 0.65rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          background: s.overallScore >= 80 ? 'rgba(16, 185, 129, 0.14)' : 'rgba(245, 158, 11, 0.14)',
                          color: s.overallScore >= 80 ? 'var(--accent-emerald)' : 'var(--accent-amber)',
                          border: `1px solid ${s.overallScore >= 80 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                        }}>
                          {s.overallScore}%
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-tertiary)' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        letterSpacing: '0.03em',
                        textTransform: 'uppercase',
                        color: s.status === 'COMPLETED' ? 'var(--accent-emerald)' : 'var(--primary)',
                        background: s.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(56, 189, 248, 0.12)',
                        border: `1px solid ${s.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.28)' : 'rgba(56, 189, 248, 0.28)'}`
                      }}>
                        <span className={`pulse-dot ${s.status === 'COMPLETED' ? 'pulse-green' : 'pulse-cyan'}`} style={{ width: 6, height: 6 }} />
                        <span>{s.status}</span>
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-tertiary)', fontSize: '0.82rem' }}>
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
