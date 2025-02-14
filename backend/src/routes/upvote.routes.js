import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { authorizeRole } from "../middlewares/authRole.middleware.js"
import { addUpvoteToPost, getUpvoteCount, removeUpvoteFromPost } from "../controllers/upvote.controllers.js"

const upvoteRouter = Router()

// add to wishlist
upvoteRouter.route('/add-upvote-to-post').post(
    verifyJWT,
    authorizeRole('citizen','admin','authority'),
    addUpvoteToPost
)

upvoteRouter.route('/remove-upvote-from-post').delete(
    verifyJWT,
    authorizeRole('citizen','admin','authority'),
    removeUpvoteFromPost
)

upvoteRouter.route('/get-upvote-count').get(
    verifyJWT,
    authorizeRole('admin','customer'),
    getUpvoteCount
)


export default upvoteRouter