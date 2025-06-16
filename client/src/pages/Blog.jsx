import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Navbar from "../components/Navbar";
import Moment from "moment";
import Footer from "../components/Footer";
import axios from "axios";
import Loader from "../components/Spinner"; 
import toast from "react-hot-toast";

const Blog = () => {
 const { id } = useParams();

 const userId = localStorage.getItem("userId");

 const [data, setData] = useState(null);
 const [comments, setComments] = useState([]);
 const [loadingBlogs, setLoadingBlogs] = useState(true);
 const [error, setError] = useState('');
 const [addCommentError,setAddCommentError]=useState('');
 const [isSummarizing, setIsSummarizing] = useState(false); 
 const [blogSummary, setBlogSummary] = useState(null);
 const [addingComment,setAddingComment]=useState(false) 

 useEffect(() => {
  fetchBlogData();
  fetchCommentsData();
 }, [id]); 


 const fetchBlogData = async () => {
  setLoadingBlogs(true);
  setError(null);
  try {
   const res=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/blog/get/${id}`,{
     withCredentials: true
    });
   const blogData= await res.data;
   setData(blogData);
   console.log("blog fetched successfully ",blogData);
  
  } catch (error) {
   console.error("error fetching blog: ",error);
   toast.error("An error occurred while fetching the blog."); 
   setError("An error occurred while fetching blog.");
  } finally{
   setLoadingBlogs(false);
  }
 };

 const fetchCommentsData = async () => {
  try {
   const res=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/comment/get/${id}`,{
     withCredentials: true
    });
   const commentData= await res.data;
   setComments(commentData);
   console.log("comments fetched successfully",commentData);
  } catch (error) {
   console.error("error fetching comments: ",error);
   toast.error("Error fetching comments."); 
  }
 };

 const [name, setName] = useState("");
 const [content, setContent] = useState("");

 const addComment = async (e) => {
  e.preventDefault();
  setAddingComment(true)
  setAddCommentError(null);
  if (userId === null) {
   setAddCommentError("Please login to comment!");
   toast.error("Please login to comment!"); 
   return;
  }
   
  try {
   const res=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/comment/post`,{name,content,blogId:id},{
     withCredentials: true
    });
   const commentDat= await res.data;
   console.log("comments added successfully",commentDat);
   if(userId){
    fetchCommentsData();
   }
   setName("");
   setContent(""); 
   toast.success("Comment added successfully!"); 
  } catch (error) {
   console.error("error adding comment: ",error);
      let errorMessage = "Failed to add comment.";
      if (error.response && error.response.data) {
        errorMessage = typeof error.response.data === 'string' ? error.response.data : error.response.data.message || errorMessage;
      }
   toast.error(errorMessage); 
  } finally{
    setAddingComment(false)
  }
 };

 
  const handleSummarize = async () => {
    if (!data || !data.description) {
      toast.error("Blog content not available for summarization.");
      return;
    }
    setIsSummarizing(true); 

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/ai/summarize`,
        { content: data.description }, 
        { withCredentials: true }
      );
      const summaryData = res.data;
      setBlogSummary(summaryData); 
      toast.success("Blog summarized successfully!");
    } catch (error) {
      console.error("Error summarizing blog:", error);
      let errorMessage = "Failed to summarize blog.";
      if (error.response && error.response.data) {
        errorMessage = typeof error.response.data === 'string' ? error.response.data : error.response.data.message || errorMessage;
      }
      toast.error(errorMessage);
      setBlogSummary(null); 
    } finally {
      setIsSummarizing(false); 
    }
  };


 return (
  <div className="relative">
   <img
    alt=""
    className="absolute -top-50 -z-1 opacity-50"
    src={assets.gradientBackground}
   />
   <Navbar />
   {loadingBlogs ? (
     <div className="min-h-screen flex items-center justify-center">
      <Loader loading={loadingBlogs} spinnerSize="lg" spinnerColor="text-blue-500" message="Loading your blog..." />
     </div>
    ) : error ? (
     // Error display if initial blog data fetch fails
     <div className="min-h-screen flex flex-col items-center justify-center text-red-600">
      <p>Error: {error}</p>
      <button
       onClick={fetchBlogData}
       className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
       Retry
      </button>
     </div>
    ):( 
     <>
   <div className="text-center mt-20 text-gray-600">
    <p className="text-primary py-4 font-medium">
     Published on {Moment(data.createdAt).format("MMMM Do, YYYY")}
    </p>
    <h1 className="text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800">
     {data.title}
    </h1>
    <h2 className="my-5 max-w-lg truncate mx-auto">{data.subTitle}</h2>
    <p className="inline-block py-1 px-4 rounded-full mb-6 border text-sm border-primary/35 bg-primary/5 font-medium text-primary">
     {data.userName} 
    </p>
   </div>

   <div className="mx-5 max-w-5xl md:mx-auto my-10 mt-6">
    <img alt="" className="rounded-3xl mb-5 w-full h-auto object-cover max-h-96" src={data.image} /> {/* Added image styling */}
    
        {/* Blog Description */}
        <div
     dangerouslySetInnerHTML={{ __html: data.description }}
     className="rich-text max-w-3xl mx-auto"
    ></div>

        {/* AI Summarization Section */}
        <div className="max-w-3xl mx-auto mt-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
                Want a Quick Summary?
            </h3>
            <p className="text-gray-700 mb-6">
                Click the button below to get an AI-generated summary of this blog post instantly!
            </p>
            <button
                onClick={handleSummarize}
                disabled={isSummarizing} 
                className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md
                           hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75
                           transition duration-200 ease-in-out transform cursor-pointer hover:scale-95
                           disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isSummarizing ? (
                    <>
                        <Loader loading={true} spinnerSize="sm" spinnerColor="text-white" />
                        Summarizing...
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"></path>
                        </svg>
                        Summarize with AI
                    </>
                )}
            </button>
            {blogSummary && (
                <div className="mt-8 p-4 bg-white border border-blue-300 rounded-lg shadow-inner">
                    <h4 className="text-lg font-bold text-blue-800 mb-2">AI-Generated Summary:</h4>
                    <p className="text-gray-800 leading-relaxed">{blogSummary}</p>
                </div>
            )}
        </div>

    {/* comments */}

    <div className="mt-14 mb-10 max-w-3xl mx-auto">
     <p className="font-semibold mb-4">
      Comments ({comments.length})
     </p>
     <div className="flex flex-col gap-4">
      {comments.map((item, index) => (
       <div
        key={item.id || index} 
        className="relative bg-primary/2 border border-primary/5 max-w-xl p-4 rounded text-gray-600"
       >
        <div className="flex items-center gap-2 mb-2">
         <img alt="" className="w-6" src={assets.user_icon} />
         <p className="font-medium">{item.name}</p>
        </div>
        <p className="text-sm max-w-md ml-8">{item.content}</p>
        <div className="absolute right-4 bottom-3 flex items-center gap-2 text-xs">
         {Moment(item.createdAt).fromNow()}
        </div>
       </div>
      ))}
     </div>
    </div>

    {/* add comments section */}
    <div className="max-w-3xl mx-auto">
     <p className="font-semibold mb-4">Add your comment</p>
     <form
      onSubmit={addComment}
      className="flex flex-col items-start gap-4 max-w-lg"
     >
      <input
       placeholder="Name"
       required
       className="w-full p-2 border border-gray-300 rounded outline-none"
       type="text"
       value={name}
       onChange={(e) => setName(e.target.value)}
      />
      <textarea
       placeholder="Comment"
       className="w-full p-2 border border-gray-300 rounded outline-none h-48"
       required
       value={content}
       onChange={(e) => setContent(e.target.value)}
      ></textarea>
      {addCommentError ? <p className="text-s text-red-500">{addCommentError}</p> : ''}
      <button
       disabled={addingComment}
       type="submit"
       className="bg-primary text-white rounded p-2 px-8 hover:scale-102 transition-all cursor-pointer disabled:cursor-not-allowed"
      >
       Submit
      </button>
     </form>
    </div>

    {/* share buttons */}
    <div className="my-24 max-w-3xl mx-auto">
     <p className="font-semibold my-4">
      Share this article on social media
     </p>
     <div className="flex">
      <img width={50} alt="" src={assets.facebook_icon} />
      <img width={50} alt="" src={assets.twitter_icon} />
      <img width={50} alt="" src={assets.googleplus_icon} />
     </div>
    </div>
   </div>
   </>
)}
   <Footer/>
  </div>
 );
};

export default Blog;
