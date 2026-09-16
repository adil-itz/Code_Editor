import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Box, Zap } from 'lucide-react';

export function AutocompletePopup({ visible = true, activeIndex = 0 }) {
  if (!visible) return null;

  const suggestions = [
    { name: 'useState', type: 'hook', desc: 'Returns stateful value & updater' },
    { name: 'useEffect', type: 'hook', desc: 'Accepts imperatively executed code' },
    { name: 'useMemo', type: 'hook', desc: 'Returns memoized value' },
    { name: 'useCallback', type: 'hook', desc: 'Returns memoized callback' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -4, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.15 }}
      className="absolute top-24 left-44 z-30 w-64 bg-surface-elevated/95 backdrop-blur-md border border-brand-primary/30 rounded-lg shadow-xl shadow-black/40 overflow-hidden font-mono text-xs"
    >
      <div className="px-2.5 py-1.5 bg-bg-deep border-b border-border-subtle flex items-center justify-between text-[10px] text-text-muted">
        <span className="flex items-center gap-1 font-semibold text-brand-primary">
          <Zap className="w-3 h-3" /> React Hooks
        </span>
        <span>Press ↵ to insert</span>
      </div>
      <div className="p-1 space-y-0.5">
        {suggestions.map((item, idx) => {
          const isSelected = idx === activeIndex;
          return (
            <div
              key={item.name}
              className={`flex items-center justify-between px-2 py-1.5 rounded transition-colors ${
                isSelected 
                  ? 'bg-brand-primary/15 text-brand-primary font-medium border border-brand-primary/30' 
                  : 'text-text-secondary hover:bg-surface-secondary'
              }`}
            >
              <div className="flex items-center gap-2">
                <Box className={`w-3.5 h-3.5 ${isSelected ? 'text-brand-primary' : 'text-blue-400'}`} />
                <span>{item.name}</span>
              </div>
              <span className="text-[10px] text-text-muted">{item.type}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
