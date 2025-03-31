import mongoose from 'mongoose'
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from '../models/comment.models.js';
import { sendReportRejectedEmail, sendReportVerifiedEmail } from '../utils/BrevoMailService.js';
import { Post } from '../models/post.models.js';

// add comment to a post
const ApproveReport = asyncHandler(async (req, res) => {
    // Get the report ID from request body
    const { postId, recipient_email, recipient_name } = req.body;
    const user = req.user; // Admin approving the report

    // Validate post ID
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new ApiError(400, "Invalid Post ID");
    }

    const postIdObj = new mongoose.Types.ObjectId(String(postId));

    // Find and update the post to set it as approved
    const updatedPost = await Post.findByIdAndUpdate(
        postIdObj,
        { isApproved: true, approvedBy: user._id },
        { new: true }
    );

    if (!updatedPost) throw new ApiError(404, "Post not found or could not be approved");

    // Send email notification to the user who created the report (optional)
    await sendReportVerifiedEmail(recipient_email, recipient_name, updatedPost.title, updatedPost._id.toString());

    return res.status(200).json(
        new ApiResponse(200, updatedPost, "Report approved successfully")
    );
});

const RejectReport = asyncHandler(async (req, res) => {
    // Get the report ID and rejection reason (optional)
    const { postId,recipient_email,recipient_name, rejectionReason } = req.body;
    const user = req.user; // Admin rejecting the report

    // Validate post ID
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new ApiError(400, "Invalid Post ID");
    }

    const postIdObj = new mongoose.Types.ObjectId(String(postId));

    // Find and update the post to set it as rejected
    const updatedPost = await Post.findByIdAndUpdate(
        postIdObj,
        { status: "rejected", isApproved: false, rejectedBy: user._id},
        { new: true }
    );

    if (!updatedPost) throw new ApiError(404, "Post not found or could not be rejected");

    // Send email notification to the user who created the report (optional)
    await sendReportRejectedEmail(recipient_email, recipient_name, updatedPost.title, updatedPost._id, rejectionReason);

    return res.status(200).json(
        new ApiResponse(200, updatedPost, "Report rejected successfully")
    );
});

export {
    ApproveReport,
    RejectReport
}