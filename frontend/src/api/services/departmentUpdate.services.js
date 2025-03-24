import { API_ENDPOINTS } from "../apiConstants";
import httpClient from "../httpClient.js";
import ErrorHandler from "../../utils/ErrorHandler.utils.js";

export class departmentUpdateService {
  async addNewDepartmentUpdate({
    postId,
    docs,
    remark,
    updatedStatus,
    expectedResolutionDate,
  }) {
    try {
      const formData = new FormData();

      // Append fields to FormData
      formData.append("postId", postId);
      formData.append("remark", remark);
      formData.append("updatedStatus", updatedStatus);
      formData.append("expectedResolutionDate", expectedResolutionDate);
      console.log(docs);
      docs.forEach((pdf, index) => {
        formData.append("docs", pdf); // Field name matches your multer configuration
      });

      // call the api
      const departmentUpdateResponse = await httpClient.post(
        `${API_ENDPOINTS.DEPARTMENTUPDATE}/new-department-update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Explicitly set content type
          },
        }
      );

      if (!departmentUpdateResponse)
        throw new Error("Error while creating new department update !!?");

      return departmentUpdateResponse;
    } catch (error) {
      ErrorHandler(error);
    }
  }


  async getDepartmentUpdatesOnPost(postId) {
    try {
      if(!postId) throw new Error("Error getDepartmentUpdatesOnPost: PostId missing")
  
      const response = await httpClient.get(`${API_ENDPOINTS.DEPARTMENTUPDATE}/get-department-updates-on-post`, {
        params: {
          postId
        }
      })
  
      return response
    } catch (error) {
      ErrorHandler(error)
    }
  }
}

export default new departmentUpdateService();
