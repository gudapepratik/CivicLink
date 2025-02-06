import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
import { asyncHandler } from './asyncHandler.js'
import { ApiError } from './ApiError.js'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    api_key: process.env.CLOUDINARY_API_KEY 
})


const uploadOnCloudinary = async (localFilePath) => {
    try {
        // verify the file path
        if(!localFilePath) throw new ApiError(500, "invalid Local path while uploading to cloudinary")
        
        // upload the file
        const uploadDetailsResponse = await cloudinary.uploader.upload(localFilePath, {
            folder: 'UrbanStore Storage',
            resource_type: 'auto'
        })

        // delete the local stored file after uploading 
        fs.unlinkSync(localFilePath)
        
        // return the response
        return uploadDetailsResponse

    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null
    }
}

const deleteFromCloudinary = async (public_id) => {
    // check if the public_id is valid or not
    if(!public_id) throw new ApiError(500, "Invalid public_id while deleting asset from cloudinary")

    // delete the file from cloudinary using 
    const response = await cloudinary.uploader.destroy(public_id,{
        resource_type: 'image'
    })

    return response
}

export {
    uploadOnCloudinary,
    deleteFromCloudinary
}