import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Badge({ children, variant = 'default', dot = false, className }) {
  const base = "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border";
  
  const variants = {
    default: "bg-surface-elevated text-text-secondary border-border-main",
    accent: "bg-brand-primary/10 text-brand-primary border-brand-primary/20",
    success: "bg-status-success/10 text-status-success border-status-success/20",
    warning: "bg-status-warning/10 text-status-warning border-status-warning/20",
    muted: "bg-surface text-text-muted border-border-subtle"
  };

  const dotColors = {
    default: "bg-text-secondary",
    accent: "bg-brand-primary",
    success: "bg-status-success",
    warning: "bg-status-warning",
    muted: "bg-text-muted"
  };

  return (
    <span className={twMerge(clsx(base, variants[variant], className))}>
      {dot && <span className={clsx("w-1.5 h-1.5 rounded-full animate-pulse", dotColors[variant])} />}
      {children}
    </span>
  );
}
