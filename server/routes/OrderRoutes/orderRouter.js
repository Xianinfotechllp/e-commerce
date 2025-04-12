import express from 'express';
import {
  createOrderController,
  getAllOrdersController,
  getOrderByIdController,
  updateOrderController,
  deleteOrderController,
  getOrdersByUserController,
  getOrdersByVendorController
} from '../../controllers/orderController/orderController.js';

const router = express.Router();

// Create Order
router.post('/create', createOrderController);

// Get All Orders
router.get('/', getAllOrdersController);

// Get Order by ID
router.get('/:orderid', getOrderByIdController);

// Update Order Status
router.put('/:orderid', updateOrderController);

// Delete Order
router.delete('/:orderid', deleteOrderController);

// Get Orders by User
router.get('/user/:userId', getOrdersByUserController);

// Get Orders by Vendor
router.get('/vendor/:vendorId', getOrdersByVendorController);

export default router;
