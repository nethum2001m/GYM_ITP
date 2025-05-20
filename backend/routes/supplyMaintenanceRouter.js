const express = require("express");
const router = express.Router();
const supplyMaintenanceController = require("../controller/supplymaintaince/supplyMaintenanceController"); // Correct path

// Define the API routes
router.post("/supply-maintenance", supplyMaintenanceController.createRecord);
router.get("/supply-maintenance", supplyMaintenanceController.getAllRecords);
router.get("/supply-maintenance/:id", supplyMaintenanceController.getRecordById);
router.put("/supply-maintenance/:id", supplyMaintenanceController.updateRecord);
router.delete("/supply-maintenance/:id", supplyMaintenanceController.deleteRecord);

module.exports = router;
