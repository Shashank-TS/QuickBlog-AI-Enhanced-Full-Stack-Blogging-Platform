import React from "react";
import { assets } from "../../assets/assets";
import axios from "axios";
import toast from "react-hot-toast";

const CommentTableItem = ({ comment, fetchComments }) => {
  const { blogTitle, createdAt, id } = comment;
  const BlogDate = new Date(createdAt);

  const approveComment =async (commentId) => {
    try {
        const res=await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/comment/setapprove/${commentId}`,{},{
          withCredentials: true
        })
        const data=res.data;
        fetchComments()
        toast.success("comment approved")
        console.log(data)
      } catch (error) {
        console.error("error approving commment:" ,error)
        toast.error("error approving comment")
      }
  }

  const deleteComment =async (commentId) => {
    try {
        const res=await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/comment/delete/${commentId}`,{
          withCredentials: true
        })
        const data=res.data;
        fetchComments()
        toast.error("comment deleted")
        console.log(data)
      } catch (error) {
        console.error("error deleting comment:" ,error)
        toast.error("error deleting comment")
      }
  }

  return (
    <tr className="order-y border-gray-300">
      <td className="px-6 py-4">
        <b className="font-medium text-gray-600">Blog</b> : {blogTitle}
        <br />
        <br />
        <b className="font-medium text-gray-600">Name</b> : {comment.name} 
        <br />
        <b className="font-medium text-gray-600">Comment</b> :  {comment.content}
      </td>
      <td className="px-6 py-4 max-sm:hidden">{BlogDate.toLocaleDateString()}</td>
      <td className="px-6 py-4">
        <div className="inline-flex items-center gap-4">
            {!comment.approved ?
          <img
            alt=""
            className="w-5 hover:scale-110 transition-all cursor-pointer"
            src={assets.tick_icon}
            onClick={()=>approveComment(comment.id)}
          /> :
          <p className="text-xs border border-green-600 bg-green-100 text-green-600 rounded-full px-3 py-1">
            Approved
          </p>
            }
            <img
            alt=""
            className="w-5 hover:scale-110 transition-all cursor-pointer"
            src={assets.bin_icon}
            onClick={()=>deleteComment(comment.id)}
          /> 
        </div>
      </td>
    </tr>
  );
};

export default CommentTableItem;
