const express = require('express');
const router = express.Router();
const {
  getProducts, getProduct, getCategories,
  createProduct, updateProduct, deleteProduct
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProduct);

// Admin protected
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
