import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const MONACO_LANG_MAP = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  html: 'html',
  css: 'css',
  cpp: 'cpp',
  c: 'c',
  java: 'java',
  csharp: 'csharp',
  php: 'php',
  ruby: 'ruby',
  go: 'go',
  rust: 'rust',
  sql: 'sql',
  json: 'json',
  markdown: 'markdown'
};

export function CodeEditorContainer({ file, value, onChange, onSave, onOpenCommandPalette, theme = 'vs-dark' }) {
  const onSaveRef = useRef(onSave);
  const onPaletteRef = useRef(onOpenCommandPalette);

  useEffect(() => {
    onSaveRef.current = onSave;
    onPaletteRef.current = onOpenCommandPalette;
  }, [onSave, onOpenCommandPalette]);

  const language = file?.language ? (MONACO_LANG_MAP[file.language.toLowerCase()] || file.language.toLowerCase()) : 'javascript';

  const handleEditorDidMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (onSaveRef.current) onSaveRef.current();
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
      if (onPaletteRef.current) onPaletteRef.current();
    });
  };

  return (
    <div className="flex-1 relative bg-[#1e1e1e] flex overflow-hidden">
      <Editor
        height="100%"
        language={language}
        value={value || ''}
        theme={theme}
        onChange={(val) => onChange(val || '')}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
          minimap: { enabled: true },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          tabSize: 2,
          wordWrap: 'on',
          lineNumbers: 'on',
          renderLineHighlight: 'all',
          cursorBlinking: 'smooth',
          smoothScrolling: true,
          padding: { top: 12, bottom: 12 }
        }}
        loading={
          <div className="h-full bg-[#1e1e1e] text-text-muted flex items-center justify-center font-mono text-xs">
            Loading VS Code Editor...
          </div>
        }
      />
    </div>
  );
}
