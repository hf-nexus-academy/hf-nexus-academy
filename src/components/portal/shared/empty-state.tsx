import { type LucideIcon } from "lucide-react";

export function PortalEmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center rounded-lg border border-dashed border-ink-300/25 bg-white py-16 px-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cream-100 mb-4">
        <Icon className="h-6 w-6 text-gold-600" />
      </div>
      <h3 className="font-display text-lg text-navy-950 mb-1.5">{title}</h3>
      <p className="text-sm text-ink-500 max-w-sm mb-5">{description}</p>
      {action}
    </div>
  );
}
