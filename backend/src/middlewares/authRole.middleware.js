// this middleware will authorize the user if they have necessary user role to access a specific protected route
// this middleware must be called after verifyJWT where user is verified and details are available in req.user

// ex. how to use this ?
// Routes accessible only by admins
// router.get('/admin-only-route', verifyJWT, authorizeRoles('admin'), (req, res) => {
//     res.json({ message: 'Welcome, Admin!' });
//   });

import { ApiError } from "../utils/ApiError.js"

export const authorizeRole = (...authorizeRole) => {
    return (req,res,next) => {
        // get the role the user have
        const userRole = req.user?.role

        // check if the userRole contains in the authorizedRole for the route
        if(!userRole || !authorizeRole.includes(userRole)) {
            throw new ApiError(403, "You do not have permission to access this resource")
        }

        // else move to the next middleware
        next()
    }
}