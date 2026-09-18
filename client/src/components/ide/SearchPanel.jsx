import React, { useState } from 'react';
import { Search as SearchIcon, FileCode, ArrowRight } from 'lucide-react';

export function SearchPanel({ files, onOpenFile }) {
  const [searchTerm, setSearchTerm] = useState('');

  const searchResults = [];

  if (searchTerm.trim().length > 0) {
    const termLower = searchTerm.toLowerCase();
    files.forEach(file => {
      const lines = (file.sourceCode || '').split('\n');
      lines.forEach((lineText, lineIdx) => {
        if (lineText.toLowerCase().includes(termLower)) {
          searchResults.push({
            file,
            lineNum: lineIdx + 1,
            lineText: lineText.trim()
          });
        }
      });
    });
  }

  return (
    <div className="w-72 bg-surface border-r border-border-main flex flex-col h-full select-none shrink-0 font-mono text-xs">
      <div className="p-3 border-b border-border-main">
        <span className="font-bold text-text-primary uppercase tracking-wider">Search Workspace</span>
      </div>

      <div className="p-3 border-b border-border-main">
        <div className="relative">
          <SearchIcon className="w-4 h-4 absolute left-3 top-2.5 text-text-muted" />
          <input
            type="text"
            placeholder="Search code across files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-bg-deep border border-border-main rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary text-xs"
          />
        </div>
      </div>

      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {searchTerm.trim().length === 0 ? (
          <div className="text-center py-8 text-text-muted text-xs">
            Type to search inside project files.
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-8 text-text-muted text-xs">
            No matching code found.
          </div>
        ) : (
          searchResults.map((res, idx) => (
            <div
              key={idx}
              onClick={() => onOpenFile(res.file)}
              className="p-2.5 rounded-xl bg-bg-deep hover:bg-surface-elevated border border-border-main cursor-pointer transition-all space-y-1 group"
            >
              <div className="flex items-center justify-between text-brand-primary font-bold">
                <span className="truncate flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5" />
                  <span>{res.file.name}</span>
                </span>
                <span className="text-[10px] bg-brand-primary/10 px-1.5 py-0.5 rounded border border-brand-primary/20">
                  L{res.lineNum}
                </span>
              </div>
              <div className="text-text-secondary text-[11px] truncate font-mono">
                {res.lineText}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
