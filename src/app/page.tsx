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
import { getAllUseCases, getCategories, getStats, getFAQs } from "@/lib/data/adapter";
import { faqPageSchema } from "@/lib/schema";
import { FAQ } from "@/components/layout/faq";
import { SubscribeForm } from "@/components/newsletter/subscribe-form";
import { PERSONAS, type Persona } from "@/lib/data/personas";
import type { UseCaseCard, CategoryView, StatsView } from "@/types";
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
      className="group flex items-center gap-3 rounded-xl border border-stone-200/80 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:border-stone-300/80"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 border border-amber-200/60 transition-colors group-hover:bg-amber-100/80">
        <Icon className="size-3.5 text-amber-600" />
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-foreground tracking-[-0.01em]">
          {persona.label}
        </p>
        <p className="text-[11px] text-muted-foreground/50 line-clamp-1">
          {persona.description}
        </p>
      </div>
      <ChevronRight className="ml-auto size-3.5 text-muted-foreground/30 transition-all group-hover:text-amber-600/60 group-hover:translate-x-0.5" />
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
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-amber-600/70 mb-1.5">
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

export default async function HomePage() {
  const useCases = getAllUseCases();
  const categories = getCategories();
  const stats = getStats();
  const faqs = getFAQs();

  // Show top 6 use cases by upvotes for the featured section
  const featured = [...useCases]
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 6);

  return (
    <div className="relative min-h-screen">
      <Header />

      <main>
        {faqs.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(faqPageSchema(faqs)),
            }}
          />
        )}

        {/* ── Hero ────────────────────────────────────────────── */}
        <Hero stats={stats} />

        {/* ── Featured Use Cases ──────────────────────────────── */}
        <section className="relative pt-6 pb-16 sm:pt-8 sm:pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeader
              label="Featured"
              title="Community Highlights"
              action={{ href: "/browse", text: "View all" }}
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((useCase) => (
                <UseCaseCardComponent key={useCase.id} useCase={useCase} />
              ))}
            </div>

            {/* Mobile CTA */}
            <div className="mt-8 flex justify-center sm:hidden">
              <Button
                asChild
                variant="outline"
                className="border-stone-200 text-[13px] text-muted-foreground hover:text-foreground hover:bg-stone-50"
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
          <div className="h-[1px] bg-gradient-to-r from-transparent via-stone-300/40 to-transparent" />
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
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Divider ────────────────────────────────────────── */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-stone-300/40 to-transparent" />
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
            <div className="h-[300px] w-[500px] rounded-full bg-amber-400/[0.06] blur-[100px]" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-lg text-center">
              <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 border border-amber-200/60">
                <Mail className="size-4 text-amber-600" />
              </div>

              <h2 className="text-xl font-bold tracking-[-0.02em] text-foreground sm:text-2xl">
                Stay in the loop
              </h2>
              <p className="mt-2 text-[14px] text-muted-foreground/70">
                Get the best new OpenClaw use cases delivered weekly.
                <br className="hidden sm:block" />
                No spam, unsubscribe anytime.
              </p>

              <SubscribeForm source="hero" variant="hero" />
            </div>
          </div>
        </section>

        {/* ── Divider ────────────────────────────────────────── */}
        {faqs.length > 0 && (
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-stone-300/40 to-transparent" />
          </div>
        )}

        {/* ── FAQ ────────────────────────────────────────────── */}
        <FAQ faqs={faqs} />
      </main>

      <Footer />
    </div>
  );
}
