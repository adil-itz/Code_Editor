import React, { useState } from 'react';
import { Terminal as TerminalIcon, CheckCircle2, Play, RefreshCw, Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';

export function TerminalPreview() {
  const [activeTab, setActiveTab] = useState('build');
  const [copied, setCopied] = useState(false);

  const logs = {
    build: [
      { type: 'cmd', text: 'developer@workspace ~/my-project $' },
      { type: 'input', text: 'npm run build' },
      { type: 'info', text: '> my-project@1.0.0 build' },
      { type: 'info', text: 'Building application target...' },
      { type: 'success', text: '✓ 142 modules compiled successfully' },
      { type: 'success', text: '✓ Assets generated in /dist' },
      { type: 'success', text: '✓ Build completed in 1.84s' },
      { type: 'prompt', text: 'developer@workspace ~/my-project $' }
    ],
    test: [
      { type: 'cmd', text: 'developer@workspace ~/my-project $' },
      { type: 'input', text: 'npm run test' },
      { type: 'info', text: 'Running Vitest test suite...' },
      { type: 'success', text: '✓ src/App.test.jsx (4 passed)' },
      { type: 'success', text: '✓ src/engine.test.jsx (8 passed)' },
      { type: 'success', text: '✓ 12 tests passed across 2 suites in 410ms' },
      { type: 'prompt', text: 'developer@workspace ~/my-project $' }
    ]
  };

  const handleCopy = () => {
    const text = logs[activeTab].map(l => l.text).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="terminal" className="py-24 bg-background relative scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono font-semibold text-brand-primary uppercase tracking-wider mb-3">
            Browser Shell Runtime
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
            Integrated Web Terminal
          </h2>
          <p className="text-base sm:text-lg text-secondary-text leading-relaxed">
            Full ANSI terminal streaming directly in your browser with full process control, package managers, and build tooling.
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-2xl bg-surface border border-border shadow-2xl overflow-hidden font-mono text-xs sm:text-sm">
          <div className="flex items-center justify-between px-4 py-3 bg-secondary-bg border-b border-border select-none">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4 text-brand-primary" />
                <span className="font-semibold text-foreground">bash — 80x24</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('build')}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  activeTab === 'build' ? 'bg-surface text-brand-primary font-bold border border-border' : 'text-secondary-text hover:text-foreground'
                }`}
              >
                npm run build
              </button>
              <button
                onClick={() => setActiveTab('test')}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  activeTab === 'test' ? 'bg-surface text-brand-primary font-bold border border-border' : 'text-secondary-text hover:text-foreground'
                }`}
              >
                npm run test
              </button>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded text-secondary-text hover:text-foreground hover:bg-secondary-bg border border-border transition-colors ml-2"
                title="Copy terminal output"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-status-success" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="p-6 bg-surface space-y-2 leading-relaxed text-secondary-text min-h-[220px]">
            {logs[activeTab].map((line, idx) => {
              if (line.type === 'cmd') {
                return (
                  <div key={idx} className="flex items-center gap-2 text-muted-text">
                    <span className="text-brand-primary">{line.text}</span>
                  </div>
                );
              }
              if (line.type === 'input') {
                return (
                  <div key={idx} className="font-bold text-foreground pl-4">
                    {line.text}
                  </div>
                );
              }
              if (line.type === 'success') {
                return (
                  <div key={idx} className="text-status-success flex items-center gap-1.5 pl-4">
                    <span>{line.text}</span>
                  </div>
                );
              }
              if (line.type === 'prompt') {
                return (
                  <div key={idx} className="flex items-center gap-2 text-brand-primary pt-2">
                    <span>{line.text}</span>
                    <span className="w-2 h-4 bg-brand-primary animate-cursor"></span>
                  </div>
                );
              }
              return (
                <div key={idx} className="pl-4 text-muted-text">
                  {line.text}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
