import {vs as cloudinary} from "cloudinary"
import fs from "fs"

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const uploadOnCloudinary = async (localFilePath) => {
        try {
            if(!localFilePath) return null
         const uploadResult = await cloudinary.uploader.upload(localFilePath,{
            resource_type : "auto"
         })
         console.log("file Uploaded Successfull", uploadResult.url);
         return uploadResult ;
        } catch (error) {
            fs.unlinkSync(localFilePath)  // remove the locally save temproary file as the upload opration got failed
            return null;
        }
        
    }

export {uploadOnCloudinary}