const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { getAllCompanies, getCompanyById, createCompany, updateCompany, deleteCompany } = require('../controllers/companyController');

router.get('/', authenticateToken, getAllCompanies);
router.get('/:id', authenticateToken, getCompanyById);
router.post('/', authenticateToken, authorizeRoles(['admin', 'manager']), createCompany);
router.put('/:id', authenticateToken, authorizeRoles(['admin', 'manager']), updateCompany);
router.delete('/:id', authenticateToken, authorizeRoles(['admin']), deleteCompany);

module.exports = router;
