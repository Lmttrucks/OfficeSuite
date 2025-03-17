const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { getCompanies, getEmployees, getVehicles, getLocations, getJobs, getCompanyInfo, getDistinctOrigins, getDistinctDestinations } = require('../controllers/lookupController');

router.get('/companies', authenticateToken, authorizeRoles(['admin', 'manager']), getCompanies);
router.get('/employees', authenticateToken, authorizeRoles(['admin', 'manager']), getEmployees);
router.get('/vehicles', authenticateToken, authorizeRoles(['admin', 'manager']), getVehicles);
router.get('/locations', authenticateToken, authorizeRoles(['admin', 'manager']), getLocations);
router.get('/jobs', authenticateToken, authorizeRoles(['admin', 'manager']), getJobs);
router.get('/company-info/:companyName', authenticateToken, authorizeRoles(['admin', 'manager']), getCompanyInfo);
router.get('/origins', authenticateToken, authorizeRoles(['admin', 'manager']), getDistinctOrigins); // New route for distinct origins
router.get('/destinations', authenticateToken, authorizeRoles(['admin', 'manager']), getDistinctDestinations); // New route for distinct destinations

module.exports = router;
