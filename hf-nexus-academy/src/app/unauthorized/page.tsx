import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Access Restricted",
};

export default function UnauthorizedPage() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center py-20">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-50 mb-6">
        <ShieldAlert className="h-8 w-8 text-gold-600" />
      </div>
      <h1 className="font-display text-3xl text-navy-950 mb-3">
        This area isn&apos;t available to your account
      </h1>
      <p className="text-ink-500 max-w-md mb-8">
        The page you tried to open is restricted to a different role. If you believe
        this is a mistake, contact our support team.
      </p>
      <div className="flex gap-3">
        <Button asChild variant="primary">
          <Link href="/">Return Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">Contact Support</Link>
        </Button>
      </div>
    </div>
  );
}
