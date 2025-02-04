const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { searchLoadsByCompanyAndDate, getLoads, addLoad, getLast100Loads, updateLoadById, deleteLoadById, updateOutgoingInvoiceNo, getAllNonArchivedLoads } = require('../controllers/loadController');

router.put('/update-outgoing-invoice-no', authenticateToken, authorizeRoles(['admin', 'manager']), updateOutgoingInvoiceNo);
router.get('/search-company-date', authenticateToken, authorizeRoles(['admin', 'manager']), searchLoadsByCompanyAndDate);
router.get('/last-100-loads', authenticateToken, authorizeRoles(['admin', 'manager']), getLast100Loads);
router.get('/non-archived-loads', authenticateToken, authorizeRoles(['admin', 'manager']), getAllNonArchivedLoads);
router.get('/', authenticateToken, authorizeRoles(['admin', 'manager']), getLoads);
router.post('/', authenticateToken, authorizeRoles(['admin']), addLoad);
router.put('/:id', authenticateToken, authorizeRoles(['admin']), updateLoadById);
router.delete('/:id', authenticateToken, authorizeRoles(['admin']), deleteLoadById);

module.exports = router;
