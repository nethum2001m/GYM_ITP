import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RiEdit2Fill, RiDownloadLine } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import SummaryApi from '../../common/index';
import ROLE from '../../common/role';
import { useNavigate } from 'react-router-dom';

const ScheduleTimeInstructor = () => {
  // Hooks at the top (Rules of Hooks)
  const user = useSelector(state => state?.user?.user);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    rejected: 0,
    cancelled: 0
  });
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState(null);

  // Authorization effect
  useEffect(() => {
    if (user?.role !== ROLE.INSTRUCTOR) {
      toast.error("You are not authorized to access this page");
      navigate('/admin-panel');
    }
  }, [user, navigate]);

  // Data fetching effect
  useEffect(() => {
    if (user?.name && user?.role === ROLE.INSTRUCTOR) {
      fetchAllBookings();
    }
  }, [user?.name, user?.role]);

  // If user is not an instructor, don't render the page
  if (user?.role !== ROLE.INSTRUCTOR) {
    return null;
  }

  // Fetch all bookings for the current instructor
  const fetchAllBookings = async () => {
    try {
      const response = await fetch(SummaryApi.getAllBookings.url, {
        method: "GET",
        credentials: "include"
      });
      const data = await response.json();
      if (data.success) {
        const instructorBookings = data.data.filter(
          booking => booking.instructorName === user?.name
        );
        setBookings(instructorBookings);
        filterBookings('all', instructorBookings);
        calculateStats(instructorBookings);
      } else {
        toast.error(data.message || "Failed to fetch bookings.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching bookings.");
    }
  };

  // Calculate statistics
  const calculateStats = (bookingsData) => {
    setStats({
      total: bookingsData.length,
      pending: bookingsData.filter(b => b.status === 'pending').length,
      confirmed: bookingsData.filter(b => b.status === 'confirmed').length,
      rejected: bookingsData.filter(b => b.status === 'rejected').length,
      cancelled: bookingsData.filter(b => b.status === 'cancelled').length
    });
  };

  // Filter bookings by status
  const filterBookings = (filter, data = bookings) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      setFilteredBookings(data);
    } else {
      setFilteredBookings(data.filter(booking => booking.status === filter));
    }
  };

  // Update booking status
  const updateBookingStatus = async (bookingId, status, reason = '') => {
    try {
      const response = await fetch(SummaryApi.updateBookingStatus.url, {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bookingId,
          status,
          rejectionReason: reason
        })
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`Booking ${status} successfully!`);
        if (status === 'rejected' && reason) {
          await sendRejectionEmail(bookingId, reason);
        }
        fetchAllBookings();
      } else {
        toast.error(data.message || `Failed to ${status} booking.`);
      }
    } catch (error) {
      toast.error(`An error occurred while ${status} booking.`);
    } finally {
      setShowRejectionModal(false);
      setRejectionReason('');
    }
  };

  // Send rejection email to user
  const sendRejectionEmail = async (bookingId, reason) => {
    try {
      const booking = bookings.find(b => b._id === bookingId);
      if (!booking) return;

      const response = await fetch(SummaryApi.sendRejectionEmail.url, {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: booking.email,
          userName: booking.username,
          bookingDate: booking.date,
          timeSlot: `${booking.timeFrom} - ${booking.timeTo}`,
          instructorName: user?.name,
          rejectionReason: reason
        })
      });
      const data = await response.json();
      if (!data.success) {
        console.error("Failed to send rejection email:", data.message);
      }
    } catch (error) {
      console.error("Error sending rejection email:", error);
    }
  };

  // Confirmation dialog
  const confirmToast = (message, onConfirm) => {
    toast(
      ({ closeToast }) => (
        <div className="text-center">
          <p className="font-semibold text-gray-700">{message}</p>
          <div className="flex justify-center gap-4 mt-3">
            <button 
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700" 
              onClick={() => { onConfirm(); closeToast(); }}
            >
              Yes
            </button>
            <button 
              className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500" 
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

  // Handle confirm action
  const handleConfirm = (bookingId) => {
    confirmToast("Are you sure you want to confirm this booking?", () => {
      updateBookingStatus(bookingId, 'confirmed');
    });
  };

  // Handle reject action with reason
  const handleReject = (bookingId) => {
    setCurrentBookingId(bookingId);
    setShowRejectionModal(true);
  };

  // Submit rejection with reason
  const submitRejection = () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    updateBookingStatus(currentBookingId, 'rejected', rejectionReason);
  };

  // Download all confirmed bookings report
  const downloadAllConfirmedBookingsPDF = () => {
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
    if (confirmedBookings.length === 0) {
      toast.info('No confirmed bookings to download');
      return;
    }
  
    const doc = new jsPDF({
      orientation: 'landscape'
    });
  
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    
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
    doc.text('CONFIRMED BOOKINGS REPORT', pageWidth - margin, 15, { align: 'right' });
    
    // Report details
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin, 22, { align: 'right' });
    doc.text(`Instructor: ${user?.name || 'N/A'}`, pageWidth - margin, 28, { align: 'right' });
    
    // Decorative line
    doc.setDrawColor(200, 200, 255);
    doc.setLineWidth(0.5);
    doc.line(margin, 35, pageWidth - margin, 35);
  
    const columnWidths = [10, 30, 40, 25, 25, 25, 20];
    const tableWidth = columnWidths.reduce((sum, width) => sum + width, 0);
    const tableStartX = (pageWidth - tableWidth) / 2;
    
    autoTable(doc, {
      startY: 45,
      startX: tableStartX,
      head: [
        ['No', 'Customer Name', 'Email', 'Booking Date', 'Time Slot', 'Booking ID', 'Status']
      ],
      body: confirmedBookings.map((booking, index) => [
        index + 1,
        booking.username,
        booking.email,
        new Date(booking.date).toLocaleDateString(),
        `${booking.timeFrom} - ${booking.timeTo}`,
        booking._id.slice(-8).toUpperCase(),
        booking.status.charAt(0).toUpperCase() + booking.status.slice(1)
      ]),
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 10,
        halign: 'center',
        cellPadding: 2
      },
      bodyStyles: {
        fontSize: 9,
        cellPadding: 3,
        valign: 'middle',
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: columnWidths[0], halign: 'center' },
        1: { cellWidth: columnWidths[1], halign: 'center' },
        2: { cellWidth: columnWidths[2], halign: 'center' },
        3: { cellWidth: columnWidths[3], halign: 'center' },
        4: { cellWidth: columnWidths[4], halign: 'center' },
        5: { cellWidth: columnWidths[5], halign: 'center' },
        6: { cellWidth: columnWidths[6], halign: 'center' }
      },
      styles: {
        overflow: 'linebreak',
        lineWidth: 0.1
      },
      didDrawPage: function (data) {
        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.setDrawColor(200, 200, 255);
        doc.setLineWidth(0.3);
        doc.line(margin, doc.internal.pageSize.getHeight() - 15, pageWidth - margin, doc.internal.pageSize.getHeight() - 15);
        doc.text('© REAL FITNESS CENTER - Confidential Booking Information', margin, doc.internal.pageSize.getHeight() - 10);
        doc.text(`Page ${doc.internal.getNumberOfPages()}`, pageWidth - margin, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
      }
    });
  
    doc.save(`RealFitness-Bookings-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Status badge component
  const getStatusBadge = (status) => {
    const statusClasses = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'cancelled': 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Pending'}
      </span>
    );
  };

  return (
    <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 min-h-screen p-6">
      {/* Rejection Reason Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Reason for Rejection</h3>
            <div className="mb-4">
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please provide a reason for rejecting this booking..."
                rows={4}
                maxLength={250}
              />
              <div className={`text-xs mt-1 text-right ${
                rejectionReason.length > 450 
                  ? "text-red-500" 
                  : "text-gray-500"
              }`}>
                {rejectionReason.length}/250 characters
                {rejectionReason.length > 450 && (
                  <span className="ml-1">(Approaching limit)</span>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionReason('');
                }}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={submitRejection}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Submit Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Bookings</h3>
            <p className="text-3xl font-bold text-gray-600">{stats.total}</p>
          </div>
          <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-6 border border-yellow-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending</h3>
            <p className="text-3xl font-bold text-gray-600">{stats.pending}</p>
          </div>
          <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Confirmed</h3>
            <p className="text-3xl font-bold text-gray-600">{stats.confirmed}</p>
          </div>
          <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-6 border border-red-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Rejected</h3>
            <p className="text-3xl font-bold text-gray-600">{stats.rejected}</p>
          </div>
          <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Cancelled</h3>
            <p className="text-3xl font-bold text-gray-600">{stats.cancelled}</p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-pink-200">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Booking Management</h2>
            <div className="flex items-center space-x-4">
              <button 
                onClick={downloadAllConfirmedBookingsPDF}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all duration-200"
              >
                <RiDownloadLine /> Download Report
              </button>
              <div className="flex space-x-2">
                <button 
                  onClick={() => filterBookings('all')} 
                  className={`px-4 py-2 rounded-lg ${activeFilter === 'all' ? 'bg-gray-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  All
                </button>
                <button 
                  onClick={() => filterBookings('pending')} 
                  className={`px-4 py-2 rounded-lg ${activeFilter === 'pending' ? 'bg-gray-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Pending
                </button>
                <button 
                  onClick={() => filterBookings('confirmed')} 
                  className={`px-4 py-2 rounded-lg ${activeFilter === 'confirmed' ? 'bg-gray-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Confirmed
                </button>
                <button 
                  onClick={() => filterBookings('rejected')} 
                  className={`px-4 py-2 rounded-lg ${activeFilter === 'rejected' ? 'bg-gray-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Rejected
                </button>
                <button 
                  onClick={() => filterBookings('cancelled')} 
                  className={`px-4 py-2 rounded-lg ${activeFilter === 'cancelled' ? 'bg-gray-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Cancelled
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto rounded-lg shadow-inner">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className='bg-gray-200 text-gray-700'>
                <tr>
                  <th className="py-3 px-4 rounded-l-lg">No</th>
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 rounded-r-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((el, index) => (
                  <tr key={el._id} className="bg-white hover:bg-pink-50 transition duration-200">
                    <td className="py-3 px-4 text-center">{index + 1}</td>
                    <td className="py-3 px-4 text-center">{el.username}</td>
                    <td className="py-3 px-4 text-center">{el.email}</td>
                    <td className="py-3 px-4 text-center">{new Date(el.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-center">{el.timeFrom} - {el.timeTo}</td>
                    <td className="py-3 px-4 text-center">{getStatusBadge(el.status)}</td>
                    <td className="py-3 px-4 flex gap-2 justify-center items-center">
                      <button 
                        onClick={() => handleConfirm(el._id)} 
                        disabled={el.status === 'confirmed' || el.status === 'cancelled'}
                        className={`${el.status === 'confirmed' || el.status === 'cancelled' ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} text-white px-3 py-1.5 rounded-md flex items-center gap-1 shadow-md transition-all duration-200`}
                      >
                        <RiEdit2Fill size={16} /> Accept
                      </button>
                      <button 
                        onClick={() => handleReject(el._id)} 
                        disabled={el.status === 'rejected' || el.status === 'cancelled'}
                        className={`${el.status === 'rejected' || el.status === 'cancelled' ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'} text-white px-3 py-1.5 rounded-md flex items-center gap-1 shadow-md transition-all duration-200`}
                      >
                        <MdDelete size={16} /> Reject
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-6 text-center text-gray-500 italic">
                      No bookings found for this filter.
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

export default ScheduleTimeInstructor;