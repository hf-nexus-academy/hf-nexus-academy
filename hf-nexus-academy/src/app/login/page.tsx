import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/layout/auth-shell";
import { LoginForm } from "@/components/forms/login-form";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your HF Nexus Academy student, teacher, or admin portal.",
};

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Log in to continue your learning journey.">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
