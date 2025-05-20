import React, { useEffect, useState, useRef } from 'react'
import SummaryApi from '../common'
import { toast } from 'react-toastify'
import { RiEdit2Fill } from "react-icons/ri";
import ChangeUserRole from '../component/ChangeUserRole';
import { MdDelete } from "react-icons/md";
import { IoQrCode } from "react-icons/io5"; // Import QR Code icon
import { QRCodeCanvas } from "qrcode.react"; // Import QR Code Canvas
import { jsPDF } from "jspdf"; // Import jsPDF for PDF generation
import ROLE from '../common/role';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AllUsers = () => {
    const [allUser, setAllUsers] = useState([]);
    const user = useSelector(state => state?.user?.user);
    const navigate = useNavigate();
    const [qrData, setQrData] = useState("");
    const qrRef = useRef(null); // Reference to the QRCodeCanvas component

    //-------------------------------------------Delete users----------------------------------//
    const confirmToast = (message, onConfirm) => {
      toast(
        ({ closeToast }) => (
          <div>
            <p>{message}</p>
            <div className="flex gap-4 mt-2">
              <button
                className="bg-red-500 text-white px-3 py-1 rounded-md"
                onClick={() => {
                  onConfirm();  // Call the function when user confirms
                  closeToast(); // Close the toast
                }}
              >
                Yes
              </button>
              <button
                className="bg-gray-400 text-white px-3 py-1 rounded-md"
                onClick={closeToast}
              >
                No
              </button>
            </div>
          </div>
        ),
        { autoClose: false, closeOnClick: false }
      );
    };
    
    const deleteUser = async (userId) => {
      confirmToast("Are you sure you want to delete this user?", async () => {
        try {
          const response = await fetch(SummaryApi.deleteUser.url, {
            method: SummaryApi.deleteUser.method,
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId })
        });
          const data = await response.json();
          if (data.success) {
            toast.success("User deleted successfully!");
            fetchAllUsers(); // Refresh user list after deletion
          } else {
            toast.error("Failed to delete user.");
          }
        } catch (error) {
          toast.error("An error occurred.");
        }
      });
    };
  
     //--------------------------------------------Generate QR Code and Download PDF----------------//
     const generateQRCodeAndDownloadPDF = () => {
      // Create a new jsPDF instance
      const doc = new jsPDF();

      // Add text to PDF
      doc.text(`QR Code for: ${qrData}`, 10, 10);

      // Wait for the QR code to render
      setTimeout(() => {
        // Get the QR code canvas element from the reference
        const qrCodeCanvas = qrRef.current.querySelector('canvas');

        if (qrCodeCanvas) {
          // Get base64 image of the QR code
          const qrCodeImage = qrCodeCanvas.toDataURL('image/png'); // Get base64 image

          // Add QR code image to PDF
          doc.addImage(qrCodeImage, 'PNG', 10, 20, 50, 50);

          // Download the PDF
          doc.save(`${qrData}_QRCode.pdf`);
        }
      }, 100);
  };
  //--------------------------------------------end delete----------------//

    const [openUpdateRole, setOpenUpdateRole] = useState(false);

    const [updateUserDetails, setUpdateUserDetails] = useState({
      email: "",
      name: "",
      role: "",
      _id: "",
    });

    const fetchAllUsers = async () => {
      const fetchData = await fetch(SummaryApi.allUser.url, {
            method: SummaryApi.allUser.method,
            credentials: 'include'
        })

        const dataResponse = await fetchData.json()

        if(dataResponse.success){
          setAllUsers(dataResponse.data)
        }

        if(dataResponse.error){
          toast.error(dataResponse.data)
        }
    }

    useEffect(() => {
    if (user?.role == ROLE.INSTRUCTOR) {
      toast.error("You are not authorized to access this page");
      navigate('/admin-panel');
    }
  }, [user, navigate]);

    useEffect(() => {
        fetchAllUsers();
    }, []);

    return (
    <div className='bg-white pb-4'>
      <table className='min-w-full bg-white shadow-md rounded-lg overflow-hidden userTabale'>
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className=''>
          {allUser.map((el, index) => {
            return (
              <tr key={el._id}>
                <td>{index + 1}</td>
                <td>{el?.name}</td>
                <td>{el?.email}</td>
                <td>{el?.role}</td>
                <td className='flex gap-4  justify-center'>
                  <td className='bg-yellow-600 p-2 rounded-md cursor-pointer hover:bg-green-600 text-white flex items-center gap-2'
                    onClick={() => {
                      setUpdateUserDetails(el);
                      setOpenUpdateRole(true);
                    }}>
                    <RiEdit2Fill />Edit
                  </td>
                  
                  <td className='bg-red-500 p-2 rounded-md cursor-pointer hover:bg-red-600 text-white flex items-center gap-2'
                    onClick={() => deleteUser(el._id)}>
                    <MdDelete />Delete
                  </td>
                  <td className='bg-blue-500 p-2 rounded-md cursor-pointer hover:bg-blue-600 text-white flex items-center gap-2'
                    onClick={() => {
                      setQrData(el.name); // Set QR data
                    }}>
                    <IoQrCode />QR code
                  </td>
                  
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {qrData && (
        <div ref={qrRef}>
          {/* Render the QR Code */}
          <QRCodeCanvas value={qrData} size={200} />
        </div>
      )}

      {
        openUpdateRole && (
          <ChangeUserRole
            onClose={() => setOpenUpdateRole(false)}
            name={updateUserDetails.name}
            email={updateUserDetails.email}
            role={updateUserDetails.role}
            userId={updateUserDetails._id}
            callFunc={fetchAllUsers}
          />
        )
      }
      
      
      {qrData && (
        <button
          onClick={generateQRCodeAndDownloadPDF}
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          Download QR Code as PDF
        </button>
      )}
    </div>
  );
}

export default AllUsers;
