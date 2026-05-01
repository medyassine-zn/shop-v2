const express = require('express');
const router = express.Router();
const {
  createOrder, getOrders, getOrder,
  updateOrderStatus, deleteOrder, getDashboardStats
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Public
router.post('/', createOrder);

// Admin protected
router.get('/', protect, getOrders);
router.get('/stats', protect, getDashboardStats);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, updateOrderStatus);
router.delete('/:id', protect, deleteOrder);

module.exports = router;
