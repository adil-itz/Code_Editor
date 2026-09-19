import React from 'react';
import { motion } from 'framer-motion';
import { Save, Wrench, Play, Eye, GitCommit, CheckCircle2, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function WorkflowSection() {
  const steps = [
    { label: 'Save Code', icon: Save, desc: 'Auto-persists state' },
    { label: 'Prettier Format', icon: Wrench, desc: 'Cleans AST structure' },
    { label: 'Instant Run', icon: Play, desc: 'WASM engine execute' },
    { label: 'HMR Preview', icon: Eye, desc: 'Updates DOM instantly' },
    { label: 'Git Commit', icon: GitCommit, desc: 'Stages changes' }
  ];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-border-subtle bg-bg-primary relative">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <Badge variant="accent" dot={true}>SECTION 09 — WORKFLOW</Badge>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary">
            Don't repeat yourself.
          </h2>
          <p className="text-text-secondary text-sm sm:text-base font-sans">
            Automated dev pipelines. Every save event seamlessly triggers formatting, static analysis, execution, live preview refresh, and local git tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 max-w-6xl mx-auto relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={step.label}>
                <div className="flex-1 p-5 rounded-xl bg-surface border border-border-main text-center space-y-2 relative shadow-md">
                  <div className="w-10 h-10 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-bold text-text-primary">{step.label}</div>
                  <div className="text-xs text-text-muted font-mono">{step.desc}</div>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden md:block text-brand-primary">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
