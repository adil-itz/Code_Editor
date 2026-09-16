import React from 'react';
import { GitBranch, Check, Cpu, Bell, Radio } from 'lucide-react';

export function StatusBar({ branch = 'main', language = 'TypeScript' }) {
  return (
    <div className="h-6 bg-bg-deep border-t border-border-main px-3 flex items-center justify-between font-mono text-[10px] text-text-muted select-none">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
          <GitBranch className="w-3 h-3 text-brand-primary" />
          <span>{branch}</span>
        </div>
        <div className="flex items-center gap-1 text-status-success">
          <Check className="w-3 h-3" />
          <span>Saved</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-text-muted">
          <Radio className="w-3 h-3 text-brand-primary animate-pulse" />
          <span>WebContainer Active</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden sm:inline">Ln 18, Col 24</span>
        <span className="hidden md:inline">Spaces: 2</span>
        <span className="hidden sm:inline">UTF-8</span>
        <span className="px-1.5 py-0.5 rounded bg-surface-elevated text-brand-primary font-semibold border border-border-subtle">
          {language}
        </span>
      </div>
    </div>
  );
}
