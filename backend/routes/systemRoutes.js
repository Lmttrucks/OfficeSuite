const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { backupDatabaseAndBlobStorage } = require('../controllers/systemController');

router.get('/system-info', (req, res) => {
    res.json({ message: 'System is operational' });
});

router.post('/backup', authenticateToken, authorizeRoles(['admin']), backupDatabaseAndBlobStorage);

module.exports = router;
