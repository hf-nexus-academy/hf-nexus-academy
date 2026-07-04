import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/layout/auth-shell";
import { VerifyEmailStatus } from "@/components/forms/verify-email-status";

export const metadata: Metadata = {
  title: "Verify Email",
};

export default function VerifyEmailPage() {
  return (
    <AuthShell title="Email Verification" subtitle="Confirming your HF Nexus Academy account.">
      <Suspense>
        <VerifyEmailStatus />
      </Suspense>
    </AuthShell>
  );
}
