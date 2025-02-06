import mongoose from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

const orderItemSchema = mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
    },
    price: {
        type: Number,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    state: {
        type: String,
        enum: ['placed','shipped','delivered', 'cancelled'],
        default: 'placed',
        set: (v) => v.toLowerCase(),
    },
    address: {
        type: String,
        required: true,
        minlength: [10, 'Address must be at least 10 characters long'],
    },
    paymentMethod: {
        type: String,
        enum: ['cashondelivery','online'],
        required: true
    },
    deliveryBy: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days later
    },
}, {timestamps: true})

// aggregate paginate plugin
orderItemSchema.plugin(aggregatePaginate)

export const OrderItem = mongoose.model('OrderItem',orderItemSchema)