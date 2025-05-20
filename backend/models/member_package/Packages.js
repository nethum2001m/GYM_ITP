const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true }, // Example: "7 days", "1 month"
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Package", PackageSchema);
