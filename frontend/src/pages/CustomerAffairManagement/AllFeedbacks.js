import React, { useEffect, useState } from 'react';
import SummaryApi from '../../common/index';
import { toast } from 'react-toastify';
import { RiEdit2Fill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AllFeedbacks = () => {
  const user = useSelector(state => state?.user?.user);
  const [feedbacks, setFeedbacks] = useState([]);

  const confirmToast = (message, onConfirm) => {
    toast(
      ({ closeToast }) => (
        <div className="text-center">
          <p className="font-semibold text-gray-700">{message}</p>
          <div className="flex justify-center gap-4 mt-3">
            <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700" onClick={() => { onConfirm(); closeToast(); }}>
              Yes
            </button>
            <button className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500" onClick={closeToast}>
              No
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false }
    );
  };

  const deleteFeedback = async (feedbackId) => {
    confirmToast("Are you sure you want to delete this feedback?", async () => {
      try {
        const response = await fetch(`${SummaryApi.deleteFeedback.url}/${feedbackId}`, {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();
        if (data.success) {
          toast.success("Feedback deleted successfully!");
          fetchAllFeedbacks();
        } else {
          toast.error(data.message || "Failed to delete feedback.");
        }
      } catch (error) {
        toast.error("An error occurred while deleting feedback.");
      }
    });
  };

  const fetchAllFeedbacks = async () => {
    try {
      const response = await fetch(SummaryApi.allFeedback.url, {
        method: "GET",
        credentials: "include"
      });

      const data = await response.json();
      if (data.success) {
        // Filter feedbacks to show only those from the current user
        const userFeedbacks = data.data.filter(feedback => feedback.email === user?.email);
        setFeedbacks(userFeedbacks);
      } else {
        toast.error(data.message || "Failed to fetch feedbacks.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching feedbacks.");
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchAllFeedbacks();
    }
  }, [user?.email]);

  return (
    <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-pink-200">
        <h2 className="text-4xl font-bold text-center text-gray-600 mb-8 drop-shadow-lg">My Feedbacks</h2>
        
        <div className="overflow-x-auto rounded-lg shadow-inner">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className='bg-gray-200 text-gray-700'>
              <tr>
                <th className="py-3 px-4 rounded-l-lg">No</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Instructor</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Feedback</th>
                <th className="py-3 px-4 rounded-r-lg">Action</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((el, index) => (
                <tr key={el._id} className="bg-white hover:bg-pink-50 transition duration-200 shadow-md rounded-xl">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{el.username}</td>
                  <td className="py-3 px-4">{el.email}</td>
                  <td className="py-3 px-4">{el.instructor}</td>
                  <td className="py-3 px-4">{el.rating}</td>
                  <td className="py-3 px-4">{el.message}</td>
                  <td className="py-3 px-4 flex gap-2 justify-center items-center">
                    <Link to={`/updatefeedback/${el._id}`} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md flex items-center gap-1 shadow-md transition-all duration-200">
                      <RiEdit2Fill /> Edit
                    </Link>
                    <button onClick={() => deleteFeedback(el._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md flex items-center gap-1 shadow-md transition-all duration-200">
                      <MdDelete /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {feedbacks.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-6 text-gray-500 italic">No feedbacks available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllFeedbacks;
