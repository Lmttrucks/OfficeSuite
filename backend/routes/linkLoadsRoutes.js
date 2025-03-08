const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const linkLoadController = require('../controllers/linkLoadController');

router.post('/add-link-load', authenticateToken, authorizeRoles(['admin', 'manager']), linkLoadController.addLinkLoad);
router.put('/update-link-load/:ID', authenticateToken, authorizeRoles(['admin', 'manager']), linkLoadController.updateLinkLoad);
router.put('/update-link-load-invoice-no', authenticateToken, authorizeRoles(['admin', 'manager']), linkLoadController.updateLinkLoadInvoiceNo);
router.get('/external-loads', authenticateToken, authorizeRoles(['admin', 'manager']), linkLoadController.getExternalLoads);
router.get('/linked-loads/:loadID', authenticateToken, authorizeRoles(['admin', 'manager']), linkLoadController.getLinkedLoadsByLoadID); // Add this line

module.exports = router;