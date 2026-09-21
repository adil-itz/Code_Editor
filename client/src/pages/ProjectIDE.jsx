import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchProjectDetails,
  fetchProjectFiles,
  createFileApi,
  updateFileApi,
  deleteFileApi,
  createFolderApi,
  deleteFolderApi,
  executeCodeApi
} from '../services/projectService';
import { IDEHeader } from '../components/ide/IDEHeader';
import { ActivityBar } from '../components/ide/ActivityBar';
import { Explorer } from '../components/ide/Explorer';
import { SearchPanel } from '../components/ide/SearchPanel';
import { EditorTabs } from '../components/ide/EditorTabs';
import { CodeEditorContainer } from '../components/ide/CodeEditorContainer';
import { TerminalPanel } from '../components/ide/TerminalPanel';
import { OutputPanel } from '../components/ide/OutputPanel';
import { InputPanel } from '../components/ide/InputPanel';
import { PreviewPanel } from '../components/ide/PreviewPanel';
import { CommandPalette } from '../components/ide/CommandPalette';
import { Terminal, Cpu, TextCursorInput as Input, Eye, AlertCircle, X } from 'lucide-react';

export function ProjectIDE() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeActivityTab, setActiveActivityTab] = useState('explorer');
  const [openFiles, setOpenFiles] = useState([]);
  const [activeFileId, setActiveFileId] = useState(null);

  const [fileContents, setFileContents] = useState({});
  const [dirtyFiles, setDirtyFiles] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const [bottomTab, setBottomTab] = useState('output');
  const [isBottomOpen, setIsBottomOpen] = useState(true);
  const [bottomHeight, setBottomHeight] = useState(240);
  const [isResizing, setIsResizing] = useState(false);
  const [editorTheme, setEditorTheme] = useState(() => localStorage.getItem('devspace-ide-theme') || 'vs-dark');

  const handleThemeChange = (newTheme) => {
    setEditorTheme(newTheme);
    localStorage.setItem('devspace-ide-theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-ide-theme', editorTheme);
    return () => {
      document.documentElement.removeAttribute('data-ide-theme');
    };
  }, [editorTheme]);

  const [stdin, setStdin] = useState('');
  const [output, setOutput] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [htmlPreview, setHtmlPreview] = useState('');

  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleMouseDownResize = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleTouchStartResize = () => {
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : null);
      if (clientY === null) return;
      const newHeight = window.innerHeight - clientY;
      if (newHeight >= 80 && newHeight <= window.innerHeight - 100) {
        setBottomHeight(newHeight);
      }
    };

    const handleTouchMove = (e) => {
      if (!isResizing) return;
      if (e.touches && e.touches[0]) {
        const clientY = e.touches[0].clientY;
        const newHeight = window.innerHeight - clientY;
        if (newHeight >= 80 && newHeight <= window.innerHeight - 100) {
          setBottomHeight(newHeight);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isResizing]);

  const loadData = async () => {
    try {
      setLoading(true);
      const proj = await fetchProjectDetails(projectId);
      setProject(proj);

      const { files: fileList, folders: folderList } = await fetchProjectFiles(projectId);
      setFiles(fileList);
      setFolders(folderList);

      const contentsMap = {};
      fileList.forEach(f => {
        contentsMap[f.id || f._id] = f.sourceCode || '';
      });
      setFileContents(contentsMap);

      if (fileList.length > 0) {
        setOpenFiles([fileList[0]]);
        setActiveFileId(fileList[0].id || fileList[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId]);

  const activeFile = files.find(f => (f.id || f._id) === activeFileId);
  const currentCode = activeFileId ? (fileContents[activeFileId] ?? activeFile?.sourceCode ?? '') : '';
  const isCurrentDirty = activeFileId ? !!dirtyFiles[activeFileId] : false;

  const handleOpenFile = (file) => {
    const fId = file.id || file._id;
    if (!openFiles.some(f => (f.id || f._id) === fId)) {
      setOpenFiles(prev => [...prev, file]);
    }
    setActiveFileId(fId);
  };

  const handleCloseTab = (fId) => {
    const updated = openFiles.filter(f => (f.id || f._id) !== fId);
    setOpenFiles(updated);
    if (activeFileId === fId) {
      if (updated.length > 0) {
        setActiveFileId(updated[updated.length - 1].id || updated[updated.length - 1]._id);
      } else {
        setActiveFileId(null);
      }
    }
  };

  const handleCloseOthers = () => {
    if (!activeFileId) return;
    const current = openFiles.find(f => (f.id || f._id) === activeFileId);
    if (current) setOpenFiles([current]);
  };

  const handleCloseAll = () => {
    setOpenFiles([]);
    setActiveFileId(null);
  };

  const handleCodeChange = (newText) => {
    if (!activeFileId) return;
    setFileContents(prev => ({ ...prev, [activeFileId]: newText }));
    setDirtyFiles(prev => ({ ...prev, [activeFileId]: true }));
  };

  const handleSaveActiveFile = async () => {
    if (!activeFileId) return;
    try {
      setIsSaving(true);
      const codeToSave = fileContents[activeFileId] ?? activeFile?.sourceCode ?? '';
      await updateFileApi(activeFileId, { sourceCode: codeToSave });
      setDirtyFiles(prev => ({ ...prev, [activeFileId]: false }));
      setFiles(prev => prev.map(f => (f.id || f._id) === activeFileId ? { ...f, sourceCode: codeToSave } : f));
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAllDirtyFiles = async () => {
    try {
      setIsSaving(true);
      const dirtyIds = Object.keys(dirtyFiles).filter(id => dirtyFiles[id]);
      if (dirtyIds.length === 0 && activeFileId) {
        const codeToSave = fileContents[activeFileId] ?? activeFile?.sourceCode ?? '';
        await updateFileApi(activeFileId, { sourceCode: codeToSave });
        setDirtyFiles(prev => ({ ...prev, [activeFileId]: false }));
      } else {
        for (const fId of dirtyIds) {
          const content = fileContents[fId];
          if (content !== undefined) {
            await updateFileApi(fId, { sourceCode: content });
          }
        }
        setDirtyFiles({});
      }
    } catch (err) {
      console.error('Auto save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const handleAutoSaveEvent = () => {
      handleSaveAllDirtyFiles();
    };
    window.addEventListener('devspace-auto-save-ide', handleAutoSaveEvent);
    return () => window.removeEventListener('devspace-auto-save-ide', handleAutoSaveEvent);
  }, [dirtyFiles, fileContents, activeFileId, activeFile]);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveActiveFile();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [activeFileId, fileContents]);

  const SUPPORTED_EXTENSIONS = new Set([
    'js', 'jsx', 'mjs', 'cjs',
    'ts', 'tsx',
    'py',
    'html', 'htm',
    'css', 'scss',
    'cpp', 'cc', 'cxx', 'hpp',
    'c', 'h',
    'java',
    'cs',
    'php',
    'rb',
    'go',
    'rs',
    'sql',
    'json',
    'md', 'txt', 'csv', 'xml', 'svg', 'env', 'gitignore'
  ]);

  const handleCreateFile = async (filePath) => {
    try {
      const parts = filePath.split('/');
      const filename = parts[parts.length - 1];
      const fileParts = filename.split('.');
      if (fileParts.length > 1) {
        const ext = fileParts[fileParts.length - 1].toLowerCase();
        if (!SUPPORTED_EXTENSIONS.has(ext)) {
          alert(`Compiler or runtime environment for this language extension (.${ext}) is not present. File cannot be created.`);
          return;
        }
      }

      const newFile = await createFileApi(projectId, { name: filename, path: filePath });
      setFiles(prev => [...prev, newFile]);
      setFileContents(prev => ({ ...prev, [newFile.id || newFile._id]: '' }));
      handleOpenFile(newFile);
    } catch (err) {
      alert(err.message || 'File creation failed.');
    }
  };

  const handleCreateFolder = async (folderPath) => {
    try {
      const parts = folderPath.split('/');
      const folderName = parts[parts.length - 1];
      const newFolder = await createFolderApi(projectId, { name: folderName, path: folderPath });
      setFolders(prev => [...prev, newFolder]);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteFile = async (fId) => {
    if (!window.confirm('Delete file?')) return;
    try {
      await deleteFileApi(fId);
      setFiles(prev => prev.filter(f => (f.id || f._id) !== fId));
      handleCloseTab(fId);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (!window.confirm('Delete folder and all enclosed files?')) return;
    try {
      await deleteFolderApi(folderId);
      const folderDoc = folders.find(f => (f.id || f._id) === folderId);
      if (folderDoc) {
        setFiles(prev => prev.filter(f => !f.path.startsWith(`${folderDoc.path}/`)));
        setFolders(prev => prev.filter(f => (f.id || f._id) !== folderId));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRenameFile = async (fId, newName) => {
    try {
      const parts = newName.split('.');
      if (parts.length > 1) {
        const ext = parts[parts.length - 1].toLowerCase();
        if (!SUPPORTED_EXTENSIONS.has(ext)) {
          alert(`Compiler or runtime environment for this language extension (.${ext}) is not present.`);
          return;
        }
      }
      const updated = await updateFileApi(fId, { name: newName });
      setFiles(prev => prev.map(f => (f.id || f._id) === fId ? updated : f));
      setOpenFiles(prev => prev.map(f => (f.id || f._id) === fId ? updated : f));
    } catch (err) {
      alert(err.message || 'Rename failed.');
    }
  };

  const bundleWebProjectPreview = (htmlCode) => {
    let bundled = htmlCode || '';
    files.forEach(f => {
      const fId = f.id || f._id;
      const content = fileContents[fId] ?? f.sourceCode ?? '';
      const fName = f.name;

      if (!content) return;

      if (f.language === 'css' || fName.endsWith('.css')) {
        const escapedName = fName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const linkRegex = new RegExp(`<link[^>]*href=["'](?:\\./)?${escapedName}["'][^>]*>`, 'gi');

        if (linkRegex.test(bundled)) {
          bundled = bundled.replace(linkRegex, `<style>${content}</style>`);
        }
      }

      if ((f.language === 'javascript' || fName.endsWith('.js')) && fName !== 'server.js') {
        const escapedName = fName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const scriptRegex = new RegExp(`<script[^>]*src=["'](?:\\./)?${escapedName}["'][^>]*>\\s*</script>`, 'gi');

        if (scriptRegex.test(bundled)) {
          bundled = bundled.replace(scriptRegex, `<script>${content}</script>`);
        }
      }
    });
    return bundled;
  };

  const isFileReferenced = (file, code) => {
    if (!code) return false;
    const fName = file.name;
    const fPath = file.path || file.name;

    if (code.includes(fName) || code.includes(fPath)) return true;

    if (fName.endsWith('.py')) {
      const moduleName = fName.replace('.py', '');
      const importRegex = new RegExp(`\\b(import|from)\\s+${moduleName}\\b`, 'g');
      if (importRegex.test(code)) return true;
    }
    if (fName.endsWith('.js') || fName.endsWith('.ts') || fName.endsWith('.jsx') || fName.endsWith('.tsx')) {
      const moduleName = fName.replace(/\.(js|ts|jsx|tsx)$/, '');
      if (code.includes(moduleName)) return true;
    }
    if (fName.endsWith('.h') || fName.endsWith('.hpp') || fName.endsWith('.c') || fName.endsWith('.cpp')) {
      const baseName = fName.replace(/\.(h|hpp|c|cpp)$/, '');
      if (code.includes(fName) || code.includes(baseName)) return true;
    }
    if (fName.endsWith('.java')) {
      const className = fName.replace('.java', '');
      const classRegex = new RegExp(`\\b${className}\\b`, 'g');
      if (classRegex.test(code)) return true;
    }
    return false;
  };

  const bundleBackendProjectCode = (file, fileList, contentsMap) => {
    const activeFId = file.id || file._id;
    const mainCode = contentsMap[activeFId] ?? file.sourceCode ?? '';
    const lang = (file.language || '').toLowerCase();
    const otherFiles = fileList.filter(f => (f.id || f._id) !== activeFId);

    if (otherFiles.length === 0) return mainCode;

    const referencedFiles = otherFiles.filter(f => isFileReferenced(f, mainCode));
    if (referencedFiles.length === 0) return mainCode;

    if (lang === 'python') {
      let bootstrapper = '';
      let pyHelpers = '';
      let code = mainCode;

      referencedFiles.forEach(f => {
        const fId = f.id || f._id;
        const content = contentsMap[fId] ?? f.sourceCode ?? '';
        const fPath = f.path || f.name;

        if (f.name.endsWith('.py')) {
          if (content) {
            pyHelpers += content + '\n\n';
            const moduleName = f.name.replace('.py', '');
            const importRegex1 = new RegExp(`^from\\s+${moduleName}\\s+import\\s+.*$`, 'gm');
            const importRegex2 = new RegExp(`^import\\s+${moduleName}.*$`, 'gm');
            code = code.replace(importRegex1, '');
            code = code.replace(importRegex2, '');
          }
        } else {
          if (!bootstrapper) bootstrapper = 'import os\n\n';
          const serialized = JSON.stringify(content);
          bootstrapper += `_d = os.path.dirname(${JSON.stringify(fPath)})\n`;
          bootstrapper += `if _d: os.makedirs(_d, exist_ok=True)\n`;
          bootstrapper += `with open(${JSON.stringify(fPath)}, "w", encoding="utf-8") as _f:\n`;
          bootstrapper += `    _f.write(${serialized})\n\n`;
        }
      });

      return bootstrapper + pyHelpers + code;
    }

    if (lang === 'cpp' || lang === 'c') {
      let code = mainCode;
      let bootstrapperCode = '';

      referencedFiles.forEach(f => {
        const fId = f.id || f._id;
        const fName = f.name;
        const content = contentsMap[fId] ?? f.sourceCode ?? '';
        if (!content) return;

        const escapedName = fName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const incRegex = new RegExp(`#include\\s+["'](?:\\./)?${escapedName}["']`, 'gi');

        if (incRegex.test(code)) {
          code = code.replace(incRegex, content);
        } else if (fName.endsWith('.h') || fName.endsWith('.hpp')) {
          code = content + '\n' + code;
        } else if (fName.endsWith('.cpp') || fName.endsWith('.c')) {
          code = code + '\n' + content;
        } else {
          const serialized = JSON.stringify(content);
          bootstrapperCode += `  f = fopen(${JSON.stringify(fName)}, "w"); if (f) { fputs(${serialized}, f); fclose(f); }\n`;
        }
      });

      if (bootstrapperCode) {
        const initFunc = `#include <stdio.h>\nstatic void __attribute__((constructor)) _bootstrap_workspace_files() {\n  FILE *f;\n${bootstrapperCode}}\n\n`;
        code = initFunc + code;
      }
      return code;
    }

    if (lang === 'java') {
      let code = mainCode;
      let fileBootstrap = '';

      referencedFiles.forEach(f => {
        const fId = f.id || f._id;
        const content = contentsMap[fId] ?? f.sourceCode ?? '';
        if (!content) return;

        if (f.name.endsWith('.java')) {
          let clean = content.replace(/\bpublic\s+class\b/g, 'class');
          code += '\n\n' + clean;
        } else {
          const serialized = JSON.stringify(content);
          fileBootstrap += `        try { java.nio.file.Files.write(java.nio.file.Paths.get(${JSON.stringify(f.name)}), ${serialized}.getBytes(java.nio.charset.StandardCharsets.UTF_8)); } catch (Exception e) {}\n`;
        }
      });

      if (fileBootstrap) {
        const bootstrapClass = `class _WorkspaceBootstrap {\n    static {\n${fileBootstrap}    }\n}\n`;
        code = bootstrapClass + '\n' + code;
        code = code.replace(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{/, 'public static void main(String[] args) {\n        Object _dummy = _WorkspaceBootstrap.class;');
      }
      return code;
    }

    if (lang === 'javascript' || lang === 'typescript') {
      let bootstrapper = '';
      let jsHelpers = '';
      let code = mainCode;

      referencedFiles.forEach(f => {
        const fId = f.id || f._id;
        const content = contentsMap[fId] ?? f.sourceCode ?? '';
        const fPath = f.path || f.name;

        if (f.name.endsWith('.js') || f.name.endsWith('.ts')) {
          if (content) {
            let clean = content.replace(/^import\s+.*from\s+.*$/gm, '');
            clean = clean.replace(/^export\s+default\s+/gm, '');
            clean = clean.replace(/^export\s+/gm, '');
            jsHelpers += clean + '\n\n';
          }
        } else {
          if (!bootstrapper) bootstrapper = 'const fs = require("fs");\nconst path = require("path");\n\n';
          const serialized = JSON.stringify(content);
          bootstrapper += `const _d_${fId.replace(/[^a-zA-Z0-9]/g, '_')} = path.dirname(${JSON.stringify(fPath)});\n`;
          bootstrapper += `if (_d_${fId.replace(/[^a-zA-Z0-9]/g, '_')} && _d_${fId.replace(/[^a-zA-Z0-9]/g, '_')} !== ".") fs.mkdirSync(_d_${fId.replace(/[^a-zA-Z0-9]/g, '_')}, { recursive: true });\n`;
          bootstrapper += `fs.writeFileSync(${JSON.stringify(fPath)}, ${serialized}, "utf-8");\n\n`;
        }
      });

      code = code.replace(/^import\s+.*from\s+.*$/gm, '');
      return bootstrapper + jsHelpers + code;
    }

    return mainCode;
  };

  const getLanguageForFile = (file) => {
    if (!file || !file.name) return 'python';
    const parts = file.name.split('.');
    if (parts.length > 1) {
      const ext = parts[parts.length - 1].toLowerCase();
      const extMap = {
        py: 'python',
        js: 'javascript', jsx: 'javascript', mjs: 'javascript', cjs: 'javascript',
        ts: 'typescript', tsx: 'typescript',
        html: 'html', htm: 'html',
        css: 'css', scss: 'css',
        cpp: 'cpp', cc: 'cpp', cxx: 'cpp', hpp: 'cpp', c: 'c', h: 'c',
        java: 'java',
        cs: 'csharp',
        php: 'php',
        rb: 'ruby',
        go: 'go',
        rs: 'rust',
        sql: 'sql',
        json: 'json'
      };
      if (extMap[ext]) return extMap[ext];
    }
    return (file.language || 'python').toLowerCase();
  };

  const handleRunCode = async () => {
    if (!activeFile) return;
    setIsRunning(true);
    setIsBottomOpen(true);
    setBottomTab('output');
    setOutput([]);

    const startTime = performance.now();
    try {
      const targetLang = getLanguageForFile(activeFile);
      if (targetLang === 'html' || targetLang === 'css') {
        const fullHtml = targetLang === 'css'
          ? `<html><head><style>${currentCode}</style></head><body><div style="padding:20px;font-family:sans-serif;"><h1>CSS Preview</h1></div></body></html>`
          : bundleWebProjectPreview(currentCode);
        setHtmlPreview(fullHtml);
        setBottomTab('preview');
        setOutput([{ type: 'log', text: 'Rendered live preview with connected CSS and JS files.' }]);
        setIsRunning(false);
        return;
      }

      const codeToSubmit = bundleBackendProjectCode(activeFile, files, fileContents);

      const res = await executeCodeApi({
        code: codeToSubmit,
        language: targetLang,
        stdin,
        projectId,
        fileId: activeFileId
      });

      const endTime = performance.now();
      setExecutionTime((endTime - startTime).toFixed(1));

      const logs = [];
      if (res.stdout) logs.push({ type: 'log', text: res.stdout });
      if (res.stderr) logs.push({ type: 'error', text: res.stderr });
      if (res.compile_output) logs.push({ type: 'error', text: res.compile_output });
      if (logs.length === 0) logs.push({ type: 'log', text: `Execution status: ${res.status || 'Accepted'}` });

      setOutput(logs);
    } catch (err) {
      setOutput([{ type: 'error', text: err.message || 'Execution error.' }]);
    } finally {
      setIsRunning(false);
    }
  };

  const handlePaletteAction = (actionId) => {
    if (actionId === 'save') handleSaveActiveFile();
    if (actionId === 'run') handleRunCode();
    if (actionId === 'toggle-terminal') { setIsBottomOpen(prev => !prev); setBottomTab('terminal'); }
    if (actionId === 'toggle-preview') { setIsBottomOpen(true); setBottomTab('preview'); }
    if (actionId === 'search') setActiveActivityTab('search');
    if (actionId === 'open-palette') setIsPaletteOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center font-mono text-sm">
        Loading Project IDE Workspace...
      </div>
    );
  }

  return (
    <div data-ide-theme={editorTheme} className="h-screen bg-bg-primary text-text-primary flex flex-col overflow-hidden font-sans select-none">
      <IDEHeader
        project={project}
        activeFile={activeFile}
        isDirty={isCurrentDirty}
        isSaving={isSaving}
        isRunning={isRunning}
        isBottomOpen={isBottomOpen}
        onToggleBottomPanel={() => setIsBottomOpen(prev => !prev)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
        editorTheme={editorTheme}
        onThemeChange={handleThemeChange}
        onSave={handleSaveActiveFile}
        onRun={handleRunCode}
        onOpenCommandPalette={() => setIsPaletteOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden relative">
        <div className="hidden md:flex shrink-0">
          <ActivityBar
            activeTab={activeActivityTab}
            onTabChange={(tab) => setActiveActivityTab(tab)}
          />

          {activeActivityTab === 'explorer' && (
            <Explorer
              files={files}
              folders={folders}
              activeFileId={activeFileId}
              onOpenFile={handleOpenFile}
              onCreateFile={handleCreateFile}
              onCreateFolder={handleCreateFolder}
              onDeleteFile={handleDeleteFile}
              onDeleteFolder={handleDeleteFolder}
              onRenameFile={handleRenameFile}
            />
          )}

          {activeActivityTab === 'search' && (
            <SearchPanel
              files={files}
              onOpenFile={handleOpenFile}
            />
          )}
        </div>

        {/* Mobile Sidebar Overlay Drawer */}
        {isMobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex">
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-xs" 
              onClick={() => setIsMobileSidebarOpen(false)} 
            />
            <div className="relative z-50 flex h-full shadow-2xl bg-bg-primary">
              <ActivityBar
                activeTab={activeActivityTab}
                onTabChange={(tab) => setActiveActivityTab(tab)}
              />
              {activeActivityTab === 'explorer' && (
                <Explorer
                  files={files}
                  folders={folders}
                  activeFileId={activeFileId}
                  onOpenFile={(file) => {
                    handleOpenFile(file);
                    setIsMobileSidebarOpen(false);
                  }}
                  onCreateFile={handleCreateFile}
                  onCreateFolder={handleCreateFolder}
                  onDeleteFile={handleDeleteFile}
                  onDeleteFolder={handleDeleteFolder}
                  onRenameFile={handleRenameFile}
                  onCloseMobile={() => setIsMobileSidebarOpen(false)}
                />
              )}
              {activeActivityTab === 'search' && (
                <SearchPanel
                  files={files}
                  onOpenFile={(file) => {
                    handleOpenFile(file);
                    setIsMobileSidebarOpen(false);
                  }}
                />
              )}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden bg-bg-deep">
          <EditorTabs
            openFiles={openFiles}
            activeFileId={activeFileId}
            dirtyFiles={dirtyFiles}
            onSelectTab={(fId) => setActiveFileId(fId)}
            onCloseTab={handleCloseTab}
            onCloseOthers={handleCloseOthers}
            onCloseAll={handleCloseAll}
          />

          {openFiles.length > 0 && activeFile ? (
            <CodeEditorContainer
              file={activeFile}
              value={currentCode}
              theme={editorTheme}
              onChange={handleCodeChange}
              onSave={handleSaveActiveFile}
              onOpenCommandPalette={() => setIsPaletteOpen(true)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center font-mono text-text-muted space-y-3">
              <div className="text-xl font-bold text-text-primary">DEVSPACE IDE Workspace</div>
              <p className="text-xs max-w-sm">Select a file from the Explorer or click + to create a new file.</p>
              <div className="flex items-center gap-2 text-xs pt-2">
                <kbd className="px-2 py-1 bg-surface border border-border-main rounded text-text-secondary">Ctrl+S</kbd>
                <span>Save File</span>
                <span className="px-2">•</span>
                <kbd className="px-2 py-1 bg-surface border border-border-main rounded text-text-secondary">Ctrl+K</kbd>
                <span>Command Palette</span>
              </div>
            </div>
          )}

          {isBottomOpen && (
            <div
              style={{ height: `${bottomHeight}px` }}
              className="border-t border-border-main flex flex-col bg-bg-deep shrink-0 font-mono text-xs relative max-h-[85vh]"
            >
              <div
                onMouseDown={handleMouseDownResize}
                onTouchStart={handleTouchStartResize}
                className="h-2 w-full bg-border-main/50 hover:bg-brand-primary active:bg-brand-primary cursor-ns-resize transition-colors absolute -top-1 left-0 right-0 z-20 flex items-center justify-center"
                title="Drag or slide up/down to resize bottom panel"
              >
                <div className="w-10 h-1 bg-text-muted/40 rounded-full" />
              </div>

              <div className="h-9 bg-surface-elevated border-b border-border-main px-2.5 flex items-center justify-between gap-2 select-none overflow-hidden">
                <div className="flex items-center gap-1.5 overflow-x-auto min-w-0 flex-1 scrollbar-none py-1">
                  <button
                    onClick={() => setBottomTab('output')}
                    className={`shrink-0 px-2.5 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      bottomTab === 'output' ? 'bg-surface text-brand-primary border border-border-main' : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>OUTPUT</span>
                  </button>
                  <button
                    onClick={() => setBottomTab('terminal')}
                    className={`shrink-0 px-2.5 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      bottomTab === 'terminal' ? 'bg-surface text-brand-primary border border-border-main' : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>TERMINAL</span>
                  </button>
                  <button
                    onClick={() => setBottomTab('input')}
                    className={`shrink-0 px-2.5 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      bottomTab === 'input' ? 'bg-surface text-brand-primary border border-border-main' : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    <Input className="w-3.5 h-3.5" />
                    <span>INPUT (stdin)</span>
                  </button>
                  <button
                    onClick={() => setBottomTab('preview')}
                    className={`shrink-0 px-2.5 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      bottomTab === 'preview' ? 'bg-surface text-brand-primary border border-border-main' : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>PREVIEW</span>
                  </button>
                </div>

                <button
                  onClick={() => setIsBottomOpen(false)}
                  className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded bg-surface border border-border-main text-text-muted hover:text-text-primary text-xs font-bold cursor-pointer transition-colors z-10 shadow-xs"
                  title="Close Terminal Panel"
                >
                  <X className="w-3.5 h-3.5 text-status-error shrink-0" />
                  <span className="text-[11px] font-bold">Close</span>
                </button>
              </div>

              <div className="flex-1 overflow-hidden">
                {bottomTab === 'output' && <OutputPanel output={output} isRunning={isRunning} executionTime={executionTime} />}
                {bottomTab === 'terminal' && <TerminalPanel project={project} activeFile={activeFile} files={files} onRunCode={handleRunCode} />}
                {bottomTab === 'input' && <InputPanel stdin={stdin} onChangeStdin={setStdin} />}
                {bottomTab === 'preview' && <PreviewPanel htmlContent={htmlPreview} />}
              </div>
            </div>
          )}
        </div>
      </div>

      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onAction={handlePaletteAction}
      />
    </div>
  );
}
