"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <span className="font-display text-6xl text-gold-500 mb-4">!</span>
      <h1 className="font-display text-2xl text-navy-950 mb-2">Something went wrong</h1>
      <p className="text-ink-500 mb-8 max-w-sm">
        An unexpected error occurred. Please try again or contact support if the problem persists.
      </p>
      <Button onClick={reset} variant="primary">Try again</Button>
    </div>
  );
}
