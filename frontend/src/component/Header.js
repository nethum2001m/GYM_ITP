import React, { useState } from 'react'
import Logo from './Logo'
import { IoMdSearch } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { setUserdetails } from '../store/userSlice';
import ROLE from '../common/role';


const Header = () => {
  
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
    <header className='h-16 shadow-md bg-white'>
        <div className='h-full container max-w-full   flex items-center  justify-between'>
            <div className='ml-5'>
                <Link to ={"/"}>
                    <Logo w={290} h={200}/>
                </Link>
                
            </div>
            <div className='hidden lg:flex items-center w-full justify-between max-w-sm border rounded-full focus-within:shadow-md pl-2'>
                <input type='text' placeholder='Search'className='w-full outline-none'></input>
                <div className='text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white'>
                    <IoMdSearch/>
                </div>
            </div>

            

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
                                user?.role === ROLE.ADMIN && (
                                    <Link to={"admin-panel"}className=''>Admin panel</Link>
                                )
                            }
                            
                        </nav>
                    </div>
                    

                        )
                    }

                    
                </div>
                </div>
                <div className='mr-6'>
                    {
                        user?._id ?(
                            <button onClick={handleLogout} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'>Logout</button>
                        ):(<Link to={"/login"} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700 '>Login</Link>)
                    }
                    
                </div>
            </div>
            

        </div>
    </header>
  )
}

export default Header
