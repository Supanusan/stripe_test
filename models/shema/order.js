import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipped", "Delivered"],
      default: "Pending",
    },
    paymentMethod: { type: String, enum: ["COD", "Online"], default: "COD" },

    street: String,
    city: String,
    province: String,
  },
  { timestamps: true },
);
export const Order = mongoose.model("Order", orderSchema);
