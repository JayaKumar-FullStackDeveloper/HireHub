const express = require('express');
const { registerEmployer, verifyOTP,signinEmployer,getEmployerById, updateEmployerById, resendOTP, getEmployerdetails } = require('../controllers/employerController');
const router = express.Router();
const { upload, uploadToVercelBlob} = require('../config/multerConfig'); 
const { protectUser } = require('../middleware/employerMiddleware');


router.get('/me', protectUser, getEmployerdetails);
router.get('/me/:id', getEmployerById);
router.post('/signin', signinEmployer);


router.post('/signup', registerEmployer);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.put('/update', upload.single('profileImage'), uploadToVercelBlob, updateEmployerById);

module.exports = router;
