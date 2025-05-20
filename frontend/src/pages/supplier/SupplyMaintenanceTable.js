import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { GrAdd } from "react-icons/gr";
import { MdEdit } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import jsPDF from "jspdf";
//import "jspdf-autotable";
//import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const SupplyMaintenanceTable = () => {
  const [supplyMaintenanceList, setSupplyMaintenanceList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    const fetchSupplyMaintenance = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/supply-maintenance");
        setSupplyMaintenanceList(response.data);
      } catch (error) {
        console.error("Failed to fetch supply maintenance records:", error);
      }
    };

    fetchSupplyMaintenance();
  }, []);

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/supply-maintenance/${id}`, editData);
      const updatedList = supplyMaintenanceList.map((item) => (item._id === id ? { ...item, ...editData } : item));
      setSupplyMaintenanceList(updatedList);
      setEditId(null);
    } catch (error) {
      alert("Failed to update maintenance record: " + (error.response?.data?.message || error.message));
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/supply-maintenance/${deleteId}`);
      setSupplyMaintenanceList(supplyMaintenanceList.filter((item) => item._id !== deleteId));
      setOpenDeleteDialog(false);
      setSnackbarMessage("Record deleted successfully!");
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 3000);
    } catch (error) {
      alert("Failed to delete maintenance record: " + (error.response?.data?.message || error.message));
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const handleDownloadReport = () => {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;

  // Header
  // Header styling
    doc.setDrawColor(100, 100, 255);
    doc.setFillColor(245, 245, 255);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Gym information
    doc.setFontSize(16);
    doc.setTextColor(60, 60, 200);
    doc.setFont('helvetica', 'bold');
    doc.text('REAL FITNESS CENTER', margin, 15);
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('No-29/1/1, Light House Road, Dondra', margin, 22);
    doc.text('Phone: 0763356041 | Email: realfitnesscenter@gmail.com', margin, 28);

    // Report title
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.setFont('helvetica', 'bold');
    doc.text('Supply Maintenance Report', pageWidth - margin, 15, { align: 'right' });

  

  // Table
  const tableColumn = ["ID", "Part Name", "Supplier", "Description", "Part Cost", "Maintenance Cost", "Date"];
  const tableRows = [];

  supplyMaintenanceList.forEach((record) => {
    tableRows.push([
      record.customId,
      record.partName,
      record.supplier,
      record.description,
      record.partCost,
      record.maintenanceCost,
      formatDate(record.date),
    ]);
  });

  // Use autoTable this way
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    styles: { fontSize: 10 },
  });

  doc.save("supply-maintenance-report.pdf");
};


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Maintenance Records</h1>
      <div className="mt-6 space-x-2 flex">
        <Link
          to="/admin-panel/eqipmanage/supply-maintenance-form"
          className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <GrAdd />
          Add Maintenance Record
        </Link>
        <button
          onClick={handleDownloadReport}
          className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          Download Report
        </button>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Equipment Name</th>
              <th className="p-2 border">Technician</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Part Cost</th>
              <th className="p-2 border">Maintenance Cost</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {supplyMaintenanceList.map((record) => (
              <tr key={record._id} className="border-t">
                <td className="p-2 border">{record.customId}</td>
                <td className="p-2 border">{record.partName}</td>
                <td className="p-2 border">{record.supplier}</td>
                <td className="p-2 border">{record.description}</td>
                <td className="p-2 border">{record.partCost}</td>
                <td className="p-2 border">{record.maintenanceCost}</td>
                <td className="p-2 border">{formatDate(record.date)}</td>
                <td className="p-2 border space-x-2 flex justify-center">
                  <button
                    onClick={() => handleOpenDeleteDialog(record._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md flex items-center gap-2"
                  >
                    <AiFillDelete />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {openDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this record?</p>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setOpenDeleteDialog(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar Alert */}
      {showSnackbar && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded shadow-lg">
          {snackbarMessage}
        </div>
      )}
    </div>
  );
};

export default SupplyMaintenanceTable;
