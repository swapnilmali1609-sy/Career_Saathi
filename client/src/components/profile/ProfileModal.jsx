import React, { useState, useEffect } from 'react';
import {
  User,
  Briefcase,
  Layers,
  Award,
  Link2,
  Plus,
  X,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { apiService } from '../../api/client.js';
import { DOMAIN_GROUPS, ALL_DOMAINS } from '../../constants/domains.js';

export default function ProfileModal({ profile, isOpen, onClose, onUpdated }) {
  const [form, setForm] = useState({
    headline: profile?.headline || '',
    targetRole: profile?.targetRole || 'Software Engineer',
    targetDomain: profile?.targetDomain || 'Software Development',
    experienceYears: profile?.experienceYears || 2,
    preferredDifficulty: profile?.preferredDifficulty || 'INTERMEDIATE',
    linkedinUrl: profile?.linkedinUrl || '',
    githubUrl: profile?.githubUrl || '',
    skills: Array.isArray(profile?.skills) ? [...profile.skills] : []
  });

  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);

  // Synchronize form when profile prop updates or modal opens
  useEffect(() => {
    if (profile) {
      setForm({
        headline: profile.headline || '',
        targetRole: profile.targetRole || 'Software Engineer',
        targetDomain: profile.targetDomain || 'Software Development',
        experienceYears: profile.experienceYears || 2,
        preferredDifficulty: profile.preferredDifficulty || 'INTERMEDIATE',
        linkedinUrl: profile.linkedinUrl || '',
        githubUrl: profile.githubUrl || '',
        skills: Array.isArray(profile.skills) ? [...profile.skills] : []
      });
    }
  }, [profile, isOpen]);

  const handleAddSkill = (e) => {
    e?.preventDefault();
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (!form.skills.includes(trimmed)) {
      setForm({ ...form, skills: [...form.skills, trimmed] });
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setForm({
      ...form,
      skills: form.skills.filter(s => s !== skillToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await apiService.updateProfile(form);
      if (onUpdated) onUpdated(updated);
      onClose();
    } catch (err) {
      alert('Failed to update profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              color: '#003640',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px var(--primary-glow)',
              flexShrink: 0
            }}>
              <User size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Candidate Profile Settings</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Tailor interview calibration & question generation
              </span>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onClose}
            style={{ padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-full)' }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Professional Headline</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Senior Full-Stack Engineer | Distributed Systems Enthusiast"
              value={form.headline}
              onChange={(e) => setForm({ ...form, headline: e.target.value })}
            />
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
              <label className="form-label">Target Domain</label>
              <select
                className="form-select"
                value={form.targetDomain}
                onChange={(e) => setForm({ ...form, targetDomain: e.target.value })}
              >
                {!ALL_DOMAINS.includes(form.targetDomain) && (
                  <option value={form.targetDomain}>{form.targetDomain}</option>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Years of Experience</label>
              <input
                type="number"
                min="0"
                max="50"
                className="form-input"
                value={form.experienceYears}
                onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Rehearsal Difficulty</label>
              <select
                className="form-select"
                value={form.preferredDifficulty}
                onChange={(e) => setForm({ ...form, preferredDifficulty: e.target.value })}
              >
                <option value="BEGINNER">Beginner / Junior</option>
                <option value="INTERMEDIATE">Intermediate / Mid-Level</option>
                <option value="ADVANCED">Advanced / Senior & Staff</option>
              </select>
            </div>
          </div>

          {/* Skills Tag Cloud Editor */}
          <div className="form-group">
            <label className="form-label">Verified Core Skills</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Add skill (e.g. Docker, Redis, Kubernetes)..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleAddSkill}
              >
                <Plus size={16} />
                <span>Add</span>
              </button>
            </div>

            <div className="tags-cloud" style={{ minHeight: 38 }}>
              {form.skills.map((skill) => (
                <span
                  key={skill}
                  className="tag-pill tag-pill-matched"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, display: 'flex' }}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              {form.skills.length === 0 && (
                <span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>No skills added yet.</span>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">LinkedIn Profile URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://linkedin.com/in/..."
                value={form.linkedinUrl}
                onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">GitHub Portfolio URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://github.com/..."
                value={form.githubUrl}
                onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{ gap: '0.45rem', fontWeight: 700 }}
            >
              <Sparkles size={16} />
              <span>{saving ? 'Saving Profile…' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
