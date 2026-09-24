import React, { useState } from 'react';
import { User, Mail, Lock, Briefcase, ArrowRight } from 'lucide-react';

export default function RegisterForm({ onAuth }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    targetRole: 'Software Engineer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onAuth('register', form);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Full Name</label>
        <div style={{ position: 'relative' }}>
          <User size={17} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            required
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Alex Rivera"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Email Address</label>
        <div style={{ position: 'relative' }}>
          <Mail size={17} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-tertiary)' }} />
          <input
            type="email"
            required
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="alex@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Target Role</label>
        <div style={{ position: 'relative' }}>
          <Briefcase size={17} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            required
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="e.g. Senior Frontend Engineer"
            value={form.targetRole}
            onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
          />
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Password (Min 6 characters)</label>
        <div style={{ position: 'relative' }}>
          <Lock size={17} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-tertiary)' }} />
          <input
            type="password"
            required
            minLength={6}
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
      </div>

      {error && (
        <div style={{
          padding: '0.65rem 1rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(244, 63, 94, 0.12)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          color: '#fb7185',
          fontSize: '0.85rem'
        }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary"
        style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}
      >
        {loading ? 'Creating Account…' : 'Create Free Account'}
        <ArrowRight size={17} />
      </button>
    </form>
  );
}
