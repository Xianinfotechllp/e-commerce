import express from 'express';
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleSuspendUser
} from '../../controllers/user/userController.js';

import { protect, isUser } from '../../middlewares/authmiddleware.js'; // Import middleware

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/', protect, isUser, getAllUsers);         // Only logged-in users can see all users (change to isAdmin if needed) admin
router.get('/:id', protect, isUser, getUserById);      // User can get their data
router.put('/:id', protect, isUser, updateUser);       // User can update themselves admin
router.delete('/:id', protect, isUser, deleteUser);    // User can delete themselves admin
router.patch('/:id/suspend', protect, isUser, toggleSuspendUser); // Admin or privileged user should be here if needed admin

export default router;
