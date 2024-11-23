const express = require('express');
const {
  registerAdmin,
  loginAdmin,
  getAllAdmins
} = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/adminMiddleware');

const router = express.Router();

// Public routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Protected routes
router.get('/me', protectAdmin, getAllAdmins);

module.exports = router;
