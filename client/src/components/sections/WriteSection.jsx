import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Zap, Check, Sparkles, Layers } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function WriteSection() {
  const [activeTab, setActiveTab] = useState('editor');
  const [activeSnippet, setActiveSnippet] = useState(0);

  const snippets = [
    {
      title: 'React & TypeScript',
      file: 'App.tsx',
      code: `import React, { useState, useEffect } from "react";\n\nexport function Component() {\n  const [data, setData] = useState<string[]>([]);\n  return <div className="p-4">{data.length} items</div>;\n}`
    },
    {
      title: 'Python Async API',
      file: 'main.py',
      code: `import asyncio\nfrom fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/api/v1/health")\nasync def health_check():\n    return {"status": "ok", "latency": 1.2}`
    },
    {
      title: 'Rust Micro-service',
      file: 'main.rs',
      code: `use actix_web::{get, App, HttpServer, Responder};\n\n#[get("/")]\nasync fn index() -> impl Responder {\n    "DEVSPACE Rust Engine Active"\n}`
    }
  ];

  return (
    <section id="product" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border-subtle bg-bg-primary relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 space-y-6">
          <Badge variant="accent" dot={true}>SECTION 01 — WRITE</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-primary leading-tight">
            Write without leaving your flow.
          </h2>
          <p className="text-text-secondary text-base font-sans leading-relaxed">
            Engineered with JetBrains Mono typography, instant syntax parsing, intelligent autocomplete, and multi-file tab switching. Experience native editor performance directly inside standard browser engines.
          </p>

          <div className="space-y-3 pt-2">
            {snippets.map((snip, idx) => (
              <button
                key={snip.file}
                onClick={() => setActiveSnippet(idx)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                  activeSnippet === idx
                    ? 'bg-surface-elevated border-brand-primary/50 shadow-md shadow-brand-primary/10'
                    : 'bg-surface/50 border-border-main hover:border-border-main hover:bg-surface'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg font-mono text-xs ${activeSnippet === idx ? 'bg-brand-primary/15 text-brand-primary' : 'bg-surface text-text-muted'}`}>
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text-primary">{snip.title}</div>
                    <div className="text-xs font-mono text-text-muted">{snip.file}</div>
                  </div>
                </div>
                {activeSnippet === idx && <Check className="w-4 h-4 text-brand-primary" />}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-xl bg-surface border border-border-main shadow-2xl overflow-hidden">
            <div className="px-4 py-3 bg-bg-deep border-b border-border-main flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
                <span className="text-text-primary font-medium">{snippets[activeSnippet].file}</span>
              </div>
              <span className="text-text-muted">UTF-8 • Indent: 2</span>
            </div>

            <div className="p-6 bg-surface font-mono text-xs overflow-x-auto min-h-[260px] text-text-primary leading-relaxed">
              <pre className="text-emerald-400">
                <code>{snippets[activeSnippet].code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
