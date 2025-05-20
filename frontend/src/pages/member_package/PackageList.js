import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast CSS
import { GrAdd } from "react-icons/gr";
import { MdEdit } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import ROLE from '../../common/role';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api/packages";



const PackageList = () => {
  const [packages, setPackages] = useState([]);
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
      .then(res => setPackages(res.data))
      .catch(err => console.error("Error fetching packages:", err));
  }, []);

  const handleDelete = async (id) => {
  const toastId = toast(
    ({ closeToast }) => (
      <div>
        <p>Are you sure you want to delete this package?</p>
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={async () => {
              try {
                await axios.delete(`${API_URL}/${id}`);
                setPackages((prev) => prev.filter(pkg => pkg._id !== id));
                toast.success("Package deleted successfully!");
              } catch (err) {
                console.error("Error deleting package:", err);
                toast.error("Error deleting package!");
              }
              toast.dismiss(toastId); // Close confirm box
            }}
            className="px-2 py-1 bg-red-600 text-white rounded"
          >
            Yes
          </button>
          <button
            onClick={() => {
              toast.dismiss(toastId);
              //toast("Package deletion canceled.");
            }}
            className="px-2 py-1 bg-gray-300 text-black rounded"
          >
            No
          </button>
        </div>
      </div>
    ),
    {
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
    }
  );
};
  

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">Packages</h2>
      <Link to="/admin-panel/packages/add">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 flex items-center gap-2"><GrAdd />Add Package</button>
      </Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map(pkg => (
          <div key={pkg._id} className="bg-white shadow-lg rounded-lg p-4">
            <h3 className="text-xl font-semibold">{pkg.name}</h3>
            <p className="text-gray-600">{pkg.description}</p>
            <p className="text-green-600 font-bold mt-2">Price: Rs.{pkg.price}</p>
            <p className="text-gray-500">Duration: {pkg.duration}</p>
            <div className="mt-4 flex gap-2">
              <Link to={`/admin-panel/packages/edit/${pkg._id}`}>
                <button className="bg-yellow-500 text-white px-3 py-1 rounded-md flex items-center gap-2"><MdEdit />Edit</button>
              </Link>
              <button onClick={() => handleDelete(pkg._id)} className="bg-red-500 text-white px-3 py-1 rounded-md flex items-center gap-2"><AiFillDelete />Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackageList;
