const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { previewInvoice, insertInvoice, uploadInvoiceToBlob, getInvoicesByCompanyName, getLoadsByInvoiceNo, deleteInvoiceByInvoiceNo, previewLinkedLoadsInvoice, getLast1000Invoices, updateInvoice } = require('../controllers/invoiceController');
const multer = require('multer');
const upload = multer();

router.post('/previewInvoice', authenticateToken, authorizeRoles(['admin', 'manager']), previewInvoice);
router.post('/insertInvoice', authenticateToken, authorizeRoles(['admin', 'manager']), insertInvoice);
router.post('/uploadInvoiceToBlob', authenticateToken, authorizeRoles(['admin', 'manager']), upload.single('file'), uploadInvoiceToBlob);
router.get('/getInvoicesByCompanyName', authenticateToken, authorizeRoles(['admin', 'manager']), getInvoicesByCompanyName);
router.get('/getLoadsByInvoiceNo', authenticateToken, authorizeRoles(['admin', 'manager']), getLoadsByInvoiceNo);
router.delete('/deleteInvoiceByInvoiceNo/:InvoiceNo', authenticateToken, authorizeRoles(['admin', 'manager']), deleteInvoiceByInvoiceNo);
router.post('/previewLinkedLoadsInvoice', authenticateToken, authorizeRoles(['admin', 'manager']), previewLinkedLoadsInvoice);
router.get('/last-1000-invoices', authenticateToken, authorizeRoles(['admin', 'manager']), getLast1000Invoices);
router.put('/:InvoiceNo', authenticateToken, authorizeRoles(['admin', 'manager']), updateInvoice);

module.exports = router;
