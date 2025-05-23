const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { searchLoadsByCompanyAndDate, getLoads, addLoad, getLast1000Loads, updateLoadById, deleteLoadById, updateInvoiceNo, getAllNonArchivedLoads, clearInvoiceNo, addLinkLoad, updateLinkLoadInvoiceNo, getExternalLoads } = require('../controllers/loadController');

router.put('/update-invoice-no', authenticateToken, authorizeRoles(['admin', 'manager']), updateInvoiceNo);
router.put('/clear-invoice-no', authenticateToken, authorizeRoles(['admin', 'manager']), clearInvoiceNo);
router.put('/updatelinkload/', authenticateToken, authorizeRoles(['admin']), updateLinkLoadInvoiceNo);
router.get('/search-company-date', authenticateToken, authorizeRoles(['admin', 'manager']), searchLoadsByCompanyAndDate);
router.get('/last-1000-loads', authenticateToken, authorizeRoles(['admin', 'manager']), getLast1000Loads);
router.get('/non-archived-loads', authenticateToken, authorizeRoles(['admin', 'manager']), getAllNonArchivedLoads);
router.get('/external-loads', authenticateToken, authorizeRoles(['admin', 'manager']), getExternalLoads);
router.get('/', authenticateToken, authorizeRoles(['admin', 'manager']), getLoads);
router.post('/', authenticateToken, authorizeRoles(['admin']), addLoad);
router.post('/add-link-load', authenticateToken, authorizeRoles(['admin']), addLinkLoad);
router.put('/:id', authenticateToken, authorizeRoles(['admin']), updateLoadById);
router.delete('/:id', authenticateToken, authorizeRoles(['admin']), deleteLoadById);

module.exports = router;
