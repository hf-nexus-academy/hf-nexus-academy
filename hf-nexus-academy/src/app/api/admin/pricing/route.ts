import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  key: z.string().min(1).regex(/^[A-Z0-9_]+$/, "Key must be uppercase letters, numbers, or underscores."),
  name: z.string().min(1),
  description: z.string().min(1),
  priceUSDCents: z.number().int().min(0),
  priceGBPCents: z.number().int().min(0),
  priceEURCents: z.number().int().min(0),
  features: z.array(z.string()),
  isHighlighted: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
  stripePriceId: z.string().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const plans = await prisma.pricingPlan.findMany({ orderBy: { displayOrder: "asc" } });
    return NextResponse.json({ plans });
  } catch (error) {
    console.error("Admin list pricing plans error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input.", details: parsed.error.flatten() }, { status: 400 });
    }

    const existing = await prisma.pricingPlan.findUnique({ where: { key: parsed.data.key } });
    if (existing) {
      return NextResponse.json({ error: "A plan with this key already exists." }, { status: 409 });
    }

    const plan = await prisma.pricingPlan.create({ data: parsed.data });
    return NextResponse.json({ plan }, { status: 201 });
  } catch (error) {
    console.error("Admin create pricing plan error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
