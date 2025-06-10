import React from "react";
import { assets } from "../../assets/assets";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const Layout = () => {

  const {logout}=useAuth();

  const Logout = async ()=>{
    try {
        const res=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,{},{
          withCredentials: true
        })
        const data=await res.data;
        console.log("logout successfull ",data)
        logout()
        navigate("/")
      } catch (error) {
        console.error("error logging: " ,error)
      }
  }

  const navigate=useNavigate();
  return (
    <>
    <div className="flex items-center justify-between py-2 h-[70px] px-4 sm:px-12 border-b border-gray-200">
      <img
        alt=""
        className="w-32 sm:w-40 cursor-pointer"
        src={assets.logo}
        onClick={()=>navigate('/')}
      />
      <button onClick={Logout} className="text-sm px-8 py-2 bg-primary text-white rounded-full cursor-pointer">
        Logout
      </button>
    </div>
    <div className="flex h-[calc(100vh-70px)]">
        <Sidebar/>
        <Outlet/>
    </div>
    </>
  );
};

export default Layout;
