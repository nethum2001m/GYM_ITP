import React, { useState } from 'react'
import loginIcons from '../assest/profile.png'
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const Signup = () => {
    const[data,setData] = useState({
            email: '',
            password: '',
            name: '',
            confirmpassword: '',
        })
        
        const navigate = useNavigate()
        const handleOnChange = (e) =>{
            const {name,value} = e.target
            setData((preve)=>{
                return {...preve, [name]:value}
    
            })
        }
    
        const handleSubmit = async(e) => {
            e.preventDefault()

            if(data.password === data.confirmpassword){
                
                const dataResponse = await fetch(SummaryApi.signUP.url,{
                    method : SummaryApi.signUP.method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
            
                })
        
                const dataApi = await dataResponse.json()

                if (dataApi.success){
                    toast.success(dataApi.message)
                    navigate('/login')
                }
                if(dataApi.error){
                    toast.error(dataApi.message)
                }

                //toast(dataApi.message) 
        
               
                //alert("Passwords do not match")
                //return
            }
            else{
                toast.error('Passwords do not match')       //--------fixed error--------///
                
            }
            // call your API here with the data
            
        }    
    
        
  return (
    <section id='signup' className='py-20'>
        <div className='bg-white p-4 w-full max-w-md mx-auto rounded-md '>
            <div className='w-40 h-40 mx-auto'>
                <img src={loginIcons} alt='login icons'></img>
            </div>

            <form className='pt-6' onSubmit={handleSubmit}>
            <div className='grid'>
                    <label>Name</label>
                    <div className='bg-slate-200 p-2 m-2 rounded-md'>
                        <input type='text'
                            placeholder='Enter your Name'
                            name='name'
                            value={data.name}
                            onChange={handleOnChange} 
                            className='w-full h-full outline-none bg-transparent ' required />
                    </div>   
                </div>
                <div className='grid'>
                    <label>Email</label>
                    <div className='bg-slate-200 p-2 m-2 rounded-md'>
                        <input type='email'
                            placeholder='Enter your email'
                            name='email'
                            value={data.email}
                            onChange={handleOnChange} 
                            className='w-full h-full outline-none bg-transparent ' required />
                    </div>   
                </div>

                <div>
    <label>Password</label>
    <div className='bg-slate-200 p-2 m-2 rounded-md'>
        <input
            type='password'
            placeholder='Enter password'
            name='password'
            value={data.password}
            onChange={handleOnChange}
            className='w-full h-full outline-none bg-transparent'
            required
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
            title="Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, and one number."
        />
    </div>
</div>


                <div>
                    <label>Confirm Password</label>
                    <div className='bg-slate-200 p-2 m-2 rounded-md'>
                        <input type='password' 
                            placeholder='Re-enter password'
                            name='confirmpassword'
                            value={data.confirmpassword}  
                            onChange={handleOnChange}    
                            className='w-full h-full outline-none bg-transparent' required />
                    </div>   
                </div>

                <button className='bg-red-600 text-white m-2 px-6 py-2 rounded-2xl hover:scale-105 hover:bg-red-700 transition-all mx-auto block mt-4'>Submit</button>
            </form>
            <p className='my-4 text-center'>Allready have account ? <Link to={"/login"} className=' text-red-600 hover:text-red-700 hover:underline' >Login</Link>  </p>
        </div>

    </section>
  )
}

export default Signup
