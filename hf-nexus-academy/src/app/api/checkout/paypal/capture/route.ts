import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPayPalClient, paypal } from "@/lib/paypal";

const schema = z.object({ orderId: z.string().min(1) });

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "STUDENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const client = getPayPalClient();
    const request = new paypal.orders.OrdersCaptureRequest(parsed.data.orderId);
    request.requestBody({});

    const capture = await client.execute(request);
    const result = capture.result;

    if (result.status !== "COMPLETED") {
      return NextResponse.json({ error: "Payment was not completed." }, { status: 402 });
    }

    const purchaseUnit = result.purchase_units?.[0];
    const captureDetails = purchaseUnit?.payments?.captures?.[0];
    const customId = purchaseUnit?.custom_id || captureDetails?.custom_id;

    if (!customId) {
      console.error("PayPal capture missing custom_id metadata:", result.id);
      return NextResponse.json({ error: "Payment metadata missing." }, { status: 500 });
    }

    const { studentId, planKey, courseId } = JSON.parse(customId) as {
      studentId: string;
      planKey?: string;
      courseId?: string;
    };

    const amountCents = Math.round(parseFloat(captureDetails?.amount?.value ?? "0") * 100);
    const currency = captureDetails?.amount?.currency_code ?? "USD";

    await prisma.payment.upsert({
      where: { providerRef: result.id! },
      update: { status: "SUCCEEDED" },
      create: {
        studentId,
        provider: "PAYPAL",
        providerRef: result.id!,
        planKey: planKey || undefined,
        courseId: courseId || undefined,
        billingCycle: "MONTHLY",
        amountCents,
        currency,
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

    return NextResponse.json({ message: "Payment successful." });
  } catch (error) {
    console.error("PayPal capture error:", error);
    return NextResponse.json(
      { error: "We couldn't confirm your payment right now. Please contact support with your order details." },
      { status: 500 }
    );
  }
}
