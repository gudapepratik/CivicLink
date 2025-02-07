import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { authorizeRole } from "../middlewares/authRole.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import { addNewProduct, deleteProductById, getProductById, getProducts, getProductsByCategories, getProductsBySeller, updateProductDetails } from "../controllers/product.controllers.js"

const productRouter = Router()

// get product route (not protected, anyone can access this route)
productRouter.route('/get-products').get(getProducts)
productRouter.route('/get-products-by-categories').get(getProductsByCategories)

productRouter.route('/get-product-by-id/:id').get(getProductById)

// first verify the user, then verify the user role, then use multer to upload files to local storage
productRouter.route('/add-new-product').post(
    verifyJWT,
    authorizeRole('admin','seller'),
    upload.fields([
        {
            name: 'image', 
            maxCount: 1
        }
    ]),
    addNewProduct
)

productRouter.route('/update-product-details').post(
    verifyJWT,
    authorizeRole('admin','seller'),
    updateProductDetails
)
productRouter.route('/get-products-by-seller').get(
    verifyJWT,
    authorizeRole('admin','seller'),
    getProductsBySeller
)

productRouter.route('/delete-product-by-id/:id').post(
    verifyJWT,
    authorizeRole('admin','seller'),
    deleteProductById
)


export default productRouter