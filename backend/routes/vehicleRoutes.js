const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/add', authenticateToken, authorizeRoles(['admin', 'manager']), vehicleController.addVehicle);
router.put('/edit/:id', authenticateToken, authorizeRoles(['admin', 'manager']), vehicleController.editVehicle);
router.delete('/delete/:id', authenticateToken, authorizeRoles(['admin']), vehicleController.deleteVehicle);

module.exports = router;
