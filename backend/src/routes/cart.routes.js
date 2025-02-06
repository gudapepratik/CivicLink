import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { authorizeRole } from "../middlewares/authRole.middleware.js"
import { addProductToCart, changeProductQuantity, changeProductSize, getCartProducts, removeProductFromCart } from "../controllers/cart.controllers.js"

const cartRouter = Router()

// add to cart
cartRouter.route('/add-to-cart').post(
    verifyJWT,
    authorizeRole('admin','customer'),
    addProductToCart
)

// remove from cart
cartRouter.route('/remove-from-cart').post(
    verifyJWT,
    authorizeRole('admin','customer'),
    removeProductFromCart
)

// get all products in cart
cartRouter.route('/get-cart-products').get(
    verifyJWT,
    authorizeRole('admin','customer'),
    getCartProducts
)

// get all products in cart
cartRouter.route('/change-product-quantity').post(
    verifyJWT,
    authorizeRole('admin','customer'),
    changeProductQuantity
)

// change product size
cartRouter.route('/change-product-size').post(
    verifyJWT,
    authorizeRole('admin','customer'),
    changeProductSize
)

export default cartRouter