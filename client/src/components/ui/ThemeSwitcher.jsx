import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const options = [
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'light', label: 'Light', icon: Sun }
  ];

  return (
    <div className="flex items-center bg-surface border border-border-main p-0.5 rounded-lg shadow-xs">
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = theme === option.id;
        return (
          <button
            key={option.id}
            onClick={() => setTheme(option.id)}
            className={`relative flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors duration-150 cursor-pointer ${
              isActive ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'
            }`}
            aria-label={`Switch to ${option.label} theme`}
          >
            {isActive && (
              <motion.div
                layoutId="activeThemeBg"
                className="absolute inset-0 bg-surface-elevated rounded-md border border-border-main"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Icon className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10 hidden sm:inline">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
