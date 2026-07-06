import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CheckoutButton({
  planKey,
  planName,
  highlighted,
}: {
  planKey: string;
  planName: string;
  highlighted?: boolean;
}) {
  return (
    <Button asChild variant={highlighted ? "gold" : "outline"} className="w-full">
      <Link href={`/contact?plan=${encodeURIComponent(planKey)}`}>
        Enroll in {planName}
      </Link>
    </Button>
  );
}
