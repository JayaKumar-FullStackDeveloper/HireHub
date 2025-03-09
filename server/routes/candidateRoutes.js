const express = require('express');
const router = express.Router();
const {createCandidate,
    updateCandidateById,
    deleteCandidateById,
    getAllCandidates
} = require('../controllers/candidateController');

const { upload, uploadToVercelBlob } = require('../config/multerConfig'); 

router.post('/create', upload.single('resume'), uploadToVercelBlob,createCandidate);

router.put('/update/:id', upload.single('resume'), uploadToVercelBlob, updateCandidateById);
router.get('/getall', getAllCandidates);
router.delete('/:id', deleteCandidateById);

module.exports = router;
