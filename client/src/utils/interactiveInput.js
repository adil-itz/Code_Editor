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

export function countRequiredInputs(code = '', language = '') {
  if (!code || typeof code !== 'string') return 0;
  const lang = (language || '').toLowerCase();
  
  if (lang === 'c' || lang === 'cpp') {
    const scanfCalls = code.match(/\bscanf\s*\(\s*["']([^"']+)["']/g) || [];
    let scanfSpecifiersCount = 0;
    scanfCalls.forEach(call => {
      const formatMatch = call.match(/["']([^"']+)["']/);
      if (formatMatch && formatMatch[1]) {
        const specifiers = formatMatch[1].match(/%[0-9]*[a-zA-Z]/g) || [];
        scanfSpecifiersCount += specifiers.length;
      }
    });

    const otherCInput = code.match(/\b(gets|getchar)\s*\(/g) || [];
    const cinOperators = code.match(/\b(?:cin|std::cin)\s*>>\s*([a-zA-Z0-9_]+)/g) || [];
    const getlineCalls = code.match(/\bgetline\s*\(/g) || [];

    return Math.max(scanfSpecifiersCount + otherCInput.length + cinOperators.length + getlineCalls.length, 0);
  }

  if (lang === 'python') {
    const inputMatches = code.match(/\b(input|sys\.stdin\.read(?:line)?)\s*\(/g) || [];
    return inputMatches.length;
  }

  if (lang === 'java') {
    const scannerMatches = code.match(/\b(?:scanner\s*\.\s*(?:next|nextLine|nextInt|nextDouble|nextLong|nextFloat)|System\.in\.read|readLine)\s*\(/gi) || [];
    return scannerMatches.length;
  }

  if (lang === 'csharp') {
    const csMatches = code.match(/\bConsole\s*\.\s*(?:ReadLine|Read)\s*\(/gi) || [];
    return csMatches.length;
  }

  if (lang === 'go') {
    const goMatches = code.match(/\b(?:fmt\s*\.\s*Scan(?:f|ln)?|bufio\s*\.\s*NewScanner|ReadString)\s*\(/g) || [];
    return goMatches.length;
  }

  if (lang === 'rust') {
    const rustMatches = code.match(/\b(?:read_line|stdin\s*\(\s*\))\s*\(/g) || [];
    return rustMatches.length;
  }

  const genericMatches = code.match(/\b(input|scanf|cin\s*>>|ReadLine|gets|fgets)\b/g) || [];
  return genericMatches.length;
}

export function extractPromptsFromStdout(stdout) {
  if (!stdout || typeof stdout !== 'string') return [];
  
  const matches = stdout.match(/[^:?\n\r]+[:?>]\s*/g);
  if (matches && matches.length > 0) {
    return matches.map(m => m.trimStart());
  }

  const lines = stdout.split('\n').map(l => l.trim()).filter(Boolean);
  return lines;
}

export function isInputNeeded(code, language, currentStdin, stderr, stdout) {
  if (isEofError(stderr, stdout, code)) return true;

  const totalRequired = countRequiredInputs(code, language);
  if (totalRequired === 0) return false;

  const inputLines = currentStdin ? currentStdin.split('\n').filter((_, idx, arr) => idx < arr.length - 1 || arr[idx] !== '') : [];
  return inputLines.length < totalRequired;
}

export function formatInterleavedTerminalOutput(stdout, stdin, promptsHistory = []) {
  if (!stdout || typeof stdout !== 'string') return stdout || '';
  if (!stdin) return stdout;

  const inputs = stdin.split('\n').filter((_, idx, arr) => idx < arr.length - 1 || arr[idx] !== '');
  if (inputs.length === 0) return stdout;

  let formatted = stdout;

  for (let i = 0; i < inputs.length; i++) {
    const inputVal = inputs[i];
    const rawPrompt = promptsHistory[i];

    if (rawPrompt && typeof rawPrompt === 'string' && rawPrompt.trim()) {
      const cleanPrompt = rawPrompt.trim();
      const promptIdx = formatted.indexOf(cleanPrompt);
      if (promptIdx !== -1) {
        let endIdx = promptIdx + cleanPrompt.length;
        while (endIdx < formatted.length && (formatted[endIdx] === ' ' || formatted[endIdx] === '\t')) {
          endIdx++;
        }
        
        const replacement = formatted.slice(promptIdx, endIdx) + ' ' + inputVal + '\n';
        formatted = formatted.slice(0, promptIdx) + replacement + formatted.slice(endIdx);
      }
    }
  }

  return formatted;
}
