import express from 'express';
import { auth, authorize } from '../middleware/auth.js';
import {
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllBookings,
  updateBookingStatus,
  deleteBooking
} from '../controllers/adminController.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);
router.use(authorize('admin'));

// User management routes
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

// Booking management routes
router.get('/bookings', getAllBookings);
router.put('/bookings/:id/status', updateBookingStatus);
router.delete('/bookings/:id', deleteBooking);

export default router; 