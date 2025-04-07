import {app} from '../app.js'
import { registerUser, loginUser, refreshAccessToken, logoutUser, updateUserDetails, updateUserPassword, getCurrentUser, deleteUser, getUsers, generateNewUserVerification, verifyUser, verifyByAdmin, rejectByAdmin } from '../controllers/user.controllers.js'
import { Router } from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { authorizeRole } from '../middlewares/authRole.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'

// all user related routes are here
const userRouter = Router()

userRouter.route("/register").post(
    upload.single("avatar"),    
    registerUser
)

userRouter.route("/login").post(loginUser)

userRouter.route('/refresh-token').post(refreshAccessToken)

// // protected routes
userRouter.route('/logout').post(verifyJWT,logoutUser)

userRouter.route('/protected-route').post(verifyJWT,
    (req,res) => {
        res.send(200).json({
            message: "Protected route hit!!"
        })
    }
)

userRouter.route('/update-user-details').post(
    verifyJWT,
    upload.single("avatar"),
    updateUserDetails
)

userRouter.route('/update-user-password').post(updateUserPassword)

userRouter.route('/get-current-user').get(verifyJWT, getCurrentUser)
userRouter.route('/get-users').get(verifyJWT,authorizeRole("admin"),getUsers)
userRouter.route('/admin-reject').post(verifyJWT,authorizeRole("admin"),rejectByAdmin)
userRouter.route('/generate-user-verification').post(generateNewUserVerification)
userRouter.route('/verify-user').post(verifyUser)
userRouter.route('/admin-verify').post(verifyJWT,authorizeRole("admin"),verifyByAdmin)

userRouter.route('/remove-user').delete(verifyJWT, deleteUser)

// // admin only route
// userRouter.route('/admin-only-route').get(verifyJWT,authorizeRole('admin'),(req,res) => {
//     res.status(200)
//     .json({message: "Welcome Admin"})
// })

export default userRouter
