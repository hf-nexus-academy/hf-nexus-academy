"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";

export function UserStatusToggle({
  userId,
  initialActive,
  endpoint,
}: {
  userId: string;
  initialActive: boolean;
  endpoint: string;
}) {
  const router = useRouter();
  const [isActive, setIsActive] = React.useState(initialActive);
  const [isPending, setIsPending] = React.useState(false);

  async function handleToggle(checked: boolean) {
    setIsPending(true);
    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: checked }),
      });

      if (!res.ok) {
        toast.error("Could not update status.");
        return;
      }

      setIsActive(checked);
      toast.success(checked ? "Account activated." : "Account deactivated.");
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Switch checked={isActive} onCheckedChange={handleToggle} disabled={isPending} aria-label="Toggle active status" />
      <span className="text-xs text-ink-500">{isActive ? "Active" : "Inactive"}</span>
    </div>
  );
}
