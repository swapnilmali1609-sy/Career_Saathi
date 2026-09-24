import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  Trash2,
  Star,
  Layers,
  Award,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Check,
  Briefcase,
  RefreshCw
} from 'lucide-react';

export default function ResumeView({
  resume,
  resumes = [],
  onSelectResume,
  onUploadResume,
  onSetActiveResume,
  onDeleteResume,
  onLaunchTailoredMock,
  onRefreshResumes,
  loading
}) {
  const [isAddingNew, setIsAddingNew] = useState(!resume && resumes.length === 0);
  const [resumeTitle, setResumeTitle] = useState('');
  const [targetRole, setTargetRole] = useState('Senior Software Engineer');
  const [uploadMode, setUploadMode] = useState('PASTE'); // 'FILE' or 'PASTE'
  const [pasteText, setPasteText] = useState('');
  const [file, setFile] = useState(null);
  const [showRawText, setShowRawText] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-select active or first resume if available and none currently selected
  useEffect(() => {
    if (resumes && resumes.length > 0 && !resume && onSelectResume) {
      const active = resumes.find(r => r.isActive) || resumes[0];
      if (active) onSelectResume(active);
    }
  }, [resumes, resume, onSelectResume]);

  const handleRefresh = async () => {
    if (onRefreshResumes) {
      setIsRefreshing(true);
      try {
        await onRefreshResumes();
      } finally {
        setTimeout(() => setIsRefreshing(false), 450);
      }
    }
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!pasteText.trim()) return;
    try {
      await onUploadResume(pasteText, {
        title: resumeTitle.trim() || targetRole || 'Pasted Resume',
        targetRole: targetRole.trim() || 'Software Engineer'
      });
      setPasteText('');
      setResumeTitle('');
      setIsAddingNew(false);
    } catch {
      // Error handled upstream
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('targetRole', targetRole.trim() || 'Software Engineer');
      if (resumeTitle.trim()) {
        formData.append('title', resumeTitle.trim());
      }
      await onUploadResume(formData);
      setFile(null);
      setResumeTitle('');
      setIsAddingNew(false);
    } catch {
      // Error handled upstream
    }
  };

  const parsed = resume?.parsedData;

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <span className="eyebrow">RESUME VAULT & GAP ANALYSIS</span>
          <h1 className="page-title">AI Resume Coach & Multi-Resume Vault</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>
            Maintain tailored resumes for different roles (Frontend, Backend, SDET, DevOps, etc.). Ground AI mock interviews and JD gap analysis in any specific resume.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {onRefreshResumes && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              style={{ gap: '0.45rem', fontSize: '0.85rem' }}
              title="Refresh resume list from vault"
            >
              <RefreshCw size={15} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
              <span>{isRefreshing ? 'Refreshing…' : 'Refresh Vault'}</span>
            </button>
          )}

          {resumes.length > 0 && (
            <button
              type="button"
              className={`btn ${isAddingNew ? 'btn-secondary' : 'btn-primary'}`}
              onClick={() => setIsAddingNew(prev => !prev)}
              style={{ gap: '0.45rem', fontWeight: 700 }}
            >
              <Plus size={17} />
              <span>{isAddingNew ? 'Close Upload Form' : 'Add Another Resume'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Multi-Resume Shelf (Cards) */}
      {resumes.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-primary)' }}>
              <Layers size={18} color="var(--primary)" />
              <span>Your Uploaded Resumes ({resumes.length})</span>
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
              Click any card to inspect or test against mock interviews
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1rem' }}>
            {resumes.map((r) => {
              const isCurrent = resume?.id === r.id;
              const formattedDate = new Date(r.createdAt || Date.now()).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <div
                  key={r.id}
                  className={`card ${isCurrent ? 'card-elevated' : ''}`}
                  onClick={() => {
                    onSelectResume(r);
                    setIsAddingNew(false);
                  }}
                  style={{
                    cursor: 'pointer',
                    position: 'relative',
                    borderColor: isCurrent ? 'var(--primary)' : 'var(--border-subtle)',
                    borderWidth: isCurrent ? 2 : 1,
                    background: isCurrent ? 'rgba(99, 102, 241, 0.05)' : 'var(--bg-surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '1.25rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div>
                    {/* Top Status Badges */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                      <span className="badge badge-category" style={{ fontSize: '0.72rem' }}>
                        {r.targetRole || 'Software Engineer'}
                      </span>

                      {r.isActive ? (
                        <span
                          className="badge"
                          style={{
                            background: 'rgba(16, 185, 129, 0.2)',
                            color: 'var(--accent-emerald)',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.72rem'
                          }}
                        >
                          <Star size={12} fill="currentColor" />
                          <span>Primary</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', color: 'var(--text-tertiary)' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSetActiveResume(r.id);
                          }}
                          title="Set as your primary resume for mock interviews"
                        >
                          Set as Primary
                        </button>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.25rem', color: isCurrent ? 'var(--primary)' : 'var(--text-primary)' }}>
                      {r.title || r.fileName || r.filename || 'Resume'}
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: '0.85rem' }}>
                      {r.fileName || r.filename || 'Uploaded Resume'} • Uploaded {formattedDate}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>
                        Score: {r.overallScore || 75}%
                      </span>
                      <span>•</span>
                      <span>{r.extractedSkills?.length || 0} skills</span>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.78rem', color: isCurrent ? 'var(--primary)' : 'var(--text-tertiary)', fontWeight: 600 }}>
                      {isCurrent ? '✓ Currently Viewing' : 'Click to inspect'}
                    </span>

                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--accent-rose)', padding: '0.25rem 0.5rem' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete resume "${r.title || r.fileName || r.filename || 'Resume'}"?`)) {
                          onDeleteResume(r.id);
                        }
                      }}
                      title="Delete this resume"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add New Resume Form */}
      {(isAddingNew || resumes.length === 0) && (
        <div className="card-elevated" style={{ padding: '2rem', marginBottom: '2.5rem', border: '1px solid var(--primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <UploadCloud size={24} color="var(--primary)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {resumes.length === 0 ? 'Upload Your First Resume' : 'Add Another Tailored Resume'}
              </h2>
            </div>
            {resumes.length > 0 && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setIsAddingNew(false)}
              >
                Cancel
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Resume Title / Label</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Senior Full-Stack Resume or SDET Automation Lead"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Target Role</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. QA Automation Engineer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="btn-group" style={{ background: 'var(--bg-surface-elevated)', padding: '0.3rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem', display: 'inline-flex' }}>
            <button
              type="button"
              className={`btn btn-sm ${uploadMode === 'PASTE' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setUploadMode('PASTE')}
              style={{ padding: '0.5rem 1.25rem' }}
            >
              <FileText size={16} />
              <span>Paste Resume Text</span>
            </button>
            <button
              type="button"
              className={`btn btn-sm ${uploadMode === 'FILE' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setUploadMode('FILE')}
              style={{ padding: '0.5rem 1.25rem' }}
            >
              <UploadCloud size={16} />
              <span>Upload Document (.pdf / .docx / .txt)</span>
            </button>
          </div>

          {uploadMode === 'PASTE' ? (
            <form onSubmit={handleTextSubmit}>
              <div className="form-group">
                <label className="form-label">Resume Content</label>
                <textarea
                  className="form-textarea"
                  rows={8}
                  placeholder="Paste your resume sections, work achievements, tech stack, and experience here..."
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !pasteText.trim()}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', fontWeight: 700, gap: '0.5rem' }}
              >
                <Sparkles size={18} />
                <span>{loading ? 'Extracting Skills & Parsing with AI…' : 'Analyze Resume & Add to Vault'}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleFileSubmit}>
              <div className="form-group">
                <label className="form-label">Select Document</label>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="form-input"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !file}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', fontWeight: 700, gap: '0.5rem' }}
              >
                <UploadCloud size={18} />
                <span>{loading ? 'Processing Document with AI…' : 'Upload & Add to Vault'}</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* Selected Resume Intelligence View */}
      {resume && !isAddingNew && (
        <div>
          {/* Main Resume Card */}
          <div className="card-elevated" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span className="badge badge-category">
                    {resume.title || resume.fileName || resume.filename || 'Resume'}
                  </span>
                  {resume.isActive && (
                    <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                      ⭐ Primary Resume
                    </span>
                  )}
                </div>

                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                  {parsed?.candidateName || resume.title || 'Candidate Profile'}
                </h2>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                  {parsed?.headline || resume.targetRole || 'Software Professional'} • {parsed?.yearsOfExperience || 3}+ Years Experience
                </p>
              </div>

              {/* Quality Score Ring */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="score-ring-container" style={{ width: 90, height: 90 }}>
                  <svg width="90" height="90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--bg-surface)" strokeWidth="10" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="var(--accent-emerald)"
                      strokeWidth="10"
                      strokeDasharray={`${(resume.overallScore || 80) * 2.51} 251`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="score-ring-text">
                    <span style={{ fontSize: '1.35rem', fontWeight: 800 }}>{resume.overallScore || 80}%</span>
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                    Resume Strength
                  </span>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {resume.overallScore >= 80 ? 'Competitive' : 'Developing'}
                  </h4>
                </div>
              </div>
            </div>

            {/* CTA: Launch Tailored Interview */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.25rem',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: 'var(--radius-md)',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Sparkles size={22} color="var(--primary)" />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    Ready for a Rehearsal Tailored to "{resume.title || resume.fileName || resume.filename || 'Resume'}"?
                  </strong>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    AI will challenge you on your exact projects, tools, and technical stack.
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => onLaunchTailoredMock(resume)}
                style={{ fontWeight: 700, gap: '0.45rem' }}
              >
                <span>Launch Rehearsal from Resume</span>
                <ArrowRight size={17} />
              </button>
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="grid-2" style={{ marginBottom: '2rem' }}>
            {/* Extracted Skills */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <CheckCircle2 size={18} color="var(--accent-emerald)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Detected Core Skills ({resume.extractedSkills?.length || 0})</h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Technologies and tools extracted by semantic analysis:
              </p>
              <div className="tags-cloud">
                {resume.extractedSkills?.map((skill, i) => (
                  <span key={i} className="tag-pill tag-pill-matched">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills Recommended */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <AlertTriangle size={18} color="var(--accent-rose)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Missing Industry Skills</h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                High-demand skills typically expected for {parsed?.headline || resume.targetRole || 'this role'}:
              </p>
              <div className="tags-cloud">
                {resume.missingSkills?.map((missing, i) => (
                  <span key={i} className="tag-pill tag-pill-missing">
                    + {missing}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actionable Suggestions */}
          {parsed?.actionableSuggestions && parsed.actionableSuggestions.length > 0 && (
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={18} color="var(--accent-cyan)" />
                Actionable Resume Enhancements
              </h3>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {parsed.actionableSuggestions.map((sug, i) => (
                  <li key={i}>{sug}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Raw Text Collapsible Inspection */}
          {resume.rawText && (
            <div className="card" style={{ marginBottom: '2rem' }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setShowRawText(prev => !prev)}
                style={{ width: '100%', justifyContent: 'space-between', display: 'flex', padding: 0 }}
              >
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <FileText size={16} color="var(--primary)" />
                  <span>Inspect Parsed Text Content</span>
                </span>
                {showRawText ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showRawText && (
                <pre style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  background: 'var(--bg-surface-elevated)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  whiteSpace: 'pre-wrap',
                  maxHeight: 280,
                  overflowY: 'auto'
                }}>
                  {resume.rawText}
                </pre>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
