import React, { useState } from 'react';
import { ChevronDown, ChevronRight, FileCode, FileText, Folder, FolderOpen, Settings, Package, Layout } from 'lucide-react';

export function FileExplorer({ activeFile, onSelectFile }) {
  const [openFolders, setOpenFolders] = useState({
    root: true,
    src: true,
    components: true
  });

  const toggleFolder = (folderName) => {
    setOpenFolders(prev => ({ ...prev, [folderName]: !prev[folderName] }));
  };

  const getFileIcon = (name) => {
    if (name.endsWith('.tsx') || name.endsWith('.ts')) return <FileCode className="w-3.5 h-3.5 text-blue-400" />;
    if (name.endsWith('.css')) return <FileCode className="w-3.5 h-3.5 text-brand-primary" />;
    if (name.endsWith('.json')) return <Package className="w-3.5 h-3.5 text-amber-400" />;
    if (name.endsWith('.md')) return <FileText className="w-3.5 h-3.5 text-text-muted" />;
    return <FileText className="w-3.5 h-3.5 text-text-secondary" />;
  };

  return (
    <div className="w-44 sm:w-52 bg-bg-deep border-r border-border-main hidden sm:flex flex-col h-full select-none text-xs font-mono shrink-0">
      <div className="px-3 py-2 text-[10px] font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle flex items-center justify-between">
        <span>Explorer</span>
        <span className="text-brand-primary font-bold">my-project</span>
      </div>

      <div className="flex-1 overflow-y-auto p-1.5 custom-scrollbar space-y-0.5">
        <div>
          <button
            onClick={() => toggleFolder('root')}
            className="w-full flex items-center gap-1.5 px-1.5 py-1 rounded text-text-primary hover:bg-surface-elevated/60 transition-colors text-left"
          >
            {openFolders.root ? <ChevronDown className="w-3.5 h-3.5 text-text-muted" /> : <ChevronRight className="w-3.5 h-3.5 text-text-muted" />}
            {openFolders.root ? <FolderOpen className="w-3.5 h-3.5 text-amber-400/80" /> : <Folder className="w-3.5 h-3.5 text-amber-400/80" />}
            <span className="font-medium text-text-primary">my-project</span>
          </button>

          {openFolders.root && (
            <div className="pl-3.5 space-y-0.5 border-l border-border-subtle/50 ml-2 mt-0.5">
              <div>
                <button
                  onClick={() => toggleFolder('src')}
                  className="w-full flex items-center gap-1.5 px-1.5 py-1 rounded text-text-secondary hover:bg-surface-elevated/60 transition-colors text-left"
                >
                  {openFolders.src ? <ChevronDown className="w-3 h-3 text-text-muted" /> : <ChevronRight className="w-3 h-3 text-text-muted" />}
                  {openFolders.src ? <FolderOpen className="w-3.5 h-3.5 text-amber-400/80" /> : <Folder className="w-3.5 h-3.5 text-amber-400/80" />}
                  <span>src</span>
                </button>

                {openFolders.src && (
                  <div className="pl-3.5 space-y-0.5 border-l border-border-subtle/50 ml-2 mt-0.5">
                    {['App.tsx', 'main.tsx', 'styles.css'].map(file => (
                      <button
                        key={file}
                        onClick={() => onSelectFile(file)}
                        className={`w-full flex items-center justify-between px-1.5 py-1 rounded transition-colors text-left ${
                          activeFile === file 
                            ? 'bg-brand-primary/15 text-brand-primary font-medium border-l-2 border-brand-primary' 
                            : 'text-text-secondary hover:bg-surface-elevated/60 hover:text-text-primary'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          {getFileIcon(file)}
                          <span className="truncate">{file}</span>
                        </div>
                        {activeFile === file && <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />}
                      </button>
                    ))}

                    <div>
                      <button
                        onClick={() => toggleFolder('components')}
                        className="w-full flex items-center gap-1.5 px-1.5 py-1 rounded text-text-secondary hover:bg-surface-elevated/60 transition-colors text-left"
                      >
                        {openFolders.components ? <ChevronDown className="w-3 h-3 text-text-muted" /> : <ChevronRight className="w-3 h-3 text-text-muted" />}
                        {openFolders.components ? <FolderOpen className="w-3.5 h-3.5 text-amber-400/80" /> : <Folder className="w-3.5 h-3.5 text-amber-400/80" />}
                        <span>components</span>
                      </button>

                      {openFolders.components && (
                        <div className="pl-3.5 space-y-0.5 border-l border-border-subtle/50 ml-2 mt-0.5">
                          {['Button.tsx', 'Header.tsx'].map(file => (
                            <button
                              key={file}
                              onClick={() => onSelectFile(file)}
                              className={`w-full flex items-center justify-between px-1.5 py-1 rounded transition-colors text-left ${
                                activeFile === file 
                                  ? 'bg-brand-primary/15 text-brand-primary font-medium border-l-2 border-brand-primary' 
                                  : 'text-text-secondary hover:bg-surface-elevated/60 hover:text-text-primary'
                              }`}
                            >
                              <div className="flex items-center gap-1.5">
                                {getFileIcon(file)}
                                <span>{file}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {['package.json', 'README.md', 'vite.config.ts'].map(file => (
                <button
                  key={file}
                  onClick={() => onSelectFile(file)}
                  className={`w-full flex items-center gap-1.5 px-1.5 py-1 rounded transition-colors text-left ${
                    activeFile === file 
                      ? 'bg-brand-primary/15 text-brand-primary font-medium border-l-2 border-brand-primary' 
                      : 'text-text-secondary hover:bg-surface-elevated/60 hover:text-text-primary'
                  }`}
                >
                  {getFileIcon(file)}
                  <span>{file}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
