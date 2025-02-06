import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'

// reginster new user
const registerUser = asyncHandler(async (req,res) => {
    // get the details
    const {name, email, password, contactNumber, role} = req.body

    // check if all details present or not
    if(
        [name,email,password,role,contactNumber].some((field) => field === '')
    ){
        throw new ApiError(400,"Required fields are missing")
    }
    // 3. check if user already exists
    const existingUser = await User.find({
        $or: [{contactNumber}, {email}]
    })

    if(existingUser && existingUser.length > 0) throw new ApiError(409,"User with same email or phone number already exists")
    // create new user
    const user = await User.create({
        name,
        email,
        password,
        contactNumber,
        role
    })

    // // get the user details
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) throw new ApiError(500, "Error while Register")

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )
})

// method to generate refresh and access tokens because we will need to generate these token many times
const generateAccessAndRefreshToken = async (userId) => {
    try {
        // get the user instance
        const user = await User.findById(userId)

        // generate tokens
        const accessToken = await user.generateAccessToken()
        const newRefreshToken = await user.generateRefreshToken()

        // store the refresh token in database
        user.refreshToken = newRefreshToken
        // save the state
        // as we are upadating the document, it will again require the attributes that are assigned are "required"
        // so to bypass this we specify validateBeforeSave as false
        await user.save({ validateBeforeSave: false})

        // return the tokens
        return {accessToken, newRefreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

// login user
const loginUser = asyncHandler(async (req,res) => {
        // get the data
        const {email, password, role} = req.body
        // check if empty or invalid
        if(
            [email, password, role].some((field) => field === '')
        ) {
            throw new ApiError(400,"Email or password or role field missing")
        }

        // check user exists or not
        const existingUser = await User.findOne({
            $or: [{email}]
        })
        if(!existingUser) throw new ApiError(400, "User with given email id does not exists")
        
        if(existingUser.role !== 'admin' && existingUser.role !== role) throw new ApiError(400, `Current user(${existingUser.role}) not allowed to login on this page`)

        // // if the user is already registered then the refreshToken in database must not be expired, so check this case
        // Small update- what i am thinking is, if the user has correct username and password, log the user without checking if the 
        // the user is already logged in, each time user loggs in the refresh and access token will change, the old logged in user would 
        // be able to use the protected routes, until the access token he has is valid, after that if he tries to access the protected route
        // the refresh token will be mathced with database, since it will not be equal even if it is valid, we will make the user to login again
        // i.e. redirect to login page again
        // let isAlreadyLoggedin;
        // try{
        //     if(existingUser?.refreshToken) {
        //         isAlreadyLoggedin = await jwt.verify(existingUser?.refreshToken,process.env.REFRESH_TOKEN_SECRET)
        //     }
        // }catch(error) {
        //     // if the error is Token expired then will allow them to procced for the login else end
        //     if (error.name !== "TokenExpiredError") {
        //         throw new ApiError(400, "Invalid refresh token");
        //     }
        // }

        // // is the token is valid, that means the user is already logged in
        // if(isAlreadyLoggedin) throw new ApiError(409, "User is already logged in")

        // check if the password is correct
        const isPasswordCorrect = await existingUser.isPasswordCorrect(password)

        if(!isPasswordCorrect) throw new ApiError(401, "Incorrect password entered ! login again")

        // generate access token and refresh token
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(existingUser._id)

        const user = await User.findById(existingUser._id).select("-password -refreshToken")

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(200)
        .cookie('accessToken',accessToken,options)
        .cookie('refreshToken',newRefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {
                    user: user,
                    accessToken,
                    newRefreshToken
                },
                "User Logged In Successfully"
            )
        )
    
})

// logout user
const logoutUser = asyncHandler(async (req,res) => {
    // as the middleware "verifyJWT" is already excecuted we now have access to req.user
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: null
            }
        }
    )

    // clear the cookies
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "User logged out")
    )
})

// refresh access token
const refreshAccessToken = asyncHandler(async (req,res) => {
    console.log(req.body)
    // get the refresh token
    const refreshToken = req.cookies?.refreshToken || req.headers['x-refresh-token']

    if(!refreshToken) throw new ApiError(401, "Missing or Invalid refresh Token")
    
    // verify and decode the refresh token
    const decodedRefreshToken = await jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)

    if(!decodedRefreshToken) throw new ApiError(401, "Invalid refresh Token ! login again")
    
    // get the user from database
    const user = await User.findById(decodedRefreshToken._id)

    if(!user) throw new ApiError(401, "user not found")

    // validate the refresh token in cookie with that in database
    if(refreshToken !== user.refreshToken) throw new ApiError(401, "Unauthorized access")
    
    // generate a new access token for the user
    const accessToken = await user.generateAccessToken()

    const options = {
        httpOnly: true,
        secure: true
    }

    // send the tokens in response and in cookie also
    return res
    .status(200)
    .cookie('accessToken',accessToken, options)
    .cookie("refreshToken",user.refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                accessToken,
                refreshToken
            },
            "Access Token is refreshed"
        )
    )
})

// get current logged in user
const getCurrentUser = asyncHandler(async (req,res) => {
    // as this is the protected route, verifyJWT will make the current user available in req.user, just send those details
    return res
    .status(200)
    .json(
        new ApiResponse(200, req.user, "User details fetched sucessfully")
    )
})

// update user password
const updateUserPassword = asyncHandler(async (req,res) => {
    // get the updated password and previous password from the user
    const {oldPassword, newPassword} = req.body

    // check is both are present
    if(!oldPassword || !newPassword) throw new ApiError(400, "Update details missing")

    // get the user and check if the old password matches with that stored in the database
    const user = await User.findById(req?.user._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect) throw new ApiError(400, "entered password is incorrect")
    
    // update the password and remove the refresh token
    user.password = newPassword
    user.refreshToken = null

    // save the changes to database
    // this will call a middleware which will hash the new password and then save in database, this middleware is declared in user.models.js
    await user.save({ validateBeforeSave: false})

    const options = {
        httpOnly: true,
        secure: true
    }

    // clear the cookies
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200, {} , "password is updated successfully, Login again")
    )
})

// upadate user details
const updateUserDetails = asyncHandler(async (req,res) => {
    // get the details to be updated (email, password, name, contactNumber)
    const {email, name, contactNumber} = req.body

    // check if atleast one field is to be updated 
    if(!email && !name && !contactNumber){
        throw new ApiError(400, "Fields to be updated not specified")
    }

    // the user is already verified and authorized
    const updatedUser = await User.findOneAndUpdate(
        req?.user._id,
        {
            $set: {
                email: email || req.user.email,
                name: name || req.user.name,
                contactNumber: contactNumber || req.user.contactNumber
            }
        },
        {new: true}
    ).select("-password -refreshToken")

    // only update the access token as the access token consists of these updated field
    const updatedAccessToken = updatedUser.generateAccessToken()

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken",updatedAccessToken, options)
    .json(
        new ApiResponse(200, updatedUser, "User details updated successfully")
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    updateUserDetails,
    updateUserPassword,
    getCurrentUser
}