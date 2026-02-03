"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { MOCK_STATS } from "@/lib/data/mock";

const STATS = [
  { label: "Use Cases", value: `${MOCK_STATS.totalUseCases}+` },
  { label: "Categories", value: `${MOCK_STATS.totalCategories}` },
  { label: "Integrations", value: `${MOCK_STATS.totalIntegrations}+` },
];

export function Hero() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/browse?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      {/* ── Background Layers ────────────────────────────────── */}

      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Radial glow — amber, centered top */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3">
        <div className="absolute inset-0 rounded-full bg-amber-500/[0.04] blur-[120px]" />
      </div>

      {/* Secondary glow — cooler tone for depth */}
      <div className="pointer-events-none absolute top-20 right-0 h-[400px] w-[400px] translate-x-1/3">
        <div className="absolute inset-0 rounded-full bg-orange-600/[0.025] blur-[100px]" />
      </div>

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          {/* Eyebrow */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/10 bg-amber-500/[0.04] px-3 py-1">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[11px] font-medium tracking-wide text-amber-400/90">
              85+ community use cases &amp; growing
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl font-bold tracking-[-0.03em] leading-[1.15] sm:text-5xl sm:leading-[1.1]">
            <span className="text-foreground">Discover what people</span>
            <br />
            <span className="text-foreground">are building with </span>
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                OpenClaw
              </span>
              {/* Underline accent */}
              <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400/60 via-orange-500/40 to-transparent rounded-full" />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            Filter by category, complexity, and integrations.
            <br className="hidden sm:block" />
            From smart home setups to multi-agent teams — find your next build.
          </p>

          {/* ── Search Bar ───────────────────────────────────── */}
          <form
            onSubmit={handleSearch}
            className="group relative mx-auto mt-8 max-w-lg"
          >
            {/* Glow ring behind search */}
            <div className="pointer-events-none absolute -inset-[1px] rounded-xl bg-gradient-to-r from-amber-500/20 via-transparent to-orange-500/20 opacity-0 blur-sm transition-opacity duration-500 group-focus-within:opacity-100" />

            <div className="relative flex items-center rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm transition-all group-focus-within:border-amber-500/20 group-focus-within:bg-white/[0.05]">
              <Search className="ml-4 size-4 text-muted-foreground/50 transition-colors group-focus-within:text-amber-400/70" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search use cases, integrations, categories..."
                className="h-11 flex-1 bg-transparent px-3 text-[14px] text-foreground placeholder:text-muted-foreground/40 outline-none"
              />
              {search && (
                <button
                  type="submit"
                  className="mr-2 rounded-lg bg-amber-500/10 px-3 py-1 text-[12px] font-medium text-amber-400 transition-colors hover:bg-amber-500/20"
                >
                  Search
                </button>
              )}
            </div>
          </form>

          {/* ── Stats ────────────────────────────────────────── */}
          <div className="mt-10 flex items-center justify-center gap-8 sm:gap-12">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-3">
                {i > 0 && (
                  <div className="h-4 w-[1px] bg-white/[0.06] -ml-3 sm:-ml-5" />
                )}
                <div className="text-center">
                  <p className="text-lg font-bold tracking-[-0.02em] text-foreground sm:text-xl">
                    {stat.value}
                  </p>
                  <p className="text-[11px] font-medium tracking-wide text-muted-foreground/60 uppercase">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
