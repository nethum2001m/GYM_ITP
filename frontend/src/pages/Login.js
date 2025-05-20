import React, { useContext, useState } from 'react'
import loginIcons from '../assest/profile.png'
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import Context from '../context';

const Login = () => {
    const[data,setData] = useState({
        email: '',
        password: '',
    })

    const navigate = useNavigate()
    const {fetchUserDetails} = useContext(Context)
    

    
    const handleOnChange = (e) =>{
        const {name,value} = e.target
        setData((preve)=>{
            return {...preve, [name]:value}

        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        // call your API here with the data

        const dataResponse = await fetch(SummaryApi.signIN.url,{
            method : SummaryApi.signIN.method,

            credentials: 'include',
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(data)
        })

        const dataApi = await dataResponse.json()
        if(dataApi.success){
                toast.success(dataApi.message)
                navigate('/')
                fetchUserDetails()
        }
        if(dataApi.error){
                toast.error(dataApi.message)
        }
        

    }

    console.log("data login", data)
  return (
    <section id='login ' className='py-20'>
        <div className='bg-white p-4 w-full max-w-md mx-auto rounded-md '>
            <div className='w-40 h-40 mx-auto'>
                <img src={loginIcons} alt='login icons'></img>
            </div>

            <form className='pt-6' onSubmit={handleSubmit}>
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
                        <input type='password' 
                            placeholder='Enter password'
                            name='password'
                            value={data.password}  
                            onChange={handleOnChange}   
                            className='w-full h-full outline-none bg-transparent' required />
                    </div>   
                </div>
                <button className='bg-red-600 text-white m-2 px-44 py-2 rounded-2xl hover:scale-105 hover:bg-red-700 transition-all mx-auto block mt-10'>Login</button>
                
            </form>
            <p className='my-4 text-center'>Don't have account ? <Link to={"/sign-up"} className=' text-red-600 hover:text-red-700 hover:underline' >Sign Up</Link> </p>
        </div>

    </section>
  )
}

export default Login
