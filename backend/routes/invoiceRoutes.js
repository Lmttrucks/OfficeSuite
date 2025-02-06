const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { previewOutInvoice, insertOutInvoice, uploadInvoiceToBlob, getInvoicesByCompanyName, getLoadsByOutgoingInvoiceNo, deleteInvoiceByOutgoingInvoiceNo } = require('../controllers/invoiceController');
const multer = require('multer');
const upload = multer();

router.post('/previewOutInvoice', authenticateToken, authorizeRoles(['admin', 'manager']), previewOutInvoice);
router.post('/insertOutInvoice', authenticateToken, authorizeRoles(['admin', 'manager']), insertOutInvoice);
router.post('/uploadInvoiceToBlob', authenticateToken, authorizeRoles(['admin', 'manager']), upload.single('file'), uploadInvoiceToBlob);
router.get('/getInvoicesByCompanyName', authenticateToken, authorizeRoles(['admin', 'manager']), getInvoicesByCompanyName);
router.get('/getLoadsByOutgoingInvoiceNo', authenticateToken, authorizeRoles(['admin', 'manager']), getLoadsByOutgoingInvoiceNo);
router.delete('/deleteInvoiceByOutgoingInvoiceNo', authenticateToken, authorizeRoles(['admin', 'manager']), deleteInvoiceByOutgoingInvoiceNo);

module.exports = router;
