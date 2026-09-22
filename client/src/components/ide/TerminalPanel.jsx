import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Trash2, CornerDownLeft } from 'lucide-react';

export function TerminalPanel({ 
  project, 
  activeFile, 
  files, 
  onRunCode,
  isWaitingForInput = false,
  inputPromptText = '',
  onSubmitInput,
  output = []
}) {
  const [history, setHistory] = useState([
    { type: 'sys', text: `DEVSPACE Virtual Terminal v2.0.0 [Project: ${project?.name || 'Workspace'}]` },
    { type: 'sys', text: 'Type "help" for a list of supported virtual workspace commands.' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const bottomRef = useRef(null);
  const terminalInputRef = useRef(null);
  const lastOutputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isWaitingForInput]);

  useEffect(() => {
    if (isWaitingForInput && terminalInputRef.current) {
      terminalInputRef.current.focus();
    }
  }, [isWaitingForInput]);

  useEffect(() => {
    if (!output || output.length === 0) return;
    if (isWaitingForInput) return;

    const outputKey = JSON.stringify(output);
    if (lastOutputRef.current === outputKey) return;
    lastOutputRef.current = outputKey;

    setHistory(prev => {
      const formattedItems = output.map(item => ({
        type: item.type === 'error' ? 'err' : 'res',
        text: item.text
      }));
      return [...prev, ...formattedItems];
    });
  }, [output, isWaitingForInput]);

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd && !isWaitingForInput) return;

    if (isWaitingForInput) {
      setHistory(prev => [
        ...prev,
        { type: 'cmd', text: `[stdin] ${inputPromptText ? inputPromptText + ' ' : ''}${inputVal}` }
      ]);
      if (onSubmitInput) {
        onSubmitInput(inputVal);
      }
      setInputVal('');
      return;
    }

    const newHistory = [...history, { type: 'cmd', text: `$ ${cmd}` }];
    const parts = cmd.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    if (mainCmd === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    }

    if (mainCmd === 'help') {
      newHistory.push({
        type: 'sys',
        text: 'Available Commands:\n  help        - Show available commands\n  clear       - Clear terminal output\n  pwd         - Show current working directory path\n  ls          - List project workspace files\n  cat <file>  - Display file contents\n  echo <text> - Print text to console\n  run         - Execute current active file via Judge0\n  status      - Display project environment status'
      });
    } else if (mainCmd === 'pwd') {
      newHistory.push({ type: 'res', text: `/workspace/projects/${project?.id || project?._id || 'root'}` });
    } else if (mainCmd === 'ls') {
      const fileNames = files.map(f => f.path || f.name).join('  ');
      newHistory.push({ type: 'res', text: fileNames || 'No files found in project.' });
    } else if (mainCmd === 'cat') {
      if (!arg) {
        newHistory.push({ type: 'err', text: 'Usage: cat <filename>' });
      } else {
        const found = files.find(f => f.name.toLowerCase() === arg.toLowerCase() || f.path.toLowerCase() === arg.toLowerCase());
        if (found) {
          newHistory.push({ type: 'res', text: found.sourceCode || '(empty file)' });
        } else {
          newHistory.push({ type: 'err', text: `cat: ${arg}: No such file` });
        }
      }
    } else if (mainCmd === 'echo') {
      newHistory.push({ type: 'res', text: arg });
    } else if (mainCmd === 'run' || mainCmd === 'node' || mainCmd === 'python') {
      newHistory.push({ type: 'sys', text: `Executing active target ${activeFile?.name || 'file'}...` });
      if (onRunCode) onRunCode();
    } else if (mainCmd === 'status') {
      newHistory.push({ 
        type: 'res', 
        text: `Project: ${project?.name}\nFiles Count: ${files.length}\nActive File: ${activeFile?.name || 'None'}\nBackend Engine: Judge0 Connected\nStatus: Ready` 
      });
    } else {
      newHistory.push({ type: 'err', text: `command not found: ${mainCmd}. Type "help" for options.` });
    }

    setHistory(newHistory);
    setInputVal('');
  };

  return (
    <div className="h-full bg-bg-deep flex flex-col font-mono text-xs select-none">
      <div className="p-2 border-b border-border-main flex items-center justify-between bg-surface-elevated">
        <div className="flex items-center gap-2 text-text-muted">
          <TerminalIcon className="w-3.5 h-3.5 text-brand-primary" />
          <span className="font-bold text-[11px] uppercase tracking-wider text-text-primary">Virtual Terminal</span>
          {isWaitingForInput && (
            <span className="text-[10px] font-bold text-brand-primary bg-brand-primary/10 border border-brand-primary/30 px-2 py-0.5 rounded animate-pulse">
              Input Needed
            </span>
          )}
        </div>
        <button
          onClick={() => setHistory([])}
          title="Clear Terminal"
          className="p-1 rounded hover:bg-surface text-text-muted hover:text-text-primary transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 p-3 overflow-y-auto space-y-2 select-text">
        {history.map((item, index) => (
          <div key={index} className="whitespace-pre-wrap leading-relaxed">
            {item.type === 'cmd' && <span className="text-brand-primary font-bold">{item.text}</span>}
            {item.type === 'sys' && <span className="text-status-info">{item.text}</span>}
            {item.type === 'res' && <span className="text-text-primary">{item.text}</span>}
            {item.type === 'err' && <span className="text-status-error">{item.text}</span>}
          </div>
        ))}

        {isWaitingForInput && (
          <div className="text-brand-primary font-semibold py-1 flex items-center gap-1.5">
            <span>{inputPromptText || 'Enter input:'}</span>
          </div>
        )}

        <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 pt-1">
          {isWaitingForInput ? (
            <span className="text-brand-primary font-bold text-xs bg-brand-primary/20 px-1.5 py-0.5 rounded">
              Input &gt;
            </span>
          ) : (
            <span className="text-brand-primary font-bold">$</span>
          )}
          <input
            ref={terminalInputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={isWaitingForInput ? "Type input value and press Enter..." : "Type command here..."}
            className="flex-1 bg-transparent text-text-primary focus:outline-none font-mono text-xs"
          />
          {isWaitingForInput && (
            <button type="submit" className="text-brand-primary hover:text-brand-hover p-1">
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </form>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

