import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { DepartmentUpdate } from "../models/departmentUpdate.models.js";
import { Post } from "../models/post.models.js";
import { sendReportRejectedEmail, sendReportResolvedEmail, sendReportStatusUpdateEmail } from "../utils/BrevoMailService.js";

// add new post
const newDeptUpdate = asyncHandler(async (req,res) => {
    // get the data
    const {postId, updatedStatus, remark, expectedResolutionDate, recipient_email, recipient_name, report_title} = req.body
    // get the user (only citizen and admin roles can create a post)
    const user = req.user
    // get the local File paths of the documents (pdf) (handled by multer)
    const localDocFiles= req.files

    if(!localDocFiles) throw new ApiError(500, "Error occurred while uploading pdf files")

    if(!mongoose.isValidObjectId(postId)) throw new ApiError("Invalid department ID")
    
    if(
        [postId, updatedStatus, remark].some(field => field === "") || !expectedResolutionDate
    ) throw new ApiError(400, "Insufficient data")

    console.log(localDocFiles)
    // upload the images to cloudinary
    let pdfUploadResponse;
    if(localDocFiles.docs) {
        pdfUploadResponse = await Promise.all(
            localDocFiles.docs.map(async (localPdf) => {
                const cloudinaryResponse = await uploadOnCloudinary(localPdf.path)
                return {
                    publicUrl: cloudinaryResponse.secure_url,
                    public_id: cloudinaryResponse.public_id
                }
            })
        )
    }

    if(!pdfUploadResponse) throw new ApiError(500, "An unexpected Error occurred while uploading pdf documents")

    // create a post
    const response = await DepartmentUpdate.create({
        userId: user._id,
        postId: postId,
        updatedStatus,
        expectedResolutionDate,
        remark,
        docs: pdfUploadResponse || null,
        recipient_email,
        recipient_name,
        report_title
    })

    // also update the status of the post
    await Post.findOneAndUpdate(
        {
            _id: postId
        },
        {
            status: updatedStatus
        }
    )

    if(!response) throw new ApiError(500, "An unexpected error occurred while making update")
    
    const document = await getDepartmentUpdateById(response._id)

    if(updatedStatus.toLowerCase() === "resolved") {
        await sendReportResolvedEmail(recipient_email, recipient_name,report_title, postId.toString())
    } else if(updatedStatus.toLowerCase() === "rejected") {
        await sendReportRejectedEmail(recipient_email, recipient_name,report_title,  postId.toString(), "Not allowed to disclose")
    } else{
        await sendReportStatusUpdateEmail(recipient_email, recipient_name, report_title,  postId.toString(), updatedStatus)
    }


    res
    .status(201)
    .json(
        new ApiResponse(201, document, "DepartmentUpdate added successfully")
    )
})

const getDepartmentUpdateById = async (id) => {

    const aggregate = [
        {
            $match: {
                _id: new mongoose.Types.ObjectId(id)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userDetails"
            }
        },
        {
            $project: {
                "userDetails._id": 0,
                "userDetails.createdAt": 0,
                "userDetails.updatedAt": 0,
                "userDetails.password": 0,
                "userDetails.refreshToken": 0,
            }
        }
    ]
    
    // create a post
    const response = await DepartmentUpdate.aggregate(aggregate)

    return response
}

// get department updates for post
const getDepartmentUpdatesOnPost = asyncHandler(async (req,res) => {
    // get the data
    const {postId} = req.query
    
    if(!mongoose.isValidObjectId(postId)) throw new ApiError("Invalid post ID")

    const aggregate = [
        {
            $match: {
                postId: new mongoose.Types.ObjectId(postId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userDetails"
            }
        },
        {
            $project: {
                "userDetails._id": 0,
                "userDetails.createdAt": 0,
                "userDetails.updatedAt": 0,
                "userDetails.password": 0,
                "userDetails.refreshToken": 0,
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ]
    
    // create a post
    const response = await DepartmentUpdate.aggregate(aggregate)

    if(!response) throw new ApiError(500, "An unexpected error occurred while making update")

    res
    .status(200)
    .json(
        new ApiResponse(200, response, "DepartmentUpdates fetched successfully")
    )
})

export {
    newDeptUpdate,
    getDepartmentUpdatesOnPost
}