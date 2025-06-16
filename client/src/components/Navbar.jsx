import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {

  const {isAuthenticated} =useAuth()

  const navigate=useNavigate()
  return (
    <div className="flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32">
      <img onClick={()=>navigate('/')} alt="logo" className="w-32 sm:w-44 cursor-pointer" src={assets.logo} />
      <button onClick={()=>navigate('/admin')} className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-5 py-2.5">
        {isAuthenticated ? "Dashboard" : "Admin Login"}
        <img className="w-3" alt="arrow" src={assets.arrow} />
      </button>
    </div>
  );
};

export default Navbar;
