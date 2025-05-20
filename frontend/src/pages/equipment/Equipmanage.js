import { Link } from "react-router-dom";
import { FaDumbbell, FaTools, FaTruck } from "react-icons/fa";
import ROLE from '../../common/role';
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const Equipmanage = () => {
  const user = useSelector(state => state?.user?.user);
  const navigate = useNavigate();
  const cards = [
    {
      title: "Equipment Table",
      icon: <FaDumbbell className="text-4xl text-blue-600" />,
      link: "/admin-panel/eqipmanage/equipment-table",
    },
    {
      title: "Supply Maintenance Table",
      icon: <FaTools className="text-4xl text-green-600" />,
      link: "/admin-panel/eqipmanage/supply-maintenance-table",
    },
    {
      title: "Suppliers Table",
      icon: <FaTruck className="text-4xl text-yellow-600" />,
      link: "/admin-panel/eqipmanage/suppliers-table",
    },
  ];

  useEffect(() => {
      if (user?.role == ROLE.INSTRUCTOR) {
        toast.error("You are not authorized to access this page");
        navigate('/admin-panel');
      }
    }, [user, navigate]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Gym Equipment Management
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {cards.map((card, idx) => (
          <Link
            to={card.link}
            key={idx}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
          >
            {card.icon}
            <h2 className="mt-4 text-xl font-semibold text-gray-700">{card.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Equipmanage;
