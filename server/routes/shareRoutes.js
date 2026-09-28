import express from 'express';
import { createShareLink, getSharedSnippet } from '../controllers/shareController.js';

const router = express.Router();

router.post('/', createShareLink);
router.get('/:shareId', getSharedSnippet);

export default router;
