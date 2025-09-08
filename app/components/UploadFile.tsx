"use client" 

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { set } from "mongoose";
import { use, useRef, useState } from "react";

interface FileUploadProps {
    onSuccess?: (Response: any) => void;
    onProgress?: (progress:number) => void;
    fileType?: "image" | "video";
    
}

const FileUpload = ({onSuccess,onProgress,fileType}:FileUploadProps) => {

    const [uploading,setUploading] = useState<boolean>(false);
    const [error,setError] = useState<string| null>(null);

    //Optional validation
    const validateFile = (file:File)=>{
        if(fileType === "video"){
            if(!file.type.startsWith("video/")){
                setError("File is not a video");
        }

        if(file.size > 100 * 1024 *1024){
            setError("File size exceeds 100MB");
        }

        return true;
    }
    }
    const handleFileChange= async (e:React.ChangeEvent<HTMLInputElement>) =>{

        const file = e.target.files?.[0];

        if(!file || !validateFile(file)) return;
    
        setUploading(true);
        setError(null);

        try {
            const authRes = await fetch('/api/auth/imagekit-auth');
            const auth = await authRes.json();

            const uploadResponse = await upload({
                // Authentication parameters
                file,
                fileName: file.name, 
                expire: auth.expire,
                token:auth.token,
                signature:auth.signature,
                publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
                onProgress: (event) => {
                    if ( event.lengthComputable && onProgress) {
                        const percent = (event.loaded / event.total) * 100;
                        onProgress(Math.round(percent));
                        
                    }
                },
                
            });

            onSuccess?.(uploadResponse);

        } catch (error) {
            console.error("Upload error:", error);
        } finally{
            setUploading(false);
        }
    }


    return (
        <>
            <input type="file"
            accept={fileType === "video" ? "video/*" : "image/*"}
            onChange={handleFileChange}
            />
            {uploading && (<p>Uploading...</p>)}
        </>
    );
};

export default FileUpload;