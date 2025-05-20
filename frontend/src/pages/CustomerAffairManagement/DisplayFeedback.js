import React, { useEffect, useState } from 'react';
import SummaryApi from '../../common/index';
import { toast } from 'react-toastify';

const AllFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Array of vibrant card background colors
  const cardColors = [
    'bg-gradient-to-br from-purple-100 to-pink-100',
    'bg-gradient-to-br from-blue-100 to-cyan-100',
    'bg-gradient-to-br from-green-100 to-teal-100',
    'bg-gradient-to-br from-yellow-100 to-orange-100',
    'bg-gradient-to-br from-indigo-100 to-purple-100',
    'bg-gradient-to-br from-red-100 to-pink-100'
  ];

  const fetchAllFeedbacks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(SummaryApi.allFeedback.url, {
        method: "GET",
        credentials: "include"
      });

      const data = await response.json();
      if (data.success) {
        setFeedbacks(data.data);
      } else {
        toast.error(data.message || "Failed to fetch feedbacks.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching feedbacks.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to render star ratings
  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // Function to get random color for cards
  const getRandomColor = (index) => {
    return cardColors[index % cardColors.length];
  };

  useEffect(() => {
    fetchAllFeedbacks();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
            Instructor Feedbacks
          </h2>
          <p className="text-lg text-gray-600">What our Members say about their experience</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {feedbacks.map((feedback, index) => (
            <div 
              key={feedback._id} 
              className={`${getRandomColor(index)} rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{feedback.username}</h3>
                    <p className="text-gray-600 text-sm">{feedback.email}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className={`flex items-center justify-center h-10 w-10 rounded-full ${index % 2 === 0 ? 'bg-purple-200 text-purple-800' : 'bg-pink-200 text-pink-800'} font-bold`}>
                      {feedback.username.charAt(0).toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1">Instructor</h4>
                  <p className="text-gray-700 font-medium">{feedback.instructor}</p>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1">Rating</h4>
                  <div className="flex items-center">
                    {renderStars(feedback.rating)}
                    <span className="ml-2 text-gray-700 font-medium">{feedback.rating}/5</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1">Feedback</h4>
                  <p className="text-gray-700 italic">"{feedback.message}"</p>
                </div>
              </div>

              <div className="px-6 py-3 bg-white bg-opacity-30 border-t border-white border-opacity-20">
                <div className="text-xs text-gray-600">
                  Submitted on {new Date(feedback.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllFeedbacks;