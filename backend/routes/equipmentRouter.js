const express = require('express');
const router = express.Router();
const equipmentController = require('../controller/equipment/equipmentcontroller'); // Import controller

// Define Routes
router.post('/equipment', equipmentController.createEquipment); // Create new equipment
router.get('/equipment', equipmentController.getAllEquipment); // Get all equipment
router.get('/equipment/:id', equipmentController.getEquipmentById); // Get equipment by ID
router.put('/equipment/:id', equipmentController.updateEquipment); // Update equipment by ID
router.delete('/equipment/:id', equipmentController.deleteEquipment); // Delete equipment by ID

module.exports = router;

