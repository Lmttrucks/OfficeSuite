const express = require('express');
const router = express.Router();
const { addRate, adjustRates, getAllRates, editRate } = require('../controllers/ratesController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, authorizeRoles(['admin']), addRate);
router.put('/adjust', authenticateToken, authorizeRoles(['admin']), adjustRates);
router.get('/', authenticateToken, authorizeRoles(['admin']), getAllRates);
router.put('/:rateID', authenticateToken, authorizeRoles(['admin']), editRate);

module.exports = router;