import express from 'express';
import { getSavedSnippets, createSavedSnippet, deleteSavedSnippet } from '../controllers/snippetController.js';

const router = express.Router();

router.get('/', getSavedSnippets);
router.post('/', createSavedSnippet);
router.delete('/:id', deleteSavedSnippet);

export default router;
