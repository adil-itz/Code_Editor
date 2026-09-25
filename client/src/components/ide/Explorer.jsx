import React, { useState } from 'react';
import { 
  FilePlus, 
  FolderPlus, 
  ChevronRight, 
  ChevronDown, 
  Trash2, 
  Edit2, 
  Check,
  X
} from 'lucide-react';
import { FileIcon } from './FileIcon';

export function Explorer({ files = [], folders = [], activeFileId, onOpenFile, onCreateFile, onCreateFolder, onDeleteFile, onDeleteFolder, onRenameFile, onCloseMobile }) {
  const [activeCreateFileInput, setActiveCreateFileInput] = useState(null);
  const [activeCreateFolderInput, setActiveCreateFolderInput] = useState(null);
  const [newFileName, setNewFileName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFileId, setEditingFileId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [collapsedFolders, setCollapsedFolders] = useState({});

  const toggleFolder = (folderKey) => {
    setCollapsedFolders(prev => ({ ...prev, [folderKey]: !prev[folderKey] }));
  };

  const handleCreateFileSubmit = (parentPath, e) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    const finalPath = parentPath ? `${parentPath}/${newFileName.trim()}` : newFileName.trim();
    onCreateFile(finalPath);
    setNewFileName('');
    setActiveCreateFileInput(null);
  };

  const handleCreateFolderSubmit = (parentPath, e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    const finalPath = parentPath ? `${parentPath}/${newFolderName.trim()}` : newFolderName.trim();
    onCreateFolder(finalPath);
    setNewFolderName('');
    setActiveCreateFolderInput(null);
  };

  const handleRenameSubmit = (fileId, e) => {
    e.preventDefault();
    if (!renameValue.trim()) return;
    onRenameFile(fileId, renameValue.trim());
    setEditingFileId(null);
  };

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
          <FileIcon filename={file.name} language={file.language} className="w-4 h-4" />
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

  const getSubFolders = (parentPath) => {
    if (!parentPath) {
      return folders.filter(f => !f.parentId && (!f.path || !f.path.includes('/')));
    }
    const prefix = `${parentPath}/`;
    return folders.filter(f => f.path && f.path.startsWith(prefix) && f.path.substring(prefix.length).indexOf('/') === -1);
  };

  const getFolderFiles = (parentPath) => {
    if (!parentPath) {
      return files.filter(f => !f.folderId && (!f.path || !f.path.includes('/')));
    }
    const prefix = `${parentPath}/`;
    return files.filter(f => f.path && f.path.startsWith(prefix) && f.path.substring(prefix.length).indexOf('/') === -1);
  };

  const renderFolderTree = (folder) => {
    const folderKey = folder.id || folder._id || folder.path;
    const isCollapsed = collapsedFolders[folderKey];
    const subFolders = getSubFolders(folder.path);
    const folderFiles = getFolderFiles(folder.path);

    const isAddingFile = activeCreateFileInput === folder.path;
    const isAddingFolder = activeCreateFolderInput === folder.path;

    return (
      <div key={folderKey} className="space-y-1">
        <div
          onClick={() => toggleFolder(folderKey)}
          className="group flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-mono text-text-primary hover:bg-surface-elevated cursor-pointer transition-colors font-bold"
        >
          <div className="flex items-center gap-1.5 truncate">
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5 text-text-muted" /> : <ChevronDown className="w-3.5 h-3.5 text-text-muted" />}
            <FileIcon isFolder isOpen={!isCollapsed} className="w-4 h-4" />
            <span className="truncate">{folder.name}</span>
          </div>

          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => {
                setActiveCreateFileInput(folder.path);
                setActiveCreateFolderInput(null);
                setCollapsedFolders(prev => ({ ...prev, [folderKey]: false }));
              }}
              title="New File inside this folder"
              className="p-1 text-text-muted hover:text-brand-primary"
            >
              <FilePlus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setActiveCreateFolderInput(folder.path);
                setActiveCreateFileInput(null);
                setCollapsedFolders(prev => ({ ...prev, [folderKey]: false }));
              }}
              title="New Subfolder inside this folder"
              className="p-1 text-text-muted hover:text-brand-primary"
            >
              <FolderPlus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDeleteFolder(folder.id || folder._id)}
              title="Delete Folder"
              className="p-1 text-text-muted hover:text-status-error"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {!isCollapsed && (
          <div className="pl-3 space-y-1 border-l border-border-main/40 ml-2.5">
            {isAddingFile && (
              <form onSubmit={(e) => handleCreateFileSubmit(folder.path, e)} className="px-2 py-1 bg-bg-deep border border-brand-primary rounded-lg flex items-center gap-1">
                <FileCode className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                <input
                  type="text"
                  autoFocus
                  placeholder="name.ext"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="bg-transparent text-xs text-text-primary focus:outline-none w-full"
                />
                <button type="submit" className="p-0.5 text-status-success"><Check className="w-3 h-3" /></button>
                <button type="button" onClick={() => setActiveCreateFileInput(null)} className="p-0.5 text-text-muted"><X className="w-3 h-3" /></button>
              </form>
            )}

            {isAddingFolder && (
              <form onSubmit={(e) => handleCreateFolderSubmit(folder.path, e)} className="px-2 py-1 bg-bg-deep border border-status-warning rounded-lg flex items-center gap-1">
                <Folder className="w-3.5 h-3.5 text-status-warning shrink-0" />
                <input
                  type="text"
                  autoFocus
                  placeholder="subfolder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="bg-transparent text-xs text-text-primary focus:outline-none w-full"
                />
                <button type="submit" className="p-0.5 text-status-success"><Check className="w-3 h-3" /></button>
                <button type="button" onClick={() => setActiveCreateFolderInput(null)} className="p-0.5 text-text-muted"><X className="w-3 h-3" /></button>
              </form>
            )}

            {subFolders.map(renderFolderTree)}
            {folderFiles.map(renderFileItem)}
          </div>
        )}
      </div>
    );
  };

  const rootFolders = getSubFolders('');
  const rootFiles = getFolderFiles('');

  return (
    <div className="w-64 bg-surface border-r border-border-main flex flex-col h-full select-none shrink-0 font-mono">
      <div className="p-3 border-b border-border-main flex items-center justify-between">
        <span className="text-xs font-bold text-text-primary uppercase tracking-wider">Explorer</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setActiveCreateFileInput('');
              setActiveCreateFolderInput(null);
            }}
            title="New File (e.g. src/App.jsx)"
            className="p-1.5 rounded-lg hover:bg-surface-elevated text-text-muted hover:text-brand-primary transition-colors cursor-pointer"
          >
            <FilePlus className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setActiveCreateFolderInput('');
              setActiveCreateFileInput(null);
            }}
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
        {activeCreateFileInput === '' && (
          <form onSubmit={(e) => handleCreateFileSubmit('', e)} className="px-2 py-1 bg-bg-deep border border-brand-primary rounded-lg flex items-center gap-1">
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
            <button type="button" onClick={() => setActiveCreateFileInput(null)} className="p-0.5 text-text-muted"><X className="w-3 h-3" /></button>
          </form>
        )}

        {activeCreateFolderInput === '' && (
          <form onSubmit={(e) => handleCreateFolderSubmit('', e)} className="px-2 py-1 bg-bg-deep border border-status-warning rounded-lg flex items-center gap-1">
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
            <button type="button" onClick={() => setActiveCreateFolderInput(null)} className="p-0.5 text-text-muted"><X className="w-3 h-3" /></button>
          </form>
        )}

        {rootFolders.map(renderFolderTree)}
        {rootFiles.map(renderFileItem)}

        {files.length === 0 && folders.length === 0 && activeCreateFileInput === null && activeCreateFolderInput === null && (
          <div className="py-8 text-center text-xs text-text-muted">
            No files in project.<br/>Click + above to create one.
          </div>
        )}
      </div>
    </div>
  );
}
