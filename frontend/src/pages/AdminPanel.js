import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  FaBars, FaUsers, FaClipboardCheck, FaBoxes, FaStore,
  FaUserTie, FaMoneyCheckAlt, FaDumbbell, FaChalkboardTeacher
} from 'react-icons/fa'
import ROLE from '../common/role'
import loginIcons from '../assest/profile.png'

const AdminPanel = () => {
  const user = useSelector(state => state?.user?.user)
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (user?.role === ROLE.GENERAL) {
      navigate("/")
    }
  }, [user])

  const navItems = [
    { to: "all-users", icon: <FaUsers />, label: "All Users" },
    { to: "attendance", icon: <FaClipboardCheck />, label: "Attendance" },
    { to: "packages", icon: <FaBoxes />, label: "Packages" },
    { external: true, to: "http://localhost:5173/admin/dashboard", icon: <FaStore />, label: "Store" },
    { to: "employees", icon: <FaUserTie />, label: "Employee" },
    /*{ to: "adminpayment", icon: <FaMoneyCheckAlt />, label: "Payments" },*/
    { to: "eqipmanage", icon: <FaDumbbell />, label: "Equipment" },
    { to: "confirm-reject-time", icon: <FaChalkboardTeacher />, label: "Bookings" }
  ]

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col md:flex-row">

      {/* Mobile Menu Toggle */}
      <div className="md:hidden bg-blue-900 text-white p-4 flex justify-between items-center">
        <span className="text-lg font-bold">Admin Panel</span>
        <FaBars className="text-2xl cursor-pointer" onClick={() => setMenuOpen(!menuOpen)} />
      </div>

      {/* Sidebar */}
      <aside className={`bg-white shadow-lg w-full md:w-64 transition-all duration-300 z-10 ${menuOpen ? 'block' : 'hidden'} md:block`}>
        <div className="h-40 bg-gradient-to-br from-blue-900 to-blue-400 flex flex-col justify-center items-center p-4">
          <img src={loginIcons} alt="Profile" className="w-20 h-20 rounded-full border-4 border-white shadow-md" />
          <span className="text-white font-semibold text-lg mt-2">{user?.name}</span>
          <p className="text-sm text-gray-100">{user?.role}</p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col px-2 py-4 space-y-2">
          {navItems.map((item, idx) => {
            const isActive = location.pathname.includes(item.to)
            const baseClasses = `flex items-center gap-3 px-4 py-2 rounded-lg transition duration-200 text-gray-600 hover:bg-blue-100 hover:text-blue-700 text-xl`
            const activeClasses = isActive ? 'bg-blue-100 text-blue-700' : ''

            return item.external ? (
              <a key={idx} href={item.to} className={`${baseClasses} ${activeClasses}`}>
                {item.icon} {item.label}
              </a>
            ) : (
              <Link key={idx} to={item.to} className={`${baseClasses} ${activeClasses}`}>
                {item.icon} {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 bg-gray-50">
        <div className="bg-white rounded-xl shadow p-4 h-full">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminPanel
