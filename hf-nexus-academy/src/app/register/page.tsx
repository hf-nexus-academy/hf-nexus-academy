import type { Metadata } from "next";
import { AuthShell } from "@/components/layout/auth-shell";
import { RegisterForm } from "@/components/forms/register-form";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your free HF Nexus Academy student account.",
};

export default function RegisterPage() {
  return (
    <AuthShell title="Create your account" subtitle="Join students worldwide learning with HF Nexus Academy.">
      <RegisterForm />
    </AuthShell>
  );
}
