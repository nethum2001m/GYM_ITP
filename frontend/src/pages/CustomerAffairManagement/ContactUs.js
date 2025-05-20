import React, { useEffect, useState } from "react";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import bg from '../../assest/bg.jpg';
import SummaryApi from '../../common/index';
import { toast } from 'react-toastify';

const ContactUs = () => {
    const [instructorFeedbacks, setInstructorFeedbacks] = useState([]);
    const [serviceFeedbacks, setServiceFeedbacks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAllFeedbacks = async () => {
        try {
            setIsLoading(true);
            
            const instructorResponse = await fetch(SummaryApi.allFeedback.url, {
                method: "GET",
                credentials: "include"
            });
            const instructorData = await instructorResponse.json();
            
            const serviceResponse = await fetch(SummaryApi.allServiceFeedback.url, {
                method: "GET",
                credentials: "include"
            });
            const serviceData = await serviceResponse.json();

            if (instructorData?.success) {
                setInstructorFeedbacks(instructorData.data);
            }
            if (serviceData?.success) {
                setServiceFeedbacks(serviceData.data);
            }
        } catch (error) {
            toast.error("An error occurred while fetching feedbacks.");
        } finally {
            setIsLoading(false);
        }
    };

    const renderStars = (rating) => {
        return (
            <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        className={`w-4 h-4 ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    const maskEmail = (email) => {
        if (!email) return 'No email provided';
        
        const [name, domain] = email.split('@');
        if (!name || !domain) return email;
        
        const maskedName = name.length >= 2 
            ? name.substring(0, 2) + '*'.repeat(6)
            : name.charAt(0) + '*'.repeat(6);
            
        return `${maskedName}@${domain}`;
    };

    const handleEmailClick = () => {
        window.location.href = "mailto:realfitnesscenter@gmail.com";
    };

    const handlePhoneClick = () => {
        window.location.href = "tel:+94763356041";
    };

    const handleAddressClick = () => {
        // Google Maps link for "No-29/1/1, Light House Road, Dondra"
        window.open("https://www.google.com/maps/search/?api=1&query=No-29%2F1%2F1+Light+House+Road+Dondra", "_blank");
    };

    useEffect(() => {
        fetchAllFeedbacks();
    }, []);

    return (
        <div className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-6 relative" style={{ backgroundImage: `url(${bg})` }}>
            <div className="absolute inset-0 bg-black opacity-50"></div>
            
            {/* Main Contact Content */}
            <div className="relative z-10 text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4 shadow-lg">Contact Us</h1>
                <p className="text-gray-200 text-lg mb-8 max-w-xl">
                    Get in touch with us through the following contact information.
                </p>
            </div>

            <div className="relative z-10 grid md:grid-cols-3 gap-8 w-full max-w-4xl mb-12">
                <div 
                    className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={handleAddressClick}
                >
                    <FaMapMarkerAlt className="text-blue-600 text-3xl mb-2" />
                    <h3 className="text-xl font-semibold">Address</h3>
                    <p className="text-gray-600">No-29/1/1, Light House Road, Dondra</p>
                    <p className="text-blue-500 text-sm mt-2">Click to view on map</p>
                </div>
                <div 
                    className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={handlePhoneClick}
                >
                    <FaPhoneAlt className="text-blue-600 text-3xl mb-2" />
                    <h3 className="text-xl font-semibold">Phone</h3>
                    <p className="text-gray-600">0763356041</p>
                </div>
                <div 
                    className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={handleEmailClick}
                >
                    <MdEmail className="text-blue-600 text-3xl mb-2" />
                    <h3 className="text-xl font-semibold">Email</h3>
                    <p className="text-gray-600">realfitnesscenter@gmail.com</p>
                </div>
            </div>
            
            {/* Feedback Buttons */}
            <div className="relative z-10 flex gap-4 mb-12 flex-wrap justify-center">
                <Link 
                    to="/contact-us/Feedback-Form"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                    Drop a Review for Your Coach
                </Link>
               
            </div>

            {/* Instructor Feedback Section */}
            <div className="relative z-10 w-full max-w-6xl bg-white bg-opacity-90 rounded-xl p-6 shadow-lg mb-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Instructor Feedbacks</h2>
                
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto pb-4">
                        <div className="flex space-x-6 px-2 min-w-max">
                            {instructorFeedbacks.length > 0 ? (
                                instructorFeedbacks.map((feedback) => (
                                    <div 
                                        key={feedback._id}
                                        className="flex-shrink-0 w-80 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-md p-4 border border-gray-200"
                                    >
                                        <div className="mb-2">
                                        <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1">Instructor</h4>
                                            <p className="text-sm font-medium text-gray-700">{feedback.instructor}</p>
                                        </div>
                                        
                                        <div className="mb-3">
                                            {renderStars(feedback.rating)}
                                            <span className="ml-2 text-sm text-gray-700">{feedback.rating}/5</span>
                                        </div>
                                        
                                        <p className="text-sm text-gray-600 italic line-clamp-3">"{feedback.message}"</p>
                                        
                                        <div className="mt-3 flex justify-between items-center">
                                            <span className="text-xs text-gray-500">
                                                {maskEmail(feedback.email)}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(feedback.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="w-full text-center py-8 text-gray-500">
                                    No instructor feedbacks available
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Service Feedback Section */}
            <div className="relative z-10 w-full max-w-6xl bg-white bg-opacity-90 rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Service Feedbacks</h2>
                
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto pb-4">
                        <div className="flex space-x-6 px-2 min-w-max">
                            {serviceFeedbacks.length > 0 ? (
                                serviceFeedbacks.map((feedback) => (
                                    <div 
                                        key={feedback._id}
                                        className="flex-shrink-0 w-80 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg shadow-md p-4 border border-gray-200"
                                    >
                                        <div className="mb-3">
                                            {renderStars(feedback.rating)}
                                            <span className="ml-2 text-sm text-gray-700">{feedback.rating}/5</span>
                                        </div>
                                        
                                        <p className="text-sm text-gray-600 italic line-clamp-3">"{feedback.message}"</p>
                                        
                                        <div className="mt-3 flex justify-between items-center">
                                            <span className="text-xs text-gray-500">
                                                {maskEmail(feedback.email)}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(feedback.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="w-full text-center py-8 text-gray-500">
                                    No service feedbacks available
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactUs;