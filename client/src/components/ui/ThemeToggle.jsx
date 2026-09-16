import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const options = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'system', label: 'System', icon: Monitor },
    { id: 'dark', label: 'Dark', icon: Moon },
  ];

  return (
    <div className="inline-flex items-center p-1 rounded-lg bg-secondary-bg border border-border">
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = theme === option.id;
        return (
          <button
            key={option.id}
            onClick={() => setTheme(option.id)}
            title={`Switch to ${option.label} theme`}
            aria-label={`Switch to ${option.label} theme`}
            className={`flex items-center justify-center p-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
              isActive
                ? 'bg-surface text-brand-primary shadow-xs border border-border/50'
                : 'text-secondary-text hover:text-foreground hover:bg-surface/50'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="sr-only">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
