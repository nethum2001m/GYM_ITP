const express = require("express");
const router = express.Router();
const {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} = require("../controller/supplier/supplierController");

router.post("/suppliers", createSupplier);
router.get("/suppliers", getAllSuppliers);
router.get("/suppliers/:id", getSupplierById);
router.put("/suppliers/:id", updateSupplier);
router.delete("/suppliers/:id", deleteSupplier);

module.exports = router;