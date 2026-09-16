import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-200">
        <Navbar />
        <Home />
        <Footer />
      </div>
    </ThemeProvider>
  );
}
