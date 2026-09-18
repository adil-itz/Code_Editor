import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, FilePlus, Play, Save, Eye, Terminal, X } from 'lucide-react';

export function CommandPalette({ isOpen, onClose, onAction }) {
  const [query, setQuery] = useState('');

  const commands = [
    { id: 'save', label: 'Save File', icon: Save, shortcut: 'Ctrl+S' },
    { id: 'run', label: 'Run Code', icon: Play, shortcut: 'F5' },
    { id: 'new-file', label: 'New File', icon: FilePlus, shortcut: 'Ctrl+N' },
    { id: 'toggle-terminal', label: 'Toggle Terminal Panel', icon: Terminal, shortcut: 'Ctrl+`' },
    { id: 'toggle-preview', label: 'Toggle Web Live Preview', icon: Eye, shortcut: 'Ctrl+P' },
    { id: 'search', label: 'Search Workspace Files', icon: Search, shortcut: 'Ctrl+Shift+F' }
  ];

  const filteredCommands = commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onAction('open-palette');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onAction]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm select-none font-mono">
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        className="bg-surface border border-border-main rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
      >
        <div className="p-3 border-b border-border-main flex items-center gap-3">
          <Command className="w-4 h-4 text-brand-primary shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          <button onClick={onClose} className="text-text-muted hover:text-text-primary p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-64 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="p-4 text-center text-xs text-text-muted">No commands found</div>
          ) : (
            filteredCommands.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    onAction(cmd.id);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-elevated text-text-primary hover:text-brand-primary cursor-pointer transition-colors text-xs font-bold"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-brand-primary" />
                    <span>{cmd.label}</span>
                  </div>
                  <kbd className="px-2 py-0.5 bg-bg-deep border border-border-main rounded text-[10px] text-text-muted font-normal">
                    {cmd.shortcut}
                  </kbd>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
}
