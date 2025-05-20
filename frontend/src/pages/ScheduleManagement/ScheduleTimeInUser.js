import React, { useEffect, useState } from 'react';
import SummaryApi from '../../common/index';
import { toast } from 'react-toastify';
import { RiEdit2Fill } from "react-icons/ri";
import { AiOutlineClose } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ScheduleTimeInUser = () => {
  const user = useSelector(state => state?.user?.user);
  const [bookings, setBookings] = useState([]);
  const [deleteReason, setDeleteReason] = useState('');
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchAllBookings = async () => {
    try {
      const response = await fetch(SummaryApi.getAllBookings.url, {
        method: "GET",
        credentials: "include"
      });

      const data = await response.json();
      if (data.success) {
        const userBookings = data.data.filter(booking => booking.email === user?.email);
        setBookings(userBookings);
      } else {
        toast.error(data.message || "Failed to fetch bookings.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching bookings.");
    }
  };

  const handleDeleteBooking = async () => {
    try {
      const response = await fetch(`${SummaryApi.deleteBooking.url}/${bookingToDelete}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          reason: deleteReason,
          userEmail: user?.email,
          userName: user?.name
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Booking cancelled successfully. Instructor has been notified.");
        fetchAllBookings();
      } else {
        toast.error(data.message || "Failed to cancel booking.");
      }
    } catch (error) {
      toast.error("An error occurred while cancelling booking.");
    } finally {
      setDeleteReason('');
      setBookingToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchAllBookings();
    }
  }, [user?.email]);

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || 'pending';
    
    const statusClasses = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'cancelled': 'bg-gray-100 text-gray-800'
    };

    const badgeClass = statusClasses[statusLower] || statusClasses['pending'];
    const displayStatus = statusLower.charAt(0).toUpperCase() + statusLower.slice(1);

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>
        {displayStatus}
      </span>
    );
  };

  const isEditDisabled = (status) => {
    const statusLower = status?.toLowerCase() || 'pending';
    return statusLower !== 'pending';
  };

  const openDeleteModal = (bookingId) => {
    setBookingToDelete(bookingId);
    setDeleteReason('');
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 p-4 md:p-8">
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Cancel Booking</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for cancellation:</p>
            <div className="mb-4">
              <textarea
                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                 rows="4"
                 placeholder="Enter your reason..."
                 value={deleteReason}
                 onChange={(e) => setDeleteReason(e.target.value)}
                 maxLength={250}
             />
           <div className="text-sm text-gray-500 text-right mt-1">
                  {deleteReason.length}/250 characters
           </div>
           </div>
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
                onClick={() => {
                  setDeleteReason('');
                  setIsDeleteModalOpen(false);
                }}
              >
                Cancel
              </button>
              <button 
                className={`px-4 py-2 rounded-lg transition duration-200 ${
                  deleteReason.trim() 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-red-300 cursor-not-allowed text-white'
                }`}
                disabled={!deleteReason.trim()}
                onClick={handleDeleteBooking}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden border border-pink-100">
        <div className="p-6 md:p-8">
          <h2 className="text-3xl font-bold mb-4 text-center text-gray-600">
            <span className="inline-block mr-2 items-center text-gray-100"></span> My Bookings
          </h2>
          
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="py-3 px-6 text-left">No</th>
                  <th className="py-3 px-6 text-left">Instructor</th>
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-left">Time</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.length > 0 ? (
                  bookings.map((el, index) => (
                    <tr key={el._id} className="hover:bg-pink-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{el.instructorName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(el.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {el.timeFrom} - {el.timeTo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(el.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/profile/update/${el._id}`}
                            className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                              isEditDisabled(el.status)
                                ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                                : 'bg-green-500 text-white hover:bg-green-600'
                            } transition-colors duration-200`}
                            onClick={(e) => isEditDisabled(el.status) && e.preventDefault()}
                          >
                            <RiEdit2Fill className="mr-1" /> Edit
                          </Link>
                          <button
                            onClick={() => openDeleteModal(el._id)}
                            disabled={el.status !== 'pending' && el.status !== 'confirmed'}
                            className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                              (el.status !== 'pending' && el.status !== 'confirmed')
                                ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                                : 'bg-red-500 text-white hover:bg-red-600'
                            } transition-colors duration-200`}
                          >
                            <AiOutlineClose size={16}/> Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500 italic">
                      No bookings available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleTimeInUser;