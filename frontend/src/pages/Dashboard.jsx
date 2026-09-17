import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { EmployeeView } from '../components/EmployeeView';
import { ManagerView } from '../components/ManagerView';
import { Eye, Shield } from 'lucide-react';

export const Dashboard = () => {
  const { user, isManager } = useAuth();
  const [managerPreviewEmployee, setManagerPreviewEmployee] = useState(false);

  return (
    <div className="dashboard-container">
      {isManager && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <button
            onClick={() => setManagerPreviewEmployee(!managerPreviewEmployee)}
            className="btn btn-secondary"
            style={{ fontSize: '0.825rem', padding: '0.4rem 0.85rem' }}
          >
            <Eye size={15} />
            <span>
              {managerPreviewEmployee ? 'Switch to Manager Administration' : 'Preview Employee Portal View'}
            </span>
          </button>
        </div>
      )}

      {isManager && !managerPreviewEmployee ? (
        <ManagerView />
      ) : (
        <EmployeeView />
      )}
    </div>
  );
};
