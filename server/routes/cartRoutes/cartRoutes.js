import express from 'express';
import {
  addItemCartController,
  deleteItemCartController,
  getTotalCartController,
  syncCartController,
  getAllCartsController,
  getUserCartController
} from '../../controllers/Cart/CartController.js';
import { isUser, protect } from '../../middlewares/authmiddleware.js';

const router = express.Router();

router.post('/add/:productId', protect, isUser, addItemCartController);
router.delete('/remove/:productId', protect, isUser, deleteItemCartController);
router.get('/total', protect, isUser, getTotalCartController);
router.put('/sync', protect, isUser, syncCartController);
router.get('/', protect, isUser, getUserCartController);

// Admin only route
router.get('/admin/all', protect, getAllCartsController);

export default router;
