import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Share2, Settings, Terminal as TerminalIcon, Sparkles, LayoutGrid, Check, RefreshCw } from 'lucide-react';
import { FileExplorer } from './FileExplorer';
import { EditorTabs } from './EditorTabs';
import { Editor } from './Editor';
import { Terminal } from './Terminal';
import { LivePreview } from './LivePreview';
import { StatusBar } from './StatusBar';
import { AutocompletePopup } from './AutocompletePopup';

export function IDEWorkspace({ interactive = true, initialCount = 7 }) {
  const [activeFile, setActiveFile] = useState('App.tsx');
  const [openFiles, setOpenFiles] = useState(['App.tsx', 'main.tsx', 'styles.css']);
  const [count, setCount] = useState(initialCount);
  const [isRunning, setIsRunning] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(true);
  const [autocompleteIdx, setAutocompleteIdx] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [activePanel, setActivePanel] = useState('preview');

  const handleRun = () => {
    setIsRunning(true);
    setTerminalLogs([
      { text: 'developer@workspace ~/my-project $ npm run build && npm run start', type: 'command' },
      { text: 'Building production bundle...', type: 'info' },
      { text: '✓ 14 assets compiled in 32ms', type: 'success' },
      { text: '✓ WebContainer instance initialized', type: 'success' },
      { text: 'Listening on http://localhost:5173', type: 'url' }
    ]);
    setTimeout(() => {
      setIsRunning(false);
      setCount(prev => prev + 1);
    }, 600);
  };

  const handleSelectFile = (file) => {
    if (!openFiles.includes(file)) {
      setOpenFiles(prev => [...prev, file]);
    }
    setActiveFile(file);
  };

  const handleCloseTab = (file) => {
    const nextFiles = openFiles.filter(f => f !== file);
    setOpenFiles(nextFiles);
    if (activeFile === file && nextFiles.length > 0) {
      setActiveFile(nextFiles[nextFiles.length - 1]);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto rounded-xl bg-surface border border-border-main shadow-2xl shadow-black/60 overflow-hidden font-sans flex flex-col h-[680px]">
      <div className="h-11 bg-bg-deep border-b border-border-main px-4 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-status-error/80 border border-status-error inline-block" />
            <span className="w-3 h-3 rounded-full bg-status-warning/80 border border-status-warning inline-block" />
            <span className="w-3 h-3 rounded-full bg-status-success/80 border border-status-success inline-block" />
          </div>
          <div className="h-4 w-[1px] bg-border-subtle" />
          <div className="flex items-center gap-2 font-mono text-xs text-text-secondary">
            <span className="font-semibold text-text-primary">DEVSPACE</span>
            <span className="text-text-muted">/</span>
            <span className="text-text-primary">my-project</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-surface-elevated text-brand-primary border border-border-subtle">
              main
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 bg-brand-primary hover:bg-brand-deep disabled:opacity-50 text-white font-mono text-xs font-semibold rounded-md shadow-xs shadow-brand-primary/30 transition-all cursor-pointer"
          >
            {isRunning ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{isRunning ? 'RUNNING...' : 'Run'}</span>
          </button>
          
          <button className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-elevated rounded-md transition-colors cursor-pointer">
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          <button className="p-1.5 text-text-muted hover:text-text-primary hover:bg-surface-elevated rounded-md transition-colors cursor-pointer">
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        <FileExplorer activeFile={activeFile} onSelectFile={handleSelectFile} />

        <div className="flex-1 flex flex-col overflow-hidden relative">
          <EditorTabs
            openFiles={openFiles}
            activeFile={activeFile}
            onSelectTab={setActiveFile}
            onCloseTab={handleCloseTab}
          />

          <div className="flex-1 flex overflow-hidden relative">
            <Editor
              activeFile={activeFile}
              count={count}
              showAutocomplete={showAutocomplete}
              autocompleteIndex={autocompleteIdx}
            />

            {showAutocomplete && (
              <AutocompletePopup visible={showAutocomplete} activeIndex={autocompleteIdx} />
            )}

            <div className="hidden md:block">
              <LivePreview count={count} onIncrement={() => setCount(prev => prev + 1)} />
            </div>
          </div>

          <Terminal logs={terminalLogs} isRunning={isRunning} />
        </div>
      </div>

      <StatusBar branch="main" language={activeFile.endsWith('.css') ? 'CSS' : 'TypeScript'} />
    </div>
  );
}
