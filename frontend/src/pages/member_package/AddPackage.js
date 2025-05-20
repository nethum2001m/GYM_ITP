import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api/packages";

const AddPackage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", description: "", price: "", duration: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData);
      toast.success("Package added successfully!");
      setTimeout(() => navigate("/admin-panel/packages"), 2000);
    } catch (err) {
      console.error("Error adding package:", err);
      toast.error("Failed to add package. Try again.");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h2 className="text-2xl font-bold mb-4">Add Package</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <input type="text" name="name" placeholder="Name" required onChange={handleChange} className="w-full p-2 border rounded-md mb-2"/>
        <input type="text" name="description" placeholder="Description" required onChange={handleChange} className="w-full p-2 border rounded-md mb-2"/>
        <input type="number" name="price" placeholder="Price" required onChange={handleChange} className="w-full p-2 border rounded-md mb-2"/>
        
        <select name="duration" required onChange={handleChange} className="w-full p-2 border rounded-md mb-2">
          <option value="">Select Duration</option>
          <option value="1 Day">1 Day</option>
          <option value="1 Month">1 Month</option>
          <option value="Annual">Annual</option>
        </select>

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md w-full">
          Add Package
        </button>
      </form>
    </div>
  );
};

export default AddPackage;
