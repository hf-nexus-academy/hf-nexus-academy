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
        const planKey = checkoutSession.metadata?.planKey;
        const courseId = checkoutSession.metadata?.courseId;

        if (studentId && (planKey || courseId) && checkoutSession.id) {
          await prisma.payment.upsert({
            where: { providerRef: checkoutSession.id },
            update: { status: "SUCCEEDED" },
            create: {
              studentId,
              provider: "STRIPE",
              providerRef: checkoutSession.id,
              planKey: planKey || undefined,
              courseId: courseId || undefined,
              billingCycle: "MONTHLY",
              amountCents: checkoutSession.amount_total ?? 0,
              currency: (checkoutSession.currency ?? "usd").toUpperCase(),
              status: "SUCCEEDED",
            },
          });

          // If this payment was for an individual course, also create the
          // enrollment so the student gets immediate access — subscription
          // plan payments don't grant a specific course automatically since
          // plan-based access is enforced at the application level instead.
          if (courseId) {
            await prisma.enrollment.upsert({
              where: { studentId_courseId: { studentId, courseId } },
              update: { status: "ACTIVE" },
              create: { studentId, courseId, status: "ACTIVE" },
            });
          }
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
          const payment = await prisma.payment.findFirst({
            where: { providerRef: String(charge.payment_intent) },
          });

          if (payment) {
            await prisma.payment.update({
              where: { id: payment.id },
              data: { status: "REFUNDED" },
            });

            // Revoke access for refunded individual course purchases. Subscription
            // plan refunds are intentionally not auto-revoked here since plan
            // access can span multiple courses and is reviewed manually.
            if (payment.courseId) {
              await prisma.enrollment.updateMany({
                where: { studentId: payment.studentId, courseId: payment.courseId },
                data: { status: "CANCELLED" },
              });
            }
          }
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
