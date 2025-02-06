import { OrderItem } from "../models/orderItem.models.js";
import { Order } from "../models/order.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from 'mongoose'

const placeOrder = asyncHandler(async (req,res) => {
    // get data to place order and make a new doc in orderItem schema
    const {orders, address, paymentMethod, totalAmount, couponInfo, razorpay_payment_id, razorpay_order_id, razorpay_signature} = req.body
    // customer id
    const customerId = req?.user._id

    if((!orders || orders.length === 0) || !address || !paymentMethod || !totalAmount || !couponInfo) throw new ApiError(400, "Insufficient/missing data")
    // console.log(couponInfo)
    let newOrder;
    if(paymentMethod.toLowerCase() === "cashondelivery") {
        // process without the razorpay credentials
        newOrder = await Order.create({
            customerId,
            totalAmount,
            couponInfo: {
                couponCode: couponInfo?.couponCode,
                couponDiscount: couponInfo?.discount
            }
        })
    } else{
        // if the order is online, credential are necessary
        newOrder = await Order.create({
            customerId,
            totalAmount,
            couponInfo: {
                couponCode: couponInfo?.couponCode || null,
                couponDiscount: couponInfo?.discount || null
            },
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        })
    }
    console.log(newOrder)
    // create new doc in Order schema first, orderItemids are not present here
    if(!newOrder) throw new ApiError(500, "Error while creating order")
    // new create orderItems and store the ids of the items in array
    const OrderItemIds = await Promise.all(
        orders.map(async (order) => {
            const newOrderItem = await OrderItem.create({
                orderId: newOrder._id,
                customerId: customerId,
                sellerId: order.sellerId,
                productId: order.productId,
                quantity: order.quantity,
                price: order.price,
                state: 'placed',
                address,
                size: order.size,
                paymentMethod: paymentMethod.toLowerCase()
            })

            if(!newOrderItem) throw new ApiError(500 , "Enexpeted error occurred")
            return newOrderItem._id
        })
    )

    // new again update the order schema and store the item ids
    const updatedOrder = await Order.findByIdAndUpdate(newOrder._id,
        {
            $set: {
                orderItems: OrderItemIds
            }
        },
        {
            new: true,
            runValidators: false
        }
    )
    console.log(updatedOrder)

    return res
    .status(201)
    .json(
        new ApiResponse(201, updatedOrder, "Order Placed Successfully")
    )
})

// get orders (customer and seller)
const getOrders = asyncHandler(async (req,res) => {
    // get the customerId/sellerId
    const {page, limit, filter} = req.query
    const user = req?.user

    if(!filter || page <= 0 || limit <= 0) throw new ApiError(400, "Invalid input: Please provide a valid page number (greater than 0), and a valid limit (greater than 0).")

    let matchStage = {};
    if(filter !== 'allorders') {
        matchStage.state = filter
    }

    if(user.role === 'seller') {
        matchStage.sellerId = user._id
    } else{
        matchStage.customerId = user._id
    }

    const aggregatePipeline = [
        {
            $match: matchStage
        },
        {
            $lookup: {
                from: "products",
                localField: "productId",
                foreignField: "_id",
                as: "productDetails"
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ]
    // let orders;
    // if(user.role === 'seller') {
    //     // search for orders in orderItem schema
    //     orders = await OrderItem.find({
    //         sellerId: user._id
    //     })
    // } else{
    //     // search for orders in orderItem schema
    //     orders = await OrderItem.find({
    //         customerId: user._id
    //     })
    // }
    const options = {
        page,
        limit,
        customLabels: {
            totalDocs: 'totalItems',
            docs: 'OrderItems',
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

    const orderItems = await OrderItem.aggregatePaginate(aggregatePipeline,options)

    if(!orderItems) throw new ApiError(500, "No orders available")
    
    return res
    .status(200)
    .json(
        new ApiResponse(200, orderItems, "Orders fetched Successfully")
    )
})

// cancel order by customer
const cancelOrder = asyncHandler(async (req,res) => {
    // get the customer id and orderItem id and order id
    const {orderItemId} = req.body
    const user = req.user
    // validate the id
    if (!mongoose.Types.ObjectId.isValid(orderItemId)) throw new ApiError(400, "Invalid Product ID")

    // don't delete the entire document just update the status to cancellled
    const updatedOrder = await OrderItem.findOneAndUpdate(
        {
            _id: orderItemId,
            customerId: user._id
        },
        {
            $set: {
                state: 'cancelled'
            }
        },
        {
            new: true
        }
    )

    if(!updatedOrder) throw new ApiError(500, "Error while cancelling order")

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedOrder, "Order cancelled Successfully")
    )
})

// update order status (seller only)
const updateOrderStatus = asyncHandler(async (req,res) => {
    // get the order item id 
    const {orderItemId, updatedState} = req.body

    if(updatedState !== 'shipped' && updatedState !== 'delivered') throw new ApiError(400, "Invalid status")

    // validate the id
    if (!mongoose.Types.ObjectId.isValid(orderItemId)) throw new ApiError(400, "Invalid Product ID")

    // don't delete the entire document just update the status to cancellled
    const updatedOrder = await OrderItem.findOneAndUpdate(
        {
            _id: orderItemId,
        },
        {
            $set: {
                state: updatedState
            }
        },
        {
            new: true
        }
    )

    if(!updatedOrder) throw new ApiError(500, "Error while updating order status")

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedOrder, "Order Status updated Successfully")
    )
})


// get filtered orders
const getFilteredOrders = asyncHandler(async (req,res) => {
    // user details
    const user = req?.user
    // get the queries // everything here will be an string , so convert it accordingly before using
    const {sortBy, sortOrder, stateFilter, page, limit} = req.query
    console.log(req.query)

    // match stage is to get the starting documents on which the filters will be applied
    let matchStage = {}
    if(user.role === 'seller') {
        matchStage = {sellerId: user._id}
    } else{
        matchStage = {customerId: user._id}
    }

    // first filter the docs by the state
    if(stateFilter) {
        matchStage.state = stateFilter
    }

    // add sorting stage if given by user else sort in descending order of date
    let sortStage = {}
    if(sortBy) {
        sortStage[sortBy] = Number(sortOrder) // -1 or 1
    } else{
        sortStage["createdAt"] = -1
    }

    const aggregatePipeline = [
        {$match: matchStage},
        {$sort: sortStage}
    ]

    const options = {
        page,
        limit
    }

    const orders = await OrderItem.aggregatePaginate(aggregatePipeline,options)

    if (!orders || orders.length === 0) {
        throw new ApiError(500, "No orders available");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, orders, "Orders retrieved successfully")
    );


})



export {
    placeOrder,
    getOrders,
    cancelOrder,
    updateOrderStatus,
    getFilteredOrders
}