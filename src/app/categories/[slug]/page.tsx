import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Zap, Code, Home, Target, Users, Phone, Network, Cpu, BookOpen, Palette, type LucideIcon } from "lucide-react";
import { client } from "@/lib/sanity/client";
import {
  CATEGORY_BY_SLUG_QUERY,
  USE_CASES_BY_CATEGORY_QUERY,
  ALL_CATEGORY_SLUGS_QUERY,
} from "@/lib/sanity/queries";
import { breadcrumbSchema } from "@/lib/schema";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { UseCaseCardComponent } from "@/components/use-case/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { UseCaseCard } from "@/types";

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

const COLOR_MAP: Record<string, string> = {
  amber: "text-amber-600",
  blue: "text-blue-600",
  green: "text-emerald-600",
  purple: "text-purple-600",
  pink: "text-pink-600",
  cyan: "text-cyan-600",
  orange: "text-orange-600",
  slate: "text-slate-600",
  indigo: "text-indigo-600",
  rose: "text-rose-600",
};

const BG_COLOR_MAP: Record<string, string> = {
  amber: "bg-amber-50 border-amber-200/60",
  blue: "bg-blue-50 border-blue-200/60",
  green: "bg-emerald-50 border-emerald-200/60",
  purple: "bg-purple-50 border-purple-200/60",
  pink: "bg-pink-50 border-pink-200/60",
  cyan: "bg-cyan-50 border-cyan-200/60",
  orange: "bg-orange-50 border-orange-200/60",
  slate: "bg-slate-50 border-slate-200/60",
  indigo: "bg-indigo-50 border-indigo-200/60",
  rose: "bg-rose-50 border-rose-200/60",
};

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

interface CategoryDetail {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await client.fetch<CategoryDetail>(
    CATEGORY_BY_SLUG_QUERY,
    { slug }
  );

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.name} Use Cases | ClawDex`,
    description: `${category.description} Explore ${category.name.toLowerCase()} use cases for OpenClaw.`,
    openGraph: {
      title: `${category.name} Use Cases | ClawDex`,
      description: category.description,
      type: "website",
    },
  };
}

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(
    ALL_CATEGORY_SLUGS_QUERY
  );
  return slugs.map((s) => ({ slug: s.slug }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await client.fetch<CategoryDetail>(
    CATEGORY_BY_SLUG_QUERY,
    { slug }
  );

  if (!category) {
    notFound();
  }

  const useCases = await client.fetch<UseCaseCard[]>(
    USE_CASES_BY_CATEGORY_QUERY,
    { categorySlug: slug }
  );

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawdex.com";
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Categories", url: `${SITE_URL}/categories` },
    { name: category.name, url: `${SITE_URL}/categories/${category.slug}` },
  ]);

  const Icon = ICON_MAP[category.icon] || Zap;
  const iconColor = COLOR_MAP[category.color] || COLOR_MAP.amber;
  const bgColor = BG_COLOR_MAP[category.color] || BG_COLOR_MAP.amber;

  return (
    <div className="min-h-screen bg-[#fafaf8] flex flex-col">
      <Header />

      <main className="flex-1 pt-14">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbJsonLd),
          }}
        />

        {/* Breadcrumb */}
        <div className="border-b border-stone-200 bg-white">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-sm text-stone-600">
              <Link
                href="/"
                className="hover:text-stone-900 transition-colors"
              >
                Home
              </Link>
              <span>/</span>
              <Link
                href="/categories"
                className="hover:text-stone-900 transition-colors"
              >
                Categories
              </Link>
              <span>/</span>
              <span className="text-stone-900 font-medium">
                {category.name}
              </span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-b from-white to-[#fafaf8] border-b border-stone-200">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Categories
            </Link>

            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Icon */}
              <div
                className={cn(
                  "inline-flex items-center justify-center w-16 h-16 rounded-xl border",
                  bgColor
                )}
              >
                <Icon className={cn("w-8 h-8", iconColor)} />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-stone-900 mb-4">
                  {category.name}
                </h1>
                <p className="text-lg text-stone-600 leading-relaxed mb-4">
                  {category.description}
                </p>
                <Badge
                  variant="outline"
                  className="font-medium text-stone-700 bg-stone-50 border-stone-200"
                >
                  {useCases.length} {useCases.length === 1 ? "use case" : "use cases"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases Grid */}
        <div className="container mx-auto px-4 py-8 md:py-12">
          {useCases.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {useCases.map((useCase) => (
                <UseCaseCardComponent key={useCase._id} useCase={useCase} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-12 text-center">
              <div className="max-w-md mx-auto">
                <div
                  className={cn(
                    "inline-flex items-center justify-center w-16 h-16 rounded-xl border mb-4",
                    bgColor
                  )}
                >
                  <Icon className={cn("w-8 h-8", iconColor)} />
                </div>
                <h2 className="text-xl font-semibold text-stone-900 mb-2">
                  No Use Cases Yet
                </h2>
                <p className="text-stone-600 mb-6">
                  We haven't found any use cases in this category yet. Check back soon or explore other categories.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/categories"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-900 font-medium transition-colors"
                  >
                    View All Categories
                  </Link>
                  <Link
                    href="/browse"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium transition-colors"
                  >
                    Browse All Use Cases
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
