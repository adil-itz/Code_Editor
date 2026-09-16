import React from 'react';
import { Terminal as TerminalIcon, CheckCircle2, Play, RefreshCw } from 'lucide-react';

export function Terminal({ logs = [], isRunning = false }) {
  const defaultLogs = [
    { text: 'developer@workspace ~/my-project $ npm run dev', type: 'command' },
    { text: 'Starting Vite dev server...', type: 'info' },
    { text: '✓ 342 modules transformed', type: 'success' },
    { text: '✓ Compiled successfully in 84ms', type: 'success' },
    { text: 'Local: http://localhost:5173/', type: 'url' },
    { text: 'Ready in 120ms.', type: 'info' }
  ];

  const activeLogs = logs.length > 0 ? logs : defaultLogs;

  return (
    <div className="h-36 bg-bg-deep border-t border-border-main flex flex-col font-mono text-xs select-none">
      <div className="px-3 py-1.5 bg-surface-elevated border-b border-border-subtle flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3.5 h-3.5 text-brand-primary" />
          <span className="font-semibold text-text-primary">Terminal</span>
          <span className="text-text-muted">bash</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-status-success text-[10px]">
            <CheckCircle2 className="w-3 h-3" /> Port 5173
          </span>
          {isRunning && (
            <span className="flex items-center gap-1 text-brand-primary text-[10px] animate-pulse">
              <RefreshCw className="w-3 h-3 animate-spin" /> Compiling...
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 p-3 overflow-y-auto space-y-1 custom-scrollbar text-[11px]">
        {activeLogs.map((log, idx) => (
          <div key={idx} className="flex items-start gap-2">
            {log.type === 'command' && (
              <span className="text-brand-primary font-bold">❯</span>
            )}
            <span className={`leading-relaxed ${
              log.type === 'success' ? 'text-status-success font-medium' :
              log.type === 'command' ? 'text-text-primary font-semibold' :
              log.type === 'url' ? 'text-blue-400 underline cursor-pointer' :
              log.type === 'error' ? 'text-status-error font-medium' :
              'text-text-secondary'
            }`}>
              {log.text}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-2 text-text-muted">
          <span className="text-brand-primary font-bold">❯</span>
          <span className="inline-block w-2 h-3.5 bg-brand-primary animate-cursor" />
        </div>
      </div>
    </div>
  );
}
