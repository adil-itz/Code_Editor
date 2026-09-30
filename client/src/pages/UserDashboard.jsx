import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Code2, 
  FolderGit2, 
  Cpu, 
  HardDrive, 
  Play, 
  Clock, 
  Sparkles, 
  Terminal, 
  ExternalLink,
  Search,
  CheckCircle2,
  FileCode,
  Zap,
  ArrowRight,
  Bookmark,
  ShieldCheck,
  Key,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ExecutionHistoryModal } from '../components/ide/ExecutionHistoryModal';
import { SavedSnippetsModal } from '../components/ide/SavedSnippetsModal';

export function UserDashboard() {
  const { user, toggle2FA } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSnippetsOpen, setIsSnippetsOpen] = useState(false);

  const [is2FALoading, setIs2FALoading] = useState(false);
  const [show2FAOTPInput, setShow2FAOTPInput] = useState(false);
  const [twoFAOtpCode, setTwoFAOtpCode] = useState('');
  const [twoFAFeedback, setTwoFAFeedback] = useState('');
  const [twoFAError, setTwoFAError] = useState('');

  const projects = [
    { id: '1', title: 'React Canvas IDE Component', language: 'JavaScript', updated: '2 hours ago', status: 'Active', stars: 14 },
    { id: '2', title: 'Python AST Code Parser', language: 'Python', updated: 'Yesterday', status: 'Completed', stars: 8 },
    { id: '3', title: 'Express API Gateway Service', language: 'Node.js', updated: '3 days ago', status: 'Active', stars: 5 },
    { id: '4', title: 'WebAssembly C++ Renderer', language: 'C++', updated: '1 week ago', status: 'Archived', stars: 22 },
  ];

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const is2FAEnabled = !!user?.is2FAEnabled;

  const handleToggle2FATrigger = async () => {
    setIs2FALoading(true);
    setTwoFAFeedback('');
    setTwoFAError('');

    try {
      if (is2FAEnabled) {
        const res = await toggle2FA(false);
        setTwoFAFeedback(res.message || '2FA disabled successfully.');
        setShow2FAOTPInput(false);
      } else {
        const res = await toggle2FA(true);
        if (res.requireOTP) {
          setShow2FAOTPInput(true);
          setTwoFAFeedback('A 6-digit OTP code was sent to your email to confirm enabling 2FA.');
        } else {
          setTwoFAFeedback(res.message || '2FA enabled successfully.');
        }
      }
    } catch (err) {
      setTwoFAError(err.message || 'Failed to update 2FA status.');
    } finally {
      setIs2FALoading(false);
    }
  };

  const handleConfirmEnable2FA = async (e) => {
    e.preventDefault();
    if (!twoFAOtpCode.trim()) return;

    setIs2FALoading(true);
    setTwoFAFeedback('');
    setTwoFAError('');

    try {
      const res = await toggle2FA(true, twoFAOtpCode.trim());
      setTwoFAFeedback(res.message || '2FA enabled successfully.');
      setShow2FAOTPInput(false);
      setTwoFAOtpCode('');
    } catch (err) {
      setTwoFAError(err.message || 'Invalid OTP code.');
    } finally {
      setIs2FALoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-primary/20 via-surface-elevated to-surface border border-border-main p-6 sm:p-8 shadow-xl"
        >
          <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-10 pointer-events-none">
            <Terminal className="w-64 h-64 text-brand-primary" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-brand-primary text-xs font-mono font-semibold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>DEVELOPER DASHBOARD</span>
                </span>
                <span className="text-xs font-mono text-text-muted">ID: {user?.id?.slice(0, 8) || 'USR-8921'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
                Welcome back, <span className="text-brand-primary">{user?.name || 'Developer'}</span>!
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary max-w-2xl font-mono">
                {user?.email} • Account status: <span className="text-status-success font-semibold">Active Developer</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/workspace"
                className="px-6 py-3.5 rounded-xl bg-brand-primary hover:bg-brand-hover text-bg-deep font-bold text-xs font-mono transition-all duration-200 flex items-center gap-2.5 shadow-xl shadow-brand-primary/25 cursor-pointer hover:scale-105"
              >
                <Terminal className="w-4 h-4" />
                <span>Open Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/editor"
                className="px-4 py-3 rounded-xl bg-surface-elevated hover:bg-surface border border-border-main text-text-primary font-bold text-xs font-mono transition-all flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current text-brand-primary" />
                <span>Quick Scratchpad</span>
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-surface border border-purple-500/30 shadow-xl space-y-4 font-mono"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-bold text-text-primary">Two-Factor Authentication (2FA)</h2>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  is2FAEnabled 
                    ? 'bg-status-success/20 text-status-success border border-status-success/30' 
                    : 'bg-surface-elevated text-text-muted border border-border-main'
                }`}>
                  {is2FAEnabled ? '2FA ON' : '2FA OFF'}
                </span>
              </div>
              <p className="text-xs text-text-secondary">
                Add an extra layer of security to your DEVSPACE account by requiring a 6-digit OTP code sent to your email during sign-in.
              </p>
            </div>

            <button
              onClick={handleToggle2FATrigger}
              disabled={is2FALoading}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-50 ${
                is2FAEnabled
                  ? 'bg-status-error/15 hover:bg-status-error/25 text-status-error border border-status-error/30'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20'
              }`}
            >
              {is2FALoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              <span>{is2FAEnabled ? 'Turn OFF 2FA' : 'Turn ON 2FA'}</span>
            </button>
          </div>

          {twoFAFeedback && (
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
              <span>{twoFAFeedback}</span>
            </div>
          )}

          {twoFAError && (
            <div className="p-3 rounded-xl bg-status-error/10 border border-status-error/30 text-xs text-status-error flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{twoFAError}</span>
            </div>
          )}

          <AnimatePresence>
            {show2FAOTPInput && !is2FAEnabled && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleConfirmEnable2FA}
                className="pt-3 border-t border-border-main flex flex-col sm:flex-row items-center gap-3"
              >
                <div className="relative flex-1 w-full">
                  <Key className="w-4 h-4 absolute left-3 top-3 text-purple-400" />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="Enter 6-digit confirmation OTP"
                    value={twoFAOtpCode}
                    onChange={(e) => setTwoFAOtpCode(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-bg-deep border border-purple-500/40 rounded-xl text-xs text-text-primary focus:outline-none focus:border-purple-400 tracking-widest"
                  />
                </div>
                <button
                  type="submit"
                  disabled={is2FALoading || !twoFAOtpCode.trim()}
                  className="w-full sm:w-auto px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-40 shrink-0"
                >
                  {is2FALoading ? 'Confirming...' : 'Confirm & Enable 2FA'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-surface border border-brand-primary/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden"
        >
          <div className="space-y-1.5 font-mono">
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-brand-primary" />
              <span>Open Workspace</span>
            </h2>
            <p className="text-xs text-text-secondary">
              Continue coding where you left off in your online VS Code-style development environment.
            </p>
          </div>
          <Link
            to="/workspace"
            className="px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-hover text-bg-deep font-bold text-xs font-mono transition-all flex items-center gap-2 shrink-0 shadow-lg cursor-pointer"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-xl bg-surface border border-border-main space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-text-muted uppercase tracking-wider">Active Projects</span>
              <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary">
                <FolderGit2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold font-mono text-text-primary">12</div>
            <div className="text-[11px] font-mono text-status-success flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>+2 created this week</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-5 rounded-xl bg-surface border border-border-main space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-text-muted uppercase tracking-wider">Saved Snippets</span>
              <div className="p-2 rounded-lg bg-status-info/10 text-status-info">
                <Code2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold font-mono text-text-primary">48</div>
            <div className="text-[11px] font-mono text-text-muted">JS, Python, C++, Java, Rust...</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-xl bg-surface border border-border-main space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-text-muted uppercase tracking-wider">Code Runs</span>
              <div className="p-2 rounded-lg bg-status-warning/10 text-status-warning">
                <Cpu className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold font-mono text-text-primary">342</div>
            <div className="text-[11px] font-mono text-status-success">100% Execution Success</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="p-5 rounded-xl bg-surface border border-border-main space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-text-muted uppercase tracking-wider">Storage Used</span>
              <div className="p-2 rounded-lg bg-status-success/10 text-status-success">
                <HardDrive className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold font-mono text-text-primary">1.4 MB</div>
            <div className="text-[11px] font-mono text-text-muted">1.4% of 100 MB Limit</div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-lg font-bold font-mono text-text-primary flex items-center gap-2">
                <FileCode className="w-5 h-5 text-brand-primary" />
                <span>My Code Projects</span>
              </h2>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-1.5 bg-surface-elevated border border-border-main rounded-lg text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary/60 font-mono w-full sm:w-64"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  whileHover={{ x: 3 }}
                  className="p-4 rounded-xl bg-surface border border-border-main hover:border-brand-primary/40 transition-all duration-200 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-text-primary hover:text-brand-primary transition-colors cursor-pointer">
                        {project.title}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                        {project.language}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono text-text-muted">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Updated {project.updated}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-status-success">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{project.status}</span>
                      </span>
                    </div>
                  </div>

                  <Link
                    to="/editor"
                    className="px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-brand-primary hover:text-bg-deep border border-border-main text-text-primary font-mono text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <span>Edit Code</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold font-mono text-text-primary flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-status-warning" />
              <span>Multi-Language IDE</span>
            </h2>

            <div className="p-5 rounded-xl bg-surface border border-border-main space-y-4 font-mono">
              <div className="space-y-2">
                <span className="text-xs text-brand-primary font-bold">15 Supported Languages</span>
                <p className="text-xs text-text-muted leading-relaxed">
                  JavaScript, TypeScript, Python, HTML/CSS, C++, C, Java, C#, PHP, Ruby, Go, Rust, SQL & JSON.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 text-[10px]">
                {['JavaScript', 'TypeScript', 'Python', 'HTML/CSS', 'C++', 'Java', 'Go', 'Rust', 'PHP', 'SQL'].map(lang => (
                  <span key={lang} className="px-2 py-0.5 rounded bg-surface-elevated border border-border-main text-text-secondary font-semibold">
                    {lang}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-border-main space-y-2">
                <button
                  onClick={() => setIsHistoryOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-surface-elevated hover:bg-surface border border-border-main text-text-primary font-bold text-xs font-mono text-center flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Clock className="w-4 h-4 text-brand-primary" />
                  <span>View Execution History</span>
                </button>

                <button
                  onClick={() => setIsSnippetsOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-surface-elevated hover:bg-surface border border-border-main text-text-primary font-bold text-xs font-mono text-center flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Bookmark className="w-4 h-4 text-brand-primary" />
                  <span>View Saved Code Snippets</span>
                </button>
              </div>

              <Link
                to="/editor"
                className="w-full py-2.5 rounded-xl bg-brand-primary hover:bg-brand-hover text-bg-deep font-bold text-xs font-mono text-center flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Open Online Code Editor</span>
              </Link>
            </div>
          </div>

        </div>

      </div>

      <ExecutionHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onLoadCode={(code) => {
          navigate('/editor');
        }}
      />

      <SavedSnippetsModal
        isOpen={isSnippetsOpen}
        onClose={() => setIsSnippetsOpen(false)}
        onLoadCode={(code) => {
          navigate('/editor');
        }}
      />
    </div>
  );
}
