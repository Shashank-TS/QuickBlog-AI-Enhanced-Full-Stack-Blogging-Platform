import React, { useEffect, useRef, useState } from 'react'
import { assets, blogCategories } from '../../assets/assets';
import Quill from 'quill';
import axios from 'axios';
import toast  from 'react-hot-toast';

const AddBlog = () => {

  const editorRef=useRef(null)
  const quillRef=useRef(null)

  const userId = localStorage.getItem("userId")

  const [image,setImage]=useState(false);
  const [title,setTitle]=useState('');
  const [subTitle,setSubTitle]=useState('');
  const [category,setCategory]=useState("Startup");
  const [isPublished,setIsPublished]=useState(false);
  const [loading,setLoading]=useState(false);


  const publicKey=`${import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY}`;

  const onSubmitHandler = async (e) => {
  e.preventDefault();

  const blogContent = quillRef.current?.root.innerHTML;

  try {
    if (!userId) {
      setError("User ID not found. Please log in.");
      return;
    }
    const imageUrl = await uploadImageToImageKit();

    const blogPayload = {
      title,
      subTitle,
      category,
      description: blogContent,
      isPublished,
      image: imageUrl,
      userId:userId
    };

    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/blog/create`,blogPayload,{
          withCredentials: true
        });
    const data = await res.data;
    setImage(false)
    setTitle('')
    setCategory("Startup")
    setIsPublished(false)
    setSubTitle('')
    quillRef.current.root.innerHTML=""
    toast.success("Blog created successfully");
  } catch (error) {
    console.error("Failed to upload blog:", error);
    toast.error("error creating blog")
  }
};

const uploadImageToImageKit = async () => {
  try { 
  const authRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/imagekit/auth`,{
          withCredentials: true
        });
  const authData = await authRes.data;
  console.log(authData)

  const formData = new FormData();
  formData.append("file", image);
  formData.append("fileName", `${Date.now()}-${image.name}`);
  formData.append("publicKey", publicKey);
  formData.append("signature", authData.signature);
  formData.append("expire", authData.expire);
  formData.append("token", authData.token);

  const res = await axios.post("https://upload.imagekit.io/api/v1/files/upload", formData);

  const result = await res.data;
  return result.url; 
  } catch (error) {
    toast.error("error uploading image")
  }
};


  const genrateContent =async () => {
    if(!title) return toast.error("Please enter a title")
      setLoading(true)
      toast.promise(
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/ai/generateblog`, { title }, {
        withCredentials: true
        }).then(res => { 
        if (res.data) {
        console.log(res.data);
          quillRef.current.root.innerHTML = res.data;
        }
        return res.data; 
        }).finally(() => { 
                  setLoading(false);
              }),
        {
        loading: 'Generating blog content...',
        success: <b>Blog generation successful!</b>,
        error: <b>Failed to generate blog content.</b>,
        }
      );
  }

  useEffect(() => {
    if(!quillRef.current && editorRef.current){
      quillRef.current=new Quill(editorRef.current,{theme:'snow'})
    }
  }, []);

  return (
    <form onSubmit={onSubmitHandler} className="flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll">
  <div className="bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded">
    <p>Upload thumbnail</p>
    <label htmlFor="image"
      ><img
        alt=""
        className="mt-2 h-16 rounded cursor-pointer"
        src={!image ? assets.upload_area: URL.createObjectURL(image)}/><input
        
    />
    <input
     id="image"
        hidden
        required
        type="file"
        onChange={(e)=>setImage(e.target.files[0])}/>   
    </label>
    <p className="mt-4">Blog title</p>
    <input
      placeholder="Type here"
      required
      className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
      type="text"
      value={title}
      onChange={(e)=>setTitle(e.target.value)}
    />
    <p className="mt-4">Sub title</p>
    <input
      placeholder="Type here"
      required
      className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
      type="text"
      value={subTitle}
      onChange={(e)=>setSubTitle(e.target.value)}
    />
    <p className="mt-4">Blog Description</p>
    <div className="max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative">
      
<div ref={editorRef}></div>        
      <button 
      disabled={loading}
      onClick={genrateContent}
        type="button"
        className="absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer disabled:cursor-not-allowed"
      >
        Generate with AI
      </button>
    </div>
    <p className="mt-4">Blog category</p>
    <select
    onChange={(e)=>setCategory(e.target.value)}
      name="category"
      className="mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded"
    >
      <option value=''>Select category</option>
      {blogCategories.map((item,index)=>{
        return <option key={index} value={item}>{item}</option>
      })}
    </select>
    <div className="flex gap-2 mt-4">
      <p>Publish Now</p>
      <input className="scale-125 cursor-pointer" value={isPublished} onChange={(e)=>setIsPublished(e.target.checked)} type="checkbox" />
    </div>
    <button
      type="submit"
      className="mt-8 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm"
    >
      Add Blog
    </button>
  </div>
</form>

  )
}

export default AddBlog
