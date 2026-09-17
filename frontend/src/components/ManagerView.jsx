import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, UserCheck, Shield, AlertTriangle, Layers, Briefcase, Calendar, ShieldAlert } from 'lucide-react';

export const ManagerView = () => {
  const { token, user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        const response = await fetch('/api/dashboard/manager', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch manager dashboard data. Ensure you have Manager privileges.');
        }

        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchManagerData();
  }, [token]);

  if (loading) {
    return (
      <div className="full-loader">
        <div className="spinner spinner-lg"></div>
        <p>Loading manager administration console...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <ShieldAlert size={20} />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div>
      {/* Top Hero Card */}
      <div className="dashboard-hero">
        <div>
          <div style={{ marginBottom: '0.5rem' }}>
            <span className="role-pill role-pill-manager">
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#c084fc' }}></span>
              Manager Admin Account
            </span>
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>{data?.welcomeMessage}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Signed in as <strong>{user?.email}</strong> • Full Administrative Authorization Active
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c084fc', fontSize: '0.85rem', fontWeight: 600 }}>
            <Shield size={16} />
            <span>MongoDB Synced</span>
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.2rem' }}>
            {data?.teamMembers?.length || 0} Total System Accounts
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-val">{data?.stats?.totalUsers || 0}</div>
            <div className="stat-title">Total Registered Users</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee' }}>
            <UserCheck size={24} />
          </div>
          <div>
            <div className="stat-val">{data?.stats?.employeeCount || 0}</div>
            <div className="stat-title">Employees</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <Shield size={24} />
          </div>
          <div>
            <div className="stat-val">{data?.stats?.managerCount || 0}</div>
            <div className="stat-title">Managers</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="stat-val">{data?.stats?.pendingApprovals || 0}</div>
            <div className="stat-title">Pending Approvals</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="section-grid">
        {/* Left Column: Team Directory Table from MongoDB */}
        <div className="panel-card">
          <div className="panel-header">
            <h3 className="panel-title">
              <Users size={20} color="#c084fc" />
              <span>Registered Accounts Directory (Live from MongoDB)</span>
            </h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {data?.teamMembers?.map((member) => {
                  const memberId = String(member.id || member._id || '');
                  return (
                    <tr key={memberId}>
                      <td style={{ color: 'var(--text-subtle)', fontWeight: 600, fontSize: '0.78rem' }}>
                        #{memberId.slice(-6)}
                      </td>
                      <td style={{ fontWeight: 600 }}>{member.name}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{member.email}</td>
                      <td>
                        <span
                          className={member.role === 'manager' ? 'role-pill role-pill-manager' : 'role-pill role-pill-employee'}
                          style={{ fontSize: '0.7rem', padding: '0.15rem 0.55rem' }}
                        >
                          {member.role}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {new Date(member.createdAt || member.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Manager Notifications / Action Center */}
        <div className="panel-card">
          <div className="panel-header">
            <h3 className="panel-title">
              <Layers size={20} color="#fb7185" />
              <span>Manager Alerts</span>
            </h3>
          </div>

          <div className="item-list">
            {data?.managerAlerts?.map((alert) => (
              <div
                key={alert.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderLeft: `3px solid ${alert.severity === 'warning' ? '#fbbf24' : '#6366f1'}`,
                  borderTop: '1px solid var(--border-color)',
                  borderRight: '1px solid var(--border-color)',
                  borderBottom: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '0.9rem',
                }}
              >
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}>
                  {alert.message}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  Priority: {alert.severity}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
