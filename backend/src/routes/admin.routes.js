import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { authorizeRole } from "../middlewares/authRole.middleware.js"
import { ApproveReport, RejectReport } from "../controllers/admin.controllers.js"
const adminRouter = Router()

// add to cart
adminRouter.route('/approve-report').post(
    verifyJWT,
    authorizeRole('admin'),
    ApproveReport
)

// remove from cart
adminRouter.route('/reject-report').post(
    verifyJWT,
    authorizeRole('admin'),
    RejectReport
)

// get all products in cart
// cartRouter.route('/get-cart-products').get(
//     verifyJWT,
//     authorizeRole('admin','customer'),
//     getCartProducts
// )

export default adminRouter