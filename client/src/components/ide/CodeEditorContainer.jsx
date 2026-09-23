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

function formatCodeByLanguage(code, lang) {
  if (!code) return '';

  if (lang === 'json') {
    try {
      return JSON.stringify(JSON.parse(code), null, 2);
    } catch (e) {
      return code;
    }
  }

  const lines = code.split('\n');
  let indentLevel = 0;
  const isFourSpaceLang = lang === 'python' || lang === 'cpp' || lang === 'c' || lang === 'java' || lang === 'csharp' || lang === 'go' || lang === 'rust' || lang === 'php';
  const indentStr = isFourSpaceLang ? '    ' : '  ';

  const formattedLines = lines.map(line => {
    let trimmed = line.trim();
    if (!trimmed) return '';

    if (trimmed.startsWith('}') || trimmed.startsWith(']') || trimmed.startsWith(')')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    const result = indentStr.repeat(indentLevel) + trimmed;

    if (trimmed.endsWith('{') || trimmed.endsWith('[') || trimmed.endsWith('(') || (lang === 'python' && trimmed.endsWith(':'))) {
      indentLevel++;
    }

    return result;
  });

  let result = formattedLines.join('\n');
  result = result.replace(/\n{3,}/g, '\n\n');
  return result;
}

function getLanguageSnippets(monaco, lang, range) {
  const K = monaco.languages.CompletionItemKind;
  const R = monaco.languages.CompletionItemInsertTextRule;

  if (lang === 'javascript' || lang === 'typescript') {
    return [
      {
        label: 'if',
        kind: K.Keyword,
        insertText: 'if (${1:condition}) {\n\t${0}\n}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'If statement',
        range
      },
      {
        label: 'else',
        kind: K.Keyword,
        insertText: 'else {\n\t${0}\n}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Else statement',
        range
      },
      {
        label: 'while',
        kind: K.Keyword,
        insertText: 'while (${1:condition}) {\n\t${0}\n}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'While loop',
        range
      },
      {
        label: 'for',
        kind: K.Keyword,
        insertText: 'for (let ${1:i} = 0; ${1:i} < ${2:array}.length; ${1:i}++) {\n\t${0}\n}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'For loop',
        range
      },
      {
        label: 'switch',
        kind: K.Keyword,
        insertText: 'switch (${1:key}) {\n\tcase ${2:value}:\n\t\t${0}\n\t\tbreak;\n\tdefault:\n\t\tbreak;\n}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Switch statement',
        range
      },
      {
        label: 'return',
        kind: K.Keyword,
        insertText: 'return ${1:value};',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Return statement',
        range
      },
      {
        label: 'class',
        kind: K.Keyword,
        insertText: 'class ${1:ClassName} {\n\tconstructor(${2:params}) {\n\t\t${0}\n\t}\n}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Class declaration',
        range
      },
      {
        label: 'import',
        kind: K.Keyword,
        insertText: 'import ${1:name} from \'${2:module}\';',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Import module',
        range
      },
      {
        label: 'export',
        kind: K.Keyword,
        insertText: 'export default ${1:name};',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Export default',
        range
      },
      {
        label: 'const',
        kind: K.Keyword,
        insertText: 'const ${1:name} = ${2:value};',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Const declaration',
        range
      },
      {
        label: 'let',
        kind: K.Keyword,
        insertText: 'let ${1:name} = ${2:value};',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Let declaration',
        range
      },
      {
        label: 'console.log',
        kind: K.Function,
        insertText: 'console.log(${1:value});',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Log message to console',
        range
      },
      {
        label: 'console.error',
        kind: K.Function,
        insertText: 'console.error(${1:error});',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Log error to console',
        range
      },
      {
        label: 'function',
        kind: K.Snippet,
        insertText: 'function ${1:name}(${2:params}) {\n\t${0}\n}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Function declaration snippet',
        range
      },
      {
        label: 'arrowFunction',
        kind: K.Snippet,
        insertText: 'const ${1:name} = (${2:params}) => {\n\t${0}\n};',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Arrow function snippet',
        range
      },
      {
        label: 'tryCatch',
        kind: K.Snippet,
        insertText: 'try {\n\t${1}\n} catch (${2:error}) {\n\tconsole.error(${2:error});\n}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Try-catch block snippet',
        range
      },
      {
        label: 'asyncFunction',
        kind: K.Snippet,
        insertText: 'async function ${1:name}(${2:params}) {\n\t${0}\n}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Async function declaration',
        range
      },
      {
        label: 'fetchApi',
        kind: K.Snippet,
        insertText: 'const response = await fetch("${1:url}");\nconst data = await response.json();',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Fetch API request snippet',
        range
      }
    ];
  }

  if (lang === 'python') {
    return [
      {
        label: 'if',
        kind: K.Keyword,
        insertText: 'if ${1:condition}:\n    ${0:pass}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'If statement',
        range
      },
      {
        label: 'elif',
        kind: K.Keyword,
        insertText: 'elif ${1:condition}:\n    ${0:pass}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Elif statement',
        range
      },
      {
        label: 'else',
        kind: K.Keyword,
        insertText: 'else:\n    ${0:pass}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Else statement',
        range
      },
      {
        label: 'while',
        kind: K.Keyword,
        insertText: 'while ${1:condition}:\n    ${0:pass}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'While loop',
        range
      },
      {
        label: 'for',
        kind: K.Keyword,
        insertText: 'for ${1:item} in ${2:iterable}:\n    ${0:pass}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'For loop',
        range
      },
      {
        label: 'return',
        kind: K.Keyword,
        insertText: 'return ${1:value}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Return statement',
        range
      },
      {
        label: 'class',
        kind: K.Keyword,
        insertText: 'class ${1:ClassName}:\n    def __init__(self${2:, args}):\n        ${0:pass}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Class statement',
        range
      },
      {
        label: 'print',
        kind: K.Function,
        insertText: 'print(f"${1:value}")',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Print formatted string',
        range
      },
      {
        label: 'def',
        kind: K.Snippet,
        insertText: 'def ${1:function_name}(${2:args}):\n    """${3:Docstring}"""\n    ${0:pass}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Define a function',
        range
      },
      {
        label: 'main',
        kind: K.Snippet,
        insertText: 'if __name__ == "__main__":\n    ${0:main()}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Python main block',
        range
      },
      {
        label: 'tryExcept',
        kind: K.Snippet,
        insertText: 'try:\n    ${1:pass}\nexcept ${2:Exception} as e:\n    print(f"Error: {e}")',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Try-except exception block',
        range
      }
    ];
  }

  if (lang === 'cpp' || lang === 'c') {
    return [
      {
        label: 'if',
        kind: K.Keyword,
        insertText: 'if (${1:condition}) {\n    ${0}\n}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'If statement',
        range
      },
      {
        label: 'else',
        kind: K.Keyword,
        insertText: 'else {\n    ${0}\n}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Else statement',
        range
      },
      {
        label: 'while',
        kind: K.Keyword,
        insertText: 'while (${1:condition}) {\n    ${0}\n}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'While loop',
        range
      },
      {
        label: 'for',
        kind: K.Keyword,
        insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:n}; ++${1:i}) {\n    ${0}\n}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'For loop',
        range
      },
      {
        label: 'return',
        kind: K.Keyword,
        insertText: 'return ${1:0};',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Return statement',
        range
      },
      {
        label: 'main',
        kind: K.Snippet,
        insertText: '#include <iostream>\n\nint main() {\n    std::cout << "${1:Hello World}" << std::endl;\n    return 0;\n}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Main C++ Entrypoint',
        range
      },
      {
        label: 'cout',
        kind: K.Function,
        insertText: 'std::cout << ${1:message} << std::endl;',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Print to standard output',
        range
      }
    ];
  }

  if (lang === 'html') {
    return [
      {
        label: 'html5',
        kind: K.Snippet,
        insertText: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>${1:Document}</title>\n</head>\n<body>\n  ${0}\n</body>\n</html>',
        insertTextRules: R.InsertAsSnippet,
        detail: 'HTML5 Starter Boilerplate',
        range
      },
      {
        label: 'div',
        kind: K.Snippet,
        insertText: '<div className="${1:class}">\n  ${0}\n</div>',
        insertTextRules: R.InsertAsSnippet,
        detail: 'HTML Div Container',
        range
      }
    ];
  }

  if (lang === 'css') {
    return [
      {
        label: 'flexCenter',
        kind: K.Snippet,
        insertText: 'display: flex;\nalign-items: center;\njustify-content: center;',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Flexbox center container',
        range
      },
      {
        label: 'mediaQuery',
        kind: K.Snippet,
        insertText: '@media (max-width: ${1:768}px) {\n  ${0}\n}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Responsive media query block',
        range
      }
    ];
  }

  if (lang === 'java') {
    return [
      {
        label: 'if',
        kind: K.Keyword,
        insertText: 'if (${1:condition}) {\n    ${0}\n}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'If statement',
        range
      },
      {
        label: 'while',
        kind: K.Keyword,
        insertText: 'while (${1:condition}) {\n    ${0}\n}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'While loop',
        range
      },
      {
        label: 'for',
        kind: K.Keyword,
        insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n    ${0}\n}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'For loop',
        range
      },
      {
        label: 'mainClass',
        kind: K.Snippet,
        insertText: 'public class ${1:Main} {\n    public static void main(String[] args) {\n        System.out.println("${2:Hello Java}");\n    }\n}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Java main class snippet',
        range
      },
      {
        label: 'sout',
        kind: K.Function,
        insertText: 'System.out.println(${1:message});',
        insertTextRules: R.InsertAsSnippet,
        detail: 'System.out.println snippet',
        range
      }
    ];
  }

  if (lang === 'csharp') {
    return [
      {
        label: 'if',
        kind: K.Keyword,
        insertText: 'if (${1:condition}) {\n    ${0}\n}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'If statement',
        range
      },
      {
        label: 'while',
        kind: K.Keyword,
        insertText: 'while (${1:condition}) {\n    ${0}\n}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'While loop',
        range
      },
      {
        label: 'program',
        kind: K.Snippet,
        insertText: 'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("${1:Hello C#}");\n    }\n}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'C# Program entrypoint',
        range
      },
      {
        label: 'cw',
        kind: K.Function,
        insertText: 'Console.WriteLine(${1:message});',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Console.WriteLine snippet',
        range
      }
    ];
  }

  if (lang === 'sql') {
    return [
      {
        label: 'selectStar',
        kind: K.Snippet,
        insertText: 'SELECT * FROM ${1:table_name} WHERE ${2:condition};',
        insertTextRules: R.InsertAsSnippet,
        detail: 'SQL Select query snippet',
        range
      },
      {
        label: 'createTable',
        kind: K.Snippet,
        insertText: 'CREATE TABLE ${1:table_name} (\n    id INT PRIMARY KEY,\n    name VARCHAR(100)\n);',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Create SQL Table snippet',
        range
      }
    ];
  }

  if (lang === 'go') {
    return [
      {
        label: 'if',
        kind: K.Keyword,
        insertText: 'if ${1:condition} {\n    ${0}\n}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'If statement',
        range
      },
      {
        label: 'mainGo',
        kind: K.Snippet,
        insertText: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("${1:Hello Go}")\n}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Go package main boilerplate',
        range
      }
    ];
  }

  if (lang === 'rust') {
    return [
      {
        label: 'if',
        kind: K.Keyword,
        insertText: 'if ${1:condition} {\n    ${0}\n}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'If statement',
        range
      },
      {
        label: 'while',
        kind: K.Keyword,
        insertText: 'while ${1:condition} {\n    ${0}\n}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'While loop',
        range
      },
      {
        label: 'mainRust',
        kind: K.Snippet,
        insertText: 'fn main() {\n    println!("${1:Hello Rust}");\n}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'Rust main function snippet',
        range
      }
    ];
  }

  if (lang === 'php') {
    return [
      {
        label: 'if',
        kind: K.Keyword,
        insertText: 'if (${1:condition}) {\n    ${0}\n}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'If statement',
        range
      },
      {
        label: 'while',
        kind: K.Keyword,
        insertText: 'while (${1:condition}) {\n    ${0}\n}',
        insertTextRules: R.InsertAsSnippet,
        detail: 'While loop',
        range
      },
      {
        label: 'phpStarter',
        kind: K.Snippet,
        insertText: '<?php\n\necho "${1:Hello PHP}";\n',
        insertTextRules: R.InsertAsSnippet,
        detail: 'PHP script starter',
        range
      }
    ];
  }

  return [];
}

export function CodeEditorContainer({ 
  file, 
  value, 
  onChange, 
  onSave, 
  onOpenCommandPalette, 
  theme = 'vs-dark',
  onDiagnosticsChange,
  jumpToLine,
  enabledExtensions = {
    'auto-indent': true,
    'code-formatter': true,
    'autocomplete': true
  }
}) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const onSaveRef = useRef(onSave);
  const onPaletteRef = useRef(onOpenCommandPalette);
  const enabledExtensionsRef = useRef(enabledExtensions);

  useEffect(() => {
    enabledExtensionsRef.current = enabledExtensions;
  }, [enabledExtensions]);

  const isAutoIndentEnabled = enabledExtensions['auto-indent'] !== false;
  const isFormatterEnabled = enabledExtensions['code-formatter'] !== false;
  const isAutocompleteEnabled = enabledExtensions['autocomplete'] !== false;

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        autoIndent: isAutoIndentEnabled ? 'full' : 'none',
        formatOnType: isFormatterEnabled,
        formatOnPaste: isFormatterEnabled,
        quickSuggestions: isAutocompleteEnabled ? { other: true, comments: true, strings: true } : false,
        suggestOnTriggerCharacters: isAutocompleteEnabled,
        acceptSuggestionOnEnter: isAutocompleteEnabled ? 'on' : 'off',
        tabCompletion: isAutocompleteEnabled ? 'on' : 'off',
        snippetSuggestions: isAutocompleteEnabled ? 'inline' : 'none'
      });
    }
  }, [isAutoIndentEnabled, isFormatterEnabled, isAutocompleteEnabled]);

  useEffect(() => {
    onSaveRef.current = onSave;
    onPaletteRef.current = onOpenCommandPalette;
  }, [onSave, onOpenCommandPalette]);

  const getLanguage = () => {
    if (file?.language && MONACO_LANG_MAP[file.language.toLowerCase()]) {
      return MONACO_LANG_MAP[file.language.toLowerCase()];
    }
    if (file?.name) {
      const ext = file.name.split('.').pop().toLowerCase();
      const extMap = {
        c: 'c', h: 'c',
        cpp: 'cpp', hpp: 'cpp', cc: 'cpp', cxx: 'cpp',
        py: 'python',
        js: 'javascript', jsx: 'javascript', mjs: 'javascript', cjs: 'javascript',
        ts: 'typescript', tsx: 'typescript',
        html: 'html', htm: 'html',
        css: 'css', scss: 'css',
        java: 'java',
        cs: 'csharp',
        php: 'php',
        rb: 'ruby',
        go: 'go',
        rs: 'rust',
        sql: 'sql',
        json: 'json',
        md: 'markdown'
      };
      if (extMap[ext]) return extMap[ext];
    }
    return 'javascript';
  };

  const language = getLanguage();

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
    }, 500);

    return () => clearTimeout(timer);
  }, [value, language, onDiagnosticsChange]);

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

    const supportedLangs = ['javascript', 'typescript', 'python', 'html', 'css', 'cpp', 'c', 'java', 'csharp', 'php', 'ruby', 'go', 'rust', 'sql', 'json', 'markdown'];
    supportedLangs.forEach(lang => {
      monaco.languages.registerDocumentFormattingEditProvider(lang, {
        provideDocumentFormattingEdits: (model) => {
          if (enabledExtensionsRef.current?.['code-formatter'] === false) {
            return [];
          }
          const val = model.getValue();
          const formatted = formatCodeByLanguage(val, lang);
          return [
            {
              range: model.getFullModelRange(),
              text: formatted
            }
          ];
        }
      });
    });

    supportedLangs.forEach(lang => {
      monaco.languages.registerCompletionItemProvider(lang, {
        provideCompletionItems: (model, position) => {
          if (enabledExtensionsRef.current?.['autocomplete'] === false) {
            return { suggestions: [] };
          }
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn
          };
          return {
            suggestions: getLanguageSnippets(monaco, lang, range)
          };
        }
      });
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

    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF, () => {
      if (enabledExtensionsRef.current?.['code-formatter'] !== false) {
        editor.getAction('editor.action.formatDocument')?.run();
      }
    });

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
    <div className="w-full h-full relative bg-bg-primary flex flex-col overflow-hidden">
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
          padding: { top: 12, bottom: 12 },
          autoIndent: isAutoIndentEnabled ? 'full' : 'none',
          formatOnType: isFormatterEnabled,
          formatOnPaste: isFormatterEnabled,
          quickSuggestions: isAutocompleteEnabled ? { other: true, comments: true, strings: true } : false,
          suggestOnTriggerCharacters: isAutocompleteEnabled,
          acceptSuggestionOnEnter: isAutocompleteEnabled ? 'on' : 'off',
          tabCompletion: isAutocompleteEnabled ? 'on' : 'off',
          snippetSuggestions: isAutocompleteEnabled ? 'inline' : 'none'
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
