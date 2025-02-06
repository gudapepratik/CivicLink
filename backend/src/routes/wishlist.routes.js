import { Router } from "express"
import { addProductToWishlist, getWishListProducts, removeProductFromWishlist } from "../controllers/wishlist.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { authorizeRole } from "../middlewares/authRole.middleware.js"

const wishlistRouter = Router()

// add to wishlist
wishlistRouter.route('/add-to-wishlist').post(
    verifyJWT,
    authorizeRole('admin','customer'),
    addProductToWishlist
)

wishlistRouter.route('/remove-from-wishlist').delete(
    verifyJWT,
    authorizeRole('admin','customer'),
    removeProductFromWishlist
)
wishlistRouter.route('/get-wishlist-products').get(
    verifyJWT,
    authorizeRole('admin','customer'),
    getWishListProducts
)


export default wishlistRouter