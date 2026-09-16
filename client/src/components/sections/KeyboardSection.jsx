import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Keyboard, Zap, Play, Terminal, Search, Save, Command } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { KeyboardKey } from '../ui/KeyboardKey';

export function KeyboardSection() {
  const [activeShortcut, setActiveShortcut] = useState('run');

  const shortcuts = [
    { id: 'run', keys: ['Ctrl', 'Enter'], label: 'Run Project', desc: 'Triggers instant compilation & preview reload', icon: Play },
    { id: 'open', keys: ['Ctrl', 'P'], label: 'Quick Open', desc: 'Search and jump to any project file', icon: Search },
    { id: 'save', keys: ['Ctrl', 'S'], label: 'Save Project', desc: 'Persists active changes to browser memory', icon: Save },
    { id: 'palette', keys: ['Ctrl', 'Shift', 'P'], label: 'Command Palette', desc: 'Opens global command menu', icon: Command },
    { id: 'terminal', keys: ['Ctrl', '`'], label: 'Toggle Terminal', desc: 'Expand or collapse execution logs', icon: Terminal }
  ];

  const current = shortcuts.find(s => s.id === activeShortcut) || shortcuts[0];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border-subtle bg-bg-primary relative">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="accent" dot={true}>SECTION 07 — KEYBOARD-FIRST</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-primary">
            Built for your hands.
          </h2>
          <p className="text-text-secondary text-base font-sans">
            Ergonomic keyboard-first navigation. Every editor action has a dedicated shortcut mapped to standard IDE keybindings so you never lose momentum.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 max-w-5xl mx-auto">
          {shortcuts.map(sc => {
            const Icon = sc.icon;
            const isActive = activeShortcut === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => setActiveShortcut(sc.id)}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between h-32 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-surface-elevated border-brand-primary shadow-lg shadow-brand-primary/10'
                    : 'bg-surface border-border-main hover:border-border-main'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-brand-primary' : 'text-text-muted'}`} />
                  {isActive && <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />}
                </div>
                <div>
                  <div className="text-sm font-bold text-text-primary">{sc.label}</div>
                  <div className="text-[11px] font-mono text-text-muted mt-1">{sc.keys.join(' + ')}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="max-w-3xl mx-auto p-8 rounded-2xl bg-surface border border-border-main shadow-2xl flex flex-col items-center justify-center text-center space-y-6">
          <div className="flex items-center gap-3">
            {current.keys.map((k, i) => (
              <React.Fragment key={k}>
                {i > 0 && <span className="text-text-muted font-mono font-bold text-sm">+</span>}
                <KeyboardKey label={k} isPressed={true} size="lg" />
              </React.Fragment>
            ))}
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-text-primary">{current.label}</h3>
            <p className="text-xs text-text-secondary font-mono">{current.desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
