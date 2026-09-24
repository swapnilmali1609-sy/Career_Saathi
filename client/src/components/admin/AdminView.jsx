import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Cpu,
  BarChart3,
  Award,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { apiService } from '../../api/client.js';

export default function AdminView() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const [statsData, usersData] = await Promise.all([
        apiService.getAdminStats(),
        apiService.getAdminUsers()
      ]);
      setStats(statsData);
      setUsers(usersData);
    } catch (err) {
      console.warn('[Admin data load error]:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await apiService.updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert('Failed to update role: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        Loading Admin Control Center…
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1050, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <span className="eyebrow" style={{ color: 'var(--secondary)' }}>PLATFORM CONTROL & TELEMETRY</span>
        <h1 className="page-title">Admin Management Center</h1>
        <p className="page-subtitle">
          Monitor system metrics, AI token utilization, question bank volume, and manage user roles.
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Registered Users
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.35rem' }}>
            {stats?.totalUsers || 2}
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
            Active Platform Candidates
          </span>
        </div>

        <div className="card">
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Total Mock Rehearsals
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.35rem' }}>
            {stats?.totalSessions || 5}
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {stats?.completedSessions || 5} completed with scorecards
          </span>
        </div>

        <div className="card">
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Answers Evaluated
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.35rem' }}>
            {stats?.totalAnswers || 22}
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
            Avg Score: {stats?.avgPlatformScore || 82}%
          </span>
        </div>

        <div className="card">
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            AI Engine Telemetry
          </span>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '0.35rem', color: 'var(--primary)' }}>
            {stats?.aiModel || 'Gemini 2.5 Flash'}
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
            ~{stats?.estimatedTokensConsumed || 9900} tokens consumed
          </span>
        </div>
      </div>

      {/* User Management Table */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          User Directory & Roles
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-prominent)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>User</th>
                <th style={{ padding: '0.75rem 1rem' }}>Email</th>
                <th style={{ padding: '0.75rem 1rem' }}>Mocks Taken</th>
                <th style={{ padding: '0.75rem 1rem' }}>Total XP</th>
                <th style={{ padding: '0.75rem 1rem' }}>Current Role</th>
                <th style={{ padding: '0.75rem 1rem' }}>Role Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <img
                        src={u.avatarUrl}
                        alt={u.name}
                        style={{ width: 32, height: 32, borderRadius: 'var(--radius-full)' }}
                      />
                      <span style={{ fontWeight: 600 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                    {u.email}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>
                    {u.interviewsCount}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                    {u.xpPoints} XP
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className={`badge ${u.role === 'ADMIN' ? 'badge-advanced' : 'badge-category'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    {u.role === 'ADMIN' ? (
                      <button
                        type="button"
                        className="btn btn-outline btn-xs"
                        style={{ padding: '0.35rem 0.65rem' }}
                        onClick={() => handleRoleChange(u.id, 'USER')}
                      >
                        Demote to USER
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary btn-xs"
                        style={{ padding: '0.35rem 0.65rem', fontWeight: 700 }}
                        onClick={() => handleRoleChange(u.id, 'ADMIN')}
                      >
                        Promote to ADMIN
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
