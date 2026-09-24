export function validateCodeSyntax(code, language = 'javascript') {
  if (!code || typeof code !== 'string') return [];

  const markers = [];
  const lang = (language || 'javascript').toLowerCase();

  if (lang === 'json') {
    try {
      JSON.parse(code);
    } catch (e) {
      const msg = e.message || 'Invalid JSON syntax';
      let line = 1;
      let col = 1;
      const posMatch = msg.match(/position\s+(\d+)/i) || msg.match(/line\s+(\d+)\s+column\s+(\d+)/i);
      if (posMatch) {
        if (posMatch.length === 3) {
          line = parseInt(posMatch[1], 10);
          col = parseInt(posMatch[2], 10);
        } else if (posMatch[1]) {
          const charIndex = parseInt(posMatch[1], 10);
          const lines = code.slice(0, charIndex).split('\n');
          line = lines.length;
          col = lines[lines.length - 1].length + 1;
        }
      }
      markers.push({
        startLineNumber: line,
        startColumn: col,
        endLineNumber: line,
        endColumn: col + 5,
        message: `JSON Syntax Error: ${msg}`,
        severity: 8 // monaco.MarkerSeverity.Error
      });
    }
    return markers;
  }

  if (lang === 'javascript' || lang === 'typescript' || lang === 'jsx' || lang === 'tsx' || lang === 'react') {
    try {
      let sanitized = code
        .replace(/^\s*import\s+.*$/gm, '')
        .replace(/^\s*export\s+default\s+/gm, '')
        .replace(/^\s*export\s+/gm, '');

      if (lang === 'react' || lang === 'jsx' || lang === 'tsx' || /<[a-zA-Z0-9_\$><]/.test(sanitized)) {
        sanitized = sanitized
          .replace(/return\s*\(\s*<[\s\S]*?\);\s*}/g, 'return null; }')
          .replace(/return\s*\(\s*<[\s\S]*?\);/g, 'return null;')
          .replace(/return\s+<[\s\S]*?;/g, 'return null;')
          .replace(/<[a-zA-Z0-9_\$]+[^>]*>[\s\S]*?<\/[a-zA-Z0-9_\$]+>/g, 'null')
          .replace(/<[^>]+>/g, 'null');
      }

      const wrapped = `(async function() {\n${sanitized}\n})()`;
      new Function(wrapped);
    } catch (e) {
      let line = 1;
      let col = 1;
      const stack = e.stack || '';
      const lineMatch = stack.match(/<anonymous>:(\d+):(\d+)/) || e.message.match(/line\s+(\d+)/i);
      if (lineMatch) {
        line = Math.max(1, parseInt(lineMatch[1], 10) - 1);
        if (lineMatch[2]) col = parseInt(lineMatch[2], 10);
      }
      const lines = code.split('\n');
      const targetLineText = lines[line - 1] || '';
      markers.push({
        startLineNumber: line,
        startColumn: Math.max(1, col),
        endLineNumber: line,
        endColumn: Math.max(col + 3, targetLineText.length + 1),
        message: e.message || 'JavaScript Syntax Error',
        severity: 8
      });
    }
  }

  if (lang === 'python') {
    const lines = code.split('\n');
    const blockKeywords = ['def', 'class', 'if', 'elif', 'else', 'for', 'while', 'try', 'except', 'finally', 'with'];

    lines.forEach((lineText, idx) => {
      const trimmed = lineText.trim();
      const lineNum = idx + 1;

      if (!trimmed || trimmed.startsWith('#')) return;

      const firstWord = trimmed.split(/\s|\(/)[0];
      if (blockKeywords.includes(firstWord)) {
        if (!trimmed.endsWith(':') && !trimmed.includes('#')) {
          markers.push({
            startLineNumber: lineNum,
            startColumn: Math.max(1, lineText.indexOf(firstWord) + 1),
            endLineNumber: lineNum,
            endColumn: lineText.length + 1,
            message: `Python Syntax Error: Missing colon ':' at the end of '${firstWord}' statement`,
            severity: 8
          });
        }
      }
    });
  }

  if (['c', 'cpp', 'cc', 'cxx', 'java', 'csharp', 'cs', 'php', 'rust'].includes(lang)) {
    const lines = code.split('\n');
    const controlKeywords = [
      'if', 'else', 'for', 'while', 'switch', 'case', 'default', 'try', 'catch', 'finally',
      'do', 'struct', 'class', 'enum', 'namespace', 'using', 'import', 'package',
      'public', 'private', 'protected'
    ];

    lines.forEach((lineText, idx) => {
      const lineNum = idx + 1;
      let cleanLine = lineText;
      const commentIdx = cleanLine.indexOf('//');
      if (commentIdx !== -1) {
        cleanLine = cleanLine.slice(0, commentIdx);
      }
      const trimmed = cleanLine.trim();
      if (!trimmed) return;

      if (trimmed.startsWith('#')) return;
      if (trimmed.endsWith('{') || trimmed.endsWith('}') || trimmed.endsWith(':') || trimmed.endsWith(';')) return;
      if (/[\+\-\*\/\=\&\|\,\<\>\.]$/.test(trimmed)) return;

      const firstWord = trimmed.split(/[\s\(\<]/)[0];
      if (controlKeywords.includes(firstWord)) return;

      let nextLineIndex = idx + 1;
      while (nextLineIndex < lines.length && !lines[nextLineIndex].trim()) {
        nextLineIndex++;
      }
      if (nextLineIndex < lines.length && lines[nextLineIndex].trim().startsWith('{')) {
        return;
      }

      markers.push({
        startLineNumber: lineNum,
        startColumn: Math.max(1, lineText.indexOf(trimmed) + 1),
        endLineNumber: lineNum,
        endColumn: lineText.length + 1,
        message: `Syntax Error: Missing semicolon ';' at end of statement`,
        severity: 8
      });
    });
  }

  if (lang === 'html' || lang === 'htm') {
    const lines = code.split('\n');
    const tagStack = [];
    const selfClosing = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

    lines.forEach((lineText, idx) => {
      const lineNum = idx + 1;
      const tagRegex = /<\/?([a-zA-Z0-9]+)[^>]*>/g;
      let match;

      while ((match = tagRegex.exec(lineText)) !== null) {
        const fullTag = match[0];
        const tagName = match[1].toLowerCase();
        const colNum = match.index + 1;

        if (selfClosing.has(tagName) || fullTag.endsWith('/>')) {
          continue;
        }

        if (fullTag.startsWith('</')) {
          if (tagStack.length === 0) {
            markers.push({
              startLineNumber: lineNum,
              startColumn: colNum,
              endLineNumber: lineNum,
              endColumn: colNum + fullTag.length,
              message: `HTML Syntax Error: Unmatched closing tag '</${tagName}>'`,
              severity: 8
            });
          } else {
            const top = tagStack.pop();
            if (top.tagName !== tagName) {
              markers.push({
                startLineNumber: lineNum,
                startColumn: colNum,
                endLineNumber: lineNum,
                endColumn: colNum + fullTag.length,
                message: `HTML Syntax Error: Mismatched tag '</${tagName}>', expected '</${top.tagName}>' opened at line ${top.lineNum}`,
                severity: 8
              });
            }
          }
        } else {
          tagStack.push({ tagName, lineNum, colNum });
        }
      }
    });

    tagStack.forEach(unclosed => {
      markers.push({
        startLineNumber: unclosed.lineNum,
        startColumn: unclosed.colNum,
        endLineNumber: unclosed.lineNum,
        endColumn: unclosed.colNum + unclosed.tagName.length + 2,
        message: `HTML Syntax Error: Unclosed tag '<${unclosed.tagName}>'`,
        severity: 4 // Warning/Error
      });
    });
  }

  const stack = [];
  const lines = code.split('\n');

  lines.forEach((lineText, idx) => {
    const lineNum = idx + 1;
    let inString = false;
    let stringChar = '';

    for (let colIndex = 0; colIndex < lineText.length; colIndex++) {
      const char = lineText[colIndex];
      const prevChar = colIndex > 0 ? lineText[colIndex - 1] : '';

      if (inString) {
        if (char === stringChar && prevChar !== '\\') {
          inString = false;
        }
        continue;
      }

      if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
        if (lang === 'python' && lineText.slice(colIndex, colIndex + 3) === '"""') {
          colIndex += 2;
          continue;
        }
        inString = true;
        stringChar = char;
        continue;
      }

      if (lang === 'python' && char === '#') break;
      if ((lang === 'javascript' || lang === 'cpp' || lang === 'c' || lang === 'java' || lang === 'csharp' || lang === 'php' || lang === 'go' || lang === 'rust') && char === '/' && lineText[colIndex + 1] === '/') break;

      if (char === '(' || char === '{' || char === '[') {
        stack.push({ char, lineNum, colNum: colIndex + 1 });
      } else if (char === ')' || char === '}' || char === ']') {
        if (stack.length === 0) {
          markers.push({
            startLineNumber: lineNum,
            startColumn: colIndex + 1,
            endLineNumber: lineNum,
            endColumn: colIndex + 2,
            message: `Syntax Error: Unmatched closing bracket '${char}'`,
            severity: 8
          });
        } else {
          const top = stack.pop();
          const expected = top.char === '(' ? ')' : top.char === '{' ? '}' : ']';
          if (char !== expected) {
            markers.push({
              startLineNumber: lineNum,
              startColumn: colIndex + 1,
              endLineNumber: lineNum,
              endColumn: colIndex + 2,
              message: `Syntax Error: Mismatched bracket '${char}', expected '${expected}' for '${top.char}' at line ${top.lineNum}`,
              severity: 8
            });
          }
        }
      }
    }

    if (inString && lang !== 'python') {
      markers.push({
        startLineNumber: lineNum,
        startColumn: Math.max(1, lineText.lastIndexOf(stringChar) + 1),
        endLineNumber: lineNum,
        endColumn: lineText.length + 1,
        message: `Syntax Error: Unclosed string literal ${stringChar}`,
        severity: 8
      });
    }
  });

  stack.forEach(unmatched => {
    markers.push({
      startLineNumber: unmatched.lineNum,
      startColumn: unmatched.colNum,
      endLineNumber: unmatched.lineNum,
      endColumn: unmatched.colNum + 1,
      message: `Syntax Error: Unclosed bracket '${unmatched.char}'`,
      severity: 8
    });
  });

  return markers;
}
