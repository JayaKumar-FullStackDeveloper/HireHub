const express = require('express');
const {
  registerAdmin,
  loginAdmin,
  getAdminProfile } = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/adminMiddleware');
const { getAllNotifications, replyToNotification, createNotification } = require('../controllers/notificationController');

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/notification', getAllNotifications)
router.post('/create', createNotification)
router.post('/reply/:id', replyToNotification)
router.get('/me', protectAdmin ,getAdminProfile);

module.exports = router;
