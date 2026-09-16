import React, { useState, useEffect } from 'react';
import { Terminal, Code2, Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Button } from '../ui/Button';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Languages', href: '#languages' },
    { name: 'Editor', href: '#editor' },
    { name: 'Workflow', href: '#workflow' },
    { name: 'Documentation', href: '#docs' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-background/85 backdrop-blur-md border-b border-border shadow-xs py-3'
          : 'bg-background/40 backdrop-blur-xs border-b border-border/40 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-200">
              <Code2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight font-sans text-foreground">Nexus</span>
                <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-brand-primary/10 text-brand-primary font-semibold border border-brand-primary/20">IDE</span>
              </div>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-secondary-text hover:text-foreground transition-colors duration-150"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <a href="#signin" className="text-sm font-medium text-secondary-text hover:text-foreground transition-colors">
              Sign In
            </a>
            <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
              Start Coding
            </Button>
          </div>

          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-secondary-text hover:text-foreground hover:bg-secondary-bg border border-border"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface/95 backdrop-blur-lg px-4 pt-4 pb-6 mt-3 space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-secondary-text hover:text-foreground py-1"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="pt-4 border-t border-border flex flex-col gap-3">
            <a
              href="#signin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2 text-sm font-medium text-secondary-text hover:text-foreground"
            >
              Sign In
            </a>
            <Button variant="primary" size="md" icon={ArrowRight} iconPosition="right" className="w-full">
              Start Coding
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
