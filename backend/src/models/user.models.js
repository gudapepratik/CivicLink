import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowerCase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    contactNumber: {
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'customer', 'seller'],
        default: 'customer'
    },
    refreshToken: {
        type: String
    }
}, {timestamps: true})

// function/middleware to hash the password if the password is not modified previously i.e. at registration
userSchema.pre("save",async function (next) {
    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect =async function(password) {
    return await bcrypt.compare(password,this.password)
}

// middleware function to generate access token using jsonwebtoken
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// middleware function to generate refresh token using jsonwebtoken
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model('User', userSchema)