import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Trash2,
  Play,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Layers,
  ArrowRight
} from 'lucide-react';
import { apiService } from '../../api/client.js';
import { DOMAIN_GROUPS, ALL_DOMAINS } from '../../constants/domains.js';
import { PROGRAMMING_LANGUAGES, getDefaultLanguageForRole } from '../../constants/languages.js';

export default function ScheduleView({ onLaunchMock }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Booking Form State
  const defaultDate = new Date(Date.now() + 86400000);
  defaultDate.setMinutes(0);
  defaultDate.setSeconds(0);
  const defaultDateStr = defaultDate.toISOString().slice(0, 16);

  const [form, setForm] = useState({
    title: '',
    category: 'TECHNICAL',
    domain: 'Software Development',
    difficulty: 'INTERMEDIATE',
    targetRole: 'Senior Software Engineer',
    programmingLanguage: 'JavaScript',
    scheduledFor: defaultDateStr,
    notes: ''
  });

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const data = await apiService.getSchedules();
      setSchedules(data);
    } catch (err) {
      console.warn('[Schedule load error]:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    if (!form.scheduledFor) {
      alert('Please choose a date and time for the rehearsal session.');
      return;
    }
    setSubmitting(true);
    try {
      const created = await apiService.createSchedule(form);
      setSchedules(prev => [...prev, created].sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor)));
      setShowModal(false);
      setForm({
        title: '',
        category: 'TECHNICAL',
        domain: 'Software Development',
        difficulty: 'INTERMEDIATE',
        targetRole: 'Senior Software Engineer',
        scheduledFor: defaultDateStr,
        notes: ''
      });
    } catch (err) {
      alert('Failed to schedule rehearsal: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSchedule = async (id) => {
    if (!confirm('Are you sure you want to cancel this scheduled rehearsal?')) return;
    try {
      await apiService.deleteSchedule(id);
      setSchedules(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert('Failed to cancel schedule: ' + err.message);
    }
  };

  const formatCountdown = (dateStr) => {
    const diffMs = new Date(dateStr) - new Date();
    if (diffMs <= 0) return { label: 'Session Ready Now', isImminent: true };
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays > 0) {
      return { label: `In ${diffDays} day${diffDays > 1 ? 's' : ''}`, isImminent: false };
    }
    if (diffHours > 0) {
      return { label: `In ${diffHours} hour${diffHours > 1 ? 's' : ''}`, isImminent: diffHours <= 2 };
    }
    const diffMins = Math.floor(diffMs / (1000 * 60));
    return { label: `In ${diffMins} mins`, isImminent: true };
  };

  return (
    <div style={{ maxWidth: 1050, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="eyebrow">PREPARATION CALENDAR & AGENDA</span>
          <h1 className="page-title">Rehearsal Scheduler</h1>
          <p className="page-subtitle">
            Plan and lock in high-impact mock interview sessions. Receive targeted drills and launch instantly when ready.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
          style={{ gap: '0.45rem' }}
        >
          <Plus size={17} />
          <span>Book Rehearsal Slot</span>
        </button>
      </div>

      {/* Booking Modal / Dialog */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CalendarIcon size={22} color="var(--primary)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Schedule AI Rehearsal</h3>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowModal(false)}
                style={{ padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-full)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSchedule}>
              <div className="form-group">
                <label className="form-label">Session Title or Objective</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Distributed Systems Architecture Drill"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Interview Track</label>
                  <select
                    className="form-select"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="TECHNICAL">Technical Architecture</option>
                    <option value="BEHAVIORAL">Behavioral (STAR)</option>
                    <option value="HR">HR & Culture Fit</option>
                    <option value="CODING">Coding & Algorithms</option>
                    <option value="COMMUNICATION">Communication & Pitch</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Difficulty Level</label>
                  <select
                    className="form-select"
                    value={form.difficulty}
                    onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                  >
                    <option value="BEGINNER">Beginner / Intern</option>
                    <option value="INTERMEDIATE">Intermediate / Mid-Level</option>
                    <option value="ADVANCED">Advanced / Staff & Lead</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Target Role</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.targetRole}
                    onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Specialization Domain</label>
                  <select
                    className="form-select"
                    value={form.domain}
                    onChange={(e) => setForm({ ...form, domain: e.target.value })}
                  >
                    {!ALL_DOMAINS.includes(form.domain) && (
                      <option value={form.domain}>{form.domain}</option>
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

              <div className="form-group">
                <label className="form-label">Programming Language</label>
                <select
                  className="form-select"
                  value={form.programmingLanguage}
                  onChange={(e) => setForm({ ...form, programmingLanguage: e.target.value })}
                >
                  {PROGRAMMING_LANGUAGES.map((lang) => (
                    <option key={lang.id} value={lang.name}>
                      {lang.icon ? `${lang.icon} ` : ''}{lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Date & Time</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={form.scheduledFor}
                  onChange={(e) => setForm({ ...form, scheduledFor: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Focus Topics or Prep Notes (Optional)</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="e.g. Focus on STAR metrics for handling unexpected production latency spikes..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ gap: '0.45rem', fontWeight: 700 }}
                >
                  <CalendarIcon size={16} />
                  <span>{submitting ? 'Locking in…' : 'Lock in Rehearsal'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scheduled Sessions Grid */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
          Upcoming Rehearsal Sessions ({schedules.length})
        </h2>

        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            Loading your rehearsal schedule…
          </div>
        ) : schedules.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: 'var(--radius-xl)',
              background: 'rgba(99, 102, 241, 0.15)',
              color: 'var(--primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <CalendarIcon size={30} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              No Upcoming Rehearsals Scheduled
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: 460, margin: '0 auto 1.5rem auto' }}>
              Consistent, deliberate practice before high-stakes interviews is the proven path to offer readiness. Book a session slot to keep your practice streak active.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              <Plus size={16} />
              <span>Book Your First Rehearsal</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {schedules.map((s) => {
              const countdown = formatCountdown(s.scheduledFor);
              const dateObj = new Date(s.scheduledFor);
              const formattedDate = dateObj.toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              });
              const formattedTime = dateObj.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div key={s.id} className="card-elevated" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    {/* Top Row Badges */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                      <span className="badge badge-category">
                        {s.category}
                      </span>
                      <span
                        className="badge"
                        style={{
                          background: countdown.isImminent ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.15)',
                          color: countdown.isImminent ? 'var(--accent-emerald)' : 'var(--accent-cyan)',
                          fontWeight: 700
                        }}
                      >
                        {countdown.label}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                      {s.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                      Target: <strong>{s.targetRole}</strong> • <span>{s.domain || 'Software Development'}</span> • <span className={`badge badge-${(s.difficulty || 'intermediate').toLowerCase()}`} style={{ fontSize: '0.72rem' }}>{s.difficulty}</span>
                    </p>

                    {/* Date/Time Row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.88rem',
                      color: 'var(--text-primary)',
                      marginBottom: '0.75rem',
                      background: 'var(--bg-surface)',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      <Clock size={16} color="var(--primary)" />
                      <span>{formattedDate} at {formattedTime}</span>
                    </div>

                    {s.notes && (
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', fontStyle: 'italic', marginBottom: '1rem', lineHeight: 1.4 }}>
                        "{s.notes}"
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => handleDeleteSchedule(s.id)}
                      title="Cancel this session"
                      style={{ color: 'var(--accent-rose)', borderColor: 'rgba(244, 63, 94, 0.4)' }}
                    >
                      <Trash2 size={15} />
                      <span>Cancel</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        onLaunchMock({
                          category: s.category,
                          domain: s.domain,
                          difficulty: s.difficulty,
                          role: s.targetRole,
                          programmingLanguage: s.programmingLanguage || getDefaultLanguageForRole(s.targetRole, s.domain)
                        });
                      }}
                      style={{ gap: '0.45rem', fontWeight: 700 }}
                    >
                      <Play size={14} />
                      <span>Start Drill Now</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Rehearsal Discipline Tips */}
      <div className="card" style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Sparkles size={16} color="var(--primary)" />
          Best Practices for Rehearsal Sessions
        </h3>
        <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: 1.6 }}>
          <li><strong>Simulate Real Conditions:</strong> Practice in a quiet room with webcam enabled to accustom yourself to speaking naturally while on video.</li>
          <li><strong>Respect the 3-Minute Clock:</strong> Real interviewers tune out when answers exceed 2.5 minutes without structured checkpoints.</li>
          <li><strong>Review Feedback Immediately:</strong> Study your 10-factor scorecard right after finishing to lock in the improved response phrasing.</li>
        </ul>
      </div>
    </div>
  );
}
