import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPayPalClient, paypal } from "@/lib/paypal";
import { CURRENCIES } from "@/lib/constants";

const schema = z
  .object({
    planKey: z.string().min(1).optional(),
    courseId: z.string().min(1).optional(),
    currency: z.enum(CURRENCIES).default("USD"),
  })
  .refine((data) => !!data.planKey !== !!data.courseId, {
    message: "Provide exactly one of planKey or courseId.",
  });

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "STUDENT") {
    return NextResponse.json({ error: "You must be logged in as a student to checkout." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const student = await prisma.student.findUnique({ where: { userId: session.user.id } });
    if (!student) {
      return NextResponse.json({ error: "Student profile not found." }, { status: 404 });
    }

    let amountCents: number;
    let description: string;
    let customId: string;
    let chargeCurrency: (typeof CURRENCIES)[number];

    if (parsed.data.planKey) {
      const plan = await prisma.pricingPlan.findUnique({ where: { key: parsed.data.planKey } });
      if (!plan || !plan.isPublished) {
        return NextResponse.json({ error: "This plan is not available." }, { status: 404 });
      }
      const priceField = `price${parsed.data.currency}Cents` as "priceUSDCents" | "priceGBPCents" | "priceEURCents";
      amountCents = plan[priceField];
      description = `HF Nexus Academy — ${plan.name} Plan (Monthly)`;
      customId = JSON.stringify({ studentId: student.id, planKey: plan.key });
      chargeCurrency = parsed.data.currency;
    } else {
      const course = await prisma.course.findUnique({ where: { id: parsed.data.courseId } });
      if (!course || !course.isPublished || !course.enrollmentOpen) {
        return NextResponse.json({ error: "This course is not available for enrollment." }, { status: 404 });
      }
      if (!course.priceMonthlyCents) {
        return NextResponse.json({ error: "This course does not have a price configured." }, { status: 503 });
      }
      // Courses are priced in a single fixed currency (course.priceCurrency).
      // The course's own currency is always used for the actual charge, regardless
      // of what currency the client requested — using the client-requested currency
      // here would silently charge the wrong amount (e.g. treating a $69 USD price
      // as £69 GBP), which is a real overcharge/undercharge risk.
      amountCents = course.priceMonthlyCents;
      description = `HF Nexus Academy — ${course.title}`;
      customId = JSON.stringify({ studentId: student.id, courseId: course.id });
      chargeCurrency = (course.priceCurrency as (typeof CURRENCIES)[number] | null) ?? "USD";
    }

    const amountValue = (amountCents / 100).toFixed(2);

    const client = getPayPalClient();
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: { currency_code: chargeCurrency, value: amountValue },
          description,
          custom_id: customId,
        },
      ],
    });

    const order = await client.execute(request);

    return NextResponse.json({ orderId: order.result.id });
  } catch (error) {
    console.error("PayPal create order error:", error);
    return NextResponse.json(
      { error: "We couldn't start checkout right now. Please try again or contact support." },
      { status: 500 }
    );
  }
}
