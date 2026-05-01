const express = require('express');
const router = express.Router();
const {
  getProducts, getProduct, getCategories,
  createProduct, updateProduct, deleteProduct
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { uploadMultiple } = require('../middleware/uploadMiddleware');

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProduct);

// Admin protected
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

// Upload multiple images to Cloudinary (admin protected)
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

module.exports = router;
