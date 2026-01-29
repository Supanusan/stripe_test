import stripe from "../config/stripe.js";
import { Order } from "../models/shema/order.js";
import { successResponse } from "../utils/responseHelper.js";

export const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      // Create order in database
      const order = await Order.create({
        user: session.metadata.user,
        Product: session.metadata.items,
        quantity: session.metadata.count,
        price: session.metadata.totalAmount,
        // status,
        paymentMethod,

        street: session.metadata.street,
        city: session.metadata.city,
        province: session.metadata.province,
      });
      const sanitize_user = (order) => {
        return {
          product: order.Product,
          quantity: order.quantity,
          price: order.price,
          paymentMethod: order.paymentMethod,
        };
      };

      console.log("Order created successfully ", sanitize_user(order));
    } catch (error) {
      console.error("Error creating order:", error);
      return errorResponse(res, "Error creating order");
    }
  }

  successResponse(res, "successfully Ordered !");
};
