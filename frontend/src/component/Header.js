import React from 'react'
import Logo from './Logo'
import { IoMdSearch } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';


const Header = () => {
  return (
    <header className='h-16 shadow-md bg-white'>
        <div className='h-full container  flex items-center px-4 justify-between'>
            <div className=''>
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

            

            <div className='flex items-center  gap-7'>
                <div className='text-4xl cursor-pointer'>
                    <FaRegUserCircle/>
                </div>
                <div>
                    <Link to={"/login"} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'>Login</Link>
                </div>
            </div>
            

        </div>
    </header>
  )
}

export default Header
