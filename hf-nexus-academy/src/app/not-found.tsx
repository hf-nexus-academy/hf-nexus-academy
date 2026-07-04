import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <span className="font-display text-6xl text-gold-500 mb-4">404</span>
      <h1 className="font-display text-2xl text-navy-950 mb-2">Page not found</h1>
      <p className="text-ink-500 mb-8 max-w-sm">
        The page you are looking for doesn't exist or may have been moved.
      </p>
      <Button asChild variant="primary">
        <Link href="/">Return to Home</Link>
      </Button>
    </div>
  );
}
