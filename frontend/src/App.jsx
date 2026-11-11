import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { TooltipProvider } from './context/TooltipContext';
import LoginPage from './pages/LoginPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'staff') return <Navigate to="/staff" replace />;
    return <Navigate to="/user" replace />;
  }
  return children;
}

function RoleRouter() {
  const { user } = useAuth();
  if (!user) return <LoginPage />;
  if (user.role === 'admin') return <AdminDashboard />;
  if (user.role === 'staff') return <StaffDashboard />;
  return <UserDashboard />;
}

export default function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Dynamic route depending on active user role */}
              <Route path="/" element={<RoleRouter />} />
              <Route path="/login" element={<LoginPage />} />
              
              {/* Direct role pages */}
              <Route
                path="/user"
                element={
                  <ProtectedRoute allowedRoles={['user', 'admin']}>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff"
                element={
                  <ProtectedRoute allowedRoles={['staff', 'admin']}>
                    <StaffDashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
