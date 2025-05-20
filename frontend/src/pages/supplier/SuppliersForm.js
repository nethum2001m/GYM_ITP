import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SuppliersForm = () => {
  const [formData, setFormData] = useState({
    supplierId: "",
    supplierName: "",
    contact: "",
    address: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // 👇 Fetch suppliers and generate the next supplierId
  useEffect(() => {
    const generateSupplierId = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/suppliers");
        const suppliers = res.data;

        const ids = suppliers
          .map((s) => parseInt(s.supplierId?.replace("SUP", "")))
          .filter((n) => !isNaN(n));
        const maxId = ids.length > 0 ? Math.max(...ids) : 0;
        const newId = `SUP${String(maxId + 1).padStart(3, "0")}`;

        setFormData((prev) => ({ ...prev, supplierId: newId }));
      } catch (err) {
        console.error("Error generating supplier ID:", err);
        //toast.error("Failed to generate supplier ID");
      }
    };

    generateSupplierId();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "contact") {
      const rawValue = value.replace(/\D/g, "").slice(0, 10); // Only digits
      formattedValue =
        rawValue.length <= 3 ? rawValue : `${rawValue.slice(0, 3)} ${rawValue.slice(3)}`;
    }

    setFormData({ ...formData, [name]: formattedValue });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.supplierName.trim()) newErrors.supplierName = "Supplier name is required";

    if (!formData.contact.trim()) {
      newErrors.contact = "Contact is required";
    } else if (!/^\d{3} \d{7}$/.test(formData.contact.trim())) {
      newErrors.contact = "Contact must be in the format XXX XXXXXXX";
    }

    if (!formData.address.trim()) newErrors.address = "Address is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await axios.post("http://localhost:8080/api/suppliers", formData);
      toast.success("Supplier added successfully!", { position: "top-right" });
      setTimeout(() => navigate("/admin-panel/eqipmanage/suppliers-table"), 300);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add supplier", {
        position: "top-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Supplier Form</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Supplier ID */}
        

        {/* Supplier Name */}
        <div>
          <label htmlFor="supplierName" className="block font-medium mb-1">Supplier Name</label>
          <input
            type="text"
            id="supplierName"
            name="supplierName"
            value={formData.supplierName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.supplierName && (
            <p className="text-red-600 text-sm mt-1">{errors.supplierName}</p>
          )}
        </div>

        {/* Contact */}
        <div>
          <label htmlFor="contact" className="block font-medium mb-1">Contact Number</label>
          <input
  type="text"
  id="contact"
  name="contact"
  value={formData.contact}
  onChange={(e) => {
    // Remove all non-digit characters
    const rawValue = e.target.value.replace(/\D/g, '');
    
    // Ensure input starts with 0 and limit to 10 digits
    let processedValue = '';
    if (rawValue.length > 0) {
      if (rawValue[0] !== '0') {
        // If first digit isn't 0, force it to be 0
        processedValue = '0' + rawValue.slice(0, 9);
      } else {
        processedValue = rawValue.slice(0, 10);
      }
      
      // Apply formatting (0XX XXXXXXX)
      if (processedValue.length > 3) {
        processedValue = `${processedValue.slice(0, 3)} ${processedValue.slice(3)}`;
      }
    }

    // Update form data
    handleChange({
      target: {
        name: 'contact',
        value: processedValue
      }
    });

    // Validate format (0 followed by 2 digits, space, then 7 digits)
    const isValid = /^0\d{2} \d{7}$/.test(processedValue);
    if (!isValid) {
      setErrors(prev => ({
        ...prev,
        contact: 'Phone number must be in 0XX XXXXXXX format'
      }));
    } else {
      setErrors(prev => ({ ...prev, contact: '' }));
    }
  }}
  maxLength={11}
  placeholder="0XX XXXXXXX"
  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
    errors.contact ? 'border-red-500' : 'border-gray-300'
  }`}
/>

          {errors.contact && (
            <p className="text-red-600 text-sm mt-1">{errors.contact}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block font-medium mb-1">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.address && (
            <p className="text-red-600 text-sm mt-1">{errors.address}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block font-medium mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@email.com"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Adding..." : "Add Supplier"}
          </button>

          <Link
            to="/admin-panel/eqipmanage/suppliers-table"
            className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
          >
            Back to Home
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SuppliersForm;
