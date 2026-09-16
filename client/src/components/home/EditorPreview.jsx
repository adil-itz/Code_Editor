import React, { useState } from 'react';
import { Play, CheckCircle2, FileCode, Folder, ChevronRight, ChevronDown, Terminal as TerminalIcon, Sparkles, Share2, Circle, Settings, RefreshCw, Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';

export function EditorPreview() {
  const [activeFile, setActiveFile] = useState('App.js');
  const [isRunning, setIsRunning] = useState(false);
  const [runCount, setRunCount] = useState(1);
  const [copied, setCopied] = useState(false);

  const files = {
    'App.js': {
      language: 'javascript',
      lines: [
        { num: 1, content: <><span className="text-purple-500 dark:text-purple-400 font-semibold">import</span> <span className="text-blue-500 dark:text-blue-300">React</span>, &#123; <span className="text-blue-500 dark:text-blue-300">useState</span> &#125; <span className="text-purple-500 dark:text-purple-400 font-semibold">from</span> <span className="text-emerald-600 dark:text-emerald-400">'react'</span>;</> },
        { num: 2, content: '' },
        { num: 3, content: <><span className="text-purple-500 dark:text-purple-400 font-semibold">export default function</span> <span className="text-yellow-600 dark:text-yellow-300 font-semibold">App</span>() &#123;</> },
        { num: 4, content: <><span className="pl-4 text-purple-500 dark:text-purple-400 font-semibold">const</span> [<span className="text-blue-500 dark:text-blue-300">user</span>, <span className="text-blue-500 dark:text-blue-300">setUser</span>] = <span className="text-yellow-600 dark:text-yellow-300">useState</span>(<span className="text-emerald-600 dark:text-emerald-400">'Developer'</span>);</> },
        { num: 5, content: '', isActive: true },
        { num: 6, content: <><span className="pl-4 text-purple-500 dark:text-purple-400 font-semibold">function</span> <span className="text-yellow-600 dark:text-yellow-300">greet</span>(<span className="text-amber-600 dark:text-amber-300">name</span>) &#123;</> },
        { num: 7, content: <><span className="pl-8 text-purple-500 dark:text-purple-400 font-semibold">return</span> <span className="text-emerald-600 dark:text-emerald-400">`🚀 Hello, $&#123;name&#125;! Welcome to Nexus IDE.`</span>;</> },
        { num: 8, content: <><span className="pl-4">&#125;</span></> },
        { num: 9, content: '' },
        { num: 10, content: <><span className="pl-4 text-sky-600 dark:text-sky-400">console</span>.<span className="text-yellow-600 dark:text-yellow-300">log</span>(<span className="text-yellow-600 dark:text-yellow-300">greet</span>(<span className="text-blue-500 dark:text-blue-300">user</span>));</> },
        { num: 11, content: <><span className="pl-4 text-purple-500 dark:text-purple-400 font-semibold">return</span> &lt;<span className="text-brand-primary font-semibold">Workspace</span> <span className="text-cyan-600 dark:text-cyan-400">status</span>=<span className="text-emerald-600 dark:text-emerald-400">"active"</span> /&gt;;</> },
        { num: 12, content: <>&#125;</> }
      ]
    },
    'index.js': {
      language: 'javascript',
      lines: [
        { num: 1, content: <><span className="text-purple-500 dark:text-purple-400 font-semibold">import</span> <span className="text-blue-500 dark:text-blue-300">React</span> <span className="text-purple-500 dark:text-purple-400 font-semibold">from</span> <span className="text-emerald-600 dark:text-emerald-400">'react'</span>;</> },
        { num: 2, content: <><span className="text-purple-500 dark:text-purple-400 font-semibold">import</span> <span className="text-blue-500 dark:text-blue-300">ReactDOM</span> <span className="text-purple-500 dark:text-purple-400 font-semibold">from</span> <span className="text-emerald-600 dark:text-emerald-400">'react-dom/client'</span>;</> },
        { num: 3, content: <><span className="text-purple-500 dark:text-purple-400 font-semibold">import</span> <span className="text-blue-500 dark:text-blue-300">App</span> <span className="text-purple-500 dark:text-purple-400 font-semibold">from</span> <span className="text-emerald-600 dark:text-emerald-400">'./App'</span>;</> },
        { num: 4, content: '' },
        { num: 5, content: <><span className="text-sky-600 dark:text-sky-400">ReactDOM</span>.<span className="text-yellow-600 dark:text-yellow-300">createRoot</span>(<span className="text-sky-600 dark:text-sky-400">document</span>.<span className="text-yellow-600 dark:text-yellow-300">getElementById</span>(<span className="text-emerald-600 dark:text-emerald-400">'root'</span>)).<span className="text-yellow-600 dark:text-yellow-300">render</span>(&lt;<span className="text-brand-primary">App</span> /&gt;);</> }
      ]
    },
    'styles.css': {
      language: 'css',
      lines: [
        { num: 1, content: <><span className="text-yellow-600 dark:text-yellow-300">.editor-container</span> &#123;</> },
        { num: 2, content: <><span className="pl-4 text-cyan-600 dark:text-cyan-400">display</span>: <span className="text-emerald-600 dark:text-emerald-400">flex</span>;</> },
        { num: 3, content: <><span className="pl-4 text-cyan-600 dark:text-cyan-400">background-color</span>: <span className="text-emerald-600 dark:text-emerald-400">var(--surface)</span>;</> },
        { num: 4, content: <><span className="pl-4 text-cyan-600 dark:text-cyan-400">border-radius</span>: <span className="text-emerald-600 dark:text-emerald-400">12px</span>;</> },
        { num: 5, content: <>&#125;</> }
      ]
    }
  };

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setRunCount(prev => prev + 1);
    }, 600);
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden transition-all duration-200">
      <div className="flex items-center justify-between px-4 py-2.5 bg-secondary-bg border-b border-border select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-3">
            <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors"></div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-secondary-text bg-surface px-2.5 py-1 rounded-md border border-border">
            <Folder className="w-3.5 h-3.5 text-brand-primary" />
            <span>my-project</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-status-success bg-status-success/10 px-2 py-0.5 rounded-full border border-status-success/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>Saved</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs font-mono text-secondary-text hover:text-foreground px-2 py-1 rounded bg-surface border border-border transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-status-success" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
          </button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleRun}
            disabled={isRunning}
            icon={isRunning ? RefreshCw : Play}
            className={`font-mono text-xs px-3 py-1 ${isRunning ? 'animate-pulse' : ''}`}
          >
            {isRunning ? 'Running...' : 'Run Code'}
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-[380px] sm:h-[440px]">
        <div className="w-full md:w-56 bg-secondary-bg/60 border-b md:border-b-0 md:border-r border-border p-3 flex-shrink-0 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-mono font-semibold uppercase text-muted-text tracking-wider mb-2.5 px-2 flex items-center justify-between">
              <span>EXPLORER</span>
              <span className="text-[10px] text-brand-primary font-sans">SRC</span>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 px-2 py-1 text-xs text-secondary-text font-mono font-medium">
                <ChevronDown className="w-3.5 h-3.5 text-muted-text" />
                <Folder className="w-3.5 h-3.5 text-brand-primary" />
                <span>src</span>
              </div>
              
              <div className="pl-4 space-y-0.5">
                {Object.keys(files).map((fileName) => {
                  const isActive = activeFile === fileName;
                  return (
                    <button
                      key={fileName}
                      onClick={() => setActiveFile(fileName)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs font-mono transition-colors text-left ${
                        isActive
                          ? 'bg-brand-primary/10 text-brand-primary font-medium border border-brand-primary/20'
                          : 'text-secondary-text hover:text-foreground hover:bg-surface/50'
                      }`}
                    >
                      <FileCode className={`w-3.5 h-3.5 ${isActive ? 'text-brand-primary' : 'text-muted-text'}`} />
                      <span>{fileName}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 pl-2 space-y-1">
                <div className="flex items-center gap-2 px-2 py-1 text-xs font-mono text-muted-text hover:text-secondary-text cursor-pointer">
                  <FileCode className="w-3.5 h-3.5" />
                  <span>package.json</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 text-xs font-mono text-muted-text hover:text-secondary-text cursor-pointer">
                  <FileCode className="w-3.5 h-3.5" />
                  <span>README.md</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:block pt-3 border-t border-border">
            <div className="flex items-center justify-between text-[11px] font-mono text-muted-text px-1">
              <span>Branch: main</span>
              <span className="text-status-success">● Sync</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-surface overflow-hidden">
          <div className="flex items-center bg-secondary-bg border-b border-border overflow-x-auto custom-scrollbar">
            {Object.keys(files).map((fileName) => {
              const isActive = activeFile === fileName;
              return (
                <button
                  key={fileName}
                  onClick={() => setActiveFile(fileName)}
                  className={`flex items-center gap-2 px-4 py-2 border-r border-border text-xs font-mono transition-colors flex-shrink-0 ${
                    isActive
                      ? 'bg-surface text-foreground font-medium border-t-2 border-t-brand-primary'
                      : 'text-secondary-text hover:text-foreground hover:bg-surface/40'
                  }`}
                >
                  <FileCode className={`w-3.5 h-3.5 ${isActive ? 'text-brand-primary' : 'text-muted-text'}`} />
                  <span>{fileName}</span>
                </button>
              );
            })}
          </div>

          <div className="flex-1 p-4 font-mono text-xs sm:text-sm overflow-y-auto custom-scrollbar leading-relaxed bg-surface">
            {files[activeFile].lines.map((line) => (
              <div
                key={line.num}
                className={`flex items-center gap-4 px-2 py-0.5 rounded transition-colors ${
                  line.isActive ? 'bg-brand-primary/10 border-l-2 border-brand-primary' : 'hover:bg-secondary-bg/30'
                }`}
              >
                <span className="w-6 text-right text-muted-text select-none text-[11px]">
                  {line.num}
                </span>
                <span className="flex-1 text-foreground whitespace-pre">
                  {line.content}
                  {line.isActive && (
                    <span className="inline-block w-2 h-4 ml-1 bg-brand-primary animate-cursor vertical-middle"></span>
                  )}
                </span>
              </div>
            ))}
          </div>

          <div className="h-32 sm:h-36 border-t border-border bg-secondary-bg/90 flex flex-col font-mono text-xs">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-secondary-bg text-secondary-text text-[11px]">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-3.5 h-3.5 text-brand-primary" />
                <span className="font-semibold text-foreground">TERMINAL</span>
                <span className="text-muted-text">node v22.4.0</span>
              </div>
              <div className="flex items-center gap-2 text-muted-text text-[10px]">
                <span>Run #{runCount}</span>
                <span>Exit Code 0</span>
              </div>
            </div>
            
            <div className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-1 text-secondary-text">
              <div className="text-muted-text">$ node {activeFile}</div>
              <div className="text-status-success flex items-center gap-1.5">
                <span>✓ Compiled successfully in 14ms</span>
              </div>
              <div className="text-foreground font-semibold pt-1">
                🚀 Hello, Developer! Welcome to Nexus IDE.
              </div>
              {isRunning && (
                <div className="text-brand-accent animate-pulse flex items-center gap-1">
                  <span>Executing process...</span>
                </div>
              )}
              <div className="flex items-center gap-1 pt-1 text-muted-text">
                <span className="text-brand-primary">$</span>
                <span className="w-2 h-3 bg-brand-primary animate-cursor"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-1.5 bg-secondary-bg border-t border-border text-[11px] font-mono text-secondary-text select-none">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-status-success">
            <Circle className="w-2 h-2 fill-current" />
            Ready
          </span>
          <span className="hidden sm:inline">UTF-8</span>
          <span className="text-brand-primary">JavaScript (JSX)</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Ln 5, Col 24</span>
          <span className="hidden sm:inline">Prettier: Active</span>
          <span className="text-muted-text">100% Zoom</span>
        </div>
      </div>
    </div>
  );
}
