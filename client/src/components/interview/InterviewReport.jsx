import React from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronDown,
  Printer,
  Download,
  Code2
} from 'lucide-react';
import { getRoleProfile } from '../../constants/roleConfigs.js';
import { getLanguageProfile } from '../../constants/languages.js';

export default function InterviewReport({ session, onRestart, onDashboard }) {
  const roleProfile = session.roleProfile?.title
    ? session.roleProfile
    : getRoleProfile(session.targetRole, session.domain || session.category);
  const programmingLanguage = session.programmingLanguage || session.languageProfile?.name || 'Python';
  const languageProfile = session.languageProfile?.corePillars
    ? session.languageProfile
    : getLanguageProfile(programmingLanguage);

  const overall = session.overallScore || 82;
  const technical = session.technicalScore || 85;
  const communication = session.communicationScore || 80;
  const confidence = session.confidenceScore || 82;

  const summary = session.summaryFeedback || {
    overallVerdict: overall >= 85 ? 'Strong Hire / High Readiness' : overall >= 70 ? 'Interview Ready / Minor Refinements' : 'Further Practice Recommended',
    keyStrengths: [
      'Articulated trade-offs with structured technical reasoning.',
      'Answered with clear domain vocabulary.'
    ],
    areasForImprovement: [
      'Incorporate concrete metrics into outcome statements.',
      'Structure behavioral answers more tightly around the STAR methodology.'
    ],
    recommendedNextSteps: [
      'Review distributed systems partition tolerance principles.',
      'Practice STAR conflict scenarios.'
    ]
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="eyebrow">REHEARSAL PERFORMANCE AUDIT</span>
          <h1 className="page-title">Mock Interview Evaluation Report</h1>
          <p className="page-subtitle" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span>Completed {session.category} rehearsal for <strong>{roleProfile?.title || session.targetRole}</strong> ({session.domain})</span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.15rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(56, 189, 248, 0.14)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              fontSize: '0.78rem',
              fontWeight: 700
            }}>
              <Code2 size={13} />
              <span>{languageProfile.icon ? `${languageProfile.icon} ` : ''}{languageProfile.name || programmingLanguage}</span>
            </span>
          </p>
        </div>
        <div className="btn-group no-print">
          <button type="button" className="btn btn-outline" onClick={handlePrint} style={{ gap: '0.45rem' }}>
            <Printer size={16} />
            <span>Print / Save PDF</span>
          </button>
          <button type="button" className="btn btn-primary" onClick={onRestart} style={{ gap: '0.45rem', fontWeight: 700 }}>
            <RotateCcw size={16} />
            <span>New Drill</span>
          </button>
        </div>
      </div>

      {/* Main Score & Verdict Card */}
      <div className="card-elevated" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="score-ring-container" style={{ width: 140, height: 140, margin: '0 auto 1rem auto' }}>
            <svg width="140" height="140" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="reportScoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={overall >= 80 ? '#38bdf8' : '#f59e0b'} />
                  <stop offset="100%" stopColor={overall >= 80 ? '#34d399' : '#ef4444'} />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--bg-surface)" strokeWidth="10" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#reportScoreGrad)"
                strokeWidth="10"
                strokeDasharray={`${overall * 2.51} 251`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                style={{ filter: 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.4))' }}
              />
            </svg>
            <div className="score-ring-text">
              <span style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>{overall}</span>
              <span className="score-ring-label">/ 100</span>
            </div>
          </div>
          <span className="badge badge-category" style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem', boxShadow: '0 0 12px rgba(56, 189, 248, 0.2)' }}>
            {summary.overallVerdict}
          </span>
        </div>

        {/* Sub-scores */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', minWidth: 280 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              <span>Technical Knowledge Depth</span>
              <span style={{ color: 'var(--accent-cyan)' }}>{technical}%</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${technical}%`, background: 'var(--accent-cyan)' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              <span>Communication & Clarity</span>
              <span style={{ color: 'var(--primary)' }}>{communication}%</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${communication}%`, background: 'var(--primary)' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              <span>Executive Confidence & Tone</span>
              <span style={{ color: 'var(--accent-emerald)' }}>{confidence}%</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${confidence}%`, background: 'var(--accent-emerald)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Role & Language Calibration & Evaluated Core Pillars Card */}
      {(roleProfile || languageProfile) && (
        <div className="card-elevated" style={{
          marginBottom: '2rem',
          padding: '1.75rem 2rem',
          borderLeft: '4px solid var(--primary)',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.7) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                <Sparkles size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                  Role & Language Calibration: {roleProfile?.title || session.targetRole} • {languageProfile?.name || programmingLanguage}
                </h3>
                <span className="badge badge-category" style={{ fontSize: '0.75rem' }}>
                  {roleProfile?.badge || 'Verified Rubric'}
                </span>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.15rem 0.55rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  <Code2 size={12} /> {languageProfile?.name || programmingLanguage} Stack
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                Role Directive: "{roleProfile?.strict_instruction || roleProfile?.strictInstruction || 'Focus on core system pillars.'}"
              </p>
              {languageProfile?.strictInstruction && (
                <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.84rem', color: '#93c5fd', fontStyle: 'italic' }}>
                  Language Focus: "{languageProfile.strictInstruction}"
                </p>
              )}
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.6rem' }}>
              Core Technical Pillars & Language Runtimes Evaluated
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.6rem' }}>
              {(roleProfile?.core_pillars || roleProfile?.corePillars || []).map((pillar, idx) => (
                <div
                  key={`role-pillar-${idx}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    padding: '0.55rem 0.85rem',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.82rem',
                    color: 'var(--text-primary)'
                  }}
                >
                  <CheckCircle2 size={16} color="var(--accent-emerald)" style={{ flexShrink: 0 }} />
                  <span style={{ fontWeight: 500 }}>{pillar}</span>
                </div>
              ))}
              {(languageProfile?.corePillars || []).map((pillar, idx) => (
                <div
                  key={`lang-pillar-${idx}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    padding: '0.55rem 0.85rem',
                    background: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.82rem',
                    color: '#bae6fd'
                  }}
                >
                  <Code2 size={15} color="#38bdf8" style={{ flexShrink: 0 }} />
                  <span style={{ fontWeight: 500 }}>{pillar}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Aggregate Strengths and Areas for Growth */}
      <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <CheckCircle2 size={20} color="var(--accent-emerald)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Demonstrated Strengths</h3>
          </div>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {summary.keyStrengths?.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <AlertTriangle size={20} color="var(--accent-amber)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Actionable Growth Opportunities</h3>
          </div>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {summary.areasForImprovement?.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Detailed Question Review Cards */}
      <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.25rem' }}>
        Question-by-Question Audit
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {session.questions?.map((q, idx) => {
          const ans = session.answers?.find(a => a.questionId === q.id);
          const evalRes = ans?.evaluation;

          return (
            <div key={q.id} className="card" style={{ background: 'var(--bg-surface-elevated)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="eyebrow" style={{ color: 'var(--primary)', marginBottom: 0 }}>
                  Question {idx + 1} • {q.questionType}
                </span>
                {evalRes && (
                  <span className="badge" style={{
                    background: evalRes.overallScore >= 80 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: evalRes.overallScore >= 80 ? 'var(--accent-emerald)' : 'var(--accent-amber)',
                    border: `1px solid ${evalRes.overallScore >= 80 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                    fontSize: '0.85rem'
                  }}>
                    Score: {evalRes.overallScore}/100
                  </span>
                )}
              </div>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                {q.questionText}
              </h4>

              {ans ? (
                <div>
                  <div style={{ background: 'var(--bg-surface)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--border-subtle)' }}>
                    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      Your Transcribed Answer:
                    </span>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      "{ans.answerText}"
                    </p>
                  </div>

                  {evalRes?.improvedAnswer && (
                    <div style={{ background: 'rgba(99, 102, 241, 0.06)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                      <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                        AI Exemplary Model Rewrite:
                      </span>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontStyle: 'italic' }}>
                        "{evalRes.improvedAnswer}"
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                  Question skipped or unanswered.
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Action Buttons */}
      <div className="btn-group no-print" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' }}>
        <button type="button" className="btn btn-outline btn-lg" onClick={handlePrint} style={{ gap: '0.5rem' }}>
          <Printer size={18} />
          <span>Save / Print Scorecard</span>
        </button>
        <button type="button" className="btn btn-primary btn-lg" onClick={onRestart} style={{ gap: '0.5rem', fontWeight: 700 }}>
          <RotateCcw size={18} />
          <span>Practice Another Rehearsal</span>
        </button>
        <button type="button" className="btn btn-secondary btn-lg" onClick={onDashboard} style={{ gap: '0.5rem' }}>
          <span>Return to Dashboard</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
