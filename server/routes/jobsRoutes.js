const express = require('express');
const router = express.Router();
const {getAllApplications,createApplication,updateApplicationStatus,deleteApplication} = require('../controllers/jobsController');
const upload = require('../config/multerConfig');

router.get('/getall', getAllApplications);
router.post('/create', createApplication);
router.put('/update/:id',upload.single('resume'), updateApplicationStatus);
router.delete('/delete/:id', deleteApplication);

module.exports = router;
