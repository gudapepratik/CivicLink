import { API_ENDPOINTS } from "../apiConstants";
import httpClient from "../httpClient.js";
import ErrorHandler from "../../utils/ErrorHandler.utils.js";

export class departmentService {
  async getDepartments() {
    try {
      const response = await httpClient.get(
        `${API_ENDPOINTS.DEPARTMENT}/get-departments`
      );

      return response;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  async getDepartmentById(id) {
    try {
      const response = await httpClient.get(
        `${API_ENDPOINTS.DEPARTMENT}/get-department-by-id`,
        {
          params: {
            id,
          },
        }
      );

      return response;
    } catch (error) {
      ErrorHandler(error);
    }
  }
}

export default new departmentService();
