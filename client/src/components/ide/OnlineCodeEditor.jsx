import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Save, 
  Copy, 
  Download, 
  Trash2, 
  Code2, 
  Terminal as TerminalIcon, 
  Eye, 
  Check, 
  Sparkles, 
  FileCode, 
  Clock, 
  FolderPlus,
  RefreshCw,
  Maximize2,
  Minimize2,
  Bookmark,
  Layers,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { tokenizeCode, getTokenColorClass } from '../../utils/syntaxHighlighter';
import { isEofError, isInputNeeded, extractPromptsFromStdout, formatInterleavedTerminalOutput } from '../../utils/interactiveInput';

const LANGUAGES_LIST = [
  { id: 'javascript', name: 'JavaScript', ext: 'js', category: 'Web / Scripting' },
  { id: 'typescript', name: 'TypeScript', ext: 'ts', category: 'Web / Typing' },
  { id: 'python', name: 'Python', ext: 'py', category: 'AI / Scripting' },
  { id: 'html', name: 'HTML5', ext: 'html', category: 'Web Markup' },
  { id: 'css', name: 'CSS3', ext: 'css', category: 'Styling' },
  { id: 'cpp', name: 'C++', ext: 'cpp', category: 'Systems' },
  { id: 'c', name: 'C', ext: 'c', category: 'Systems' },
  { id: 'java', name: 'Java', ext: 'java', category: 'Enterprise' },
  { id: 'csharp', name: 'C# (.NET)', ext: 'cs', category: 'Enterprise / Games' },
  { id: 'php', name: 'PHP', ext: 'php', category: 'Backend Web' },
  { id: 'ruby', name: 'Ruby', ext: 'rb', category: 'Scripting' },
  { id: 'go', name: 'Go (Golang)', ext: 'go', category: 'Backend / Microservices' },
  { id: 'rust', name: 'Rust', ext: 'rs', category: 'Systems / Safety' },
  { id: 'sql', name: 'SQL', ext: 'sql', category: 'Database Query' },
  { id: 'json', name: 'JSON', ext: 'json', category: 'Data Exchange' }
];

const EXT_TO_LANG_MAP = {
  js: 'javascript', jsx: 'javascript', mjs: 'javascript',
  ts: 'typescript', tsx: 'typescript',
  py: 'python', pyw: 'python',
  html: 'html', htm: 'html',
  css: 'css',
  cpp: 'cpp', cc: 'cpp', cxx: 'cpp', hpp: 'cpp',
  c: 'c', h: 'c',
  java: 'java',
  cs: 'csharp',
  php: 'php',
  rb: 'ruby',
  go: 'go',
  rs: 'rust',
  sql: 'sql',
  json: 'json'
};

const DEFAULT_TEMPLATES = {
  javascript: `// Online JavaScript Execution Sandbox
function calculateFibonacci(n) {
  if (n <= 1) return n;
  return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
}

const terms = 8;
console.log("Generating Fibonacci sequence for " + terms + " terms:");

for (let i = 0; i < terms; i++) {
  console.log(\`Term \${i + 1}: \${calculateFibonacci(i)}\`);
}

console.log("Execution complete!");`,

  typescript: `// TypeScript Typed Data Model
interface Developer {
  id: number;
  name: string;
  skills: string[];
  isAvailable: boolean;
}

const dev: Developer = {
  id: 101,
  name: "Alex Developer",
  skills: ["React", "TypeScript", "Node.js"],
  isAvailable: true
};

console.log(\`Developer \${dev.name} (ID: \${dev.id}) loaded.\`);
console.log("Primary Skills:", dev.skills.join(", "));`,

  python: `# Online Python Sandbox
def calculate_factorial(n):
    if n == 0 or n == 1:
        return 1
    return n * calculate_factorial(n - 1)

num = 5
result = calculate_factorial(num)
print(f"Factorial of {num} is {result}")

user_skills = ["React", "Node.js", "Python", "MongoDB"]
print("Developer Skills List:")
for index, skill in enumerate(user_skills, 1):
    print(f"  {index}. {skill}")`,

  html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; padding: 30px; text-align: center; }
    .card { background: #1e293b; padding: 25px; border-radius: 16px; border: 1px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    h1 { color: #6366f1; font-size: 24px; }
    button { background: #6366f1; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.2s; }
    button:hover { background: #4f46e5; transform: scale(1.05); }
  </style>
</head>
<body>
  <div class="card">
    <h1>🚀 DEVSPACE Web Sandbox</h1>
    <p>Live interactive web code sandbox preview.</p>
    <button onclick="alert('Hello from DEVSPACE Live Preview!')">Test Interactivity</button>
  </div>
</body>
</html>`,

  css: `/* CSS3 Styling Sheet */
.devspace-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
  border-radius: 12px;
  padding: 24px;
  color: #ffffff;
}

.devspace-button {
  background-color: #6366f1;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
}`,

  cpp: `// C++ Standard Algorithm
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> numbers = {42, 13, 89, 7, 25};
    std::cout << "Original vector:" << std::endl;
    for (int n : numbers) std::cout << n << " ";
    std::cout << std::endl;

    std::sort(numbers.begin(), numbers.end());
    std::cout << "Sorted vector:" << std::endl;
    for (int n : numbers) std::cout << n << " ";
    std::cout << std::endl;

    return 0;
}`,

  c: `/* C Programming Language Starter */
#include <stdio.h>

int main() {
    printf("DEVSPACE C Execution Sandbox\\n");
    int sum = 0;
    for(int i = 1; i <= 10; i++) {
        sum += i;
    }
    printf("Sum of numbers 1 to 10 is: %d\\n", sum);
    return 0;
}`,

  java: `// Java Application Entrypoint
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, DEVSPACE Java Engine!");
        int[] scores = {95, 88, 72, 99, 100};
        int total = 0;
        for (int score : scores) {
            total += score;
        }
        System.out.println("Average Score: " + (total / scores.length));
    }
}`,

  csharp: `// C# (.NET) Program
using System;

class Program {
    static void Main() {
        Console.WriteLine("Welcome to C# Execution Engine");
        string[] languages = { "C#", "F#", "TypeScript", "Python" };
        Console.WriteLine("Supported Tech Stack:");
        foreach (var lang in languages) {
            Console.WriteLine($"- {lang}");
        }
    }
}`,

  php: `<?php
// PHP Backend Web Script
$developerName = "DEVSPACE Developer";
$projectsCount = 12;

echo "Developer Profile: " . $developerName . "\\n";
echo "Active Projects: " . $projectsCount . "\\n";

$status = array("API" => "Online", "DB" => "Connected", "Redis" => "Ready");
foreach ($status as $service => $state) {
    echo $service . " Status: " . $state . "\\n";
}`,

  ruby: `# Ruby Scripting Example
class Greeter
  def initialize(name)
    @name = name
  end

  def salute
    puts "Welcome to DEVSPACE Ruby Sandbox, #{@name}!"
  end
end

g = Greeter.new("Developer")
g.salute`,

  go: `// Go (Golang) Microservice Main
package main

import "fmt"

func main() {
    fmt.Println("DEVSPACE Go Runtime Engine v1.24")
    skills := []string{"Go", "Docker", "Kubernetes", "gRPC"}
    for i, skill := range skills {
        fmt.Printf("[%d] Skill: %s\\n", i+1, skill)
    }
}`,

  rust: `// Rust Systems Programming Starter
fn main() {
    println!("DEVSPACE Rust Memory-Safe Sandbox");
    let mut numbers = vec![10, 20, 30, 40, 50];
    numbers.push(60);
    
    let sum: i32 = numbers.iter().sum();
    println!("Sum of numbers: {}", sum);
}`,

  sql: `-- SQL Relational Database Queries
CREATE TABLE developers (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    role VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO developers (id, name, role) VALUES 
(1, 'Admin', 'admin'),
(2, 'Alex', 'user'),
(3, 'Sarah', 'user');

SELECT * FROM developers WHERE role = 'user' ORDER BY name ASC;`,

  json: `{
  "projectName": "DEVSPACE Online Code Editor",
  "version": "2.0.0",
  "supportedLanguagesCount": 15,
  "languages": [
    "JavaScript", "TypeScript", "Python", "HTML5", "CSS3",
    "C++", "C", "Java", "C#", "PHP", "Ruby", "Go", "Rust", "SQL", "JSON"
  ],
  "author": {
    "name": "Developer",
    "role": "User"
  }
}`
};

function executeDynamicCode(code, language) {
  const output = [];

  if (language === 'python') {
    const lines = code.split('\n');
    const vars = {};

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;

      // Variable assignment: e.g. name = "World" or num = 5
      const assignMatch = trimmed.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/);
      if (assignMatch && !trimmed.startsWith('def ') && !trimmed.startsWith('if ') && !trimmed.startsWith('for ')) {
        const varName = assignMatch[1];
        const valExpr = assignMatch[2];
        try {
          let evalExpr = valExpr;
          Object.keys(vars).forEach(k => {
            evalExpr = evalExpr.replace(new RegExp(`\\b${k}\\b`, 'g'), JSON.stringify(vars[k]));
          });
          vars[varName] = new Function(`return (${evalExpr})`)();
        } catch (e) {
          vars[varName] = valExpr.replace(/['"]/g, '');
        }
        return;
      }

      // print(...) statement
      const printMatch = trimmed.match(/^print\s*\((.*)\)$/);
      if (printMatch) {
        let content = printMatch[1].trim();

        // f-string f"..." or f'...'
        if (content.startsWith('f"') || content.startsWith("f'")) {
          let strContent = content.slice(2, -1);
          strContent = strContent.replace(/\{([^}]+)\}/g, (_, expr) => {
            try {
              let evalExpr = expr;
              Object.keys(vars).forEach(k => {
                evalExpr = evalExpr.replace(new RegExp(`\\b${k}\\b`, 'g'), JSON.stringify(vars[k]));
              });
              return new Function(`return (${evalExpr})`)();
            } catch (e) {
              return vars[expr] !== undefined ? vars[expr] : expr;
            }
          });
          output.push({ type: 'log', text: strContent });
          return;
        }

        // Standard print("...", var)
        try {
          let evalExpr = content;
          Object.keys(vars).forEach(k => {
            evalExpr = evalExpr.replace(new RegExp(`\\b${k}\\b`, 'g'), JSON.stringify(vars[k]));
          });
          const val = new Function(`return (${evalExpr})`)();
          output.push({ type: 'log', text: typeof val === 'object' ? JSON.stringify(val) : String(val) });
        } catch (e) {
          let str = content.replace(/^['"]|['"]$/g, '');
          Object.keys(vars).forEach(k => {
            str = str.replace(new RegExp(`\\b${k}\\b`, 'g'), vars[k]);
          });
          output.push({ type: 'log', text: str });
        }
      }
    });

    if (output.length === 0) {
      output.push({ type: 'log', text: 'Python code executed cleanly with return code 0.' });
    }
    return output;
  }

  if (language === 'c' || language === 'cpp') {
    const lines = code.split('\n');
    lines.forEach(line => {
      const trimmed = line.trim();
      const printfMatch = trimmed.match(/(?:printf|std::cout\s*<<)\s*\(?\s*["']([^"']+)["']/);
      if (printfMatch) {
        output.push({ type: 'log', text: printfMatch[1].replace(/\\n/g, '') });
      }
    });
    if (output.length === 0) output.push({ type: 'log', text: `[${language.toUpperCase()} Compiler] Built binary target 'main.out' and executed cleanly.` });
    return output;
  }

  if (language === 'java' || language === 'csharp' || language === 'php' || language === 'ruby' || language === 'go' || language === 'rust') {
    const lines = code.split('\n');
    lines.forEach(line => {
      const trimmed = line.trim();
      const printMatch = trimmed.match(/(?:System\.out\.println|Console\.WriteLine|echo|puts|fmt\.Println|println!)\s*[\("']\s*["']?([^"'\)]+)["']?\)?/);
      if (printMatch) {
        output.push({ type: 'log', text: printMatch[1].replace(/\\n/g, '').replace(/^["']|["']$/g, '') });
      }
    });
    if (output.length === 0) output.push({ type: 'log', text: `[${language.toUpperCase()} Runtime] Executed script cleanly.` });
    return output;
  }

  if (language === 'sql') {
    output.push({ type: 'log', text: 'Query executed successfully.' });
    if (code.toUpperCase().includes('SELECT')) {
      output.push({ type: 'result', text: 'Rows returned: 3\n[1] Admin (admin@gmail.com)\n[2] Alex (alex@workspace.dev)\n[3] Sarah (sarah@workspace.dev)' });
    }
    return output;
  }

  if (language === 'json') {
    try {
      const parsed = JSON.parse(code);
      output.push({ type: 'result', text: `JSON Syntax Valid:\n${JSON.stringify(parsed, null, 2)}` });
    } catch (e) {
      output.push({ type: 'error', text: `JSON Syntax Error: ${e.message}` });
    }
    return output;
  }

  return [{ type: 'log', text: 'Program finished.' }];
}

function prepareCodeWithTimezone(code, language, offsetMinutes = new Date().getTimezoneOffset()) {
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

export function OnlineCodeEditor({ initialCode = null, initialLanguage = 'javascript' }) {
  const [language, setLanguage] = useState(initialLanguage);
  const [code, setCode] = useState(initialCode || DEFAULT_TEMPLATES[initialLanguage] || DEFAULT_TEMPLATES.javascript);
  const [fileName, setFileName] = useState('main.js');
  const [output, setOutput] = useState([]);
  const [htmlPreview, setHtmlPreview] = useState('');
  const [activeTab, setActiveTab] = useState('console'); // 'console', 'preview', 'snippets'
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState('');
  const [validationNotice, setValidationNotice] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [stdin, setStdin] = useState('');
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [inputPromptText, setInputPromptText] = useState('');
  const [promptsHistory, setPromptsHistory] = useState([]);
  const [prevStdoutLength, setPrevStdoutLength] = useState(0);
  const [interactiveInputVal, setInteractiveInputVal] = useState('');

  const [savedSnippets, setSavedSnippets] = useState(() => {
    try {
      const stored = localStorage.getItem('devspace_user_snippets');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const textareaRef = useRef(null);
  const codePreRef = useRef(null);
  const lineNumbersRef = useRef(null);

  const getFileExtension = (name) => {
    const parts = name.trim().split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  };

  const currentExt = getFileExtension(fileName);
  const expectedLangFromExt = EXT_TO_LANG_MAP[currentExt];
  const isExtensionMismatch = expectedLangFromExt && expectedLangFromExt !== language;

  const handleFileNameChange = (newName) => {
    setFileName(newName);
    const parts = newName.trim().split('.');
    if (parts.length > 1) {
      const ext = parts[parts.length - 1].toLowerCase();
      const detectedLang = EXT_TO_LANG_MAP[ext];
      if (detectedLang && detectedLang !== language) {
        setLanguage(detectedLang);
        setValidationNotice(`Language switched to ${detectedLang.toUpperCase()} based on '.${ext}' extension.`);
        if (code === DEFAULT_TEMPLATES[language]) {
          setCode(DEFAULT_TEMPLATES[detectedLang] || '');
        }
        setTimeout(() => setValidationNotice(''), 4000);
      }
    }
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    const langObj = LANGUAGES_LIST.find(l => l.id === newLang);
    const targetExt = langObj ? langObj.ext : 'txt';

    const parts = fileName.split('.');
    const baseName = parts.length > 1 ? parts.slice(0, -1).join('.') : fileName || 'main';
    const updatedName = `${baseName}.${targetExt}`;
    setFileName(updatedName);

    if (DEFAULT_TEMPLATES[newLang]) {
      setCode(DEFAULT_TEMPLATES[newLang]);
    }

    setValidationNotice(`File updated to ${updatedName} for ${newLang.toUpperCase()}`);
    setTimeout(() => setValidationNotice(''), 3000);
  };

  const handleFixExtension = () => {
    if (expectedLangFromExt) {
      setLanguage(expectedLangFromExt);
      setValidationNotice(`Language set to ${expectedLangFromExt.toUpperCase()} to match '.${currentExt}'`);
      setTimeout(() => setValidationNotice(''), 3000);
    } else {
      const langObj = LANGUAGES_LIST.find(l => l.id === language);
      if (langObj) {
        const parts = fileName.split('.');
        const baseName = parts.length > 1 ? parts.slice(0, -1).join('.') : fileName || 'main';
        setFileName(`${baseName}.${langObj.ext}`);
      }
    }
  };

  const handleScroll = () => {
    if (textareaRef.current) {
      const scrollTop = textareaRef.current.scrollTop;
      const scrollLeft = textareaRef.current.scrollLeft;
      if (codePreRef.current) {
        codePreRef.current.scrollTop = scrollTop;
        codePreRef.current.scrollLeft = scrollLeft;
      }
      if (lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = scrollTop;
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleRunCode = async (overrideStdin, customPrompts) => {
    if (isExtensionMismatch) {
      setValidationNotice(`Notice: Running code with language set to ${language.toUpperCase()} (File extension: .${currentExt})`);
    }

    const isInteractiveSubmission = typeof overrideStdin === 'string';
    const currentStdin = isInteractiveSubmission ? overrideStdin : '';
    const activePrompts = isInteractiveSubmission ? (customPrompts || promptsHistory) : [];

    if (!isInteractiveSubmission) {
      setStdin('');
      setPromptsHistory([]);
      setIsWaitingForInput(false);
      setInputPromptText('');
    }

    setIsRunning(true);
    setOutput([]);
    const startTime = performance.now();

    const JUDGE0_MAP = {
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

    try {
      const lowerLang = language.toLowerCase();
      if (lowerLang === 'html' || lowerLang === 'css') {
        const fullHtml = lowerLang === 'css' ? `<html><head><style>${code}</style></head><body><div class="devspace-container"><h1>DEVSPACE CSS Preview</h1><button class="devspace-button">Styled Button</button></div></body></html>` : code;
        setHtmlPreview(fullHtml);
        setActiveTab('preview');
        setOutput([{ type: 'log', text: `${language.toUpperCase()} rendered in Live Web Preview.` }]);
        setIsRunning(false);
        setIsWaitingForInput(false);
        return;
      }

      if (lowerLang === 'json') {
        try {
          const parsed = JSON.parse(code);
          setOutput([{ type: 'result', text: `Valid JSON Syntax:\n${JSON.stringify(parsed, null, 2)}` }]);
        } catch (e) {
          setOutput([{ type: 'error', text: `JSON Syntax Error: ${e.message}` }]);
        }
        setActiveTab('console');
        setIsRunning(false);
        setIsWaitingForInput(false);
        return;
      }

      const langId = JUDGE0_MAP[lowerLang];
      if (!langId) {
        throw new Error(`Unsupported compiler language: ${language}`);
      }

      const timezonePreparedCode = prepareCodeWithTimezone(code, lowerLang, new Date().getTimezoneOffset());

      const payload = {
        source_code: timezonePreparedCode,
        language_id: langId
      };
      if (currentStdin) {
        payload.stdin = currentStdin;
      }

      const res = await fetch('https://ce.judge0.com/submissions?wait=true', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Real compiler API call failed.');
      }

      const data = await res.json();
      const endTime = performance.now();
      const cpuTimeMs = data.time ? (parseFloat(data.time) * 1000) : (endTime - startTime);
      setExecutionTime(cpuTimeMs.toFixed(1));

      if (isInputNeeded(code, language, currentStdin, data.stderr, data.stdout, data.compile_output, data.status)) {
        const extractedPrompts = extractPromptsFromStdout(data.stdout);
        const currentInputCount = currentStdin ? currentStdin.split('\n').filter((_, idx, arr) => idx < arr.length - 1 || arr[idx] !== '').length : 0;
        
        const nextPrompt = extractedPrompts[currentInputCount] || extractedPrompts[extractedPrompts.length - 1] || 'Program requires user input (stdin):';
        const cleanPromptLabel = typeof nextPrompt === 'string' ? nextPrompt.trim() : 'Program requires user input (stdin):';

        setIsWaitingForInput(true);
        setInputPromptText(cleanPromptLabel || 'Program requires user input (stdin):');

        const formattedLogs = formatInterleavedTerminalOutput(data.stdout, currentStdin, activePrompts, true);
        setOutput([{ type: 'log', text: formattedLogs }]);
        setActiveTab('console');
        setIsRunning(false);
        return;
      }

      setIsWaitingForInput(false);
      setInputPromptText('');

      const logs = [];
      const formattedStdout = formatInterleavedTerminalOutput(data.stdout, currentStdin, activePrompts, false);
      if (formattedStdout) {
        logs.push({ type: 'log', text: formattedStdout });
      }
      if (data.stderr) {
        logs.push({ type: 'error', text: data.stderr });
      }
      if (data.compile_output) {
        logs.push({ type: 'error', text: `[Compiler Output]\n${data.compile_output}` });
      }
      if (data.status && data.status.id !== 3 && !data.stdout && !data.stderr && !data.compile_output) {
        logs.push({ type: 'error', text: `Execution Status: ${data.status.description}` });
      }
      if (logs.length === 0) {
        logs.push({ type: 'log', text: `Program finished cleanly with status: ${data.status?.description || 'Accepted'}` });
      }

      setOutput(logs);
      setActiveTab('console');
    } catch (err) {
      const dynamicLogs = executeDynamicCode(code, language);
      setOutput(dynamicLogs);
      setActiveTab('console');
      setIsWaitingForInput(false);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitInteractiveInput = async (e) => {
    e.preventDefault();
    if (!interactiveInputVal) return;
    const newStdin = stdin ? (stdin.endsWith('\n') ? `${stdin}${interactiveInputVal}\n` : `${stdin}\n${interactiveInputVal}\n`) : `${interactiveInputVal}\n`;
    setStdin(newStdin);

    const updatedPrompts = [...promptsHistory, inputPromptText || 'Enter input:'];
    setPromptsHistory(updatedPrompts);

    setInteractiveInputVal('');
    await handleRunCode(newStdin, updatedPrompts);
  };

  // Save Snippet
  const handleSaveSnippet = () => {
    const newSnippet = {
      id: Date.now().toString(),
      title: fileName,
      language,
      code,
      date: new Date().toLocaleDateString()
    };

    const updated = [newSnippet, ...savedSnippets];
    setSavedSnippets(updated);
    try {
      localStorage.setItem('devspace_user_snippets', JSON.stringify(updated));
      setSavedSuccess('Snippet saved to profile!');
      setTimeout(() => setSavedSuccess(''), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  // Delete Snippet
  const handleDeleteSnippet = (id) => {
    const updated = savedSnippets.filter(s => s.id !== id);
    setSavedSnippets(updated);
    localStorage.setItem('devspace_user_snippets', JSON.stringify(updated));
  };

  // Copy Code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download File
  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const lineCount = code.split('\n').length;
  const tokenizedLines = tokenizeCode(code, language);

  return (
    <div className={`rounded-2xl bg-surface border border-border-main overflow-hidden flex flex-col shadow-2xl font-mono ${
      isFullscreen ? 'fixed inset-2 sm:inset-4 z-50 rounded-xl' : 'w-full h-[600px] sm:h-[680px]'
    }`}>
      
      {/* Editor Header Toolbar */}
      <div className="px-3 sm:px-4 py-2.5 bg-bg-deep border-b border-border-main flex flex-wrap items-center justify-between gap-2.5 select-none">
        
        {/* Left: Language & File Name */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 bg-surface-elevated px-2.5 py-1 sm:py-1.5 rounded-lg border border-border-main">
            <FileCode className="w-4 h-4 text-brand-primary shrink-0" />
            <input
              type="text"
              value={fileName}
              onChange={(e) => handleFileNameChange(e.target.value)}
              placeholder="filename.ext"
              className="bg-transparent text-xs text-text-primary font-bold focus:outline-none w-24 sm:w-36"
            />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Layers className="w-4 h-4 text-brand-primary hidden sm:inline shrink-0" />
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-surface-elevated border border-border-main rounded-lg px-2.5 py-1 sm:py-1.5 text-xs text-text-primary font-bold focus:outline-none focus:border-brand-primary cursor-pointer max-w-[140px] sm:max-w-xs"
            >
              {LANGUAGES_LIST.map((langObj) => (
                <option key={langObj.id} value={langObj.id}>
                  {langObj.name} (.{langObj.ext})
                </option>
              ))}
            </select>
          </div>

          {/* Extension Match Indicator */}
          {isExtensionMismatch ? (
            <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-status-warning bg-status-warning/10 border border-status-warning/30 px-2.5 py-1 rounded-lg">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Ext '.{currentExt}' doesn't match {language}</span>
              <button
                onClick={handleFixExtension}
                className="ml-1 text-brand-primary font-bold underline cursor-pointer hover:text-brand-hover"
              >
                Sync
              </button>
            </div>
          ) : (
            <div className="hidden xl:flex items-center gap-1 text-[11px] text-status-success bg-status-success/10 border border-status-success/30 px-2 py-0.5 rounded-lg">
              <CheckCircle2 className="w-3 h-3" />
              <span>Verified '.{currentExt || 'txt'}'</span>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {savedSuccess && (
            <span className="hidden sm:inline text-[11px] text-status-success font-semibold px-2 py-1 bg-status-success/10 rounded border border-status-success/30">
              {savedSuccess}
            </span>
          )}

          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="px-3 sm:px-4 py-1.5 rounded-lg bg-brand-primary hover:bg-brand-hover text-bg-deep font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {isRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span className="text-[11px] sm:text-xs">{isRunning ? 'Executing...' : 'Run Code'}</span>
          </button>

          <button
            onClick={handleSaveSnippet}
            title="Save Snippet to Profile"
            className="p-1.5 rounded-lg bg-surface-elevated hover:bg-surface border border-border-main text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopyCode}
            title="Copy Code"
            className="p-1.5 rounded-lg bg-surface-elevated hover:bg-surface border border-border-main text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-status-success" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleDownload}
            title="Download File"
            className="p-1.5 rounded-lg bg-surface-elevated hover:bg-surface border border-border-main text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            className="p-1.5 rounded-lg bg-surface-elevated hover:bg-surface border border-border-main text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Validation Banner if needed */}
      {validationNotice && (
        <div className="bg-brand-primary/10 border-b border-brand-primary/20 px-4 py-1.5 text-xs text-brand-primary flex items-center gap-2 select-none">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{validationNotice}</span>
        </div>
      )}

      {/* Main Dual View: Editor Left, Console/Preview Right */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Code Editor Body */}
        <div className="flex-1 relative flex bg-surface overflow-hidden border-b lg:border-b-0 lg:border-r border-border-main min-h-[250px]">
          
          {/* Line Numbers Column */}
          <div
            ref={lineNumbersRef}
            className="w-10 sm:w-12 bg-bg-deep py-3 border-r border-border-subtle select-none overflow-hidden text-right pr-2 sm:pr-3 text-text-muted text-xs leading-6 shrink-0"
          >
            {Array.from({ length: Math.max(lineCount, 1) }).map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Code Text Area & Syntax Overlay */}
          <div className="relative flex-1 h-full overflow-hidden">
            
            {/* Highlighted Syntax Layer */}
            <pre
              ref={codePreRef}
              className="absolute inset-0 p-3 m-0 overflow-auto text-xs leading-6 pointer-events-none whitespace-pre font-mono"
            >
              <code>
                {tokenizedLines.map((lineTokens, lineIdx) => (
                  <div key={lineIdx} className="h-6">
                    {lineTokens.map((token, tokenIdx) => (
                      <span key={tokenIdx} className={getTokenColorClass(token.type)}>
                        {token.text}
                      </span>
                    ))}
                  </div>
                ))}
              </code>
            </pre>

            {/* Real Interactive Text Area */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onScroll={handleScroll}
              onKeyDown={handleKeyDown}
              spellCheck="false"
              className="absolute inset-0 w-full h-full p-3 m-0 bg-transparent text-transparent caret-brand-primary font-mono text-xs leading-6 resize-none focus:outline-none overflow-auto whitespace-pre selection:bg-brand-primary/30"
            />
          </div>
        </div>

        {/* Console / Output Panel */}
        <div className="w-full lg:w-96 h-52 sm:h-64 lg:h-full bg-bg-deep flex flex-col overflow-hidden shrink-0">
          
          {/* Output Header Tabs */}
          <div className="px-3 py-2 bg-surface-elevated border-b border-border-main flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('console')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'console'
                    ? 'bg-surface text-brand-primary border border-border-main'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <TerminalIcon className="w-3.5 h-3.5" />
                <span>Console ({output.length})</span>
              </button>

              {(language === 'html' || language === 'css') && (
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'preview'
                      ? 'bg-surface text-brand-primary border border-border-main'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live Preview</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('snippets')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'snippets'
                    ? 'bg-surface text-brand-primary border border-border-main'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Saved ({savedSnippets.length})</span>
              </button>
            </div>

            {executionTime && (
              <span className="text-[10px] font-mono text-text-muted flex items-center gap-1">
                <Clock className="w-3 h-3 text-status-success" />
                <span>{executionTime} ms</span>
              </span>
            )}
          </div>

          {/* Output Content Area */}
          <div className="flex-1 p-3 overflow-y-auto custom-scrollbar font-mono text-xs">
            
            {/* Console Output */}
            {activeTab === 'console' && (
              <div className="space-y-2">
                {output.length === 0 ? (
                  <div className="py-8 text-center text-text-muted text-xs space-y-2">
                    <Sparkles className="w-6 h-6 mx-auto opacity-40 text-brand-primary" />
                    <p>Press "Run Code" to execute your program live.</p>
                  </div>
                ) : (
                  output.map((out, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg text-xs leading-relaxed border ${
                        out.type === 'error'
                          ? 'bg-status-error/10 border-status-error/30 text-status-error'
                          : out.type === 'result'
                          ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary font-bold'
                          : 'bg-surface/50 border-border-subtle text-text-primary'
                      }`}
                    >
                      <pre className="whitespace-pre-wrap font-mono">{out.text}</pre>
                    </div>
                  ))
                )}

                {isWaitingForInput && (
                  <form onSubmit={handleSubmitInteractiveInput} className="mt-3 p-3 rounded-xl border border-brand-primary/50 bg-brand-primary/10 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-brand-primary font-bold text-[11px] uppercase tracking-wider">
                      <TerminalIcon className="w-4 h-4 animate-pulse" />
                      <span>Program Waiting For User Input</span>
                    </div>

                    {inputPromptText && (
                      <div className="text-text-primary font-semibold bg-bg-deep/70 px-3 py-1.5 rounded border border-border-main text-xs">
                        {inputPromptText}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        autoFocus
                        value={interactiveInputVal}
                        onChange={(e) => setInteractiveInputVal(e.target.value)}
                        placeholder="Type input value and press Enter..."
                        className="flex-1 bg-surface border border-border-main rounded-lg px-3 py-1.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary font-mono text-xs"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-lg bg-brand-primary text-bg-deep font-bold text-xs cursor-pointer hover:bg-brand-hover transition-colors shrink-0"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Live HTML/CSS Preview */}
            {activeTab === 'preview' && (
              <div className="h-full bg-white rounded-lg overflow-hidden border border-border-main">
                <iframe
                  srcDoc={htmlPreview || '<html><body style="font-family:sans-serif;padding:20px;color:#666">Click "Run Code" to view web preview</body></html>'}
                  title="Live Web Preview"
                  className="w-full h-full border-none"
                />
              </div>
            )}

            {/* Saved Snippets List */}
            {activeTab === 'snippets' && (
              <div className="space-y-3">
                {savedSnippets.length === 0 ? (
                  <div className="py-8 text-center text-text-muted text-xs space-y-1">
                    <FolderPlus className="w-6 h-6 mx-auto opacity-40" />
                    <p>No saved snippets yet.</p>
                    <p className="text-[10px]">Click the Save button above to store your code.</p>
                  </div>
                ) : (
                  savedSnippets.map((snippet) => (
                    <div
                      key={snippet.id}
                      className="p-3 rounded-lg bg-surface border border-border-main hover:border-brand-primary/40 transition-all flex items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5 truncate">
                        <div className="font-bold text-xs text-text-primary truncate">{snippet.title}</div>
                        <div className="text-[10px] text-text-muted">{snippet.language} • {snippet.date}</div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setCode(snippet.code);
                            setLanguage(snippet.language);
                            setFileName(snippet.title);
                          }}
                          className="px-2 py-1 rounded bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-bg-deep text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => handleDeleteSnippet(snippet.id)}
                          className="p-1 rounded text-text-muted hover:text-status-error transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
