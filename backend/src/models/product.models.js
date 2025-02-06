import mongoose from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

const imageSchema = {
    publicUrl: {
        type: String,
        required: true
    },
    public_id: {
        type: String,
        required: true
    }
}
const StockInfoSchema = {
    size: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
}

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    stockInfo: [StockInfoSchema],
    category: {
        type: String,
        required: true
    },
    imageUrls: [imageSchema],
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true})

// aggregate paginate plugin
productSchema.plugin(aggregatePaginate)

export const Product = mongoose.model('Product', productSchema)