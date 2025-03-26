import React, { useEffect } from 'react'
import { FaRegUserCircle } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import loginIcons from '../assest/profile.png'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import ROLE from '../common/role'

const AdminPanel = () => {
    const user = useSelector(state => state?.user?.user)
    const navigate = useNavigate()

    useEffect(() =>{
      if(user?.role!== ROLE.ADMIN){
        navigate("/")
      }
    },[user])
    
    
  return (
    <div className='min-h-[calc(100vh-120px)] flex '>
      <aside className='bg-white min-h-full w-full max-w-60 shadow-lg '>
        
        <div className='h-40 bg-red-500 flex justify-center items-center' >
        <div className=' text-4xl cursor-pointer'>
                    <div className='w-20 h-20 mx-auto'>
                        <img src={loginIcons} alt='login icons'></img>
                    </div>
                    {
                        
                        
                      user? (<span className="text-lg font-semibold text-black-800 text-center flex">{user.name}</span>):
                      ( 
                      
                        
                    
                       <FaRegUserCircle/>)
                    
                    }
                    

                    <p className='text-sm text-white text-center flex'>{user?.role}</p>
                </div>

                
        </div>

        {/*------------------------admin navigation-----------------------------*/}

        <div>
            <nav className='grid '>
                <Link to={"all-users"}className='px-5 py-3 text-lg hover:bg-slate-100'>All-Users</Link>
                <Link to={"packages"}className='px-5 py-3 bg-slate-200 text-lg hover:bg-slate-300'>Packages</Link>
                <Link to={"payment"}className='px-5 py-3 text-lg hover:bg-slate-100'>Payment</Link>
                <Link to={"schedule"}className='px-5 py-3 bg-slate-200 text-lg hover:bg-slate-300'>Schedule</Link>
                <Link to={"schedule"}className='px-5 py-3 text-lg hover:bg-slate-100'>Schedule</Link>
                <Link to={"schedule"}className='px-5 py-3 bg-slate-200 text-lg hover:bg-slate-300'>Schedule</Link>
                <Link to={"schedule"}className='px-5 py-3 text-lg hover:bg-slate-100'>Schedule</Link>
                
                
            </nav>

        </div>
                

      </aside>
      <main className=' w-full h-full p-4'>
        <Outlet/>
      </main>
    </div>
  )
}

export default AdminPanel
