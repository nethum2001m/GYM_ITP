import React, { useEffect, useState } from 'react';
import SummaryApi from '../../common/index';
import { toast } from 'react-toastify';

const AllServiceFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllFeedbacks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(SummaryApi.allServiceFeedback.url, {
        method: "GET",
        credentials: "include"
      });

      const data = await response.json();
      if (data.success) {
        setFeedbacks(data.data);
      } else {
        toast.error(data.message || "Failed to fetch service feedbacks.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching service feedbacks.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllFeedbacks();
  }, []);

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 transition ${
              i < rating ? 'text-yellow-400 drop-shadow-md' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-500">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-500 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-white mb-8 drop-shadow-lg">
          Service Feedbacks
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {feedbacks.map((feedback) => (
            <div
              key={feedback._id}
              className="bg-white rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-indigo-600">
                      {feedback.username || 'Anonymous'}
                    </h3>
                    <p className="text-gray-500 text-sm">{feedback.email || 'No email provided'}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-500">Rating</div>
                    <div className="flex items-center justify-end">
                      <span className="mr-1 font-medium text-indigo-600">{feedback.rating}</span>
                      {renderStars(feedback.rating)}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Feedback</h4>
                  <p className="text-gray-700">{feedback.message}</p>
                </div>

                <div className="text-xs text-gray-400 mt-4">
                  Submitted on {new Date(feedback.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {feedbacks.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-indigo-200 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white">No service feedbacks yet</h3>
            <p className="mt-1 text-sm text-gray-200">
              Service feedbacks will appear here when available
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllServiceFeedbacks;
