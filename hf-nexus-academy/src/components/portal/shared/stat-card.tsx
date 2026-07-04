import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "gold",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "gold" | "navy";
}) {
  return (
    <div className="rounded-lg border border-ink-300/15 bg-white p-5 flex items-center gap-4">
      <div
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-md shrink-0",
          accent === "gold" ? "bg-gold-100 text-gold-700" : "bg-navy-950 text-gold-400"
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-display text-2xl text-navy-950 leading-tight">{value}</p>
        <p className="text-xs text-ink-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}
