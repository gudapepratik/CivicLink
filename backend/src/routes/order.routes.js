import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/authRole.middleware.js";
import { cancelOrder, getFilteredOrders, getOrders, placeOrder, updateOrderStatus } from "../controllers/order.controllers.js";
import { createOrder, verifyPayment } from "../utils/Razorpay.js";

const orderRouter = Router()

// customer places an order
orderRouter.route('/place-order').post(
    verifyJWT,
    authorizeRole('customer','admin'),
    placeOrder
)

// customer cancels order
orderRouter.route('/cancel-order-by-id').post(
    verifyJWT,
    authorizeRole('customer','admin'),
    cancelOrder
)


// seller updates order status
orderRouter.route('/update-order-by-id').post(
    verifyJWT,
    authorizeRole('seller','admin'),
    updateOrderStatus
)


// customer and seller fetches orders
orderRouter.route('/get-orders').get(
    verifyJWT,
    authorizeRole('customer','seller','admin'),
    getOrders
)


// customer and seller fetches orders by filters like by date, by status
orderRouter.route('/get-filtered-orders').get(
    verifyJWT,
    authorizeRole('customer','seller','admin'),
    getFilteredOrders
)

// razorpay integration routes

orderRouter.route('/create-order').post(
    verifyJWT,
    authorizeRole('customer','admin'),
    createOrder
)

orderRouter.route('/verify-payment').post(
    verifyJWT,
    authorizeRole('customer','admin'),
    verifyPayment
)

export default orderRouter