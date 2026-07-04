import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

interface PayPalWebhookEvent {
  event_type: string;
  resource: {
    id: string;
    status?: string;
    custom_id?: string;
    amount?: { value: string; currency_code: string };
    supplementary_data?: {
      related_ids?: { order_id?: string };
    };
  };
}

/**
 * Verifies the webhook signature against PayPal's verification API.
 * Requires PAYPAL_WEBHOOK_ID to be configured (from the PayPal Developer Dashboard).
 */
async function verifyWebhookSignature(headers: Headers, rawBody: string): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!webhookId || !clientId || !clientSecret) {
    console.error("PayPal webhook verification is not fully configured.");
    return false;
  }

  const base =
    process.env.PAYPAL_MODE === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

  const tokenRes = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const { access_token } = await tokenRes.json();

  const verifyRes = await fetch(`${base}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      auth_algo: headers.get("paypal-auth-algo"),
      cert_url: headers.get("paypal-cert-url"),
      transmission_id: headers.get("paypal-transmission-id"),
      transmission_sig: headers.get("paypal-transmission-sig"),
      transmission_time: headers.get("paypal-transmission-time"),
      webhook_id: webhookId,
      webhook_event: JSON.parse(rawBody),
    }),
  });

  const verification = await verifyRes.json();
  return verification.verification_status === "SUCCESS";
}

export async function POST(req: Request) {
  const rawBody = await req.text();

  const isValid = await verifyWebhookSignature(req.headers, rawBody).catch((err) => {
    console.error("PayPal webhook verification error:", err);
    return false;
  });

  if (!isValid) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  const event = JSON.parse(rawBody) as PayPalWebhookEvent;

  try {
    switch (event.event_type) {
      case "PAYMENT.CAPTURE.COMPLETED": {
        const customId = event.resource.custom_id;
        if (customId) {
          const { studentId, planKey, courseId } = JSON.parse(customId) as {
            studentId: string;
            planKey?: string;
            courseId?: string;
          };
          const amountCents = Math.round(parseFloat(event.resource.amount?.value ?? "0") * 100);

          await prisma.payment.upsert({
            where: { providerRef: event.resource.id },
            update: { status: "SUCCEEDED" },
            create: {
              studentId,
              provider: "PAYPAL",
              providerRef: event.resource.id,
              planKey: planKey || undefined,
              courseId: courseId || undefined,
              billingCycle: "MONTHLY",
              amountCents,
              currency: event.resource.amount?.currency_code ?? "USD",
              status: "SUCCEEDED",
            },
          });

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

      case "PAYMENT.CAPTURE.REFUNDED": {
        const payment = await prisma.payment.findFirst({
          where: { providerRef: event.resource.id },
        });

        if (payment) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: { status: "REFUNDED" },
          });

          if (payment.courseId) {
            await prisma.enrollment.updateMany({
              where: { studentId: payment.studentId, courseId: payment.courseId },
              data: { status: "CANCELLED" },
            });
          }
        }
        break;
      }

      case "PAYMENT.CAPTURE.DENIED": {
        await prisma.payment.updateMany({
          where: { providerRef: event.resource.id },
          data: { status: "FAILED" },
        });
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("PayPal webhook handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed." }, { status: 500 });
  }
}
