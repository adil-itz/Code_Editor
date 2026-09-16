import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, ArrowUpRight, Code2, Sparkles, BookOpen, Layers } from 'lucide-react';
import { ThemeSwitcher } from '../ui/ThemeSwitcher';
import { Button } from '../ui/Button';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Product', href: '#product' },
    { label: 'Editor', href: '#editor' },
    { label: 'Languages', href: '#languages' },
    { label: 'Documentation', href: '#docs' }
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-2.5 bg-bg-primary/80 backdrop-blur-md border-b border-border-main shadow-lg shadow-black/20' 
          : 'py-4 bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-lg bg-surface-elevated border border-border-main flex items-center justify-center group-hover:border-brand-primary/50 transition-colors duration-200 shadow-xs">
              <Terminal className="w-4 h-4 text-brand-primary transition-transform group-hover:scale-110 duration-200" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-brand-primary shadow-xs shadow-brand-primary" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-sans font-bold text-base tracking-tight text-text-primary">DEVSPACE</span>
              <span className="text-[10px] font-mono text-brand-primary font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded bg-brand-primary/10 border border-brand-primary/20">IDE</span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-1 bg-surface/50 p-1 rounded-full border border-border-subtle backdrop-blur-sm">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-elevated rounded-full transition-all duration-150"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            
            <button className="hidden sm:inline-flex text-xs font-medium text-text-secondary hover:text-text-primary px-3 py-1.5 transition-colors duration-150 cursor-pointer">
              Sign In
            </button>

            <Button size="sm" icon={ArrowUpRight} iconPosition="right" className="text-xs font-medium">
              Open Editor
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
