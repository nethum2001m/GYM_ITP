import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SummaryApi from '../../common';
import { toast } from 'react-toastify';
import { FaStar } from 'react-icons/fa';

const MAX_CHARACTERS = 250; // Set your desired character limit

const UpdateFeedback = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [feedback, setFeedback] = useState({
        _id: '',
        username: '',
        email: '',
        instructor: '',
        rating: null,
        message: ''
    });

    const [hover, setHover] = useState(0);
    const [charCount, setCharCount] = useState(0);
    
    const instructorOptions = [
        "Mr. Leanne Graham",
        "Mr. Ervin Howell",
        "Mr. Kurtis Weissnat",
        "Mr. Nicholas Runolfsdottir V",
        "Mr. Glenna Reichert"
    ];

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await fetch(`${SummaryApi.getFeedbackById.url}/${id}`);
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                if (data?.success && data.data) {
                    setFeedback({
                        _id: data.data._id || id,
                        username: data.data.username || '',
                        email: data.data.email || '',
                        instructor: data.data.instructor || '',
                        rating: data.data.rating ?? null,
                        message: data.data.message || ''
                    });
                    setCharCount(data.data.message?.length || 0);
                } else {
                    toast.error("No feedback data found");
                }
            } catch (error) {
                console.error("Fetch error:", error);
                toast.error("Failed to load feedback");
            }
        };
        fetchFeedback();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (feedback.rating === null) {
            toast.error("Please select a rating (including 0 for bad experiences)");
            return;
        }

        if (feedback.message.length > MAX_CHARACTERS) {
            toast.error(`Feedback exceeds maximum ${MAX_CHARACTERS} characters`);
            return;
        }

        try {
            const response = await fetch(SummaryApi.updateFeedback.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...feedback,
                    rating: feedback.rating ?? 0
                })
            });
            
            if (response.ok) {
                toast.success('Feedback updated successfully');
                setTimeout(() => navigate('/profile/Myfeedback'), 2000);
            } else {
                toast.error('Failed to update feedback');
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Error updating feedback");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'message') {
            if (value.length <= MAX_CHARACTERS) {
                setFeedback(prev => ({ ...prev, [name]: value }));
                setCharCount(value.length);
            }
        } else {
            setFeedback(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleRatingChange = (rating) => {
        setFeedback(prev => ({ ...prev, rating }));
    };

    return (
        <div className="max-w-2xl mx-auto p-10 bg-white shadow-2xl rounded-3xl mt-10 border border-gray-300">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Update Feedback</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username and Email fields */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">User Name</label>
                    <input
                        type="text"
                        name="username"
                        value={feedback.username || ''}
                        readOnly
                        className="w-full px-4 py-3 border rounded-xl bg-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={feedback.email || ''}
                        readOnly
                        className="w-full px-4 py-3 border rounded-xl bg-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-sm"
                    />
                </div>

                {/* Instructor Select */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Instructor Name</label>
                    <select
                        name="instructor"
                        value={feedback.instructor || ''}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-sm bg-white"
                    >
                        <option value="" disabled>Select an instructor</option>
                        {instructorOptions.map((instructor, index) => (
                            <option key={index} value={instructor}>{instructor}</option>
                        ))}
                    </select>
                </div>

                {/* Rating Component */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                        Rating {feedback.rating === 0 && <span className="text-red-500">(Marked as bad experience)</span>}
                    </label>
                    <div className="flex items-center space-x-4">
                        <button
                            type="button"
                            onClick={() => handleRatingChange(0)}
                            className={`px-4 py-2 rounded-lg ${
                                feedback.rating === 0 
                                    ? 'bg-red-500 text-white' 
                                    : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            0 (Bad)
                        </button>
                        
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleRatingChange(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    className="focus:outline-none"
                                >
                                    <FaStar
                                        className="text-3xl mx-1"
                                        color={
                                            star <= (hover || feedback.rating || 0)
                                                ? "#ffc107"
                                                : "#e4e5e9"
                                        }
                                    />
                                </button>
                            ))}
                        </div>
                        
                        <span className="ml-2 text-gray-700 font-medium">
                            {feedback.rating === null 
                                ? "Not rated" 
                                : feedback.rating === 0 
                                    ? "0 stars (Bad)" 
                                    : `${feedback.rating} star${feedback.rating > 1 ? 's' : ''}`}
                        </span>
                    </div>
                </div>

                {/* Feedback Message with Character Limit */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-gray-700 font-semibold">Feedback</label>
                        <span className={`text-sm ${
                            charCount >= MAX_CHARACTERS ? 'text-red-500' : 'text-gray-500'
                        }`}>
                            {charCount}/{MAX_CHARACTERS}
                        </span>
                    </div>
                    <textarea
                        name="message"
                        value={feedback.message || ''}
                        onChange={handleChange}
                        required
                        rows="4"
                        maxLength={MAX_CHARACTERS}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-sm ${
                            charCount >= MAX_CHARACTERS ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Share your thoughts about the instructor..."
                    />
                    {charCount >= MAX_CHARACTERS && (
                        <p className="mt-1 text-sm text-red-600">
                            Maximum character limit reached
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-xl font-bold hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center justify-center"
                >
                    Update Feedback
                </button>
            </form>
        </div>
    );
};

export default UpdateFeedback;


/*

 <select value={feedback.rating || ''} onChange={handleChange}
                        style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} required>
                        <option value="feedback.rating || ''"></option>
                        <option>Mr. Leanne Graham</option>
                        <option>Mr. Ervin Howell</option>
                        <option>Mr. Kurtis Weissnat</option>
                        <option>Mr. Nicholas Runolfsdottir V</option>
                        <option>Mr. Glenna Reichert</option>
                    </select>

                     <label className="block text-gray-700 font-semibold mb-2">Instructor Name</label>
                    <input
                        type="text"
                        name="instructor"
                        value={feedback.instructor || ''}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-sm"
                    />


*/