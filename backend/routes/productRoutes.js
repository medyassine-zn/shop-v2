const express = require('express');
const router = express.Router();
const {
  getProducts, getProduct, getCategories,
  createProduct, updateProduct, deleteProduct
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { uploadMultiple } = require('../middleware/uploadMiddleware');

/**
 * ROUTE ORDER IS CRITICAL IN EXPRESS
 * Static routes (without parameters) MUST be defined BEFORE dynamic routes (with :id).
 * Otherwise, a route like '/upload' will be matched by '/:id' with id='upload',
 * causing "Cast to ObjectId failed" errors.
 */

// ==================== STATIC ROUTES (NO PARAMETERS) ====================
// These routes must come first to avoid being shadowed by dynamic routes

// Get all products (with search, filter, pagination)
router.get('/', getProducts);

// Get distinct categories list
router.get('/categories', getCategories);

// Upload multiple images to Cloudinary (admin protected)
// MUST be before /:id route to prevent 'upload' being parsed as ObjectId
router.post('/upload', protect, uploadMultiple, (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }

  const urls = req.files.map(file => file.path);
  res.json({
    success: true,
    urls,
    count: urls.length
  });
});

// Create new product (admin protected)
router.post('/', protect, createProduct);

// ==================== DYNAMIC ROUTES (WITH :id PARAMETER) ====================
// These routes must come last as they capture any remaining path segments

// Get single product by ID
router.get('/:id', getProduct);

// Update product (admin protected)
router.put('/:id', protect, updateProduct);

// Delete product (admin protected)
router.delete('/:id', protect, deleteProduct);

module.exports = router;
