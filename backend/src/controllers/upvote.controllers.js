import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Upvote } from "../models/upvote.models.js";

// make upvote to a post
const addUpvoteToPost = asyncHandler(async (req,res) => {
    // get the post id
    const {postId} = req.body
    const userId = req.user?._id

    // check the Post id if it is valid or not
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: 'Invalid Post ID' });
    }

    // check if the upvote is already added by user
    const isAlreadyExists = await Upvote.findOne({
        postId,
        userId
    })

    if(isAlreadyExists) throw new ApiError(400, "Upvote for the post already present")

    // create a new document in upvote collection
    const newUpvote = await Upvote.create({
        postId,
        userId
    })

    if(!newUpvote) throw new ApiError(500, "Error while making upvote")

    return res
    .status(201)
    .json(
        new ApiResponse(201, newUpvote, "Upvote is successfully added to the post")
    )
})

// remove upvote from a post
const removeUpvoteFromPost = asyncHandler(async (req,res) => {
    // get the Post id of the Post to be removed from Upvote
    const {postId} = req.query
    const userId = req.user?._id

    // check the Post id if it is valid or not
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: 'Invalid Post ID' });
    }

    // check if the Post exists or not for the user 
    const isRemoved = await Upvote.findOneAndDelete({
        postId,
        userId
    })

    if(!isRemoved) throw new ApiError(400, "Upvote does not exists for the post")

    return res
    .status(201)
    .json(
        new ApiResponse(201, {}, "Upvote is removed from the post successfully")
    )
})

// get upvote count for a post
const getUpvoteCount = asyncHandler(async (req,res) => {
    // get the user id of the customer
    const {postId} = req.params

    
    // fetch all the wishlist documents by userId
    const upvoteCount = await Upvote.countDocuments({postId})
    
    return res
    .status(200)
    .json(
        new ApiResponse(200, upvoteCount, "upvote count for post fetched successfully")
    )
})


export {
    addUpvoteToPost,
    removeUpvoteFromPost,
    getUpvoteCount
}