import mongoose from 'mongoose'
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from '../models/comment.models.js';
import { sendNewCommentEmail } from '../utils/BrevoMailService.js';

// add comment to a post
const addComment = asyncHandler(async (req,res) => {
    // get the data
    const {postId, comment, isDepartmentUpdate, recipient_email, recipient_name, report_title} = req.body
    // get the user id
    const user = req.user

    // check if ids are valid or not
    if (!mongoose.Types.ObjectId.isValid(postId)) throw new ApiError(400, "Invalid Post ID")
    
    const postIdObj = new mongoose.Types.ObjectId(String(postId))

    if(comment === "") throw new ApiError(400, "Insufficient data to add comment")

    // create new document (Note:- a user can add more that one comments to a single post)
    const newComment = await Comment.create({
        userId: user._id,
        postId: postIdObj,
        comment,
        isDepartmentUpdate
    })

    if(!newComment) throw new ApiError(500, "error while adding a Comment")

    const document = await getCommentById(newComment._id)

    await sendNewCommentEmail(recipient_email, recipient_name, report_title, postId.toString(),user.name)

    return res
    .status(201)
    .json(
        new ApiResponse(201,document, "Comment added to the Post successfully")
    )
})

const getCommentById = async (id) => {

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
    const response = await Comment.aggregate(aggregate)

    return response
}

// get all the comments done by the user to posts
const getCommentsByUser= asyncHandler(async (req,res) => {
    // get the user
    const user = req.user

    // get all the Comments added by the current user (customer/admin)
    const comments = await Comment.find({
        userId: user._id
    })

    if(!comments) throw new ApiError(400, "Error occurred while fetching comments!!")

    return res
    .status(200)
    .json(
        new ApiResponse(200,comments, "All Comments by the user fetched successfully")
    )
})

// get all the comments for a post
const getPostComments = asyncHandler(async (req,res) => {
    // get the Post id
    const {postId} = req.query
    if(!mongoose.isValidObjectId(postId)) throw new ApiError(400, "Invalid post id")
    
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
        }
    ]

    // get all the Comments done for the Post
    const postComments = await Comment.aggregate(aggregate)

    if(!postComments) throw new ApiError(400, "Error while fetching comments")

    return res
    .status(200)
    .json(
        new ApiResponse(200, postComments, "Post Comments fetched successfully")
    )
})

// remove a comment from a post by the user
const removePostComment = asyncHandler(async (req,res) => {
    // get the id of the Comment to be removed
    const {commentId} = req.query
    const user = req.user

    if (!mongoose.Types.ObjectId.isValid(commentId)) throw new ApiError(400, "Invalid Comment ID")
    
    let removeResponse;
    // user with admin role can delete any comments from any posts
    if(user.role === 'admin') {
        removeResponse = await Comment.deleteOne({
            _id: commentId,
        })
    } else{
        // even if there are multiple comments for a same post, the comments are differentiated using thei unique id
        removeResponse = await Comment.deleteOne({
            _id: commentId,
            userId: user._id
        })
    }
    
    if(removeResponse.deletedCount === 0) throw new ApiError(500, "Error while removing the Comment")
    
    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Comment for the Post successfully deleted")
    )
})

export {
    addComment,
    getCommentsByUser,
    getPostComments,
    removePostComment
}

