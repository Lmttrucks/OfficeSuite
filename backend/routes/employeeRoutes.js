const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.post('/add', employeeController.addEmployee);
router.put('/edit/:id', employeeController.editEmployee);
router.delete('/delete/:id', employeeController.deleteEmployee);

module.exports = router;
