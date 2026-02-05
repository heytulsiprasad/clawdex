"use client";

import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users } from "lucide-react";

const FOOTER_LINKS = {
  Directory: [
    { href: "/browse", label: "Browse All" },
    { href: "/categories", label: "Categories" },
    { href: "/submit", label: "Submit" },
  ],
  Resources: [
    { href: "https://github.com/openclaw", label: "OpenClaw GitHub" },
    { href: "/categories/development-devops", label: "Dev Workflows" },
    { href: "/categories/smart-home-iot", label: "Smart Home" },
    { href: "/categories/automation-workflows", label: "Automation" },
  ],
};

export function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <footer className="relative border-t border-stone-200">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Brand + Newsletter */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-amber-500 to-orange-600">
                <span className="text-[10px] font-bold text-white">C</span>
              </div>
              <span className="text-sm font-semibold tracking-[-0.02em]">
                Claw<span className="text-amber-600">Dex</span>
              </span>
            </Link>

            <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
              The community-driven directory of OpenClaw use cases. Discover,
              filter, and share what&apos;s possible.
            </p>

            {/* Newsletter */}
            <form onSubmit={handleSubmit} className="mt-5">
              {submitted ? (
                <p className="text-[13px] font-medium text-amber-600">
                  You&apos;re in. We&apos;ll send the best new use cases weekly.
                </p>
              ) : (
                <>
                  <p className="mb-2 text-[13px] font-medium text-foreground/80">
                    Weekly use case roundup
                  </p>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="you@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-8 max-w-[220px] bg-white border-stone-200 text-[13px] placeholder:text-stone-400 focus-visible:border-amber-400 focus-visible:ring-amber-400/10"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      className="h-8 bg-stone-100 text-foreground/80 hover:bg-stone-200 hover:text-foreground border border-stone-200 text-[13px]"
                    >
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </div>
                </>
              )}
            </form>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title} className="lg:col-span-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/60 mb-3">
                {title}
              </p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Proof */}
          <div className="lg:col-span-3 lg:text-right">
            <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5">
              <Users className="size-3 text-amber-600" />
              <span className="text-[12px] text-muted-foreground">
                <span className="font-semibold text-foreground/80">8,900+</span>{" "}
                community members
              </span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex items-center justify-between border-t border-stone-200/60 pt-6">
          <p className="text-[11px] text-muted-foreground/60">
            &copy; {new Date().getFullYear()} ClawDex
          </p>
          <p className="text-[11px] text-muted-foreground/50">
            Built for the OpenClaw community
          </p>
        </div>
      </div>
    </footer>
  );
}
