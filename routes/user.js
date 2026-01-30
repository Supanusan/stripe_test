import express from "express";
import { body, check } from "express-validator";
import { validate } from "../middleware/validate.js";
import { errorResponse, successResponse } from "../utils/responseHelper.js";
import { Product } from "../models/shema/product.js";
import { authMiddleware } from "../middleware/authmiddleware.js";
import { Order } from "../models/shema/order.js";
import Stripe from "stripe";

const router = express.Router();

//All products
router.get("/products", async (req, res) => {
  const products = await Product.find();
  return successResponse(res, products);
});

// Single product details
router.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return errorResponse(res, "Product ID not found!");
    }

    const product = await Product.findById(id);
    if (!product) {
      return errorResponse(res, "Product not found !");
    }
    successResponse(res, product);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Something went wrong.");
  }
});

//Add to the order
router.post(
  "/new_order",
  authMiddleware,
  [
    // Validate items array
    check("items")
      .notEmpty()
      .withMessage("Items must be an array with at least one product"),

    // Validate totalAmount
    check("totalAmount")
      .isFloat({ min: 0 })
      .withMessage("Total amount must be a positive number"),

    // Validate paymentMethod
    check("paymentMethod")
      .optional()
      .isIn(["COD", "Online"])
      .withMessage("Payment method must be either COD or Online"),

    // Validate shippingAddress
    check("street").notEmpty().withMessage("Street is required"),
    check("city").notEmpty().withMessage("City is required"),
    check("province").notEmpty().withMessage("province is required"),
    validate,
  ],
  async (req, res) => {
    try {
      console.log(req.body, ` \n user.id is : ${req.user.id}`);
      const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
      const user = req.user?.id;
      if (!user) return errorResponse(res, "User not found!");

      // console.log(user_name);
      const {
        items,
        totalAmount,
        paymentMethod,
        street,
        count,
        city,
        province,
      } = req.body;
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "lkr",
              product_data: {
                name: items,
                // images: [item.image],
              },
              unit_amount: totalAmount * 100,
            },
            quantity: count,
          },
        ],
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/success`,
        cancel_url: `${process.env.CLIENT_URL}/cancel`,
        metadata: {
          user,
          items,
          totalAmount,
          paymentMethod,
          street,
          count,
          city,
          province,
        },
      });
      console.log("Order created successfully!");
      successResponse(res, session.url, "Order created successfully!");
    } catch (error) {
      console.error(error);
      return errorResponse(res, "Something went wrong.");
    }
  },
);

//get my all orders
router.get("/my_orders", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const myOrders = await Order.find({ user: userId }).populate("items.item");

    if (!myOrders || myOrders.length === 0) {
      return errorResponse(res, "No orders found for this user!");
    }

    return successResponse(res, "My orders fetched successfully!", myOrders);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Something went wrong.");
  }
});

export default router;
