import React, { useEffect, useState } from "react";
import CommentTableItem from "./CommentTableItem";
import axios from "axios";
import Loader from "../../components/Spinner";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState("Approved");
  const [loadingBlogs, setLoadingBlogs] = useState(true);
    const [error, setError] = useState('');  

  const userId = localStorage.getItem("userId")

  const fetchComments = async () => {
    setLoadingBlogs(true)
    setError(null)

    if (!userId) {
      setError("User ID not found. Please log in.");
      setLoading(false);
      return;
    }
      try {
        const res=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/comment/get/user/${userId}`,{
          withCredentials: true
        })
        const data=res.data;
        setComments(data);
        console.log("comments fetched successfully",data)
      } catch (error) {
        console.error("error fetching comments:" ,error)
        setError("An error occurred while fetching comments.")
      } finally{
        setLoadingBlogs(false)
      }
  }

  useEffect(() => {
    fetchComments();
  }, []);
  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50">
      <div className="flex justify-between items-center max-w-3xl">
        <h1>Comments</h1>
        <div className="flex gap-4">
          <button onClick={()=>setFilter("Approved")} className={`shadow-custom-sm border rounded-full px-4 py-1 cursor-pointer text-xs ${filter === 'Approved'?'text-primary' :'text-gray-700'}`}>
            Approved
          </button>
          <button onClick={()=>setFilter("Not Approved")} className={`shadow-custom-sm border rounded-full px-4 py-1 cursor-pointer text-xs ${filter === 'Not Approved'?'text-primary' :'text-gray-700'}`}>
            Not Approved
          </button>
        </div>
      </div>
      {loadingBlogs ? (
          <Loader loading={loadingBlogs} spinnerSize="md" spinnerColor="text-purple-500" message="Loading your comments..." />
        ) : error ? (
          <div className="text-red-600 text-center p-4">
            <p>Error: {error}</p>
            <button
              onClick={fetchComments}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        ):(
      <div
    className="relative h-4/5 max-w-3xl overflow-x-auto mt-4 bg-white shadow rounded-lg scrollbar-hide"
  >
    <table className="w-full text-sm text-gray-500">
      <thead className="text-xs text-gray-700 text-left uppercase">
        <tr>
          <th scope="col" className="px-6 py-3">Blog Title &amp; Comment</th>
          <th scope="col" className="px-6 py-3 max-sm:hidden">Date</th>
          <th scope="col" className="px-6 py-3">Action</th>
        </tr>
      </thead>
      <tbody>
        {comments.filter((comment)=>{
          if(filter === 'Approved') return comment.approved === true;
          return comment.approved === false;
        }).map((comment,index)=> <CommentTableItem key={comment.id} comment={comment} index={index+1} fetchComments={fetchComments}/>)}
      </tbody>
      </table>
      </div>)
}
    </div>
  );
};

export default Comments;
