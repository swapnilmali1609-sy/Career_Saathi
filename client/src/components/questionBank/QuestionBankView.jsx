import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  ThumbsUp,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Plus,
  CheckCircle2,
  Briefcase
} from 'lucide-react';
import { apiService } from '../../api/client.js';
import { DOMAIN_GROUPS, ALL_DOMAINS } from '../../constants/domains.js';

export default function QuestionBankView() {
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [category, setCategory] = useState('ALL');
  const [difficulty, setDifficulty] = useState('ALL');
  const [expandedId, setExpandedId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New question form state
  const [newQ, setNewQ] = useState({
    title: '',
    questionText: '',
    category: 'TECHNICAL',
    domain: 'Software Development',
    difficulty: 'INTERMEDIATE',
    sampleAnswer: '',
    explanation: '',
    keyConcepts: ''
  });

  const roles = [
    'ALL',
    'Software Engineer',
    'Frontend Developer',
    'Backend Engineer',
    'Full Stack Developer',
    'QA Automation & SDET',
    'Software Test Engineer',
    'Data Scientist / AI Engineer',
    'DevOps & Cloud Engineer',
    'System Architect',
    'Cybersecurity Engineer'
  ];

  useEffect(() => {
    fetchQuestions();
  }, [selectedRole, category, difficulty]);

  const fetchQuestions = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedRole !== 'ALL') params.append('role', selectedRole);
      if (category !== 'ALL') params.append('category', category);
      if (difficulty !== 'ALL') params.append('difficulty', difficulty);
      if (search.trim()) params.append('search', search.trim());

      const data = await apiService.getQuestionBank(`?${params.toString()}`);
      setQuestions(data);
    } catch (err) {
      console.warn('[Question bank fetch error]:', err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchQuestions();
  };

  const handleUpvote = async (id, e) => {
    e.stopPropagation();
    try {
      await apiService.upvoteQuestion(id);
      setQuestions(prev =>
        prev.map(q => q.id === id ? { ...q, upvotes: (q.upvotes || 0) + 1 } : q)
      );
    } catch (err) {
      console.warn('[Upvote error]:', err);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.addQuestionToBank(newQ);
      setShowAddModal(false);
      setNewQ({
        title: '',
        questionText: '',
        category: 'TECHNICAL',
        domain: 'Software Development',
        difficulty: 'INTERMEDIATE',
        sampleAnswer: '',
        explanation: '',
        keyConcepts: ''
      });
      fetchQuestions();
    } catch (err) {
      alert('Error submitting question: ' + err.message);
    }
  };

  const categories = ['ALL', 'TECHNICAL', 'BEHAVIORAL', 'HR', 'CODING'];
  const difficulties = ['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="eyebrow">CURATED INTERVIEW KNOWLEDGE BASE</span>
          <h1 className="page-title">Searchable Question Bank</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>
            Explore authentic interview prompts with ideal model answers, scoring rubrics, and key concepts.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
          style={{ gap: '0.4rem' }}
        >
          <Plus size={16} />
          <span>Contribute Question</span>
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
            <Search size={17} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.4rem' }}
              placeholder="Search by keywords, algorithms, topics (e.g. B-Trees, STAR, Zero-Trust)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-secondary">
            Search Bank
          </button>
        </form>

        {/* Target Job Role Filter */}
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', marginRight: '0.25rem' }}>
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

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>TRACK:</span>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={`btn btn-sm ${category === c ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.78rem', padding: '0.3rem 0.65rem' }}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>LEVEL:</span>
            {difficulties.map((d) => (
              <button
                key={d}
                type="button"
                className={`btn btn-sm ${difficulty === d ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.78rem', padding: '0.3rem 0.65rem' }}
                onClick={() => setDifficulty(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem' }}>
        {questions.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No questions matching your selected role and filters found.
          </div>
        ) : (
          questions.map((q) => {
            const isExpanded = expandedId === q.id;
            return (
              <div
                key={q.id}
                className="card"
                style={{ cursor: 'pointer', transition: 'var(--transition-fast)' }}
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-category">{q.category}</span>
                      <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{q.domain}</span>
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                      {q.title}
                    </h3>
                    <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {q.questionText}
                    </p>

                    {/* Role Tags */}
                    {q.targetRoles?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
                        {q.targetRoles.filter(r => r !== 'All Roles').map((r, i) => (
                          <span key={i} style={{
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            padding: '0.15rem 0.5rem',
                            borderRadius: 'var(--radius-full)',
                            background: selectedRole === r ? 'rgba(99, 102, 241, 0.25)' : 'rgba(99, 102, 241, 0.08)',
                            color: 'var(--primary)',
                            border: `1px solid ${selectedRole === r ? 'var(--primary)' : 'rgba(99, 102, 241, 0.2)'}`
                          }}>
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={(e) => handleUpvote(q.id, e)}
                      title="Upvote helpful question"
                      style={{ gap: '0.35rem' }}
                    >
                      <ThumbsUp size={14} color="var(--primary)" />
                      <span>{q.upvotes || 0}</span>
                    </button>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {/* Key Concepts Pills */}
                {q.keyConcepts?.length > 0 && (
                  <div className="tags-cloud" style={{ marginTop: '0.75rem' }}>
                    {q.keyConcepts.map((k, i) => (
                      <span key={i} className="tag-pill" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>
                        #{k}
                      </span>
                    ))}
                  </div>
                )}

                {/* Expanded Drawer: Sample Model Answer & Explanation */}
                {isExpanded && (
                  <div style={{
                    marginTop: '1.25rem',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid var(--border-subtle)',
                    animation: 'fadeIn 0.2s ease-out'
                  }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '1rem' }}>
                      <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-emerald)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                        Sample Exemplary Answer:
                      </span>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        "{q.sampleAnswer}"
                      </p>
                    </div>

                    <div style={{ background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                        Interviewer Evaluation Rubric & Explanation:
                      </span>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Contribute Question */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <BookOpen size={22} color="var(--primary)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Contribute Interview Question</h3>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowAddModal(false)}
                style={{ padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-full)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Question Title</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Distributed Consensus in Raft"
                  value={newQ.title}
                  onChange={(e) => setNewQ({ ...newQ, title: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Question Prompt</label>
                <textarea
                  required
                  className="form-textarea"
                  rows={3}
                  placeholder="Describe the interview question asked..."
                  value={newQ.questionText}
                  onChange={(e) => setNewQ({ ...newQ, questionText: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Specialization Domain</label>
                <select
                  className="form-select"
                  value={newQ.domain}
                  onChange={(e) => setNewQ({ ...newQ, domain: e.target.value })}
                >
                  {!ALL_DOMAINS.includes(newQ.domain) && (
                    <option value={newQ.domain}>{newQ.domain}</option>
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

              <div className="grid-2">
                <div>
                  <label className="form-label">Track Category</label>
                  <select
                    className="form-select"
                    value={newQ.category}
                    onChange={(e) => setNewQ({ ...newQ, category: e.target.value })}
                  >
                    <option value="TECHNICAL">TECHNICAL</option>
                    <option value="BEHAVIORAL">BEHAVIORAL</option>
                    <option value="HR">HR</option>
                    <option value="CODING">CODING</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Difficulty</label>
                  <select
                    className="form-select"
                    value={newQ.difficulty}
                    onChange={(e) => setNewQ({ ...newQ, difficulty: e.target.value })}
                  >
                    <option value="BEGINNER">BEGINNER</option>
                    <option value="INTERMEDIATE">INTERMEDIATE</option>
                    <option value="ADVANCED">ADVANCED</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Sample Ideal Answer</label>
                <textarea
                  required
                  className="form-textarea"
                  rows={4}
                  placeholder="Provide an exemplary answer for candidates to learn from..."
                  value={newQ.sampleAnswer}
                  onChange={(e) => setNewQ({ ...newQ, sampleAnswer: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Key Concepts (Comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Paxos, Leader Election, Quorum"
                  value={newQ.keyConcepts}
                  onChange={(e) => setNewQ({ ...newQ, keyConcepts: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: 700, gap: '0.45rem' }}>
                  <Plus size={16} />
                  <span>Publish to Bank</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
