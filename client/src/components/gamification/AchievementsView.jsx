import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Flame,
  Award,
  Star,
  CheckCircle2,
  Lock,
  Users
} from 'lucide-react';
import { apiService } from '../../api/client.js';

export default function AchievementsView() {
  const [gamification, setGamification] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: 54,
              height: 54,
              borderRadius: 'var(--radius-lg)',
              background: todayCompleted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              color: todayCompleted ? 'var(--accent-emerald)' : 'var(--accent-amber)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.2)'
            }}>
              <Flame size={28} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span className="eyebrow" style={{ color: 'var(--accent-amber)', margin: 0 }}>PRACTICE CADENCE</span>
                {todayCompleted ? (
                  <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-emerald)', fontSize: '0.7rem', fontWeight: 700 }}>
                    ✓ Goal Completed Today
                  </span>
                ) : (
                  <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: 'var(--accent-amber)', fontSize: '0.7rem', fontWeight: 700 }}>
                    Practice Pending Today
                  </span>
                )}
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                {streak} Day Active Streak <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>(Best: {longestStreak} Days)</span>
              </h3>
            </div>
          </div>

          {!todayCompleted && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleDailyCheckIn}
              style={{ gap: '0.45rem', fontWeight: 700 }}
            >
              <Flame size={16} />
              <span>Log Daily Practice (+50 XP)</span>
            </button>
          )}
        </div>

        {/* 7-Day Rolling History */}
        {rolling7Days && rolling7Days.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-surface-elevated)',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            overflowX: 'auto'
          }}>
            {rolling7Days.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  minWidth: 50
                }}
              >
                <span style={{ fontSize: '0.75rem', fontWeight: item.isToday ? 800 : 600, color: item.isToday ? 'var(--primary)' : 'var(--text-secondary)' }}>
                  {item.isToday ? 'Today' : item.day}
                </span>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    background: item.active
                      ? 'rgba(16, 185, 129, 0.2)'
                      : item.isToday
                      ? 'rgba(245, 158, 11, 0.15)'
                      : 'var(--bg-surface)',
                    border: `2px solid ${
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
        )}
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
