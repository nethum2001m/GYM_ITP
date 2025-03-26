import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import { toast } from 'react-toastify'
import { RiEdit2Fill } from "react-icons/ri";
import ChangeUserRole from '../component/ChangeUserRole';
import { MdDelete } from "react-icons/md";

const AllUsers = () => {

    const [allUser,setAllUsers] = useState([])

    //-------------------------------------------Delete users----------------------------------//
    const confirmToast = (message, onConfirm) => {
      toast(
        ({ closeToast }) => (
          <div>
            <p>{message}</p>
            <div className="flex gap-4 mt-2">
              <button
                className="bg-red-500 text-white px-3 py-1 rounded-md"
                onClick={() => {
                  onConfirm();  // Call the function when user confirms
                  closeToast(); // Close the toast
                }}
              >
                Yes
              </button>
              <button
                className="bg-gray-400 text-white px-3 py-1 rounded-md"
                onClick={closeToast}
              >
                No
              </button>
            </div>
          </div>
        ),
        { autoClose: false, closeOnClick: false }
      );
    };
    
    const deleteUser = async (userId) => {
      confirmToast("Are you sure you want to delete this user?", async () => {
        try {
          const response = await fetch(SummaryApi.deleteUser.url, {
            method: SummaryApi.deleteUser.method,
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId })
        });
          const data = await response.json();
          if (data.success) {
            toast.success("User deleted successfully!");
            fetchAllUsers(); // Refresh user list after deletion
          } else {
            toast.error("Failed to delete user.");
          }
        } catch (error) {
          toast.error("An error occurred.");
        }
      });
    };
  //--------------------------------------------end delete----------------//

    const[openUpdateRole,setOpenUpdateRole] = useState(false)

    const [updateUserDetails,setUpdateUserDetails] = useState({
      email: "",
      name: "",
      role: "",
      _id: "",
      
    })
    const fetchAllUsers = async() =>{
        const fetchData = await fetch(SummaryApi.allUser.url,{  //------------------warning
            method : SummaryApi.allUser.method,
            credentials : 'include'
        })

        const dataResponse = await fetchData.json()

        if(dataResponse.success){
          setAllUsers(dataResponse.data)
        }

        if(dataResponse.error){
          toast.error(dataResponse.data)
        }

    }

    useEffect(()=>{
        fetchAllUsers()
    },[]);
  return (
    <div className='bg-white pb-4'>
      <table className='w-full userTabale'>
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
            
          </tr>
          
        </thead>
        <tbody className=''>{
              allUser.map((el,index) =>{
                return(
                  <tr>
                    <td>{index+1}</td>
                    <td>{el?.name}</td>
                    <td>{el?.email}</td>
                    <td>{el?.role}</td>
                    <td className=''>
                        <td className='bg-green-400  p-2  rounded-md cursor-pointer hover:bg-green-600 hover:text-white ' 
                        onClick={()=>{
                          setUpdateUserDetails(el)
                          setOpenUpdateRole(true)
                        }}  
                        >
                          <RiEdit2Fill/>

                        </td>
                        <td className='bg-red-400 p-2 rounded-md cursor-pointer hover:bg-red-600 hover:text-white' 
                            onClick={() => deleteUser(el._id)}>
                            <MdDelete />
                        </td>
                        </td>


                    


                  </tr>
                )
              })
          }

        </tbody>

      </table>
      {
         openUpdateRole && (
          <ChangeUserRole 
              onClose={()=>setOpenUpdateRole(false)}
              name={updateUserDetails.name}
              email={updateUserDetails.email}
              role={updateUserDetails.role}
              userId={updateUserDetails._id}
              callFunc={fetchAllUsers}
              />
         )
      }
      
    </div>
  )
}

export default AllUsers
