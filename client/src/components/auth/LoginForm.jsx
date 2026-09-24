import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';

export default function LoginForm({ onAuth }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onAuth('login', form);
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (email, password) => {
    setForm({ email, password });
    setError('');
    setLoading(true);
    try {
      await onAuth('login', { email, password });
    } catch (err) {
      setError(err.message || 'Demo authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Email Address</label>
        <div style={{ position: 'relative' }}>
          <Mail size={17} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-tertiary)' }} />
          <input
            type="email"
            required
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Password</label>
        <div style={{ position: 'relative' }}>
          <Lock size={17} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-tertiary)' }} />
          <input
            type="password"
            required
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
        style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem', fontWeight: 700 }}
      >
        {loading ? 'Authenticating…' : 'Sign in to Practice'}
        <ArrowRight size={17} />
      </button>

      {/* Demo Account Quick-Fill Buttons */}
      <div style={{ marginTop: '0.75rem', paddingTop: '1.15rem', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Instant 1-Click Demo Personas
          </span>
          <span className="glass-badge" style={{ fontSize: '0.68rem', padding: '0.1rem 0.45rem' }}>
            No password needed
          </span>
        </div>
        <div className="demo-persona-grid">
          <button
            type="button"
            className="demo-persona-card"
            onClick={() => handleDemoLogin('alex@example.com', 'password123')}
            disabled={loading}
          >
            <img
              src="https://api.dicebear.com/7.x/initials/svg?seed=Alex%20Rivera"
              alt="Alex Rivera"
              className="demo-persona-avatar"
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                <span>Alex Rivera</span>
              </div>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Candidate • Backend SDE
              </span>
            </div>
            <ArrowRight size={14} color="var(--primary)" style={{ opacity: 0.7 }} />
          </button>

          <button
            type="button"
            className="demo-persona-card"
            onClick={() => handleDemoLogin('admin@prepai.com', 'password123')}
            disabled={loading}
          >
            <img
              src="https://api.dicebear.com/7.x/initials/svg?seed=Sarah%20Connor"
              alt="Sarah Connor"
              className="demo-persona-avatar"
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                <span>Sarah Connor</span>
              </div>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--secondary)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Admin • HR Director
              </span>
            </div>
            <ArrowRight size={14} color="var(--secondary)" style={{ opacity: 0.7 }} />
          </button>
        </div>
      </div>
    </form>
  );
}
