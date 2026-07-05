import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireStripe } from "@/lib/stripe";
import { CURRENCIES } from "@/lib/constants";

const schema = z.object({
  plan: z.string().min(1),
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

    const plan = await prisma.pricingPlan.findUnique({ where: { key: parsed.data.plan } });
    if (!plan || !plan.isPublished) {
      return NextResponse.json({ error: "This plan is not available." }, { status: 404 });
    }

    if (!plan.stripePriceId) {
      return NextResponse.json(
        { error: "This plan is not yet configured for checkout. Please contact support." },
        { status: 503 }
      );
    }

    const stripe = requireStripe();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: plan.stripePriceId, quantity: 1 }],
      customer_email: session.user.email ?? undefined,
      success_url: `${appUrl}/student/billing?success=true`,
      cancel_url: `${appUrl}/pricing?canceled=true`,
      metadata: {
        studentId: student.id,
        plan: plan.key,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    const message = error instanceof Error ? error.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
