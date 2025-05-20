import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GrAdd } from "react-icons/gr";
import { MdEdit } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
//import "./App.css";

const SupplyMaintenanceForm = () => {
  const [formData, setFormData] = useState({
    partName: "",
    description: "",
    supplier: "",
    date: "",
    partCost: "",
    maintenanceCost: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.partName.trim()) newErrors.partName = "Part Name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.supplier.trim()) newErrors.supplier = "Supplier Name is required";
    if (!formData.date) {
      newErrors.date = "Maintenance Date is required";
    } else if (formData.date > today) {
      newErrors.date = "Future dates are not allowed";
    }
    if (!formData.partCost || isNaN(formData.partCost) || Number(formData.partCost) <= 0)
      newErrors.partCost = "Valid Part Cost is required";
    if (!formData.maintenanceCost || isNaN(formData.maintenanceCost) || Number(formData.maintenanceCost) < 0)
      newErrors.maintenanceCost = "Valid Maintenance Cost (>= 0) is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const dataToSend = {
        ...formData,
        date: new Date(formData.date),
        partCost: Number(formData.partCost),
        maintenanceCost: Number(formData.maintenanceCost),
      };
      await axios.post("http://localhost:8080/api/supply-maintenance", dataToSend);
      toast.success("Record added successfully!", {
        onClose: () => navigate("/admin-panel/eqipmanage/supply-maintenance-table"),
      });
    } catch (error) {
      toast.error("Failed to add record: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="supply-maintenance-form-container min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4">
      <ToastContainer />
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Add Maintenance Record</h2>

        <div className="space-y-4">
          {/* Part Name */}
          <div>
            <label className="block font-medium">Equipment Name</label>
            <input
              type="text"
              name="partName"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.partName}
              onChange={handleChange}
            />
            {errors.partName && <p className="text-red-500 text-sm mt-1">{errors.partName}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium">Description</label>
            <input
              type="text"
              name="description"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Supplier */}
          <div>
            <label className="block font-medium">Technician</label>
            <input
              type="text"
              name="supplier"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.supplier}
              onChange={handleChange}
            />
            {errors.supplier && <p className="text-red-500 text-sm mt-1">{errors.supplier}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="block font-medium">Maintenance Date</label>
            <input
              type="date"
              name="date"
              max={today}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.date}
              onChange={handleChange}
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
          </div>

          {/* Part Cost */}
          <div>
            <label className="block font-medium">Part Cost</label>
            <input
              type="number"
              name="partCost"
              min={1}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.partCost}
              onChange={handleChange}
            />
            {errors.partCost && <p className="text-red-500 text-sm mt-1">{errors.partCost}</p>}
          </div>

          {/* Maintenance Cost */}
          <div>
            <label className="block font-medium">Maintenance Cost</label>
            <input
              type="number"
              name="maintenanceCost"
              min={0}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.maintenanceCost}
              onChange={handleChange}
            />
            {errors.maintenanceCost && <p className="text-red-500 text-sm mt-1">{errors.maintenanceCost}</p>}
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow-md transition transform hover:scale-105"
            >
              Add Record
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyMaintenanceForm;
