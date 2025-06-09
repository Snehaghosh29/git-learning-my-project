import express from 'express';
import { getAllUsers, getUserStats } from '../controllers/userController.js';
import { auth } from '../middleware/auth.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

// Admin routes
router.get('/', auth, isAdmin, getAllUsers);
router.get('/stats', auth, isAdmin, getUserStats);

export default router; 