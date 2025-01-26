const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { getCompanies, getEmployees, getVehicles, getLocations, getJobs, getCompanyInfo } = require('../controllers/lookupController');

router.get('/companies', authenticateToken, authorizeRoles(['admin', 'manager']), getCompanies);
router.get('/employees', authenticateToken, authorizeRoles(['admin', 'manager']), getEmployees);
router.get('/vehicles', authenticateToken, authorizeRoles(['admin', 'manager']), getVehicles);
router.get('/locations', authenticateToken, authorizeRoles(['admin', 'manager']), getLocations);
router.get('/jobs', authenticateToken, authorizeRoles(['admin', 'manager']), getJobs);
router.get('/company-info/:companyName', authenticateToken, authorizeRoles(['admin', 'manager']), getCompanyInfo);

module.exports = router;
