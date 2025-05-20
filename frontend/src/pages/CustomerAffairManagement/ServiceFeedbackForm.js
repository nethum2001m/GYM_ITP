import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";

const ServiceFeedbackForm = () => {
    const user = useSelector(state => state?.user?.user);
    const [rating, setRating] = useState(0);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const feedbackData = { 
            username: user?.name, 
            email: user?.email,
            rating, 
            message 
        };

        try {
            const response = await fetch("http://localhost:8080/api/submit-service-feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(feedbackData),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Service feedback submitted successfully!");
                setRating(0);
                setMessage("");
            } else {
                toast.error(result.message || "Something went wrong.");
            }
        } catch (error) {
            toast.error("Failed to submit service feedback.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-tr from-pink-200 via-yellow-100 to-cyan-100 p-4">
            <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-2xl max-w-lg w-full border border-white">
                <h2 className="text-center text-4xl font-bold text-orange-600 mb-6 drop-shadow-md">
                    Service Feedback
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Star Rating */}
                    <div>
                        <label className="text-orange-700 font-semibold text-sm block mb-2">Rate Our Service</label>
                        <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                    key={star}
                                    size={30}
                                    color={star <= rating ? "gold" : "#ccc"}
                                    onClick={() => setRating(star)}
                                    className="cursor-pointer transition transform hover:scale-110 hover:drop-shadow-lg"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Feedback Message */}
                    <div>
                        <label className="text-orange-700 font-semibold text-sm mb-1 block">Your Feedback</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full p-3 rounded-md border border-orange-200 shadow-sm min-h-[100px] focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            required
                            placeholder="Share your experience with our services..."
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                        <button
                            type="submit"
                            className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-full text-lg font-semibold shadow-md hover:shadow-xl transition-all"
                        >
                            Submit Feedback
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ServiceFeedbackForm;