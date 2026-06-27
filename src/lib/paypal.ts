import paypal from "@paypal/checkout-server-sdk";

function getPayPalEnvironment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return null;
  }

  return process.env.PAYPAL_MODE === "live"
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

export function getPayPalClient() {
  const environment = getPayPalEnvironment();
  if (!environment) {
    throw new Error(
      "PayPal is not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in your environment variables."
    );
  }
  return new paypal.core.PayPalHttpClient(environment);
}

export { paypal };
