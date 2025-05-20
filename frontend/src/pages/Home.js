import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import bgimage from "../assest/banner/image.jpg";
import bgimage2 from "../assest/banner/banner.png";
import { Link } from 'react-router-dom';

const Home = () => {
  // Detect when the section is in view
  const { ref, inView } = useInView({
    threshold: 0.3, // 30% visibility to trigger animation
  });

  return (
    <div>
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
      {/* Background Section */}
      <div
        className="absolute inset-0 w-full h-full bg-white min-h-[calc(100vh-120px)] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: `url(${bgimage2})` }}
      >
        {/* Diagonal Overlay */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-y-0 right-0 w-2/3 bg-gradient-to-r from-yellow-400 to-yellow-600 clip-diagonal"
        ></motion.div>
      </div>

      {/* Content Section with Scroll Animation */}
      <motion.div
        ref={ref} // Attach the ref to track visibility
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}} // Trigger animation on scroll
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative w-5/12 bg-cover bg-center items-center left-96 text-white"
      >
        {/* Left Side: Text Content with separate animation */}
        <div className="lg:w-1/2 text-center lg:text-left ml-32">
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative text-5xl font-extrabold text-gray-900 leading-tight"
          >
            Elevate Your <span className="text-red-600 text-center">Fitness</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-lg text-gray-900 mt-4"
          >
            Join the ultimate fitness experience. Train hard, stay motivated, and achieve your goals with us!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mt-6 flex gap-4"
          >
            {/* Animated Buttons */}
            <Link to="/aboutus">
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="bg-white hover:bg-slate-300 px-6 py-3 rounded-lg text-lg font-semibold text-yellow-600 transition hover:text-black shadow-lg"
  >
    Get Started
  </motion.button>
</Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white px-6 py-3 rounded-lg text-lg font-semibold text-white hover:bg-gray-900 hover:text-white transition"
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
      
      
    
      
    </div>

    {/*------------------------*/}
         <div>
         <div
        className="relative min-h-[calc(100vh-120px)] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: `url(${bgimage})` }}
      >
        {/* Triangle Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black clip-triangle"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl font-bold uppercase">Our Training Programs</h1>
          <p className="text-lg mt-2 max-w-lg mx-auto">
            Strength Training | Cardio Workouts | Personal Coaching | Nutrition Plans
          </p>
          
        </div>
      </div>
    </div>
         </div>
    
    // End of Home Page
    
    
    

    
  );
};

export default Home;
