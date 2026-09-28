import crypto from 'crypto';
import SharedSnippet from '../models/SharedSnippet.js';
import jwt from 'jsonwebtoken';
import { findUserById } from '../db/userStore.js';

function generateShareId() {
  return crypto.randomBytes(5).toString('hex');
}

export async function createShareLink(req, res) {
  try {
    const { title, language, code, files, template } = req.body;

    let authorName = 'Anonymous';
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devspace_super_secret_jwt_key_2026_x89f');
        const user = await findUserById(decoded.id);
        if (user && user.name) {
          authorName = user.name;
        }
      } catch (e) {
      }
    }

    let shareId = generateShareId();
    let existing = await SharedSnippet.findOne({ shareId });
    while (existing) {
      shareId = generateShareId();
      existing = await SharedSnippet.findOne({ shareId });
    }

    const snippet = await SharedSnippet.create({
      shareId,
      title: title || 'Shared Code',
      language: language || 'javascript',
      code: code || '',
      files: Array.isArray(files) ? files : [],
      template: template || 'empty',
      authorName
    });

    return res.status(201).json({
      success: true,
      shareId: snippet.shareId,
      snippet
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function getSharedSnippet(req, res) {
  try {
    const { shareId } = req.params;
    const snippet = await SharedSnippet.findOne({ shareId });

    if (!snippet) {
      return res.status(404).json({ message: 'Shared code link not found or expired.' });
    }

    snippet.views = (snippet.views || 0) + 1;
    await snippet.save();

    return res.json(snippet);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
