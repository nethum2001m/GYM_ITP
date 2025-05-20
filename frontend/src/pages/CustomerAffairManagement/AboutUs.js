/*
import React from "react";
import { BsFacebook, BsTwitter } from "react-icons/bs";
import { RiInstagramFill } from "react-icons/ri";
import background from '../../assest/bg.jpg';

const AboutUs = () => {
  return (
    <div>

    <div 
      className="py-16 px-6 lg:px-20 bg-cover bg-center bg-no-repeat-min-h-[calc(100vh-120px) flex]" 
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="max-w-6xl mx-auto bg-white bg-opacity-90 p-10 rounded-2xl shadow-xl flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 p-6">
          <h1 className="text-4xl font-bold text-center md:text-left text-gray-900 mb-6">About Us</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Welcome to Real Fitness</h2>
          <p className="text-gray-600 mt-4 leading-relaxed">
            Real Fitness Center is your ultimate destination for achieving your health and fitness goals. 
            Our state-of-the-art facility is equipped with modern gym equipment, professional trainers, and 
            customized workout programs designed to meet your individual needs.
          </p>
          <p className="text-gray-600 mt-4 leading-relaxed">
            Our mission is to provide an inclusive and motivating environment where everyone, regardless of 
            their fitness level, feels empowered to take control of their health. From personalized training 
            sessions to group fitness classes, we offer a variety of programs to suit different lifestyles.
          </p>
          <div className="flex justify-center md:justify-start space-x-6 mt-6 text-gray-700 text-2xl">
  <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
    <BsFacebook className="hover:text-blue-600 transition-transform transform hover:scale-110 cursor-pointer" />
  </a>
  <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
    <BsTwitter className="hover:text-blue-400 transition-transform transform hover:scale-110 cursor-pointer" />
  </a>
  <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
    <RiInstagramFill className="hover:text-pink-600 transition-transform transform hover:scale-110 cursor-pointer" />
  </a>
</div>

        </div>
        
        <div className="md:w-1/2 flex justify-center items-center">
          <img src={background} alt="Fitness" className="w-full h-auto rounded-lg shadow-lg" />
        </div>
      </div>
    </div>
    </div>
  );
};

export default AboutUs;
*/

import React from "react";
import { BsFacebook, BsTwitter } from "react-icons/bs";
import { RiInstagramFill } from "react-icons/ri";
import background from '../../assest/bg.jpg';
import aboutus from '../../assest/aboutus.jpg';

const AboutUs = () => {
  return (
    <div>
      {/* About Us Section with Background */}
      <div 
        className="relative py-16 px-6 lg:px-20 min-h-screen flex items-center justify-center bg-cover bg-center" 
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70"></div> {/* Overlay for better text visibility */}
        
        <div className="relative max-w-6xl mx-auto bg-white bg-opacity-90 p-8 md:p-10 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 p-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-center md:text-left text-gray-900 mb-4">
              About Us
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
              Welcome to Real Fitness
            </h2>
            <p className="text-base md:text-lg text-gray-600 mt-4 leading-relaxed 
              hover:scale-105 transition-transform duration-300">
  Real Fitness Center is your ultimate destination for achieving your health and fitness goals. 
  Our state-of-the-art facility is equipped with modern gym equipment, professional trainers, and 
  customized workout programs designed to meet your individual needs.
</p>

<p className="text-base md:text-lg text-gray-600 mt-4 leading-relaxed 
              hover:scale-105 transition-transform duration-300">
  Our mission is to provide an inclusive and motivating environment where everyone, regardless of 
  their fitness level, feels empowered to take control of their health. From personalized training 
  sessions to group fitness classes, we offer a variety of programs to suit different lifestyles.
</p>

            {/* Social Media Icons */}
            <div className="flex justify-center md:justify-start space-x-6 mt-6 text-gray-700 text-xl md:text-2xl">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <BsFacebook className="hover:text-blue-600 transition-transform transform hover:scale-125 cursor-pointer" />
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                <BsTwitter className="hover:text-blue-400 transition-transform transform hover:scale-125 cursor-pointer" />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <RiInstagramFill className="hover:text-pink-600 transition-transform transform hover:scale-125 cursor-pointer" />
              </a>
            </div>
          </div>
          
          {/* About Us Image - Enlarges on Hover */}
          <div className="md:w-1/2 flex justify-center items-center">
            <img 
              src={aboutus} 
              alt="Fitness" 
              className="w-full h-auto rounded-lg shadow-xl transition-transform duration-300 hover:scale-105" 
            />
          </div>
        </div>
      </div>

      {/* Quick Menu Section - Left Aligned */}
      
    </div>
  );
};

export default AboutUs;




