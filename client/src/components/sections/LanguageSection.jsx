import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Terminal, Cpu, Check, Sparkles } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function LanguageSection() {
  const languages = [
    { id: 'react', name: 'React (JSX)', ext: 'jsx', runtime: 'React 18 & Babel Live Engine', snippet: `export default function App() {\n  const [count, setCount] = useState(0);\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Clicked {count} times\n    </button>\n  );\n}` },
    { id: 'typescript', name: 'TypeScript', ext: 'ts', runtime: 'Node.js v20.11', snippet: `type User = { id: string; name: string };\nconst fetchUser = async (id: string): Promise<User> => {\n  return { id, name: "Alex Developer" };\n};` },
    { id: 'python', name: 'Python', ext: 'py', runtime: 'Python 3.12.2', snippet: `def calculate_fibonacci(n: int) -> list[int]:\n    sequence = [0, 1]\n    for i in range(2, n):\n        sequence.append(sequence[-1] + sequence[-2])\n    return sequence` },
    { id: 'kotlin', name: 'Kotlin', ext: 'kt', runtime: 'Kotlin 1.9 JVM', snippet: `fun main() {\n    val tech = listOf("Android", "JVM", "Coroutines")\n    tech.forEach { println("Kotlin Stack: $it") }\n}` },
    { id: 'swift', name: 'Swift', ext: 'swift', runtime: 'Swift 5.8 Compiler', snippet: `import Foundation\n\nlet features = ["SwiftUI", "Combine", "Concurrency"]\nfeatures.forEach { print("Swift Feature: \\($0)") }` },
    { id: 'cpp', name: 'C++', ext: 'cpp', runtime: 'GCC 13.2.0', snippet: `#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<std::string> stack = {"WASM", "C++", "V8"};\n    std::cout << "DEVSPACE Native Compiler" << std::endl;\n    return 0;\n}` },
    { id: 'javascript', name: 'JavaScript', ext: 'js', runtime: 'V8 Engine v12', snippet: `const pipeline = [1, 2, 3, 4, 5]\n  .map(x => x * 2)\n  .filter(x => x > 4);\nconsole.log({ pipeline });` },
    { id: 'html', name: 'HTML & CSS', ext: 'html', runtime: 'Browser DOM Engine', snippet: `<div class="editor-canvas">\n  <h1 className="text-brand">Browser Native IDE</h1>\n  <button class="cta-btn">Run Engine</button>\n</div>` },
    { id: 'sql', name: 'SQL Query', ext: 'sql', runtime: 'SQLite WASM', snippet: `SELECT id, project_name, execution_time_ms\nFROM build_logs\nWHERE status = 'SUCCESS'\nORDER BY execution_time_ms ASC\nLIMIT 10;` }
  ];

  const [selectedLang, setSelectedLang] = useState(languages[0]);

  return (
    <section id="languages" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-border-subtle bg-bg-primary relative">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <Badge variant="accent" dot={true}>SECTION 05 — LANGUAGES</Badge>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary">
            Multi-language by default.
          </h2>
          <p className="text-text-secondary text-sm sm:text-base font-sans">
            First-class language servers and runtime bindings for every major programming stack. Switch languages seamlessly with dedicated syntax highlighting and instant compilation.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
          {languages.map(lang => (
            <button
              key={lang.id}
              onClick={() => setSelectedLang(lang)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-medium border transition-all duration-150 cursor-pointer ${
                selectedLang.id === lang.id
                  ? 'bg-brand-primary text-white border-brand-primary shadow-sm shadow-brand-primary/30'
                  : 'bg-surface border-border-main text-text-secondary hover:text-text-primary hover:border-brand-primary/40'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>

        <div className="max-w-4xl mx-auto rounded-xl bg-surface border border-border-main shadow-2xl overflow-hidden font-mono text-xs">
          <div className="px-4 py-3 bg-bg-deep border-b border-border-main flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
              <span className="font-semibold text-text-primary">main.{selectedLang.ext}</span>
            </div>
            <div className="flex items-center gap-2 text-text-muted text-[11px]">
              <Cpu className="w-3.5 h-3.5 text-brand-primary" />
              <span>{selectedLang.runtime}</span>
            </div>
          </div>

          <motion.div
            key={selectedLang.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="p-6 bg-surface text-emerald-400 overflow-x-auto min-h-[180px] leading-relaxed"
          >
            <pre><code>{selectedLang.snippet}</code></pre>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
