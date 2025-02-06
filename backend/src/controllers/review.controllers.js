import mongoose from 'mongoose'
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { OrderItem } from "../models/orderItem.models.js";
import { Review } from "../models/review.models.js";

const addReview = asyncHandler(async (req,res) => {
    // get the data
    const {productId, comment, rating} = req.body
    // get the user id
    const user = req.user

    if (!mongoose.Types.ObjectId.isValid(productId)) throw new ApiError(400, "Invalid Product ID")
    const productIdObj = new mongoose.Types.ObjectId(String(productId))

    if(!comment || !rating) throw new ApiError(400, "Insufficient data to add reivew")

    if(user.role === 'admin') {
        // create new document directly
        const review = await Review.create({
            customerId: user._id,
            productId,
            comment,
            rating
        })

        if(!review) throw new ApiError(500, "error while adding review")

        return res
        .status(201)
        .json(
            new ApiResponse(201, review, "Review added to the product successfully")
        )
    }

    // aggregation pipeline that calculates no. of orderItems containing current product and their state is delivered
    // then only user will be authorized to add an review for the product
    console.log(productId)
    const aggregatePipeline =  [
        {
            $match: {
                customerId: user._id,
                productId: productIdObj,
                state: 'delivered'
            }
        },
        {
            $count: 'count'
        }
    ]

    const response = await OrderItem.aggregate(aggregatePipeline)
    console.log(response)
    if(response.length === 0 || response[0].count === 0) throw new ApiError(400, "Current user has not placed any orders for the product")

    // create new document
    const review = await Review.create({
        customerId: user._id,
        productId,
        comment,
        rating
    })

    if(!review) throw new ApiError(500, "error while adding review")

    return res
    .status(201)
    .json(
        new ApiResponse(201, review, "Review added to the product successfully")
    )
})


const getReviewsByCustomer = asyncHandler(async (req,res) => {
    // get the user
    const user = req.user

    // get all the reviews added by the current user (customer/admin)
    const reviews = await Review.find({
        customerId: user._id
    })

    if(!reviews) throw new ApiError(400, "No reviews addded by the customer")

    return res
    .status(200)
    .json(
        new ApiResponse(200, reviews, "All reviews by the user fetched successfully")
    )
})

const getProductReviews = asyncHandler(async (req,res) => {
    // get the product id
    const productId = req.params.productId

    // get all the reviews done for the product
    const productReviews = await Review.find({
        productId
    })

    if(!productReviews || productReviews.length == 0) throw new ApiError(400, "No product review till now")

    return res
    .status(200)
    .json(
        new ApiResponse(200, productReviews, "Product reviews fetched successfully")
    )
})

const removeProductReview = asyncHandler(async (req,res) => {
    // get the id of the review to be removed
    const reviewId = req.params.reviewId
    const user = req.user

    if (!mongoose.Types.ObjectId.isValid(reviewId)) throw new ApiError(400, "Invalid Product ID")
    
    let removeResponse;
    if(user.role === 'admin') {
        removeResponse = await Review.deleteOne({
            _id: reviewId,
        })
    } else{
        removeResponse = await Review.deleteOne({
            _id: reviewId,
            customerId: user._id
        })
    }
    
    if(removeResponse.deletedCount === 0) throw new ApiError(500, "Error while removing the review")
    
    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Review for the product successfully deleted")
    )
})

export {
    addReview,
    getReviewsByCustomer,
    getProductReviews,
    removeProductReview
}

