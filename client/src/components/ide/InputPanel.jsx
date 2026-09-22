import React from 'react';
import { Trash2, Sparkles } from 'lucide-react';

export function InputPanel({ stdin, onChangeStdin }) {
  return (
    <div className="h-full bg-bg-deep p-4 flex flex-col font-mono text-xs">
      <div className="pb-2.5 flex items-center justify-between text-text-muted">
        <div className="flex items-center gap-2">
          <span className="font-bold text-text-primary uppercase tracking-wider text-[11px]">Standard Input (stdin)</span>
          {stdin && (
            <span className="text-[10px] bg-brand-primary/10 border border-brand-primary/30 text-brand-primary px-2 py-0.5 rounded font-bold">
              {stdin.split('\n').filter(Boolean).length} input line(s) set
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onChangeStdin('')}
            disabled={!stdin}
            className="flex items-center gap-1 text-[11px] text-text-muted hover:text-status-error transition-colors disabled:opacity-40 cursor-pointer"
            title="Clear stdin buffer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      <textarea
        value={stdin}
        onChange={(e) => onChangeStdin(e.target.value)}
        placeholder="Enter standard input values line by line (e.g. name, numbers)...\nOr simply run your code and type inputs interactively in Output or Terminal when prompted!"
        className="flex-1 w-full p-3 bg-surface border border-border-main rounded-xl text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-brand-primary font-mono text-xs resize-none"
      />

      <div className="pt-2 text-[11px] text-brand-primary flex items-center gap-1.5 opacity-90">
        <Sparkles className="w-3.5 h-3.5 shrink-0" />
        <span>Interactive Mode Enabled: You can also enter inputs live in Output or Terminal while running code!</span>
      </div>
    </div>
  );
}

