import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreateAccountPrompt = () => {
  const navigate=useNavigate();

  return (
    <div className="mx-8 sm:mx-16 xl:mx-24 my-16 text-center">
      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700 mb-6">
        Ready to Share Your Story?
      </h2>
      <p className="max-w-2xl mx-auto text-gray-500 mb-8">
        Join our community of bloggers and start publishing your thoughts today.
        It's quick, easy, and completely free!
      </p>
      <button
        onClick={()=>navigate("/login")}
        className="bg-primary text-white px-8 py-3 rounded-full text-base font-medium
                   hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer
                   shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-75"
      >
        Create Your Account
      </button>
    </div>
  );
};

export default CreateAccountPrompt;
