import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GrAdd } from "react-icons/gr";
import { MdEdit } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";

const EquipmentTable = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/equipment");
        setEquipmentList(response.data);
      } catch (error) {
        console.error("Failed to fetch equipment:", error);
      }
    };

    fetchEquipment();
  }, []);

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/equipment/${id}`, editData);
      const updatedList = equipmentList.map((item) =>
        item._id === id ? { ...item, ...editData } : item
      );
      setEquipmentList(updatedList);
      setEditId(null);
    } catch (error) {
      toast.error("Failed to update equipment: " + (error.response?.data?.message || error.message));
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/equipment/${deleteId}`);
      setEquipmentList(equipmentList.filter((item) => item._id !== deleteId));
      setOpenDeleteDialog(false);
      toast.success("Equipment deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete equipment: " + (error.response?.data?.message || error.message));
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  return (
    
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Equipment List</h1>
      {/* Add and Back Buttons */}
      <div className="mt-6 space-x-4">
        <Link
          to="/admin-panel/eqipmanage/equipment-form"
          className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 flex items-center gap-2 w-60"><GrAdd />Add New Equipment
        </Link>
        
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Category</th>
              <th className="py-2 px-4 border-b">Brand</th>
              <th className="py-2 px-4 border-b">Model</th>
              <th className="py-2 px-4 border-b">Purchase Date</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipmentList.map((equipment) => (
              <tr key={equipment._id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{equipment.id}</td>
                <td className="py-2 px-4">
                  {editId === equipment._id ? (
                    <input
                      name="name"
                      defaultValue={equipment.name}
                      onChange={handleEditChange}
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : (
                    equipment.name
                  )}
                </td>
                <td className="py-2 px-4">
  {editId === equipment._id ? (
    <select
      name="category"
      defaultValue={equipment.category}
      onChange={handleEditChange}
      className="border px-2 py-1 rounded w-full"
    >
      <option value="">-- Select Category --</option>
      <option value="Cardio">Cardio</option>
      <option value="Strength">Strength</option>
      <option value="Flexibility">Flexibility</option>
      <option value="Balance">Balance</option>
    </select>
  ) : (
    equipment.category
  )}
</td>

                <td className="py-2 px-4">
                  {editId === equipment._id ? (
                    <input
                      name="brand"
                      defaultValue={equipment.brand}
                      onChange={handleEditChange}
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : (
                    equipment.brand
                  )}
                </td>
                <td className="py-2 px-4">
                  {editId === equipment._id ? (
                    <input
                      name="model"
                      defaultValue={equipment.model}
                      onChange={handleEditChange}
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : (
                    equipment.model
                  )}
                </td>
                <td className="py-2 px-4">
  {editId === equipment._id ? (
    <input
  type="date"
  name="purchaseDate"
  defaultValue={
    equipment.purchaseDate
      ? new Date(equipment.purchaseDate).toISOString().split('T')[0]
      : ''
  }
  onChange={handleEditChange}
  className="border px-2 py-1 rounded w-full"
  max={new Date().toISOString().split("T")[0]} 
/>

  ) : (
    formatDate(equipment.purchaseDate)
  )}
</td>

                <td className="py-2 px-4 space-x-2 flex">
                  {editId === equipment._id ? (
                    <button
                      onClick={() => handleSave(equipment._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                  ) : (
                    
                    <button
                      onClick={() => setEditId(equipment._id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md flex items-center gap-2"
                    ><MdEdit />
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleOpenDeleteDialog(equipment._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md flex items-center gap-2"
                  ><AiFillDelete />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      {/* Delete Confirmation Dialog */}
      {openDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-2">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this record?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setOpenDeleteDialog(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default EquipmentTable;
