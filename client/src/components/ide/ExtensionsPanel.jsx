import React, { useState } from 'react';
import { 
  Search, 
  Blocks, 
  Power, 
  Sparkles, 
  Code2, 
  AlignLeft, 
  Star, 
  Zap
} from 'lucide-react';

const EXTENSIONS_CATALOG = [
  {
    id: 'auto-indent',
    name: 'Auto Indentation Engine',
    publisher: 'DevSpace Core',
    version: '1.4.0',
    description: 'Automatically aligns code blocks, indentations, and matching brackets as you type or press Enter.',
    rating: 4.9,
    icon: AlignLeft,
    iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
  },
  {
    id: 'code-formatter',
    name: 'Code Formatter',
    publisher: 'DevSpace Tooling',
    version: '2.1.0',
    description: 'Standardize and format source code on type, on paste, or via Shift+Alt+F keyboard shortcut.',
    rating: 5.0,
    icon: Code2,
    iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  },
  {
    id: 'autocomplete',
    name: 'Auto-Completion & Suggestions',
    publisher: 'DevSpace AI Labs',
    version: '3.0.2',
    description: 'Context-aware autocompletion dropdown, keyword suggestions, parameter hints, and code snippets.',
    rating: 4.9,
    icon: Sparkles,
    iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  }
];

export function ExtensionsPanel({ enabledExtensions = {}, onToggleExtension }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExtensions = EXTENSIONS_CATALOG.filter(ext => {
    return ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           ext.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const enabledCount = Object.keys(enabledExtensions).filter(key => enabledExtensions[key] !== false).length;

  return (
    <div className="w-80 bg-bg-deep border-r border-border-main flex flex-col h-full select-none shrink-0 font-sans">
      <div className="p-3.5 border-b border-border-main flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Blocks className="w-4 h-4 text-brand-primary" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary">Extensions</h2>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary font-mono font-semibold border border-brand-primary/20">
            {enabledCount} Active
          </span>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Extensions..."
            className="w-full bg-surface-elevated border border-border-main rounded-lg pl-8 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary transition-all font-mono"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
        {filteredExtensions.length === 0 ? (
          <div className="p-8 text-center text-text-muted text-xs font-mono space-y-2">
            <Blocks className="w-8 h-8 mx-auto opacity-30" />
            <p>No extensions match search.</p>
          </div>
        ) : (
          filteredExtensions.map((ext) => {
            const Icon = ext.icon;
            const isEnabled = enabledExtensions[ext.id] !== false;

            return (
              <div
                key={ext.id}
                className={`p-3 rounded-xl border transition-all ${
                  isEnabled
                    ? 'bg-surface border-border-main hover:border-brand-primary/40'
                    : 'bg-surface/40 border-border-main/50 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${ext.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-xs font-bold text-text-primary truncate">{ext.name}</h3>
                      <span className="text-[10px] text-text-muted font-mono">{ext.version}</span>
                    </div>

                    <p className="text-[11px] text-text-muted mt-0.5 line-clamp-2 leading-relaxed">
                      {ext.description}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-border-main/40 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] text-text-muted font-mono">
                        <span className="flex items-center gap-0.5 text-amber-400">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {ext.rating}
                        </span>
                        <span>•</span>
                        <span>{ext.publisher}</span>
                      </div>

                      <button
                        onClick={() => onToggleExtension(ext.id)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                          isEnabled
                            ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30'
                            : 'bg-surface-elevated text-text-muted hover:text-text-primary hover:bg-surface border border-border-main'
                        }`}
                      >
                        <Power className={`w-3 h-3 ${isEnabled ? 'text-emerald-400' : 'text-text-muted'}`} />
                        {isEnabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-3 bg-surface/50 border-t border-border-main text-[11px] text-text-muted font-mono flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-brand-primary" />
          VS Code Compatible
        </span>
        <span className="text-[10px]">DevSpace v2.4</span>
      </div>
    </div>
  );
}
