import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast CSS
import { GrAdd } from "react-icons/gr";
import { MdEdit } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import { BsDashCircleFill } from "react-icons/bs";
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import { BsCheckCircleFill } from "react-icons/bs";
import ROLE from '../../common/role';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';




const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api/employees";





const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const user = useSelector(state => state?.user?.user);
const navigate = useNavigate();

useEffect(() => {
    if (user?.role == ROLE.INSTRUCTOR) {
      toast.error("You are not authorized to access this page");
      navigate('/admin-panel');
    }
  }, [user, navigate]);

  

  useEffect(() => {
    axios.get(API_URL)
      .then(res => setEmployees(res.data))
      .catch(err => console.error("Error fetching employees:", err));
  }, []);
  

  const handleDelete = async (id) => {
  toast(
    ({ closeToast }) => (
      <div>
        <p>Are you sure you want to delete this employee?</p>
        <div className="mt-2 flex justify-end gap-2">
          <button
            onClick={async () => {
              try {
                await axios.delete(`${API_URL}/${id}`);
                setEmployees((prev) => prev.filter(emp => emp._id !== id));
                toast.success("Employee deleted successfully!");
              } catch (err) {
                console.error("Error deleting employee:", err);
                toast.error("Error deleting employee!");
              }
              toast.dismiss(); // Close the confirm toast
            }}
            className="px-2 py-1 bg-red-600 text-white rounded"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-2 py-1 bg-gray-300 text-black rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    {
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
    }
  );
};
  

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">Employees</h2>
      <Link to="/admin-panel/employees/add">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 flex items-center gap-2"><GrAdd />Add Epployee</button>
      </Link>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
  <thead className="bg-gray-200 text-gray-700">
    <tr>
      <th className="py-3 px-6 text-left">ID</th>
      <th className="py-3 px-6 text-left">Name</th>
      <th className="py-3 px-6 text-left">Email</th>
      <th className="py-3 px-6 text-left">Salary (Rs.)</th>
      <th className="py-3 px-6 text-left">Phone</th>
      <th className="py-3 px-6 text-left">Category</th>
      <th className="py-3 px-6 text-left">Status</th>
      <th className="py-3 px-6 text-left">Actions</th>
    </tr>
  </thead>
  <tbody>
    {employees.map(emp => (
      <tr key={emp._id} className="border-b hover:bg-gray-100">
        <td className="py-3 px-6">{emp.employeeId}</td>
        <td className="py-3 px-6">{emp.name}</td>
        <td className="py-3 px-6">{emp.email}</td>
        <td className="py-3 px-6 font-bold text-green-600">{emp.salary}</td>
        <td className="py-3 px-6">{emp.phone}</td>
        <td className="py-3 px-6">{emp.category}</td>
        <td
            className={`py-3 px-6 font-semibold ${
              emp.status === "Active"
                ? "text-green-600"
                : emp.status === "On Leave"
                ? "text-yellow-500"
                : "text-red-500"
            }`}
          ><div className="flex items-center gap-2">{emp.status === "Active"
            ? <BsCheckCircleFill />
            : emp.status === "On Leave"
            ? <BsArrowUpRightCircleFill />
            :  <BsDashCircleFill />}
            {emp.status}</div>
        </td>
        <td className="py-3 px-6 flex gap-2">
          <Link to={`/admin-panel/employees/edit/${emp._id}`}>
            <button className="bg-yellow-500 text-white px-3 py-1 rounded-md flex items-center gap-2">
              <MdEdit /> Edit
            </button>
          </Link>
          <button onClick={() => handleDelete(emp._id)} className="bg-red-500 text-white px-3 py-1 rounded-md flex items-center gap-2">
            <AiFillDelete /> Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
};

export default EmployeeList;
