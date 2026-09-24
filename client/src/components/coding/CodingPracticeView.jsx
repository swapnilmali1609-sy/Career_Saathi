import React, { useState, useEffect } from 'react';
import {
  Code2,
  Play,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  Sparkles,
  Terminal,
  Clock,
  ArrowRight,
  Briefcase
} from 'lucide-react';
import { apiService } from '../../api/client.js';

export default function CodingPracticeView() {
  const [problems, setProblems] = useState([]);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const roles = [
    'ALL',
    'Software Engineer',
    'Frontend Developer',
    'Backend Engineer',
    'Full Stack Developer',
    'Data Scientist / AI Engineer'
  ];

  useEffect(() => {
    loadProblems(selectedRole);
  }, [selectedRole]);

  const loadProblems = async (role = selectedRole) => {
    try {
      const query = role !== 'ALL' ? `?role=${encodeURIComponent(role)}` : '';
      const list = await apiService.getCodingProblems(query);
      setProblems(list);
      if (list.length > 0) {
        selectProblem(list[0].slug);
      } else {
        setCurrentProblem(null);
        setCode('');
      }
    } catch (err) {
      console.warn('[Coding list error]:', err);
    }
  };

  const selectProblem = async (slug) => {
    try {
      const prob = await apiService.getCodingProblem(slug);
      setCurrentProblem(prob);
      setCode(prob.starterCode[language] || prob.starterCode.javascript || '');
      setRunResult(null);
      setSubmitResult(null);
      setShowHints(false);
    } catch (err) {
      console.warn('[Problem load error]:', err);
    }
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (currentProblem?.starterCode[newLang]) {
      setCode(currentProblem.starterCode[newLang]);
    }
  };

  const handleRunCode = async () => {
    if (!currentProblem || !code.trim()) return;
    setRunning(true);
    setRunResult(null);
    setSubmitResult(null);

    try {
      const res = await apiService.runCode({
        problemId: currentProblem.id,
        language,
        code
      });
      setRunResult(res);
    } catch (err) {
      alert('Execution error: ' + err.message);
    } finally {
      setRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!currentProblem || !code.trim()) return;
    setSubmitting(true);
    setSubmitResult(null);

    try {
      const res = await apiService.submitCode({
        problemId: currentProblem.id,
        language,
        code
      });
      setSubmitResult(res);
    } catch (err) {
      alert('Submission error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="eyebrow">TECHNICAL PROBLEM SOLVING</span>
          <h1 className="page-title">Coding Practice Sandbox</h1>
        </div>

        {/* Problem Selector Dropdown */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Select Challenge:</span>
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: 220 }}
            value={currentProblem?.slug || ''}
            onChange={(e) => selectProblem(e.target.value)}
          >
            {problems.map((p) => (
              <option key={p.id} value={p.slug}>
                {p.title} ({p.difficulty})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Job Role Filter */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Briefcase size={14} color="var(--primary)" />
            TARGET ROLE:
          </span>
          {roles.map((r) => (
            <button
              key={r}
              type="button"
              className={`btn btn-sm ${selectedRole === r ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.78rem', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-full)' }}
              onClick={() => setSelectedRole(r)}
            >
              {r === 'ALL' ? 'All Roles' : r}
            </button>
          ))}
        </div>

        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Showing <strong>{problems.length}</strong> challenge{problems.length === 1 ? '' : 's'}
        </span>
      </div>

      {currentProblem ? (
        <div className="code-workspace">
          {/* Left Pane: Problem Description & Testcases */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <span className={`badge badge-${currentProblem.difficulty.toLowerCase()}`}>
                  {currentProblem.difficulty}
                </span>
                <span className="badge badge-category">
                  {currentProblem.category || 'Algorithms'}
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>
                  Expected Time: {currentProblem.timeComplexity} • Space: {currentProblem.spaceComplexity}
                </span>
              </div>
              {currentProblem.targetRoles?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.5rem' }}>
                  {currentProblem.targetRoles.filter(r => r !== 'All Roles').map((r, idx) => (
                    <span key={idx} style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      padding: '0.15rem 0.5rem',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(99, 102, 241, 0.1)',
                      color: 'var(--primary)',
                      border: '1px solid rgba(99, 102, 241, 0.25)'
                    }}>
                      {r}
                    </span>
                  ))}
                </div>
              )}
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {currentProblem.title}
              </h2>
            </div>

            <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {currentProblem.description}
            </div>

            {/* Constraints */}
            {currentProblem.constraints?.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Constraints:
                </h4>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {currentProblem.constraints.map((c, i) => (
                    <li key={i}><code>{c}</code></li>
                  ))}
                </ul>
              </div>
            )}

            {/* Hints Drawer */}
            <div>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setShowHints(!showHints)}
                style={{ gap: '0.35rem' }}
              >
                <HelpCircle size={14} />
                <span>{showHints ? 'Hide Hints' : 'Reveal Hints'}</span>
              </button>
              {showHints && (
                <div style={{ marginTop: '0.75rem', background: 'rgba(99, 102, 241, 0.08)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                  <ul style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {currentProblem.hints?.map((h, i) => (
                      <li key={i} style={{ marginBottom: '0.35rem' }}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* AI Complexity Review (Post-Submit) */}
            {submitResult && (
              <div style={{
                background: submitResult.status === 'ACCEPTED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                border: `1px solid ${submitResult.status === 'ACCEPTED' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '1.15rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  {submitResult.status === 'ACCEPTED' ? (
                    <CheckCircle2 size={20} color="var(--accent-emerald)" />
                  ) : (
                    <XCircle size={20} color="var(--accent-rose)" />
                  )}
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: submitResult.status === 'ACCEPTED' ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                    {submitResult.status === 'ACCEPTED' ? 'Accepted! All Tests Passed (+150 XP)' : 'Wrong Answer'}
                  </h3>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.65rem' }}>
                  Passed <strong>{submitResult.passedTests}</strong> of <strong>{submitResult.totalTests}</strong> test cases.
                </p>

                {submitResult.aiReview && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      AI Complexity & Code Review:
                    </div>
                    <div>Time Complexity: <strong>{submitResult.aiReview.timeComplexityEstimate}</strong></div>
                    <div>Space Complexity: <strong>{submitResult.aiReview.spaceComplexityEstimate}</strong></div>
                    <div style={{ marginTop: '0.4rem', fontStyle: 'italic' }}>
                      💡 {submitResult.aiReview.optimizationTips}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Pane: Code Editor & Execution Console */}
          <div className="code-editor-pane">
            <div className="code-editor-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Code2 size={18} color="var(--primary)" />
                <select
                  className="form-select"
                  style={{ width: 'auto', padding: '0.3rem 0.65rem', fontSize: '0.82rem' }}
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                >
                  <option value="javascript">JavaScript (ES6 Node)</option>
                  <option value="python">Python 3</option>
                </select>
              </div>

              <div className="btn-group">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  disabled={running}
                  onClick={handleRunCode}
                  style={{ gap: '0.45rem', padding: '0.45rem 0.95rem' }}
                >
                  <Play size={14} color="var(--accent-emerald)" />
                  <span>{running ? 'Executing…' : 'Run Tests'}</span>
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  disabled={submitting}
                  onClick={handleSubmitCode}
                  style={{ gap: '0.45rem', padding: '0.45rem 1rem', fontWeight: 700 }}
                >
                  <Award size={15} />
                  <span>{submitting ? 'Auditing…' : 'Submit Solution'}</span>
                </button>
              </div>
            </div>

            <textarea
              className="code-textarea"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
            />

            {/* Test Results Console */}
            <div className="console-output">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', color: 'var(--text-tertiary)' }}>
                <Terminal size={14} />
                <span>Test Execution Terminal</span>
              </div>

              {runResult ? (
                <div>
                  <div style={{ fontWeight: 600, color: runResult.status === 'SUCCESS' ? '#7ee787' : '#f85149', marginBottom: '0.5rem' }}>
                    {runResult.status === 'SUCCESS' ? '✓ All Sample Tests Passed' : '✗ Some Tests Failed'} ({runResult.passedTests}/{runResult.totalTests}) • {runResult.executionTimeMs}ms
                  </div>
                  {runResult.results?.map((r, i) => (
                    <div key={i} style={{ marginBottom: '0.35rem', fontSize: '0.8rem' }}>
                      <span style={{ color: r.passed ? '#7ee787' : '#f85149' }}>
                        {r.passed ? '✓' : '✗'} Test {r.testCaseIndex}:
                      </span>{' '}
                      Input: <code>{r.input}</code> | Expected: <code>{r.expected}</code> | Output: <code>{r.actual}</code>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: '#8b949e' }}>
                  Click "Run Tests" to execute your solution against sample test inputs.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          Loading coding problem…
        </div>
      )}
    </div>
  );
}
