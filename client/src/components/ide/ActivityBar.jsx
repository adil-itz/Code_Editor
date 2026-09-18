import React from 'react';
import { Files, Search, GitBranch, PlayCircle, Blocks, Settings } from 'lucide-react';

export function ActivityBar({ activeTab, onTabChange }) {
  const navItems = [
    { id: 'explorer', label: 'Explorer', icon: Files },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'source-control', label: 'Source Control', icon: GitBranch, disabled: true },
    { id: 'debug', label: 'Run & Debug', icon: PlayCircle, disabled: true },
    { id: 'extensions', label: 'Extensions', icon: Blocks, disabled: true }
  ];

  return (
    <div className="w-12 bg-bg-deep border-r border-border-main flex flex-col justify-between items-center py-3 select-none z-10 shrink-0">
      <div className="flex flex-col items-center gap-2 w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => !item.disabled && onTabChange(item.id)}
              disabled={item.disabled}
              title={item.disabled ? `${item.label} (Coming Soon)` : item.label}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative cursor-pointer ${
                isActive 
                  ? 'text-brand-primary bg-surface border border-border-main' 
                  : item.disabled
                    ? 'text-text-muted/30 cursor-not-allowed'
                    : 'text-text-muted hover:text-text-primary hover:bg-surface-elevated'
              }`}
            >
              <Icon className="w-5 h-5" />
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-brand-primary rounded-r-full" />
              )}
            </button>
          );
        })}
      </div>

      <button
        title="Settings"
        className="w-10 h-10 rounded-xl flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors cursor-pointer"
      >
        <Settings className="w-5 h-5" />
      </button>
    </div>
  );
}
