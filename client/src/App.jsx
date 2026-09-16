import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { AuthModal } from './components/auth/AuthModal';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-200">
          <Navbar />
          <Home />
          <Footer />
          <AuthModal />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
