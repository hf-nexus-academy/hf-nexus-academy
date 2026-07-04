"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type Status = "loading" | "success" | "error";

export function VerifyEmailStatus() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = React.useState<Status>("loading");
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("This verification link is missing a token.");
      return;
    }

    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setStatus("error");
          setMessage(data.error || "Verification failed.");
          return;
        }
        setStatus("success");
        setMessage(data.message);
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      });
  }, [token]);

  return (
    <div className="flex flex-col items-center text-center gap-4 py-10">
      {status === "loading" && <Loader2 className="h-8 w-8 text-gold-600 animate-spin" />}
      {status === "success" && <CheckCircle2 className="h-10 w-10 text-emerald-600" />}
      {status === "error" && <XCircle className="h-10 w-10 text-destructive" />}

      <p className="text-sm text-ink-500 max-w-xs">
        {status === "loading" ? "Verifying your email address..." : message}
      </p>

      {status !== "loading" && (
        <Button asChild className="mt-2">
          <Link href="/login">Continue to Log In</Link>
        </Button>
      )}
    </div>
  );
}
