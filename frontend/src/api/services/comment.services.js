import { API_ENDPOINTS } from "../apiConstants";
import httpClient from "../httpClient.js";
import ErrorHandler from "../../utils/ErrorHandler.utils.js";

export class CommentService {

  async addNewComment({postId, comment, isDepartmentUpdate}) {
    try {
        if (!postId || !comment) throw new Error("Insufficient details to make comment");

      // call the api
      const commentResponse = await httpClient.post(`${API_ENDPOINTS.COMMENT}/add-commment-to-post`,{
        postId,
        comment,
        isDepartmentUpdate
      });

      if (!commentResponse)
        throw new Error("Error while comment !!?");

      return commentResponse;
    } catch (error) {
      ErrorHandler(error);
    }
  }


  async getCommentsByUser() {
    try{
      const response = await httpClient.get(`${API_ENDPOINTS.COMMENT}/get-comments-by-user`)
      return response

    }catch(error) {
      ErrorHandler(error)
    }
  }

  async getCommentsOnPost({postId}) {
    try{
        if(!postId || postId === "") throw new Error("postID required") 
            console.log(postId)
      const response = await httpClient.get(`${API_ENDPOINTS.COMMENT}/get-comments-for-post`,{
        params: {
            postId
        }
      })

      return response

    }catch(error) {
      ErrorHandler(error)
    }
  }


  async removeCommentFromPost({commentId}) {
    try{
      if(!commentId || commentId === "") throw new Error("Comment id is required")

      const response = await httpClient.delete(`${API_ENDPOINTS.POST}/remove-comment-from-post`, {
        params: {
          commentId
        }
      })

      return response

    }catch(error) {
      ErrorHandler(error)
    }
  }
}

export default new CommentService();
