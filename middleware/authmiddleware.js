import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/responseHelper.js";

export const authMiddleware = (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies?.token;

    // console.log(token);
    if (!token) {
      console.log("Token is not found");
      return errorResponse(res, "Token is not found", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // console.log("noo error");
    next();
  } catch (error) {
    console.log(error.message);
    return errorResponse(res, "Token is invalid", 400);
  }
};

//admin auth
export const adminMiddleware = (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies?.token;

    if (!token) {
      console.log("Token is not found");
      return errorResponse(res, "Token is not found", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    const { role } = req.user;

    if (role !== "admin") {
      return errorResponse(res, "Access denied");
    }

    next(); // user is admin, continue to the route
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Something went wrong.");
  }
};
