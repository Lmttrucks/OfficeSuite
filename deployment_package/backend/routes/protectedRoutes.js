const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/admin/dashboard', authenticateToken, authorizeRoles(['admin']), (req, res) => {
    res.json({ message: `Welcome to the admin dashboard, ${req.user.role}!`, user: req.user });
});

router.get('/manager/dashboard', authenticateToken, authorizeRoles(['manager']), (req, res) => {
    res.json({ message: `Welcome to the manager dashboard, ${req.user.role}!`, user: req.user });
});

router.get('/driver/profile', authenticateToken, authorizeRoles(['driver']), (req, res) => {
    res.json({ message: `Welcome to the driver profile, ${req.user.role}!`, user: req.user });
});

module.exports = router;
