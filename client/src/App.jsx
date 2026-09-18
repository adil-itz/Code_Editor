import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { UserDashboard } from './pages/UserDashboard';
import { EditorPage } from './pages/EditorPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { WorkspaceHome } from './pages/WorkspaceHome';
import { ProjectIDE } from './pages/ProjectIDE';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}

function StandardLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-200 flex flex-col justify-between">
            <Routes>
              <Route 
                path="/" 
                element={
                  <StandardLayout>
                    <Home />
                  </StandardLayout>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <StandardLayout>
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  </StandardLayout>
                } 
              />
              <Route 
                path="/workspace" 
                element={
                  <StandardLayout>
                    <ProtectedRoute>
                      <WorkspaceHome />
                    </ProtectedRoute>
                  </StandardLayout>
                } 
              />
              <Route 
                path="/editor" 
                element={
                  <StandardLayout>
                    <ProtectedRoute>
                      <EditorPage />
                    </ProtectedRoute>
                  </StandardLayout>
                } 
              />
              <Route 
                path="/admin/dashboard" 
                element={
                  <StandardLayout>
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  </StandardLayout>
                } 
              />
              <Route 
                path="/workspace/project/:projectId" 
                element={
                  <ProtectedRoute>
                    <ProjectIDE />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <AuthModal />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
