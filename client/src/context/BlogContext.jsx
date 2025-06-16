import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const BlogContext = createContext();

export const useBlogs = () => {
  return useContext(BlogContext);
};

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBlogs = async () => {
    setLoadingBlogs(true);
    setError(null);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/blog/get`);
      const data = res.data;
      setBlogs(data);
      console.log("Blogs fetched successfully (from context)");
    } catch (err) {
      console.error("Error fetching blogs for context:", err);
      let errorMessage = "Failed to load blogs for the homepage.";
      if (err.response && err.response.data) {
        errorMessage = typeof err.response.data === 'string' ? err.response.data : err.response.data.message || errorMessage;
      }
      setError(errorMessage);
      toast.error(errorMessage); 
    } finally {
      setLoadingBlogs(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []); 

  const contextValue = {
    blogs,
    loadingBlogs,
    error,
    refetchBlogs: fetchBlogs,
    searchQuery,       
    setSearchQuery  
  };

  return (
    <BlogContext.Provider value={contextValue}>
      {children}
    </BlogContext.Provider>
  );
};