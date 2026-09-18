import Execution from '../models/Execution.js';

const JUDGE0_LANG_IDS = {
  javascript: 63,
  typescript: 74,
  python: 71,
  cpp: 54,
  c: 50,
  java: 62,
  csharp: 51,
  php: 68,
  ruby: 72,
  go: 60,
  rust: 73,
  sql: 82
};

export function prepareCodeWithTimezone(code, language, offsetMinutes = -330) {
  if (!code || typeof code !== 'string') return code;
  const lowerLang = (language || '').toLowerCase();

  const totalMinutes = -offsetMinutes;
  const sign = totalMinutes >= 0 ? '+' : '-';
  const absMinutes = Math.abs(totalMinutes);
  const hours = Math.floor(absMinutes / 60);
  const mins = absMinutes % 60;
  const tzModifier = `'${sign}${hours} hours', '${sign}${mins} minutes'`;

  if (lowerLang === 'sql') {
    const localDateTimeExpr = `(DATETIME('now', ${tzModifier}))`;
    const localDateExpr = `(DATE('now', ${tzModifier}))`;
    const localTimeExpr = `(TIME('now', ${tzModifier}))`;

    let transformed = code;
    transformed = transformed.replace(/\b(?<!AS\s+)CURRENT_TIMESTAMP\b/gi, localDateTimeExpr);
    transformed = transformed.replace(/\b(?<!AS\s+)CURRENT_DATE\b/gi, localDateExpr);
    transformed = transformed.replace(/\b(?<!AS\s+)CURRENT_TIME\b/gi, localTimeExpr);
    transformed = transformed.replace(/datetime\s*\(\s*['"]now['"]\s*\)/gi, localDateTimeExpr);
    transformed = transformed.replace(/\bnow\s*\(\s*\)/gi, localDateTimeExpr);
    return transformed;
  }

  if (lowerLang === 'python') {
    if (!code.includes("os.environ['TZ']") && !code.includes('os.environ["TZ"]')) {
      return `import os, time\nos.environ['TZ'] = 'Asia/Kolkata'\nif hasattr(time, 'tzset'):\n    time.tzset()\n\n` + code;
    }
  }

  if (lowerLang === 'javascript') {
    if (!code.includes("process.env.TZ")) {
      return `process.env.TZ = 'Asia/Kolkata';\n` + code;
    }
  }

  if (lowerLang === 'typescript') {
    let prefix = '';
    if (!code.includes('declare var process') && !code.includes('declare const process') && !code.includes('declare let process')) {
      prefix += 'declare var process: any;\n';
    }
    if (!code.includes('process.env.TZ')) {
      prefix += `process.env.TZ = 'Asia/Kolkata';\n`;
    }
    return prefix + code;
  }

  return code;
}

export async function executeCodeController(req, res) {
  try {
    const { code, language, stdin, projectId, fileId, timezoneOffset } = req.body;

    if (!code || !language) {
      return res.status(400).json({ message: 'Code and language are required.' });
    }

    const lowerLang = language.toLowerCase();

    if (lowerLang === 'html' || lowerLang === 'css') {
      return res.json({
        type: 'web',
        html: lowerLang === 'css' ? `<html><head><style>${code}</style></head><body><div class="card"><h1>CSS Preview</h1></div></body></html>` : code,
        message: `${language.toUpperCase()} rendered successfully.`
      });
    }

    if (lowerLang === 'json') {
      try {
        const parsed = JSON.parse(code);
        return res.json({
          stdout: `JSON Syntax Verified Successfully:\n${JSON.stringify(parsed, null, 2)}`,
          stderr: null,
          time: "0.001",
          status: "Accepted"
        });
      } catch (err) {
        return res.json({
          stdout: null,
          stderr: `JSON Syntax Error: ${err.message}`,
          time: "0.000",
          status: "Syntax Error"
        });
      }
    }

    const languageId = JUDGE0_LANG_IDS[lowerLang];
    if (!languageId) {
      return res.status(400).json({ message: `Unsupported language: ${language}` });
    }

    const processedCode = prepareCodeWithTimezone(code, lowerLang, timezoneOffset !== undefined ? timezoneOffset : -330);

    const payload = {
      source_code: Buffer.from(processedCode).toString('base64'),
      language_id: languageId
    };
    if (stdin) {
      payload.stdin = Buffer.from(stdin).toString('base64');
    }

    const response = await fetch('https://ce.judge0.com/submissions?wait=true&base64_encoded=true', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        message: result.message || result.error || `Execution engine error (Status ${response.status})`
      });
    }

    const decodeBase64 = (str) => {
      if (!str) return null;
      try {
        return Buffer.from(str, 'base64').toString('utf-8');
      } catch (e) {
        return str;
      }
    };

    const outputPayload = {
      stdout: decodeBase64(result.stdout),
      stderr: decodeBase64(result.stderr),
      compile_output: decodeBase64(result.compile_output),
      time: result.time || "0.00",
      memory: result.memory || 0,
      status: result.status?.description || 'Executed'
    };

    if (req.user && req.user.id) {
      try {
        await Execution.create({
          user: req.user.id,
          project: projectId || null,
          file: fileId || null,
          language: lowerLang,
          judge0LanguageId: languageId,
          stdin: stdin || '',
          stdout: outputPayload.stdout,
          stderr: outputPayload.stderr,
          compileOutput: outputPayload.compile_output,
          status: outputPayload.status,
          time: outputPayload.time,
          memory: outputPayload.memory
        });
      } catch (e) {}
    }

    return res.json(outputPayload);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Code execution engine error.' });
  }
}

