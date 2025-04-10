import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/Cloudinary.js";
import mongoose from "mongoose";
import { sendAccountRejectedEmail, sendAccountVerifiedEmail, sendAuthorityAccountCreatedEmail, sendCitizenAccountCreatedEmail, sendVerificationCodeEmail } from "../utils/BrevoMailService.js";

// reginster new user
const registerUser = asyncHandler(async (req, res) => {
  // get the details
  const {
    name,
    email,
    password,
    role,
    age,
    gender,
    latitude,
    longitude,
    departmentId,
  } = req.body;
  const locatAvatarFile = req.file;

  // check if all details present or not
  if (
    [name, email, password, role, gender].some((field) => field === "") ||
    !age
  ) {
    throw new ApiError(400, "Required fields are missing");
  }

  if (role === "authority" && !mongoose.isValidObjectId(departmentId))
    throw new ApiError(400, "Invalid departmentId");

  if (!latitude || !longitude) throw new ApiError(400, "Location is required");
  // 3. check if user already exists
  const existingUser = await User.find({
    $or: [{ email }],
  });

  if (existingUser && existingUser.length > 0)
    throw new ApiError(
      409,
      "User with same email or phone number already exists"
    );

  // upload the avatar to cloudinary
  const uploadResponse = await uploadOnCloudinary(locatAvatarFile.path);
  // // console.log(uploadResponse)
  // create new user
  const user = await User.create({
    name,
    email,
    password,
    role,
    age,
    gender,
    location: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
    avatar: {
      publicUrl: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    },
    departmentId: departmentId || null,
    isVerified: false,
    isAdminVerified: false
  });

  if(role === "citizen") {
    // generate a new verification code and send to the user via email
    await generateVerificationCode(user._id)
  }

  // get the user details
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -verificationCode -verificationCodeExpiresAt"
  );

  if (!createdUser) throw new ApiError(500, "Error while Register");

  if(role === "citizen") {
    await sendCitizenAccountCreatedEmail(email, name)
  } else{
    await sendAuthorityAccountCreatedEmail(email, name, role)
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

// method to generate refresh and access tokens because we will need to generate these token many times
const generateAccessAndRefreshToken = async (userId) => {
  try {
    // get the user instance
    const user = await User.findById(userId);

    // generate tokens
    const accessToken = await user.generateAccessToken();
    const newRefreshToken = await user.generateRefreshToken();

    // store the refresh token in database
    user.refreshToken = newRefreshToken;
    // save the state
    // as we are upadating the document, it will again require the attributes that are assigned are "required"
    // so to bypass this we specify validateBeforeSave as false
    await user.save({ validateBeforeSave: false });

    // return the tokens
    return { accessToken, newRefreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const generateNewUserVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Generate a 6-digit verification code
  const newCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Set expiry to 2 days from now
  const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

  // Update the user
  // check user exists or not
  const user = await User.findOne({
    $or: [{ email }],
  });
  
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if((user.role === "admin" || user.role === "authority") && !user.isAdminVerified)
      throw new ApiError(400, "Account not yet verified by admin")
  
  user.verificationCode =  newCode,
  user.verificationCodeExpiresAt =  expiresAt,
  user.isVerified =  false

  await user.save({ validateBeforeSave: false });

  // send the email with verification code
  await sendVerificationCodeEmail(user.email, user.name, newCode)

  res
  .status(200)
  .json(
    new ApiResponse(200, {}, "Verification code generated successfully and will be valid for 2 days")
  )
});


const generateVerificationCode = async (userId) => {
  // Generate a 6-digit verification code
  const newCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Set expiry to 2 days from now
  const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

  // Update the user
  const user = await User.findByIdAndUpdate(
    userId,
    {
      verificationCode: newCode,
      verificationCodeExpiresAt: expiresAt,
      isVerified: false
    },
    { new: true }
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // send the email with verification code
  await sendVerificationCodeEmail(user.email, user.name, newCode)

}

const verifyUser = asyncHandler(async (req, res) => {
  const { userId, verificationCode } = req.body;

  // Get user
  const user = await User.findById(userId);
  
  if (!user) {
    throw new ApiError(404, "User Not Found");
  }

  // Check if verification code has expired
  if (user.verificationCodeExpiresAt < new Date()) {
    throw new ApiError(400, "Verification Code Expired");
  }

  // Check if code matches
  if (user.verificationCode !== verificationCode) {
    throw new ApiError(400, "Invalid Verification Code");
  }

  // Mark as verified and clear code
  user.isVerified = true;
  user.verificationCode = null;
  user.verificationCodeExpiresAt = null;
  await user.save();

  // await sendAccountVerifiedEmail(user.email, user.name)

  res.status(200).json(
    new ApiResponse(200, null, "User verified successfully! Now you can login to your account")
  );
});

const userVerification = async ({userId, verificationCode}) => {
  // Get user
  const user = await User.findById(userId);
  
  if (!user) {
    throw new ApiError(404, "User Not Found");
  }

  // Check if verification code has expired
  if (user.verificationCodeExpiresAt < new Date()) {
    throw new ApiError(400, "Verification Code Expired");
  }

  // Check if code matches
  if (user.verificationCode !== verificationCode) {
    throw new ApiError(400, "Invalid Verification Code");
  }

  // Mark as verified and clear code
  user.isVerified = true;
  user.verificationCode = null;
  user.verificationCodeExpiresAt = null;
  await user.save();

  return true;
}

// admin issues a new verification code to the account
const verifyByAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    throw new ApiError(400, "User ID is required")
  }

  // Generate a 6-digit verification code
  const newCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Set expiry to 2 days from now
  const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

  // Update the user
  const user = await User.findByIdAndUpdate(
    userId,
    {
      verificationCode: newCode,
      verificationCodeExpiresAt: expiresAt,
      isVerified: false,
      isAdminVerified: true
    },
    { new: true }
  );

  if (!user) 
    throw new ApiError(400, "User not found")

  // Send email notifying user their account is verified
  await sendAccountVerifiedEmail(user.email, user.name, newCode);

  res
  .status(200)
  .json(
    new ApiResponse(200,{}, "User has been verified successfully by admin")
  );
});

const rejectByAdmin = asyncHandler(async (req,res) => {
  const { userId, reason } = req.body;

  if (!userId) {
    throw new ApiError(400, "User ID is required")
  }

  // Update the user
  const user = await User.findById(userId);

  if (!user) 
    throw new ApiError(400, "User not found")

  // delete the user
  await deleteUserHandler(user)

  // Send email notifying user their account is verified
  await sendAccountRejectedEmail(user.email, user.name, reason || "");

  res
  .status(200)
  .json(
    new ApiResponse(200,{}, "User has been rejected successfully by admin")
  );
})


// login user
const loginUser = asyncHandler(async (req, res) => {
  // get the data
  const { email, password, verificationCode } = req.body;

  // check if empty or invalid
  if ([email, password].some((field) => field === "")) {
    throw new ApiError(400, "Email or password field missing");
  }

  // check user exists or not
  const existingUser = await User.findOne({
    $or: [{ email }],
  });

  if (!existingUser)
    throw new ApiError(400, "User with given email id does not exists");

  // check if the password is correct
  const isPasswordCorrect = await existingUser.isPasswordCorrect(password);

  if (!isPasswordCorrect)
    throw new ApiError(400, "Incorrect password entered ! login again");

  if((existingUser.role === "admin" || existingUser.role === "authority") && !existingUser?.isAdminVerified)
    throw new ApiError(400, "Account not yet verified by admin")

  if(!existingUser.isVerified) {
    // check if the verification code is recieved, if not then throw error
    if(!verificationCode || verificationCode === "")
      throw new ApiError(400, "Account is not verified! Please enter a verification code if you have one");

    await userVerification({userId: existingUser._id, verificationCode: verificationCode})
  } 

  // generate access token and refresh token
  const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(
    existingUser._id
  );

  const user = await User.findById(existingUser._id).select(
    "-password -refreshToken -verificationCode -verificationCodeExpiresAt"
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: user,
          accessToken,
          newRefreshToken,
        },
        "User Logged In Successfully"
      )
    );
});

// logout user
const logoutUser = asyncHandler(async (req, res) => {
  // as the middleware "verifyJWT" is already excecuted we now have access to req.user
  await User.findByIdAndUpdate(req.user._id, {
    $set: {
      refreshToken: null,
    },
  });

  // clear the cookies
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

// refresh access token
const refreshAccessToken = asyncHandler(async (req, res) => {
  // console.log("asfa");
  // get the refresh token
  const refreshToken =
    req.cookies?.refreshToken || req.headers["x-refresh-token"];

  if (!refreshToken)
    throw new ApiError(401, "Missing or Invalid refresh Token");

  // verify and decode the refresh token
  const decodedRefreshToken = await jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  if (!decodedRefreshToken)
    throw new ApiError(401, "Invalid refresh Token ! login again");

  // get the user from database
  const user = await User.findById(decodedRefreshToken._id);

  if (!user) throw new ApiError(401, "user not found");

  // validate the refresh token in cookie with that in database
  if (refreshToken !== user.refreshToken)
    throw new ApiError(401, "Unauthorized access");

  // generate a new access token for the user
  const accessToken = await user.generateAccessToken();

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };
  // console.log(refreshToken);
  // send the tokens in response and in cookie also
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", user.refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          accessToken,
          refreshToken,
        },
        "Access Token is refreshed"
      )
    );
});

// get current logged in user
const getCurrentUser = asyncHandler(async (req, res) => {
  // as this is the protected route, verifyJWT will make the current user available in req.user, just send those details
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User details fetched sucessfully"));
});

// update user password
const updateUserPassword = asyncHandler(async (req, res) => {
  // get the updated password and previous password from the user
  const { email, newPassword, isCodeSent} = req.body;
  // console.log(isCodeSent)

  // check is both are present
  if (isCodeSent && (!email || !newPassword))
    throw new ApiError(400, "Update details missing");

  // check user exists or not
  const existingUser = await User.findOne({
    $or: [{ email }],
  });

  if (!existingUser)
    throw new ApiError(400, "User with given email id does not exists");

  if(!isCodeSent) {
    // Generate a 6-digit verification code
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();

    await sendVerificationCodeEmail(email, existingUser.name, newCode);

    res
    .status(200)
    .json(
      new ApiResponse(200, {verificationCode: newCode}, "Verification Code generated Successfully")
    )
  } else{
    // verification code has been verified on frontend only, just save the new password here
    existingUser.password = newPassword
    existingUser.refreshToken = null;

    await existingUser.save();

    res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Password has been changed successfully")
    )
  }
});

// upadate user details
const updateUserDetails = asyncHandler(async (req, res) => {
  // get the details to be updated (email, password, name, contactNumber)
  const { email, name, age } = req.body;
  const user = req.user;
  const localAvatarFile = req.file;

  // check if atleast one field is to be updated
  if (!email && !name && !age) {
    throw new ApiError(400, "Fields to be updated not specified");
  }

  if (email !== user.email) {
    // check if there is any user registered on the new email address
    const anotherUser = await User.findOne({
      email: email,
    });

    if (anotherUser)
      throw new ApiError(400, "User with same email Id already exists");
  }

  let newImageUploadResponse;
  // check if new image is given
  if (localAvatarFile) {
    // delete the previous image
    const deleteImageResponse = await deleteFromCloudinary(
      user.avatar.public_id
    );

    if (!deleteImageResponse)
      throw new ApiError(500, "Unexpected error while updating details");

    // upload new image
    newImageUploadResponse = await uploadOnCloudinary(localAvatarFile.path);
  }

  // the user is already verified and authorized
  const updatedUser = await User.findOneAndUpdate(
    { _id: user._id },
    {
      $set: {
        email: email,
        name: name,
        age: Number(age),
        avatar: {
          publicUrl: newImageUploadResponse
            ? newImageUploadResponse.secure_url
            : user.avatar.publicUrl,
          public_id: newImageUploadResponse
            ? newImageUploadResponse.public_id
            : user.avatar.public_id,
        },
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  // only update the access token as the access token consists of these updated field
  const updatedAccessToken = updatedUser.generateAccessToken();

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  return res
    .status(200)
    .cookie("accessToken", updatedAccessToken, options)
    .json(
      new ApiResponse(200, updatedUser, "User details updated successfully")
    );
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = req.user;

  await deleteUserHandler(user)

  // clear the cookies
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Account has been deleted successfully"));
});

const deleteUserHandler = async (user) => {
  // first delete the avatar
  const deleteResponse = await deleteFromCloudinary(user.avatar.public_id);

  if (!deleteResponse)
    throw new ApiError(500, "Error occurred while deleting account");

  const response = await User.findOneAndDelete({
    _id: user._id,
  });

  if (!response)
    throw new ApiError(500, "Error occurred while deleting account.");

  return true;
}


const getUsers = asyncHandler(async (req, res) => {
  const { getAllUsers } = req.query;

  const aggregate = [
    {
      $match:
        getAllUsers === "false"
          ? { $or: [{ isAdminVerified: false, role: "authority" }, { isAdminVerified: false, role: "admin" }] }
          : {},
    },
    {
      $lookup: {
        from: "departments",
        localField: "departmentId",
        foreignField: "_id",
        as: "departmentDetails",
      },
    },
    {
      $project: {
        "departmentDetails._id": 0,
        "departmentDetails.mission": 0,
        "departmentDetails.description": 0,
        "departmentDetails.responsibilities": 0,
        "departmentDetails.services": 0,
        "departmentDetails.commonIssues": 0,
        "departmentDetails.heroImage": 0,
        "departmentDetails.logo": 0,
        "departmentDetails.hours": 0,
        "departmentDetails.createdAt": 0,
        "departmentDetails.updatedAt": 0,
        "userDetails._id": 0,
        password: 0,
        refreshToken: 0,
        updatedAt: 0,
      },
    },
  ];

  const response = await User.aggregate(aggregate);

  res
  .status(200)
  .json(
    new ApiResponse(200, response, "Users fetched successfully")
  )
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updateUserDetails,
  updateUserPassword,
  getCurrentUser,
  deleteUser,
  generateNewUserVerification,
  getUsers,
  verifyUser,
  verifyByAdmin,
  rejectByAdmin
};
