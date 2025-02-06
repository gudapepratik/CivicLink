import mongoose from 'mongoose'

const couponSchema = {
    couponCode: {
        type: String,
        // required: true
    },
    couponDiscount: {
        type: String,
        // required: true
    }
}

const orderSchema = mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'OrderItem'
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    // coupon information
    couponInfo: {
        type: couponSchema,
        default: null
    },
    // razorpay implementation (trial for now)
    razorpay_payment_id: {
        type: String,
        // required: true
        default: null
    },
    razorpay_order_id: {
        type: String,
        // required: true
        default: null
    },
    razorpay_signature: {
        type: String,
        // required: true
        default: null
    },
}, {timestamps: true})


export const Order = mongoose.model('Order', orderSchema)