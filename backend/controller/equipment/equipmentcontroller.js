const Equipment = require('../../models/equipment/equipmnet'); // Import Equipment model

// Create new equipment
const createEquipment = async (req, res) => {
  try {
    // Fetch all equipment to find the max existing ID number
    const allEquipment = await Equipment.find();
    let maxIdNum = 0;

    allEquipment.forEach(equipment => {
      const num = parseInt(equipment.id?.replace("E", ""), 10);
      if (!isNaN(num) && num > maxIdNum) {
        maxIdNum = num;
      }
    });

    const newId = `E${maxIdNum + 1}`;

    // Create equipment with the new auto-generated ID
    const newEquipment = new Equipment({
      ...req.body,
      id: newId,
    });

    await newEquipment.save();
    res.status(201).json(newEquipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Get all equipment
const getAllEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find();
    res.status(200).json(equipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get equipment by id
const getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.status(200).json(equipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update equipment by id
const updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.status(200).json(equipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete equipment by id
const deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndDelete(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.status(200).json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createEquipment,
  getAllEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
};

