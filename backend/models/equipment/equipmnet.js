const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema({
  id: { type: String, required: true ,unique:true},
  name: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  purchaseDate: { type: Date, required: true },
  price: { type: Number, required: true }, // Keep this, remove quantity
});

const Equipment = mongoose.model("Equipment", equipmentSchema);



module.exports = Equipment;