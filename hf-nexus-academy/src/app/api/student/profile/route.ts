import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2).max(100),
  country: z.string().optional(),
  whatsapp: z.string().optional(),
  age: z.coerce.number().int().min(3).max(100).optional(),
});

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "STUDENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input.", details: parsed.error.flatten() }, { status: 400 });
    }

    const { name, country, whatsapp, age } = parsed.data;

    await prisma.$transaction([
      prisma.user.update({
        where: { id: session.user.id },
        data: { name, country, whatsapp },
      }),
      prisma.student.update({
        where: { userId: session.user.id },
        data: { age },
      }),
    ]);

    return NextResponse.json({ message: "Profile updated successfully." });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
