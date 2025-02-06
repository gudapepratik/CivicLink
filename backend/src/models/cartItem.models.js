import mongoose from 'mongoose'

const cartItemSchema = mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
    },
    size: {
        type: String,
        default: ""
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
}, {timestamps: true})


export const CartItem = mongoose.model('CartItem', cartItemSchema)