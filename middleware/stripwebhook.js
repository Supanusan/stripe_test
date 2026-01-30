import stripe from "../config/stripe.js";
import { Order } from "../models/shema/order.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";

export const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  console.log("Running the webhook");

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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const order = await Order.create({
        user: session.metadata.user,
        product: session.metadata.items,
        quantity: session.metadata.count,
        price: session.metadata.totalAmount,
        paymentMethod: session.metadata.paymentMethod,
        street: session.metadata.street,
        city: session.metadata.city,
        province: session.metadata.province,
      });

      console.log("Order created successfully:", {
        product: order.product,
        quantity: order.quantity,
        price: order.price,
        paymentMethod: order.paymentMethod,
      });
      return successResponse(
        res,
        {
          product: order.product,
          quantity: order.quantity,
          price: order.price,
          paymentMethod: order.paymentMethod,
        },
        "Order created successfully:",
      );
    } catch (error) {
      console.error("Error creating order:", error);
      return errorResponse(res, "Error creating order");
    }
  }

  // Respond with 200 to Stripe
  // res.status(200).send("Webhook received successfully!");
};
