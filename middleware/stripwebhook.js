import Stripe from "stripe";
import { Order } from "../models/shema/order";

export const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = Stripe.webhooks.constructEvent(
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
        Product: session.metadata.item,
        quantity: session.metadata.count,
        price: session.metadata.amount,
        status,
        paymentMethod,
        shippingAddress: {
          street: session.metadata.shippingAddress.street,
          city: session.metadata.shippingAddress.city,
          province: session.metadata.shippingAddress.province,
        },
      });
      console.log("Order created successfully:", order);
    } catch (error) {
      console.error("Error creating order:", error);
      return errorResponse(res, "Error creating order");
    }
  }

  successResponse(res);
};
