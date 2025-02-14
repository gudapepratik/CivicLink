import mongoose from "mongoose";
import { Department } from "../models/department.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// add a new department (admin only)
const addNewDepartment = asyncHandler(async (req,res) => {
    // get the required data
    const {name, description, address} = req.body

    // validate the data
    if(
        [name, description, address].some((field) => field === "")
    ) throw new ApiError(400, "Insufficient data")

    // create new deparment
    const response = await Department.create({
        name,
        description,
        address
    })

    if(!response) throw new ApiError(500, "Error occurred while creating new Department")

    res
    .status(201)
    .json(
        new ApiResponse(201, response, "New department Added successfully")
    )
})

// remove a department (admin only)
const removeDepartment = asyncHandler(async (req,res) => {
    // get the departmentID
    const {departmentId} = req.query

    // validate the id
    if (!mongoose.Types.ObjectId.isValid(departmentId)) throw new ApiError(400, "Invalid Department ID")

    // check if department exists or not
    const isExists = await Department.findById(departmentId)

    if(!isExists) throw new ApiError(400, "The department does not exists")

    // remove the department from database
    const deleteResponse = await Department.deleteOne({
        _id: departmentId
    })

    res
    .status(200)
    .json(
        new ApiResponse(200, {}, "the department is removed successfully")
    )
})

export {
    addNewDepartment,
    removeDepartment
}