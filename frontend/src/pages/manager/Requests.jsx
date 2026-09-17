import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ClipboardList } from 'lucide-react';

export const Requests = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button
          id="btn-back-from-req"
          className="btn btn-secondary"
          onClick={() => navigate('/manager')}
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ClipboardList size={20} style={{ color: '#f59e0b' }} />
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Inspection Requests</h2>
        </div>
      </div>

      <div className="panel-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <ClipboardList size={48} style={{ color: '#f59e0b', opacity: 0.5, marginBottom: '1rem' }} />
        <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>Inspection Requests</h3>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>
          Manager request list will be implemented later.
        </p>
      </div>
    </div>
  );
};
