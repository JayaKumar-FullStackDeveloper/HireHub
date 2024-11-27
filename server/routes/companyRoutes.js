// /routes/companyRoutes.js
const express = require('express');
const router = express.Router();
const {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} = require('../controllers/companyController');

// Routes
router.post('/create', createCompany);
router.get('/getall', getAllCompanies);
router.get('/:id', getCompanyById);
router.put('/update/:id', updateCompany);
router.delete('/:id', deleteCompany);

module.exports = router;
