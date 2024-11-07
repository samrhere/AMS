import { User } from "../models/User.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import jwt, { decode } from "jsonwebtoken";

export const verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) {
            return next(errorHandler(401, "Unauthorized: No token Provided!"))
        }
        
        const decoded = jwt.verify(token, process.env.SECRET)

        if(!decoded) {
            return next(errorHandler(401, "Unauthorized: No token Provided!"))
        }

        const user = await User.findById(decoded.userId).select("-password")

        if(!user) {
            return next(errorHandler(404, "User not found!"))
        }

        req.user = user;
        next();

    } catch (error) {
        next(error);
        console.log(error.message);
    }
}