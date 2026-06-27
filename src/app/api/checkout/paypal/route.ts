import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPayPalClient, paypal } from "@/lib/paypal";
import { getPlanPriceCents, CURRENCIES } from "@/lib/constants";

const schema = z.object({
  plan: z.enum(["STARTER", "STANDARD", "PREMIUM"]),
  currency: z.enum(CURRENCIES).default("USD"),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "STUDENT") {
    return NextResponse.json({ error: "You must be logged in as a student to subscribe." }, { status: 401 });
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

    const amountCents = getPlanPriceCents(parsed.data.plan, parsed.data.currency);
    const amountValue = (amountCents / 100).toFixed(2);

    const client = getPayPalClient();
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: { currency_code: parsed.data.currency, value: amountValue },
          description: `HF Nexus Academy — ${parsed.data.plan} Plan (Monthly)`,
          custom_id: JSON.stringify({ studentId: student.id, plan: parsed.data.plan }),
        },
      ],
    });

    const order = await client.execute(request);

    return NextResponse.json({ orderId: order.result.id });
  } catch (error) {
    console.error("PayPal create order error:", error);
    const message = error instanceof Error ? error.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
