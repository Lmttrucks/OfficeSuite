const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/Upload-info', authenticateToken, authorizeRoles(['admin', 'manager']), (req, res) => {
    res.json({ message: 'Upload is operational' });
});

module.exports = router;
