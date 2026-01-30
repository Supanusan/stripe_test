export const handleWebhook = async (req, res) => {
  console.log("🔥 WEBHOOK STARTED!");

  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.log("❌ Signature error:", err.message);
    return res.status(400).send("Webhook Error");
  }

  if (event.type === "checkout.session.completed") {
    console.log("✅ Payment Completed Event Received!");
  }

  return res.status(200).json({ received: true });
};
