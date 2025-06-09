import express from 'express';
import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getAllProperties,
  approveProperty,
  rejectProperty,
  getPendingProperties,
  getApprovedProperties,
  getOwnerProperties
} from '../controllers/propertyController.js';
import { auth } from '../middleware/auth.js';
import { isAdmin } from '../middleware/isAdmin.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

// Public routes
router.get('/', getProperties);
router.get('/:id', getPropertyById);

// Owner routes
router.get('/owner', auth, getOwnerProperties);
router.post('/', auth, upload.array('images', 5), createProperty);
router.put('/:id', auth, upload.array('images', 5), updateProperty);
router.delete('/:id', auth, deleteProperty);

// Admin routes
router.get('/admin/all', auth, isAdmin, getAllProperties);
router.get('/admin/pending', auth, isAdmin, getPendingProperties);
router.get('/admin/approved', auth, isAdmin, getApprovedProperties);
router.put('/:id/approve', auth, isAdmin, approveProperty);
router.put('/:id/reject', auth, isAdmin, rejectProperty);

export default router; 