import React from 'react';
import { Search, Terminal, FolderTree, GitBranch, Bug, Globe, Command, Box, Settings, Moon } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function CapabilitiesSection() {
  const capabilities = [
    { title: 'Global Code Search', icon: Search, tag: 'AST Indexing', preview: 'Find symbol references across all project files in 2ms.' },
    { title: 'POSIX Terminal', icon: Terminal, tag: 'WASM Shell', preview: 'Full Unix command line environment with package streaming.' },
    { title: 'Nested Explorer', icon: FolderTree, tag: 'Virtual FS', preview: 'Instant folder expansion, asset dragging, and file management.' },
    { title: 'Git Source Control', icon: GitBranch, tag: 'Diff Engine', preview: 'Visual side-by-side file diffs and branch staging.' },
    { title: 'Inline Debugger', icon: Bug, tag: 'V8 Inspector', preview: 'Breakpoint execution, variable call stack, and step-into tools.' },
    { title: 'Responsive Canvas', icon: Globe, tag: 'HMR Sync', preview: 'Multi-device preview frame with instant live reload.' },
    { title: 'Keystroke Palette', icon: Command, tag: '⌘ K Launcher', preview: 'Raycast-speed action search for commands and settings.' },
    { title: 'Package Ecosystem', icon: Box, tag: 'NPM Direct', preview: 'Import public JavaScript and WebAssembly modules directly.' }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border-subtle bg-bg-primary relative">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="accent" dot={true}>SECTION 11 — CAPABILITIES</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-primary">
            Every capability at your fingertips.
          </h2>
          <p className="text-text-secondary text-base font-sans">
            A comprehensive matrix of professional developer capabilities packaged into a quiet, ultra-responsive browser environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-xl bg-surface border border-border-main hover:border-brand-primary/40 transition-all duration-200 space-y-3 group shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-surface-elevated text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-text-muted px-1.5 py-0.5 rounded bg-surface-elevated border border-border-subtle">
                    {cap.tag}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                    {cap.title}
                  </h3>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">
                    {cap.preview}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
