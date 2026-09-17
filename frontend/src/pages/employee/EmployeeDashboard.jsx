import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ClipboardList, FileSearch, Cpu } from 'lucide-react';

export const EmployeeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="section-header" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="brand-badge">
            <Cpu size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>ScrapSense</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Employee Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Welcome */}
      <div
        className="panel-card"
        style={{ marginBottom: '1.5rem', padding: '1.25rem 1.5rem' }}
      >
        <p style={{ margin: 0, fontSize: '1.05rem' }}>
          👋 Welcome back,{' '}
          <strong style={{ color: '#22d3ee' }}>{user?.name ?? 'Employee'}</strong>
        </p>
        <p style={{ margin: '0.35rem 0 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Use the options below to submit a defective item for inspection or review your previous
          requests.
        </p>
      </div>

      {/* Action cards */}
      <div className="section-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        {/* Submit Inspection */}
        <button
          id="btn-submit-inspection"
          className="panel-card"
          onClick={() => navigate('/employee/submit-inspection')}
          style={{
            cursor: 'pointer',
            textAlign: 'left',
            background: 'rgba(34, 211, 238, 0.06)',
            border: '1px solid rgba(34, 211, 238, 0.25)',
            transition: 'border-color 0.2s, transform 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#22d3ee';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.25)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <ClipboardList size={20} style={{ color: '#22d3ee' }} />
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>Submit Inspection</span>
          </div>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Report a defective item for AI-powered inspection and manager review.
          </p>
        </button>

        {/* My Requests */}
        <button
          id="btn-my-requests"
          className="panel-card"
          onClick={() => navigate('/employee/requests')}
          style={{
            cursor: 'pointer',
            textAlign: 'left',
            background: 'rgba(192, 132, 252, 0.06)',
            border: '1px solid rgba(192, 132, 252, 0.25)',
            transition: 'border-color 0.2s, transform 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#c084fc';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(192, 132, 252, 0.25)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <FileSearch size={20} style={{ color: '#c084fc' }} />
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>My Requests</span>
          </div>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            View status and history of all your previous inspection requests.
          </p>
        </button>
      </div>
    </div>
  );
};
