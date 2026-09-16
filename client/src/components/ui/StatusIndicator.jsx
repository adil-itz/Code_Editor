import React from 'react';

export function StatusIndicator({ status = 'saved', label }) {
  const statusConfig = {
    saved: { color: 'bg-status-success', text: 'Saved' },
    running: { color: 'bg-brand-primary animate-ping', text: 'Running...' },
    live: { color: 'bg-status-success animate-pulse', text: 'LIVE' },
    error: { color: 'bg-status-error', text: 'Error' },
    modified: { color: 'bg-status-warning', text: 'Modified' }
  };

  const current = statusConfig[status] || statusConfig.saved;

  return (
    <div className="inline-flex items-center gap-1.5 text-xs font-mono text-text-muted">
      <span className={`w-2 h-2 rounded-full ${current.color}`} />
      <span>{label || current.text}</span>
    </div>
  );
}
