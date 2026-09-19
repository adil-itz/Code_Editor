import React, { useState } from 'react';
import { 
  FilePlus, 
  FolderPlus, 
  FileCode, 
  Folder, 
  FolderOpen, 
  ChevronRight, 
  ChevronDown, 
  Trash2, 
  Edit2, 
  Copy, 
  Download,
  Check,
  X
} from 'lucide-react';

export function Explorer({ files, folders, activeFileId, onOpenFile, onCreateFile, onCreateFolder, onDeleteFile, onDeleteFolder, onRenameFile, onCloseMobile }) {
  const [newFileInput, setNewFileInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [newFolderInput, setNewFolderInput] = useState(false);
  const [editingFileId, setEditingFileId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [collapsedFolders, setCollapsedFolders] = useState({});

  const toggleFolder = (folderId) => {
    setCollapsedFolders(prev => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  const handleCreateFileSubmit = (e) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    onCreateFile(newFileName.trim());
    setNewFileName('');
    setNewFileInput(false);
  };

  const handleCreateFolderSubmit = (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    onCreateFolder(newFolderName.trim());
    setNewFolderName('');
    setNewFolderInput(false);
  };

  const handleRenameSubmit = (fileId, e) => {
    e.preventDefault();
    if (!renameValue.trim()) return;
    onRenameFile(fileId, renameValue.trim());
    setEditingFileId(null);
  };

  const rootFiles = files.filter(f => !f.folderId && !f.path.includes('/'));
  const rootFolders = folders.filter(f => !f.parentId);

  const renderFileItem = (file) => {
    const isSelected = (file.id || file._id) === activeFileId;
    const isEditing = editingFileId === (file.id || file._id);

    return (
      <div
        key={file.id || file._id}
        onClick={() => {
          onOpenFile(file);
          if (onCloseMobile) onCloseMobile();
        }}
        className={`group flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer transition-colors ${
          isSelected 
            ? 'bg-brand-primary/15 text-brand-primary border border-brand-primary/30 font-bold' 
            : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
        }`}
      >
        <div className="flex items-center gap-2 truncate pr-2">
          <FileCode className="w-4 h-4 shrink-0 text-brand-primary" />
          {isEditing ? (
            <form onSubmit={(e) => handleRenameSubmit(file.id || file._id, e)} className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                autoFocus
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="px-1 py-0.5 bg-bg-deep border border-brand-primary rounded text-xs text-text-primary focus:outline-none w-28"
              />
              <button type="submit" className="p-0.5 text-status-success"><Check className="w-3 h-3" /></button>
              <button type="button" onClick={() => setEditingFileId(null)} className="p-0.5 text-text-muted"><X className="w-3 h-3" /></button>
            </form>
          ) : (
            <span className="truncate">{file.name}</span>
          )}
        </div>

        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => { setEditingFileId(file.id || file._id); setRenameValue(file.name); }}
            title="Rename"
            className="p-1 text-text-muted hover:text-text-primary"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={() => onDeleteFile(file.id || file._id)}
            title="Delete"
            className="p-1 text-text-muted hover:text-status-error"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };

  const renderFolderItem = (folder) => {
    const isCollapsed = collapsedFolders[folder.id || folder._id];
    const folderFiles = files.filter(f => f.folderId === (folder.id || folder._id) || (f.path && f.path.startsWith(`${folder.path}/`)));

    return (
      <div key={folder.id || folder._id} className="space-y-1">
        <div
          onClick={() => toggleFolder(folder.id || folder._id)}
          className="group flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-mono text-text-primary hover:bg-surface-elevated cursor-pointer transition-colors font-bold"
        >
          <div className="flex items-center gap-1.5 truncate">
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5 text-text-muted" /> : <ChevronDown className="w-3.5 h-3.5 text-text-muted" />}
            {isCollapsed ? <Folder className="w-4 h-4 text-status-warning" /> : <FolderOpen className="w-4 h-4 text-status-warning" />}
            <span className="truncate">{folder.name}</span>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); onDeleteFolder(folder.id || folder._id); }}
            title="Delete Folder"
            className="opacity-0 group-hover:opacity-100 p-1 text-text-muted hover:text-status-error transition-opacity"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>

        {!isCollapsed && (
          <div className="pl-4 space-y-0.5 border-l border-border-main/40 ml-3">
            {folderFiles.map(renderFileItem)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-surface border-r border-border-main flex flex-col h-full select-none shrink-0 font-mono">
      <div className="p-3 border-b border-border-main flex items-center justify-between">
        <span className="text-xs font-bold text-text-primary uppercase tracking-wider">Explorer</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setNewFileInput(true)}
            title="New File (e.g. src/App.jsx)"
            className="p-1.5 rounded-lg hover:bg-surface-elevated text-text-muted hover:text-brand-primary transition-colors cursor-pointer"
          >
            <FilePlus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setNewFolderInput(true)}
            title="New Folder"
            className="p-1.5 rounded-lg hover:bg-surface-elevated text-text-muted hover:text-brand-primary transition-colors cursor-pointer"
          >
            <FolderPlus className="w-4 h-4" />
          </button>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg hover:bg-surface-elevated text-text-muted hover:text-text-primary"
              title="Close Explorer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="p-2 space-y-1 overflow-y-auto flex-1">
        {newFileInput && (
          <form onSubmit={handleCreateFileSubmit} className="px-2 py-1 bg-bg-deep border border-brand-primary rounded-lg flex items-center gap-1">
            <FileCode className="w-3.5 h-3.5 text-brand-primary shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="name.js or folder/name.js"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="bg-transparent text-xs text-text-primary focus:outline-none w-full"
            />
            <button type="submit" className="p-0.5 text-status-success"><Check className="w-3 h-3" /></button>
            <button type="button" onClick={() => setNewFileInput(false)} className="p-0.5 text-text-muted"><X className="w-3 h-3" /></button>
          </form>
        )}

        {newFolderInput && (
          <form onSubmit={handleCreateFolderSubmit} className="px-2 py-1 bg-bg-deep border border-status-warning rounded-lg flex items-center gap-1">
            <Folder className="w-3.5 h-3.5 text-status-warning shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="bg-transparent text-xs text-text-primary focus:outline-none w-full"
            />
            <button type="submit" className="p-0.5 text-status-success"><Check className="w-3 h-3" /></button>
            <button type="button" onClick={() => setNewFolderInput(false)} className="p-0.5 text-text-muted"><X className="w-3 h-3" /></button>
          </form>
        )}

        {rootFolders.map(renderFolderItem)}
        {rootFiles.map(renderFileItem)}

        {files.length === 0 && folders.length === 0 && !newFileInput && !newFolderInput && (
          <div className="py-8 text-center text-xs text-text-muted">
            No files in project.<br/>Click + above to create one.
          </div>
        )}
      </div>
    </div>
  );
}
