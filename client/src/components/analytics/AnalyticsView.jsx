import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Calendar,
  Layers
} from 'lucide-react';

export default function AnalyticsView({ analytics, history }) {
  const readiness = analytics?.readinessScore ?? 84;
  const radarMetrics = analytics?.radarMetrics || [
    { subject: 'Technical Depth', score: 86 },
    { subject: 'Communication', score: 82 },
    { subject: 'Confidence', score: 84 },
    { subject: 'Accuracy', score: 88 },
    { subject: 'STAR Structure', score: 78 },
    { subject: 'Problem Solving', score: 85 }
  ];

  const scoreTrend = analytics?.scoreTrend || [
    { name: 'Drill 1', score: 70 },
    { name: 'Drill 2', score: 76 },
    { name: 'Drill 3', score: 82 },
    { name: 'Drill 4', score: 85 },
    { name: 'Drill 5', score: 88 }
  ];

  // Radar Polygon calculation (SVG coordinates)
  const size = 260;
  const center = size / 2;
  const radius = size * 0.38;
  const totalSides = radarMetrics.length;

  const points = radarMetrics.map((m, i) => {
    const angle = (Math.PI * 2 / totalSides) * i - Math.PI / 2;
    const r = (m.score / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div style={{ maxWidth: 1050, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <span className="eyebrow">READINESS AUDIT & SKILL TELEMETRY</span>
        <h1 className="page-title">Performance Analytics</h1>
        <p className="page-subtitle">
          Comprehensive multi-dimensional evaluation of your interview performance, communication clarity, and learning progression over time.
        </p>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div className="score-ring-container" style={{ width: 84, height: 84 }}>
            <svg width="84" height="84" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--bg-surface-elevated)" strokeWidth="10" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="10"
                strokeDasharray={`${readiness * 2.51} 251`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="score-ring-text">
              <span style={{ fontSize: '1.3rem', fontWeight: 800 }}>{readiness}%</span>
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Overall Readiness
            </span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
              {readiness >= 85 ? 'Strong Hire' : 'Interview Ready'}
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
              Top 15% Candidate Tier
            </span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: 54, height: 54, borderRadius: 'var(--radius-lg)', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Completed Sessions
            </span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1.1 }}>
              {analytics?.completedInterviews ?? 5}
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              100% evaluated with AI rubric
            </span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: 54, height: 54, borderRadius: 'var(--radius-lg)', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Flame size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Current Streak
            </span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1.1 }}>
              {analytics?.streakDays ?? 4} Days
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-amber)', fontWeight: 600 }}>
              Active Rehearsal Habit
            </span>
          </div>
        </div>
      </div>

      {/* Visual Analytics: Radar Chart & Trend Graph */}
      <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
        {/* SVG Radar Chart */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', alignSelf: 'flex-start' }}>
            6-Factor Competency Radar
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem', alignSelf: 'flex-start' }}>
            Multi-factor analysis across communication, technical precision, and confidence:
          </p>

          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Background Polygon Grids */}
            {gridLevels.map((lvl, gIdx) => {
              const gridPts = radarMetrics.map((_, i) => {
                const angle = (Math.PI * 2 / totalSides) * i - Math.PI / 2;
                const r = lvl * radius;
                const x = center + r * Math.cos(angle);
                const y = center + r * Math.sin(angle);
                return `${x},${y}`;
              }).join(' ');

              return (
                <polygon
                  key={gIdx}
                  points={gridPts}
                  fill="none"
                  stroke="var(--border-subtle)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Axes */}
            {radarMetrics.map((_, i) => {
              const angle = (Math.PI * 2 / totalSides) * i - Math.PI / 2;
              const x = center + radius * Math.cos(angle);
              const y = center + radius * Math.sin(angle);
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="var(--border-subtle)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Filled Score Polygon */}
            <polygon
              points={points}
              fill="rgba(99, 102, 241, 0.25)"
              stroke="var(--primary)"
              strokeWidth="2.5"
            />

            {/* Labels */}
            {radarMetrics.map((m, i) => {
              const angle = (Math.PI * 2 / totalSides) * i - Math.PI / 2;
              const labelRadius = radius + 22;
              const x = center + labelRadius * Math.cos(angle);
              const y = center + labelRadius * Math.sin(angle);
              return (
                <text
                  key={i}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="10"
                  fill="var(--text-secondary)"
                  fontWeight="600"
                >
                  {m.subject} ({m.score})
                </text>
              );
            })}
          </svg>
        </div>

        {/* Score Trend History Graph */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Historical Score Progression
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Tracking performance gains over your rehearsal history:
            </p>

            <div style={{ display: 'flex', alignItems: 'flex-end', height: 180, gap: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-prominent)' }}>
              {scoreTrend.map((item, idx) => {
                const heightPercent = Math.max(20, item.score);
                return (
                  <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                      {item.score}%
                    </span>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: 36,
                        height: `${heightPercent}%`,
                        background: 'linear-gradient(180deg, var(--primary), var(--accent-cyan))',
                        borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                        transition: 'height 0.5s ease-out'
                      }}
                    />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '0.45rem' }}>
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', padding: '0.85rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--accent-emerald)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <TrendingUp size={15} /> Your technical explanation scores improved +18% over the last 5 sessions!
            </span>
          </div>
        </div>
      </div>

      {/* Competencies Tags */}
      <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <CheckCircle2 size={18} color="var(--accent-emerald)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Strongest Competencies</h3>
          </div>
          <div className="tags-cloud">
            {(analytics?.strongestTopics || ['REST APIs', 'System Reliability', 'Clean Architecture', 'Database Indexing']).map((t, i) => (
              <span key={i} className="tag-pill tag-pill-matched">✓ {t}</span>
            ))}
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <AlertTriangle size={18} color="var(--accent-rose)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Priority Areas for Next Drill</h3>
          </div>
          <div className="tags-cloud">
            {(analytics?.weakestTopics || ['STAR Storytelling', 'Time Complexity Nuance', 'Edge Case Handling']).map((t, i) => (
              <span key={i} className="tag-pill tag-pill-missing">! {t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
