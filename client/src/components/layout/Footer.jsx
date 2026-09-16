import React from 'react';
import { Code2, GitBranch, Globe, Disc as Discord, Shield, Terminal } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary-bg/50 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-border">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                <Code2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg tracking-tight text-foreground font-sans">Nexus IDE</span>
            </div>
            <p className="text-sm text-secondary-text max-w-sm leading-relaxed">
              A modern development environment built for the browser. Write, run, and ship source code from anywhere with zero local setup.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-secondary-text hover:text-foreground hover:border-brand-primary/40 transition-colors" aria-label="GitHub">
                <GitBranch className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-secondary-text hover:text-foreground hover:border-brand-primary/40 transition-colors" aria-label="Community">
                <Globe className="w-4 h-4" />
              </a>
              <a href="https://discord.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-secondary-text hover:text-foreground hover:border-brand-primary/40 transition-colors" aria-label="Discord">
                <Discord className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono mb-4">Product</h3>
            <ul className="space-y-2.5 text-sm text-secondary-text">
              <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#editor" className="hover:text-foreground transition-colors">Editor Preview</a></li>
              <li><a href="#languages" className="hover:text-foreground transition-colors">Language Support</a></li>
              <li><a href="#workflow" className="hover:text-foreground transition-colors">Execution Engine</a></li>
              <li><a href="#terminal" className="hover:text-foreground transition-colors">Web Terminal</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono mb-4">Resources</h3>
            <ul className="space-y-2.5 text-sm text-secondary-text">
              <li><a href="#docs" className="hover:text-foreground transition-colors">Documentation</a></li>
              <li><a href="#api" className="hover:text-foreground transition-colors">API Reference</a></li>
              <li><a href="#guides" className="hover:text-foreground transition-colors">Starter Templates</a></li>
              <li><a href="#changelog" className="hover:text-foreground transition-colors">Changelog</a></li>
              <li><a href="#status" className="hover:text-foreground transition-colors">System Status</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono mb-4">Company & Legal</h3>
            <ul className="space-y-2.5 text-sm text-secondary-text">
              <li><a href="#about" className="hover:text-foreground transition-colors">About</a></li>
              <li><a href="#careers" className="hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="#privacy" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#security" className="hover:text-foreground transition-colors">Security Audit</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-secondary-text font-mono">
          <div>© 2026 Nexus IDE. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5 text-status-success">
              <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
              All Systems Operational
            </span>
            <span>v2.8.0-prod</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
