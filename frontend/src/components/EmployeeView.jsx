import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, Bell, Calendar, Clock, ArrowUpRight, CheckCircle, ShieldAlert } from 'lucide-react';

export const EmployeeView = () => {
  const { token, user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await fetch('/api/dashboard/employee', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch employee dashboard data.');
        }

        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [token]);

  if (loading) {
    return (
      <div className="full-loader">
        <div className="spinner spinner-lg"></div>
        <p>Loading your employee workspace...</p>
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
            <span className="role-pill role-pill-employee">
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22d3ee' }}></span>
              Employee Account
            </span>
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>{data?.welcomeMessage}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Connected with <strong>{user?.email}</strong> • Role: <strong>Employee</strong>
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontSize: '0.85rem', fontWeight: 600 }}>
            <Clock size={16} />
            <span>Shift Status</span>
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.2rem' }}>
            {data?.attendanceStatus}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee' }}>
            <CheckSquare size={24} />
          </div>
          <div>
            <div className="stat-val">{data?.assignedProjects?.length || 0}</div>
            <div className="stat-title">Assigned Projects</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="stat-val">98.4%</div>
            <div className="stat-title">Task Completion Rate</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <Calendar size={24} />
          </div>
          <div>
            <div className="stat-val">18 Days</div>
            <div className="stat-title">Current Sprint Cycle</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="section-grid">
        {/* Left Column: Assigned Tasks */}
        <div className="panel-card">
          <div className="panel-header">
            <h3 className="panel-title">
              <CheckSquare size={20} color="#22d3ee" />
              <span>Current Sprint Assigned Tasks</span>
            </h3>
          </div>

          <div className="item-list">
            {data?.assignedProjects?.map((project) => (
              <div key={project.id} className="list-item">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', background: 'rgba(255,255,255,0.06)', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                      {project.id}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{project.title}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Priority: <span style={{ color: project.priority === 'High' ? '#fb7185' : project.priority === 'Medium' ? '#fbbf24' : '#34d399' }}>{project.priority}</span>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '20px',
                    fontWeight: 600,
                    background: project.status === 'In Progress' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: project.status === 'In Progress' ? '#818cf8' : '#34d399',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Company Announcements */}
        <div className="panel-card">
          <div className="panel-header">
            <h3 className="panel-title">
              <Bell size={20} color="#fbbf24" />
              <span>Announcements</span>
            </h3>
          </div>

          <div className="item-list">
            {data?.recentAnnouncements?.map((item) => (
              <div key={item.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '0.85rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                  {item.title}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>{item.author}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
