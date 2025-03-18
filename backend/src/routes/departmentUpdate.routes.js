import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { authorizeRole } from "../middlewares/authRole.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import { getDepartmentUpdatesOnPost, newDeptUpdate } from "../controllers/departmentUpdate.controllers.js"

const departmentUpdateRouter = Router()

// get product route (not protected, anyone can access this route)
// postRouter.route('/get-posts-by-location').get(getPostsByLocation)

// postRouter.route('/get-posts-by-user').get(
//     verifyJWT,
//     getPostsByUser
// )

// postRouter.route('/get-posts-by-department').get(
//     verifyJWT,
//     getPostsByDepartment
// )

departmentUpdateRouter.route('/get-department-updates-on-post').get(
    getDepartmentUpdatesOnPost
)

// postRouter.route('/remove-post').delete(
//     verifyJWT,
//     authorizeRole("admin",'citizen'),
//     deletePost
// )

// postRouter.route('/update-post-status').post(
//     verifyJWT,
//     authorizeRole("admin",'citizen', 'authority'),
//     updatePostStatus
// )

// first verify the user, then verify the user role, then use multer to upload files to local storage
departmentUpdateRouter.route('/new-department-update').post(
    verifyJWT,
    authorizeRole('admin','authority'),
    upload.fields([
        {
            name: 'docs', 
            maxCount: 2 // can upload 2 pdfs at max
        }
    ]),
    newDeptUpdate
)

// postRouter.route('/get-search-suggestions').get(
//     fetchSuggestions
// )


export default departmentUpdateRouter