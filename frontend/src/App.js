import logo from './logo.svg';
import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './component/Header';
import Footer from './component/Footer';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import SummaryApi from './common';
import Context from './context';
import { setUserdetails } from './store/userSlice';
import { useDispatch } from 'react-redux';

function App() {

  const dispatch = useDispatch()

  const fetchUserDetails = async()=> {
    const dataResponse = await fetch(SummaryApi.current_user.url,{
      method : SummaryApi.current_user.method,
      credentials : 'include'
    })
    const dataApi = await dataResponse.json()

    if(dataApi.success){
      dispatch(setUserdetails(dataApi.data))

    }

  }

  useEffect(()=>{
    //--user Details--//
    fetchUserDetails()
  
  },[])
  return (
    <>
    <Context.Provider value={{
      fetchUserDetails          //--user Details fetch--//

    }}>
    <ToastContainer />
    <Header/>
    <main className='min-h-[calc(100vh-160px)] pt-16 '>
      <Outlet/>
    </main>
    
    <Footer/>
    </Context.Provider>
    </>
  );
}

export default App;
