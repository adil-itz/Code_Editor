import React, { useState } from 'react';
import { Edit3, Play, Layers, FolderTree, Activity, Keyboard, Sparkles, Terminal, Code2, CheckCircle2, Shield } from 'lucide-react';
import { FeatureCard } from './FeatureCard';

export function Features() {
  const [activeAnnotation, setActiveAnnotation] = useState('editor');

  const featureList = [
    {
      icon: Edit3,
      title: 'Write Freely',
      description: 'Powerful editing experience with syntax highlighting, auto-formatting, line operations, and developer-focused controls.',
      tag: 'Editor'
    },
    {
      icon: Play,
      title: 'Run Instantly',
      description: 'Execute code in isolated, zero-latency sandbox environments without leaving your workspace or setting up local runtimes.',
      tag: 'Runtime'
    },
    {
      icon: Layers,
      title: 'Multiple Languages',
      description: 'Work seamlessly across JavaScript, TypeScript, Python, C++, Java, Rust, Go, HTML, CSS, SQL, and JSON from one workspace.',
      tag: 'Polyglot'
    },
    {
      icon: FolderTree,
      title: 'File Management',
      description: 'Create, organize, rename, duplicate, and manage multi-file project structures with effortless drag-and-drop hierarchy.',
      tag: 'Filesystem'
    },
    {
      icon: Activity,
      title: 'Real-Time Output',
      description: 'See live execution results, console logs, network responses, and detailed stack trace errors immediately as you code.',
      tag: 'Output'
    },
    {
      icon: Keyboard,
      title: 'Developer First',
      description: 'Keyboard-first command palette, customizable keybindings, distraction-free zenith mode, and instant hotkeys for max velocity.',
      tag: 'Workflow'
    }
  ];

  const annotations = [
    { id: 'files', label: 'File Management', icon: FolderTree, desc: 'Hierarchical tree with instant file ops' },
    { id: 'editor', label: 'Syntax Highlighting', icon: Edit3, desc: 'Grammar-aware token styling & linting' },
    { id: 'execution', label: 'Real-Time Execution', icon: Play, desc: 'Sub-50ms browser runtime compiler' },
    { id: 'terminal', label: 'Integrated Terminal', icon: Terminal, desc: 'Authentic ANSI stream terminal output' }
  ];

  return (
    <section id="features" className="py-24 bg-background relative scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono font-semibold text-brand-primary uppercase tracking-wider mb-3">
            Core Platform Capability
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
            Everything you need to build.
          </h2>
          <p className="text-base sm:text-lg text-secondary-text leading-relaxed">
            A focused development environment designed around the tools and workflows developers use every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-28">
          {featureList.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              tag={feature.tag}
            />
          ))}
        </div>

        <div className="rounded-3xl bg-secondary-bg/40 border border-border p-6 sm:p-10 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8 border-b border-border pb-6">
            <div>
              <div className="text-xs font-mono font-semibold text-brand-accent uppercase tracking-wider mb-1">
                Precision UX
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                A workspace designed for focus.
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {annotations.map((item) => {
                const Icon = item.icon;
                const isActive = activeAnnotation === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveAnnotation(item.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                      isActive
                        ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                        : 'bg-surface text-secondary-text border-border hover:border-brand-primary/40 hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 rounded-2xl bg-surface border border-border p-4 sm:p-6 shadow-xl relative font-mono text-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-border text-muted-text">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-brand-primary" />
                  <span className="font-semibold text-foreground">workspace_main.ts</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary text-[10px]">
                    {annotations.find(a => a.id === activeAnnotation)?.label}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-secondary-text leading-relaxed">
                <div className="text-muted-text">// Nexus Engine Initialization</div>
                <div className="flex gap-2">
                  <span className="text-muted-text w-4">1</span>
                  <span><span className="text-purple-500 dark:text-purple-400 font-semibold">import</span> &#123; <span className="text-blue-500">VirtualFileSystem</span>, <span className="text-blue-500">WasmRuntime</span> &#125; <span className="text-purple-500">from</span> <span className="text-emerald-600">'@nexus/core'</span>;</span>
                </div>
                <div className="flex gap-2 bg-brand-primary/10 -mx-4 px-4 py-1 rounded">
                  <span className="text-muted-text w-4">2</span>
                  <span><span className="text-purple-500 font-semibold">const</span> <span className="text-blue-500">runtime</span> = <span className="text-purple-500 font-semibold">new</span> <span className="text-yellow-600">WasmRuntime</span>(&#123; <span className="text-cyan-600">threads</span>: <span className="text-emerald-600">4</span>, <span className="text-cyan-600">memoryMB</span>: <span className="text-emerald-600">1024</span> &#125;);</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-text w-4">3</span>
                  <span><span className="text-purple-500 font-semibold">await</span> <span className="text-blue-500">runtime</span>.<span className="text-yellow-600">mountDrive</span>(<span className="text-emerald-600">'/workspace'</span>);</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-text w-4">4</span>
                  <span><span className="text-sky-600">console</span>.<span className="text-yellow-600">info</span>(<span className="text-emerald-600">"✓ Nexus workspace ready"</span>);</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {annotations.map((item) => {
                const Icon = item.icon;
                const isActive = activeAnnotation === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveAnnotation(item.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-surface border-brand-primary shadow-md'
                        : 'bg-surface/50 border-border hover:bg-surface hover:border-border'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <div className={`p-1.5 rounded-lg ${isActive ? 'bg-brand-primary text-white' : 'bg-secondary-bg text-secondary-text'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="font-semibold text-sm text-foreground">{item.label}</h4>
                    </div>
                    <p className="text-xs text-secondary-text pl-9">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
