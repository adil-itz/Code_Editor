import React, { useState } from 'react';
import { Command, Zap, Target, Layout, ShieldCheck, Search, Keyboard } from 'lucide-react';

export function DeveloperExperience() {
  const [filter, setFilter] = useState('');

  const shortcuts = [
    { key: '⌘ / Ctrl + P', action: 'Quick Open File', category: 'Navigation' },
    { key: '⌘ / Ctrl + S', action: 'Save & Format Workspace', category: 'Editor' },
    { key: '⌘ / Ctrl + Enter', action: 'Run Source Code', category: 'Runtime' },
    { key: '⌘ / Ctrl + Shift + P', action: 'Open Command Palette', category: 'General' },
    { key: '⌘ / Ctrl + B', action: 'Toggle Sidebar Explorer', category: 'Layout' },
    { key: '⌘ / Ctrl + `', action: 'Toggle Integrated Terminal', category: 'Terminal' },
    { key: '⌘ / Ctrl + D', action: 'Add Selection To Next Match', category: 'Editor' },
    { key: 'Alt + Shift + F', action: 'Format Code with Prettier', category: 'Editor' }
  ];

  const filteredShortcuts = shortcuts.filter(s =>
    s.action.toLowerCase().includes(filter.toLowerCase()) ||
    s.key.toLowerCase().includes(filter.toLowerCase()) ||
    s.category.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <section className="py-24 bg-secondary-bg/30 border-t border-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-mono font-semibold text-brand-primary uppercase tracking-wider">
              Developer Ergonomics
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              Built around the developer.
            </h2>
            <p className="text-base sm:text-lg text-secondary-text leading-relaxed">
              Every detail is engineered to minimize friction, maintain deep flow state, and put full keyboard control at your fingertips.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-surface border border-border">
                <div className="flex items-center gap-2 font-semibold text-sm text-foreground mb-1">
                  <Command className="w-4 h-4 text-brand-primary" />
                  <span>Keyboard First</span>
                </div>
                <p className="text-xs text-secondary-text">Execute commands, switch tabs, and run builds without leaving the keys.</p>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-border">
                <div className="flex items-center gap-2 font-semibold text-sm text-foreground mb-1">
                  <Zap className="w-4 h-4 text-brand-accent" />
                  <span>Instant Execution</span>
                </div>
                <p className="text-xs text-secondary-text">Zero compile latency with WebAssembly engine integration.</p>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-border">
                <div className="flex items-center gap-2 font-semibold text-sm text-foreground mb-1">
                  <Layout className="w-4 h-4 text-status-success" />
                  <span>Zen Workspace</span>
                </div>
                <p className="text-xs text-secondary-text">Distraction-free focus with collapsible panels and custom themes.</p>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-border">
                <div className="flex items-center gap-2 font-semibold text-sm text-foreground mb-1">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>Isolated Sandbox</span>
                </div>
                <p className="text-xs text-secondary-text">Safe execution environment protected from local system conflicts.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl bg-surface border border-border p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Keyboard className="w-4 h-4 text-brand-primary" />
                  <span className="font-mono text-sm font-semibold text-foreground">Command Palette & Hotkeys</span>
                </div>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-text" />
                  <input
                    type="text"
                    placeholder="Search shortcuts..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="pl-8 pr-3 py-1 text-xs font-mono rounded-md bg-secondary-bg border border-border text-foreground focus:outline-none focus:border-brand-primary/50 w-44"
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-[320px] overflow-y-auto custom-scrollbar pr-1">
                {filteredShortcuts.map((item) => (
                  <div
                    key={item.action}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary-bg/40 border border-border/60 hover:bg-secondary-bg hover:border-brand-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-foreground">{item.action}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-muted-text">
                        {item.category}
                      </span>
                    </div>
                    <kbd className="px-2.5 py-1 text-[11px] font-mono font-semibold rounded bg-surface text-brand-primary border border-border shadow-xs">
                      {item.key}
                    </kbd>
                  </div>
                ))}
                {filteredShortcuts.length === 0 && (
                  <div className="text-center py-6 text-xs font-mono text-muted-text">
                    No matching hotkeys found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
