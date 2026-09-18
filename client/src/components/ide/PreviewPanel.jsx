import React from 'react';
import { Eye, RefreshCw } from 'lucide-react';

export function PreviewPanel({ htmlContent }) {
  if (!htmlContent) {
    return (
      <div className="h-full bg-bg-deep p-6 flex flex-col items-center justify-center text-center font-mono text-xs text-text-muted space-y-2">
        <Eye className="w-8 h-8 opacity-40 text-brand-primary" />
        <p>Live Web Preview Sandboxed Frame</p>
        <p className="text-[11px] text-text-muted/60">Open an HTML file or run code to preview live rendered HTML/CSS output.</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-white flex flex-col relative overflow-hidden">
      <div className="bg-surface-elevated text-text-secondary px-3 py-1.5 border-b border-border-main font-mono text-[11px] flex items-center justify-between select-none">
        <span className="font-bold flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-brand-primary" />
          <span>Sandboxed Browser Preview</span>
        </span>
        <span className="text-[10px] text-status-success font-bold">iframe Sandbox Active</span>
      </div>
      <iframe
        title="Live Web Preview"
        srcDoc={htmlContent}
        sandbox="allow-scripts allow-modals"
        className="w-full flex-1 border-none bg-white"
      />
    </div>
  );
}
