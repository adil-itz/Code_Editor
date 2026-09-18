import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FolderPlus, 
  FolderGit2, 
  Clock, 
  Search, 
  Plus, 
  ArrowRight, 
  Code2, 
  Trash2, 
  Sparkles, 
  Layers, 
  X, 
  FileCode,
  Terminal,
  Star
} from 'lucide-react';
import { fetchUserProjects, createProjectApi, deleteProjectApi } from '../services/projectService';
import { useAuth } from '../context/AuthContext';

const PROJECT_TEMPLATES = [
  { id: 'empty', name: 'Empty Project', desc: 'Minimal starting codebase with README.md', lang: 'JavaScript', icon: Code2 },
  { id: 'html-css-js', name: 'HTML / CSS / JavaScript', desc: 'Web frontend template with live preview support', lang: 'HTML5', icon: FileCode },
  { id: 'react', name: 'React Application', desc: 'JSX component structure template', lang: 'React JS', icon: Layers },
  { id: 'node', name: 'Node.js Backend', desc: 'Express API microservice starter', lang: 'Node.js', icon: Terminal },
  { id: 'python', name: 'Python Project', desc: 'Python script & utilities starter', lang: 'Python', icon: Code2 },
  { id: 'typescript', name: 'TypeScript Project', desc: 'Typed TS application starter', lang: 'TypeScript', icon: Sparkles }
];

export function WorkspaceHome() {
  const navigate = useNavigate();
  const { isAuthenticated, openAuthModal } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    template: 'html-css-js'
  });

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await fetchUserProjects();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (!isAuthenticated) {
      setErrorMsg('Session expired or not logged in. Please log in to create projects.');
      openAuthModal('login');
      return;
    }

    try {
      setIsCreating(true);
      setErrorMsg('');
      const newProj = await createProjectApi(formData);
      setIsModalOpen(false);
      setFormData({ name: '', description: '', template: 'html-css-js' });
      navigate(`/workspace/project/${newProj.id || newProj._id}`);
    } catch (err) {
      if (err.message?.includes('authorized') || err.message?.includes('token')) {
        setErrorMsg('Authentication required. Please log in.');
        openAuthModal('login');
      } else {
        setErrorMsg(err.message || 'Failed to create project');
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProject = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteProjectApi(id);
      setProjects(prev => prev.filter(p => p.id !== id && p._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.template || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface p-6 sm:p-8 rounded-2xl border border-border-main shadow-xl">
          <div className="space-y-2 font-mono">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-brand-primary text-xs font-semibold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>DEVSPACE LAUNCHER</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              Development Workspace
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary max-w-xl">
              Select a previous project to launch in the browser IDE or start a new multi-language coding project.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3.5 rounded-xl bg-brand-primary hover:bg-brand-hover text-bg-deep font-bold text-xs font-mono transition-all duration-200 flex items-center gap-2 shadow-lg shadow-brand-primary/20 cursor-pointer hover:scale-105 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Create New Project</span>
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
            <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-brand-primary" />
              <span>Recent Projects ({filteredProjects.length})</span>
            </h2>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-muted" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-surface border border-border-main rounded-xl text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary font-mono w-full sm:w-72"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-text-muted font-mono text-sm">
              Loading workspace projects from MongoDB...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="p-12 text-center bg-surface rounded-2xl border border-dashed border-border-main space-y-4 font-mono">
              <FolderPlus className="w-12 h-12 text-brand-primary mx-auto opacity-50" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-text-primary">No Projects Found</h3>
                <p className="text-xs text-text-muted">Create your first coding project to open the VS Code browser IDE.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-hover text-bg-deep font-bold text-xs transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Project</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((project) => {
                const projId = project.id || project._id;
                return (
                  <motion.div
                    key={projId}
                    whileHover={{ y: -3 }}
                    onClick={() => navigate(`/workspace/project/${projId}`)}
                    className="p-5 rounded-2xl bg-surface border border-border-main hover:border-brand-primary/60 transition-all duration-200 flex flex-col justify-between gap-4 cursor-pointer group shadow-lg font-mono"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <h3 className="font-bold text-base text-text-primary group-hover:text-brand-primary transition-colors line-clamp-1">
                            {project.name}
                          </h3>
                          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/20 uppercase tracking-wider">
                            {project.template || 'JavaScript'}
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleDeleteProject(projId, e)}
                          title="Delete Project"
                          className="p-1.5 rounded-lg text-text-muted hover:text-status-error hover:bg-status-error/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-text-secondary line-clamp-2 min-h-[32px]">
                        {project.description || 'No project description added.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border-main/50 flex items-center justify-between text-[11px] text-text-muted">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-brand-primary" />
                        <span>{new Date(project.updatedAt || project.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1 font-bold text-brand-primary group-hover:translate-x-1 transition-transform">
                        <span>Open IDE</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-surface border border-border-main rounded-2xl w-full max-w-xl p-6 sm:p-8 space-y-6 shadow-2xl font-mono relative overflow-hidden"
              >
                <div className="flex items-center justify-between pb-4 border-b border-border-main">
                  <div className="flex items-center gap-2">
                    <FolderPlus className="w-5 h-5 text-brand-primary" />
                    <h2 className="text-lg font-bold text-text-primary">Create New Project</h2>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 rounded-lg hover:bg-surface-elevated text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-status-error/10 border border-status-error/30 text-status-error text-xs flex items-center justify-between gap-3">
                    <span>{errorMsg}</span>
                    <button
                      type="button"
                      onClick={() => openAuthModal('login')}
                      className="px-3 py-1 bg-status-error text-bg-deep rounded-lg font-bold text-[11px] shrink-0"
                    >
                      Log In
                    </button>
                  </div>
                )}

                <form onSubmit={handleCreateSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-secondary uppercase">Project Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. My Portfolio Website"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-bg-deep border border-border-main rounded-xl text-xs text-text-primary focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-secondary uppercase">Description (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Interactive Web Application"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2.5 bg-bg-deep border border-border-main rounded-xl text-xs text-text-primary focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase">Language / Starter Template</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {PROJECT_TEMPLATES.map((tmpl) => {
                        const IconComponent = tmpl.icon;
                        const isSelected = formData.template === tmpl.id;
                        return (
                          <div
                            key={tmpl.id}
                            onClick={() => setFormData({ ...formData, template: tmpl.id })}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                              isSelected 
                                ? 'bg-brand-primary/10 border-brand-primary text-text-primary' 
                                : 'bg-bg-deep border-border-main text-text-secondary hover:border-brand-primary/40'
                            }`}
                          >
                            <IconComponent className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-brand-primary' : 'text-text-muted'}`} />
                            <div className="space-y-0.5">
                              <div className="text-xs font-bold text-text-primary">{tmpl.name}</div>
                              <div className="text-[10px] text-text-muted line-clamp-1">{tmpl.desc}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-3 border-t border-border-main">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl bg-surface-elevated hover:bg-surface border border-border-main text-text-primary text-xs font-bold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCreating}
                      className="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-hover text-bg-deep font-bold text-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isCreating ? 'Creating...' : 'Create & Launch IDE'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
