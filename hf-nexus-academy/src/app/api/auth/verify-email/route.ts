import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const schema = z.object({ token: z.string().min(1) });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid token." }, { status: 400 });
    }

    const { token } = parsed.data;

    const verification = await prisma.verificationRequest.findUnique({
      where: { token },
    });

    if (!verification || verification.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "This verification link is invalid or has expired." },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: verification.userId },
        data: { emailVerified: new Date() },
      }),
      prisma.verificationRequest.delete({ where: { id: verification.id } }),
    ]);

    return NextResponse.json({ message: "Email verified successfully." });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
