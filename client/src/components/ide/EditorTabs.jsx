import React from 'react';
import { X, FileCode, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export function EditorTabs({ openFiles, activeFile, onSelectTab, onCloseTab }) {
  const getIcon = (filename) => {
    if (filename.endsWith('.css')) return <FileCode className="w-3.5 h-3.5 text-brand-primary" />;
    if (filename.endsWith('.json')) return <FileText className="w-3.5 h-3.5 text-amber-400" />;
    return <FileCode className="w-3.5 h-3.5 text-blue-400" />;
  };

  return (
    <div className="flex items-center bg-bg-deep border-b border-border-main overflow-x-auto custom-scrollbar select-none">
      {openFiles.map((file) => {
        const isActive = activeFile === file;
        return (
          <div
            key={file}
            onClick={() => onSelectTab(file)}
            className={`relative flex items-center gap-2 px-3 py-2 text-xs font-mono border-r border-border-subtle cursor-pointer transition-colors ${
              isActive 
                ? 'bg-surface text-text-primary font-medium' 
                : 'text-text-muted hover:text-text-secondary hover:bg-surface-elevated/40'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabBorder"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-primary"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            {getIcon(file)}
            <span>{file}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCloseTab(file);
              }}
              className="p-0.5 rounded hover:bg-surface-secondary text-text-muted hover:text-text-primary transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
