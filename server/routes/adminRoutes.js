import express from 'express';
import { 
  getAdminStats, 
  getUsers, 
  updateUserRoleController, 
  deleteUserController 
} from '../controllers/adminController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(requireAdmin);

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.patch('/users/:id/role', updateUserRoleController);
router.delete('/users/:id', deleteUserController);

export default router;
