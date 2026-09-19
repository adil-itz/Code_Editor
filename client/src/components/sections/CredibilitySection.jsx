import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Code, Cpu, Shield, Zap, Check } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function CredibilitySection() {
  const roles = [
    { id: 'fullstack', title: 'Fullstack Engineers', focus: 'Multi-language backend microservices & API testbeds.', stat: '< 40ms Cold Start' },
    { id: 'frontend', title: 'UI / UX Engineers', focus: 'Rapid prototyping, Tailwind styling, component sandbox.', stat: '60 FPS Canvas Sync' },
    { id: 'indie', title: 'Indie Hackers', focus: 'Building MVPs, instant deployment, zero server costs.', stat: '100% In-Browser' },
    { id: 'systems', title: 'Systems Programmers', focus: 'C++, Rust, WASM compilation without local toolchains.', stat: 'POSIX Shell Sandboxing' }
  ];

  const [activeRole, setActiveRole] = useState(roles[0]);

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-border-subtle bg-bg-deep relative">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <Badge variant="accent" dot={true}>SECTION 10 — CREDIBILITY</Badge>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary">
            Built for people who ship.
          </h2>
          <p className="text-text-secondary text-sm sm:text-base font-sans">
            Engineered for developers who demand instant feedback, precision typography, and zero configuration friction.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
          {roles.map(r => (
            <button
              key={r.id}
              onClick={() => setActiveRole(r)}
              className={`p-5 rounded-xl border text-left space-y-3 transition-all cursor-pointer ${
                activeRole.id === r.id
                  ? 'bg-surface-elevated border-brand-primary shadow-lg shadow-brand-primary/10'
                  : 'bg-surface border-border-main hover:border-border-main'
              }`}
            >
              <div className="text-xs font-mono font-bold text-brand-primary">{r.stat}</div>
              <div className="text-base font-bold text-text-primary">{r.title}</div>
              <div className="text-xs text-text-muted">{r.focus}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
