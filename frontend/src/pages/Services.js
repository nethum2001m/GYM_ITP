import React from 'react';
import { IoFastFood } from "react-icons/io5";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { IoFitness } from "react-icons/io5";
import { FaWeightScale } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const services = [
  { 
    id: 1, 
    name: 'AI Diet Plan', 
    description: 'Get a customized diet plan tailored to your fitness goals.', 
    icon: <IoFastFood className='text-red-500' />,
    path: 'dietplan' 
  },
  { 
    id: 2, 
    name: 'Workout Schedule', 
    description: 'Follow a structured workout plan for optimal results.', 
    icon: <RiCalendarScheduleFill className='text-blue-500' />,
    path: 'workoutschedule' 
  },
  { 
    id: 3, 
    name: 'BMI Calculator', 
    description: 'Check your Body Mass Index to track your health.', 
    icon: <FaWeightScale className='text-purple-500' />,
    path: 'bmicalculator' 
  }
];

const Services = () => {
  return (
    <div className='min-h-[calc(100vh-120px)]'>
      <h1 className='text-4xl font-semibold text-gray-900 mb-10 text-center p-6'>Our Gym Services</h1>
      <div className='flex justify-center w-full'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl'>
          {services.map((service) => (
            <Link 
              to={service.path} 
              key={service.id} 
              className='block hover:no-underline'
            >
              <div className='bg-gradient-to-br from-blue-100 to-purple-200 shadow-md rounded-lg p-6 border border-gray-300 
                flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-xl duration-300'>
                <div className='text-6xl mb-4'>{service.icon}</div>
                <h2 className='text-xl font-bold text-gray-800'>{service.name}</h2>
                <p className='text-gray-600 mt-2'>{service.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;