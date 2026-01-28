// Login and acc creation

import express from "express";
import { errorResponse, successResponse } from "../utils/responseHelper.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { User } from "../models/shema/user.js";
import { comparePassword, hashPassword } from "../utils/passwordHelper.js";
import jwt from "jsonwebtoken";
import { validateEmail } from "../utils/validateEmail.js";
import { check } from "express-validator";
import { validate } from "../middleware/validate.js";
const router = express.Router();

//acc creation router (/register)
router.post(
  "/register",
  [
    check("email", "Credentials not provided").notEmpty().isEmail(),
    check("password", "Credentials not provided"),
    check("phone", "Tel No not provided"),
  ],
  validate,
  authLimiter,
  async (req, res) => {
    try {
      const { email, password, name, phone } = req.body;

      const validEmail = await validateEmail(email);
      if (!validEmail) {
        return errorResponse(res, "Not a validEmail", 400);
      }
      const user = await User.findOne({ email });

      if (!user) {
        const hashedPassword = await hashPassword(password);

        const newAcc = await User.create({
          email,
          password: hashedPassword,
          name,
          phone,
        });
        return res.status(201).json({
          message: "successfully Created",
        });
      }
      return res.status(409).json({ message: "User already exists" });
    } catch (error) {
      return errorResponse(res, "Internal server error", 500);
    }
  },
);

// login router (/login)
router.post(
  "/login",
  [
    check("email", "Credentials not provided").notEmpty().isEmail(),
    check("password", "Credentials not provided"),
  ],
  validate,
  authLimiter,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return errorResponse(res, "Invalid credentials", 401);
        // return res.render("register");
      }
      const passwordMatch = await comparePassword(password, user.password);
      if (!passwordMatch) {
        return errorResponse(res, "Invalid credentials", 401);
      }
      const jwt_Token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        },
      );
      res.cookie("token", jwt_Token, {
        httpOnly: true,
        sameSite: "strict",
        //1h
        maxAge: 1 * 60 * 60 * 1000,
      });
      return successResponse(res, "Login successful", 200);
    } catch (error) {
      return errorResponse(res, "Internal server error", 500);
    }
  },
);

export default router;
