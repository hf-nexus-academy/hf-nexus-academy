import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireStripe } from "@/lib/stripe";
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

    const stripe = requireStripe();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (parsed.data.planKey) {
      const plan = await prisma.pricingPlan.findUnique({ where: { key: parsed.data.planKey } });
      if (!plan || !plan.isPublished) {
        return NextResponse.json({ error: "This plan is not available." }, { status: 404 });
      }
      if (!plan.stripePriceId) {
        return NextResponse.json(
          { error: "This plan is not yet configured for checkout. Please contact support." },
          { status: 503 }
        );
      }

      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [{ price: plan.stripePriceId, quantity: 1 }],
        customer_email: session.user.email ?? undefined,
        success_url: `${appUrl}/student/billing?success=true`,
        cancel_url: `${appUrl}/pricing?canceled=true`,
        metadata: { studentId: student.id, planKey: plan.key },
      });

      return NextResponse.json({ url: checkoutSession.url });
    }

    const course = await prisma.course.findUnique({ where: { id: parsed.data.courseId } });
    if (!course || !course.isPublished || !course.enrollmentOpen) {
      return NextResponse.json({ error: "This course is not available for enrollment." }, { status: 404 });
    }
    if (!course.priceMonthlyCents) {
      return NextResponse.json({ error: "This course does not have a price configured." }, { status: 503 });
    }

    // Individual courses don't have a pre-created Stripe Price object (admins
    // shouldn't need to touch Stripe's dashboard to add a course), so the price
    // is supplied inline via price_data instead of referencing a Price ID.
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: course.priceCurrency ?? "USD",
            product_data: { name: course.title },
            unit_amount: course.priceMonthlyCents,
          },
          quantity: 1,
        },
      ],
      customer_email: session.user.email ?? undefined,
      success_url: `${appUrl}/student/billing?success=true`,
      cancel_url: `${appUrl}/courses/${course.slug}/enroll?canceled=true`,
      metadata: { studentId: student.id, courseId: course.id },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "We couldn't start checkout right now. Please try again or contact support." },
      { status: 500 }
    );
  }
}
