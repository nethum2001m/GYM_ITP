import React, { useState } from 'react'
import ROLE from '../common/role'
import { IoClose } from "react-icons/io5";
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const ChangeUserRole = ({
    name,
    email,
    role,
    userId,
    onClose,
    callFunc,
}) => {
    const [userRole,setUserRole] = useState(role)
    const handleOnChangeSelect = (e) =>{
        setUserRole(e.target.value)
        console.log(e.target.value)
    }

    const updateUserRole = async () =>{
        const fetchResponse = await fetch (SummaryApi.updateUser.url , {
        method : SummaryApi.updateUser.method ,
        credentials : 'include' , 
        headers: {
            "Content-Type": "application/json"
        },
            body : JSON.stringify({
                userId : userId ,
                role : userRole
            })
        })
        const responseData = await fetchResponse.json()

        if (responseData.success){
            toast.success(responseData.message)
            onClose()
            callFunc()
        }
        console.log("role updated",responseData)
    }

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 w-full h-full z-10 flex justify-between items-center bg-slate-500 bg-opacity-50'>
       <div className='mx-auto bg-white shadow-md p-4 w-full max-w-sm rounded-lg'>

        <button className='text-lg block ml-auto'onClick={onClose}>
          <IoClose/>
        </button>
        <h1 className='pb-4 text-lg font-medium font-sans'>Change User Role</h1>
        <p>Name : {name}</p>
        <p>Email : {email}</p>
        <div className='flex items-center justify-between my-4'>
            <p>Role :</p>
            <select  className='border px-4 py-1 'value={userRole} onChange={handleOnChangeSelect}>
                {
                    Object.values(ROLE).map(el =>{
                        return(
                            <option value={el} key={el}>{el}</option>

                        )
                    })
                }
                
            </select>
        </div>
        <button className='bg-red-600 text-white w-full py-2 px-4 rounded-md hover:bg-red-700' onClick={updateUserRole}>Change Role</button>


       </div>
    </div>
  )
}

export default ChangeUserRole;
