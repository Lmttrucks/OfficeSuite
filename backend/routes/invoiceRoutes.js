const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { previewOutInvoice, insertOutInvoice, uploadInvoiceToBlob } = require('../controllers/invoiceController');
const multer = require('multer');
const upload = multer();

router.post('/previewOutInvoice', authenticateToken, authorizeRoles(['admin', 'manager']), previewOutInvoice);
router.post('/insertOutInvoice', authenticateToken, authorizeRoles(['admin', 'manager']), insertOutInvoice);
router.post('/uploadInvoiceToBlob', authenticateToken, authorizeRoles(['admin', 'manager']), upload.single('file'), uploadInvoiceToBlob);

module.exports = router;
