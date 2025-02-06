import mongoose from 'mongoose'

const wishlistSchema = mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
}, {timestamps: true})


export const Wishlist = mongoose.model('Wishlist', wishlistSchema)