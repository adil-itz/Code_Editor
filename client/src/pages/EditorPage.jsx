import React from 'react';
import { OnlineCodeEditor } from '../components/ide/OnlineCodeEditor';
import { Code2, Sparkles } from 'lucide-react';

export function EditorPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold font-mono text-text-primary flex items-center gap-2">
              <Code2 className="w-6 h-6 text-brand-primary" />
              <span>Online Code Editor & Sandbox</span>
            </h1>
            <p className="text-xs font-mono text-text-muted">
              Real-time multi-language syntax highlighting, live code execution, and web preview sandbox.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-brand-primary text-xs font-mono font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive IDE</span>
          </span>
        </div>

        <OnlineCodeEditor />

      </div>
    </div>
  );
}
