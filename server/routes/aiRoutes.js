import express from 'express';
import { chatWithGroqController, inlineGroqController, getAIStatusController } from '../controllers/aiController.js';

const router = express.Router();

router.post('/chat', chatWithGroqController);
router.post('/inline', inlineGroqController);
router.get('/status', getAIStatusController);

export default router;
