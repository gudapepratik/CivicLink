import mongoose from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

const departmentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    authorityUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    address: { // department address
        type: String,
        required: true,
        minlength: [10, 'Address must be at least 10 characters long'],
    }
}, {timestamps: true})

// aggregate paginate plugin
departmentSchema.plugin(aggregatePaginate)

export const Department = mongoose.model('Department',departmentSchema)