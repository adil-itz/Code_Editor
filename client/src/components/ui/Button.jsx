import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconPosition = 'left',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
  };

  const variants = {
    primary: 'bg-brand-primary text-white hover:bg-brand-primary/90 shadow-sm hover:shadow-brand-primary/20 hover:shadow-md active:scale-[0.98]',
    secondary: 'bg-surface-elevated text-foreground border border-border hover:bg-secondary-bg hover:border-brand-primary/40 active:scale-[0.98]',
    outline: 'bg-transparent text-foreground border border-border hover:bg-secondary-bg hover:border-brand-primary/40 active:scale-[0.98]',
    ghost: 'bg-transparent text-secondary-text hover:text-foreground hover:bg-secondary-bg active:scale-[0.98]',
  };

  return (
    <button
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
}
