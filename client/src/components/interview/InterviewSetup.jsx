import React, { useState, useEffect } from 'react';
import {
  Brain,
  Sliders,
  Sparkles,
  Layers,
  Award,
  Clock,
  FileCheck,
  ArrowRight,
  ShieldCheck,
  Target,
  CheckCircle2,
  Code2,
  Terminal,
  Lock,
  AlertCircle
} from 'lucide-react';
import { DOMAIN_GROUPS, ALL_DOMAINS } from '../../constants/domains.js';
import { ROLE_PROFILES, getRoleProfile } from '../../constants/roleConfigs.js';
import { PROGRAMMING_LANGUAGES, getDefaultLanguageForRole, getLanguageProfile } from '../../constants/languages.js';

const ROLE_PRESETS = [
  {
    label: 'Software Engineer (Backend / Core)',
    role: 'Software Development Engineer',
    domain: 'Backend & Distributed Systems',
    profileId: 'software_engineer'
  },
  {
    label: 'Data Scientist & ML Engineer',
    role: 'Data Scientist & ML Engineer',
    domain: 'Artificial Intelligence & Machine Learning',
    profileId: 'data_scientist'
  },
  {
    label: 'DevOps & Cloud Infrastructure',
    role: 'DevOps & Cloud Infrastructure Engineer',
    domain: 'Cloud & DevOps Engineering',
    profileId: 'devops_cloud_engineer'
  },
  {
    label: 'Cybersecurity Analyst',
    role: 'Information Security & Cyber Defense Analyst',
    domain: 'Cybersecurity & InfoSec',
    profileId: 'cybersecurity_analyst'
  },
  {
    label: 'QA Automation & SDET',
    role: 'QA Automation & SDET',
    domain: 'QA Automation & SDET',
    profileId: 'qa_automation_sdet'
  },
  {
    label: 'Frontend Developer',
    role: 'Frontend Developer / UI Engineer',
    domain: 'Frontend Engineering (Web & UI)',
    profileId: 'frontend_developer'
  },
  {
    label: 'System Architect',
    role: 'System Architect / Principal Engineer',
    domain: 'System Design & Distributed Architecture',
    profileId: 'system_architect'
  }
];

export default function InterviewSetup({ profile, latestResume, resumes = [], onLaunch, loading }) {
  const [category, setCategory] = useState('TECHNICAL');
  const [domain, setDomain] = useState(profile?.targetDomain || 'Software Development');
  const [difficulty, setDifficulty] = useState(profile?.preferredDifficulty || 'INTERMEDIATE');
  const [role, setRole] = useState(profile?.targetRole || 'Software Engineer');
  const [programmingLanguage, setProgrammingLanguage] = useState(
    getDefaultLanguageForRole(profile?.targetRole || 'Software Engineer', profile?.targetDomain || 'Software Development')
  );
  const [isCustomLanguage, setIsCustomLanguage] = useState(false);
  const [customLanguageInput, setCustomLanguageInput] = useState('');
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [useResume, setUseResume] = useState(Boolean(latestResume || (resumes && resumes.length > 0)));
  const [selectedResumeId, setSelectedResumeId] = useState(latestResume?.id || (resumes && resumes[0]?.id) || '');
  const [setupError, setSetupError] = useState(null);

  // Synchronize resume selection when resumes or latestResume update asynchronously
  useEffect(() => {
    if (resumes && resumes.length > 0) {
      if (!selectedResumeId || !resumes.some(r => r.id === selectedResumeId)) {
        const active = latestResume?.id || resumes.find(r => r.isActive)?.id || resumes[0]?.id || '';
        setSelectedResumeId(active);
      }
      setUseResume(true);
    }
  }, [resumes, latestResume]);

  const categories = [
    { id: 'TECHNICAL', label: 'Technical Interview', desc: 'Architecture, system trade-offs, algorithms & frameworks', icon: Code2, color: 'var(--primary)' },
    { id: 'BEHAVIORAL', label: 'Behavioral (STAR)', desc: 'Conflict resolution, leadership, setbacks, and teamwork', icon: Target, color: 'var(--accent-emerald)' },
    { id: 'HR', label: 'HR & Culture', desc: 'Career narrative, motivation, work style, and company fit', icon: Award, color: 'var(--accent-amber)' },
    { id: 'CODING', label: 'Coding & Logic', desc: 'Data structures, problem-solving, time & space constraints', icon: Terminal, color: '#38bdf8' },
    { id: 'COMMUNICATION', label: 'Communication & Pitch', desc: 'Translating complex ideas, executive updates, negotiations', icon: Sparkles, color: '#c0c1ff' },
    { id: 'DOMAIN_SPECIFIC', label: 'Domain-Specific', desc: 'Deep industry standards, regulations & specialized tools', icon: Layers, color: '#34d399' }
  ];

  const difficulties = [
    { id: 'BEGINNER', label: 'Beginner / Intern', badge: 'badge-beginner' },
    { id: 'INTERMEDIATE', label: 'Intermediate / Mid-Level', badge: 'badge-intermediate' },
    { id: 'ADVANCED', label: 'Advanced / Staff & Lead', badge: 'badge-advanced' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSetupError(null);
    const effectiveLanguage = isCustomLanguage && customLanguageInput.trim() ? customLanguageInput.trim() : programmingLanguage;
    if (!role || !role.trim()) {
      setSetupError('Job Role is required to calibrate interview questions.');
      return;
    }
    if (!effectiveLanguage || !effectiveLanguage.trim()) {
      setSetupError('Programming Language is required for technical calibration.');
      return;
    }
    if (import.meta.env.DEV) {
      console.log('[InterviewSetup] Launching interview with locked payload:', {
        category,
        domain,
        difficulty,
        role: role.trim(),
        programmingLanguage: effectiveLanguage,
        totalQuestions: Number(totalQuestions),
        useResume,
        resumeId: useResume ? (selectedResumeId || latestResume?.id || (resumes && resumes[0]?.id)) : null
      });
    }
    onLaunch({
      category,
      domain,
      difficulty,
      role: role.trim(),
      programmingLanguage: effectiveLanguage,
      totalQuestions: Number(totalQuestions),
      useResume,
      resumeId: useResume ? (selectedResumeId || latestResume?.id || (resumes && resumes[0]?.id)) : null
    });
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <span className="eyebrow">CUSTOMIZE YOUR REHEARSAL</span>
        <h1 className="page-title">Adaptive AI Mock Interview Setup</h1>
        <p className="page-subtitle">
          Configure your target role, track, and difficulty. Our Gemini AI engine will synthesize realistic, probing questions calibrated to current hiring standards.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Category Selection */}
        <div className="card" style={{ marginBottom: '1.75rem', borderTop: '2px solid var(--primary)' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={19} color="var(--primary)" />
            1. Select Interview Track
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.85rem' }}>
            {categories.map((c) => {
              const selected = category === c.id;
              const Icon = c.icon;
              return (
                <div
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  style={{
                    padding: '1.1rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1.5px solid ${selected ? c.color : 'var(--border-subtle)'}`,
                    background: selected ? 'rgba(56, 189, 248, 0.12)' : 'var(--bg-surface-elevated)',
                    boxShadow: selected ? `0 0 16px ${c.color}22` : 'none',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                      <div style={{
                        width: 34,
                        height: 34,
                        borderRadius: 'var(--radius-sm)',
                        background: `${c.color}20`,
                        color: c.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon size={18} />
                      </div>
                      {selected && <ShieldCheck size={18} color={c.color} />}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: selected ? 'var(--text-primary)' : 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                      {c.label}
                    </span>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', lineHeight: 1.45, margin: 0 }}>
                      {c.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Domain & Role Settings */}
        <div className="card" style={{ marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={19} color="var(--accent-cyan)" />
            2. Role & Industry Domain
          </h2>

          {/* Quick Role Selection Presets */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', marginBottom: '0.5rem', display: 'block' }}>
              Quick Role Presets (Auto-calibrates Domain & Core Competencies):
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {ROLE_PRESETS.map((p) => {
                const isMatch = role.toLowerCase() === p.role.toLowerCase() || (p.label && role.toLowerCase() === p.label.toLowerCase());
                return (
                  <button
                    key={p.role}
                    type="button"
                    onClick={() => {
                      setRole(p.role);
                      setDomain(p.domain);
                      if (!isCustomLanguage) {
                        setProgrammingLanguage(getDefaultLanguageForRole(p.role, p.domain));
                      }
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      border: isMatch ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                      background: isMatch ? 'rgba(56, 189, 248, 0.16)' : 'var(--bg-surface-elevated)',
                      color: isMatch ? 'var(--primary)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    {isMatch && <CheckCircle2 size={13} color="var(--primary)" />}
                    {p.label || p.role}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Target Job Role</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Senior Backend Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Specialization Domain</label>
              <select
                className="form-select"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              >
                {!ALL_DOMAINS.includes(domain) && (
                  <option value={domain}>{domain}</option>
                )}
                {DOMAIN_GROUPS.map((grp) => (
                  <optgroup key={grp.group} label={grp.group}>
                    {grp.options.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          {/* Dynamic Core Competencies & Strict Instruction Focus Callout */}
          {(() => {
            const prof = getRoleProfile(role, domain);
            return (
              <div
                style={{
                  marginTop: '1rem',
                  padding: '1rem 1.15rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.025)',
                  border: `1px solid ${prof.color || 'var(--primary)'}44`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '6px',
                        background: `${prof.color || 'var(--primary)'}22`,
                        color: prof.color || 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Target size={16} />
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {prof.title}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px',
                      background: `${prof.color || 'var(--primary)'}20`,
                      color: prof.color || 'var(--primary)'
                    }}
                  >
                    {prof.badge || 'Strict Role Calibration'}
                  </span>
                </div>

                {prof.strict_instruction && (
                  <div
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--text-secondary)',
                      background: 'rgba(0, 0, 0, 0.25)',
                      padding: '0.45rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      borderLeft: `3px solid ${prof.color || 'var(--primary)'}`,
                      lineHeight: 1.45
                    }}
                  >
                    <strong style={{ color: prof.color || 'var(--primary)' }}>Strict Instruction: </strong>
                    {prof.strict_instruction}
                  </div>
                )}

                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '0.35rem' }}>
                    Evaluated Core Pillars:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {prof.core_pillars.map((pillar, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.74rem',
                          background: 'var(--bg-surface-elevated)',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '4px',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        <CheckCircle2 size={11} color={prof.color || 'var(--primary)'} />
                        {pillar}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          <div style={{ marginTop: '0.75rem' }}>
            <label className="form-label">Target Difficulty Level</label>
            <div className="btn-group" style={{ background: 'var(--bg-surface-elevated)', padding: '0.3rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              {difficulties.map((diff) => {
                const selected = difficulty === diff.id;
                return (
                  <button
                    type="button"
                    key={diff.id}
                    className={`btn btn-sm ${selected ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}
                    onClick={() => setDifficulty(diff.id)}
                  >
                    {diff.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step 3: Primary Programming Language */}
        <div className="card" style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Code2 size={19} color="var(--accent-emerald)" />
              3. Choose Primary Programming Language
            </h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
              Technical questions & syntax will be calibrated to this language
            </span>
          </div>

          {/* Quick Select Popular Languages */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', marginBottom: '0.5rem', display: 'block' }}>
              Popular Languages for this Track:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))', gap: '0.65rem' }}>
              {PROGRAMMING_LANGUAGES.filter(l => l.popular).map((lang) => {
                const isSelected = !isCustomLanguage && (
                  programmingLanguage.toLowerCase() === lang.name.toLowerCase() ||
                  programmingLanguage.toLowerCase().includes(lang.id)
                );
                return (
                  <div
                    key={lang.id}
                    onClick={() => {
                      setIsCustomLanguage(false);
                      setProgrammingLanguage(lang.name);
                    }}
                    style={{
                      padding: '0.75rem 0.95rem',
                      borderRadius: 'var(--radius-md)',
                      border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                      background: isSelected ? 'rgba(56, 189, 248, 0.14)' : 'var(--bg-surface-elevated)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>{lang.icon}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                          {lang.name}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                          {lang.tag}
                        </div>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 size={16} color="var(--primary)" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full Language Selector & Custom Language */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">All Supported Languages</label>
              <select
                className="form-select"
                value={isCustomLanguage ? 'custom' : programmingLanguage}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    setIsCustomLanguage(true);
                  } else {
                    setIsCustomLanguage(false);
                    setProgrammingLanguage(e.target.value);
                  }
                }}
              >
                {PROGRAMMING_LANGUAGES.map((l) => (
                  <option key={l.id} value={l.name}>
                    {l.icon} {l.name} — {l.tag}
                  </option>
                ))}
                <option value="custom">✍️ Other / Custom Language...</option>
              </select>
            </div>

            {isCustomLanguage && (
              <div className="form-group">
                <label className="form-label">Custom Language Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Scala, Elixir, Dart, Haskell"
                  value={customLanguageInput}
                  onChange={(e) => setCustomLanguageInput(e.target.value)}
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* Language Calibration Highlight Callout */}
          {(() => {
            const activeLangName = isCustomLanguage && customLanguageInput ? customLanguageInput : programmingLanguage;
            const lProf = getLanguageProfile(activeLangName);
            return (
              <div style={{
                marginTop: '0.85rem',
                padding: '0.85rem 1.15rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.025)',
                border: `1px solid ${lProf.color || 'var(--accent-emerald)'}44`,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>{lProf.icon}</span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {lProf.name} Evaluation Standard
                    </span>
                  </div>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    padding: '0.15rem 0.55rem',
                    borderRadius: '4px',
                    background: `${lProf.color || 'var(--primary)'}20`,
                    color: lProf.color || 'var(--primary)'
                  }}>
                    {lProf.badge || 'Language Calibrated'}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {lProf.summary || `Calibrating interview questions, code structure, and runtime questions to ${lProf.name}.`}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Step 4: Session Scope & Personalization */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={19} color="var(--accent-amber)" />
            4. Session Scope & Personalization
          </h2>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Number of Questions</label>
              <select
                className="form-select"
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(e.target.value)}
              >
                <option value={3}>3 Questions (Quick Drill ~ 15 mins)</option>
                <option value={5}>5 Questions (Standard Mock ~ 25 mins)</option>
                <option value={7}>7 Questions (Comprehensive Interview ~ 40 mins)</option>
              </select>
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', marginTop: '0.75rem' }}>
                <input
                  type="checkbox"
                  checked={useResume}
                  onChange={(e) => setUseResume(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: 'var(--primary)' }}
                />
                <div>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Ground questions on my uploaded resume</span>
                  <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                    {resumes && resumes.length > 0
                      ? `${resumes.length} tailored resume${resumes.length > 1 ? 's' : ''} available in vault`
                      : (latestResume ? `Using "${latestResume.title || latestResume.fileName || latestResume.filename || 'Resume'}"` : 'No resume uploaded yet (generic role questions)')}
                  </span>
                </div>
              </label>

              {useResume && resumes && resumes.length > 0 && (
                <div style={{ marginTop: '0.65rem', paddingLeft: '1.75rem' }}>
                  <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: '0.25rem' }}>
                    Choose Resume Track:
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={selectedResumeId || latestResume?.id || resumes[0]?.id}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    style={{ fontSize: '0.85rem' }}
                  >
                    {resumes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title || r.fileName || r.filename} ({r.targetRole || 'General'}) {r.isActive ? '• [Primary]' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Step 5: Locked Session Configuration Summary */}
        <div className="card" style={{
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9))',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)' }}>
              <ShieldCheck size={20} />
              <span style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                Locked Session Configuration
              </span>
            </div>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.3)'
            }}>
              Strictly Calibrated
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '0.85rem',
            marginBottom: '0.75rem'
          }}>
            <div style={{ padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Target Role</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{role || 'Not Selected'}</div>
            </div>

            <div style={{ padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Programming Language</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#38bdf8' }}>
                {isCustomLanguage && customLanguageInput.trim() ? customLanguageInput.trim() : programmingLanguage}
              </div>
            </div>

            <div style={{ padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Track & Domain</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {category} • {domain}
              </div>
            </div>

            <div style={{ padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Level & Length</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-amber)' }}>
                {difficulty} • {totalQuestions} Questions
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <CheckCircle2 size={15} color="var(--accent-emerald)" />
            <span>
              Guaranteed: 100% of questions and follow-ups will match <strong>{role}</strong> in <strong>{isCustomLanguage && customLanguageInput.trim() ? customLanguageInput.trim() : programmingLanguage}</strong>. Cross-technology contamination is strictly prevented.
            </span>
          </div>
        </div>

        {setupError && (
          <div style={{
            marginBottom: '1rem',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.9rem',
            fontWeight: 500
          }}>
            <AlertCircle size={18} />
            <span>{setupError}</span>
          </div>
        )}

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary btn-lg"
          style={{ width: '100%', padding: '1.1rem', fontSize: '1.1rem', fontWeight: 700 }}
        >
          {loading ? (
            <span>Synthesizing Adaptive Questions with AI…</span>
          ) : (
            <>
              <Sparkles size={20} />
              <span>Generate Questions & Enter Rehearsal Room</span>
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
