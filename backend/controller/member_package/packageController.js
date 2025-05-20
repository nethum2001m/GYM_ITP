const Package = require("../../models/member_package/Packages");

// Add Package
exports.addPackage = async (req, res) => {
  try {
    const { name, description, price, duration } = req.body;
    const newPackage = new Package({ name, description, price, duration });
    await newPackage.save();
    res.status(201).json({ message: "Package added successfully", newPackage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Packages
exports.getPackages = async (req, res) => {
  try {
    const packages = await Package.find();
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Package by ID
exports.getPackageById = async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
    if (!package) return res.status(404).json({ message: "Package not found" });
    res.status(200).json(package);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Package
exports.updatePackage = async (req, res) => {
  try {
    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPackage) return res.status(404).json({ message: "Package not found" });
    res.status(200).json({ message: "Package updated", updatedPackage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Package
exports.deletePackage = async (req, res) => {
  try {
    const deletedPackage = await Package.findByIdAndDelete(req.params.id);
    if (!deletedPackage) return res.status(404).json({ message: "Package not found" });
    res.status(200).json({ message: "Package deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
