import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // get the accesstoken from either cookie or header
    const token =
      req.cookies?.accessToken ||
      req.header.Authorization?.replace("Bearer ", "");

    if (!token) throw new ApiError(401, "Unauthorized request")

    const decodedToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    // now find the user from database cause we now have the id
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) throw new ApiError(401, "Invalid Token");

    // new add the user object in request
    req.user = user;

    // pass control to next middleware
    next();
  } catch (error) {
    console.log(error)
    if(error.name === 'TokenExpiredError') {
      throw new ApiError(401, "Access token has expired. Please refresh your token");
      console.log("Efas")
      // WHAT NOW ?
      // When an API request fails with 401 due to an expired access token:
      // The client intercepts the response.
      // It sends a request to the refresh token endpoint (refreshAccessToken).
      // The server verifies the refresh token and provides a new access token.
      // The client retries the original request with the new access token.
    }
    throw new ApiError(400, "INVALID TOKEN");
  }
});

// keep it as it is
// export const verifyJWT = asyncHandler(async (req, res, next) => {
//   try {
//     // new as we have configured a middleware cookieparser, we now have access to cookies as req.cookie from here we can access the accessToken
//     // for mobile application cookies are not available hence the tokens are stored in http header often in "Authorization" header having value -> Bearer <Token> , so if we remove the "Bearer " from this we will get the token

//     // get the accesstoken from either cookie or header
//     const token =
//       req.cookies?.accessToken ||
//       req.header("Authorization")?.replace("Bearer ", "");

//     if (!token) throw new ApiError(401, "Unauthorized request");

//     // if the access token is valid and verified, go to next()
//     // else check the refresh token
//     // if the refresh token is valid and verified, generate new access token
//     // else if refresh token is expired , report user to login again

//     let decodedToken;
//     try {
//       decodedToken = await jwt.verify(
//         token,
//         process.env.ACCESS_TOKEN_SECRET
//       );
//     } catch(error) {
//       if(error.name === 'TokenExpiredError') {
//         // check for the refresh token
//         const refreshToken = req.cookies?.refreshToken

//         if (!refreshToken) throw new ApiError(401, "Refresh token is required");
        
//         try{
//           decodedToken = await jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
//         } catch(error) {
//           if (refreshError.name === "TokenExpiredError") {
//             throw new ApiError(401, "Refresh token has expired. Please log in again.");
//           }
//           throw new ApiError(401, "Invalid refresh token");
//         }
//       }
//       throw new ApiError(401, "Invalid access token");
//     }

//     // now find the user from database cause we now have the id
//     const user = await User.findById(decodedToken?._id).select(
//       "-password -refreshToken"
//     );

//     // if the decoded token was refresh token then it must have only user id in it not other details
//     // if it was a refresh token, then generate new access token
//     if(!decodedToken.name) {
//       const newAccessToken = await user.generateAccessToken()
//       const options = {
//         httpOnly: true,
//         secure: true
//       }
//       res.cookie('accessToken',newAccessToken,options)
//       if(!newAccessToken) throw new ApiError(400, "Error while creating new access token")
//     }

//     if (!user) throw new ApiError(401, "Invalid Token");

//     // new add the user object in request
//     req.user = user;

//     // pass control to next middleware
//     next();
//   } catch (error) {
//     throw new ApiError(401, "INVALID TOKEN");
//   }
// });


