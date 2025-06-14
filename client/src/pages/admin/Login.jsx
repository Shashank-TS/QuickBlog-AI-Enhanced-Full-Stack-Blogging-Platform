import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast/headless";

const Login = () => {

  const {login}=useAuth();


  const navigate=useNavigate()

  const [fullname,setFullname]=useState('')
  const [username,setUsername]=useState('')
  const [password,setPassword]=useState('')
  const [state,setState]=useState('Login')
  const [errordata,setError]=useState('')


  const Login =async (e) => {
    e.preventDefault();
    try {
        const res=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,{username,password},{
          withCredentials: true
        })
        const data=await res.data;
        localStorage.setItem("userId",data.userId);
        toast.success("Login successfull")
        console.log("login successfull ",data)
        setError('')
          login()
          navigate("/admin")
        
      } catch (error) {
        console.error("error in login: " ,error)
        setError(error.response.data)
      }
  }

  const register =async (e) => {
    e.preventDefault();
    try {
        const res=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,{fullname,username,password},{
          withCredentials: true
        })
        const data=await res.data;
        console.log("Registration successfull!",data)
        setError('')
      } catch (error) {
        console.error("error register: " ,error)
        setError(error.response.data)
      }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg">
        <div className="flex flex-col items-center justify-center">
          { state === "Login" ? ( 
          <div className="w-full py-6 text-center">
           
            <h1 className="text-3xl font-bold">
              <span className="text-primary">User</span> Login
            </h1>
            <p className="font-light">
              Enter your credentials to access the admin panel
            </p>

          </div>
          ):(
            <div className="w-full py-6 text-center">
           
            <h1 className="text-3xl font-bold">
              <span className="text-primary">User</span> Register
            </h1>
            <p className="font-light">
              Enter your Details to create an account
            </p>

          </div>
          )}
          <form onSubmit={state === "Login" ? Login : register} className="mt-6 w-full sm:max-w-md text-gray-600">
            {state === "Register" &&
            <div className="flex flex-col">
              <label> Full Name </label>
              <input
                required
                placeholder="your email id"
                className="border-b-2 border-gray-300 p-2 outline-none mb-6"
                type="text"
                value={fullname}
                onChange={(e)=>setFullname(e.target.value)}
              />
            </div>
            }
            <div className="flex flex-col">
              <label> Email </label>
              <input
                required
                placeholder="your email id"
                className="border-b-2 border-gray-300 p-2 outline-none mb-6"
                type="email"
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label> Password </label>
              <input
                required=""
                placeholder="your password"
                className="border-b-2 border-gray-300 p-2 outline-none mb-6"
                type={password}
                onChange={(e)=>setPassword(e.target.value)}
              />
            </div>
            <p className="text-red-500 mb-3 text-sm">{errordata}</p>
            {
              state === "Login" ?(
                <button
              type="submit"
              className="w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all"
            >
              Login
            </button>
              ):
              (<button
              type="submit"
              className="w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all"
            >
              Register
            </button>)
            }
            {state === "Login" ?(            
            <div className="text-sm mt-4 text-center">
              <p >Don't have an accout ? <span onClick={()=>setState("Register")} className="text-primary cursor-pointer">create account</span></p>
            </div>):
            (
              <div className="text-sm mt-4 text-center">
              <p >Already a user ? <span onClick={()=>setState("Login")} className="text-primary cursor-pointer">login here</span></p>
            </div>
            )
            }
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
