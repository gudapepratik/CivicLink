import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/authRole.middleware.js";
import {
  addComment,
  getCommentsByUser,
  getPostComments,
  removePostComment,
} from "../controllers/comment.controllers.js";

const commentRouter = Router();

// add comment to a post
commentRouter
  .route("/add-commment-to-post")
  .post(verifyJWT, authorizeRole("citizen", "admin", "authority"), addComment);

// get all comments by the user
commentRouter
  .route("/get-comments-by-user")
  .get(
    verifyJWT,
    authorizeRole("citizen", "admin", "authority"),
    getCommentsByUser
  );

// get all the comments done for a post
commentRouter.route("/get-comments-for-post").get(getPostComments);

// remove comment on a post
commentRouter
  .route("/remove-comment-from-post")
  .delete(
    verifyJWT,
    authorizeRole("citizen", "admin", "authority"),
    removePostComment
  );

export default commentRouter;
