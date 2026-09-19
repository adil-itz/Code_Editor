import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, GitBranch, Bug, Terminal, Globe, Package, CheckSquare, Play, Sparkles } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function EcosystemSection() {
  const tools = [
    { id: 'git', name: 'Git Engine', icon: GitBranch, status: 'Version Control', detail: 'Stage, commit, diff, and push branches directly from the browser.' },
    { id: 'debugger', name: 'Debugger', icon: Bug, status: 'Breakpoints', detail: 'Step-through debugging with inspectable call stacks and scope variables.' },
    { id: 'formatter', name: 'Prettier Formatter', icon: Wrench, status: 'Auto-Format', detail: 'Automatic code formatting on save with customizable rules.' },
    { id: 'terminal', name: 'POSIX Terminal', icon: Terminal, status: 'Full Shell', detail: 'Interactive terminal with standard Unix utilities and command execution.' },
    { id: 'preview', name: 'Live Preview', icon: Globe, status: 'HMR Enabled', detail: 'Instant preview frame with device viewports and hot module reload.' },
    { id: 'npm', name: 'Package Manager', icon: Package, status: 'NPM / Yarn', detail: 'Install public NPM packages directly into your browser workspace.' },
    { id: 'linter', name: 'ESLint & Oxlint', icon: CheckSquare, status: 'Static Analysis', detail: 'Real-time diagnostic inline warnings and quick-fix suggestions.' },
    { id: 'runner', name: 'Code Runner', icon: Play, status: 'Multi-Lang', detail: 'Instant multi-language execution engine for quick script testing.' }
  ];

  const [activeTool, setActiveTool] = useState(tools[0]);

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-border-subtle bg-bg-deep relative">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <Badge variant="accent" dot={true}>SECTION 08 — ECOSYSTEM</Badge>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary">
            Integrated Tooling.
          </h2>
          <p className="text-text-secondary text-sm sm:text-base font-sans">
            No external plugins or extensions needed. Essential developer tools built directly into the core editor architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto">
          {tools.map(t => {
            const Icon = t.icon;
            const isSelected = activeTool.id === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTool(t)}
                className={`p-4 rounded-xl border text-left space-y-3 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-surface-elevated border-brand-primary shadow-lg shadow-brand-primary/10'
                    : 'bg-surface border-border-main hover:border-border-main'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-brand-primary text-white' : 'bg-surface-elevated text-text-secondary'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-brand-primary font-semibold">{t.status}</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-text-primary">{t.name}</div>
                  <div className="text-xs text-text-muted mt-1 leading-snug">{t.detail}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
