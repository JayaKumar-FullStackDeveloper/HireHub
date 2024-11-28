const express = require('express');
const router = express.Router();
const {createCandidate,
    updateCandidateById,
    deleteCandidateById,
    getAllCandidates
} = require('../controllers/candidateController');
const upload = require('../config/multerConfig'); 

router.post('/create', upload.single('resume'),createCandidate);

router.put('/update/:id', upload.single('resume'), updateCandidateById);
router.get('/getall', getAllCandidates);
router.delete('/:id', deleteCandidateById);

module.exports = router;
