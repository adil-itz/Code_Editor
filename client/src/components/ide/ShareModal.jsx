import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Copy, Check, ExternalLink, Sparkles, Globe, RefreshCw, AlertCircle } from 'lucide-react';
import { createShareLinkApi } from '../../services/shareService';

export function ShareModal({ isOpen, onClose, title = 'Shared Code', language = 'javascript', code = '', files = [], template = 'empty' }) {
  const [shareTitle, setShareTitle] = useState(title);
  const [shareUrl, setShareUrl] = useState('');
  const [shareId, setShareId] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setShareTitle(title || 'Shared Code');
      setShareUrl('');
      setShareId('');
      setError('');
      setCopied(false);
      handleGenerateLink(title || 'Shared Code');
    }
  }, [isOpen, title, language, code, files, template]);

  const handleGenerateLink = async (customTitle) => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        title: customTitle || shareTitle || 'Shared Code',
        language,
        code,
        files: Array.isArray(files) ? files : [],
        template
      };
      const res = await createShareLinkApi(payload);
      if (res && res.shareId) {
        setShareId(res.shareId);
        const fullUrl = `${window.location.origin}/share/${res.shareId}`;
        setShareUrl(fullUrl);
      } else {
        setError('Failed to generate share link.');
      }
    } catch (err) {
      setError(err.message || 'Error generating share link');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-lg bg-surface border border-border-main rounded-2xl shadow-2xl overflow-hidden font-sans"
        >
          <div className="px-6 py-4 bg-bg-deep border-b border-border-main flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-mono font-bold text-text-primary flex items-center gap-1.5">
                  <span>Share Code via Link</span>
                  <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                </h3>
                <p className="text-[11px] font-mono text-text-muted">
                  Generate a shareable public URL to view & run this code.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-mono font-semibold text-text-secondary mb-1.5">
                Snippet Title
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={shareTitle}
                  onChange={(e) => setShareTitle(e.target.value)}
                  placeholder="Enter title..."
                  className="flex-1 bg-bg-deep border border-border-main rounded-lg px-3 py-2 text-xs font-mono text-text-primary focus:outline-none focus:border-brand-primary transition-colors"
                />
                <button
                  onClick={() => handleGenerateLink(shareTitle)}
                  disabled={loading}
                  className="px-3 py-2 bg-surface-elevated hover:bg-surface border border-border-main text-text-primary text-xs font-mono font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Update & Re-generate"
                >
                  {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  <span>Update</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-status-danger/10 border border-status-danger/30 rounded-lg text-status-danger text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono font-semibold text-text-secondary mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-brand-primary" />
                <span>Shareable Link</span>
              </label>

              <div className="flex items-center gap-2 bg-bg-deep border border-border-main rounded-xl p-1.5">
                <input
                  type="text"
                  readOnly
                  value={loading ? 'Generating unique share link...' : shareUrl}
                  className="flex-1 bg-transparent px-3 py-1.5 text-xs font-mono text-brand-primary focus:outline-none select-all truncate"
                />
                <button
                  onClick={handleCopy}
                  disabled={!shareUrl || loading}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 ${
                    copied
                      ? 'bg-status-success text-bg-deep'
                      : 'bg-brand-primary hover:bg-brand-hover text-bg-deep'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {shareUrl && (
              <div className="pt-2 flex items-center justify-between border-t border-border-main text-xs font-mono">
                <span className="text-text-muted text-[11px]">
                  Anyone with this link can view & execute this code live.
                </span>
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-primary hover:text-brand-hover font-semibold flex items-center gap-1 hover:underline"
                >
                  <span>Test Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
