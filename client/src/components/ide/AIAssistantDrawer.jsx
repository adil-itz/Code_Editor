import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Bot,
  Send,
  X,
  Trash2,
  Copy,
  Check,
  Code,
  FileCode,
  Cpu,
  Zap,
  Terminal,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import {
  sendAIChatApi,
  getStoredGroqModel,
  setStoredGroqModel
} from '../../services/aiService';

export function AIAssistantDrawer({
  isOpen,
  onClose,
  activeFile,
  activeCode,
  diagnostics = [],
  terminalOutput = '',
  projectName = '',
  onInsertCode,
  onOpenInlineCopilot
}) {
  const [messages, setMessages] = useState(() => [
    {
      id: 'welcome',
      role: 'assistant',
      content: `### 🤖 VS Code Copilot Chat (Groq AI)

I am your AI pair programmer powered by **Groq API**. Ask me anything about your code, debug runtime errors, optimize algorithms, or ask for website guidance!

**Quick Actions:**
- 🐞 **Fix Error**: Auto-diagnose terminal or syntax errors.
- 💡 **Explain Code**: Breakdown active editor logic step-by-step.
- 🚀 **Optimize Code**: Improve performance & clean up code.
- 🧪 **Unit Tests**: Generate unit tests for active file.`
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(getStoredGroqModel());
  const [copiedId, setCopiedId] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleModelSelect = (modelId) => {
    setSelectedModel(modelId);
    setStoredGroqModel(modelId);
  };

  const handleSendMessage = async (textToSend, promptType = 'chat') => {
    const queryText = (textToSend || inputQuery).trim();
    if (!queryText || isLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: queryText
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputQuery('');
    setIsLoading(true);

    const recentError = terminalOutput && (terminalOutput.includes('Error') || terminalOutput.includes('Exception') || terminalOutput.includes('Traceback') || terminalOutput.includes('error'))
      ? terminalOutput.slice(-1200)
      : (diagnostics.length > 0 ? diagnostics.map(d => `${d.message} (Line ${d.line})`).join('\n') : '');

    try {
      const response = await sendAIChatApi({
        messages: newMessages.filter(m => m.id !== 'welcome'),
        activeCode: activeCode || '',
        language: activeFile?.language || '',
        activeFileName: activeFile?.name || '',
        projectContext: {
          projectName,
          lastError: recentError
        },
        model: selectedModel,
        promptType
      });

      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message || 'No response returned.'
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `⚠️ **Copilot Error**: ${err.message}`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (promptText, promptType) => {
    handleSendMessage(promptText, promptType);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `Chat history cleared. How can VS Code Copilot help you now?`
      }
    ]);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end pointer-events-none font-mono">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs pointer-events-auto"
        />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full max-w-lg md:max-w-xl h-full bg-surface-elevated border-l border-border-main shadow-2xl flex flex-col pointer-events-auto z-10 overflow-hidden"
        >
          <div className="p-3 px-4 bg-bg-deep border-b border-border-main flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-xs shadow-purple-500/20">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-text-primary tracking-tight">Copilot Chat</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                    GROQ API
                  </span>
                </div>
                <div className="text-[10px] text-text-muted flex items-center gap-1.5 mt-0.5">
                  <Cpu className="w-3 h-3 text-purple-400" />
                  <select
                    value={selectedModel}
                    onChange={(e) => handleModelSelect(e.target.value)}
                    className="bg-transparent text-[10px] text-text-secondary focus:outline-none cursor-pointer font-sans font-bold"
                  >
                    <option value="qwen/qwen3.8-27b" className="bg-surface text-text-primary">Groq Qwen 27B (Fast & Smart)</option>
                    <option value="openai/gpt-oss-120b" className="bg-surface text-text-primary">Groq GPT OSS 120B (High Reasoning)</option>
                    <option value="openai/gpt-oss-20b" className="bg-surface text-text-primary">Groq GPT OSS 20B (Instant)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {onOpenInlineCopilot && (
                <button
                  onClick={onOpenInlineCopilot}
                  title="Open Inline Copilot (Ctrl+I)"
                  className="px-2 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Zap className="w-3 h-3 text-purple-400" />
                  <span className="hidden sm:inline">Inline Prompt</span>
                </button>
              )}

              <button
                onClick={handleClearHistory}
                title="Clear Chat History"
                className="p-1.5 rounded-lg bg-surface hover:bg-surface-elevated border border-border-main text-text-muted hover:text-status-error transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-surface hover:bg-surface-elevated border border-border-main text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {(activeFile || projectName || terminalOutput) && (
            <div className="px-3.5 py-1.5 bg-bg-deep/70 border-b border-border-main flex items-center gap-2 overflow-x-auto no-scrollbar text-[11px] text-text-muted shrink-0">
              <span className="font-semibold text-purple-400 text-[10px] uppercase tracking-wider shrink-0">Context:</span>
              {activeFile && (
                <span className="px-2 py-0.5 rounded bg-surface border border-border-main flex items-center gap-1 text-text-primary shrink-0">
                  <FileCode className="w-3 h-3 text-purple-400" />
                  <span>{activeFile.name}</span>
                </span>
              )}
              {terminalOutput && (terminalOutput.includes('Error') || terminalOutput.includes('Exception') || terminalOutput.includes('error')) && (
                <span className="px-2 py-0.5 rounded bg-status-error/15 border border-status-error/30 text-status-error flex items-center gap-1 shrink-0 font-bold">
                  <Terminal className="w-3 h-3" />
                  <span>Terminal Error Detected</span>
                </span>
              )}
              {projectName && (
                <span className="px-2 py-0.5 rounded bg-surface border border-border-main text-text-secondary truncate shrink-0">
                  Project: {projectName}
                </span>
              )}
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white font-medium rounded-tr-xs shadow-md'
                    : 'bg-surface-elevated border border-border-main text-text-primary rounded-tl-xs shadow-sm space-y-2'
                }`}>
                  <FormattedMessageContent
                    content={msg.content}
                    onInsertCode={onInsertCode}
                    onCopy={copyToClipboard}
                    copiedId={copiedId}
                    msgId={msg.id}
                  />
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 items-center text-purple-400 text-xs animate-pulse font-mono">
                <div className="w-7 h-7 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                </div>
                <span>Copilot is analyzing code...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-3 py-2 bg-bg-deep/50 border-t border-border-main flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <span className="text-[10px] text-purple-400 font-mono font-bold uppercase shrink-0">Copilot Actions:</span>
            {terminalOutput && (terminalOutput.includes('Error') || terminalOutput.includes('Exception') || terminalOutput.includes('error')) && (
              <button
                onClick={() => handleQuickAction('Diagnose and fix the terminal execution error in my code.', 'fix')}
                className="px-2.5 py-1 rounded-full bg-status-error/15 border border-status-error/30 text-[11px] text-status-error hover:bg-status-error/25 cursor-pointer shrink-0 transition-colors font-bold flex items-center gap-1"
              >
                🐞 Fix Terminal Error
              </button>
            )}
            {activeCode && (
              <>
                <button
                  onClick={() => handleQuickAction(`Explain the code in ${activeFile?.name || 'editor'} step-by-step.`, 'explain')}
                  className="px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-[11px] text-purple-300 hover:bg-purple-500/25 cursor-pointer shrink-0 transition-colors font-bold"
                >
                  💡 Explain Code
                </button>
                <button
                  onClick={() => handleQuickAction('Refactor active code for optimal performance and readability.', 'refactor')}
                  className="px-2.5 py-1 rounded-full bg-surface hover:bg-surface-elevated border border-border-main text-[11px] text-text-secondary hover:text-text-primary cursor-pointer shrink-0 transition-colors"
                >
                  🚀 Optimize Code
                </button>
                <button
                  onClick={() => handleQuickAction('Generate comprehensive unit tests for this code.', 'test')}
                  className="px-2.5 py-1 rounded-full bg-surface hover:bg-surface-elevated border border-border-main text-[11px] text-text-secondary hover:text-text-primary cursor-pointer shrink-0 transition-colors"
                >
                  🧪 Write Tests
                </button>
              </>
            )}
            <button
              onClick={() => handleSendMessage('How do I run, debug, save, and share projects in DEVSPACE?')}
              className="px-2.5 py-1 rounded-full bg-surface hover:bg-surface-elevated border border-border-main text-[11px] text-text-secondary hover:text-text-primary cursor-pointer shrink-0 transition-colors"
            >
              ❓ IDE Help
            </button>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="p-3 bg-bg-deep border-t border-border-main flex items-center gap-2 shrink-0 select-none"
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask Copilot doubt, bug fix, or code generation..."
              className="flex-1 bg-surface border border-border-main rounded-xl px-3.5 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-purple-500 resize-none font-sans"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="w-9 h-9 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer shrink-0 shadow-md shadow-purple-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function FormattedMessageContent({ content, onInsertCode, onCopy, copiedId, msgId }) {
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  let blockCounter = 0;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: content.slice(lastIndex, match.index) });
    }
    parts.push({
      type: 'code',
      language: match[1] || 'text',
      code: match[2].trim(),
      id: `${msgId}-code-${blockCounter++}`
    });
    lastIndex = codeBlockRegex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push({ type: 'text', value: content.slice(lastIndex) });
  }

  return (
    <div className="space-y-2">
      {parts.map((part, idx) => {
        if (part.type === 'text') {
          return (
            <div key={idx} className="whitespace-pre-wrap font-sans text-xs leading-relaxed space-y-1">
              {part.value.split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx}>{paragraph}</p>
              ))}
            </div>
          );
        } else if (part.type === 'code') {
          const isCopied = copiedId === part.id;
          return (
            <div key={idx} className="my-2 bg-bg-deep rounded-xl border border-border-main overflow-hidden font-mono text-xs shadow-xs">
              <div className="px-3 py-1.5 bg-surface border-b border-border-main flex items-center justify-between text-[11px] text-text-muted">
                <span className="font-semibold text-purple-400 capitalize">{part.language || 'code'}</span>
                <div className="flex items-center gap-1.5">
                  {onInsertCode && (
                    <button
                      onClick={() => onInsertCode(part.code)}
                      className="px-2 py-0.5 rounded bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 font-bold border border-purple-500/30 transition-colors flex items-center gap-1 cursor-pointer text-[10px]"
                      title="Insert code into active editor"
                    >
                      <Code className="w-3 h-3" />
                      <span>Insert into Editor</span>
                    </button>
                  )}
                  <button
                    onClick={() => onCopy(part.code, part.id)}
                    className="px-2 py-0.5 rounded bg-surface hover:bg-surface-elevated text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1 cursor-pointer text-[10px]"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-status-success" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>
              <pre className="p-3 overflow-x-auto text-[11px] text-text-primary leading-normal no-scrollbar bg-bg-deep/90">
                <code>{part.code}</code>
              </pre>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
