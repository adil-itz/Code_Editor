import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle2, RefreshCw, Terminal, Cpu, Zap } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function RunSection() {
  const [executionState, setExecutionState] = useState('idle');
  const [logs, setLogs] = useState([
    { time: '0.00s', text: 'Ready for execution task.', type: 'info' }
  ]);

  const handleRunDemo = () => {
    setExecutionState('running');
    setLogs([{ time: '0.01s', text: 'Initializing isolated WebContainer runtime environment...', type: 'info' }]);

    setTimeout(() => {
      setLogs(prev => [
        ...prev,
        { time: '0.04s', text: 'Compiling TypeScript AST & binding native WASM binaries...', type: 'info' }
      ]);
    }, 400);

    setTimeout(() => {
      setLogs(prev => [
        ...prev,
        { time: '0.09s', text: '✓ Execution finished successfully with exit code 0.', type: 'success' },
        { time: '0.10s', text: 'Process heap memory: 18.4MB | CPU cycle time: 1.2ms', type: 'metric' }
      ]);
      setExecutionState('success');
    }, 900);
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-border-subtle bg-bg-deep relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7 order-2 lg:order-1">
          <div className="rounded-xl bg-surface border border-border-main shadow-2xl overflow-hidden font-mono text-xs">
            <div className="px-4 py-3 bg-surface-elevated border-b border-border-main flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-brand-primary shrink-0" />
                <span className="font-semibold text-text-primary truncate">Execution Engine</span>
              </div>
              <Button
                size="sm"
                variant={executionState === 'running' ? 'secondary' : 'primary'}
                onClick={handleRunDemo}
                disabled={executionState === 'running'}
                icon={executionState === 'running' ? RefreshCw : Play}
                className="text-xs"
              >
                {executionState === 'running' ? 'RUNNING...' : 'Run Code'}
              </Button>
            </div>

            <div className="p-3 sm:p-4 space-y-2 min-h-[220px] bg-surface text-text-primary overflow-x-auto">
              {logs.map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-2 sm:gap-3 text-[11px] sm:text-xs"
                >
                  <span className="text-text-muted text-[10px] w-10 sm:w-12 shrink-0">{log.time}</span>
                  <span className={`break-words ${
                    log.type === 'success' ? 'text-status-success font-medium' :
                    log.type === 'metric' ? 'text-brand-primary font-mono' :
                    'text-text-secondary'
                  }`}>
                    {log.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 order-1 lg:order-2 space-y-5 sm:space-y-6">
          <Badge variant="accent" dot={true}>SECTION 02 — RUN</Badge>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary leading-tight">
            Run it instantly.
          </h2>
          <p className="text-text-secondary text-sm sm:text-base font-sans leading-relaxed">
            Execute code inside browser-native WebContainers powered by WebAssembly. Zero round-trips to remote cloud servers for compilation. Sub-millisecond startup times with complete POSIX terminal support.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2 font-mono">
            <div className="p-4 rounded-xl bg-surface border border-border-main">
              <div className="text-2xl font-bold text-brand-primary">&lt; 15ms</div>
              <div className="text-xs text-text-muted mt-1">Cold Start Latency</div>
            </div>
            <div className="p-4 rounded-xl bg-surface border border-border-main">
              <div className="text-2xl font-bold text-status-success">100%</div>
              <div className="text-xs text-text-muted mt-1">Local Sandboxing</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
