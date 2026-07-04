"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";

export function DeleteButton({ endpoint, confirmMessage }: { endpoint: string; confirmMessage: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  async function handleDelete() {
    if (!window.confirm(confirmMessage)) return;

    setIsDeleting(true);
    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Could not delete.");
        return;
      }
      toast.success("Deleted successfully.");
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      aria-label="Delete"
      className="text-ink-300 hover:text-destructive transition-colors"
    >
      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </button>
  );
}
