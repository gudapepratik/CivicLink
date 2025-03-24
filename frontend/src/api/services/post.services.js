import { API_ENDPOINTS } from "../apiConstants";
import httpClient from "../httpClient.js";
// import {triggerNotification} from '../../utils/triggerNotification.utils.js'
import ErrorHandler from "../../utils/ErrorHandler.utils.js";

export class PostService {
  async addNewPost({
    departmentId,
    title,
    description,
    latitude,
    longitude,
    images,
    address,
  }) {
    try {
      if (!images) throw new Error("Atleast one Image is required");

      const formData = new FormData();

      // Append fields to FormData
      formData.append("title", title);
      formData.append("description", description);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);
      formData.append("departmentId", departmentId);
      formData.append("address", address);
      console.log(images);
      images.forEach((image, index) => {
        formData.append("images", image); // Field name matches your multer configuration
      });

      // call the api
      const postResponse = await httpClient.post(
        `${API_ENDPOINTS.POST}/add-new-post`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Explicitly set content type
          },
        }
      );

      if (!postResponse)
        throw new Error("Error while creating new user account !!?");

      return postResponse;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async getPostsByLocation({ latitude, longitude, status}) {
    try {
      console.log(latitude, longitude);
      if (!latitude || !longitude) throw new Error("Location is missing");

      const response = await httpClient.get(
        `${API_ENDPOINTS.POST}/get-posts-by-location`,
        {
          params: {
            latitude,
            longitude,
            statusFilter: status
          },
        }
      );

      return response;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async getPostByID({ postId, userId }) {
    try {
      if (!postId) throw new Error("PostId is required");

      const response = await httpClient.get(
        `${API_ENDPOINTS.POST}/get-post-by-id`,
        {
          params: {
            postId,
            userId,
          },
        }
      );

      return response;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async getPostsByUser({ filter }) {
    try {
      console.log(filter);
      const reponse = await httpClient.get(
        `${API_ENDPOINTS.POST}/get-posts-by-user`,
        {
          params: {
            filter,
          },
        }
      );

      return reponse;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async deletePost({ postId }) {
    try {
      console.log(postId);
      await httpClient.delete(`${API_ENDPOINTS.POST}/remove-post`, {
        params: {
          postId,
        },
      });

      return true;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  // authority functions
  async getPostsByDepartmentAndLocation({ departmentId, latitude, longitude ,status}) {
    try {
      if (!departmentId || departmentId === "")
        throw new Error("deaprtment ID is missing");

      const response = await httpClient.get(
        `${API_ENDPOINTS.POST}/get-posts-by-department`,
        {
          params: {
            departmentId,
            latitude,
            longitude,
            statusFilter: status
          },
        }
      );

      return response;
    } catch (error) {
      ErrorHandler(error);
    }
  }
}

export default new PostService();
