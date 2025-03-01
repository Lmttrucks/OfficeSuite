const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { searchLoadsByCompanyAndDate, getLoads, addLoad, getLast100Loads, updateLoadById, deleteLoadById, updateOutgoingInvoiceNo, getAllNonArchivedLoads, clearOutgoingInvoiceNo, addLinkLoad, updateLinkLoadInvoiceNo, getExternalLoads } = require('../controllers/loadController');

router.put('/update-outgoing-invoice-no', authenticateToken, authorizeRoles(['admin', 'manager']), updateOutgoingInvoiceNo);
router.put('/clear-outgoing-invoice-no', authenticateToken, authorizeRoles(['admin', 'manager']), clearOutgoingInvoiceNo);
router.put('/updatelinkload/', authenticateToken, authorizeRoles(['admin']), updateLinkLoadInvoiceNo);
router.get('/search-company-date', authenticateToken, authorizeRoles(['admin', 'manager']), searchLoadsByCompanyAndDate);
router.get('/last-100-loads', authenticateToken, authorizeRoles(['admin', 'manager']), getLast100Loads);
router.get('/non-archived-loads', authenticateToken, authorizeRoles(['admin', 'manager']), getAllNonArchivedLoads);
router.get('/external-loads', authenticateToken, authorizeRoles(['admin', 'manager']), getExternalLoads);
router.get('/', authenticateToken, authorizeRoles(['admin', 'manager']), getLoads);
router.post('/', authenticateToken, authorizeRoles(['admin']), addLoad);
router.post('/add-link-load', authenticateToken, authorizeRoles(['admin']), addLinkLoad);
router.put('/:id', authenticateToken, authorizeRoles(['admin']), updateLoadById);
router.delete('/:id', authenticateToken, authorizeRoles(['admin']), deleteLoadById);

module.exports = router;
