import React, { useEffect, useState } from 'react'
import BlogTableItem from './BlogTableItem';
import axios from 'axios';
import Loader from '../../components/Spinner';


const ListBlog = () => {

  const [blogs,setBlogs]=useState([])
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [error, setError] = useState('');

  const userId = localStorage.getItem("userId")

  const fetchBlogs =async () => {
    setLoadingBlogs(true)
    setError(null)

    if (!userId) {
      setError("User ID not found. Please log in.");
      setLoading(false);
      return;
    }
    
    try {
        const res=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/blog/user/get/${userId}`,{
          withCredentials: true
        })
        const data=res.data;
        setBlogs(data);
        console.log("blogs fetched successfully",data)
      } catch (error) {
        console.error("error fetching blogs:" ,error)
        setError("An error occurred while fetching blogs.")        
      }finally{
        setLoadingBlogs(false)
      }
  }

    useEffect(()=>{
        fetchBlogs()
    },[])

  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50'>
        <h1>All Blogs</h1>

        {loadingBlogs ? (
          <Loader loading={loadingBlogs} spinnerSize="md" spinnerColor="text-purple-500" message="Loading your blogs..." />
        ) : error ? (
          <div className="text-red-600 text-center p-4">
            <p>Error: {error}</p>
            <button
              onClick={fetchBlogs}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        ):(
        <div className="relative h-4/5 mt-4 max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white">
          <table className="w-full text-sm text-gray-500">
            <thead className="text-xs text-gray-600 text-left uppercase">
              <tr>
                <th scope="col" className="px-2 py-4 xl:px-6">
                  #
                </th>
                <th scope="col" className="px-2 py-4">
                  Blog Title
                </th>
                <th scope="col" className="px-2 py-4 max-sm:hidden">
                  Date
                </th>
                <th scope="col" className="px-2 py-4 max-sm:hidden">
                  Status
                </th>
                <th scope="col" className="px-2 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog,index)=>{
                return <BlogTableItem key={blog.id} blog={blog} fetchBlogs={fetchBlogs} index={index+1} />
              })}
            </tbody>
          </table>
        </div>
        )}
      
    </div>
  )
}

export default ListBlog
