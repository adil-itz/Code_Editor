import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Play, FolderOpen, Terminal, Code2, Sun, FileCode, Command, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function CommandPaletteSection() {
  const [search, setSearch] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);

  const commands = [
    { id: 1, name: 'Run Project', icon: Play, shortcut: '↵', category: 'Execution' },
    { id: 2, name: 'Quick Open File', icon: FolderOpen, shortcut: '⌘ P', category: 'Navigation' },
    { id: 3, name: 'Toggle Terminal', icon: Terminal, shortcut: '⌘ `', category: 'View' },
    { id: 4, name: 'Change Language Mode', icon: Code2, shortcut: '⌘ K L', category: 'Editor' },
    { id: 5, name: 'Toggle Dark / Light Theme', icon: Sun, shortcut: '⌘ K T', category: 'Settings' },
    { id: 6, name: 'Format Document', icon: FileCode, shortcut: '⇧ ⌥ F', category: 'Editor' }
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.name.toLowerCase().includes(search.toLowerCase()) || 
    cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-border-subtle bg-bg-deep relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-5 space-y-5 sm:space-y-6">
          <Badge variant="accent" dot={true}>SECTION 06 — COMMAND PALETTE</Badge>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary leading-tight">
            Everything a keystroke away.
          </h2>
          <p className="text-text-secondary text-sm sm:text-base font-sans leading-relaxed">
            Raycast-inspired command palette designed specifically for browser developer workflows. Instant search across files, settings, commands, and refactoring tools without reaching for your mouse.
          </p>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border-main text-xs font-mono text-text-secondary">
            <span className="px-2 py-1 rounded bg-surface-elevated text-brand-primary font-bold border border-border-main">⌘ K</span>
            <span>press anytime to activate command palette</span>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-xl bg-surface-elevated/95 backdrop-blur-xl border border-brand-primary/40 shadow-2xl shadow-black/80 overflow-hidden font-mono text-xs">
            <div className="p-4 border-b border-border-main flex items-center gap-3 bg-surface">
              <Search className="w-4 h-4 text-brand-primary" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type a command or search files..."
                className="w-full bg-transparent text-text-primary placeholder:text-text-muted focus:outline-none text-xs"
              />
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-surface-elevated text-text-muted border border-border-subtle">ESC</span>
            </div>

            <div className="p-2 space-y-1 max-h-[320px] overflow-y-auto custom-scrollbar">
              {filteredCommands.map((cmd, idx) => {
                const Icon = cmd.icon;
                const isSelected = idx === selectedIdx;
                return (
                  <div
                    key={cmd.id}
                    onClick={() => setSelectedIdx(idx)}
                    className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-brand-primary/15 text-brand-primary font-medium border border-brand-primary/30'
                        : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-brand-primary' : 'text-text-muted'}`} />
                      <span>{cmd.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-text-muted uppercase">{cmd.category}</span>
                      <span className="px-2 py-0.5 rounded bg-surface border border-border-main text-[11px] text-text-primary font-bold">
                        {cmd.shortcut}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-4 py-2 bg-bg-deep border-t border-border-main flex items-center justify-between text-[10px] text-text-muted">
              <span>Use ↑ ↓ to navigate</span>
              <span className="flex items-center gap-1"><ArrowRight className="w-3 h-3 text-brand-primary" /> Select item</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
