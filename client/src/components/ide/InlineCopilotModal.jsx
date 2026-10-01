import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, X, Check, RefreshCw, Code, AlertTriangle, Cpu } from 'lucide-react';
import { sendInlineAICompletionApi, getStoredGroqModel } from '../../services/aiService';

export function InlineCopilotModal({
  isOpen,
  onClose,
  activeFile,
  activeCode,
  selectedCode = '',
  onApplyCode
}) {
  const [promptInput, setPromptInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [proposedCode, setProposedCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState(getStoredGroqModel());
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setPromptInput('');
      setProposedCode('');
      setErrorMessage('');
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSubmitPrompt = async (customPrompt) => {
    const query = (customPrompt || promptInput).trim();
    if (!query || isLoading) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await sendInlineAICompletionApi({
        prompt: query,
        selectedCode,
        activeCode,
        language: activeFile?.language || 'javascript',
        fileName: activeFile?.name || 'untitled',
        model: selectedModel
      });

      setProposedCode(res.code || '');
    } catch (err) {
      setErrorMessage(err.message || 'Inline AI assistant request failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptCode = () => {
    if (proposedCode && onApplyCode) {
      onApplyCode(proposedCode);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-mono select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-2xl bg-surface-elevated border border-purple-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
        >
          <div className="p-3.5 px-4 bg-bg-deep border-b border-border-main flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-text-primary tracking-tight">VS Code Inline Copilot</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    GROQ AI
                  </span>
                </div>
                <div className="text-[10px] text-text-muted flex items-center gap-1.5 mt-0.5">
                  <Cpu className="w-3 h-3 text-purple-400" />
                  <span>Target: {activeFile?.name || 'Active Editor'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-surface hover:bg-surface-elevated border border-border-main text-text-muted hover:text-text-primary transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-3 bg-bg-deep/40 font-sans">
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <button
                onClick={() => handleSubmitPrompt('Fix any syntax, logical, or runtime errors in this code.')}
                className="px-2.5 py-1 rounded-full bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold transition-colors cursor-pointer"
              >
                🐞 Fix Error
              </button>
              <button
                onClick={() => handleSubmitPrompt('Refactor this code to be modern, concise, and clean.')}
                className="px-2.5 py-1 rounded-full bg-surface hover:bg-surface-elevated border border-border-main text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                🚀 Refactor Code
              </button>
              <button
                onClick={() => handleSubmitPrompt('Add error handling and input validation to this code.')}
                className="px-2.5 py-1 rounded-full bg-surface hover:bg-surface-elevated border border-border-main text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                🛡️ Add Error Handling
              </button>
              <button
                onClick={() => handleSubmitPrompt('Optimize this code for speed and low memory usage.')}
                className="px-2.5 py-1 rounded-full bg-surface hover:bg-surface-elevated border border-border-main text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                ⚡ Speed Optimize
              </button>
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); handleSubmitPrompt(); }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Ask Copilot to generate, edit, or transform code..."
                className="flex-1 bg-surface border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-purple-500 font-mono shadow-inner"
              />
              <button
                type="submit"
                disabled={!promptInput.trim() || isLoading}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer shadow-md shadow-purple-600/20"
              >
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Generate</span>
              </button>
            </form>

            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-status-error/10 border border-status-error/30 text-status-error text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {proposedCode && (
              <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-purple-400 font-mono flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5" />
                    <span>Proposed AI Code Changes:</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAcceptCode}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept & Replace</span>
                    </button>
                    <button
                      onClick={() => setProposedCode('')}
                      className="px-2.5 py-1 rounded-lg bg-surface hover:bg-surface-elevated border border-border-main text-text-secondary text-xs cursor-pointer"
                    >
                      Discard
                    </button>
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto rounded-xl bg-bg-deep border border-border-main p-3 font-mono text-[11px] text-emerald-300 leading-relaxed no-scrollbar">
                  <pre><code>{proposedCode}</code></pre>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
