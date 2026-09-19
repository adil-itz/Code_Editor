import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, RefreshCw, Eye, Sparkles, Layers, Check } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function PreviewSection() {
  const [themeAccent, setThemeAccent] = useState('#FF5C5C');
  const [previewText, setPreviewText] = useState('Build software faster.');

  const colorOptions = ['#FF5C5C', '#4ADE80', '#60A5FA', '#FBBF24', '#C084FC'];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-border-subtle bg-bg-primary relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-5 space-y-5 sm:space-y-6">
          <Badge variant="accent" dot={true}>SECTION 03 — PREVIEW</Badge>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary leading-tight">
            See the result immediately.
          </h2>
          <p className="text-text-secondary text-sm sm:text-base font-sans leading-relaxed">
            Hot Module Replacement (HMR) synchronized directly with your browser memory. Inspect elements, debug state changes, and preview responsive UI components without leaving your workspace.
          </p>

          <div className="p-4 rounded-xl bg-surface border border-border-main space-y-3">
            <div className="text-xs font-mono font-semibold text-text-muted uppercase">Live State Controls</div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-text-secondary font-mono">Accent Color:</span>
              <div className="flex items-center gap-2">
                {colorOptions.map(color => (
                  <button
                    key={color}
                    onClick={() => setThemeAccent(color)}
                    style={{ backgroundColor: color }}
                    className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${themeAccent === color ? 'scale-125 ring-2 ring-white/50' : 'hover:scale-110'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-xl bg-surface border border-border-main shadow-2xl overflow-hidden">
            <div className="px-4 py-2.5 bg-bg-deep border-b border-border-main flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-text-secondary">
                <Globe className="w-3.5 h-3.5 text-status-success" />
                <span>localhost:5173/preview</span>
              </div>
              <span className="flex items-center gap-1 text-status-success text-[10px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" /> HMR ACTIVE
              </span>
            </div>

            <div className="p-8 bg-surface-elevated min-h-[300px] flex flex-col items-center justify-center text-center space-y-4">
              <motion.div
                key={themeAccent}
                initial={{ scale: 0.9, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-8 rounded-2xl bg-surface border border-border-main shadow-xl max-w-sm w-full space-y-4"
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white mx-auto shadow-md transition-colors"
                  style={{ backgroundColor: themeAccent }}
                >
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-text-primary">{previewText}</h3>
                <p className="text-xs text-text-secondary">Real-time reactive canvas sync.</p>
                <button
                  style={{ backgroundColor: themeAccent }}
                  className="w-full py-2.5 px-4 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  Interactive CTA
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
