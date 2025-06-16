import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast"; 
import Loader from "../components/Spinner"; 
import { useAuth } from "../context/AuthContext";

const EmailSection = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); 
  const [message, setMessage] = useState(""); 

  const userId = localStorage.getItem("userId");
  const {isAuthenticated}=useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || isAuthenticated === false) {
      toast(
        "Please create an account to subscribe! \n\n If you already have an account please login to continue.",
        {
          duration: 6000,
        }
      );
      setLoading(false);
      return;
    }

    setLoading(true); 
    setMessage(""); 

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/subscribe`,
        { userId,email }, 
        { withCredentials: true } 
      );
      toast.success(res.data.message || "Subscribed successfully!");
      setMessage(res.data.message || "You have subscribed successfully!");
      setEmail(""); 
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
      setMessage(errorMessage);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 my-32">
      <h1 className="md:text-4xl text-2xl font-semibold">Never Miss a Blog!</h1>
      <p className="md:text-lg text-gray-700/70 pb-8">
        Subscribe to get the latest blog, new tech, and exclusive news.
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12"
      >
        <input
          className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-l-md px-3 text-gray-500" 
          placeholder="Enter your email id"
          required
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading} 
        />
        <button
          type="submit"
          className="md:px-12 px-8 h-full text-white bg-primary/80 hover:bg-primary transition-all cursor-pointer rounded-md rounded-l-none
      disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
          disabled={loading} 
        >
          {loading ? (
            <Loader loading={true} spinnerSize="sm" spinnerColor="text-white" />
          ) : (
            "Subscribe"
          )}
        </button>
      </form>
      {message && (
        <p
          className={`mt-4 text-sm ${
            message.includes("success") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default EmailSection;
