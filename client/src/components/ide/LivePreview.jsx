import React from 'react';
import { Globe, RotateCw, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function LivePreview({ count = 7, onIncrement }) {
  return (
    <div className="w-80 bg-surface border-l border-border-main flex flex-col h-full overflow-hidden select-none font-sans">
      <div className="px-3 py-2 bg-bg-deep border-b border-border-main flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 flex-1 bg-surface px-2 py-1 rounded border border-border-subtle font-mono text-[11px] text-text-muted truncate">
          <Globe className="w-3 h-3 text-status-success shrink-0" />
          <span className="truncate text-text-secondary">http://localhost:5173</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1 text-[10px] font-mono font-medium text-status-success px-1.5 py-0.5 rounded bg-status-success/10 border border-status-success/20">
            <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" /> LIVE
          </span>
          <button className="p-1 text-text-muted hover:text-text-primary rounded hover:bg-surface-elevated transition-colors cursor-pointer">
            <RotateCw className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 bg-surface-elevated flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        
        <motion.div 
          key={count}
          initial={{ scale: 0.95, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 space-y-3 bg-surface p-6 rounded-xl border border-border-main shadow-lg w-full max-w-[240px]"
        >
          <div className="inline-flex p-2 rounded-lg bg-brand-primary/10 text-brand-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-text-primary tracking-tight">Hello, developer.</h2>
          <p className="text-xs text-text-secondary">Browser execution is active.</p>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onIncrement}
            className="w-full py-2 px-4 bg-brand-primary hover:bg-brand-deep text-white font-mono text-xs font-semibold rounded-lg shadow-sm shadow-brand-primary/30 transition-all cursor-pointer"
          >
            Count: {count}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
