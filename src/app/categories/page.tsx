import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Zap, Code, Home, Target, Users, Phone, Network, Cpu, BookOpen, Palette, type LucideIcon } from "lucide-react";
import { client } from "@/lib/sanity/client";
import { CATEGORIES_QUERY } from "@/lib/sanity/queries";
import type { CategoryView } from "@/types";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Categories | ClawDex",
  description: "Browse OpenClaw use cases by category. Discover automation, integration, and workflow solutions.",
  openGraph: {
    title: "Categories | ClawDex",
    description: "Browse OpenClaw use cases by category. Discover automation, integration, and workflow solutions.",
  },
};

const ICON_MAP: Record<string, LucideIcon> = {
  zap: Zap,
  code: Code,
  home: Home,
  target: Target,
  users: Users,
  phone: Phone,
  network: Network,
  cpu: Cpu,
  "book-open": BookOpen,
  palette: Palette,
};

const COLOR_MAP: Record<string, { icon: string; bg: string; border: string; hoverBg: string }> = {
  amber: { icon: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200/60", hoverBg: "group-hover:bg-amber-100/80" },
  blue: { icon: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200/60", hoverBg: "group-hover:bg-blue-100/80" },
  green: { icon: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200/60", hoverBg: "group-hover:bg-emerald-100/80" },
  purple: { icon: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200/60", hoverBg: "group-hover:bg-purple-100/80" },
  pink: { icon: "text-pink-600", bg: "bg-pink-50", border: "border-pink-200/60", hoverBg: "group-hover:bg-pink-100/80" },
  cyan: { icon: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-200/60", hoverBg: "group-hover:bg-cyan-100/80" },
  orange: { icon: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200/60", hoverBg: "group-hover:bg-orange-100/80" },
  slate: { icon: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200/60", hoverBg: "group-hover:bg-slate-100/80" },
  indigo: { icon: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200/60", hoverBg: "group-hover:bg-indigo-100/80" },
  rose: { icon: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200/60", hoverBg: "group-hover:bg-rose-100/80" },
};

export default async function CategoriesPage() {
  const categories = await client.fetch<CategoryView[]>(CATEGORIES_QUERY);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Categories",
    description: "Browse OpenClaw use cases by category.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://clawdex.com"}/categories`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-[#fafaf8] flex flex-col">
        <Header />

        <main className="flex-1 pt-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
            {/* Page Header */}
            <div className="mb-12">
              <p className="text-[11px] uppercase tracking-[0.08em] text-amber-600/70 mb-2">
                Browse by Topic
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-stone-900 mb-3">
                Categories
              </h1>
              <p className="text-stone-600 max-w-2xl">
                Explore OpenClaw use cases organized by category. Find automation, integration, and workflow solutions tailored to your needs.
              </p>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {categories.map((category) => {
                const Icon = ICON_MAP[category.icon] || Zap;
                const colorClasses = COLOR_MAP[category.color] || COLOR_MAP.amber;

                return (
                  <Link
                    key={category._id}
                    href={`/categories/${category.slug}`}
                    className="group block"
                  >
                    <div className="h-full bg-white rounded-lg border border-stone-200 shadow-sm hover:shadow-md transition-all duration-200 p-6">
                      {/* Icon */}
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${colorClasses.bg} ${colorClasses.border} border ${colorClasses.hoverBg} transition-colors duration-200 mb-4`}>
                        <Icon className={`w-6 h-6 ${colorClasses.icon}`} />
                      </div>

                      {/* Content */}
                      <div className="mb-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h2 className="text-lg font-semibold text-stone-900 group-hover:text-amber-600 transition-colors duration-200">
                            {category.name}
                          </h2>
                          <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0 mt-0.5" />
                        </div>
                        <p className="text-sm text-stone-600 line-clamp-2">
                          {category.description}
                        </p>
                      </div>

                      {/* Use Case Count */}
                      <div className="text-xs text-stone-500">
                        {category.useCaseCount} {category.useCaseCount === 1 ? 'use case' : 'use cases'}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Empty State */}
            {categories.length === 0 && (
              <div className="text-center py-12">
                <p className="text-stone-600">No categories available yet.</p>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
