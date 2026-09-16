import React from 'react';
import { Terminal } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border-main bg-bg-deep py-16 px-4 sm:px-6 lg:px-8 font-sans text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
        <div className="col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-brand-primary flex items-center justify-center text-white">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-sm tracking-tight text-text-primary">DEVSPACE</span>
          </div>
          <p className="text-text-muted max-w-sm leading-relaxed">
            The browser-native development environment. Engineered for speed, Raycast-level polish, and zero configuration overhead.
          </p>
        </div>

        <div className="space-y-3">
          <div className="font-mono font-semibold text-text-primary uppercase tracking-wider text-[11px]">Product</div>
          <ul className="space-y-2 text-text-secondary">
            <li><a href="#product" className="hover:text-brand-primary transition-colors">Editor Engine</a></li>
            <li><a href="#editor" className="hover:text-brand-primary transition-colors">Terminal</a></li>
            <li><a href="#languages" className="hover:text-brand-primary transition-colors">Languages</a></li>
            <li><a href="#docs" className="hover:text-brand-primary transition-colors">Documentation</a></li>
          </ul>
        </div>

        <div className="space-y-3">
          <div className="font-mono font-semibold text-text-primary uppercase tracking-wider text-[11px]">Resources</div>
          <ul className="space-y-2 text-text-secondary">
            <li><a href="#" className="hover:text-brand-primary transition-colors">Guides</a></li>
            <li><a href="#" className="hover:text-brand-primary transition-colors">Examples</a></li>
            <li><a href="#" className="hover:text-brand-primary transition-colors">API Reference</a></li>
            <li><a href="#" className="hover:text-brand-primary transition-colors">Changelog</a></li>
          </ul>
        </div>

        <div className="space-y-3">
          <div className="font-mono font-semibold text-text-primary uppercase tracking-wider text-[11px]">Legal</div>
          <ul className="space-y-2 text-text-secondary">
            <li><a href="#" className="hover:text-brand-primary transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-brand-primary transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-brand-primary transition-colors">Security</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-border-subtle pt-8 flex flex-col sm:flex-row items-center justify-between text-text-muted font-mono text-[11px] gap-4">
        <div>© 2026 DEVSPACE. All rights reserved.</div>
        <div className="text-text-secondary">Built for developers.</div>
      </div>
    </footer>
  );
}
