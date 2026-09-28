import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bookmark, Play, Copy, Check, Trash2, Search, Share2, Plus, Sparkles, Code2 } from 'lucide-react';
import { fetchSavedSnippetsApi, createSavedSnippetApi, deleteSavedSnippetApi } from '../../services/snippetService';

export function SavedSnippetsModal({ isOpen, onClose, onLoadCode, onShareCode, currentCode = '', currentLanguage = 'javascript', currentTitle = '' }) {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newLang, setNewLang] = useState('javascript');
  const [newCode, setNewCode] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadSnippets();
      setNewTitle(currentTitle || '');
      setNewLang(currentLanguage || 'javascript');
      setNewCode(currentCode || '');
    }
  }, [isOpen, currentTitle, currentLanguage, currentCode]);

  const loadSnippets = async () => {
    setLoading(true);
    try {
      const data = await fetchSavedSnippetsApi();
      setSnippets(Array.isArray(data) ? data : []);
    } catch (err) {
      setSnippets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSnippet = async (e) => {
    e.preventDefault();
    if (!newCode) return;
    try {
      const created = await createSavedSnippetApi({
        title: newTitle || 'Untitled Snippet',
        language: newLang || 'javascript',
        code: newCode
      });
      setSnippets([created, ...snippets]);
      setIsCreating(false);
    } catch (err) {}
  };

  const handleDelete = async (id) => {
    await deleteSavedSnippetApi(id);
    setSnippets(snippets.filter(s => (s.id || s._id) !== id));
  };

  const handleCopy = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSnippets = snippets.filter(item => {
    const q = search.toLowerCase();
    return (
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.language && item.language.toLowerCase().includes(q)) ||
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
                <Bookmark className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-mono font-bold text-text-primary flex items-center gap-2">
                  <span>Saved Code Snippets</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-surface-elevated text-brand-primary border border-border-main">
                    {snippets.length} saved
                  </span>
                </h3>
                <p className="text-[11px] font-mono text-text-muted">
                  Organize, search & load reusable code snippets across projects.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono">
              <button
                onClick={() => setIsCreating(!isCreating)}
                className="px-3 py-1.5 rounded-lg bg-brand-primary text-bg-deep hover:bg-brand-hover text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isCreating ? 'Cancel' : 'Save Current Code'}</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {isCreating && (
            <form onSubmit={handleCreateSnippet} className="p-4 bg-bg-deep border-b border-border-main space-y-3 font-mono text-xs shrink-0">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Snippet Title (e.g. Binary Search Tree)"
                  className="flex-1 bg-surface border border-border-main rounded-xl px-3 py-1.5 text-text-primary focus:outline-none focus:border-brand-primary"
                />
                <select
                  value={newLang}
                  onChange={(e) => setNewLang(e.target.value)}
                  className="bg-surface border border-border-main rounded-xl px-3 py-1.5 text-text-primary focus:outline-none focus:border-brand-primary uppercase font-bold"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="c">C</option>
                  <option value="java">Java</option>
                  <option value="csharp">C#</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="react">React JSX</option>
                  <option value="sql">SQL</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-brand-primary text-bg-deep hover:bg-brand-hover font-bold text-xs cursor-pointer transition-colors"
                >
                  Confirm & Save
                </button>
              </div>
            </form>
          )}

          <div className="p-4 bg-bg-deep border-b border-border-main flex items-center gap-3 shrink-0 font-mono">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search saved code snippets by title, language or code..."
                className="w-full bg-surface border border-border-main rounded-xl pl-9 pr-4 py-1.5 text-xs text-text-primary focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
            {loading ? (
              <div className="col-span-2 text-center p-8 text-text-muted text-xs">Loading saved snippets...</div>
            ) : filteredSnippets.length === 0 ? (
              <div className="col-span-2 text-center p-8 text-text-muted text-xs space-y-2">
                <Bookmark className="w-8 h-8 mx-auto text-border-main" />
                <p>No saved snippets found.</p>
              </div>
            ) : (
              filteredSnippets.map((snippet) => {
                const sId = snippet.id || snippet._id;
                return (
                  <div
                    key={sId}
                    className="p-4 bg-surface border border-border-main hover:border-brand-primary/40 rounded-xl space-y-3 flex flex-col justify-between shadow-lg transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-text-primary text-xs truncate max-w-[200px]">
                          {snippet.title || 'Untitled Snippet'}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-primary/10 border border-brand-primary/30 text-brand-primary rounded-md uppercase">
                          {snippet.language}
                        </span>
                      </div>

                      <pre className="p-2.5 bg-bg-deep rounded-lg text-[11px] text-text-secondary overflow-hidden max-h-28 font-mono border border-border-main/50">
                        <code>{snippet.code}</code>
                      </pre>
                    </div>

                    <div className="pt-2 border-t border-border-main flex items-center justify-between text-xs">
                      <span className="text-[10px] text-text-muted">
                        {new Date(snippet.createdAt || snippet.date || Date.now()).toLocaleDateString()}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopy(sId, snippet.code)}
                          className="p-1.5 rounded-lg bg-surface-elevated hover:bg-surface border border-border-main text-text-primary transition-colors cursor-pointer"
                          title="Copy Code"
                        >
                          {copiedId === sId ? <Check className="w-3.5 h-3.5 text-status-success" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>

                        {onShareCode && (
                          <button
                            onClick={() => {
                              onShareCode(snippet.code, snippet.language, snippet.title);
                              onClose();
                            }}
                            className="p-1.5 rounded-lg bg-surface-elevated hover:bg-surface border border-border-main text-brand-primary transition-colors cursor-pointer"
                            title="Generate Share Link"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {onLoadCode && (
                          <button
                            onClick={() => {
                              onLoadCode(snippet.code, snippet.language);
                              onClose();
                            }}
                            className="px-2.5 py-1 rounded-lg bg-brand-primary hover:bg-brand-hover text-bg-deep font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Load</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(sId)}
                          className="p-1.5 rounded-lg text-text-muted hover:text-status-danger hover:bg-status-danger/10 transition-colors cursor-pointer"
                          title="Delete Snippet"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
