import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import pkgimg from "../../assest/REAL.png";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api/packages";

const Packageuser = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(API_URL)
      .then(res => setPackages(res.data))
      .catch(err => {
        console.error("Error fetching packages:", err);
        setError("Failed to fetch packages. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-[calc(100vh-120px)]">
      <div className="container mx-auto px-6 py-10">
        <h2 className="text-4xl font-semibold text-gray-900 mb-10 text-center">
          Explore Our Packages
        </h2>

        {loading ? (
          <p className="text-center text-gray-600 text-lg">Loading packages...</p>
        ) : error ? (
          <p className="text-center text-red-600 text-lg">{error}</p>
        ) : packages.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No packages available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map(pkg => (
              <div 
                key={pkg._id} 
                className="bg-gradient-to-br from-blue-100 to-purple-200 shadow-md rounded-lg p-6 border border-gray-300 
                flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-xl duration-300"
              >
                {/* Package Image */}
                <img 
                    src={pkg.image ? pkg.image : pkgimg} 
                    alt={pkg.name} 
                    className="w-44 h-44 object-cover rounded-lg "
                  />


                {/* Package Details */}
                <h3 className="text-2xl font-bold text-gray-900 mt-3">{pkg.name}</h3>
                <p className="mt-2 text-gray-700">{pkg.description}</p>
                <p className="text-green-600 font-bold text-xl mt-3">Rs.{pkg.price}</p>
                <p className="text-gray-600 text-sm mt-1">{pkg.duration}</p>

                {/* Buy Now Button */}
                <button 
  onClick={() => navigate("/pay", { state: { pkg } })}
  className="mt-5 px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md 
  hover:bg-yellow-600 transition-all duration-300"
>
  Buy Now
</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Packageuser;
