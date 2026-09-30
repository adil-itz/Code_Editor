import React from 'react';
import { Files, Search, GitBranch, PlayCircle, Blocks, Settings, Sparkles } from 'lucide-react';

export function ActivityBar({ activeTab, onTabChange, isSidebarOpen = true, onOpenSettings, onOpenAIAssistant }) {
  const navItems = [
    { id: 'explorer', label: 'Explorer', icon: Files },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'extensions', label: 'Extensions', icon: Blocks },
    { id: 'ai-assistant', label: 'Groq AI Assistant', icon: Sparkles, isAI: true },
    { id: 'source-control', label: 'Source Control', icon: GitBranch, disabled: true },
    { id: 'debug', label: 'Run & Debug', icon: PlayCircle, disabled: true }
  ];

  return (
    <div className="w-12 bg-bg-deep border-r border-border-main flex flex-col justify-between items-center py-3 select-none z-10 shrink-0">
      <div className="flex flex-col items-center gap-2 w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id && isSidebarOpen;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.disabled) return;
                if (item.id === 'ai-assistant' && onOpenAIAssistant) {
                  onOpenAIAssistant();
                } else {
                  onTabChange(item.id);
                }
              }}
              disabled={item.disabled}
              title={item.disabled ? `${item.label} (Coming Soon)` : item.label}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative cursor-pointer ${
                isActive 
                  ? item.isAI
                    ? 'text-purple-400 bg-purple-500/15 border border-purple-500/40 shadow-xs shadow-purple-500/20'
                    : 'text-brand-primary bg-surface border border-border-main shadow-xs' 
                  : item.disabled
                    ? 'text-text-muted/30 cursor-not-allowed'
                    : item.isAI
                      ? 'text-purple-400/80 hover:text-purple-300 hover:bg-purple-500/10'
                      : 'text-text-muted hover:text-text-primary hover:bg-surface-elevated'
              }`}
            >
              <Icon className={`w-5 h-5 ${item.isAI ? 'animate-pulse' : ''}`} />
              {isActive && (
                <div className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full ${item.isAI ? 'bg-purple-500' : 'bg-brand-primary'}`} />
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={onOpenSettings}
        title="Settings & Commands"
        className="w-10 h-10 rounded-xl flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors cursor-pointer"
      >
        <Settings className="w-5 h-5" />
      </button>
    </div>
  );
}
