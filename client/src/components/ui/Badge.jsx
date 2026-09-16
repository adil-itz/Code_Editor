import React from 'react';

export function Badge({ children, variant = 'default', className = '' }) {
  const baseStyles = 'inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full border transition-colors';

  const variants = {
    default: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20 dark:bg-brand-primary/15 dark:border-brand-primary/30',
    accent: 'bg-brand-accent/10 text-brand-accent border-brand-accent/20 dark:bg-brand-accent/15 dark:border-brand-accent/30',
    outline: 'bg-secondary-bg text-secondary-text border-border',
    success: 'bg-status-success/10 text-status-success border-status-success/20',
  };

  return (
    <span className={`${baseStyles} ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}
