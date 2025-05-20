import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { GrAdd } from "react-icons/gr";
import { MdEdit } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SuppliersTable = () => {
  const [suppliersList, setSuppliersList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [errors, setErrors] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:8080/api/suppliers");
        const data = response.data?.data || response.data;
        setSuppliersList(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch suppliers");
        setSuppliersList([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateEditForm = () => {
    const newErrors = {};
    if (!editData.supplierName?.trim()) newErrors.supplierName = "Supplier name is required";
    if (!editData.contact?.trim()) newErrors.contact = "Contact is required";
    if (!editData.address?.trim()) newErrors.address = "Address is required";
    if (!editData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(editData.email)) {
      newErrors.email = "Invalid email format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (id) => {
    if (!validateEditForm()) return;

    try {
      const response = await axios.put(`http://localhost:8080/api/suppliers/${id}`, editData);
      const updatedList = suppliersList.map((item) =>
        item._id === id ? { ...item, ...response.data.supplier } : item
      );
      setSuppliersList(updatedList);
      setEditId(null);
      toast.success("Supplier updated successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update supplier";
      toast.error(errorMessage);
      if (error.response?.data?.field === "email") {
        setErrors({ ...errors, email: errorMessage });
      }
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/suppliers/${deleteId}`);
      setSuppliersList(suppliersList.filter((item) => item._id !== deleteId));
      setShowDeleteConfirm(false);
      toast.success("Supplier deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete supplier");
    }
  };

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl font-bold">Suppliers List</h1>
      <div className="mt-6 space-x-4">
        <Link
          to="/admin-panel/eqipmanage/suppliers-form"
          className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 flex items-center gap-2 w-60"
        >
          <GrAdd />
          Add New Supplier
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="loader border-4 border-blue-500 border-t-transparent rounded-full w-10 h-10 animate-spin"></div>
        </div>
      ) : suppliersList.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No suppliers found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Supplier ID</th>
                <th className="border px-4 py-2 text-left">Supplier Name</th>
                <th className="border px-4 py-2 text-left">Contact</th>
                <th className="border px-4 py-2 text-left">Address</th>
                <th className="border px-4 py-2 text-left">Email</th>
                <th className="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliersList.map((supplier) => (
                <tr key={supplier._id} className="border-b">
                  <td className="border px-4 py-2">{supplier.supplierId || "N/A"}</td>
                  <td className="border px-4 py-2">
                    {editId === supplier._id ? (
                      <input
                        name="supplierName"
                        value={editData.supplierName || ""}
                        onChange={handleEditChange}
                        className="w-full border px-2 py-1 rounded"
                      />
                    ) : (
                      supplier.supplierName
                    )}
                    {errors.supplierName && <p className="text-red-500 text-sm">{errors.supplierName}</p>}
                  </td>
                  <td className="border px-4 py-2">
                    {editId === supplier._id ? (
                      <>
                        <input
  name="contact"
  value={editData.contact || ""}
  onChange={(e) => {
    // Remove all non-digit characters and limit to 10 digits
    const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
    
    // Ensure first digit is 0
    if (raw.length > 0 && raw[0] !== "0") {
      setErrors((prev) => ({
        ...prev,
        contact: "Contact number must start with 0",
      }));
      return;
    }

    // Format as XXX XXXXXXX after 3 digits
    const formatted = raw.length <= 3 ? raw : `${raw.slice(0, 3)} ${raw.slice(3)}`;
    
    handleEditChange({
      target: {
        name: "contact",
        value: formatted,
      },
    });

    // Validation for complete number (012 3456789 format)
    if (!/^0\d{2} \d{7}$/.test(formatted)) {
      setErrors((prev) => ({
        ...prev,
        contact: "Contact must be in 0XX XXXXXXX format",
      }));
    } else {
      setErrors((prev) => ({ ...prev, contact: "" }));
    }
  }}
  className="w-full border px-2 py-1 rounded"
  placeholder="012 3456789"
  maxLength={11} // 10 digits + 1 space
/>
                        {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
                      </>
                    ) : (
                      supplier.contact
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {editId === supplier._id ? (
                      <input
                        name="address"
                        value={editData.address || ""}
                        onChange={handleEditChange}
                        className="w-full border px-2 py-1 rounded"
                      />
                    ) : (
                      supplier.address
                    )}
                    {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                  </td>
                  <td className="border px-4 py-2">
                    {editId === supplier._id ? (
                      <input
                        name="email"
                        type="email"
                        value={editData.email || ""}
                        onChange={handleEditChange}
                        className="w-full border px-2 py-1 rounded"
                      />
                    ) : (
                      supplier.email
                    )}
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {editId === supplier._id ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleSave(supplier._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditId(null);
                            setErrors({});
                          }}
                          className="border border-gray-500 px-3 py-1 rounded hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => {
                            setEditId(supplier._id);
                            setEditData({
                              supplierName: supplier.supplierName,
                              contact: supplier.contact,
                              address: supplier.address,
                              email: supplier.email,
                            });
                          }}
                          className="bg-yellow-500 text-white px-3 py-1 rounded-md flex items-center gap-2"
                        >
                          <MdEdit />Edit
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(supplier._id);
                            setShowDeleteConfirm(true);
                          }}
                          className="bg-red-500 text-white px-3 py-1 rounded-md flex items-center gap-2"
                        >
                          <AiFillDelete />Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete this supplier?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuppliersTable;
