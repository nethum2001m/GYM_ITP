import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toast

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api/employees";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", salary: "", phone: "", category: "", status: "" });

  useEffect(() => {
    axios.get(`${API_URL}/${id}`)
      .then(res => setFormData(res.data))
      .catch(err => console.error("Error fetching employee:", err));
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${id}`, formData);
      toast.success("Employee updated successfully!"); // Success toast
      navigate("/admin-panel/employees");
    } catch (err) {
      console.error("Error updating employee:", err);
      toast.error("Error updating employee!"); // Error toast
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Employee</h2>
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
          type="email"
          name="email"
          value={formData.email}
          required
          onChange={handleChange}
          className="w-full p-2 border rounded-md mb-2"
        />
        <input
          type="number"
          name="salary"
          value={formData.salary}
          required min="1"
          onChange={handleChange}
          className="w-full p-2 border rounded-md mb-2"
        />
        <div className="mb-4">
  <input
    type="tel"
    name="phone"
    placeholder="0XX XXXXXXX"
    required
    value={formData.phone}
    onChange={(e) => {
      // Remove all non-digit characters
      let digits = e.target.value.replace(/\D/g, '');
      
      // Enforce Sri Lankan format (must start with 0)
      if (digits.length > 0 && digits[0] !== '0') {
        digits = '0' + digits.slice(0, 9); // Force leading zero
      }
      
      // Limit to 10 digits
      digits = digits.slice(0, 10);

      // Format as 0XX XXXXXX
      let formatted = digits;
      if (digits.length > 3) {
        formatted = `${digits.slice(0, 3)} ${digits.slice(3)}`;
      }

      setFormData({ ...formData, phone: formatted });
    }}
    pattern="0\d{2} \d{7}"
    title="Sri Lankan phone format: 0XX XXXXXXX (10 digits total)"
    maxLength={11} // 10 digits + space
    className={`w-full p-2 border rounded-md ${
      formData.phone && !/^0\d{2} \d{7}$/.test(formData.phone) 
        ? 'border-red-500' 
        : 'border-gray-300'
    }`}
  />
  {formData.phone && !/^0\d{2} \d{7}$/.test(formData.phone) && (
    <p className="mt-1 text-xs text-red-500">
      Please enter a valid Sri Lankan phone number (0XX XXXXXXX format)
    </p>
  )}
</div>

        <select
          name="category"
          value={formData.category}
          required
          onChange={handleChange}
          className="w-full p-2 border rounded-md mb-2"
        >
          <option value="Trainer">Trainer</option>
            <option value="Manager">Manager</option>
            <option value="Receptionist">Receptionist</option>
            <option value="Cleaner">Cleaner</option>
            <option value="Other">Other</option>
        </select>
        <select
          name="status"
          value={formData.status}
          required
          onChange={handleChange}
          className="w-full p-2 border rounded-md mb-2"
        >
           <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Terminated">Terminated</option>
        </select>
        <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded-md w-full">
          Update Employee
        </button>
      </form>
    </div>
  );
};

export default EditEmployee;
