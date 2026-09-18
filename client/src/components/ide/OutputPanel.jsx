import React from 'react';
import { Cpu, HardDrive, Clock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export function OutputPanel({ output, isRunning, executionTime }) {
  if (isRunning) {
    return (
      <div className="h-full bg-bg-deep p-6 flex items-center justify-center gap-3 font-mono text-xs text-brand-primary">
        <RefreshCw className="w-5 h-5 animate-spin" />
        <span>Executing code on Judge0 compiler engine...</span>
      </div>
    );
  }

  if (!output || output.length === 0) {
    return (
      <div className="h-full bg-bg-deep p-6 flex flex-col items-center justify-center text-center font-mono text-xs text-text-muted space-y-2">
        <Cpu className="w-8 h-8 opacity-40 text-brand-primary" />
        <p>No execution output available yet.</p>
        <p className="text-[11px] text-text-muted/60">Click "▶ Run" to execute code via Judge0.</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-bg-deep p-4 font-mono text-xs overflow-y-auto space-y-3 select-text">
      {executionTime && (
        <div className="flex items-center gap-4 text-[11px] text-text-muted pb-2 border-b border-border-main/50">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-brand-primary" />
            <span>Time: {executionTime} ms</span>
          </span>
          <span className="flex items-center gap-1 text-status-success">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Status: Accepted</span>
          </span>
        </div>
      )}

      {output.map((item, idx) => (
        <div 
          key={idx}
          className={`p-3 rounded-xl border whitespace-pre-wrap leading-relaxed ${
            item.type === 'error' 
              ? 'bg-status-error/10 border-status-error/30 text-status-error' 
              : item.type === 'result'
                ? 'bg-brand-primary/10 border-brand-primary/30 text-text-primary'
                : 'bg-surface border-border-main text-text-primary'
          }`}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
}
