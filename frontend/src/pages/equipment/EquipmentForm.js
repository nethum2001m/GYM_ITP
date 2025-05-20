import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EquipmentForm = () => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "",
    brand: "",
    model: "",
    purchaseDate: "",
    price: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/equipment");
        const equipments = response.data;
        let maxId = 0;
        equipments.forEach((item) => {
          const number = parseInt(item.id?.replace("E", "") || "0", 10);
          if (!isNaN(number) && number > maxId) {
            maxId = number;
          }
        });
        const newId = `E${maxId + 1}`;
        setFormData((prevData) => ({ ...prevData, id: newId }));
      } catch (error) {
        console.error("Failed to fetch equipment:", error);
      }
    };
    fetchEquipment();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "purchaseDate") {
      const formattedDate = new Date(value).toISOString().split("T")[0];
      setFormData({ ...formData, [name]: formattedDate });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    let formErrors = {};
    if (!formData.name) formErrors.name = "Name is required";
    if (!formData.category) formErrors.category = "Category is required";
    if (!formData.brand) formErrors.brand = "Brand is required";
    if (!formData.model) formErrors.model = "Model is required";
    if (!formData.purchaseDate) {
      formErrors.purchaseDate = "Purchase Date is required";
    } else if (new Date(formData.purchaseDate) > new Date()) {
      formErrors.purchaseDate = "Purchase date cannot be in the future";
    }
    if (!formData.price || isNaN(formData.price)) {
      formErrors.price = "Price is required and must be a number";
    } else if (parseFloat(formData.price) < 0) {
      formErrors.price = "Price cannot be negative";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error("Please correct the highlighted errors.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/equipment", formData);
      toast.success("Equipment added successfully!");
      setTimeout(() => {
        navigate("/admin-panel/eqipmanage/equipment-table");
      }, 1500);
    } catch (error) {
      toast.error(
        "Failed to add equipment: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
  className="bg-white p-8 rounded shadow-md w-full max-w-lg"
  onSubmit={(e) => {
    e.preventDefault();
    handleSubmit();
  }}
>
  <h1 className="text-2xl font-bold mb-6 text-center">Equipment Form</h1>

  {["id", "name", "category", "brand", "model", "purchaseDate", "price"].map((field) => (
    <div className="mb-4" key={field}>
      <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
        {field.charAt(0).toUpperCase() + field.slice(1)}
      </label>

      {field === "category" ? (
        <select
          id={field}
          name={field}
          value={formData[field]}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded ${
            errors[field] ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select Category</option>
          <option value="Cardio">Cardio</option>
          <option value="Strength">Strength</option>
          <option value="Cleaning">Cleaning</option>
          <option value="Balance">Balance</option>
        </select>
      ) : (
        <input
          type={
            field === "purchaseDate" ? "date" :
            field === "price" ? "number" :
            "text"
          }
          id={field}
          name={field}
          value={formData[field]}
          onChange={handleChange}
          disabled={field === "id"}
          max={field === "purchaseDate" ? new Date().toISOString().split("T")[0] : undefined}
          min={field === "price" ? "0" : undefined}
          step={field === "price" ? "0.01" : undefined}
          className={`w-full px-4 py-2 border rounded ${
            errors[field] ? "border-red-500" : "border-gray-300"
          }`}
        />
      )}

      {errors[field] && (
        <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
      )}
    </div>
  ))}

  <div className="flex justify-between items-center mt-6">
    <button
      type="submit"
      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
    >
      Add Equipment
    </button>
    <Link
      to="/"
      className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
    >
      Back to Home
    </Link>
  </div>
</form>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EquipmentForm;
