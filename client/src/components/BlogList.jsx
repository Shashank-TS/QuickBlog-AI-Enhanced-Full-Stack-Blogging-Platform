import React, { useState } from "react";
import { blogCategories } from "../assets/assets";
import { motion } from "framer-motion"; 
import BlogCard from "./BlogCard"; 
import Loader from "./Spinner"; 
import { useBlogs } from "../context/BlogContext";

const BlogList = () => {
    const [menu, setMenu] = useState("All");
    
    const { blogs, loadingBlogs, error, refetchBlogs, searchQuery } = useBlogs();

    const filteredBlogs = blogs.filter((blog) => {
        const matchesCategory = menu === "All" ? true : blog.category === menu;
        
        const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (blog.content && blog.content.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    return (
        <div>
            {loadingBlogs ? (
                <Loader loading={loadingBlogs} spinnerSize="md" spinnerColor="text-purple-500" message="Loading your blogs..." />
            ) : error ? (
                <div className="text-red-600 text-center p-4">
                    <p>Error: {error}</p>
                    <button
                        onClick={refetchBlogs} 
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            ) : (
                <>
                    {/* Category selection menu */}
                    <div className="flex justify-center gap-4 sm:gap-8 my-10 relative">
                        {blogCategories.map((item) => (
                            <div key={item} className="relative">
                                <button
                                    onClick={() => setMenu(item)}
                                    className={`cursor-pointer text-gray-500 ${menu === item ? "text-white px-4 pt-0.5" : ""}`}
                                >
                                    {item}
                                    {menu === item && (
                                        <motion.div
                                            layoutId="underline"
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                            className="absolute left-0 right-0 top-0 h-7 -z-1 bg-primary rounded-full"
                                        ></motion.div>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                    {/* Display filtered blog cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40">
                        {/* Render filteredBlogs based on both category and search query */}
                        {filteredBlogs.map((blog) => (
                            <BlogCard key={blog.id} blog={blog}></BlogCard>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default BlogList;
