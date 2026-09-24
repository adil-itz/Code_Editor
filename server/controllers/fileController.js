import File from '../models/File.js';
import Folder from '../models/Folder.js';
import Project from '../models/Project.js';

const EXT_LANG_MAP = {
  js: 'javascript', jsx: 'react', mjs: 'javascript', cjs: 'javascript',
  ts: 'typescript', tsx: 'react',
  py: 'python',
  html: 'html', htm: 'html',
  css: 'css', scss: 'css',
  cpp: 'cpp', cc: 'cpp', cxx: 'cpp', hpp: 'cpp',
  c: 'c', h: 'c',
  java: 'java',
  cs: 'csharp',
  php: 'php',
  rb: 'ruby',
  go: 'go',
  rs: 'rust',
  sql: 'sql',
  json: 'json',
  kt: 'kotlin', kts: 'kotlin',
  swift: 'swift',
  react: 'react',
  md: 'markdown', txt: 'plaintext', csv: 'plaintext', xml: 'xml', svg: 'xml', env: 'plaintext', gitignore: 'plaintext'
};

function detectLanguage(filename) {
  const parts = filename.split('.');
  if (parts.length > 1) {
    const ext = parts[parts.length - 1].toLowerCase();
    if (EXT_LANG_MAP[ext]) return EXT_LANG_MAP[ext];
  }
  return null;
}

async function verifyProjectOwner(projectId, userId) {
  const proj = await Project.findOne({ _id: projectId, owner: userId });
  return !!proj;
}

export async function getProjectFilesAndFolders(req, res) {
  try {
    const { projectId } = req.params;
    const isOwner = await verifyProjectOwner(projectId, req.user.id);
    if (!isOwner) {
      return res.status(403).json({ message: 'Forbidden.' });
    }

    const files = await File.find({ projectId }).sort({ path: 1 });
    const folders = await Folder.find({ projectId }).sort({ path: 1 });

    return res.json({ files, folders });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function ensureFolderHierarchy(projectId, folderPath) {
  const parts = folderPath.split('/').filter(Boolean);
  let currentPath = '';
  let parentId = null;
  let lastFolderDoc = null;

  for (const part of parts) {
    currentPath = currentPath ? `${currentPath}/${part}` : part;
    let folderDoc = await Folder.findOne({ projectId, path: currentPath });
    if (!folderDoc) {
      folderDoc = await Folder.create({
        projectId,
        name: part,
        path: currentPath,
        parentId
      });
    }
    parentId = folderDoc._id;
    lastFolderDoc = folderDoc;
  }
  return lastFolderDoc;
}

export async function createFile(req, res) {
  try {
    const { projectId } = req.params;
    const { name, path: inputPath, sourceCode } = req.body;

    const isOwner = await verifyProjectOwner(projectId, req.user.id);
    if (!isOwner) {
      return res.status(403).json({ message: 'Forbidden.' });
    }

    if (!name) {
      return res.status(400).json({ message: 'File name is required.' });
    }

    const fullPath = inputPath || name;
    const parts = fullPath.split('/');
    const fileNameOnly = parts[parts.length - 1];

    const fileParts = fileNameOnly.split('.');
    if (fileParts.length > 1) {
      const ext = fileParts[fileParts.length - 1].toLowerCase();
      if (!EXT_LANG_MAP[ext]) {
        return res.status(400).json({
          message: `Compiler or runtime environment for this language extension (.${ext}) is not present. File cannot be created.`
        });
      }
    }

    let folderId = null;
    if (parts.length > 1) {
      const folderPath = parts.slice(0, -1).join('/');
      const folderDoc = await ensureFolderHierarchy(projectId, folderPath);
      folderId = folderDoc ? folderDoc._id : null;
    }

    const lang = detectLanguage(fileNameOnly) || 'plaintext';
    const content = sourceCode || '';

    const newFile = await File.create({
      projectId,
      folderId,
      name: fileNameOnly,
      path: fullPath,
      language: lang,
      sourceCode: content,
      size: Buffer.byteLength(content, 'utf8')
    });

    return res.status(201).json(newFile);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function updateFile(req, res) {
  try {
    const { id } = req.params;
    const { name, path: newPath, sourceCode, language } = req.body;

    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: 'File not found.' });
    }

    const isOwner = await verifyProjectOwner(file.projectId, req.user.id);
    if (!isOwner) {
      return res.status(403).json({ message: 'Forbidden.' });
    }

    if (name !== undefined) {
      const fileParts = name.split('.');
      if (fileParts.length > 1) {
        const ext = fileParts[fileParts.length - 1].toLowerCase();
        if (!EXT_LANG_MAP[ext]) {
          return res.status(400).json({
            message: `Compiler or runtime environment for this language extension (.${ext}) is not present.`
          });
        }
      }
      file.name = name;
      const detected = detectLanguage(name);
      if (detected) file.language = detected;
    }

    if (newPath !== undefined) file.path = newPath;
    if (language !== undefined) file.language = language;
    if (sourceCode !== undefined) {
      file.sourceCode = sourceCode;
      file.size = Buffer.byteLength(sourceCode, 'utf8');
    }
    file.updatedAt = new Date();

    await file.save();
    return res.json(file);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function deleteFile(req, res) {
  try {
    const { id } = req.params;
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: 'File not found.' });
    }

    const isOwner = await verifyProjectOwner(file.projectId, req.user.id);
    if (!isOwner) {
      return res.status(403).json({ message: 'Forbidden.' });
    }

    await File.findByIdAndDelete(id);
    return res.json({ message: 'File deleted.' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function createFolder(req, res) {
  try {
    const { projectId } = req.params;
    const { name, path: inputPath } = req.body;

    const isOwner = await verifyProjectOwner(projectId, req.user.id);
    if (!isOwner) {
      return res.status(403).json({ message: 'Forbidden.' });
    }

    if (!name && !inputPath) {
      return res.status(400).json({ message: 'Folder name or path is required.' });
    }

    const folderPath = inputPath || name;
    const targetFolderDoc = await ensureFolderHierarchy(projectId, folderPath);

    return res.status(201).json(targetFolderDoc);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function deleteFolder(req, res) {
  try {
    const { id } = req.params;
    const folder = await Folder.findById(id);
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found.' });
    }

    const isOwner = await verifyProjectOwner(folder.projectId, req.user.id);
    if (!isOwner) {
      return res.status(403).json({ message: 'Forbidden.' });
    }

    await File.deleteMany({ projectId: folder.projectId, path: { $regex: `^${folder.path}/` } });
    await Folder.deleteMany({ projectId: folder.projectId, path: { $regex: `^${folder.path}/` } });
    await Folder.findByIdAndDelete(id);

    return res.json({ message: 'Folder deleted.' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
