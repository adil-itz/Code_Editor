import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  onClick, 
  icon: Icon,
  iconPosition = 'right',
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer";
  
  const variants = {
    primary: "bg-brand-primary hover:bg-brand-deep text-white shadow-sm shadow-brand-primary/20 hover:shadow-brand-primary/40 border border-brand-primary/30",
    secondary: "bg-surface-elevated hover:bg-surface-secondary text-text-primary border border-border-main hover:border-brand-primary/30 shadow-xs",
    ghost: "bg-transparent hover:bg-surface-elevated text-text-secondary hover:text-text-primary",
    outline: "bg-transparent border border-border-main hover:border-brand-primary/40 text-text-primary hover:bg-surface-elevated/50"
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2 gap-2",
    lg: "text-base px-5 py-2.5 gap-2.5"
  };

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ y: 1, scale: 0.98 }}
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      onClick={onClick}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 transition-transform duration-200" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />}
    </motion.button>
  );
}
