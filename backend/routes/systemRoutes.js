const express = require('express');
const router = express.Router();

router.get('/system-info', (req, res) => {
    res.json({ message: 'System is operational' });
});

module.exports = router;
