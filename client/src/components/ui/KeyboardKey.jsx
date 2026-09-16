import React from 'react';
import { motion } from 'framer-motion';

export function KeyboardKey({ label, subLabel, isPressed, onClick, size = "md" }) {
  const sizeClasses = {
    sm: "px-2 py-1 text-xs min-w-[28px] h-[28px]",
    md: "px-3 py-1.5 text-xs min-w-[36px] h-[36px]",
    lg: "px-4 py-2 text-sm min-w-[44px] h-[44px]"
  };

  return (
    <motion.button
      onClick={onClick}
      animate={isPressed ? { y: 2, boxShadow: "0 1px 0 0 rgba(0,0,0,0.5)" } : { y: 0, boxShadow: "0 3px 0 0 rgba(0,0,0,0.4)" }}
      transition={{ duration: 0.08 }}
      className={`relative inline-flex flex-col items-center justify-center font-mono font-medium rounded-md border border-border-main bg-surface-elevated text-text-primary active:bg-surface-secondary cursor-pointer select-none ${sizeClasses[size]} ${isPressed ? 'border-brand-primary/60 text-brand-primary bg-brand-primary/10' : ''}`}
    >
      <span>{label}</span>
      {subLabel && <span className="text-[9px] text-text-muted font-sans leading-none mt-0.5">{subLabel}</span>}
    </motion.button>
  );
}
