const express = require('express');
const router = express.Router();
const { login, changePassword, getProfile } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
