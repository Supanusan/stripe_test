import Stripe from "stripe";

// Create a Stripe instance with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Export the stripe instance
export default stripe;
