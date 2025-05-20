import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toast

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api/packages";

const EditPackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", description: "", price: "", duration: "" });

  useEffect(() => {
    axios.get(`${API_URL}/${id}`)
      .then(res => setFormData(res.data))
      .catch(err => console.error("Error fetching package:", err));
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${id}`, formData);
      toast.success("Package updated successfully!"); // Success toast
      navigate("/admin-panel/packages");
    } catch (err) {
      console.error("Error updating package:", err);
      toast.error("Error updating package!"); // Error toast
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Package</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <input
          type="text"
          name="name"
          value={formData.name}
          required
          onChange={handleChange}
          className="w-full p-2 border rounded-md mb-2"
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          required
          onChange={handleChange}
          className="w-full p-2 border rounded-md mb-2"
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          required
          onChange={handleChange}
          className="w-full p-2 border rounded-md mb-2"
        />
        <select
          name="duration"
          value={formData.duration}
          required
          onChange={handleChange}
          className="w-full p-2 border rounded-md mb-2"
        >
          <option value="1 Day">1 Day</option>
          <option value="1 Month">1 Month</option>
          <option value="Annual">Annual</option>
        </select>
        <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded-md w-full">
          Update Package
        </button>
      </form>
    </div>
  );
};

export default EditPackage;
