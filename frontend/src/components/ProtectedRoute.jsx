import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute
 *
 * wraps a page that requires authentication.
 * Optionally restricts to a specific role.
 *
 * Props:
 *   children  – the page to render
 *   role      – 'employee' | 'manager' | undefined (any authenticated user)
 *   redirectTo – where to send unauthorised users (default: '/')
 */
export const ProtectedRoute = ({ children, role, redirectTo = '/' }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="full-loader" style={{ height: '100vh' }}>
        <div className="spinner spinner-lg" />
        <p>Verifying session…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (role && user?.role !== role) {
    // Redirect non-matching role to their own dashboard
    const fallback = user?.role === 'manager' ? '/manager' : '/employee';
    return <Navigate to={fallback} replace />;
  }

  return children;
};
