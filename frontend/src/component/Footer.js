import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className='bg-slate-800 text-white py-2'>
      <div className='container mx-auto px-4'>
        
        {/* Top Section */}
        <div className='flex flex-col md:flex-row justify-between items-center border-b border-gray-600 pb-4 mb-4'>
          {/* Brand Name */}
          <div className='text-2xl font-semibold  '>
            Real Fitness Centre
          </div>

          {/* Social Media Links */}
          <div className='flex space-x-4'>
            <a href='#' className='hover:text-blue-400 transition'><FaFacebook size={24} /></a>
            <a href='#' className='hover:text-pink-500 transition'><FaInstagram size={24} /></a>
            <a href='#' className='hover:text-blue-300 transition'><FaTwitter size={24} /></a>
            <a href='#' className='hover:text-red-500 transition'><FaYoutube size={24} /></a>
          </div>
        </div>

        

        {/* Copyright Section */}
        <div className='text-center text-gray-300 text-lg mt-4'>
          <p>© 2025 Real Fitness. All rights reserved.</p>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
