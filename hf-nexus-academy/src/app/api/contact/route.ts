import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { sendContactLeadNotification } from "@/lib/email";

const contactSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  whatsapp: z.string().optional(),
  message: z.string().min(10).max(2000),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const lead = await prisma.contactLead.create({
      data: {
        fullName: data.fullName,
        email: data.email.toLowerCase(),
        whatsapp: data.whatsapp,
        message: data.message,
        source: "contact",
      },
    });

    await sendContactLeadNotification(data.fullName, data.email);

    return NextResponse.json(
      { message: "Your message has been received. We'll respond shortly.", id: lead.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form submission error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
