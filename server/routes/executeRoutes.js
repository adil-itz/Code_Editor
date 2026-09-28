import express from 'express';
import { executeCodeController, getExecutionHistory } from '../controllers/executeController.js';

const router = express.Router();

router.post('/', executeCodeController);
router.get('/history', getExecutionHistory);

export default router;
