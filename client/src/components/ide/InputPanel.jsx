import React from 'react';

export function InputPanel({ stdin, onChangeStdin }) {
  return (
    <div className="h-full bg-bg-deep p-4 flex flex-col font-mono text-xs">
      <div className="pb-2 text-text-muted text-[11px] flex items-center justify-between">
        <span className="font-bold text-text-primary uppercase tracking-wider">Standard Input (stdin)</span>
        <span>Provide custom input lines for execution</span>
      </div>
      <textarea
        value={stdin}
        onChange={(e) => onChangeStdin(e.target.value)}
        placeholder="Enter standard input values (e.g. numbers, strings line by line)..."
        className="flex-1 w-full p-3 bg-surface border border-border-main rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary font-mono text-xs resize-none"
      />
    </div>
  );
}
