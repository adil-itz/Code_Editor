import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Folder, FolderOpen, FileCode, FileText, ChevronRight, ChevronDown, Layers, Box } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function ProjectSection() {
  const [expanded, setExpanded] = useState({
    src: true,
    components: true,
    utils: false
  });

  const toggle = (key) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-border-subtle bg-bg-deep relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7 order-2 lg:order-1">
          <div className="rounded-xl bg-surface border border-border-main shadow-2xl overflow-hidden font-mono text-xs">
            <div className="px-3 sm:px-4 py-3 bg-surface-elevated border-b border-border-main flex items-center justify-between text-text-muted text-[11px] sm:text-xs">
              <span className="truncate">PROJECT TREE ARCHITECTURE</span>
              <span className="shrink-0">12 Files • 4 Folders</span>
            </div>

            <div className="p-3 sm:p-4 bg-surface space-y-1 overflow-x-auto">
              <div className="flex items-center gap-2 p-1.5 rounded bg-surface-elevated text-brand-primary font-bold">
                <FolderOpen className="w-4 h-4 text-amber-400 shrink-0" />
                <span>devspace-app</span>
              </div>

              <div className="pl-4 space-y-1 border-l border-border-subtle ml-3">
                <div>
                  <button onClick={() => toggle('src')} className="flex items-center gap-2 p-1 hover:bg-surface-elevated rounded w-full text-left cursor-pointer">
                    {expanded.src ? <ChevronDown className="w-3.5 h-3.5 text-text-muted" /> : <ChevronRight className="w-3.5 h-3.5 text-text-muted" />}
                    <Folder className="w-4 h-4 text-amber-400" />
                    <span className="text-text-primary font-semibold">src</span>
                  </button>

                  {expanded.src && (
                    <div className="pl-4 space-y-1 border-l border-border-subtle ml-3 mt-1">
                      <div>
                        <button onClick={() => toggle('components')} className="flex items-center gap-2 p-1 hover:bg-surface-elevated rounded w-full text-left cursor-pointer">
                          {expanded.components ? <ChevronDown className="w-3.5 h-3.5 text-text-muted" /> : <ChevronRight className="w-3.5 h-3.5 text-text-muted" />}
                          <Folder className="w-4 h-4 text-amber-400" />
                          <span className="text-text-primary">components</span>
                        </button>
                        {expanded.components && (
                          <div className="pl-4 space-y-1 border-l border-border-subtle ml-3 text-text-secondary">
                            <div className="flex items-center gap-2 p-1 hover:bg-surface-elevated rounded"><FileCode className="w-3.5 h-3.5 text-blue-400" /> Navbar.tsx</div>
                            <div className="flex items-center gap-2 p-1 hover:bg-surface-elevated rounded"><FileCode className="w-3.5 h-3.5 text-blue-400" /> Editor.tsx</div>
                            <div className="flex items-center gap-2 p-1 hover:bg-surface-elevated rounded"><FileCode className="w-3.5 h-3.5 text-blue-400" /> Terminal.tsx</div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 p-1 text-text-secondary"><FileCode className="w-3.5 h-3.5 text-blue-400" /> App.tsx</div>
                      <div className="flex items-center gap-2 p-1 text-text-secondary"><FileCode className="w-3.5 h-3.5 text-brand-primary" /> styles.css</div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 p-1 text-text-secondary"><FileText className="w-3.5 h-3.5 text-amber-400" /> package.json</div>
                <div className="flex items-center gap-2 p-1 text-text-secondary"><FileText className="w-3.5 h-3.5 text-text-muted" /> tsconfig.json</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
          <Badge variant="accent" dot={true}>SECTION 04 — MANAGE</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-primary leading-tight">
            Your entire project. One workspace.
          </h2>
          <p className="text-text-secondary text-base font-sans leading-relaxed">
            Full virtual filesystem capabilities in memory. Drag and drop assets, edit multi-file projects, manage dependencies with standard package managers, and keep your workspace structured cleanly.
          </p>
        </div>
      </div>
    </section>
  );
}
