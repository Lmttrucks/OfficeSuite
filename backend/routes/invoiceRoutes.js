const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { previewInvoice, insertInvoice, uploadInvoiceToBlob, getInvoicesByCompanyName, getLoadsByInvoiceNo, deleteInvoiceByInvoiceNo, previewLinkedLoadsInvoice } = require('../controllers/invoiceController');
const multer = require('multer');
const upload = multer();

router.post('/previewOutInvoice', authenticateToken, authorizeRoles(['admin', 'manager']), previewInvoice);
router.post('/insertOutInvoice', authenticateToken, authorizeRoles(['admin', 'manager']), insertInvoice);
router.post('/uploadInvoiceToBlob', authenticateToken, authorizeRoles(['admin', 'manager']), upload.single('file'), uploadInvoiceToBlob);
router.get('/getInvoicesByCompanyName', authenticateToken, authorizeRoles(['admin', 'manager']), getInvoicesByCompanyName);
router.get('/getLoadsByOutgoingInvoiceNo', authenticateToken, authorizeRoles(['admin', 'manager']), getLoadsByInvoiceNo);
router.delete('/deleteInvoiceByOutgoingInvoiceNo', authenticateToken, authorizeRoles(['admin', 'manager']), deleteInvoiceByInvoiceNo);
router.post('/previewLinkedLoadsInvoice', authenticateToken, authorizeRoles(['admin', 'manager']), previewLinkedLoadsInvoice);

module.exports = router;
