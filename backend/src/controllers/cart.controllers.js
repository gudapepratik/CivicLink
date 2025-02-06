import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CartItem } from "../models/cartItem.models.js";
import { Product } from "../models/product.models.js";

const addProductToCart = asyncHandler(async (req,res) => {
    // get the product id
    const {productId,size} = req.body
    const customerId = req.user?._id

    // check the Product id if it is valid or not
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid Product ID' });
    }

    // check if the product is already added to wishlist by the user
    const cartItemExists = await CartItem.findOne({
        customerId: customerId,
        productId: productId
    })

    // if the product already exists in the cart then just increament the quantity of the product
    if(cartItemExists) {
        // update the quantity
        cartItemExists.quantity += 1 
        // save the changes
        await cartItemExists.save({validateBeforeSave: false})
        // get the updated cart doc
        const cartItem = await CartItem.findOne({
            customerId: customerId,
            productId: productId
        })

        return res
        .status(200)
        .json(
            new ApiResponse(200, cartItem, "Product Already exists in cart, Quantity updated")
        )
    }

    // else, create a new document in wishlist collection
    const cartItem = await CartItem.create({
        customerId,
        quantity: 1,
        productId,
        size: size || ""
    })

    if(!cartItem) throw new ApiError(500, "Error while adding to cart")

    return res
    .status(201)
    .json(
        new ApiResponse(201, cartItem, "Product is added to cart successfully")
    )
})

const removeProductFromCart = asyncHandler(async (req,res) => {
    // get the product id of the product to be removed from cart
    const {cartItemId} = req.body

    // check the Product id if it is valid or not
    if (!mongoose.Types.ObjectId.isValid(cartItemId)) {
        return res.status(400).json({ message: 'Invalid Cart Item ID' });
    }

    // check if the product exists or not for the user in the cart
    const isRemoved = await CartItem.findOneAndDelete({
        _id: cartItemId
    })

    if(!isRemoved) throw new ApiError(404, "Product does not exists in cart")

    return res
    .status(201)
    .json(
        new ApiResponse(201, {}, "Product is successfully removed from cart")
    )
})

const getCartProducts = asyncHandler(async (req,res) => {
    // get the user id of the customer
    const userId = req?.user._id

    // fetch all the wishlist documents by userId
    const cartItems = await CartItem.find({
        customerId: userId
    })

    if(!cartItems || cartItems.length === 0) throw new ApiError(400, "No items in cart")
    
    // get the product details for each item in wihlist
    const productDetails = await Promise.all(
        cartItems.map(async (item) => {
            const product = await Product.findById(item.productId)
            return {
                productDetails: product,
                cartItemId: item._id,
                quantity: item.quantity,
                size: item.size
            }
        })
    )

    if(!productDetails) throw new ApiError(400, "Failed to fetch products")
    
    return res
    .status(201)
    .json(
        new ApiResponse(201, productDetails, "Products are fetched from cart successfully")
    )
})

const changeProductQuantity = asyncHandler(async (req,res) => {
    // get the new quantity and the product id
    const {productId, quantity} = req.body
    // get the user id
    console.log('asf')
    const userId = req.user?._id
    // validate the product id and quantity
    if (!mongoose.Types.ObjectId.isValid(productId)) throw new ApiError(400, "Invalid Product ID")

    if(!quantity || quantity < 0) throw new ApiError(400, "quantity must be greater than 0")

    // update the quantity of product in cartItem collection
    const cartItem = await CartItem.findOneAndUpdate(
        {
            customerId: userId,
            productId: productId
        },
        {
            quantity: quantity
        }
    )

    if(!cartItem) throw new ApiError(200, "Product does not exists in cart")

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "quantity has been successfully updated for cart item")
    )
})
const changeProductSize = asyncHandler(async (req,res) => {
    // get the new quantity and the product id
    const {productId, size} = req.body
    // get the user id
    const userId = req.user?._id
    // validate the product id and quantity
    if (!mongoose.Types.ObjectId.isValid(productId)) throw new ApiError(400, "Invalid Product ID")

    if(!size || size === "") throw new ApiError(400, "Valid size is required")

    // update the quantity of product in cartItem collection
    const cartItem = await CartItem.findOneAndUpdate(
        {
            customerId: userId,
            productId: productId
        },
        {
            size: size
        }
    )
    console.log(CartItem)

    if(!cartItem) throw new ApiError(200, "Product does not exists in cart")

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Size has been successfully updated for cart item")
    )
})


export {
    addProductToCart,
    removeProductFromCart,
    getCartProducts,
    changeProductQuantity,
    changeProductSize
}