import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-brand-primary/20 selection:text-brand-primary">
        <Navbar />
        <Home />
        <Footer />
      </div>
    </ThemeProvider>
  );
}
