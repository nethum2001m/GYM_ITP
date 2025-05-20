const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    unique: true,
    required: true
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  salary: { type: Number, required: true },
  phone: { type: String, required: true },
  category: { type: String, required: true }, // Example: "7 days", "1 month"
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Employee", EmployeeSchema);
