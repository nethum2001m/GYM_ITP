const mongoose = require("mongoose");

const supplyMaintenanceSchema = new mongoose.Schema({
  customId: { type: String, unique: true },
  partName: { type: String, required: true },
  description: { type: String, required: true },
  supplier: { type: String, required: true },
  date: { type: Date, required: true },
  partCost: { type: Number, required: true, min: 0 },
  maintenanceCost: { type: Number, required: true, min: 0 },
});

const SupplyMaintenance = mongoose.model("SupplyMaintenance", supplyMaintenanceSchema);

module.exports = SupplyMaintenance;
