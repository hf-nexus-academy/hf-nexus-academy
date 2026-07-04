import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { nanoid } from "nanoid";

import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  country: z.string().optional(),
  whatsapp: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password, country, whatsapp } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        // Return a generic success message to avoid confirming which emails
        // are registered on this platform (email enumeration prevention).
        { message: "If this email is not registered, your account has been created. Please check your inbox to verify." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        country,
        whatsapp,
        role: "STUDENT",
        student: {
          create: {},
        },
      },
    });

    const token = nanoid(40);
    await prisma.verificationRequest.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    await sendVerificationEmail(user.email, user.name, token);

    return NextResponse.json(
      {
        message: "Account created. Please check your email to verify your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
