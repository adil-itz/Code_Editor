import React from 'react';
import { ArrowRight, Sparkles, Terminal, Code2, Cpu, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { EditorPreview } from './EditorPreview';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-grid-pattern">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-primary/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-brand-accent/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 mb-6">
          <Badge variant="default" className="text-xs sm:text-sm py-1.5 px-4 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></span>
            <span>NEW · Browser-native development</span>
          </Badge>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.1] mb-6">
          Your Development Environment.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">
            Anywhere.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-secondary-text max-w-2xl mx-auto leading-relaxed mb-10">
          Write, execute, and manage code in a powerful browser-based development environment designed for modern software development.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto text-base px-8 py-3.5 shadow-lg shadow-brand-primary/20">
            Start Coding
          </Button>
          <a href="#editor" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base px-8 py-3.5">
              Explore the Editor
            </Button>
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-mono text-muted-text mb-16">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-status-success" />
            <span>No installation required</span>
          </div>
          <span className="text-border hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-brand-primary" />
            <span>Built for developers</span>
          </div>
          <span className="text-border hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-brand-accent" />
            <span>Instant runtime execution</span>
          </div>
        </div>

        <div id="editor" className="scroll-mt-28 max-w-5xl mx-auto">
          <EditorPreview />
        </div>
      </div>
    </section>
  );
}
