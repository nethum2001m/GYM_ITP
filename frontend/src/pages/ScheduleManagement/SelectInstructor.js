import React, { useState, useEffect } from 'react';
import { FaStar, FaEdit, FaTrash, FaFilter } from "react-icons/fa";
import I1 from "../../assest/I1.jpg";
import I2 from "../../assest/I2.jpg";
import I3 from "../../assest/I3.jpg";
import I4 from "../../assest/I4.jpg";
import I5 from "../../assest/I5.jpg";
import I6 from "../../assest/I6.jpg";
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import SummaryApi from '../../common/index';
import LoadingSpinner from '../../component/LoadingSpinner';

const instructors = [
  { 
    id: 1, 
    name: 'John Doe', 
    email: 'www.sisitha@gmail.com',
    age: 40, 
    specialist: 'Strength and conditioning, TRX, kettlebells, boxing, yoga, weight management, postural correction, muscle building, injury rehabilitation, and nutrition advice.', 
    experience: 'Level 3 REPs qualified personal trainer since 2010, with a background in lifestyle and fitness consulting',
    image: I1  
  },
  { 
    id: 2, 
    name: 'Tanuja Perera', 
    email: 'www.sisitha@gmail.com',
    age: 40, 
    specialist: 'Strength and conditioning, TRX, kettlebells, boxing, yoga, weight management, postural correction, muscle building, injury rehabilitation, and nutrition advice.', 
    experience: 'Level 3 REPs qualified personal trainer since 2010, with a background in lifestyle and fitness consulting.',
    image: I2 
  },
  { 
    id: 3, 
    name: 'Subash', 
    email: 'www.sisitha@gmail.com',
    age: 45, 
    specialist: 'Certified Bodybuilding Coach at the International Federation of Bodybuilding and Fitness (IFBB), bodybuilding, and fitness instruction.', 
    experience: 'Over 20 years in fitness, including winning the title of Mr. Sri Lanka in 2012 and serving as a lecturer at the International Institute of Fitness and Wellness Science.',
    image: I4 
  },
  { 
    id: 4, 
    name: 'Mihiri Salpitikorala', 
    email: 'www.sisitha@gmail.com',
    age: 35, 
    specialist: 'Zumba, BoxFit, DanceFit, and CrossFit.', 
    experience: 'Certified in multiple fitness disciplines. Active in conducting group fitness classes and promoting fitness among women.',
    image: I3
  },
  { 
    id: 5, 
    name: 'Hasitha Raymond', 
    email: 'www.sisitha@gmail.com',
    age: 35, 
    specialist: 'Strength and conditioning, power building, weight management, and body fat reduction.', 
    experience: 'Over 7 years in fitness, co-founder and head trainer of Kinetic Fitness, working with competitive athletes and celebrities',
    image: I5,
  },
  { 
    id: 6, 
    name: 'Lakshan', 
    email: 'www.sisitha@gmail.com',
    age: 33, 
    specialist: 'Bodybuilding, MMA, fitness kickboxing, high-intensity interval training (HIIT), functional training, sports conditioning, corrective exercises, weight loss, and weight gain strategies.', 
    experience: '10 years in the fitness industry, certified in Body Building and Fitness Instruction by the Body Building & Fitness Federation of Sri Lanka',
    image: I6
  },
];

const SelectInstructor = () => {
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [date, setDate] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userBookings, setUserBookings] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState("");
  const user = useSelector(state => state?.user?.user);

  useEffect(() => {
    if (user) {
    // fetchUserBookings();
    }
  }, [user]);
/*
  const fetchUserBookings = async () => {
    try {
      const response = await fetch(SummaryApi.getUserBookings.url, {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setUserBookings(data.data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to fetch your bookings");
    }
  };
*/
  const validateForm = () => {
    const errors = {};
    const currentDate = new Date();
    const selectedDate = new Date(date);

    if (!date) {
      errors.date = "Please select a date";
    } else if (selectedDate < currentDate) {
      errors.date = "Please select a future date";
    }

    if (!timeFrom) {
      errors.timeFrom = "Please select start time";
    }

    if (!timeTo) {
      errors.timeTo = "Please select end time";
    } else if (timeFrom && timeTo && timeFrom >= timeTo) {
      errors.timeTo = "End time must be after start time";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openModal = (instructor) => {
    if (!user) {
      toast.error("Please login to book an instructor");
      return;
    }
    setSelectedInstructor(instructor);
    setFormErrors({});
  };

  const closeModal = () => {
    setSelectedInstructor(null);
    setDate("");
    setTimeFrom("");
    setTimeTo("");
    setFormErrors({});
    setIsEditing(false);
    setEditingBookingId(null);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const errorMessages = Object.values(formErrors);
      if (errorMessages.length > 0) {
        toast.error(errorMessages[0]);
      }
      return;
    }

    setIsLoading(true);

    const bookingData = {
      instructorId: selectedInstructor.id,
      instructorName: selectedInstructor.name,
      instructorEmail: selectedInstructor.email,
      username: user.name,
      email: user.email,
      date,
      timeFrom,
      timeTo,
      status: 'pending'
    };

    try {
      const apiUrl = isEditing 
        ? `${SummaryApi.updateBooking.url}/${editingBookingId}`
        : SummaryApi.createBooking.url;

      const response = await fetch(apiUrl, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(isEditing ? "Booking updated successfully!" : "Booking successful! Instructor has been notified.");
        closeModal();
     //  fetchUserBookings();
      } else {
        toast.error(data.message || "Failed to process booking");
      }
    } catch (error) {
      console.error("Error processing booking:", error);
      toast.error("Failed to process booking. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBooking = (booking) => {
    const instructor = instructors.find(i => i.id === booking.instructorId) || {
      id: booking.instructorId,
      name: booking.instructorName,
      email: booking.instructorEmail
    };
    
    setEditingBookingId(booking._id);
    setIsEditing(true);
    setSelectedInstructor(instructor);
    setDate(new Date(booking.date).toISOString().split('T')[0]);
    setTimeFrom(booking.timeFrom);
    setTimeTo(booking.timeTo);
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) {
      return;
    }

    try {
      const response = await fetch(`${SummaryApi.deleteBooking.url}/${bookingId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Booking deleted successfully");
      //fetchUserBookings();
      } else {
        toast.error(data.message || "Failed to delete booking");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Failed to delete booking. Try again later.");
    }
  };

  const StatusBadge = ({ status }) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredBookings = userBookings
    .filter(booking => statusFilter === 'all' || booking.status === statusFilter)
    .filter(booking => 
      booking.instructorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.date.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const filteredInstructors = instructors.filter(instructor =>
    instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.specialist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='min-h-[calc(100vh-120px)] flex flex-col items-center p-6'>
      <ToastContainer />
      <h1 className='text-4xl font-bold text-black mb-8'>Select Your Instructor</h1>
      
      {/* Search Bar */}
      <div className="w-full max-w-4xl mb-6">
        <input
          type="text"
          placeholder="Search instructors .."
          className="w-full p-3 rounded-lg border border-gray-500 bg-white bg-opacity-20 text-gray-500 placeholder-gray-500 placeholder-opacity-70 focus:outline-none focus:ring-1 focus:ring-gray-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Your Bookings Section */}
      {userBookings.length > 0 && (
        <div className='w-full max-w-6xl mb-8 bg-white bg-opacity-20 p-6 rounded-xl'>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4'>
            <h2 className='text-2xl font-bold text-white mb-4 sm:mb-0'>Your Bookings</h2>
            <div className='flex space-x-2 w-full sm:w-auto'>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className='p-2 rounded-lg border border-white bg-transparent text-white flex-grow sm:flex-grow-0'
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="rejected">Rejected</option>
              </select>
              <button 
                className='p-2 bg-white bg-opacity-20 rounded-lg text-white'
              // onClick={fetchUserBookings}
              >
                <FaFilter className="inline mr-1" /> Refresh
              </button>
            </div>
          </div>
          
          {filteredBookings.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {filteredBookings.map((booking) => (
                <div key={booking._id} className='bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition'>
                  <div className='flex justify-between items-start'>
                    <h3 className='font-bold text-lg'>{booking.instructorName}</h3>
                    <StatusBadge status={booking.status} />
                  </div>
                  <p className='text-gray-600'>Date: {new Date(booking.date).toLocaleDateString()}</p>
                  <p className='text-gray-600'>Time: {booking.timeFrom} - {booking.timeTo}</p>
                  <div className='flex justify-end mt-2 space-x-2'>
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => handleEditBooking(booking)}
                        className='p-2 text-blue-500 hover:text-blue-700 transition'
                        title="Edit booking"
                      >
                        <FaEdit />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteBooking(booking._id)}
                      className='p-2 text-red-500 hover:text-red-700 transition'
                      title="Delete booking"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-black text-center py-4">No bookings found matching your criteria</p>
          )}
        </div>
      )}

      {/* Instructors Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl'>
        {filteredInstructors.map((instructor) => (
          <div 
            key={instructor.id} 
            className='bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center hover:shadow-xl transition transform hover:scale-105 border-t-4 border-b-4 border-opacity-50 border-indigo-500 cursor-pointer'
            onClick={() => openModal(instructor)}
          >
            <img 
              src={instructor.image} 
              alt={instructor.name} 
              className='w-32 h-32 rounded-full object-cover mb-4 border-4 border-indigo-400' 
            />
            <h2 className='text-xl font-bold text-gray-800'>{instructor.name}</h2>
            <p className='text-gray-600'><span className='font-semibold'>Specialty:</span> {instructor.specialist}...</p>
            <div className='flex items-center justify-center mt-2'>
             
              <span className='text-gray-700 font-semibold'>{instructor.experience}.</span>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedInstructor && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white p-6 rounded-2xl shadow-xl w-full max-w-md relative'>
            <button 
              className='absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl transition'
              onClick={closeModal}
              disabled={isLoading}
            >
              ✖
            </button>
            
            <h2 className='text-2xl font-bold text-gray-800 text-center mb-4'>
              {isEditing ? 'Edit Booking' : 'Book'} {selectedInstructor.name}
            </h2>
            <img 
              src={selectedInstructor.image} 
              alt={selectedInstructor.name} 
              className='w-24 h-24 rounded-full object-cover mx-auto mb-3 border-4 border-indigo-400' 
            />
            <p className='text-center text-gray-600 mb-2'>{selectedInstructor.specialist.split(',').slice(0, 3).join(',')}...</p>

            <form onSubmit={handleBooking} className='flex flex-col space-y-3'>
              <div>
                <label className='block text-gray-700 font-medium mb-1'>Select Date:</label>
                <input 
                  type='date' 
                  min={new Date().toISOString().split("T")[0]}  
                  className={`w-full p-2 border ${formErrors.date ? 'border-red-500' : 'border-purple-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  required
                  disabled={isLoading}
                />
                {formErrors.date && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.date}</p>
                )}
              </div>

              <div>
                <label className='block text-gray-700 font-medium mb-1'>Select Time Slot:</label>
                <div className='flex justify-between items-center space-x-2'>
                  <div className="w-1/2">
                    <input 
                      type='time' 
                      className={`w-full p-2 border ${formErrors.timeFrom ? 'border-red-500' : 'border-purple-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                      value={timeFrom} 
                      onChange={(e) => setTimeFrom(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    {formErrors.timeFrom && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.timeFrom}</p>
                    )}
                  </div>
                  <span className='text-lg font-bold text-gray-500'>to</span>
                  <div className="w-1/2">
                    <input 
                      type='time' 
                      className={`w-full p-2 border ${formErrors.timeTo ? 'border-red-500' : 'border-purple-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                      value={timeTo} 
                      onChange={(e) => setTimeTo(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    {formErrors.timeTo && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.timeTo}</p>
                    )}
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className={`mt-4 bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition shadow-md flex items-center justify-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size={20} color="white" className="mr-2" />
                    Processing...
                  </>
                ) : isEditing ? 'Update Booking' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectInstructor;