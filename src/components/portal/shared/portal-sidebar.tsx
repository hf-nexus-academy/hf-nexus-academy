"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut, LayoutDashboard, Users, GraduationCap, BookOpen, CreditCard, CalendarCheck, MessageSquareQuote, Newspaper, Megaphone, BarChart3, Home, Bell, FileText, Settings, UserPlus } from "lucide-react";

import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CreditCard,
  CalendarCheck,
  MessageSquareQuote,
  Newspaper,
  Megaphone,
  BarChart3,
  Home,
  Bell,
  FileText,
  Settings,
  UserPlus,
};

export interface PortalNavItem {
  label: string;
  href: string;
  iconName: string;
}

export function PortalSidebar({
  navItems,
  portalLabel,
}: {
  navItems: readonly PortalNavItem[];
  portalLabel: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-navy-950 text-cream-50 min-h-[calc(100vh-5rem)]">
      <div className="p-6 border-b border-white/10">
        <p className="font-display text-lg text-cream-50">HF Nexus Academy</p>
        <p className="text-xs text-gold-500 mt-1 tracking-wide uppercase">{portalLabel}</p>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = ICON_MAP[item.iconName];
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-gold-500 text-navy-950"
                  : "text-cream-50/70 hover:bg-white/5 hover:text-cream-50"
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-medium text-cream-50/70 hover:bg-white/5 hover:text-cream-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>
    </aside>
  );
}

export function PortalMobileNav({
  navItems,
}: {
  navItems: readonly PortalNavItem[];
}) {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden sticky top-20 z-30 bg-navy-950 border-b border-white/10 overflow-x-auto">
      <div className="flex gap-1 px-3 py-2 min-w-max">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = ICON_MAP[item.iconName];
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors",
                active ? "bg-gold-500 text-navy-950" : "text-cream-50/70"
              )}
            >
              {Icon && <Icon className="h-3.5 w-3.5" />}
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
