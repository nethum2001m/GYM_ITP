const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  supplierId: {
    type: String,
    unique: true,
    required: true
  },
  supplierName: {
    type: String,
    required: [true, "Supplier name is required"],
    trim: true,
    maxlength: [100, "Supplier name cannot exceed 100 characters"]
  },
  contact: {
    type: String,
    required: [true, "Contact information is required"],
    trim: true,
    maxlength: [50, "Contact information cannot exceed 50 characters"]
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    trim: true,
    maxlength: [200, "Address cannot exceed 200 characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address"]
  }
}, {
  timestamps: true
});

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;