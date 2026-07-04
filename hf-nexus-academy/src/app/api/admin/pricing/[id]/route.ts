import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  priceUSDCents: z.number().int().min(0).optional(),
  priceGBPCents: z.number().int().min(0).optional(),
  priceEURCents: z.number().int().min(0).optional(),
  features: z.array(z.string()).optional(),
  isHighlighted: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
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
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }

    const plan = await prisma.pricingPlan.findUnique({ where: { id } });
    if (!plan) return NextResponse.json({ error: "Plan not found." }, { status: 404 });

    const updated = await prisma.pricingPlan.update({ where: { id }, data: parsed.data });
    return NextResponse.json({ plan: updated });
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
    if (!plan) return NextResponse.json({ error: "Plan not found." }, { status: 404 });

    const paymentCount = await prisma.payment.count({ where: { planKey: plan.key } });
    if (paymentCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete — ${paymentCount} payment(s) reference this plan. Unpublish it instead.` },
        { status: 409 }
      );
    }

    await prisma.pricingPlan.delete({ where: { id } });
    return NextResponse.json({ message: "Plan deleted." });
  } catch (error) {
    console.error("Admin delete pricing plan error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
