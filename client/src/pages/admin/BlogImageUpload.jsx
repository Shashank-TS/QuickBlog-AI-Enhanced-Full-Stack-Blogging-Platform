import React, { useState } from "react";
import { IKUpload } from "imagekitio-react";

const BlogImageUpload = ({ onUploadSuccess }) => {
  const [previewUrl, setPreviewUrl] = useState("");

  const publicKey=`${import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY}`;
  const urlEndpoint=`${import.meta.env.VITE_IMAGEKIT_URL}`;

  return (
    <div>
      <IKUpload
        publicKey={publicKey}
        urlEndpoint={urlEndpoint}
        authenticationEndpoint={`${import.meta.env.VITE_BACKEND_URL}/api/imagekit/auth`}
        onSuccess={(res) => {
          console.log("Upload success:", res);
          setPreviewUrl(res.url);
          onUploadSuccess(res.url); // Pass to parent 
        }}
        onError={(err) => console.error("Upload error:", err)}
      />
      {previewUrl && <img src={previewUrl} alt="preview" style={{ width: 300 }} />}
    </div>
  );
};

export default BlogImageUpload;
