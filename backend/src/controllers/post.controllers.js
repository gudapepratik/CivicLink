import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/Cloudinary.js";
import { Post } from "../models/post.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.models.js";

// add new post
const addNewPost = asyncHandler(async (req, res) => {
  // get the data
  const { departmentId, title, description, latitude, longitude, address } =
    req.body;
  // get the user (only citizen and admin roles can create a post)
  const user = req.user;
  // get the local File paths of the images (handled by multer)
  const localImageFiles = req.files;

  if (!localImageFiles)
    throw new ApiError(500, "Error occurred while uploading images");

  if (!mongoose.isValidObjectId(departmentId))
    throw new ApiError("Invalid department ID");

  if (
    [title, description, address].some((field) => field === "") ||
    !latitude ||
    !longitude
  )
    throw new ApiError(400, "Insufficient data");
  console.log(localImageFiles);
  // upload the images to cloudinary
  const imageUploadResponse = await Promise.all(
    localImageFiles.images.map(async (localImage) => {
      const cloudinaryResponse = await uploadOnCloudinary(localImage.path);
      return {
        publicUrl: cloudinaryResponse.secure_url,
        public_id: cloudinaryResponse.public_id,
      };
    })
  );

  if (!imageUploadResponse)
    throw new ApiError(
      500,
      "An unexpected Error occurred while uploading images"
    );

  // create a post
  const response = await Post.create({
    userId: user._id,
    title,
    description,
    departmentId,
    location: {
      type: "Point",
      coordinates: [latitude, longitude],
    },
    status: "pending",
    imageUrls: imageUploadResponse,
    address,
  });

  if (!response)
    throw new ApiError(
      500,
      "An unexpected error occurred while creating a post"
    );

  res
    .status(201)
    .json(new ApiResponse(201, response, "Post added successfully"));
});

// get all posts (by location)
const getPostsByLocation = asyncHandler(async (req, res) => {
  // get the location coordinates
  const { latitude, longitude, status, distance, category, sortBy, approvalStatus, isAdminFetch } = req.query;
  // set search readius (30km from target location)
  const searchRadius = Number(distance) * 1000 || 30 * 1000; // 30km radius
  // aggregate pipeline (perform pagination in future)
  // get all posts near 30km radius of target location

  let sort = {
    field: "distance",
    sortIn: 1,
  };

  if (sortBy === "recent") {
    sort = { field: "createdAt", sortIn: -1 }; // Newest first
  } else if (sortBy === "oldestfirst") {
    sort = { field: "createdAt", sortIn: 1 }; // Oldest first
  } else if (sortBy === "mostupvoted") {
    sort = { field: "upvoteCount", sortIn: -1 }; // Most upvoted first
  } else if (sortBy === "mostcommented") {
    sort = { field: "commentCount", sortIn: -1 }; // Most commented first
  }

  let approvalConditions = [];
  if (approvalStatus.includes("pending")) {
    approvalConditions.push({ isApproved: false, approvedBy: null, rejectedBy: null });
  }
  if (approvalStatus.includes("approved")) {
    approvalConditions.push({ isApproved: true, approvedBy: { $ne: null } });
  }
  if (approvalStatus.includes("rejected")) {
    approvalConditions.push({ isApproved: false, rejectedBy: { $ne: null } });
  }

  let aggregate = [];

  aggregate.push({
    $geoNear: {
      near: {
        type: "Point",
        coordinates: [Number(latitude), Number(longitude)],
      },
      distanceField: "distance",
      maxDistance: searchRadius,
      spherical: true,
    },
  });

  if (status && status[0] !== "all") {
    aggregate.push({
      $match: {
        status: {
          $in: status,
        },
      },
    });
  }


  aggregate.push(
    {
      $match: {
        ...(isAdminFetch === "false" && { isApproved: true }), // If not admin, only approved posts
        ...(isAdminFetch === "true" && approvalConditions.length > 0 && { $or: approvalConditions })
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $lookup: {
        from: "departments",
        localField: "departmentId",
        foreignField: "_id",
        as: "departmentDetails",
      },
    },
    {
      $lookup: {
        from: "upvotes",
        localField: "_id",
        foreignField: "postId",
        as: "upvotes",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "postId",
        as: "comments",
      },
    },
    {
      $addFields: {
        upvoteCount: { $size: "$upvotes" }, // Count upvotes
        commentCount: { $size: "$comments" }, // Count comments
      },
    },
    {
      // Sort by nearest first
      $sort: { [sort.field]: sort.sortIn },
    },
    {
      $project: {
        upvotes: 0, // Exclude upvotes array (we dont want that)
        comments: 0, // Exclude comments array (we dont want that)
        "departmentDetails._id": 0,
        "departmentDetails.mission": 0,
        "departmentDetails.description": 0,
        "departmentDetails.responsibilities": 0,
        "departmentDetails.services": 0,
        "departmentDetails.commonIssues": 0,
        "departmentDetails.heroImage": 0,
        "departmentDetails.logo": 0,
        "departmentDetails.hours": 0,
        "departmentDetails.createdAt": 0,
        "departmentDetails.updatedAt": 0,
        "userDetails._id": 0,
        "userDetails.createdAt": 0,
        "userDetails.updatedAt": 0,
        "userDetails.password": 0,
        "userDetails.refreshToken": 0,
      },
    }
  );

  const posts = await Post.aggregate(aggregate);
  if (!posts) throw new ApiError(500, "Error occurred while fetching posts");

  res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts fethced successfully"));
});

// get all posts by user
const getPostsByUser = asyncHandler(async (req, res) => {
  const { filter } = req.query;
  // get the user
  const user = req.user;

  // const posts = await Post.find({
  //     userId: user._id
  // }).populate("departmentId", "name description address");
  const aggregate = [
    {
      $match: {
        userId: new mongoose.Types.ObjectId(user._id),
        ...(filter && { status: filter }),
      },
    },
    {
      $lookup: {
        from: "departments",
        localField: "departmentId",
        foreignField: "_id",
        as: "departmentDetails",
      },
    },
    {
      $lookup: {
        from: "upvotes",
        localField: "_id",
        foreignField: "postId",
        as: "upvotes",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "postId",
        as: "comments",
      },
    },
    {
      $addFields: {
        upvoteCount: { $size: "$upvotes" }, // Count upvotes
        commentCount: { $size: "$comments" }, // Count comments
        isUserVoted: {
          $cond: {
            if: { $gt: [{ $ifNull: [user.id, null] }, null] },
            then: { $in: [user.id, "$upvotes"] },
            else: "$$REMOVE",
          },
        },
        userDetails: [
          {
            name: user.name,
            avatar: {
              publicUrl: user.avatar.publicUrl,
            },
            email: user.email,
          },
        ],
      },
    },
    {
      $project: {
        upvotes: 0, // Exclude upvotes array (we dont want that)
        comments: 0, // Exclude comments array (we dont want that)
        "departmentDetails._id": 0,
        "departmentDetails.createdAt": 0,
        "departmentDetails.updatedAt": 0,
        "departmentDetails.authorityUsers": 0,
      },
    },
    {
      // Sort by date
      $sort: { createdAt: -1 },
    },
  ];

  const posts = await Post.aggregate(aggregate);

  if (!posts)
    throw new ApiError(500, "Unexpected error occurred while fetching posts");

  res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts fethced successfully"));
});

// get posts by department (anyone can access)
const getPostsByDepartment = asyncHandler(async (req, res) => {
  const { departmentId, latitude, longitude, status, distance, category, sortBy, approvalStatus, isAdminFetch  } = req.query;

  if (!mongoose.isValidObjectId(departmentId))
    throw new ApiError(400, "The departmentId is Invalid");

  let sort = {
    field: "distance",
    sortIn: 1,
  };

  if (sortBy === "recent") {
    sort = { field: "createdAt", sortIn: -1 }; // Newest first
  } else if (sortBy === "oldestfirst") {
    sort = { field: "createdAt", sortIn: 1 }; // Oldest first
  } else if (sortBy === "mostupvoted") {
    sort = { field: "upvoteCount", sortIn: -1 }; // Most upvoted first
  } else if (sortBy === "mostcommented") {
    sort = { field: "commentCount", sortIn: -1 }; // Most commented first
  }

  console.log(isAdminFetch, approvalStatus)

  // const posts = await Post.find({
  //     departmentId
  // }).populate("userId", "avatar name email"); // not finalized
  const searchRadius = Number(distance) * 1000 || 30 * 1000; // 30 km

  const aggregate = [];

  aggregate.push({
    $geoNear: {
      near: {
        type: "Point",
        coordinates: [Number(latitude), Number(longitude)],
      },
      distanceField: "distance",
      maxDistance: searchRadius,
      spherical: true,
    },
  });

  if (status && status[0] !== "all") {
    aggregate.push({
      $match: {
        status: {
          $in: status,
        },
      },
    });
  }

  aggregate.push(
    {
      $match: {
        departmentId: new mongoose.Types.ObjectId(departmentId),
        ...(isAdminFetch
          ? {
              $or: [
                approvalStatus.includes("pending") ? { isApproved: false, approvedBy: null, rejectedBy: null } : null,
                approvalStatus.includes("approved") ? { isApproved: true, approvedBy: { $ne: null } } : null,
                approvalStatus.includes("rejected") ? { isApproved: false, rejectedBy: { $ne: null } } : null,
              ].filter(Boolean),
            }
          : { isApproved: true } // If not admin, show only approved reports
        ),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $lookup: {
        from: "departments",
        localField: "departmentId",
        foreignField: "_id",
        as: "departmentDetails",
      },
    },
    {
      $lookup: {
        from: "upvotes",
        localField: "_id",
        foreignField: "postId",
        as: "upvotes",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "postId",
        as: "comments",
      },
    },
    {
      $addFields: {
        upvoteCount: { $size: "$upvotes" }, // Count upvotes
        commentCount: { $size: "$comments" }, // Count comments
      },
    },
    {
      // Sort by nearest first
      $sort: { [sort.field]: sort.sortIn },
    },
    {
      $project: {
        upvotes: 0, // Exclude upvotes array (we dont want that)
        comments: 0, // Exclude comments array (we dont want that)
        "departmentDetails.authorityUsers": 0,
        "departmentDetails._id": 0,
        "departmentDetails.mission": 0,
        "departmentDetails.description": 0,
        "departmentDetails.responsibilities": 0,
        "departmentDetails.services": 0,
        "departmentDetails.commonIssues": 0,
        "departmentDetails.heroImage": 0,
        "departmentDetails.logo": 0,
        "departmentDetails.hours": 0,
        "departmentDetails.createdAt": 0,
        "departmentDetails.updatedAt": 0,
        "userDetails._id": 0,
        "userDetails.createdAt": 0,
        "userDetails.updatedAt": 0,
        "userDetails.password": 0,
        "userDetails.refreshToken": 0,
      },
    }
  );

  const posts = await Post.aggregate(aggregate);

  if (!posts)
    throw new ApiError(500, "Unexpected error occurred while fetching posts");

  res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts fethced successfully"));
});

// get a post by id
const getPostById = asyncHandler(async (req, res) => {
  // get the id
  const { postId, userId } = req.query;

  // aggregation
  const aggregate = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(postId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $lookup: {
        from: "departments",
        localField: "departmentId",
        foreignField: "_id",
        as: "departmentDetails",
      },
    },
    {
      $lookup: {
        from: "upvotes",
        localField: "_id",
        foreignField: "postId",
        as: "upvotes",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "postId",
        as: "comments",
      },
    },
    {
      $addFields: {
        upvoteCount: { $size: "$upvotes" }, // Count upvotes
        commentCount: { $size: "$comments" }, // Count comments
        isUserVoted: {
          $cond: {
            if: { $gt: [{ $ifNull: [userId, null] }, null] },
            then: {
              $in: [new mongoose.Types.ObjectId(userId), "$upvotes.userId"],
            },
            else: "$$REMOVE",
          },
        },
      },
    },
    {
      $project: {
        upvotes: 0, // Exclude upvotes array (we dont want that)
        comments: 0, // Exclude comments array (we dont want that)
        "departmentDetails._id": 0,
        "departmentDetails.createdAt": 0,
        "departmentDetails.updatedAt": 0,
        "departmentDetails.authorityUsers": 0,
        "userDetails._id": 0,
        "userDetails.createdAt": 0,
        "userDetails.updatedAt": 0,
        "userDetails.password": 0,
        "userDetails.refreshToken": 0,
      },
    },
  ];

  if (!mongoose.isValidObjectId(postId)) throw new Error("Invalid Post Id");

  // fetch the document
  const response = await Post.aggregate(aggregate);

  res
    .status(200)
    .json(new ApiResponse(200, response, "Post fetched successfully"));
});

// remove a post (only admin, citizen can access)
const deletePost = asyncHandler(async (req, res) => {
  // get the post document id
  const { postId } = req.query;
  // get the user
  const user = req.user;
  console.log(postId);

  if (!mongoose.isValidObjectId(postId))
    throw new ApiError(400, "The post Id is Invalid");

  // get the post details
  const postToDelete = await Post.findOne({
    _id: postId,
  });

  if (!postToDelete) throw new ApiError(400, "The post does not exists");

  // check if the post is made by the same user that is deleting it
  if (
    user.role === "citizen" &&
    user._id.toString() !== postToDelete.userId.toString()
  )
    throw new ApiError(400, "Current user is unauthorized to delete the post");

  // delete the images from cloudinary
  const cloudinaryDeleteResponse = await Promise.all(
    postToDelete.imageUrls.map(async (image) => {
      return await deleteFromCloudinary(image.public_id);
    })
  );

  if (!cloudinaryDeleteResponse)
    throw new ApiError(
      500,
      "An unexpected error occurred while deleting images from cloudinary"
    );

  // if images deleted then delete the post
  const deleteReponse = await Post.findOneAndDelete({
    _id: postId,
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        deleteReponse,
        "The post has been deleted successfully"
      )
    );
});

// the user to whom which the current post belongs can update the status of their posts (newstatus, comment (what improvements done))
// authorities can also update the status of any posts under their department (newstatus, comment (what did they improved))
// admins can also update the status (newstatus)
// update post status (admin, authority, citizen)
const updatePostStatus = asyncHandler(async (req, res) => {
  // get the new status and message
  const { postId, updatedStatus, comment } = req.body;
  // get user details
  const user = req.user;

  if (!mongoose.isValidObjectId(postId))
    throw new ApiError(400, "Post id is Invalid");
  if (!updatedStatus || !comment) throw new ApiError(400, "Insufficient data");

  // get the post details
  const postToUpdate = await Post.findOne({
    _id: postId,
  });

  if (!postToUpdate)
    throw new ApiError(
      500,
      "Unexprected error occurred while fetching post details"
    );

  // check if the user role is citizen and user id's matches or not
  if (user.role === "citizen" && postToUpdate.userId !== user._id)
    throw new ApiError(
      400,
      "User is not authorized to update status of current post"
    );

  // check if the user role is authority and post is under their department or not
  if (
    user.role === "authority" &&
    postToUpdate.departmentId !== user.departmentId
  )
    throw new ApiError(
      400,
      "Current Post does not belong under your department"
    );

  // admin can update any post (no issues with them)

  // create a new comment for the post
  const newComment = await Comment.create({
    userId: user._id,
    postId,
    comment,
  });

  if (!newComment)
    throw new ApiError(500, "An error occurred while updating post");

  // update the status of the post
  const updateResponse = await Post.findOneAndUpdate(
    {
      _id: postId,
    },
    {
      status: updatedStatus.toLowerCase(),
    },
    { new: true, runValidators: true }
  );

  res
    .status(200)
    .json(
      new ApiResponse(200, updateResponse, "Post status updated successfully")
    );
});

export {
  addNewPost,
  getPostsByLocation,
  getPostsByUser,
  getPostsByDepartment,
  getPostById,
  deletePost,
  updatePostStatus,
};

// refer this for pagination
// const options = {
//         page,
//         limit,
//         customLabels: {
//             totalDocs: 'totalItems',
//             docs: 'OrderItems',
//             limit: 'pageSize',
//             totalPages: 'pageCount',
//             page: 'currentPage',
//             pagingCounter: 'itemStart',
//             hasPrevPage: 'prevExists',
//             hasNextPage: 'nextExists',
//             prevPage: 'previousPage',
//             nextPage: 'nextPage'
//         }
//     }

// const orderItems = await OrderItem.aggregatePaginate(aggregatePipeline,options)
