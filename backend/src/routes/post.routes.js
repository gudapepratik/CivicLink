import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { authorizeRole } from "../middlewares/authRole.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import { addNewPost, deletePost, getPostById, getPostsByDepartment, getPostsByLocation, getPostsByUser, updatePostStatus } from "../controllers/post.controllers.js"
import { fetchSuggestions } from "../utils/googleSuggestions.js"

const postRouter = Router()

// get product route (not protected, anyone can access this route)
postRouter.route('/get-posts-by-location').get(getPostsByLocation)

postRouter.route('/get-posts-by-user').get(
    verifyJWT,
    getPostsByUser
)

postRouter.route('/get-posts-by-department').get(
    verifyJWT,
    getPostsByDepartment
)

postRouter.route('/get-post-by-id').get(
    getPostById
)

postRouter.route('/remove-post').delete(
    verifyJWT,
    authorizeRole("admin",'citizen'),
    deletePost
)

postRouter.route('/update-post-status').post(
    verifyJWT,
    authorizeRole("admin",'citizen', 'authority'),
    updatePostStatus
)

// first verify the user, then verify the user role, then use multer to upload files to local storage
postRouter.route('/add-new-post').post(
    verifyJWT,
    authorizeRole('admin','citizen'),
    upload.fields([
        {
            name: 'images', 
            maxCount: 6 // can upload 6 images at max
        }
    ]),
    addNewPost
)

postRouter.route('/get-search-suggestions').get(
    fetchSuggestions
)


export default postRouter