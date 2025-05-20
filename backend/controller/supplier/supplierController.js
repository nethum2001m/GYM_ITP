const Supplier = require("../../models/supllier/Suppliermodel");

// Generate next supplierId like SUP001, SUP002
const generateSupplierId = async () => {
  const latestSupplier = await Supplier.findOne().sort({ createdAt: -1 });
  
  if (!latestSupplier || !latestSupplier.supplierId) {
    return 'SUP001'; // If no suppliers exist, start with SUP001
  }
  
  const latestIdNum = parseInt(latestSupplier.supplierId.slice(3)) + 1;
  return `SUP${latestIdNum.toString().padStart(3, '0')}`;
};

// Create a new supplier
const createSupplier = async (req, res) => {
  try {
    const { supplierName, contact, address, email } = req.body;
    
    // Validate required fields
    if (!supplierName || !contact || !address || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
        fields: {
          supplierName: !supplierName,
          contact: !contact,
          address: !address,
          email: !email
        }
      });
    }

    // Email format validation
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
        field: "email"
      });
    }

    // Check if email exists
    const existingSupplier = await Supplier.findOne({ email });
    if (existingSupplier) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
        field: "email"
      });
    }

    // Generate supplierId
    const supplierId = await generateSupplierId();

    // Create a new supplier
    const newSupplier = new Supplier({
      supplierId,
      supplierName,
      contact,
      address,
      email,
    });
    
    await newSupplier.save();
    
    res.status(201).json({
      success: true,
      message: "Supplier created successfully",
      supplier: newSupplier
    });
  } catch (error) {
    console.error("Error creating supplier:", error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
        field: "email"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Server error while creating supplier"
    });
  }
};

// Get all suppliers
const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: suppliers
    });
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching suppliers",
      data: []
    });
  }
};

// Get supplier by ID
const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found"
      });
    }
    res.status(200).json({
      success: true,
      supplier
    });
  } catch (error) {
    console.error("Error fetching supplier:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching supplier"
    });
  }
};

// Update supplier by ID
const updateSupplier = async (req, res) => {
  try {
    const { supplierName, contact, address, email } = req.body;
    
    // Validate required fields
    if (!supplierName || !contact || !address || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { supplierName, contact, address, email },
      { new: true, runValidators: true }
    );

    if (!updatedSupplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Supplier updated successfully",
      supplier: updatedSupplier
    });
  } catch (error) {
    console.error("Error updating supplier:", error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
        field: "email"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Server error while updating supplier"
    });
  }
};

// Delete supplier by ID
const deleteSupplier = async (req, res) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
    
    if (!deletedSupplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Supplier deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting supplier:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting supplier"
    });
  }
};

module.exports = {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier
};
