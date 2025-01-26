const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

router.post('/add', vehicleController.addVehicle);
router.put('/edit/:id', vehicleController.editVehicle);
router.delete('/delete/:id', vehicleController.deleteVehicle);

module.exports = router;
