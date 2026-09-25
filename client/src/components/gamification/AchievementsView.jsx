import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Flame,
  Award,
  Star,
  CheckCircle2,
  Lock,
  Users,
  Video,
  XCircle
} from 'lucide-react';
import { apiService } from '../../api/client.js';

export default function AchievementsView() {
  const [gamification, setGamification] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [streakRange, setStreakRange] = useState('7');
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [status, board] = await Promise.all([
        apiService.getGamificationStatus(),
        apiService.getLeaderboard()
      ]);
      setGamification(status);
      setLeaderboard(board);
    } catch (err) {
      console.warn('[Gamification load error]:', err);
    }
  };

  const level = gamification?.level || 1;
  const xp = gamification?.xpPoints || 100;
  const streak = gamification?.currentStreakDays ?? 1;
  const longestStreak = gamification?.longestStreakDays ?? streak;
  const todayCompleted = Boolean(gamification?.todayCompleted);
  const rolling7Days = gamification?.rolling7Days || [];
  const progressPercent = gamification?.levelProgressPercent || 30;
  const badges = gamification?.badges || [];

  const activeRollingList = streakRange === '30'
    ? (gamification?.rolling30Days || gamification?.rolling7Days || [])
    : streakRange === '14'
    ? (gamification?.rolling14Days || gamification?.rolling7Days || [])
    : (gamification?.rolling7Days || []);

  const handleDailyCheckIn = async () => {
    try {
      const res = await apiService.dailyCheckIn();
      setGamification(prev => ({
        ...prev,
        ...res
      }));
      await loadData();
    } catch (err) {
      console.warn('[Check-in error]:', err);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <span className="eyebrow">GAMIFICATION & HABIT FORMATION</span>
        <h1 className="page-title">Achievements & Milestones</h1>
        <p className="page-subtitle">
          Earn experience points (XP), build daily practice streaks, and unlock achievement badges as you master interview techniques.
        </p>
      </div>

      {/* Level Progress Banner */}
      <div className="card-elevated" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 6px 20px var(--primary-glow)'
          }}>
            <Trophy size={36} />
          </div>
          <div>
            <span className="eyebrow" style={{ color: 'var(--accent-cyan)' }}>CURRENT RANK</span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
              Level {level} Interview Pro
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              {xp} Total Experience Points
            </p>
          </div>
        </div>

        {/* Progress bar to next level */}
        <div style={{ minWidth: 260, flex: 1, maxWidth: 380 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            <span>Progress to Level {level + 1}</span>
            <span style={{ color: 'var(--accent-emerald)' }}>{progressPercent}%</span>
          </div>
          <div className="progress-bar-container" style={{ height: 10 }}>
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.35rem' }}>
            Earn +{300 - (xp % 300)} XP to reach Level {level + 1}
          </span>
        </div>
      </div>

      {/* Daily Streak & Consistency Habit Center */}
      <div className="card-elevated" style={{
        marginBottom: '2.5rem',
        padding: '1.75rem 2rem',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(16, 185, 129, 0.05))',
        border: '1px solid rgba(245, 158, 11, 0.28)'
      }}>
        {/* Header Strip */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 'var(--radius-lg)',
              background: todayCompleted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              color: todayCompleted ? 'var(--accent-emerald)' : 'var(--accent-amber)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.2)',
              flexShrink: 0
            }}>
              <Flame size={30} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                <span className="eyebrow" style={{ color: 'var(--accent-amber)', margin: 0 }}>PRACTICE & ATTENDANCE CADENCE</span>
                {todayCompleted ? (
                  <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-emerald)', fontSize: '0.72rem', fontWeight: 800 }}>
                    ✓ Goal Completed Today
                  </span>
                ) : (
                  <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: 'var(--accent-amber)', fontSize: '0.72rem', fontWeight: 800 }}>
                    Practice Pending Today
                  </span>
                )}
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                {streak} Day Active Streak <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>(Best: {longestStreak} Days)</span>
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Range Selector */}
            <div style={{
              display: 'flex',
              background: 'var(--bg-surface)',
              padding: '3px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)'
            }}>
              {[
                { id: '7', label: '7 Days' },
                { id: '14', label: '14 Days' },
                { id: '30', label: '30 Days' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setStreakRange(tab.id);
                    setSelectedDay(null);
                  }}
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    fontSize: '0.74rem',
                    fontWeight: streakRange === tab.id ? 800 : 500,
                    background: streakRange === tab.id ? 'var(--primary)' : 'transparent',
                    color: streakRange === tab.id ? '#ffffff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {!todayCompleted && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleDailyCheckIn}
                style={{ gap: '0.45rem', fontWeight: 700, fontSize: '0.85rem' }}
              >
                <Flame size={16} />
                <span>Log Daily Practice (+50 XP)</span>
              </button>
            )}
          </div>
        </div>

        {/* Attendance Summary Stat Badges */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.85rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{
            background: 'var(--bg-surface-elevated)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-full)', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Video size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                Mocks Given
              </span>
              <strong style={{ fontSize: '1.15rem', color: 'var(--accent-emerald)' }}>
                {activeRollingList.filter(d => d.hasMock).length} {activeRollingList.filter(d => d.hasMock).length === 1 ? 'Session' : 'Sessions'}
              </strong>
            </div>
          </div>

          <div style={{
            background: 'var(--bg-surface-elevated)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(244, 63, 94, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-full)', background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <XCircle size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                Days Absent
              </span>
              <strong style={{ fontSize: '1.15rem', color: 'var(--accent-rose)' }}>
                {activeRollingList.filter(d => d.isAbsent).length} {activeRollingList.filter(d => d.isAbsent).length === 1 ? 'Day' : 'Days'}
              </strong>
            </div>
          </div>

          <div style={{
            background: 'var(--bg-surface-elevated)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-full)', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flame size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                Active Streak
              </span>
              <strong style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                {streak} Days Active
              </strong>
            </div>
          </div>
        </div>

        {/* Rolling History Grid */}
        {activeRollingList && activeRollingList.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(${streakRange === '30' ? '40px' : '75px'}, 1fr))`,
            gap: streakRange === '30' ? '0.4rem' : '0.65rem',
            background: 'var(--bg-surface-elevated)',
            padding: '1.15rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1rem'
          }}>
            {activeRollingList.map((item, idx) => {
              const isSelected = selectedDay?.date === item.date;
              const isMockGiven = item.hasMock || item.status === 'MOCK_GIVEN';
              const isAbsent = item.isAbsent || item.status === 'ABSENT';
              const isPractice = item.status === 'PRACTICE_COMPLETED';
              const isTodayPending = item.status === 'TODAY_PENDING' || (item.isToday && !item.active);

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDay(isSelected ? null : item)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: streakRange === '30' ? '0.4rem 0.2rem' : '0.65rem 0.4rem',
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected
                      ? 'rgba(99, 102, 241, 0.22)'
                      : isMockGiven
                      ? 'rgba(16, 185, 129, 0.12)'
                      : isAbsent
                      ? 'rgba(244, 63, 94, 0.08)'
                      : isPractice
                      ? 'rgba(99, 102, 241, 0.08)'
                      : item.isToday
                      ? 'rgba(245, 158, 11, 0.1)'
                      : 'var(--bg-surface)',
                    border: `1.5px solid ${
                      isSelected
                        ? 'var(--primary)'
                        : isMockGiven
                        ? 'rgba(16, 185, 129, 0.5)'
                        : isAbsent
                        ? 'rgba(244, 63, 94, 0.35)'
                        : isPractice
                        ? 'rgba(99, 102, 241, 0.4)'
                        : item.isToday
                        ? 'rgba(245, 158, 11, 0.5)'
                        : 'var(--border-subtle)'
                    }`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 0 10px rgba(99, 102, 241, 0.35)' : 'none'
                  }}
                  title={`${item.date}: ${item.statusLabel || (isMockGiven ? 'Mock Interview Given' : isAbsent ? 'Absent / Inactive' : 'Active')}`}
                >
                  {/* Day label */}
                  <span style={{
                    fontSize: streakRange === '30' ? '0.65rem' : '0.72rem',
                    fontWeight: item.isToday ? 800 : 600,
                    color: item.isToday ? 'var(--primary)' : 'var(--text-secondary)'
                  }}>
                    {item.isToday ? 'Today' : streakRange === '30' ? item.day.charAt(0) : item.day}
                  </span>

                  {/* Date badge */}
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', display: streakRange === '30' ? 'none' : 'block' }}>
                    {item.dayFormatted?.split(' ')[1] || item.date?.split('-')[2]}
                  </span>

                  {/* Icon Circle */}
                  <div
                    style={{
                      width: streakRange === '30' ? 26 : 34,
                      height: streakRange === '30' ? 26 : 34,
                      borderRadius: 'var(--radius-full)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: streakRange === '30' ? '0.75rem' : '0.85rem',
                      fontWeight: 800,
                      background: isMockGiven
                        ? 'rgba(16, 185, 129, 0.25)'
                        : isAbsent
                        ? 'rgba(244, 63, 94, 0.2)'
                        : isPractice
                        ? 'rgba(99, 102, 241, 0.2)'
                        : item.isToday
                        ? 'rgba(245, 158, 11, 0.25)'
                        : 'var(--bg-surface)',
                      color: isMockGiven
                        ? 'var(--accent-emerald)'
                        : isAbsent
                        ? 'var(--accent-rose)'
                        : isPractice
                        ? 'var(--primary)'
                        : item.isToday
                        ? 'var(--accent-amber)'
                        : 'var(--text-tertiary)',
                      border: `1px solid ${
                        isMockGiven
                          ? 'var(--accent-emerald)'
                          : isAbsent
                          ? 'var(--accent-rose)'
                          : isPractice
                          ? 'var(--primary)'
                          : item.isToday
                          ? 'var(--accent-amber)'
                          : 'var(--border-subtle)'
                      }`
                    }}
                  >
                    {isMockGiven ? (
                      <Video size={streakRange === '30' ? 12 : 15} />
                    ) : isAbsent ? (
                      <XCircle size={streakRange === '30' ? 12 : 15} />
                    ) : isPractice ? (
                      <CheckCircle2 size={streakRange === '30' ? 12 : 15} />
                    ) : isTodayPending ? (
                      <Flame size={streakRange === '30' ? 12 : 15} />
                    ) : (
                      '·'
                    )}
                  </div>

                  {/* Status Pill Tag (Shown in 7-day and 14-day modes) */}
                  {streakRange !== '30' && (
                    <span style={{
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      padding: '0.1rem 0.35rem',
                      borderRadius: 'var(--radius-full)',
                      marginTop: '0.15rem',
                      background: isMockGiven
                        ? 'rgba(16, 185, 129, 0.15)'
                        : isAbsent
                        ? 'rgba(244, 63, 94, 0.15)'
                        : isPractice
                        ? 'rgba(99, 102, 241, 0.15)'
                        : 'rgba(245, 158, 11, 0.15)',
                      color: isMockGiven
                        ? 'var(--accent-emerald)'
                        : isAbsent
                        ? 'var(--accent-rose)'
                        : isPractice
                        ? 'var(--primary)'
                        : 'var(--accent-amber)'
                    }}>
                      {isMockGiven ? 'Mock' : isAbsent ? 'Absent' : isPractice ? 'Drill' : 'Pending'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Selected Day Details Inspector */}
        {selectedDay && (
          <div style={{
            background: 'var(--bg-surface-elevated)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-prominent)',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {selectedDay.dayFormatted || selectedDay.date} ({selectedDay.isToday ? 'Today' : selectedDay.day})
                </span>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-full)',
                  background: selectedDay.hasMock
                    ? 'rgba(16, 185, 129, 0.2)'
                    : selectedDay.isAbsent
                    ? 'rgba(244, 63, 94, 0.2)'
                    : 'rgba(245, 158, 11, 0.2)',
                  color: selectedDay.hasMock
                    ? 'var(--accent-emerald)'
                    : selectedDay.isAbsent
                    ? 'var(--accent-rose)'
                    : 'var(--accent-amber)'
                }}>
                  {selectedDay.hasMock ? '✓ Mock Interview Given' : selectedDay.isAbsent ? '✕ Absent / Inactive' : '⚡ Practice Active'}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                {selectedDay.statusLabel || (selectedDay.hasMock ? 'Mock Interview Rehearsal Completed' : selectedDay.isAbsent ? 'No mock rehearsal or practice drill logged on this date.' : 'Practice activity recorded.')}
              </p>

              {/* Show mock session specifics if present */}
              {selectedDay.mocks && selectedDay.mocks.length > 0 && (
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {selectedDay.mocks.map((m, mIdx) => (
                    <span
                      key={mIdx}
                      style={{
                        fontSize: '0.74rem',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: 'var(--accent-emerald)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 600
                      }}
                    >
                      {m.role} {m.score != null ? `• Score: ${m.score}%` : ''} ({m.category})
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setSelectedDay(null)}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
            >
              Close
            </button>
          </div>
        )}

        {/* Visual Legend Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)',
          paddingTop: '0.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-emerald)', display: 'inline-block' }} />
              <strong>Mock Given</strong> (Interview Rehearsal)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--primary)', display: 'inline-block' }} />
              <strong>Practice / Drill</strong> (Question Practice)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-rose)', display: 'inline-block' }} />
              <strong>Absent</strong> (No Rehearsal Logged)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-amber)', display: 'inline-block' }} />
              <strong>Today Pending</strong> (Keep Streak Alive)
            </span>
          </div>

          <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
            💡 Click on any day to inspect details
          </span>
        </div>
      </div>

      {/* Badges Grid */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
        Achievement Badges ({badges.filter(b => b.isUnlocked).length} / {badges.length})
      </h2>
      <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
        {badges.map((b) => (
          <div
            key={b.id}
            className="card"
            style={{
              opacity: b.isUnlocked ? 1 : 0.65,
              background: b.isUnlocked ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
              border: `1px solid ${b.isUnlocked ? 'var(--border-prominent)' : 'var(--border-subtle)'}`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '2rem' }}>{b.badgeIcon}</span>
              {b.isUnlocked ? (
                <span className="badge badge-beginner" style={{ gap: '0.25rem' }}>
                  <CheckCircle2 size={12} /> Unlocked
                </span>
              ) : (
                <span className="badge badge-category" style={{ gap: '0.25rem' }}>
                  <Lock size={12} /> Locked
                </span>
              )}
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
              {b.title}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
              {b.description}
            </p>

            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-amber)' }}>
              +{b.xpReward} XP Reward
            </span>
          </div>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Users size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Weekly Rehearsal Leaderboard</h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-prominent)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Rank</th>
                <th style={{ padding: '0.75rem 1rem' }}>Candidate</th>
                <th style={{ padding: '0.75rem 1rem' }}>Level</th>
                <th style={{ padding: '0.75rem 1rem' }}>Streak</th>
                <th style={{ padding: '0.75rem 1rem' }}>Total Experience</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, idx) => (
                <tr key={user.userId} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>
                    #{idx + 1}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        style={{ width: 32, height: 32, borderRadius: 'var(--radius-full)' }}
                      />
                      <span style={{ fontWeight: 600 }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className="badge badge-category">Lvl {user.level}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ color: 'var(--accent-amber)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Flame size={14} /> {user.streakDays}d
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                    {user.xpPoints} XP
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
