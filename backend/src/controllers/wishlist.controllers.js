import mongoose from "mongoose";
import { Wishlist } from "../models/wishlist.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.models.js";


const addProductToWishlist = asyncHandler(async (req,res) => {
    // get the product id
    const {productId} = req.body
    const customerId = req.user?._id

    // check the Product id if it is valid or not
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid Product ID' });
    }

    // check if the product is already added to wishlist by the user
    const isAlreadyExists = await Wishlist.findOne({
        customerId: customerId,
        productId: productId
    })

    if(isAlreadyExists) throw new ApiError(404, "Product is already exists in wishlist")

    // create a new document in wishlist collection
    const newWishlist = await Wishlist.create({
        customerId,
        productId
    })

    if(!newWishlist) throw new ApiError(500, "Error while adding to wishlist")

    return res
    .status(201)
    .json(
        new ApiResponse(201, newWishlist, "Product is added to wishlist successfully")
    )
})

const removeProductFromWishlist = asyncHandler(async (req,res) => {
    // get the product id of the product to be removed from wishlist
    const {productId} = req.body
    const customerId = req.user?._id

    // check the Product id if it is valid or not
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid Product ID' });
    }

    // check if the product exists or not for the user 
    const isRemoved = await Wishlist.findOneAndDelete({
        customerId: customerId,
        productId: productId
    })

    if(!isRemoved) throw new ApiError(404, "Product does not exists in wishlist")

    return res
    .status(201)
    .json(
        new ApiResponse(201, {}, "Product is successfully removed from wishlist")
    )
})

const getWishListProducts = asyncHandler(async (req,res) => {
    // get the user id of the customer
    const userId = req?.user._id

    // fetch all the wishlist documents by userId
    const wishlists = await Wishlist.find({
        customerId: userId
    })

    if(!wishlists || wishlists.length === 0) throw new ApiError(400, "No items in wishlist")
    
    // get the product details for each item in wihlist
    const productDetails = await Promise.all(
        wishlists.map(async (wishlist) => {
            const product = await Product.findById(wishlist.productId)
            return {
                productDetails: product,
                wishlistId: wishlist._id
            }
        })
    )

    if(!productDetails) throw new ApiError(400, "Failed to fetch products")
    
    return res
    .status(201)
    .json(
        new ApiResponse(201, productDetails, "Products are fethced from cart wishlist successfully")
    )
})


export {
    addProductToWishlist,
    removeProductFromWishlist,
    getWishListProducts,
}