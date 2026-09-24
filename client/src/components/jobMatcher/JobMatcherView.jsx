import React, { useState } from 'react';
import {
  Briefcase,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';

export default function JobMatcherView({ resume, resumes = [], onSelectResume, onAnalyzeJD, onLaunchCustomMock, loading }) {
  const [jdText, setJdText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  const sampleJD = `We are seeking a Senior Full-Stack Engineer with strong experience building distributed systems in Node.js and React.
Key Qualifications:
- 4+ years software engineering experience.
- Deep expertise in PostgreSQL, database indexing, and query optimization.
- Proficiency with Docker, Kubernetes, and AWS or GCP cloud infrastructure.
- Experience with microservices, Redis caching, and CI/CD automation pipelines.
- Exceptional problem-solving skills and clean architecture design.`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jdText.trim()) return;
    try {
      const result = await onAnalyzeJD(jdText, resume?.rawText, resume?.id);
      setAnalysisResult(result);
    } catch (err) {
      alert('Error analyzing Job Description: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <span className="eyebrow">JOB MATCH & ATS ALIGNMENT</span>
        <h1 className="page-title">Job Description Gap Matcher</h1>
        <p className="page-subtitle">
          Paste a target job posting to calculate your resume alignment, discover missing keywords, and generate targeted mock interview questions tailored to that exact role.
        </p>
      </div>

      {resumes && resumes.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <FileText size={18} color="var(--primary)" />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Compare Target Posting Against:
            </span>
          </div>

          <select
            className="form-select form-select-sm"
            value={resume?.id || resumes[0]?.id}
            onChange={(e) => {
              const found = resumes.find(r => r.id === e.target.value);
              if (found && onSelectResume) onSelectResume(found);
            }}
            style={{ maxWidth: 360, fontSize: '0.85rem' }}
          >
            {resumes.map(r => (
              <option key={r.id} value={r.id}>
                {r.title || r.fileName || r.filename} ({r.targetRole || 'General'}) {r.isActive ? '• [Primary]' : ''}
              </option>
            ))}
          </select>
        </div>
      )} 

      {!resume && (!resumes || resumes.length === 0) && (
        <div className="card" style={{ marginBottom: '1.5rem', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={20} color="var(--accent-amber)" />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              Note: You have not uploaded a resume yet. A default candidate profile will be used for comparison, or you can upload your resume first.
            </span>
          </div>
        </div>
      )}

      {/* Paste JD Input Form */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <label className="form-label" style={{ marginBottom: 0 }}>Target Job Description</label>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setJdText(sampleJD)}
          >
            Insert Sample Senior Engineer JD
          </button>
        </div>
        <textarea
          className="form-textarea"
          rows={7}
          placeholder="Paste the target job description, requirements, or responsibilities here…"
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
        />
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            disabled={loading || !jdText.trim()}
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            <Sparkles size={16} />
            <span>{loading ? 'Evaluating Alignment with AI…' : 'Calculate Job Match & Gaps'}</span>
          </button>
        </div>
      </div>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div>
          {/* Match Score Gauge */}
          <div className="card-elevated" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div className="score-ring-container" style={{ width: 100, height: 100 }}>
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--bg-surface)" strokeWidth="10" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={analysisResult.matchScore >= 75 ? 'var(--accent-emerald)' : 'var(--accent-amber)'}
                    strokeWidth="10"
                    strokeDasharray={`${analysisResult.matchScore * 2.51} 251`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="score-ring-text">
                  <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{analysisResult.matchScore}%</span>
                </div>
              </div>

              <div>
                <span className="eyebrow" style={{ marginBottom: '0.25rem' }}>ATS & SKILL MATCH</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                  {analysisResult.matchScore >= 80 ? 'Strong Candidate Alignment' : 'Moderate Match — Address Gaps'}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {analysisResult.matchedSkills?.length || 0} overlapping skills identified
                </p>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => onLaunchCustomMock({ jobDescriptionKeywords: jdText })}
              style={{ fontWeight: 700, gap: '0.5rem' }}
            >
              <span>Practice Mock for This Job</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Matched vs Missing Skills */}
          <div className="grid-2" style={{ marginBottom: '2rem' }}>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <CheckCircle2 size={18} color="var(--accent-emerald)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Direct Overlapping Skills</h3>
              </div>
              <div className="tags-cloud">
                {analysisResult.matchedSkills?.map((skill, i) => (
                  <span key={i} className="tag-pill tag-pill-matched">
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <AlertCircle size={18} color="var(--accent-rose)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Missing Required Keywords</h3>
              </div>
              <div className="tags-cloud">
                {analysisResult.missingSkills?.map((missing, i) => (
                  <span key={i} className="tag-pill tag-pill-missing">
                    ! {missing}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Likely Interview Questions Predicted by AI */}
          {analysisResult.customInterviewQuestions?.length > 0 && (
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="var(--primary)" />
                Target Questions Expected in This Interview
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {analysisResult.customInterviewQuestions.map((q, i) => (
                  <div key={i} style={{ padding: '0.85rem 1.15rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.92rem' }}>
                    <strong>Q{i + 1}:</strong> {q}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
