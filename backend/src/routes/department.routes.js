import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addNewDepartment, removeDepartment } from "../controllers/department.controllers.js";
import { authorizeRole } from "../middlewares/authRole.middleware.js";

const departmentRouter = Router()

departmentRouter.route("/add-new-department").post(
    verifyJWT,
    authorizeRole("admin"),
    addNewDepartment
)

departmentRouter.route("/remove-department").delete(
    verifyJWT,
    authorizeRole("admin"),
    removeDepartment
)

export default departmentRouter