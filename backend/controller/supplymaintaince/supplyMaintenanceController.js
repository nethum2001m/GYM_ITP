const SupplyMaintenance = require("../../models/supplymanitaince/supplyMaintenanceModel");

const createRecord = async (req, res) => {
  try {
    // Count existing records to generate the next ID
    const count = await SupplyMaintenance.countDocuments();
    const newId = `MR${(count + 1).toString().padStart(3, "0")}`; // e.g. SM001, SM002

    const newRecord = new SupplyMaintenance({
      ...req.body,
      customId: newId,
    });

    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getAllRecords = async (req, res) => {
  try {
    const records = await SupplyMaintenance.find();
    res.status(200).json(records);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getRecordById = async (req, res) => {
  try {
    const record = await SupplyMaintenance.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.status(200).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateRecord = async (req, res) => {
  try {
    const record = await SupplyMaintenance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.status(200).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteRecord = async (req, res) => {
  try {
    const record = await SupplyMaintenance.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createRecord, getAllRecords, getRecordById, updateRecord, deleteRecord };