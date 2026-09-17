import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';

// Existing auth/dashboard pages (kept intact)
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';

// Employee pages
import { EmployeeDashboard } from './pages/employee/EmployeeDashboard';
import { SubmitInspection } from './pages/employee/SubmitInspection';
import { MyRequests } from './pages/employee/MyRequests';

// Manager pages
import { ManagerDashboard } from './pages/manager/ManagerDashboard';
import { Review } from './pages/manager/Review';
import { RequestDetails } from './pages/manager/RequestDetails';
import { AIInsights } from './pages/manager/AIInsights';

/**
 * RootRedirect — sends authenticated users to their role dashboard.
 * Unauthenticated users see AuthPage.
 */
function RootRedirect() {
  const { isAuthenticated, isManager, loading } = useAuth();

  if (loading) {
    return (
      <div className="full-loader" style={{ height: '100vh' }}>
        <div className="spinner spinner-lg" />
        <p>Initializing secure session…</p>
      </div>
    );
  }

  if (!isAuthenticated) return <AuthPage />;
  if (isManager) return <Navigate to="/manager" replace />;
  return <Navigate to="/employee" replace />;
}

function AppRoutes() {
  return (
    <div className="app-container">
      <Navbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          {/* Root → smart redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Legacy /dashboard — preserved for existing bookmarks */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* ── Employee routes ─────────────────────────────────────────── */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute role="employee">
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/submit-inspection"
            element={
              <ProtectedRoute role="employee">
                <SubmitInspection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/requests"
            element={
              <ProtectedRoute role="employee">
                <MyRequests />
              </ProtectedRoute>
            }
          />

          {/* ── Manager routes ──────────────────────────────────────────── */}
          <Route
            path="/manager"
            element={
              <ProtectedRoute role="manager">
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/review"
            element={
              <ProtectedRoute role="manager">
                <Review />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/requests/:requestId"
            element={
              <ProtectedRoute role="manager">
                <RequestDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/insights"
            element={
              <ProtectedRoute role="manager">
                <AIInsights />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
