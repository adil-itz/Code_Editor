import express from 'express';
import { chatWithGroqController, getAIStatusController } from '../controllers/aiController.js';

const router = express.Router();

router.post('/chat', chatWithGroqController);
router.get('/status', getAIStatusController);

export default router;
