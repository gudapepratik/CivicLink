import mongoose from 'mongoose'
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from '../models/comment.models.js';

// add comment to a post
const addComment = asyncHandler(async (req,res) => {
    // get the data
    const {postId, comment} = req.body
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
        comment
    })

    if(!newComment) throw new ApiError(500, "error while adding a Comment")

    return res
    .status(201)
    .json(
        new ApiResponse(201, newComment, "Comment added to the Post successfully")
    )
})

// get all the comments done by the user to posts
const getCommentsByUser= asyncHandler(async (req,res) => {
    // get the user
    const user = req.user

    // get all the Comments added by the current user (customer/admin)
    const comments = await Comment.find({
        userId: user._id
    })

    if(!comments) throw new ApiError(400, "No Comments addded by the customer")

    return res
    .status(200)
    .json(
        new ApiResponse(200,comments, "All Comments by the user fetched successfully")
    )
})

// get all the comments for a post
const getPostComments = asyncHandler(async (req,res) => {
    // get the Post id
    const postId = req.params.postId

    // get all the Comments done for the Post
    const postComments = await Comment.find({
        postId
    })

    if(!postComments || postComments.length == 0) throw new ApiError(400, "No comments to the post")

    return res
    .status(200)
    .json(
        new ApiResponse(200, postComments, "Post Comments fetched successfully")
    )
})

// remove a comment from a post by the user
const removePostComment = asyncHandler(async (req,res) => {
    // get the id of the Comment to be removed
    const commentId = req.params.commentId
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

