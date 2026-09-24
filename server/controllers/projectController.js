import Project from '../models/Project.js';
import File from '../models/File.js';
import Folder from '../models/Folder.js';

const TEMPLATE_DEFAULT_FILES = {
  'empty': [
    { name: 'README.md', path: 'README.md', language: 'markdown', sourceCode: '# New Project\n\nStart coding here.' }
  ],
  'html-css-js': [
    { name: 'index.html', path: 'index.html', language: 'html', sourceCode: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>My Web Project</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <div id="app">\n    <h1>Hello World</h1>\n    <p>Welcome to DEVSPACE IDE!</p>\n    <button id="btn">Click Me</button>\n  </div>\n  <script src="script.js"></script>\n</body>\n</html>' },
    { name: 'style.css', path: 'style.css', language: 'css', sourceCode: 'body {\n  font-family: system-ui, sans-serif;\n  background-color: #0f172a;\n  color: #f8fafc;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n  margin: 0;\n}\n\n#app {\n  text-align: center;\n  background: #1e293b;\n  padding: 2rem;\n  border-radius: 12px;\n  border: 1px solid #334155;\n}\n\nbutton {\n  background: #6366f1;\n  color: white;\n  border: none;\n  padding: 8px 16px;\n  border-radius: 6px;\n  cursor: pointer;\n}\nbutton:hover {\n  background: #4f46e5;\n}' },
    { name: 'script.js', path: 'script.js', language: 'javascript', sourceCode: 'document.getElementById("btn").addEventListener("click", () => {\n  alert("Button clicked in DEVSPACE IDE!");\n});' }
  ],
  'react': [
    { name: 'App.jsx', path: 'src/App.jsx', language: 'react', sourceCode: 'import React, { useState } from "react";\n\nexport default function App() {\n  const [count, setCount] = useState(0);\n  return (\n    <div className="p-6 text-center bg-slate-900 text-white font-sans rounded-xl border border-slate-700 shadow-xl">\n      <h1 className="text-2xl font-bold text-indigo-400 mb-2">React Component Sandbox</h1>\n      <p className="text-slate-400 mb-4">Live JSX rendering engine with React 18 & Tailwind CSS</p>\n      <button \n        onClick={() => setCount(count + 1)} \n        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-semibold transition-all shadow-md"\n      >\n        Count: {count}\n      </button>\n    </div>\n  );\n}' },
    { name: 'package.json', path: 'package.json', language: 'json', sourceCode: '{\n  "name": "react-workspace",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  }\n}' }
  ],
  'kotlin': [
    { name: 'Main.kt', path: 'Main.kt', language: 'kotlin', sourceCode: 'fun main() {\n    println("Hello from DEVSPACE Kotlin Engine!")\n    val skills = listOf("Kotlin", "Android", "JVM", "Coroutines")\n    for ((index, skill) in skills.withIndex()) {\n        println("Skill ${index + 1}: $skill")\n    }\n}' },
    { name: 'README.md', path: 'README.md', language: 'markdown', sourceCode: '# Kotlin Project\n\nRun `Main.kt`.' }
  ],
  'swift': [
    { name: 'main.swift', path: 'main.swift', language: 'swift', sourceCode: 'import Foundation\n\nprint("Hello from DEVSPACE Swift Sandbox!")\nlet features = ["Swift 5.8", "iOS Development", "SwiftUI", "Concurrency"]\nfor feature in features {\n    print("- \\(feature)")\n}' },
    { name: 'README.md', path: 'README.md', language: 'markdown', sourceCode: '# Swift Project\n\nRun `main.swift`.' }
  ],
  'node': [
    { name: 'server.js', path: 'server.js', language: 'javascript', sourceCode: 'const express = require("express");\nconst app = express();\nconst PORT = 3000;\n\napp.get("/", (req, res) => {\n  res.json({ message: "Hello from DEVSPACE Node.js Server!" });\n});\n\nconsole.log("Server application ready.");' },
    { name: 'package.json', path: 'package.json', language: 'json', sourceCode: '{\n  "name": "node-backend-service",\n  "version": "1.0.0",\n  "main": "server.js",\n  "scripts": {\n    "start": "node server.js"\n  }\n}' },
    { name: 'README.md', path: 'README.md', language: 'markdown', sourceCode: '# Node.js Application\n\nServer entrypoint is `server.js`.' }
  ],
  'python': [
    { name: 'main.py', path: 'main.py', language: 'python', sourceCode: 'def main():\n    print("Hello from DEVSPACE Python Engine!")\n    numbers = [1, 2, 3, 4, 5]\n    squared = [x**2 for x in numbers]\n    print(f"Original: {numbers}")\n    print(f"Squared: {squared}")\n\nif __name__ == "__main__":\n    main()' },
    { name: 'utils.py', path: 'utils.py', language: 'python', sourceCode: 'def helper():\n    return "Utility helper ready."' },
    { name: 'README.md', path: 'README.md', language: 'markdown', sourceCode: '# Python Project\n\nRun `main.py`.' }
  ],
  'typescript': [
    { name: 'index.ts', path: 'index.ts', language: 'typescript', sourceCode: 'interface User {\n  id: number;\n  name: string;\n  role: string;\n}\n\nconst user: User = {\n  id: 1,\n  name: "Developer",\n  role: "Admin"\n};\n\nconsole.log(`User ${user.name} logged in with role ${user.role}.`);' },
    { name: 'tsconfig.json', path: 'tsconfig.json', language: 'json', sourceCode: '{\n  "compilerOptions": {\n    "target": "ES2022",\n    "module": "NodeNext",\n    "strict": true\n  }\n}' }
  ]
};

export async function getUserProjects(req, res) {
  try {
    const projects = await Project.find({ owner: req.user.id }).sort({ lastOpenedAt: -1, updatedAt: -1 });
    const enriched = await Promise.all(projects.map(async (p) => {
      const fileCount = await File.countDocuments({ projectId: p._id });
      const obj = p.toJSON();
      obj.fileCount = fileCount;
      return obj;
    }));
    return res.json(enriched);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function getProjectById(req, res) {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user.id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }
    project.lastOpenedAt = new Date();
    await project.save();
    return res.json(project);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function createProject(req, res) {
  try {
    const { name, description, template } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Project name is required.' });
    }

    const selectedTemplate = template || 'empty';
    const langMap = {
      'empty': 'javascript',
      'html-css-js': 'html',
      'react': 'react',
      'node': 'javascript',
      'python': 'python',
      'typescript': 'typescript',
      'kotlin': 'kotlin',
      'swift': 'swift'
    };

    const project = await Project.create({
      owner: req.user.id,
      name,
      description: description || '',
      template: selectedTemplate,
      defaultLanguage: langMap[selectedTemplate] || 'javascript'
    });

    const defaultFiles = TEMPLATE_DEFAULT_FILES[selectedTemplate] || TEMPLATE_DEFAULT_FILES['empty'];
    const createdFoldersMap = {};

    for (const fileDef of defaultFiles) {
      const parts = fileDef.path.split('/');
      let folderId = null;

      if (parts.length > 1) {
        const folderName = parts[0];
        if (!createdFoldersMap[folderName]) {
          const folderDoc = await Folder.create({
            projectId: project._id,
            name: folderName,
            path: folderName,
            parentId: null
          });
          createdFoldersMap[folderName] = folderDoc._id;
        }
        folderId = createdFoldersMap[folderName];
      }

      await File.create({
        projectId: project._id,
        folderId,
        name: fileDef.name,
        path: fileDef.path,
        language: fileDef.language,
        sourceCode: fileDef.sourceCode,
        size: Buffer.byteLength(fileDef.sourceCode, 'utf8')
      });
    }

    return res.status(201).json(project);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function updateProject(req, res) {
  try {
    const { name, description, isFavorite } = req.body;
    const project = await Project.findOne({ _id: req.params.id, owner: req.user.id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    if (isFavorite !== undefined) project.isFavorite = isFavorite;
    project.updatedAt = new Date();

    await project.save();
    return res.json(project);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function deleteProject(req, res) {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    await File.deleteMany({ projectId: project._id });
    await Folder.deleteMany({ projectId: project._id });

    return res.json({ message: 'Project deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
