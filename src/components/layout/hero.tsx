"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { StatsView } from "@/types";

export function Hero({ stats }: { stats: StatsView }) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const STATS = [
    { label: "Use Cases", value: `${stats.totalUseCases}+` },
    { label: "Categories", value: `${stats.totalCategories}` },
    { label: "Integrations", value: `${stats.totalIntegrations}+` },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/browse?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      {/* ── Background Layers ────────────────────────────────── */}

      {/* Dot grid — dark dots on light bg */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #1a1a1a 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Warm radial glow — amber tinted, top center */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3">
        <div className="absolute inset-0 rounded-full bg-amber-400/[0.06] blur-[120px]" />
      </div>

      {/* Secondary warm wash — right side */}
      <div className="pointer-events-none absolute top-20 right-0 h-[400px] w-[400px] translate-x-1/3">
        <div className="absolute inset-0 rounded-full bg-orange-300/[0.04] blur-[100px]" />
      </div>

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          {/* Eyebrow */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/15 bg-amber-50 px-3 py-1">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[11px] font-medium tracking-wide text-amber-700">
              {stats.totalUseCases}+ community use cases &amp; growing
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl font-bold tracking-[-0.03em] leading-[1.15] sm:text-5xl sm:leading-[1.1]">
            <span className="text-foreground">Discover what people</span>
            <br />
            <span className="text-foreground">are building with </span>
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                OpenClaw
              </span>
              {/* Underline accent */}
              <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500/50 via-orange-500/30 to-transparent rounded-full" />
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
            <div className="relative flex items-center rounded-xl border border-stone-200 bg-white shadow-sm transition-all group-focus-within:border-amber-400/50 group-focus-within:shadow-[0_0_0_3px_rgba(245,158,11,0.08)]">
              <Search className="ml-4 size-4 text-stone-400 transition-colors group-focus-within:text-amber-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search use cases, integrations, categories..."
                className="h-11 flex-1 bg-transparent px-3 text-[14px] text-foreground placeholder:text-stone-400 outline-none"
              />
              {search && (
                <button
                  type="submit"
                  className="mr-2 rounded-lg bg-amber-50 px-3 py-1 text-[12px] font-medium text-amber-700 transition-colors hover:bg-amber-100"
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
                  <div className="h-4 w-[1px] bg-stone-200 -ml-3 sm:-ml-5" />
                )}
                <div className="text-center">
                  <p className="text-lg font-bold tracking-[-0.02em] text-foreground sm:text-xl">
                    {stat.value}
                  </p>
                  <p className="text-[11px] font-medium tracking-wide text-muted-foreground/70 uppercase">
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
