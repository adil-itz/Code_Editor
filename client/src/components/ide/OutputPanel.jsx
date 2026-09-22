import React, { useState, useRef, useEffect } from 'react';
import { Cpu, Clock, CheckCircle2, RefreshCw, CornerDownLeft, Terminal as TerminalIcon } from 'lucide-react';

export function OutputPanel({ 
  output, 
  isRunning, 
  executionTime, 
  isWaitingForInput = false, 
  inputPromptText = '', 
  onSubmitInput 
}) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isWaitingForInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isWaitingForInput]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [output, isWaitingForInput]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!onSubmitInput) return;
    onSubmitInput(inputValue);
    setInputValue('');
  };

  if (isRunning) {
    return (
      <div className="h-full bg-bg-deep p-6 flex items-center justify-center gap-3 font-mono text-xs text-brand-primary">
        <RefreshCw className="w-5 h-5 animate-spin" />
        <span>Executing code on Judge0 compiler engine...</span>
      </div>
    );
  }

  if (!output || output.length === 0) {
    return (
      <div className="h-full bg-bg-deep p-6 flex flex-col items-center justify-center text-center font-mono text-xs text-text-muted space-y-2">
        <Cpu className="w-8 h-8 opacity-40 text-brand-primary" />
        <p>No execution output available yet.</p>
        <p className="text-[11px] text-text-muted/60">Click "▶ Run" to execute code via Judge0.</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full bg-bg-deep p-4 font-mono text-xs overflow-y-auto space-y-3 select-text">
      {executionTime && (
        <div className="flex items-center gap-4 text-[11px] text-text-muted pb-2 border-b border-border-main/50">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-brand-primary" />
            <span>Time: {executionTime} ms</span>
          </span>
          <span className="flex items-center gap-1 text-status-success">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Status: Accepted</span>
          </span>
        </div>
      )}

      {output.map((item, idx) => (
        <div 
          key={idx}
          className={`p-3 rounded-xl border whitespace-pre-wrap leading-relaxed ${
            item.type === 'error' 
              ? 'bg-status-error/10 border-status-error/30 text-status-error' 
              : item.type === 'result'
                ? 'bg-brand-primary/10 border-brand-primary/30 text-text-primary'
                : 'bg-surface border-border-main text-text-primary'
          }`}
        >
          {item.text}
        </div>
      ))}

      {isWaitingForInput && (
        <form 
          onSubmit={handleSubmit}
          className="mt-3 p-3.5 rounded-xl border border-brand-primary/50 bg-brand-primary/10 flex flex-col gap-2.5 shadow-lg animate-fade-in"
        >
          <div className="flex items-center gap-2 text-brand-primary font-bold text-[11px] uppercase tracking-wider">
            <TerminalIcon className="w-4 h-4 animate-pulse" />
            <span>Program Waiting For User Input (stdin)</span>
          </div>

          {inputPromptText && (
            <div className="text-text-primary font-semibold bg-bg-deep/70 px-3 py-2 rounded-lg border border-border-main">
              {inputPromptText}
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your input value here and press Enter..."
              className="flex-1 bg-surface border border-border-main rounded-lg px-3 py-2 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary font-mono text-xs shadow-inner"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-lg bg-brand-primary hover:bg-brand-hover text-bg-deep font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shrink-0 shadow-md"
            >
              <span>Submit</span>
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

