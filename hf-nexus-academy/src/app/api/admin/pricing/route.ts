import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  key: z
    .string()
    .min(2)
    .max(40)
    .regex(/^[A-Z0-9_]+$/, "Use uppercase letters, numbers, and underscores only (e.g. STARTER)."),
  name: z.string().min(2).max(100),
  description: z.string().min(2).max(500),
  priceUSDCents: z.coerce.number().int().min(0),
  priceGBPCents: z.coerce.number().int().min(0),
  priceEURCents: z.coerce.number().int().min(0),
  features: z.array(z.string().min(1)).default([]),
  isHighlighted: z.boolean().default(false),
  displayOrder: z.coerce.number().int().default(0),
  stripePriceId: z.string().optional(),
});

export async function POST(req: Request) {
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

    const existing = await prisma.pricingPlan.findUnique({ where: { key: parsed.data.key } });
    if (existing) {
      return NextResponse.json({ error: "A plan with this key already exists." }, { status: 409 });
    }

    const plan = await prisma.pricingPlan.create({ data: parsed.data });

    return NextResponse.json({ message: "Pricing plan created.", plan }, { status: 201 });
  } catch (error) {
    console.error("Admin create pricing plan error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
