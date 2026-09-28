import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Code2, Share2, Sparkles, Eye, Copy, Check, ArrowLeft, User, Calendar, ExternalLink } from 'lucide-react';
import { fetchSharedSnippetApi } from '../services/shareService';
import { OnlineCodeEditor } from '../components/ide/OnlineCodeEditor';

export function SharedCodePage() {
  const { shareId } = useParams();
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function loadSharedSnippet() {
      try {
        setLoading(true);
        setError('');
        const data = await fetchSharedSnippetApi(shareId);
        setSnippet(data);
      } catch (err) {
        setError(err.message || 'Unable to load shared code link.');
      } finally {
        setLoading(false);
      }
    }
    if (shareId) {
      loadSharedSnippet();
    }
  }, [shareId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col items-center justify-center font-mono text-sm gap-3">
        <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
        <span>Loading Shared Code Snippet...</span>
      </div>
    );
  }

  if (error || !snippet) {
    return (
      <div className="min-h-screen bg-bg-primary text-text-primary pt-24 pb-16 px-4 flex flex-col items-center justify-center font-mono text-center">
        <div className="max-w-md p-8 bg-surface border border-border-main rounded-2xl space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-status-danger/10 border border-status-danger/30 flex items-center justify-center text-status-danger">
            <Share2 className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-text-primary">Shared Link Not Found</h2>
          <p className="text-xs text-text-muted">{error || 'This shared code link does not exist or has expired.'}</p>
          <Link
            to="/editor"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-bg-deep font-bold text-xs rounded-xl shadow-md hover:bg-brand-hover transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to Online Editor</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary pt-20 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="bg-surface border border-border-main rounded-2xl p-4 sm:p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-brand-primary/15 border border-brand-primary/30 text-brand-primary text-[11px] font-mono font-bold flex items-center gap-1">
                <Share2 className="w-3 h-3" />
                <span>Shared Snippet</span>
              </span>
              <span className="text-xs font-mono text-text-muted flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-brand-primary" />
                <span>{snippet.views || 1} views</span>
              </span>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-text-primary">
              {snippet.title || 'Shared Code Snippet'}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-text-muted">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-brand-primary" />
                <span>{snippet.authorName || 'Anonymous'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                <span>{new Date(snippet.createdAt).toLocaleDateString()}</span>
              </span>
              <span>•</span>
              <span className="text-brand-primary font-bold uppercase">{snippet.language}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-surface-elevated hover:bg-surface border border-border-main text-text-primary text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-status-success" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            <Link
              to="/editor"
              className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-hover text-bg-deep text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Code2 className="w-4 h-4" />
              <span>Open Online IDE</span>
            </Link>
          </div>
        </div>

        <OnlineCodeEditor
          initialCode={snippet.code}
          initialLanguage={snippet.language}
        />

      </div>
    </div>
  );
}
