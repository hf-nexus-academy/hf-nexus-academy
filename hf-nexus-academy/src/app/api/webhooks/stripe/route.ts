import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { prisma } from "@/lib/prisma";
import { requireStripe } from "@/lib/stripe";

// Stripe webhooks must receive the raw request body to verify the signature.
export const runtime = "nodejs";

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured.");
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    const stripe = requireStripe();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        const studentId = checkoutSession.metadata?.studentId;
        const plan = checkoutSession.metadata?.plan;

        if (studentId && plan && checkoutSession.id) {
          await prisma.payment.upsert({
            where: { providerRef: checkoutSession.id },
            update: { status: "SUCCEEDED" },
            create: {
              studentId,
              provider: "STRIPE",
              providerRef: checkoutSession.id,
              planKey: plan,
              billingCycle: "MONTHLY",
              amountCents: checkoutSession.amount_total ?? 0,
              currency: (checkoutSession.currency ?? "usd").toUpperCase(),
              status: "SUCCEEDED",
            },
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        // Best-effort: mark the most recent pending payment for this customer as failed.
        if (invoice.customer_email) {
          const student = await prisma.student.findFirst({
            where: { user: { email: invoice.customer_email } },
          });
          if (student) {
            await prisma.payment.updateMany({
              where: { studentId: student.id, status: "PENDING" },
              data: { status: "FAILED" },
            });
          }
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        if (charge.payment_intent) {
          await prisma.payment.updateMany({
            where: { providerRef: String(charge.payment_intent) },
            data: { status: "REFUNDED" },
          });
        }
        break;
      }

      default:
        // Unhandled event types are acknowledged but ignored.
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed." }, { status: 500 });
  }
}
