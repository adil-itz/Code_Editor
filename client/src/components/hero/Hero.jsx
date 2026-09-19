import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles, Terminal, Shield, Zap, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { IDEWorkspace } from '../ide/IDEWorkspace';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 px-3 sm:px-6 lg:px-8 overflow-hidden bg-bg-primary select-none">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] sm:w-[800px] h-[200px] sm:h-[400px] bg-brand-primary/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-5 sm:space-y-6 mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-elevated border border-border-main text-[10px] sm:text-xs font-mono font-medium text-text-secondary shadow-xs hover:border-brand-primary/40 transition-colors max-w-full"
          >
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse shrink-0" />
            <span className="text-text-primary truncate">BROWSER-NATIVE DEVELOPMENT ENVIRONMENT</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-text-primary leading-[1.1]"
          >
            Your code. <br />
            Your workspace. <br />
            <span className="bg-gradient-to-r from-text-primary via-text-primary to-brand-primary bg-clip-text text-transparent">
              Anywhere.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-lg lg:text-xl text-text-secondary max-w-2xl font-sans leading-relaxed px-2"
          >
            A high-performance browser IDE engineered for modern developers. Write, execute, preview, and collaborate with zero local configuration.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-2 w-full sm:w-auto px-4 sm:px-0"
          >
            <Link to="/workspace" className="w-full sm:w-auto">
              <Button size="lg" icon={ArrowUpRight} iconPosition="right" className="font-semibold text-xs sm:text-sm w-full justify-center">
                Open Workspace
              </Button>
            </Link>
            <Link to="/editor" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="text-xs sm:text-sm w-full justify-center">
                Explore Editor Scratchpad
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-2 sm:pt-4 text-[10px] sm:text-xs font-mono text-text-muted uppercase tracking-wider"
          >
            <span>NO INSTALLATION</span>
            <span className="text-brand-primary font-bold">•</span>
            <span>MULTI-LANGUAGE</span>
            <span className="text-brand-primary font-bold">•</span>
            <span>INSTANT EXECUTION</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative px-1 sm:px-0"
        >
          <IDEWorkspace interactive={true} initialCount={7} />
        </motion.div>
      </div>
    </section>
  );
}
