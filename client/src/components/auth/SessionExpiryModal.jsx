import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle, Save, RefreshCw, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function SessionExpiryModal() {
  const { 
    isExpiryModalOpen, 
    sessionTimeRemaining, 
    extendSession, 
    logout, 
    triggerAutoSave 
  } = useAuth();

  if (!isExpiryModalOpen) return null;

  const seconds = Math.max(0, sessionTimeRemaining);
  const formattedSeconds = String(seconds % 60).padStart(2, '0');
  const formattedMinutes = String(Math.floor(seconds / 60)).padStart(2, '0');

  const handleLogoutNow = () => {
    triggerAutoSave();
    logout('Session ended by user before expiration. IDE workspace saved.');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-surface border border-status-warning/40 rounded-2xl shadow-2xl shadow-black/90 overflow-hidden font-sans"
        >
          <div className="h-1.5 bg-gradient-to-r from-status-warning via-brand-primary to-status-warning animate-pulse" />

          <div className="px-6 py-4 bg-bg-deep border-b border-border-main flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-status-warning/15 border border-status-warning/40 flex items-center justify-center text-status-warning">
                <AlertTriangle className="w-4 h-4 animate-bounce" />
              </div>
              <div>
                <h3 className="font-mono font-bold text-sm tracking-tight text-text-primary">
                  Session Expiry Notice
                </h3>
                <p className="text-[11px] font-mono text-text-muted">
                  Automatic Logout Safeguard
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-status-warning/10 border border-status-warning/30 text-status-warning text-xs font-mono font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>{formattedMinutes}:{formattedSeconds}</span>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="p-4 rounded-xl bg-bg-deep border border-border-main flex flex-col items-center justify-center text-center space-y-1">
              <span className="text-xs font-mono text-text-muted uppercase tracking-wider">
                Session Expires In
              </span>
              <div className="text-4xl font-mono font-extrabold text-status-warning tracking-widest py-1">
                {formattedMinutes}:{formattedSeconds}
              </div>
              <p className="text-[11px] font-mono text-text-secondary max-w-xs">
                Your session will expire after 5 minutes of security duration.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-brand-primary/10 border border-brand-primary/30 flex items-start gap-2.5 text-xs font-mono text-brand-primary">
              <Save className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold block">IDE Auto-Save Active</span>
                <span className="text-[11px] text-text-secondary leading-tight block">
                  Any open code editor files and workspace changes will be automatically saved before session termination.
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
              <button
                onClick={extendSession}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-brand-primary hover:bg-brand-hover text-bg-deep font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-brand-primary/20"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Extend Session (+5 Mins)</span>
              </button>

              <button
                onClick={handleLogoutNow}
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-surface-elevated hover:bg-surface border border-border-main text-status-error font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout Now</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
