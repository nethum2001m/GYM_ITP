import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api/employees";

const AddEmployee = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", salary: "", phone: "", category: "", status: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData);
      toast.success("Employee added successfully!");
      setTimeout(() => navigate("/admin-panel/employees"), 2000);
    } catch (err) {
      console.error("Error adding employee:", err);
      toast.error("Failed to add employee. Try again.");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h2 className="text-2xl font-bold mb-4">Add Employee</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <input type="text" name="name" placeholder="Name" required onChange={handleChange} className="w-full p-2 border rounded-md mb-2"/>
        <input type="email" name="email" placeholder="Email" required onChange={handleChange} className="w-full p-2 border rounded-md mb-2"/>
        <input type="number"name="salary"placeholder="Salary"required min="1"onChange={handleChange}className="w-full p-2 border rounded-md mb-2"
/>

        <div className="mb-4">
  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
    Phone Number
  </label>
  <input
    //type="tel"  {/* Better for mobile devices */}
    id="phone"
    name="phone"
    placeholder="0XX XXXXXXX"
    required
    value={formData.phone}
    onChange={(e) => {
      // Remove all non-digit characters
      let input = e.target.value.replace(/\D/g, '');
      
      // Force first digit to be 0
      if (input.length > 0 && input[0] !== '0') {
        input = '0' + input.slice(0, 9); // Keep max 10 digits (0 + 9 more)
      } else {
        input = input.slice(0, 10); // Limit to 10 digits total
      }

      // Apply formatting (0XX XXXXXXX)
      let formatted = input;
      if (input.length > 3) {
        formatted = `${input.slice(0, 3)} ${input.slice(3)}`;
      }

      setFormData({ ...formData, phone: formatted });
    }}
    pattern="0\d{2} \d{7}"  
    title="Phone number must start with 0 and follow 0XX XXXXXXX format"
    maxLength={11}  
    className={`w-full p-2 border rounded-md  focus:ring-blue-500 focus:border-transparent ${
      formData.phone && !/^0\d{2} \d{7}$/.test(formData.phone) 
        ? 'border-red-500' 
        : 'border-gray-300'
    }`}
  />
  {formData.phone && !/^0\d{2} \d{7}$/.test(formData.phone) && (
    <p className="mt-1 text-sm text-red-600">
      Phone number must start with 0 and follow 0XX XXXXXXX format
    </p>
  )}
</div>

        <select name="category" required onChange={handleChange} className="w-full p-2 border rounded-md mb-2">
          <option value="">Select Category</option>
          <option value="Trainer">Trainer</option>
            <option value="Manager">Manager</option>
            <option value="Receptionist">Receptionist</option>
            <option value="Cleaner">Cleaner</option>
            <option value="Other">Other</option>
        </select>
        <select name="status" required onChange={handleChange} className="w-full p-2 border rounded-md mb-2">
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            
        </select>

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md w-full">
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
