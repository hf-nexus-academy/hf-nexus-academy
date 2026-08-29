"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Courses",
    href: "/courses",
    children: [
      { label: "Quran", href: "/courses/quran" },
      { label: "Hadith", href: "/courses/hadith" },
      { label: "Fiqh", href: "/courses/fiqh" },
      { label: "Arabic", href: "/courses/arabic" },
      { label: "Aqeedah", href: "/courses/aqeedah" },
      { label: "Logic (Mantiq)", href: "/courses/logic" },
    ],
  },
  { label: "Teachers", href: "/teachers" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

function portalPathForRole(role?: string) {
  if (role === "ADMIN") return "/admin";
  if (role === "TEACHER") return "/teacher";
  return "/student";
}

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [coursesOpen, setCoursesOpen] = React.useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        isScrolled
          ? "bg-navy-950/95 backdrop-blur-md shadow-lg"
          : "bg-navy-950"
      )}
    >
      <nav className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="font-display text-2xl text-cream-50 tracking-tight">
            HF Nexus <span className="text-gold-500">Academy</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href} className="relative group">
              {link.children ? (
                <button
                  className="flex items-center gap-1 text-sm font-medium text-cream-50/85 hover:text-gold-400 transition-colors py-2"
                  onMouseEnter={() => setCoursesOpen(true)}
                  onMouseLeave={() => setCoursesOpen(false)}
                >
                  {link.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                  <AnimatePresence>
                    {coursesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full w-56 rounded-md border border-gold-500/20 bg-navy-900 p-2 shadow-xl"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block rounded-sm px-3 py-2.5 text-sm text-cream-50/85 hover:bg-navy-800 hover:text-gold-400 transition-colors text-left"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              ) : (
                <Link
                  href={link.href}
                  className={cn(
                    "text-sm font-medium text-cream-50/85 hover:text-gold-400 transition-colors py-2",
                    pathname === link.href && "text-gold-500"
                  )}
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          {status === "authenticated" ? (
            <Button asChild variant="outline" size="sm" className="border-gold-500/40 text-cream-50 hover:bg-gold-500 hover:text-navy-950 hover:border-gold-500">
              <Link href={portalPathForRole(session?.user?.role)}>My Dashboard</Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm" className="text-cream-50 hover:bg-white/5">
              <Link href="/login">Log In</Link>
            </Button>
          )}
          <Button asChild variant="gold" size="sm">
            <Link href="/free-trial">Book Free Trial</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden text-cream-50 p-2"
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile nav panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden bg-navy-900 border-t border-white/10"
          >
            <div className="container py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-3 text-cream-50/90 font-medium border-b border-white/5"
                  >
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="pl-4 flex flex-col">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="py-2.5 text-sm text-cream-50/70"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="flex flex-col gap-3 mt-4">
                {status === "authenticated" ? (
                  <Button asChild variant="outline" className="border-gold-500/40 text-cream-50">
                    <Link href={portalPathForRole(session?.user?.role)}>My Dashboard</Link>
                  </Button>
                ) : (
                  <Button asChild variant="ghost" className="text-cream-50">
                    <Link href="/login">Log In</Link>
                  </Button>
                )}
                <Button asChild variant="gold">
                  <Link href="/free-trial">Book Free Trial</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
