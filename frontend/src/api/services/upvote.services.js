import { API_ENDPOINTS } from "../apiConstants";
import httpClient from "../httpClient.js";
import ErrorHandler from "../../utils/ErrorHandler.utils.js";

export class UpvoteService {

  async addNewUpvote({postId}) {
    try {
        if (!postId) throw new Error("PostId is required");

      // call the api
      const upvoteResponse = await httpClient.post(`${API_ENDPOINTS.UPVOTE}/add-upvote-to-post`,{
        postId
      });

      if (!upvoteResponse)
        throw new Error("Error while upvote !!?");

      return upvoteResponse;
    } catch (error) {
      ErrorHandler(error);
    }
  }


//   async getCommentsByUser() {
//     try{
//       const response = await httpClient.get(`${API_ENDPOINTS.COMMENT}/get-comments-by-user`)
//       return response

//     }catch(error) {
//       ErrorHandler(error)
//     }
//   }

//   async getCommentsOnPost({postId}) {
//     try{
//         if(!postId || postId === "") throw new Error("postID required") 
//             console.log(postId)
//       const response = await httpClient.get(`${API_ENDPOINTS.COMMENT}/get-comments-for-post`,{
//         params: {
//             postId
//         }
//       })

//       return response

//     }catch(error) {
//       ErrorHandler(error)
//     }
//   }


  async removeUpvoteFromPost({postId}) {
    try{
      if(!postId || postId === "") throw new Error("Upvote id is required")

      await httpClient.delete(`${API_ENDPOINTS.UPVOTE}/remove-upvote-from-post`, {
        params: {
          postId
        }
      })

      return true
    }catch(error) {
      ErrorHandler(error)
    }
  }
}

export default new UpvoteService();
