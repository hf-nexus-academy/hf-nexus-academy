import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const FROM = process.env.EMAIL_FROM || "HF Nexus Academy <noreply@hf-nexus.com>";

function emailShell(title: string, bodyHtml: string) {
  return `
  <div style="font-family: Georgia, 'Times New Roman', serif; background-color: #FAF8F3; padding: 32px 16px;">
    <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #F3EEE3; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0A1628; padding: 28px 32px;">
        <span style="color: #E3CD96; font-size: 20px; letter-spacing: 0.04em; font-weight: 600;">HF Nexus Academy</span>
      </div>
      <div style="padding: 32px;">
        <h1 style="color: #0A1628; font-size: 20px; margin: 0 0 16px;">${title}</h1>
        <div style="color: #2D3548; font-size: 15px; line-height: 1.6;">
          ${bodyHtml}
        </div>
      </div>
      <div style="background-color: #F3EEE3; padding: 16px 32px; color: #5B6377; font-size: 12px;">
        HF Nexus Academy — hf-nexus.com
      </div>
    </div>
  </div>`;
}

export async function sendVerificationEmail(to: string, name: string, token: string) {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`;

  if (!process.env.RESEND_API_KEY) {
    console.warn(`[email] RESEND_API_KEY not set. Verification link for ${to}: ${verifyUrl}`);
    return;
  }

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Verify your HF Nexus Academy account",
    html: emailShell(
      `Welcome, ${name}`,
      `<p>Thank you for registering with HF Nexus Academy. Please confirm your email address to activate your account.</p>
       <p style="margin: 24px 0;">
         <a href="${verifyUrl}" style="background-color: #0A1628; color: #E3CD96; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-size: 14px;">Verify Email Address</a>
       </p>
       <p style="font-size: 13px; color: #5B6377;">This link expires in 24 hours. If you did not create this account, you can safely ignore this email.</p>`
    ),
  });
}

export async function sendPasswordResetEmail(to: string, name: string, token: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  if (!process.env.RESEND_API_KEY) {
    console.warn(`[email] RESEND_API_KEY not set. Reset link for ${to}: ${resetUrl}`);
    return;
  }

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Reset your HF Nexus Academy password",
    html: emailShell(
      `Hi ${name},`,
      `<p>We received a request to reset your password. Click below to choose a new one.</p>
       <p style="margin: 24px 0;">
         <a href="${resetUrl}" style="background-color: #0A1628; color: #E3CD96; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-size: 14px;">Reset Password</a>
       </p>
       <p style="font-size: 13px; color: #5B6377;">This link expires in 1 hour. If you did not request this, you can safely ignore this email.</p>`
    ),
  });
}

export async function sendContactLeadNotification(leadName: string, leadEmail: string, course?: string) {
  const receiver = process.env.CONTACT_RECEIVER_EMAIL;
  if (!receiver || !process.env.RESEND_API_KEY) {
    console.warn(`[email] Lead notification skipped (missing config). Lead: ${leadName} <${leadEmail}>`);
    return;
  }

  await resend.emails.send({
    from: FROM,
    to: receiver,
    subject: `New lead: ${leadName}`,
    html: emailShell(
      "New Free Trial / Contact Submission",
      `<p><strong>Name:</strong> ${leadName}</p>
       <p><strong>Email:</strong> ${leadEmail}</p>
       ${course ? `<p><strong>Course interest:</strong> ${course}</p>` : ""}`
    ),
  });
}
