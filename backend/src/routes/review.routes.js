import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/authRole.middleware.js";
import { addReview, getProductReviews, getReviewsByCustomer, removeProductReview } from "../controllers/review.controllers.js";

const reviewRouter = Router()

// add review to the product (customer or admin)
reviewRouter.route('/add-review').post(
    verifyJWT,
    authorizeRole('customer','admin'),
    addReview
)

// get all reviews by the customer
reviewRouter.route('/get-reviews-by-customer').get(
    verifyJWT,
    authorizeRole('customer','admin'),
    getReviewsByCustomer
)

// get all the product reviews , not a protected route
reviewRouter.route('/get-product-reviews/:productId').get(
    verifyJWT,
    getProductReviews
)

// get all the product reviews , not a protected route
reviewRouter.route('/remove-product-review/:reviewId').delete(
    verifyJWT,
    authorizeRole('customer','admin'),
    removeProductReview
)


export default reviewRouter