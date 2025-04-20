const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/add', authenticateToken, authorizeRoles(['admin', 'manager']), employeeController.addEmployee);
router.put('/edit/:id', authenticateToken, authorizeRoles(['admin', 'manager']), employeeController.editEmployee);
router.delete('/delete/:id', authenticateToken, authorizeRoles(['admin']), employeeController.deleteEmployee);

module.exports = router;
