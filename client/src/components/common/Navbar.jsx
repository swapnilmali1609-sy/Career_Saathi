import React from 'react';
import {
  BrainCircuit,
  LayoutDashboard,
  Mic,
  Calendar,
  FileText,
  Briefcase,
  Code2,
  BookOpen,
  BarChart3,
  Trophy,
  ShieldAlert,
  Moon,
  Sun,
  Flame,
  Star,
  LogOut,
  User
} from 'lucide-react';

export default function Navbar({
  page,
  setPage,
  user,
  onSignOut,
  theme,
  toggleTheme,
  gamification,
  onOpenProfile
}) {
  const streak = gamification?.currentStreakDays ?? 1;
  const todayCompleted = Boolean(gamification?.todayCompleted);
  const xp = gamification?.xpPoints ?? 1250;
  const level = gamification?.level ?? 3;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'interview-setup', label: 'Mock Rehearsal', icon: Mic },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'resume', label: 'Resume AI', icon: FileText },
    { id: 'job-matcher', label: 'JD Matcher', icon: Briefcase },
    { id: 'coding', label: 'Coding Sandbox', icon: Code2 },
    { id: 'question-bank', label: 'Question Bank', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'achievements', label: 'Badges & XP', icon: Trophy }
  ];

  if (user?.role === 'ADMIN') {
    navItems.push({ id: 'admin', label: 'Admin', icon: ShieldAlert });
  }

  return (
    <header className="navbar">
      <div className="brand" onClick={() => setPage('dashboard')}>
        <div className="brand-icon">
          <BrainCircuit size={22} />
        </div>
        <div>
          <span className="brand-title">Career Saathi</span>
          <span className="brand-badge" style={{ marginLeft: '8px', letterSpacing: '0.04em' }}>
            Executive Cockpit
          </span>
        </div>
      </div>

      <nav className="nav-links">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = page === item.id || (item.id === 'interview-setup' && page === 'live-interview');
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setPage(item.id)}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="nav-actions">
        <div
          className="streak-pill"
          title={todayCompleted ? `${streak} consecutive days of rehearsal (Completed today!)` : `${streak} consecutive days of rehearsal (Practice today to extend streak!)`}
          style={{
            borderColor: todayCompleted ? 'rgba(16, 185, 129, 0.45)' : undefined,
            background: todayCompleted ? 'rgba(16, 185, 129, 0.12)' : undefined
          }}
        >
          <Flame size={15} color={todayCompleted ? 'var(--accent-emerald)' : 'var(--accent-amber)'} />
          <span style={{ color: todayCompleted ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
            {streak}d Streak{todayCompleted ? ' ✓' : ''}
          </span>
        </div>

        <div className="xp-pill" title={`Level ${level} Candidate (${xp} XP)`}>
          <Star size={15} />
          <span>Lvl {level}</span>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={toggleTheme}
          title="Toggle Dark / Light Theme"
          style={{ padding: '0.45rem', borderRadius: 'var(--radius-full)' }}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="user-menu" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onOpenProfile}
            style={{ padding: '0.35rem 0.75rem', gap: '0.5rem', borderRadius: 'var(--radius-full)' }}
            title="Click to view & edit candidate profile"
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <img
                src={user?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`}
                alt={user?.name || 'User'}
                className="user-avatar"
                style={{ width: 22, height: 22 }}
              />
              <span
                className="pulse-dot pulse-green"
                style={{
                  position: 'absolute',
                  bottom: -1,
                  right: -2,
                  width: 7,
                  height: 7,
                  border: '1.5px solid var(--bg-surface-elevated)'
                }}
              />
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
              {user?.name?.split(' ')[0]}
            </span>
          </button>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onSignOut}
            title="Sign Out of Career Saathi"
            style={{ padding: '0.4rem 0.75rem', gap: '0.35rem' }}
          >
            <LogOut size={15} />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
