import React, { useState } from 'react'
import Logo from './Logo'
//import { IoMdSearch } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { setUserdetails } from '../store/userSlice';
import ROLE from '../common/role';
import { useNavigate } from "react-router-dom";

const Header = () => {


  //import { toast } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css';
const navigate = useNavigate();

const confirmLogout = () => {
    toast(
        ({ closeToast }) => (
            <div>
                <p>Are you sure you want to logout?</p>
                <div className="mt-2 flex justify-end gap-2">
                    <button
            onClick={() => {
                handleLogout();
                toast.dismiss();
                navigate("/"); // Replace with the desired route
            }}
            className="px-2 py-1 bg-red-600 text-white rounded"
        >
            Yes
        </button>
                    <button
                        onClick={() => toast.dismiss()}
                        className="px-2 py-1 bg-gray-300 text-black rounded"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ),
        {
            autoClose: false,
            closeOnClick: false,
            draggable: false,
            closeButton: false,
        }
    );
};

  
  const user = useSelector(state => state?.user?.user)
  const dispatch = useDispatch()

  const [menuDisplay,setMenuDisplay] = useState(false)


  const handleLogout = async() => {
    const fetchData = await fetch(SummaryApi.logout.url,{
        method : SummaryApi.logout.method,
        credentials : 'include'
    })

    const data = await fetchData.json()

    if(data.success){
      toast.success(data.message)
      dispatch(setUserdetails(null))
    }else{
      toast.error(data.message)
    }


  }
  return (
    <header className='h-16 shadow-md bg-white fixed w-full z-20'>
        <div className='h-full container max-w-full   flex items-center  justify-between'>
            <div className='ml-5'>
                <Link to ={"/"}>
                    <Logo w={290} h={200}/>
                </Link>
                
            </div>
           {user?.role !== "ADMIN" && (
  <div>
    <nav className='row'>
      <Link to={"aboutus"} className='px-5 py-3 text-lg hover:'>About Us</Link>
      <Link to={"packageuse"} className='px-5 py-3 text-lg hover:'>Packages</Link>
      <Link to={"services"} className='px-5 py-3 text-lg hover:'>Services</Link>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.location.href = "http://localhost:5173/shop/home";
        }}
        className="px-5 py-3 text-lg no-underline"
      >
        Store
      </a>
      <Link to={"contact-us"} className='px-5 py-3 text-lg hover:'>Contact Us</Link>
    </nav>
  </div>
)}


            

            <div className='flex items-center  gap-7 '>
                
                <div className='reletive group flex justify-center'>
                    
                <div className=' text-4xl cursor-pointer'onClick={()=>setMenuDisplay(preve =>!preve)}>
                    {
                        
                      user? (<span className="text-lg font-semibold text-gray-800 text-center flex">{user.name}</span>):
                      ( 
                      
                        
                    
                       <FaRegUserCircle/>)
                    
                    }
                    {
    menuDisplay && (
        <div className='absolute bg-white bottom-0 top-11 h-fit p-2 text-lg shadow-lg rounded-md '>
            <nav>
                {
                    user?.role === ROLE.ADMIN ? (
                        <Link to="admin-panel" className=''>Admin panel</Link>
                    ) : user?.role === ROLE.GENERAL ? (
                        <Link to="profile" className=''>Profile</Link>
                    ) : user?.role === ROLE.INSTRUCTOR ? (
                        <Link to="admin-panel" className=''>Instructor panel</Link>    
                    ) : null
                }
            </nav>
        </div>
    )
}


                    
                </div>
                </div>
                <div className='mr-6'>
    {
        user?._id ? (
            <button 
                onClick={confirmLogout} 
                className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'
            >
                Logout
            </button>
        ) : (
            <Link 
                to={"/login"} 
                className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'
            >
                Login
            </Link>
        )
    }
</div>

            </div>
            

        </div>
    </header>
  )
}

export default Header
