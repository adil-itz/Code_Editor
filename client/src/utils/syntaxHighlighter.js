// Ultra-fast, comprehensive syntax tokenizer for 15 programming languages

export function tokenizeCode(code, language = 'javascript') {
  if (!code) return [];

  const lines = code.split('\n');
  return lines.map((lineText) => {
    return parseLineTokens(lineText, language);
  });
}

function parseLineTokens(text, lang) {
  if (!text) return [{ text: '', type: 'plain' }];

  const tokens = [];
  let index = 0;
  const lowerLang = (lang || 'javascript').toLowerCase();

  // Keyword sets
  const keywordsMap = {
    javascript: new Set(['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'import', 'export', 'default', 'from', 'class', 'extends', 'new', 'this', 'super', 'async', 'await', 'try', 'catch', 'finally', 'throw', 'typeof', 'instanceof', 'void', 'delete', 'in', 'of', 'yield', 'true', 'false', 'null', 'undefined']),
    typescript: new Set(['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'import', 'export', 'default', 'from', 'class', 'extends', 'new', 'this', 'super', 'async', 'await', 'try', 'catch', 'type', 'interface', 'enum', 'implements', 'declare', 'namespace', 'public', 'private', 'protected', 'readonly', 'keyof', 'string', 'number', 'boolean', 'any', 'void', 'true', 'false', 'null']),
    python: new Set(['def', 'class', 'return', 'if', 'elif', 'else', 'for', 'while', 'break', 'continue', 'import', 'from', 'as', 'try', 'except', 'finally', 'raise', 'with', 'lambda', 'pass', 'global', 'nonlocal', 'assert', 'yield', 'async', 'await', 'True', 'False', 'None', 'and', 'or', 'not', 'is', 'in', 'print', 'len', 'range', 'self']),
    cpp: new Set(['int', 'float', 'double', 'char', 'void', 'bool', 'auto', 'const', 'struct', 'class', 'public', 'private', 'protected', 'virtual', 'override', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'using', 'namespace', 'std', 'template', 'typename', 'include', 'define', 'nullptr', 'true', 'false', 'cout', 'endl', 'cin', 'vector', 'string']),
    c: new Set(['int', 'float', 'double', 'char', 'void', 'short', 'long', 'unsigned', 'signed', 'struct', 'union', 'typedef', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'include', 'define', 'sizeof', 'printf', 'scanf', 'NULL', 'true', 'false']),
    java: new Set(['public', 'private', 'protected', 'class', 'interface', 'extends', 'implements', 'static', 'final', 'void', 'int', 'double', 'float', 'boolean', 'char', 'String', 'return', 'if', 'else', 'for', 'while', 'switch', 'case', 'break', 'continue', 'try', 'catch', 'throw', 'throws', 'new', 'this', 'super', 'import', 'package', 'System', 'out', 'println', 'true', 'false', 'null']),
    csharp: new Set(['using', 'namespace', 'class', 'struct', 'interface', 'public', 'private', 'protected', 'internal', 'static', 'void', 'int', 'string', 'bool', 'double', 'float', 'var', 'return', 'if', 'else', 'for', 'foreach', 'in', 'while', 'switch', 'case', 'break', 'continue', 'async', 'await', 'new', 'this', 'Console', 'WriteLine', 'true', 'false', 'null']),
    php: new Set(['function', 'return', 'echo', 'if', 'else', 'elseif', 'for', 'foreach', 'as', 'while', 'switch', 'case', 'break', 'continue', 'class', 'public', 'private', 'protected', 'static', 'extends', 'implements', 'use', 'namespace', 'new', 'try', 'catch', 'throw', 'true', 'false', 'null', 'array', 'var']),
    ruby: new Set(['def', 'end', 'class', 'module', 'return', 'if', 'elsif', 'else', 'unless', 'for', 'while', 'do', 'yield', 'self', 'nil', 'true', 'false', 'require', 'include', 'attr_accessor', 'attr_reader', 'puts', 'print']),
    go: new Set(['package', 'import', 'func', 'return', 'var', 'const', 'type', 'struct', 'interface', 'if', 'else', 'for', 'range', 'switch', 'case', 'default', 'select', 'go', 'chan', 'map', 'make', 'new', 'nil', 'true', 'false', 'fmt', 'Println', 'Printf']),
    rust: new Set(['fn', 'let', 'mut', 'const', 'static', 'pub', 'struct', 'enum', 'impl', 'trait', 'use', 'mod', 'match', 'if', 'else', 'loop', 'while', 'for', 'in', 'return', 'break', 'continue', 'type', 'where', 'unsafe', 'async', 'await', 'true', 'false', 'Some', 'None', 'Ok', 'Err', 'println', 'format']),
    sql: new Set(['SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'UPDATE', 'DELETE', 'CREATE', 'TABLE', 'DROP', 'ALTER', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'GROUP', 'BY', 'ORDER', 'HAVING', 'LIMIT', 'AS', 'AND', 'OR', 'NOT', 'IN', 'IS', 'NULL', 'PRIMARY', 'KEY', 'FOREIGN', 'select', 'from', 'where', 'insert', 'into', 'update', 'delete', 'create', 'table']),
    html: new Set(['html', 'head', 'title', 'body', 'header', 'footer', 'main', 'section', 'div', 'span', 'h1', 'h2', 'h3', 'p', 'a', 'button', 'input', 'form', 'script', 'style', 'link', 'meta', 'img', 'ul', 'li', 'ol', 'table', 'tr', 'td', 'th']),
    css: new Set(['body', 'color', 'background', 'border', 'margin', 'padding', 'display', 'flex', 'grid', 'width', 'height', 'position', 'absolute', 'relative', 'font-family', 'font-size', 'border-radius', 'box-shadow', 'hover', 'active', 'focus'])
  };

  const keywords = keywordsMap[lowerLang] || keywordsMap.javascript;

  while (index < text.length) {
    const char = text[index];

    // Comments
    if (
      (lowerLang === 'python' || lowerLang === 'ruby') && char === '#' ||
      (lowerLang === 'sql' && text.slice(index, index + 2) === '--') ||
      (lowerLang !== 'python' && lowerLang !== 'ruby' && lowerLang !== 'sql' && text.slice(index, index + 2) === '//')
    ) {
      tokens.push({ text: text.slice(index), type: 'comment' });
      break;
    }

    // HTML Comments
    if (lowerLang === 'html' && text.slice(index, index + 4) === '<!--') {
      const endComment = text.indexOf('-->', index);
      if (endComment !== -1) {
        tokens.push({ text: text.slice(index, endComment + 3), type: 'comment' });
        index = endComment + 3;
        continue;
      } else {
        tokens.push({ text: text.slice(index), type: 'comment' });
        break;
      }
    }

    // Strings (Double, Single, Backtick)
    if (char === '"' || char === "'" || char === '`') {
      const quote = char;
      let endQuoteIndex = index + 1;
      while (endQuoteIndex < text.length) {
        if (text[endQuoteIndex] === quote && text[endQuoteIndex - 1] !== '\\') {
          break;
        }
        endQuoteIndex++;
      }
      const strText = text.slice(index, endQuoteIndex + 1);
      tokens.push({ text: strText, type: 'string' });
      index = endQuoteIndex + 1;
      continue;
    }

    // Numbers
    if (/\d/.test(char) && (index === 0 || /[\s\(\[\{,\+\-\*\/\=\>\<\:]/.test(text[index - 1]))) {
      let numStr = '';
      while (index < text.length && /[\d\.]/.test(text[index])) {
        numStr += text[index];
        index++;
      }
      tokens.push({ text: numStr, type: 'number' });
      continue;
    }

    // HTML Tags
    if (lowerLang === 'html' && (char === '<' || char === '>')) {
      tokens.push({ text: char, type: 'tag' });
      index++;
      continue;
    }

    // Words / Identifiers / Keywords
    if (/[a-zA-Z_\$\@\?]/.test(char)) {
      let word = '';
      while (index < text.length && /[a-zA-Z0-9_\$\@\?]/.test(text[index])) {
        word += text[index];
        index++;
      }

      if (keywords.has(word) || keywords.has(word.toUpperCase())) {
        tokens.push({ text: word, type: 'keyword' });
      } else if (text[index] === '(') {
        tokens.push({ text: word, type: 'function' });
      } else if (/^[A-Z]/.test(word)) {
        tokens.push({ text: word, type: 'component' });
      } else {
        tokens.push({ text: word, type: 'identifier' });
      }
      continue;
    }

    // Operators and Punctuations
    if (/[\+\-\*\/\=\!\%\&\&\|\|\?\:\>\<\;\,\.\{\}\(\)\[\]]/.test(char)) {
      tokens.push({ text: char, type: 'operator' });
      index++;
      continue;
    }

    // Whitespace and other characters
    tokens.push({ text: char, type: 'plain' });
    index++;
  }

  return tokens;
}

export function getTokenColorClass(type) {
  switch (type) {
    case 'keyword':
      return 'text-purple-400 font-semibold';
    case 'string':
      return 'text-emerald-400';
    case 'number':
      return 'text-amber-400 font-semibold';
    case 'comment':
      return 'text-text-muted italic opacity-70';
    case 'function':
      return 'text-blue-400 font-semibold';
    case 'component':
      return 'text-cyan-300 font-bold';
    case 'tag':
      return 'text-pink-400 font-bold';
    case 'operator':
      return 'text-brand-primary font-bold';
    case 'identifier':
      return 'text-text-primary';
    default:
      return 'text-text-secondary';
  }
}
