import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileSearch } from 'lucide-react';
import { requestsApi } from '../../services/api';

export const MyRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await requestsApi.getMyRequests();
        if (res.data && res.data.success) {
          setRequests(res.data.data);
        } else {
          setError('Failed to load requests');
        }
      } catch (err) {
        console.error('Error loading requests', err);
        setError('Error loading requests');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button
          id="btn-back-from-requests"
          className="btn btn-secondary"
          onClick={() => navigate('/employee')}
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileSearch size={20} style={{ color: '#c084fc' }} />
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>My Requests</h2>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="alert alert-error">{error}</p>}
      {!loading && !error && (
        <div className="panel-card" style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
                <th>Request ID</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Score</th>
                <th>Suggested</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td>{r.requestId}</td>
                  <td>{r.itemId}</td>
                  <td>{r.quantity}</td>
                  <td>{r.requestStatus}</td>
                  <td>{r.aiPrediction?.overallScore?.toFixed(1) ?? '—'}</td>
                  <td>{r.aiPrediction?.suggestedStatus ?? '—'}</td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
