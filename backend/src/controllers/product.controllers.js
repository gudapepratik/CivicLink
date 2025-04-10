import {Product} from "../models/product.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/Cloudinary.js";
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'
import mongoose from "mongoose";

const addNewProduct = asyncHandler(async (req,res) => {
    // get neccesary data
    const {name,brand, price, stockInfo, category, description} = req.body
    // the images are available in req.files
    const localImages = req.files.images
    const user = req.user

    // check if everything is available
    if(
        [name,price,brand,category, description].some((field) => field === '')
    ) {
        throw new ApiError(400, "All fields are required")
    }
    // console.log(stockInfo)

    if(stockInfo.length === 0) throw new ApiError(400, "Stock Information required !")

    // upload the images to cloudinary
    const imageUploadResponse = await Promise.all(
        localImages.map(async (localImage) => {
            const response = await uploadOnCloudinary(localImage.path)
            return {
                'publicUrl': response.secure_url,
                'public_id': response.public_id
            }
        })
    )

    // create a new document in the database
    const productUploadResponse = await Product.create({
        name,
        price: Number(price),
        brand,
        description,
        category,
        stockInfo: stockInfo, // change it again, only works for postman, to use it in application apply, json.parse(stockInfo)
        sellerId: user._id,
        imageUrls: imageUploadResponse
    })

    // check for upload error
    if(!productUploadResponse) throw new ApiError(500, "Error while adding new product")

    // send the response
    return res.status(201)
    .json(
        new ApiResponse(201,productUploadResponse,"Product Added Successfully")
    )
})

const getProducts = asyncHandler(async (req,res) => {
    // get the page number and the limit
    const page = req.query.page
    const limit = req.query.limit
    // console.log(req)

    // if(!page || !limit) throw new ApiError(400, "missing required attributes")

    // aggregation pipeline
    const aggregate = [
        {// sort from most recent to old
            $sort: {
                createdAt: -1
            }
        },
        {// select only specified fields
            $project: {
                name: 1,
                brand: 1,
                sellerId: 1,
                category: 1,
                price: 1,
                stockInfo: 1,
                imageUrls: 1,
                createdAt: 1,
                updatedAt: 1,
                description: 1
            }
        }
    ]

    // options
    const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: {
            totalDocs: 'totalItems',
            docs: 'products',
            limit: 'pageSize',
            totalPages: 'pageCount',
            page: 'currentPage',
            pagingCounter: 'itemStart',
            hasPrevPage: 'prevExists',
            hasNextPage: 'nextExists',
            prevPage: 'previousPage',
            nextPage: 'nextPage'
        }
    }

    const documents = await Product.aggregatePaginate(aggregate,options)

    if(!documents) throw new ApiError(500, "Error while fetching products")

    return res
    .status(200)
    .json(
        new ApiResponse(200, documents, "Products fethced successfully")
    )

})

const getProductsBySeller = asyncHandler(async (req,res) => {
    // get the page number and the limit
    const page = req.query.page
    const limit = req.query.limit
    const categoryFilter = req.query.categories
    const user = req.user

    let matchStage = {}
    if(user.role === 'seller') {
        matchStage.sellerId = user._id
    }
    if(user.role === 'customer') throw new ApiError(400, "Current user is not authorized to make changes in Product")
    // allow admin to access all the products
    if(categoryFilter && categoryFilter !== '') {
        matchStage.category = categoryFilter
    }

    // aggregation pipeline
    const aggregate = [
        {
            $match: {
                ...matchStage
            }
        },
        {// sort from most recent to old
            $sort: {
                createdAt: -1
            }
        },
        {// select only specified fields
            $project: {
                name: 1,
                brand: 1,
                sellerId: 1,
                category: 1,
                price: 1,
                stock: 1,
                imageUrls: 1,
                createdAt: 1,
                updatedAt: 1,
                description: 1
            }
        }
    ]

    // options
    const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: {
            totalDocs: 'totalItems',
            docs: 'products',
            limit: 'pageSize',
            totalPages: 'pageCount',
            page: 'currentPage',
            pagingCounter: 'itemStart',
            hasPrevPage: 'prevExists',
            hasNextPage: 'nextExists',
            prevPage: 'previousPage',
            nextPage: 'nextPage'
        }
    }

    const documents = await Product.aggregatePaginate(aggregate,options)

    if(!documents) throw new ApiError(500, "Error while fetching products")

    return res
    .status(200)
    .json(
        new ApiResponse(200, documents, "Products fethced successfully")
    )

})

const updateProductDetails = asyncHandler(async (req,res) => {
    // get the details to be updated
    const {name, brand, description, price, stock, productId} = req.body
    const user = req?.user

    if(
        [name, brand, description, price, stock].some((field) => field === '')
    ) {
        throw new ApiError(400, "Atleast one field is required")
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid Product ID' });
    }

    // get the product from database
    const product = await Product.findById(productId)

    if(!product) throw new ApiError(500, "Unexpected error occurred")
    
    // check if current user is customer, if yes report error
    if(user.role === 'customer') throw new ApiError(400, "Current User is not authorized to delete the product")

    // check is the user is correct seller if its role is seller, if its a admin then he can change the details
    if(user.role === 'seller' && user._id.toString() !== product.sellerId.toString()) throw new ApiError(409, "Current seller is not authorized to update details")

    // if the seller is verified , then update the details
    const updatedProductDetails = await Product.findOneAndUpdate(
        {_id: productId},
        {
            ...(name && { name }),
            ...(brand && { brand }),
            ...(description && { description }),
            ...(price && {price: Number(price)}),
            ...(stock && {stock: Number(stock)})
        },
        {new: true}
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedProductDetails, `Product(${productId}) details updated successfully"`)
    )
})

const getProductById = asyncHandler(async (req,res) => {
    const productId = req.params?.id

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid Product ID' });
    }

    if(!productId) throw new ApiError(400, "Product id is required")

    const product = await Product.findById(productId)

    if(!product) throw new ApiError(500, "Error while fetching Product details")

    return res
    .status(200)
    .json(
        new ApiResponse(200,product,"Product is fetched successfully")
    )
})

const deleteProductById = asyncHandler(async (req,res) => {
    // as it's a protected route, only authorized seller or admin can delete a product
    // get the product id and user
    const productId = req.params.id
    const currentUser = req.user
    // console.log(productId, currentUser)

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid Product ID' });
    }

    // get the product details from database and validate user
    const product = await Product.findById(productId)

    if(!product) throw new ApiError(404, "Product not found")
    // security checks
    if(currentUser.role === 'seller' && currentUser._id.toString() !== product.sellerId.toString()) {throw new ApiError(400, "Current User is not authorized to delete the product")}
    if(currentUser.role === 'customer') throw new ApiError(400, "Current User is not authorized to delete the product")
    
    // delete the product
    const response = await Product.findByIdAndDelete(productId);

    if(!response) throw new ApiError(500, "Product not deleted due to some unexpected error")

    // after the product is deleted also delete the images from cloudinary
    const cloudinaryDeleteResponse = await Promise.all(
        product.imageUrls?.map(async (imageObj) => {
            return await deleteFromCloudinary(imageObj.public_id)
        })
    )
    if(!cloudinaryDeleteResponse) throw new ApiError(500, "Error while deleting image files from cloudinary")


    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, `Product(${productId}) has been deleted successfully`)
    )
    
})

const getProductsByCategories = asyncHandler(async (req,res) => {
    // get the category array from the client
    const {page, limit, categories} = req.query

    if((!categories || page <= 0 || limit <= 0) || (categories && categories.length === 0)) throw new ApiError(400, "Invalid input: Please provide at least one category, a valid page number (greater than 0), and a valid limit (greater than 0).")
    
    // aggregation pipeline to get the products by category

    const aggregate = [
        {
            $match: categories.at(0) === 'All Products' 
            ? {} // No filtering; match all documents
            : { category: { $in: categories } } // Apply filtering
        }
    ]

    const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: {
            totalDocs: 'totalItems',
            docs: 'products',
            limit: 'pageSize',
            totalPages: 'pageCount',
            page: 'currentPage',
            pagingCounter: 'itemStart',
            hasPrevPage: 'prevExists',
            hasNextPage: 'nextExists',
            prevPage: 'previousPage',
            nextPage: 'nextPage'
        }
    }

    const products = await Product.aggregatePaginate(aggregate,options)

    if(!products) throw new ApiError(500, "Error fetching products")

    return res
    .status(200)
    .json(
        new ApiResponse(200, products, "Products with given categories fetched successfully")
    )
})

export {
    addNewProduct,
    getProducts,
    updateProductDetails,
    getProductById,
    deleteProductById,
    getProductsByCategories,
    getProductsBySeller
}