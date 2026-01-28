import express from "express";
import { check } from "express-validator";
import { validate } from "../middleware/validate.js";
import { errorResponse, successResponse } from "../utils/responseHelper.js";
import { Product } from "../models/shema/product.js";
import upload from "../utils/cloudinaryUpload.js";
import { Order } from "../models/shema/order.js";

const router = express.Router();

// --- ADD PRODUCT --- (/add_product)
router.post(
  "/add_product",
  upload.single("image"),
  check("title").notEmpty().withMessage("Title required!"),
  check("description").notEmpty().withMessage("Description required!"),
  check("price").notEmpty().withMessage("Price required!"),
  check("category").notEmpty().withMessage("Category required!"),
  check("stock").notEmpty().withMessage("Stock required!"),
  validate,
  async (req, res) => {
    try {
      console.log(req.file);
      const { title, description, price, category, stock } = req.body;

      if (!req.file) return errorResponse(res, "Image required!");

      const created = await Product.create({
        title,
        description,
        price,
        category,
        stock,
        images: [req.file.path],
      });

      return successResponse(res, "Product successfully added!", created);
    } catch (error) {
      console.error(error);
      return errorResponse(res, "Something went wrong.");
    }
  },
);

// --- UPDATE PRODUCT --- (/:id)
router.put(
  "/:id",
  upload.single("image"),
  check("title").notEmpty().withMessage("Title required!"),
  check("description").notEmpty().withMessage("Description required!"),
  check("price").notEmpty().withMessage("Price required!"),
  check("category").notEmpty().withMessage("Category required!"),
  check("stock").notEmpty().withMessage("Stock required!"),
  validate,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, price, category, stock } = req.body;

      const updateData = { title, description, price, category, stock };
      if (req.file) updateData.images = [req.file.path];

      const updated = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!updated) return errorResponse(res, "Product not found!");

      return successResponse(res, "Product successfully updated!", updated);
    } catch (error) {
      console.error(error);
      return errorResponse(res, "Something went wrong.");
    }
  },
);

// --- DELETE PRODUCT --- (/:id)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) return errorResponse(res, "Product not found!");

    return successResponse(res, "Product deleted successfully!", deleted);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Something went wrong.");
  }
});

// --- GET ALL ORDERS --- (/all_orders)
router.get("/all_orders", async (req, res) => {
  try {
    const all_orders = await Order.find().populate("items.Product");
    return successResponse(res, "All orders fetched successfully!", all_orders);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Something went wrong.");
  }
});

// --- GET SINGLE ORDER --- (/single_order/:id)
router.get("/single_order/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return errorResponse(res, "Order ID not found!");

    const order = await Order.findById(id).populate("items.product");
    if (!order) return errorResponse(res, "Order not found!");

    return successResponse(res, "Order fetched successfully!", order);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Something went wrong.");
  }
});

export default router;
