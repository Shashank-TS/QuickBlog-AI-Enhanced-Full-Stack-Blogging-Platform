import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import BlogTableItem from "./BlogTableItem";
import axios from "axios";
import Loader from "../../components/Spinner";

const Dashboard = () => {
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [error, setError] = useState('');
  
  const [blogsNo,setBlogsNo]=useState(0)
  const [comments,setComments]=useState(0)
  const [drafts,setDrafts]=useState(0)

  const [blogs,setBlogs]=useState([])

  useEffect(() => {
    fetchBlogs();
  }, []);

  const userId = localStorage.getItem("userId")

  const fetchBlogs =async () => {
    setLoadingBlogs(true)
    setError(null)

    if (!userId) {
      setError("User ID not found. Please log in.");
      setLoadingBlogs(false);
      return;
    }
    try {
        const res=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/blog/user/get/${userId}`,{
          withCredentials: true
        })
        const data=res.data;
        setBlogs(data);
        setBlogsNo(data.length)
       const totalComments = data.reduce((sum, blog) => {
            return sum + (blog.commentIds ? blog.commentIds.length : 0);
        }, 0);
        setComments(totalComments);
        const totalDrafts = data.reduce((sum, blog) => {
            return sum + (blog.published === false ? 1  : 0);
        }, 0);
        setDrafts(totalDrafts);
        console.log("blogs fetched successfully",data)
      } catch (error) {
        console.error("error fetching blogs:" ,error)
        setError("An error occurred while fetching blogs.")
      } finally{
        setLoadingBlogs(false)
      }
  }
  return (
    
    <div className=" relative flex-1 p-4 md:p-10 bg-blue-50/50">
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all">
          <img alt="" src={assets.dashboard_icon_1} />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {blogsNo}
            </p>
            <p className="text-gray-400 font-light">Blogs</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all">
          <img alt="" src={assets.dashboard_icon_2} />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {comments}
            </p>
            <p className="text-gray-400 font-light">Comments</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all">
          <img alt="" src={assets.dashboard_icon_3} />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {drafts}
            </p>
            <p className="text-gray-400 font-light">Drafts</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-3 m-4 mt-6 text-gray-600">
          <img alt="" src={assets.dashboard_icon_4} />
          <p>Latest Blogs</p>
        </div>

        {/* table */}
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
        <div className="relative max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white">
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
        )
      }
      </div>
    </div>
  )   
};

export default Dashboard;
