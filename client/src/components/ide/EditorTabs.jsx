import React from 'react';
import { X, Circle } from 'lucide-react';
import { FileIcon } from './FileIcon';

export function EditorTabs({ openFiles = [], activeFileId, activeFile, dirtyFiles = {}, onSelectTab, onCloseTab, onCloseOthers, onCloseAll }) {
  if (!openFiles || openFiles.length === 0) return null;

  const currentActive = activeFileId || activeFile;

  return (
    <div className="h-9 bg-bg-deep border-b border-border-main flex items-center justify-between px-2 select-none overflow-x-auto font-mono text-xs shrink-0">
      <div className="flex items-center gap-1 overflow-x-auto flex-1 scrollbar-none">
        {openFiles.map((file, idx) => {
          const isString = typeof file === 'string';
          const fileId = isString ? file : (file.id || file._id || file.name);
          const fileName = isString ? file : (file.name || file.path || 'Untitled');
          const fileLang = isString ? '' : (file.language || '');
          const isActive = fileId === currentActive || fileName === currentActive;
          const isDirty = !isString && !!dirtyFiles[fileId];

          return (
            <div
              key={fileId || idx}
              onClick={() => onSelectTab && onSelectTab(fileId)}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-t-lg border-t-2 transition-all cursor-pointer shrink-0 max-w-[180px] ${
                isActive 
                  ? 'bg-surface border-brand-primary text-text-primary font-bold shadow-sm' 
                  : 'bg-bg-deep border-transparent text-text-muted hover:text-text-primary hover:bg-surface-elevated'
              }`}
            >
              <FileIcon filename={fileName} language={fileLang} className="w-3.5 h-3.5" />
              <span className="truncate text-xs">
                {fileName}{isDirty ? ' *' : ''}
              </span>
              {onCloseTab && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(fileId);
                  }}
                  title="Close Tab"
                  className="p-0.5 rounded hover:bg-surface-elevated text-text-muted hover:text-text-primary opacity-80 group-hover:opacity-100 transition-opacity"
                >
                  {isDirty ? (
                    <Circle className="w-2.5 h-2.5 fill-status-warning text-status-warning" />
                  ) : (
                    <X className="w-3 h-3" />
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {(onCloseOthers || onCloseAll) && (
        <div className="hidden xs:flex items-center gap-1 pl-2 shrink-0">
          {onCloseOthers && (
            <button
              onClick={onCloseOthers}
              title="Close Others"
              className="px-2 py-0.5 text-[11px] text-text-muted hover:text-text-primary hover:bg-surface-elevated rounded transition-colors"
            >
              Close Others
            </button>
          )}
          {onCloseAll && (
            <button
              onClick={onCloseAll}
              title="Close All"
              className="px-2 py-0.5 text-[11px] text-text-muted hover:text-status-error hover:bg-status-error/10 rounded transition-colors"
            >
              Close All
            </button>
          )}
        </div>
      )}
    </div>
  );
}
