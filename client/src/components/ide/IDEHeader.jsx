import React from 'react';
import { Play, Save, Terminal, CheckCircle2, ArrowLeft, PanelBottom, Palette, FolderTree } from 'lucide-react';
import { Link } from 'react-router-dom';

export function IDEHeader({ 
  project, 
  activeFile, 
  isDirty, 
  isSaving, 
  isRunning, 
  isBottomOpen, 
  onToggleBottomPanel, 
  onToggleMobileSidebar,
  editorTheme, 
  onThemeChange, 
  onSave, 
  onRun, 
  onOpenCommandPalette 
}) {
  return (
    <div className="h-12 bg-bg-deep border-b border-border-main px-2.5 sm:px-4 flex items-center justify-between select-none font-mono text-xs overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <Link 
          to="/workspace" 
          className="flex items-center gap-1.5 text-text-muted hover:text-brand-primary transition-colors py-1 px-1.5 sm:px-2 rounded-lg hover:bg-surface-elevated"
          title="Back to Launcher"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline font-bold">Workspace</span>
        </Link>
        
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-1.5 rounded-lg bg-surface-elevated border border-border-main text-text-secondary hover:text-text-primary"
            title="Toggle File Explorer"
          >
            <FolderTree className="w-4 h-4 text-brand-primary" />
          </button>
        )}

        <span className="text-border-main hidden xs:inline">|</span>
        
        <div className="flex items-center gap-1.5 sm:gap-2 max-w-[140px] xs:max-w-[200px] sm:max-w-none">
          <Terminal className="w-4 h-4 text-brand-primary shrink-0 hidden xs:block" />
          <span className="font-bold text-text-primary truncate">
            {project?.name || 'Project IDE'}
          </span>
          <span className="text-text-muted hidden md:inline">•</span>
          <span className="text-text-muted text-[11px] hidden md:inline capitalize">
            {activeFile?.language || project?.defaultLanguage || 'javascript'}
          </span>
          <span className="text-text-muted hidden md:inline">•</span>
          <div className="flex items-center gap-1 text-[11px] shrink-0">
            {isSaving ? (
              <span className="text-status-warning animate-pulse">Saving...</span>
            ) : isDirty ? (
              <span className="text-status-warning font-semibold">Unsaved</span>
            ) : (
              <span className="text-status-success flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span className="hidden sm:inline">Saved</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <div className="hidden md:flex items-center gap-1.5 bg-surface-elevated border border-border-main rounded-lg px-2 py-1">
          <Palette className="w-3.5 h-3.5 text-brand-primary" />
          <select
            value={editorTheme}
            onChange={(e) => onThemeChange(e.target.value)}
            className="bg-transparent text-[11px] font-bold text-text-primary focus:outline-none cursor-pointer"
          >
            <option value="vs-dark" className="bg-[#171719] text-[#F5F5F5]">VS Dark</option>
            <option value="vs-light" className="bg-[#171719] text-[#F5F5F5]">VS Light</option>
            <option value="hc-black" className="bg-[#171719] text-[#F5F5F5]">High Contrast</option>
          </select>
        </div>

        <button
          onClick={onToggleBottomPanel}
          className={`px-2 py-1.5 sm:px-2.5 rounded-lg border font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
            isBottomOpen 
              ? 'bg-brand-primary/15 border-brand-primary text-brand-primary' 
              : 'bg-surface-elevated hover:bg-surface border-border-main text-text-secondary hover:text-text-primary'
          }`}
          title="Toggle Terminal & Output Panel"
        >
          <PanelBottom className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Terminal</span>
        </button>

        <button
          onClick={onOpenCommandPalette}
          className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-lg bg-surface-elevated border border-border-main text-text-muted hover:text-text-primary transition-colors text-[11px]"
        >
          <span>Commands...</span>
          <kbd className="bg-bg-deep px-1.5 py-0.5 rounded border border-border-main text-[10px]">Ctrl+K</kbd>
        </button>

        <button
          onClick={onSave}
          disabled={!isDirty || isSaving}
          className="px-2.5 py-1.5 sm:px-3 rounded-lg bg-surface-elevated hover:bg-surface border border-border-main text-text-primary font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          title="Save File (Ctrl+S)"
        >
          <Save className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Save</span>
        </button>

        <button
          onClick={onRun}
          disabled={isRunning}
          className="px-3 sm:px-4 py-1.5 rounded-lg bg-brand-primary hover:bg-brand-hover text-bg-deep font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span className="text-[11px] sm:text-xs">{isRunning ? 'Running...' : 'Run'}</span>
        </button>
      </div>
    </div>
  );
}
