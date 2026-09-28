import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Play, Copy, Check, Terminal, Search, Trash2, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { fetchExecutionHistoryApi } from '../../services/historyService';

export function ExecutionHistoryModal({ isOpen, onClose, onLoadCode }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await fetchExecutionHistoryApi();
      setHistory(Array.isArray(data) ? data : []);
      if (data && data.length > 0) {
        setSelectedItem(data[0]);
      }
    } catch (err) {
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredHistory = history.filter(item => {
    const q = search.toLowerCase();
    return (
      (item.language && item.language.toLowerCase().includes(q)) ||
      (item.status && item.status.toLowerCase().includes(q)) ||
      (item.code && item.code.toLowerCase().includes(q))
    );
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-4xl bg-surface border border-border-main rounded-2xl shadow-2xl overflow-hidden font-sans h-[620px] flex flex-col"
        >
          <div className="px-6 py-4 bg-bg-deep border-b border-border-main flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-mono font-bold text-text-primary flex items-center gap-2">
                  <span>Execution History Logs</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-surface-elevated text-brand-primary border border-border-main">
                    {history.length} records
                  </span>
                </h3>
                <p className="text-[11px] font-mono text-text-muted">
                  View past runtime code execution results, timing & terminal outputs.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadHistory}
                disabled={loading}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors cursor-pointer"
                title="Refresh History"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 bg-bg-deep border-b border-border-main flex items-center gap-3 shrink-0 font-mono">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search history by language, status, or code content..."
                className="w-full bg-surface border border-border-main rounded-xl pl-9 pr-4 py-1.5 text-xs text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            <div className="w-1/3 border-r border-border-main overflow-y-auto p-2 space-y-1.5 font-mono">
              {loading ? (
                <div className="p-6 text-center text-text-muted text-xs">Loading execution history...</div>
              ) : filteredHistory.length === 0 ? (
                <div className="p-6 text-center text-text-muted text-xs">No execution history logs found.</div>
              ) : (
                filteredHistory.map((item, idx) => {
                  const itemId = item.id || item._id || idx;
                  const isSelected = selectedItem && (selectedItem.id || selectedItem._id) === (item.id || item._id);
                  const isError = item.status && item.status.toLowerCase().includes('error');
                  return (
                    <div
                      key={itemId}
                      onClick={() => setSelectedItem(item)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-brand-primary/10 border-brand-primary text-text-primary'
                          : 'bg-surface hover:bg-surface-elevated border-border-main text-text-secondary'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold uppercase text-brand-primary text-[11px]">{item.language}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                          isError ? 'bg-status-danger/15 text-status-danger' : 'bg-status-success/15 text-status-success'
                        }`}>
                          {item.status || 'Executed'}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-muted truncate font-mono">
                        {item.code ? item.code.split('\n')[0] : 'Executed code snippet'}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between text-[10px] text-text-muted">
                        <span>{item.time ? `${item.time} ms` : '0.00 ms'}</span>
                        <span>{new Date(item.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="w-2/3 flex flex-col bg-bg-deep p-4 overflow-hidden font-mono text-xs">
              {selectedItem ? (
                <div className="flex-1 flex flex-col overflow-hidden space-y-4">
                  <div className="flex items-center justify-between bg-surface p-3 rounded-xl border border-border-main shrink-0">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-text-primary uppercase">{selectedItem.language}</span>
                        <span className="text-text-muted">•</span>
                        <span className="text-text-muted">{new Date(selectedItem.createdAt || Date.now()).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-text-muted">
                        <span>Status: <strong className="text-text-primary">{selectedItem.status || 'Executed'}</strong></span>
                        <span>Time: <strong className="text-brand-primary">{selectedItem.time || '0.00'} ms</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(selectedItem.id || selectedItem._id, selectedItem.code)}
                        className="p-2 rounded-lg bg-surface-elevated hover:bg-surface border border-border-main text-text-primary transition-colors cursor-pointer"
                        title="Copy Code"
                      >
                        {copiedId === (selectedItem.id || selectedItem._id) ? <Check className="w-4 h-4 text-status-success" /> : <Copy className="w-4 h-4" />}
                      </button>
                      {onLoadCode && (
                        <button
                          onClick={() => {
                            onLoadCode(selectedItem.code, selectedItem.language);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-lg bg-brand-primary hover:bg-brand-hover text-bg-deep font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Load in Editor</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col min-h-0 bg-surface border border-border-main rounded-xl overflow-hidden">
                    <div className="px-3 py-1.5 bg-bg-deep border-b border-border-main text-[11px] font-bold text-text-muted uppercase">
                      Code Snippet
                    </div>
                    <pre className="flex-1 p-3 overflow-auto text-text-primary bg-bg-primary font-mono text-xs select-text">
                      <code>{selectedItem.code || '// No code saved for this execution'}</code>
                    </pre>
                  </div>

                  {(selectedItem.stdout || selectedItem.stderr || selectedItem.compileOutput) && (
                    <div className="h-32 bg-surface border border-border-main rounded-xl overflow-hidden flex flex-col shrink-0">
                      <div className="px-3 py-1 bg-bg-deep border-b border-border-main text-[11px] font-bold text-text-muted uppercase flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-brand-primary" />
                        <span>Terminal Output Log</span>
                      </div>
                      <div className="p-2.5 overflow-auto flex-1 font-mono text-[11px]">
                        {selectedItem.stdout && <div className="text-text-primary whitespace-pre-wrap">{selectedItem.stdout}</div>}
                        {selectedItem.stderr && <div className="text-status-danger whitespace-pre-wrap">{selectedItem.stderr}</div>}
                        {selectedItem.compileOutput && <div className="text-status-warning whitespace-pre-wrap">{selectedItem.compileOutput}</div>}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-text-muted text-xs gap-2">
                  <Clock className="w-8 h-8 text-border-main" />
                  <span>Select an execution log from the left list to view code details.</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
