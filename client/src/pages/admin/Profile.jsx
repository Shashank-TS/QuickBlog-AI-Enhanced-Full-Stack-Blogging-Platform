import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets';
import Loader from '../../components/Spinner';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {

    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState('');
    const [isEdit, setIsEdit] = useState('');
    const [subscriptonStatus,setSubscriptonStatus]=useState(false)
    const [profileData, setProfileData] = useState({
        fullname:'',
        username:'',
    });

    const {logout}=useAuth()
    const userId = localStorage.getItem("userId")

    const fetchData =async () => {
    setLoadingData(true)
    setError(null)

    if (!userId) {
      setError("User ID not found. Please log in.");
      setLoadingData(false);
      return;
    }
    try {
        const userRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/get/${userId}`,{
            withCredentials: true
        })
        const userData = userRes.data; 
        setProfileData(userData);
        console.log("user data fetched successfully", userData);

        if (userData.username) { 
            const subStatusRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/subscriptionstatus/${userData.username}`,{ withCredentials: true })
            const subStatusData = subStatusRes.data;
            console.log("Subscription status data:", subStatusData);
            setSubscriptonStatus(subStatusData.status);
        } else {
            console.warn("User data fetched, but username is missing. Cannot fetch subscription status.");
            setSubscriptonStatus(false); 
        }

    } catch (error) {
        console.error("Error fetching data or subscription status:" ,error);
        if (error.response && error.response.status === 401 || error.response.status === 403) {
            toast.error("Session expired or unauthorized. Please log in again.");
        } else {
            toast.error("An error occurred while fetching user data or subscription status.");
        }
        setError("Failed to load profile or subscription status.");
    } finally {
        setLoadingData(false);
    }
    
  }

  const handleUpdate =async () => {

    if (!userId) {
      setError("User ID not found. Please log in.");
      setLoadingData(false);
      return;
    }

    setLoadingData(true)
    setError(null)
    setIsEdit(false)
    
    try {
        const res=await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/user/update/${userId}`,profileData,{
          withCredentials: true
        })
        const data=await res.data;
        setProfileData(data);
        console.log("user data updated successfully",data)
        toast.success("data updated successfully")
        toast.success("please log in with your new credentials!")
        logout()
      } catch (error) {
        console.error("error updating data:" ,error)
        if(error.response.status === 400){
          setError("This email is already taken")
        } else{
        setError("An error occurred while updating user data.")               
        }
      }finally{
        setLoadingData(false)
      }
  }

  const handleSubscription=async ()=>{
  try {
    let email=profileData.username
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/subscribe`,
        { email,userId }, 
        { withCredentials: true } 
      );
      toast.success(res.data.message || "Subscribed successfully!");
      fetchData()
    } catch (error) {
      console.error("Error subscribing:", error);
      let errorMessage = "Failed to subscribe. Please try again.";
      if (error.response && error.response.data) {
        errorMessage =
          typeof error.response.data === "string"
            ? error.response.data
            : error.response.data.message || errorMessage;
      }
      toast.error(errorMessage);
    }
  };

  const unsubscribe=async ()=>{
    let email=profileData.username
  try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/unsubscribe`,
        { email,userId }, 
        { withCredentials: true } 
      );
      toast.success("UnSubscribed successfully!");
      fetchData()
    } catch (error) {
      console.error("Error unsubscribing:", error);
    }
  }; 

    useEffect(()=>{
        fetchData()
    },[])

  return (
    <div>
      <div className='flex flex-col gap-3 m-5 w-64'>
        {loadingData ? (
          <Loader loading={loadingData} spinnerSize="md" spinnerColor="text-purple-500" message="Loading profile data..." />
        ) : error ? (
          <div className="text-red-600 text-center p-4">
            <p>Error: {error}</p>
            <button
              onClick={fetchData}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        ):( 
        <>
        <div>
          <img className='w-38 h-38 sm:max-w-64 rounded-lg ml-10' src={assets.user_icon} alt='profile' />
        </div>

        <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>
        
          <p className='flex items-center gap-2 sm:text-3xl text-xl font-medium text-gray-700'>
            {isEdit ? <input type="text" onChange={(e) => setProfileData(prev => ({ ...prev, fullname: e.target.value }))} value={profileData.fullname} /> : profileData.fullname}
          </p>
          <div className='flex items-center gap-2 mt-4 text-gray-600'>
            <p className='text-sm sm:text-base'>
              {isEdit ? <input type="email" onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))} value={profileData.username} /> : profileData.username}
            </p>
          </div>

          {/* ---- Edit & Save Buttons ---- */}
          {isEdit ? (
            <div className='flex gap-4 mt-4'>
            <button onClick={handleUpdate} className='px-8 py-2 border border-primary text-sm rounded-full mt-5 bg-primary text-white hover:scale-105 transition duration-200'>
              Save
            </button>
            <button onClick={()=>setIsEdit(false)} className='px-8 py-2 border border-primary text-sm rounded-full mt-5 hover:scale-105 transition duration-200'>
              Cancel
            </button>
            </div>
          ) : (
            <button onClick={() => setIsEdit(true)} className='px-8 py-2 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white'>
              Edit
            </button>
          )}
          <br/>
          {subscriptonStatus && 
          <>
          <input className='mt-5'  type='checkbox' defaultChecked={subscriptonStatus} /><span>Subscribed to latest blogs</span><br/>
          <button className='mt-4 bg-primary px-3 py-2 rounded-full text-white hover:scale-105 transition duration-200' onClick={unsubscribe}>Unsubsribe</button>
          <br/>
          </>}
          {!subscriptonStatus && 
          <button className='mt-4 bg-primary px-3 py-2 rounded-full text-white hover:scale-105 transition duration-200' onClick={handleSubscription}>Subsribe</button>
          }
        </div>
        </>
        )}
      </div>
    </div>
  )
}

export default Profile
