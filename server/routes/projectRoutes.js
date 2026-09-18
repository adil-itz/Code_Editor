import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getUserProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';
import {
  getProjectFilesAndFolders,
  createFile,
  updateFile,
  deleteFile,
  createFolder,
  deleteFolder
} from '../controllers/fileController.js';

const router = express.Router();

router.use(protect);

router.get('/', getUserProjects);
router.post('/', createProject);
router.get('/:id', getProjectById);
router.patch('/:id', updateProject);
router.delete('/:id', deleteProject);

router.get('/:projectId/files', getProjectFilesAndFolders);
router.post('/:projectId/files', createFile);
router.patch('/files/:id', updateFile);
router.delete('/files/:id', deleteFile);

router.post('/:projectId/folders', createFolder);
router.delete('/folders/:id', deleteFolder);

export default router;
