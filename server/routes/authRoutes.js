import express from 'express';
import { 
  signup, 
  login, 
  sendOTPController, 
  verifyOTPController, 
  resetPasswordOTPController, 
  getMe 
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/send-otp', sendOTPController);
router.post('/verify-otp', verifyOTPController);
router.post('/reset-password-otp', resetPasswordOTPController);
router.get('/me', protect, getMe);

export default router;
