import React from 'react';
import { motion } from 'framer-motion';

export function Editor({ activeFile = 'App.tsx', count = 7, showAutocomplete = false, autocompleteIndex = 0 }) {
  const codeLines = [
    { line: 1, content: [{ text: 'import', type: 'keyword' }, { text: ' { ', type: 'plain' }, { text: 'useState', type: 'function' }, { text: ' } ', type: 'plain' }, { text: 'from', type: 'keyword' }, { text: ' "react"', type: 'string' }, { text: ';', type: 'plain' }] },
    { line: 2, content: [] },
    { line: 3, content: [{ text: 'export default function', type: 'keyword' }, { text: ' ', type: 'plain' }, { text: 'App', type: 'component' }, { text: '() {', type: 'plain' }] },
    { line: 4, content: [{ text: '  const', type: 'keyword' }, { text: ' [count, setCount] = ', type: 'plain' }, { text: 'useState', type: 'function' }, { text: '(', type: 'plain' }, { text: `${count}`, type: 'number' }, { text: ');', type: 'plain' }], active: true },
    { line: 5, content: [] },
    { line: 6, content: [{ text: '  return', type: 'keyword' }, { text: ' (', type: 'plain' }] },
    { line: 7, content: [{ text: '    <', type: 'plain' }, { text: 'main', type: 'tag' }, { text: ' className=', type: 'attr' }, { text: '"p-8 bg-surface text-foreground"', type: 'string' }, { text: '>', type: 'plain' }] },
    { line: 8, content: [{ text: '      <', type: 'plain' }, { text: 'h1', type: 'tag' }, { text: ' className=', type: 'attr' }, { text: '"text-2xl font-bold font-sans"', type: 'string' }, { text: '>', type: 'plain' }] },
    { line: 9, content: [{ text: '        Hello, developer.', type: 'plain' }] },
    { line: 10, content: [{ text: '      </', type: 'plain' }, { text: 'h1', type: 'tag' }, { text: '>', type: 'plain' }] },
    { line: 11, content: [] },
    { line: 12, content: [{ text: '      <', type: 'plain' }, { text: 'button', type: 'tag' }] },
    { line: 13, content: [{ text: '        onClick', type: 'attr' }, { text: '={() => ', type: 'plain' }, { text: 'setCount', type: 'function' }, { text: '(count + 1)}', type: 'plain' }] },
    { line: 14, content: [{ text: '        className=', type: 'attr' }, { text: '"mt-4 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-deep transition-all"', type: 'string' }] },
    { line: 15, content: [{ text: '      >', type: 'plain' }] },
    { line: 16, content: [{ text: '        Count: {count}', type: 'plain' }] },
    { line: 17, content: [{ text: '      </', type: 'plain' }, { text: 'button', type: 'tag' }, { text: '>', type: 'plain' }] },
    { line: 18, content: [{ text: '    </', type: 'plain' }, { text: 'main', type: 'tag' }, { text: '>', type: 'plain' }] },
    { line: 19, content: [{ text: '  );', type: 'plain' }] },
    { line: 20, content: [{ text: '}', type: 'plain' }] }
  ];

  const getTokenStyle = (type) => {
    switch (type) {
      case 'keyword': return 'text-purple-400 font-semibold';
      case 'string': return 'text-emerald-400';
      case 'function': return 'text-amber-300';
      case 'number': return 'text-orange-400 font-semibold';
      case 'component': return 'text-blue-400 font-semibold';
      case 'tag': return 'text-pink-400';
      case 'attr': return 'text-cyan-300';
      default: return 'text-text-primary';
    }
  };

  return (
    <div className="relative flex-1 bg-surface font-mono text-xs overflow-hidden flex">
      <div className="flex-1 overflow-y-auto py-3 custom-scrollbar">
        {codeLines.map((line) => (
          <div
            key={line.line}
            className={`flex items-center px-4 py-0.5 group transition-colors ${
              line.active ? 'bg-brand-primary/10 border-l-2 border-brand-primary' : 'hover:bg-surface-elevated/30 border-l-2 border-transparent'
            }`}
          >
            <span className="w-8 text-right pr-4 text-text-muted select-none group-hover:text-text-secondary text-[11px]">
              {line.line}
            </span>

            <div className="flex-1 whitespace-pre">
              {line.content.map((token, i) => (
                <span key={i} className={getTokenStyle(token.type)}>
                  {token.text}
                </span>
              ))}
              {line.active && (
                <span className="inline-block w-2 h-4 bg-brand-primary animate-cursor align-middle ml-0.5 shadow-xs shadow-brand-primary" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="hidden lg:block w-20 bg-bg-deep border-l border-border-subtle p-2 select-none opacity-40 hover:opacity-80 transition-opacity">
        <div className="space-y-1 text-[4px] font-mono leading-none text-text-muted">
          <div className="h-1 bg-purple-400/40 rounded w-12" />
          <div className="h-1 bg-blue-400/40 rounded w-16" />
          <div className="h-1 bg-amber-300/40 rounded w-10" />
          <div className="h-1 bg-pink-400/40 rounded w-14" />
          <div className="h-1 bg-emerald-400/40 rounded w-12" />
          <div className="h-1 bg-purple-400/40 rounded w-8" />
          <div className="h-1 bg-text-muted/30 rounded w-16" />
          <div className="h-1 bg-text-muted/30 rounded w-14" />
          <div className="h-1 bg-brand-primary/60 rounded w-10" />
          <div className="h-1 bg-text-muted/30 rounded w-12" />
        </div>
      </div>
    </div>
  );
}
