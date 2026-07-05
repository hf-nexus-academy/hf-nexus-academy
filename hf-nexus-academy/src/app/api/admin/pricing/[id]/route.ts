import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().min(2).max(500).optional(),
  priceUSDCents: z.coerce.number().int().min(0).optional(),
  priceGBPCents: z.coerce.number().int().min(0).optional(),
  priceEURCents: z.coerce.number().int().min(0).optional(),
  features: z.array(z.string().min(1)).optional(),
  isHighlighted: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  displayOrder: z.coerce.number().int().optional(),
  stripePriceId: z.string().nullable().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input.", details: parsed.error.flatten() }, { status: 400 });
    }

    await prisma.pricingPlan.update({ where: { id }, data: parsed.data });

    return NextResponse.json({ message: "Pricing plan updated." });
  } catch (error) {
    console.error("Admin update pricing plan error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const plan = await prisma.pricingPlan.findUnique({ where: { id } });
    if (!plan) {
      return NextResponse.json({ error: "Pricing plan not found." }, { status: 404 });
    }

    const paymentCount = await prisma.payment.count({ where: { planKey: plan.key } });
    if (paymentCount > 0) {
      return NextResponse.json(
        { error: "This plan has existing payments and can't be deleted. Unpublish it instead." },
        { status: 409 }
      );
    }

    await prisma.pricingPlan.delete({ where: { id } });
    return NextResponse.json({ message: "Pricing plan deleted." });
  } catch (error) {
    console.error("Admin delete pricing plan error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
