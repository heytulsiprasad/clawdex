"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Plus } from "lucide-react";

const NAV_LINKS = [
  { href: "/browse", label: "Browse" },
  { href: "/categories", label: "Categories" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Gradient line at the very top */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

      <div className="bg-white/80 backdrop-blur-xl border-b border-stone-200/80">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="relative flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-amber-500 to-orange-600 shadow-sm">
              <span className="text-xs font-bold text-white tracking-tight">
                C
              </span>
            </div>
            <span className="text-[15px] font-semibold tracking-[-0.02em] text-foreground">
              Claw
              <span className="text-amber-600">Dex</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 md:flex">
            <Button
              asChild
              size="sm"
              className="h-8 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-[13px] hover:from-amber-600 hover:to-orange-600 shadow-sm transition-all hover:shadow-md"
            >
              <Link href="/submit">
                <Plus className="size-3.5" />
                Submit
              </Link>
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground md:hidden"
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="border-t border-stone-200/60 px-4 pb-4 pt-2 md:hidden">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-stone-100 hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 pt-2 border-t border-stone-200/60">
                <Button
                  asChild
                  size="sm"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:from-amber-600 hover:to-orange-600"
                >
                  <Link href="/submit" onClick={() => setMobileOpen(false)}>
                    <Plus className="size-3.5" />
                    Submit Use Case
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
