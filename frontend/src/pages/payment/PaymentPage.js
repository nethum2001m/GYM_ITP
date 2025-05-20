import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pkg } = location.state || {}; // Simplified for JavaScript
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const handlePayNow = async () => {
    if (!pkg) {
      setError("Invalid package details");
      return;
    }
  
    setIsProcessing(true);
    setError("");
  
    try {
      // 1. First create payment record in your backend
      const res = await axios.post("http://localhost:8080/api/payments/create", {
        userId: "662f66bb7a365b2ac40fdc80",
        packageId: pkg._id,
        packageName: pkg.name,
        amount: pkg.price,
      });
  
      // 2. Prepare PayHere checkout parameters
      const paymentData = {
        merchant_id: "1230315", // Replace with your actual merchant ID
        return_url: `${window.location.origin}/payment-success`,
        cancel_url: `${window.location.origin}/payment-cancel`,
        notify_url: "http://yourbackend.com/api/payments/notify", // Must be HTTPS in production
        order_id: res.data._id, // Use your backend-generated ID
        items: pkg.name,
        amount: pkg.price.toFixed(2), // Must have 2 decimal places
        currency: "LKR",
        first_name: "Customer", // Get from user profile
        last_name: "Name",      // Get from user profile
        email: "customer@example.com", // Get from user profile
        phone: "0771234567",           // Get from user profile
        address: "123 Street", 
        city: "Colombo",
        country: "Sri Lanka",
        // Add these for better security
        hash: "GENERATED_HASH_VALUE", // Generate on backend
        custom_1: "Additional data",  // Optional
        custom_2: "More data"         // Optional
      };
  
      // 3. Verify all required parameters are present
      const requiredFields = ['merchant_id', 'return_url', 'cancel_url', 
                             'amount', 'currency', 'order_id'];
      requiredFields.forEach(field => {
        if (!paymentData[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      });
  
      // 4. Create and submit the form
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://sandbox.payhere.lk/pay/checkout"; // Use live URL in production
  
      Object.entries(paymentData).forEach(([key, value]) => {
        if (value) { // Only add fields with values
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value;
          form.appendChild(input);
        }
      });
  
      document.body.appendChild(form);
      form.submit();
  
    } catch (err) {
      console.error("Payment error:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to initialize payment. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (!pkg) {
    return (
      <div className="container mx-auto px-6 py-10 text-center">
        <p className="text-red-500">Invalid Package. Please select a package first.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Complete Your Payment</h2>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 max-w-md mx-auto">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white p-6 rounded shadow-md max-w-md mx-auto">
        <h3 className="text-xl font-semibold">{pkg.name}</h3>
        <p className="mt-2 text-gray-700">{pkg.description}</p>
        <p className="text-green-600 text-xl font-bold mt-4">Rs. {pkg.price.toLocaleString()}</p>
        <p className="text-sm text-gray-500 mt-1">Duration: {pkg.duration}</p>

        <button
          onClick={handlePayNow}
          disabled={isProcessing}
          className={`mt-6 px-6 py-2 text-white rounded w-full ${
            isProcessing ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;