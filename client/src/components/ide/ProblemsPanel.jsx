import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2, ChevronRight } from 'lucide-react';

export function ProblemsPanel({ diagnostics = [], activeFile, onSelectProblem }) {
  if (!diagnostics || diagnostics.length === 0) {
    return (
      <div className="h-full bg-bg-deep flex flex-col items-center justify-center p-6 text-center font-mono text-text-muted select-none space-y-2">
        <div className="w-10 h-10 rounded-full bg-status-success/10 border border-status-success/30 flex items-center justify-center text-status-success mb-1">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <span className="text-sm font-bold text-text-primary">No Problems Found</span>
        <p className="text-xs text-text-muted max-w-sm">
          No syntax or structural errors detected in <span className="text-text-primary">{activeFile?.name || 'current file'}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full bg-bg-deep flex flex-col font-mono text-xs overflow-hidden select-none">
      <div className="px-3 py-1.5 bg-surface border-b border-border-main flex items-center justify-between text-text-secondary text-[11px] font-bold">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-status-error" />
          <span>Active Diagnostics ({diagnostics.length})</span>
        </div>
        <span className="text-text-muted">{activeFile?.name || 'Current File'}</span>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-border-subtle custom-scrollbar">
        {diagnostics.map((diag, index) => {
          const isError = diag.severity === 8 || diag.severity === 'error';
          const isWarning = diag.severity === 4 || diag.severity === 'warning';

          return (
            <div
              key={index}
              onClick={() => onSelectProblem && onSelectProblem(diag)}
              className="p-2.5 hover:bg-surface-elevated flex items-start justify-between gap-3 cursor-pointer transition-colors group"
            >
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                {isError ? (
                  <AlertCircle className="w-4 h-4 text-status-error shrink-0 mt-0.5" />
                ) : isWarning ? (
                  <AlertTriangle className="w-4 h-4 text-status-warning shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                )}

                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="text-text-primary font-semibold text-xs leading-relaxed break-words group-hover:text-brand-primary transition-colors">
                    {diag.message}
                  </div>
                  <div className="text-[11px] text-text-muted flex items-center gap-2">
                    <span className="text-text-secondary font-mono">
                      [Line {diag.startLineNumber}, Col {diag.startColumn}]
                    </span>
                    <span>•</span>
                    <span className="capitalize">{diag.owner || 'syntax-checker'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-text-muted group-hover:text-text-primary shrink-0 pt-0.5">
                <span className="text-[10px] font-bold underline">Jump</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
