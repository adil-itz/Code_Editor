export function isEofError(stderr, stdout, code = '') {
  if (!stderr || typeof stderr !== 'string') return false;
  const err = stderr.toLowerCase();

  if (err.includes('eoferror') || err.includes('eof when reading a line')) return true;
  if (err.includes('nosuchelementexception') || err.includes('eofexception') || err.includes('scanner.throwfor')) return true;
  if (err.includes('cin') && (err.includes('eof') || err.includes('fail'))) return true;
  if (err.includes('system.nullreferenceexception') && (code || '').includes('Console.ReadLine')) return true;
  if (err.includes('end of file') || err.includes('unexpected eof') || err.includes('stdin: eof') || err.includes('read: eof')) return true;

  return false;
}

export function extractNewPrompt(stdout, prevStdoutLength = 0) {
  if (!stdout || typeof stdout !== 'string') return '';
  return stdout.slice(prevStdoutLength);
}

export function buildTerminalOutput(stdout, stdin, promptsHistory = []) {
  if (!stdin && promptsHistory.length === 0) {
    return stdout || '';
  }

  const inputs = stdin ? stdin.split('\n').filter((_, idx, arr) => idx < arr.length - 1 || arr[idx] !== '') : [];
  let resultLines = [];
  let totalPromptsLength = 0;

  for (let i = 0; i < promptsHistory.length; i++) {
    const prompt = promptsHistory[i] || '';
    const inputVal = inputs[i] !== undefined ? inputs[i] : '';
    totalPromptsLength += prompt.length;

    if (prompt || inputVal) {
      if (prompt.endsWith('\n')) {
        const cleanPrompt = prompt.trimEnd();
        if (cleanPrompt) resultLines.push(cleanPrompt);
        if (inputVal) resultLines.push(inputVal);
      } else {
        const line = prompt + (inputVal ? (prompt ? ' ' : '') + inputVal : '');
        if (line) resultLines.push(line);
      }
    }
  }

  if (stdout && typeof stdout === 'string') {
    const remaining = stdout.slice(totalPromptsLength);
    if (remaining.trim()) {
      const cleanRemaining = remaining.startsWith('\n') ? remaining.slice(1) : remaining;
      resultLines.push(cleanRemaining);
    }
  }

  return resultLines.join('\n');
}
