import { validationResult } from "express-validator";
import { errorResponse } from "../utils/responseHelper.js";

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, errors(), 400);
  }
  next();
};

export { validate };
