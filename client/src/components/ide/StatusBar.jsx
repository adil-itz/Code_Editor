import React from 'react';
import { GitBranch, Check, AlertTriangle, XCircle } from 'lucide-react';

export function StatusBar({ 
  activeFile, 
  diagnostics = [], 
  isSaving = false, 
  isBottomOpen = true, 
  onToggleBottom, 
  onSelectProblemsTab,
  branch = 'main'
}) {
  const language = activeFile?.language || (activeFile?.name ? activeFile.name.split('.').pop() : 'JavaScript');
  const errorCount = diagnostics.filter(d => d.severity === 8).length;
  const warningCount = diagnostics.filter(d => d.severity === 4).length;

  return (
    <div className="h-6 bg-bg-deep border-t border-border-main px-3 flex items-center justify-between font-mono text-[10px] text-text-muted select-none">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
          <GitBranch className="w-3 h-3 text-brand-primary" />
          <span>{branch}</span>
        </div>

        <button 
          onClick={onSelectProblemsTab} 
          className="flex items-center gap-2 hover:text-text-primary transition-colors cursor-pointer"
          title="Click to view Problems"
        >
          <span className={`flex items-center gap-1 ${errorCount > 0 ? 'text-status-error font-bold' : ''}`}>
            <XCircle className="w-3 h-3 text-status-error" />
            <span>{errorCount}</span>
          </span>
          <span className={`flex items-center gap-1 ${warningCount > 0 ? 'text-status-warning' : ''}`}>
            <AlertTriangle className="w-3 h-3 text-status-warning" />
            <span>{warningCount}</span>
          </span>
        </button>

        <div className="flex items-center gap-1 text-status-success">
          {isSaving ? (
            <span className="text-status-warning animate-pulse">Saving...</span>
          ) : (
            <>
              <Check className="w-3 h-3" />
              <span className="hidden sm:inline">Saved</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {onToggleBottom && (
          <button 
            onClick={onToggleBottom}
            className="hover:text-brand-primary transition-colors cursor-pointer hidden sm:inline"
          >
            {isBottomOpen ? 'Hide Terminal' : 'Show Terminal'}
          </button>
        )}
        <span className="px-1.5 py-0.5 rounded bg-surface-elevated text-brand-primary font-semibold border border-border-subtle uppercase">
          {language}
        </span>
      </div>
    </div>
  );
}
