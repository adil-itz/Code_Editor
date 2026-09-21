import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { validateCodeSyntax } from '../../utils/syntaxChecker';

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

export function CodeEditorContainer({ 
  file, 
  value, 
  onChange, 
  onSave, 
  onOpenCommandPalette, 
  theme = 'vs-dark',
  onDiagnosticsChange,
  jumpToLine 
}) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const onSaveRef = useRef(onSave);
  const onPaletteRef = useRef(onOpenCommandPalette);

  useEffect(() => {
    onSaveRef.current = onSave;
    onPaletteRef.current = onOpenCommandPalette;
  }, [onSave, onOpenCommandPalette]);

  const language = file?.language ? (MONACO_LANG_MAP[file.language.toLowerCase()] || file.language.toLowerCase()) : 'javascript';

  // 500ms Debounced Real-Time Syntax Validation
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;

    const timer = setTimeout(() => {
      const markers = validateCodeSyntax(value || '', language);
      const model = editorRef.current.getModel();
      if (model && monacoRef.current) {
        monacoRef.current.editor.setModelMarkers(model, 'realtime-syntax', markers);
      }
      if (onDiagnosticsChange) {
        onDiagnosticsChange(markers);
      }
    }, 500); // Exactly 500ms debounced delay

    return () => clearTimeout(timer);
  }, [value, language, onDiagnosticsChange]);

  // Jump to specific error line when clicked from PROBLEMS panel
  useEffect(() => {
    if (jumpToLine && editorRef.current) {
      editorRef.current.revealLineInCenter(jumpToLine.line);
      editorRef.current.setPosition({ lineNumber: jumpToLine.line, column: jumpToLine.column || 1 });
      editorRef.current.focus();
    }
  }, [jumpToLine]);

  const handleBeforeMount = (monaco) => {
    monaco.editor.defineTheme('one-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '5C6370', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'C678DD' },
        { token: 'string', foreground: '98C379' },
        { token: 'number', foreground: 'D19A66' },
        { token: 'type', foreground: 'E5C07B' },
        { token: 'function', foreground: '61AFEF' },
        { token: 'variable', foreground: 'E06C75' }
      ],
      colors: {
        'editor.background': '#21252B',
        'editor.foreground': '#ABB2BF',
        'editor.lineHighlightBackground': '#2C313A',
        'editorCursor.foreground': '#528BFF',
        'editorWhitespace.foreground': '#3B4048',
        'editorIndentGuide.background': '#3B4048',
        'editorIndentGuide.activeBackground': '#C678DD'
      }
    });

    monaco.editor.defineTheme('dracula', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6272A4', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'FF79C6' },
        { token: 'string', foreground: 'F1FA8C' },
        { token: 'number', foreground: 'BD93F9' },
        { token: 'type', foreground: '8BE9FD' },
        { token: 'function', foreground: '50FA7B' },
        { token: 'variable', foreground: 'F8F8F2' }
      ],
      colors: {
        'editor.background': '#21222C',
        'editor.foreground': '#F8F8F2',
        'editor.lineHighlightBackground': '#282A36',
        'editorCursor.foreground': '#F8F8F2',
        'editorWhitespace.foreground': '#44475A',
        'editorIndentGuide.background': '#44475A'
      }
    });

    monaco.editor.defineTheme('cyberpunk', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '7079A3', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'FF0055' },
        { token: 'string', foreground: '00FF66' },
        { token: 'number', foreground: 'FCEE09' },
        { token: 'type', foreground: '00F0FF' },
        { token: 'function', foreground: 'FCEE09' },
        { token: 'variable', foreground: '00F0FF' }
      ],
      colors: {
        'editor.background': '#0D0F18',
        'editor.foreground': '#00F0FF',
        'editor.lineHighlightBackground': '#1A1D30',
        'editorCursor.foreground': '#FCEE09',
        'editorWhitespace.foreground': '#22263F',
        'editorIndentGuide.background': '#22263F'
      }
    });
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (onSaveRef.current) onSaveRef.current();
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
      if (onPaletteRef.current) onPaletteRef.current();
    });

    // Run initial syntax validation
    const markers = validateCodeSyntax(value || '', language);
    const model = editor.getModel();
    if (model) {
      monaco.editor.setModelMarkers(model, 'realtime-syntax', markers);
    }
    if (onDiagnosticsChange) {
      onDiagnosticsChange(markers);
    }
  };

  const monacoThemeName = theme === 'vs-light' ? 'vs' : theme;

  return (
    <div className="flex-1 relative bg-bg-primary flex overflow-hidden">
      <Editor
        height="100%"
        language={language}
        value={value || ''}
        theme={monacoThemeName}
        beforeMount={handleBeforeMount}
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
          <div className="h-full bg-bg-primary text-text-muted flex items-center justify-center font-mono text-xs">
            Loading VS Code Editor...
          </div>
        }
      />
    </div>
  );
}
