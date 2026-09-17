import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Cpu,
  LogOut,
  LayoutDashboard,
  ClipboardPen,
  FileSearch,
  ClipboardList,
  Brain,
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAuthenticated, isManager, isEmployee } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.35rem 0.75rem',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: 500,
    textDecoration: 'none',
    color: isActive ? '#fff' : 'var(--text-muted)',
    background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
    transition: 'background 0.15s, color 0.15s',
  });

  return (
    <header className="navbar" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
      {/* Brand */}
      <div className="nav-brand">
        <div className="brand-badge">
          <Cpu size={20} />
        </div>
        <span style={{ fontWeight: 700, letterSpacing: '0.02em' }}>ScrapSense</span>
      </div>

      {/* Role-aware navigation */}
      {isAuthenticated && user && (
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap' }}>
          {isEmployee && (
            <>
              <NavLink to="/employee" end style={navLinkStyle} id="nav-emp-dashboard">
                <LayoutDashboard size={15} />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/employee/submit-inspection" style={navLinkStyle} id="nav-emp-submit">
                <ClipboardPen size={15} />
                <span>Submit Inspection</span>
              </NavLink>
              <NavLink to="/employee/requests" style={navLinkStyle} id="nav-emp-requests">
                <FileSearch size={15} />
                <span>My Requests</span>
              </NavLink>
            </>
          )}

          {isManager && (
            <>
              <NavLink to="/manager" end style={navLinkStyle} id="nav-mgr-dashboard">
                <LayoutDashboard size={15} />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/manager/review" style={navLinkStyle} id="nav-mgr-review">
                <ClipboardList size={15} />
                <span>Review</span>
              </NavLink>
              <NavLink to="/manager/insights" style={navLinkStyle} id="nav-mgr-insights">
                <Brain size={15} />
                <span>AI Insights</span>
              </NavLink>
            </>
          )}
        </nav>
      )}

      {/* User info + logout */}
      {isAuthenticated && user && (
        <div className="nav-user">
          <div className="user-badge">
            <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
            <div>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.name}</span>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.7rem',
                  color: user.role === 'manager' ? '#c084fc' : '#22d3ee',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                {user.role}
              </span>
            </div>
          </div>

          <button
            id="btn-logout"
            onClick={handleLogout}
            className="btn btn-secondary"
            title="Log out"
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </header>
  );
};
