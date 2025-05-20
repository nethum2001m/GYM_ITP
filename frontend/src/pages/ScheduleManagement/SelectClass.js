import React from 'react';
import { FaStar, FaClock } from "react-icons/fa";
import C1 from "../../assest/C1.jpg";
import C2 from "../../assest/C2.jpg";
import C3 from "../../assest/C3.jpg";

const classes = [
  { 
    id: 1, 
    name: 'Strength Bootcamp', 
    category: 'Strength Training', 
    instructor: 'John Doe', 
    duration: '45 mins', 
    rating: 4.8, 
    image: C1  
  },
  { 
    id: 2, 
    name: 'Morning Yoga Flow', 
    category: 'Yoga & Flexibility', 
    instructor: 'Emily Smith', 
    duration: '60 mins', 
    rating: 4.7, 
    image: C2 
  },
  { 
    id: 3, 
    name: 'HIIT Burn', 
    category: 'Cardio & HIIT', 
    instructor: 'Michael Brown', 
    duration: '30 mins', 
    rating: 4.9, 
    image: C3 
  },
];

const ClassCard = () => {
  return (
    <div className='min-h-[calc(100vh-120px)] flex flex-col items-center p-6 bg-gradient-to-r from-blue-300 via-green-300 to-yellow-300'>
      <h1 className='text-4xl font-bold text-white mb-8'>Available Classes</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl'>
        {classes.map((classItem) => (
          <div 
            key={classItem.id} 
            className='bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center hover:shadow-xl transition transform hover:scale-105 border-t-4 border-b-4 border-opacity-50 border-green-500'
          >
            <img 
              src={classItem.image} 
              alt={classItem.name} 
              className='w-32 h-32 rounded-full object-cover mb-4 border-4 border-green-400' 
            />
            <h2 className='text-xl font-bold text-gray-800'>{classItem.name}</h2>
            <p className='text-gray-600'>Category: {classItem.category}</p>
            <p className='text-gray-600'>Instructor: {classItem.instructor}</p>
            <div className='flex items-center justify-center mt-2 text-gray-700'>
              <FaClock className='text-blue-500' />
              <span className='ml-2 font-semibold'>{classItem.duration}</span>
            </div>
            <div className='flex items-center justify-center mt-2'>
              <FaStar className='text-yellow-400' />
              <span className='text-gray-700 font-bold ml-2'>{classItem.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassCard;
