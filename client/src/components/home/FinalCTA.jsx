import React from 'react';
import { ArrowRight, BookOpen, Sparkles, Terminal } from 'lucide-react';
import { Button } from '../ui/Button';

export function FinalCTA() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl bg-secondary-bg/80 border border-border p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-brand-primary/15 blur-[100px] rounded-full pointer-events-none -z-10"></div>
          <div className="absolute bottom-0 right-0 w-[300px] h-[200px] bg-brand-accent/10 blur-[90px] rounded-full pointer-events-none -z-10"></div>

          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready for Production</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground max-w-3xl mx-auto mb-6 leading-tight">
            Stop switching between tools.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">
              Start building.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-secondary-text max-w-xl mx-auto mb-10 leading-relaxed">
            Open your browser, create a project, and start coding in under five seconds with zero environment setup.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto px-8 py-3.5 shadow-xl shadow-brand-primary/25">
              Start Coding
            </Button>
            <a href="#docs" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" icon={BookOpen} iconPosition="left" className="w-full sm:w-auto px-8 py-3.5">
                Read Documentation
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
