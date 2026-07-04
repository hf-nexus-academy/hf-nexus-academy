import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// Allow the module to load even without a key configured (e.g. local dev without
// Stripe set up yet); routes that actually use it will fail gracefully with a
// clear error rather than crashing the whole app at import time.
export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2024-12-18.acacia",
      typescript: true,
    })
  : null;

export function requireStripe(): Stripe {
  if (!stripe) {
    throw new Error(
      "Stripe is not configured. Set STRIPE_SECRET_KEY in your environment variables."
    );
  }
  return stripe;
}
