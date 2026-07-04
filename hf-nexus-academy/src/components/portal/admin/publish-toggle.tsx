"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";

export function PublishToggle({
  initialPublished,
  endpoint,
  field = "isPublished",
  label = "Published",
}: {
  initialPublished: boolean;
  endpoint: string;
  field?: string;
  label?: string;
}) {
  const router = useRouter();
  const [isPublished, setIsPublished] = React.useState(initialPublished);
  const [isPending, setIsPending] = React.useState(false);

  async function handleToggle(checked: boolean) {
    setIsPending(true);
    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: checked }),
      });

      if (!res.ok) {
        toast.error("Could not update.");
        return;
      }

      setIsPublished(checked);
      toast.success(checked ? "Published." : "Unpublished.");
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Switch checked={isPublished} onCheckedChange={handleToggle} disabled={isPending} aria-label={label} />
      <span className="text-xs text-ink-500">{isPublished ? label : `Not ${label.toLowerCase()}`}</span>
    </div>
  );
}
