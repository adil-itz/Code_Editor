import SavedSnippet from '../models/SavedSnippet.js';
import jwt from 'jsonwebtoken';

function extractUserId(req) {
  if (req.user && req.user.id) return req.user.id;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devspace_super_secret_jwt_key_2026_x89f');
      return decoded.id;
    } catch (e) {
      return null;
    }
  }
  return null;
}

export async function getSavedSnippets(req, res) {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required to view saved snippets.' });
    }

    const snippets = await SavedSnippet.find({ user: userId }).sort({ updatedAt: -1, createdAt: -1 });
    return res.json(snippets);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function createSavedSnippet(req, res) {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required to save snippet.' });
    }

    const { title, language, code, description, tags } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'Code content is required to save snippet.' });
    }

    const snippet = await SavedSnippet.create({
      user: userId,
      title: title || 'Untitled Snippet',
      language: language || 'javascript',
      code,
      description: description || '',
      tags: Array.isArray(tags) ? tags : []
    });

    return res.status(201).json(snippet);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function deleteSavedSnippet(req, res) {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required to delete snippet.' });
    }

    const { id } = req.params;
    const snippet = await SavedSnippet.findOneAndDelete({ _id: id, user: userId });
    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found or unauthorized.' });
    }

    return res.json({ message: 'Snippet deleted successfully.', id });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
