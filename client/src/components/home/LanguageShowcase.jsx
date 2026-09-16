import React, { useState } from 'react';
import { Code2, Terminal, Play, Sparkles } from 'lucide-react';

export function LanguageShowcase() {
  const [selectedLang, setSelectedLang] = useState('javascript');

  const languages = [
    {
      id: 'javascript',
      name: 'JavaScript',
      ext: '.js',
      color: 'text-amber-500',
      sample: `function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nconsole.log(fibonacci(10)); // Output: 55`
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      ext: '.ts',
      color: 'text-blue-500',
      sample: `interface User {\n  id: number;\n  name: string;\n  role: 'admin' | 'dev';\n}\n\nconst dev: User = { id: 101, name: "Alex", role: "dev" };\nconsole.log(dev.name);`
    },
    {
      id: 'python',
      name: 'Python',
      ext: '.py',
      color: 'text-emerald-500',
      sample: `def compute_stats(data):\n    total = sum(data)\n    average = total / len(data)\n    return {"total": total, "average": average}\n\nprint(compute_stats([10, 20, 30, 40]))`
    },
    {
      id: 'java',
      name: 'Java',
      ext: '.java',
      color: 'text-orange-500',
      sample: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Nexus IDE Java Runtime!");\n    }\n}`
    },
    {
      id: 'cpp',
      name: 'C++',
      ext: '.cpp',
      color: 'text-cyan-500',
      sample: `#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> nums = {1, 2, 3, 4, 5};\n    std::cout << "Count: " << nums.size() << std::endl;\n    return 0;\n}`
    },
    {
      id: 'c',
      name: 'C',
      ext: '.c',
      color: 'text-purple-500',
      sample: `#include <stdio.h>\n\nint main() {\n    printf("Native C execution engine running.\\n");\n    return 0;\n}`
    },
    {
      id: 'html',
      name: 'HTML',
      ext: '.html',
      color: 'text-red-500',
      sample: `<!DOCTYPE html>\n<html lang="en">\n  <head><title>Nexus</title></head>\n  <body>\n    <h1>Browser IDE App</h1>\n  </body>\n</html>`
    },
    {
      id: 'css',
      name: 'CSS',
      ext: '.css',
      color: 'text-sky-500',
      sample: `:root {\n  --brand-color: #4F8CFF;\n}\n\n.code-editor {\n  font-family: 'JetBrains Mono', monospace;\n}`
    },
    {
      id: 'sql',
      name: 'SQL',
      ext: '.sql',
      color: 'text-indigo-500',
      sample: `SELECT u.id, u.username, COUNT(p.id) as total_projects\nFROM users u\nLEFT JOIN projects p ON u.id = p.owner_id\nGROUP BY u.id;\n`
    },
    {
      id: 'json',
      name: 'JSON',
      ext: '.json',
      color: 'text-teal-500',
      sample: `{\n  "name": "nexus-ide",\n  "version": "2.8.0",\n  "runtime": "wasm-v8",\n  "polyglot": true\n}`
    }
  ];

  const currentLang = languages.find(l => l.id === selectedLang) || languages[0];

  return (
    <section id="languages" className="py-24 bg-background relative scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono font-semibold text-brand-primary uppercase tracking-wider mb-3">
            Multi-Language Sandbox
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
            One workspace. Multiple languages.
          </h2>
          <p className="text-base sm:text-lg text-secondary-text leading-relaxed">
            Write, compile, and execute frontend, backend, database, and system languages directly inside your browser.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
          {languages.map((lang) => {
            const isSelected = selectedLang === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => setSelectedLang(lang.id)}
                className={`p-4 rounded-xl border font-mono text-xs sm:text-sm font-medium transition-all duration-200 flex flex-col items-center gap-2 group ${
                  isSelected
                    ? 'bg-surface border-brand-primary text-foreground shadow-md'
                    : 'bg-secondary-bg/50 border-border text-secondary-text hover:text-foreground hover:bg-surface hover:border-border'
                }`}
              >
                <div className={`text-xs font-bold uppercase ${isSelected ? lang.color : 'text-muted-text group-hover:' + lang.color}`}>
                  {lang.ext}
                </div>
                <span>{lang.name}</span>
              </button>
            );
          })}
        </div>

        <div className="max-w-4xl mx-auto rounded-2xl bg-surface border border-border overflow-hidden shadow-xl">
          <div className="flex items-center justify-between px-4 py-3 bg-secondary-bg border-b border-border font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className={`font-bold ${currentLang.color}`}>{currentLang.name}</span>
              <span className="text-muted-text">main{currentLang.ext}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-text">
              <span className="w-2 h-2 rounded-full bg-status-success"></span>
              <span>Syntax Engine Ready</span>
            </div>
          </div>
          <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto bg-surface text-foreground">
            <pre className="whitespace-pre">{currentLang.sample}</pre>
          </div>
        </div>
      </div>
    </section>
  );
}
