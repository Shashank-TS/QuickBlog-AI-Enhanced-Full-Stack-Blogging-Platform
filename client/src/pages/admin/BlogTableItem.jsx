import React from "react";
import { assets } from "../../assets/assets";
import axios from "axios";
import toast from "react-hot-toast";

const BlogTableItem = ({ blog, fetchBlogs, index }) => {
  const { title, createdAt } = blog;
  const BlogDate = new Date(createdAt);

  const publish=true
  const unpublish=false

  const changePublish =async (blogId,isPublished) => {
    try {
        const res=await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/blog/setpublish/${blogId}`,{isPublished},{
          withCredentials: true
        })
        const data=res.data;
        fetchBlogs()
        console.log(data)
      } catch (error) {
        console.error("error changing blogs publish status:" ,error)
        toast.error("an error occured")
      }
  }
  const deleteBlog =async (blogId) => {
    try {
        const res=await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/blog/delete/${blogId}`,{
          withCredentials: true
        })
        const data=res.data;
        fetchBlogs()
        toast.error("Blog deleted!")
        console.log(data)
      } catch (error) {
        console.error("error deleting blog:" ,error)
        toast.error("error deleting blog")
      }
  }

  return (
    <tr className="border-y border-gray-300">
      <th className="px-2 py-4">{index}</th>
      <td className="px-2 py-4">{title}</td>
      <td className="px-2 py-4 max-sm:hidden">{BlogDate.toDateString()}</td>
      <td className="px-2 py-4 max-sm:hidden">
        <p className={` ${blog.published ? "text-green-600" :"text-orange-700"}`}>{blog.published ? 'Published' : 'Unpublished'}</p>
      </td>
      <td className="px-2 py-4 flex text-xs gap-3">
        <button 
          onClick={()=>blog.published ?changePublish(blog.id,unpublish):changePublish(blog.id,publish)}
           className="border px-2 py-0.5 mt-1 rounded cursor-pointer">
          {blog.published ? 'Unpublish' :'publish'}
        </button>
        <img
          className="w-8 hover:scale-110 transition-all cursor-pointer"
          alt=""
          src={assets.cross_icon}
          onClick={()=>deleteBlog(blog.id)}
        />
      </td>
    </tr>
  );
};

export default BlogTableItem;
