import React from 'react';
import { FolderPlus, Code, Play, ArrowRight, CheckCircle2 } from 'lucide-react';

export function Workflow() {
  const steps = [
    {
      step: '01',
      title: 'Create',
      icon: FolderPlus,
      description: 'Start a new workspace from scratch or choose from popular templates like React, Node, Python, or C++ with zero setup overhead.',
      details: ['Instant project bootstrap', 'Multi-file tree creation', 'Git repository sync']
    },
    {
      step: '02',
      title: 'Code',
      icon: Code,
      description: 'Write, refactor, and navigate clean source code with rich syntax colors, auto-completion, line numbers, and active error detection.',
      details: ['Syntax highlight parser', 'IntelliSense code hints', 'Keyboard hotkey navigation']
    },
    {
      step: '03',
      title: 'Run',
      icon: Play,
      description: 'Execute scripts directly inside the browser using optimized WebAssembly runtimes with real-time ANSI terminal logging output.',
      details: ['Sub-100ms execution', 'Integrated stdout stream', 'Zero local installation']
    }
  ];

  return (
    <section id="workflow" className="py-24 bg-secondary-bg/40 border-y border-border relative scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono font-semibold text-brand-primary uppercase tracking-wider mb-3">
            Streamlined Execution Pipeline
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
            From idea to execution in three steps.
          </h2>
          <p className="text-base sm:text-lg text-secondary-text leading-relaxed">
            Eliminate environment setup and dependencies. Move from concept to running code seamlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-border -translate-y-8 z-0"></div>

          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative z-10 bg-surface rounded-2xl border border-border p-8 hover:border-brand-primary/40 transition-all duration-200 hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-extrabold font-mono text-brand-primary/40">
                      {item.step}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-secondary-text leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-border space-y-2">
                  {item.details.map((detail) => (
                    <div key={detail} className="flex items-center gap-2 text-xs font-mono text-secondary-text">
                      <CheckCircle2 className="w-3.5 h-3.5 text-status-success shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
