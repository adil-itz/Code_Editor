import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles, Terminal, Shield, Zap, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { IDEWorkspace } from '../ide/IDEWorkspace';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-bg-primary">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-elevated border border-border-main text-xs font-mono font-medium text-text-secondary shadow-xs hover:border-brand-primary/40 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            <span className="text-text-primary">BROWSER-NATIVE DEVELOPMENT ENVIRONMENT</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-text-primary leading-[1.08]"
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
            className="text-lg sm:text-xl text-text-secondary max-w-2xl font-sans leading-relaxed"
          >
            A high-performance browser IDE engineered for modern developers. Write, execute, preview, and collaborate with zero local configuration.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-4 pt-2"
          >
            <Button size="lg" icon={ArrowUpRight} iconPosition="right" className="font-semibold text-sm">
              Open Editor
            </Button>
            <Button variant="secondary" size="lg" className="text-sm">
              Explore Documentation
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center gap-6 pt-4 text-xs font-mono text-text-muted uppercase tracking-wider"
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
          className="relative"
        >
          <IDEWorkspace interactive={true} initialCount={7} />
        </motion.div>
      </div>
    </section>
  );
}
