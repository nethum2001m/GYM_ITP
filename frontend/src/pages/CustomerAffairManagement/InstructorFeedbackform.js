import React, { useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { FaStar, FaRegStar } from "react-icons/fa";

const CombinedFeedbackForm = () => {
    const user = useSelector(state => state?.user?.user);
    const [feedbackType, setFeedbackType] = useState("instructor"); // Default to instructor feedback
    const [instructor, setInstructor] = useState("");
    const [rating, setRating] = useState(null);
    const [hover, setHover] = useState(null);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!message) {
            toast.error("Please provide feedback text");
            return;
        }

        if (feedbackType === "instructor" && !instructor) {
            toast.error("Please select an instructor");
            return;
        }

        const endpoint = feedbackType === "instructor" 
            ? "http://localhost:8080/api/submit-feedback" 
            : "http://localhost:8080/api/submit-service-feedback";

        const feedbackData = { 
            username: user?.name, 
            email: user?.email,
            ...(feedbackType === "instructor" && { instructor }),
            rating: rating || 0,
            message,
            isNegative: !rating || rating <= 2,
            feedbackType
        };

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(feedbackData),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Feedback submitted successfully!");
                setInstructor("");
                setRating(null);
                setMessage("");
            } else {
                toast.error(result.message || "Something went wrong.");
            }
        } catch (error) {
            toast.error("Failed to submit feedback.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
            <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-2xl max-w-lg w-full border border-white">
                <h2 className="text-3xl font-bold text-center text-black mb-6">
                    {feedbackType === "instructor" ? "Instructor Feedback" : "Service Feedback"}
                </h2>
                
                {/* Feedback Type Toggle */}
                <div className="mb-6 flex justify-center">
                    <div className="inline-flex rounded-md shadow-sm" role="group">
                        <button
                            type="button"
                            onClick={() => setFeedbackType("instructor")}
                            className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                                feedbackType === "instructor"
                                    ? "bg-purple-600 text-white border-purple-600"
                                    : "bg-white text-black border-purple-300 hover:bg-purple-50"
                            }`}
                        >
                            Instructor Feedback
                        </button>
                        <button
                            type="button"
                            onClick={() => setFeedbackType("service")}
                            className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
                                feedbackType === "service"
                                    ? "bg-purple-600 text-white border-purple-600"
                                    : "bg-white text-black border-purple-300 hover:bg-purple-50"
                            }`}
                        >
                            Service Feedback
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Instructor Selection (only for instructor feedback) */}
                    {feedbackType === "instructor" && (
                        <div>
                            <label className="block text-black font-medium mb-1">
                                Select Your Fitness Instructor
                            </label>
                            <select
                                value={instructor}
                                onChange={(e) => setInstructor(e.target.value)}
                                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                required
                            >
                                <option value="">Select an Instructor</option>
                                <option>Mr. John Doe</option>
                                <option>Mr. Tanuja Perera</option>
                                <option>Mr. Subash</option>
                                <option>Mrs. Mihiri Salpitikorala</option>
                                <option>Mr. Hasitha Raymond</option>
                                <option>Mr. Lakshan</option>
                            </select>
                        </div>
                    )}

                    {/* Star Rating (optional for both types) */}
                    <div>
                        <label className="block text-black font-medium mb-1">
                            {feedbackType === "instructor" 
                                ? "Rate your instructor (optional)" 
                                : "Rate our service (optional)"}
                        </label>
                        <div className="flex items-center space-x-2">
                            {[...Array(5)].map((_, i) => {
                                const ratingValue = i + 1;
                                return (
                                    <label key={i}>
                                        <input
                                            type="radio"
                                            name="rating"
                                            value={ratingValue}
                                            onClick={() => setRating(ratingValue)}
                                            className="hidden"
                                        />
                                        {ratingValue <= (hover || rating) ? (
                                            <FaStar
                                                className="cursor-pointer text-3xl"
                                                color={ratingValue <= 2 ? "#ffbb33" : 
                                                      ratingValue <= 4 ? "#ffbb33" : 
                                                      "#ffbb33"}
                                                onMouseEnter={() => setHover(ratingValue)}
                                                onMouseLeave={() => setHover(null)}
                                            />
                                        ) : (
                                            <FaRegStar
                                                className="cursor-pointer text-3xl text-gray-300"
                                                onMouseEnter={() => setHover(ratingValue)}
                                                onMouseLeave={() => setHover(null)}
                                            />
                                        )}
                                    </label>
                                );
                            })}
                            <span className="ml-2 text-black font-medium">
                                {rating ? `${rating} star${rating > 1 ? 's' : ''}` : "No rating selected"}
                            </span>
                        </div>
                    </div>

                    {/* Feedback Message (required for both types) */}
                    <div>
  <label className="block text-black font-medium mb-1">
    Your Feedback*
  </label>
  <textarea
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    className="w-full px-4 py-3 border border-purple-300 rounded-lg min-h-[120px] focus:outline-none focus:ring-2 focus:ring-indigo-400"
    placeholder={
      feedbackType === "instructor" 
        ? "Please share your experience with the instructor..." 
        : "Please share your experience with our services..."
    }
    maxLength={250}  // Limits input to 200 characters
    required
  ></textarea>
  <div className="text-sm text-gray-500 text-right mt-1">
    {message.length}/250 characters  {/* Character counter */}
  </div>
</div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            className={`w-full text-white font-semibold px-6 py-3 rounded-lg transition duration-300 shadow-md hover:shadow-lg ${
                                !rating || rating <= 2 ? 
                                "bg-blue-600 hover:bg-blue-800" :
                                "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                            }`}
                        >
                            Submit Feedback
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CombinedFeedbackForm;