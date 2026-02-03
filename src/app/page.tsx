import Link from "next/link";
import {
  ChevronRight,
  Code2,
  Rocket,
  Heart,
  Sparkles,
  Home,
  PenTool,
  ArrowRight,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/layout/hero";
import { UseCaseCardComponent } from "@/components/use-case/card";
import { CategoryCard } from "@/components/layout/category-card";
import { MOCK_USE_CASES, MOCK_CATEGORIES } from "@/lib/data/mock";
import { PERSONAS, type Persona } from "@/lib/data/personas";
import type { LucideIcon } from "lucide-react";

const PERSONA_ICONS: Record<string, LucideIcon> = {
  "code-2": Code2,
  rocket: Rocket,
  heart: Heart,
  sparkles: Sparkles,
  home: Home,
  "pen-tool": PenTool,
};

function PersonaCard({ persona }: { persona: Persona }) {
  const Icon = PERSONA_ICONS[persona.icon] || Sparkles;

  return (
    <Link
      href={`/browse?persona=${persona.id}`}
      className="group flex items-center gap-3 rounded-xl border border-white/[0.05] bg-card/40 px-4 py-3 transition-all duration-300 hover:bg-card/70 hover:border-white/[0.08]"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/[0.06] border border-amber-500/10 transition-colors group-hover:bg-amber-500/[0.10]">
        <Icon className="size-3.5 text-amber-400" />
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-foreground tracking-[-0.01em]">
          {persona.label}
        </p>
        <p className="text-[11px] text-muted-foreground/50 line-clamp-1">
          {persona.description}
        </p>
      </div>
      <ChevronRight className="ml-auto size-3.5 text-muted-foreground/30 transition-all group-hover:text-amber-400/60 group-hover:translate-x-0.5" />
    </Link>
  );
}

function SectionHeader({
  label,
  title,
  action,
}: {
  label: string;
  title: string;
  action?: { href: string; text: string };
}) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-amber-400/60 mb-1.5">
          {label}
        </p>
        <h2 className="text-xl font-bold tracking-[-0.02em] text-foreground sm:text-2xl">
          {title}
        </h2>
      </div>
      {action && (
        <Link
          href={action.href}
          className="group hidden items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground sm:flex"
        >
          {action.text}
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      <Header />

      <main>
        {/* ── Hero ────────────────────────────────────────────── */}
        <Hero />

        {/* ── Featured Use Cases ──────────────────────────────── */}
        <section className="relative py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeader
              label="Featured"
              title="Community Highlights"
              action={{ href: "/browse", text: "View all" }}
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MOCK_USE_CASES.map((useCase) => (
                <UseCaseCardComponent key={useCase._id} useCase={useCase} />
              ))}
            </div>

            {/* Mobile CTA */}
            <div className="mt-8 flex justify-center sm:hidden">
              <Button
                asChild
                variant="outline"
                className="border-white/[0.06] text-[13px] text-muted-foreground hover:text-foreground"
              >
                <Link href="/browse">
                  Browse all use cases
                  <ArrowRight className="ml-1.5 size-3" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Divider ────────────────────────────────────────── */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>

        {/* ── Categories ──────────────────────────────────────── */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeader
              label="Explore"
              title="Browse by Category"
              action={{ href: "/categories", text: "All categories" }}
            />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {MOCK_CATEGORIES.map((category) => (
                <CategoryCard key={category._id} category={category} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Divider ────────────────────────────────────────── */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>

        {/* ── Persona Selector ────────────────────────────────── */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeader
              label="Personalized"
              title="I am a..."
            />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {PERSONAS.map((persona) => (
                <PersonaCard key={persona.id} persona={persona} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Email CTA ──────────────────────────────────────── */}
        <section className="relative py-16 sm:py-24">
          {/* Glow */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-[300px] w-[500px] rounded-full bg-amber-500/[0.025] blur-[100px]" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-lg text-center">
              <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/[0.06] border border-amber-500/10">
                <Mail className="size-4 text-amber-400" />
              </div>

              <h2 className="text-xl font-bold tracking-[-0.02em] text-foreground sm:text-2xl">
                Stay in the loop
              </h2>
              <p className="mt-2 text-[14px] text-muted-foreground/70">
                Get the best new OpenClaw use cases delivered weekly.
                <br className="hidden sm:block" />
                No spam, unsubscribe anytime.
              </p>

              <form className="mt-6 flex gap-2 justify-center">
                <input
                  type="email"
                  placeholder="you@email.com"
                  className="h-10 w-full max-w-[260px] rounded-lg border border-white/[0.06] bg-white/[0.03] px-3.5 text-[13px] text-foreground placeholder:text-muted-foreground/40 outline-none transition-all focus:border-amber-500/20 focus:bg-white/[0.05]"
                />
                <Button className="h-10 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold text-[13px] hover:from-amber-400 hover:to-orange-400 shadow-[0_0_20px_rgba(245,158,11,0.12)]">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
