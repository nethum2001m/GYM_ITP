import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SummaryApi from '../../common';
import { toast } from 'react-toastify';

const UpdateTimeSlot = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [timeSlot, setTimeSlot] = useState({
        date: '',
        timeFrom: '',
        timeTo: '',
        status: 'pending'
    });

    const [errors, setErrors] = useState({
        date: '',
        timeFrom: '',
        timeTo: '',
        timeConflict: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchTimeSlot = async () => {
            try {
                const response = await fetch(`${SummaryApi.getBookingById.url}/${id}`);
                const data = await response.json();
                
                if (!response.ok || !data.success) {
                    throw new Error(data.message || "Failed to fetch booking");
                }

                setTimeSlot({
                    date: data.data.date || '',
                    timeFrom: data.data.timeFrom || '',
                    timeTo: data.data.timeTo || '',
                    status: data.data.status || 'pending'
                });
            } catch (error) {
                console.error("Failed to fetch booking:", error);
                toast.error(error.message || "Failed to load booking data");
            }
        };
        fetchTimeSlot();
    }, [id]);

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            date: '',
            timeFrom: '',
            timeTo: '',
            timeConflict: ''
        };

        // Validate date (must be today or in the future)
        if (!timeSlot.date) {
            newErrors.date = 'Date is required';
            isValid = false;
        } else {
            const selectedDate = new Date(timeSlot.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                newErrors.date = 'Date must be today or in the future';
                isValid = false;
            }
        }

        // Validate time fields
        if (!timeSlot.timeFrom) {
            newErrors.timeFrom = 'Start time is required';
            isValid = false;
        }

        if (!timeSlot.timeTo) {
            newErrors.timeTo = 'End time is required';
            isValid = false;
        }

        // Validate time range (end time must be after start time)
        if (timeSlot.timeFrom && timeSlot.timeTo && timeSlot.timeFrom >= timeSlot.timeTo) {
            newErrors.timeConflict = 'End time must be after start time';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        
        try {
            // Remove status from the payload if it shouldn't be updated
            const { status, ...updateData } = timeSlot;
            
            const response = await fetch(`${SummaryApi.updateBooking.url}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData) // Only send editable fields
            });
            
            const responseData = await response.json();
            
            if (!response.ok) {
                throw new Error(responseData.message || "Failed to update time slot");
            }

            toast.success(responseData.message || 'Time slot updated successfully');
            navigate('/profile/userview');
        } catch (error) {
            console.error("Failed to update time slot:", error);
            toast.error(error.message || "Error updating time slot");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTimeSlot(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
                timeConflict: name.includes('time') ? '' : prev.timeConflict
            }));
        }
    };

    // Format date for input field (YYYY-MM-DD)
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    return (
        <div className="max-w-2xl mx-auto p-10 bg-white shadow-2xl rounded-3xl mt-10 border border-blue-200">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Update Time Slot</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formatDateForInput(timeSlot.date)}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-sm ${
                            errors.date ? 'border-red-500' : 'border-gray-300'
                        }`}
                        min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.date && (
                        <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                    )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Start Time</label>
                        <input
                            type="time"
                            name="timeFrom"
                            value={timeSlot.timeFrom}
                            onChange={handleChange}
                            required
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-sm ${
                                errors.timeFrom ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.timeFrom && (
                            <p className="mt-1 text-sm text-red-600">{errors.timeFrom}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">End Time</label>
                        <input
                            type="time"
                            name="timeTo"
                            value={timeSlot.timeTo}
                            onChange={handleChange}
                            required
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-sm ${
                                errors.timeTo ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.timeTo && (
                            <p className="mt-1 text-sm text-red-600">{errors.timeTo}</p>
                        )}
                    </div>
                </div>
                
                {errors.timeConflict && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                        <p>{errors.timeConflict}</p>
                    </div>
                )}
                
                {/* Read-only status display */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Status</label>
                    <div className="w-full px-4 py-3 border rounded-xl bg-gray-100">
                        {timeSlot.status.charAt(0).toUpperCase() + timeSlot.status.slice(1)}
                    </div>
                </div>
                
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-blue-500 text-white py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'
                    }`}
                >
                    {isSubmitting ? 'Updating...' : 'Update Time Slot'}
                </button>
            </form>
        </div>
    );
};

export default UpdateTimeSlot;