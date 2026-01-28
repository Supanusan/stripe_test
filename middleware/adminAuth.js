// middleware/adminMiddleware.js
import { errorResponse } from "../utils/responseHelper.js";

export const adminMiddleware = (req, res, next) => {
  try {
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
