import React, { useEffect } from 'react';
import { FaRegClipboard, FaStar, FaCommentDots } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import loginIcons from '../assest/profile.png';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import ROLE from '../common/role';

const Profile = () => {
  const user = useSelector(state => state?.user?.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === ROLE.ADMIN) {
      navigate('/');
    }
  }, [user]);

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center bg-blue-50">
      {/* Profile Card */}
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm flex flex-col items-center text-blue-700">
        <div className="w-28 h-28 rounded-full overflow-hidden mb-5 border-4 border-blue-400 shadow-md">
          <img src={loginIcons} alt="Profile Icon" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-2xl font-semibold mb-1">{user?.name || 'Guest User'}</h2>
        <p className="text-sm uppercase tracking-wide mb-1">{user?.role}</p>
        {user?.email && <p className="text-sm mb-6 text-blue-600">{user?.email}</p>}

        {/* Navigation Links */}
        <nav className="w-full space-y-5  items-center justify-center">
          <Link
            to="/profile/userview"
            className="flex items-center gap-3 ml-14 text-blue-600 hover:text-blue-800 transition font-medium"
          >
            <FaRegClipboard size={20} /> My Booking
          </Link>
          <Link
            to="/profile/Myfeedback"
            className="flex items-center gap-3 ml-14 text-blue-600 hover:text-blue-800 transition font-medium"
          >
            <FaStar size={20} /> My Instructor Feedback
          </Link>
          <Link
            to="/profile/serviceFeedback"
            className="flex items-center gap-3 ml-14 text-blue-600 hover:text-blue-800 transition font-medium"
          >
            <FaCommentDots size={20} /> My Service Feedback
          </Link>
        </nav>
      </div>

      {/* Nested Routes */}
      <main className="w-full max-w-3xl mt-10">
        <Outlet />
      </main>
    </div>
  );
};

export default Profile;
