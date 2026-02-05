import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import {
  ArrowLeft,
  ExternalLink,
  Sparkles,
  Layers,
  Twitter,
  Github,
  Youtube,
  MessageSquare,
  Globe,
} from "lucide-react";

import { client } from "@/lib/sanity/client";
import {
  USE_CASE_BY_SLUG_QUERY,
  RELATED_USE_CASES_QUERY,
} from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { UseCaseCardComponent } from "@/components/use-case/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { UseCaseCard } from "@/types";

const COMPLEXITY_CONFIG = {
  beginner: {
    label: "Beginner",
    className: "text-emerald-700 border-emerald-200 bg-emerald-50",
  },
  intermediate: {
    label: "Intermediate",
    className: "text-blue-700 border-blue-200 bg-blue-50",
  },
  advanced: {
    label: "Advanced",
    className: "text-purple-700 border-purple-200 bg-purple-50",
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  amber: "text-amber-700 bg-amber-50 border-amber-200",
  blue: "text-blue-700 bg-blue-50 border-blue-200",
  green: "text-emerald-700 bg-emerald-50 border-emerald-200",
  purple: "text-purple-700 bg-purple-50 border-purple-200",
  pink: "text-pink-700 bg-pink-50 border-pink-200",
  cyan: "text-cyan-700 bg-cyan-50 border-cyan-200",
  orange: "text-orange-700 bg-orange-50 border-orange-200",
  slate: "text-slate-700 bg-slate-50 border-slate-200",
  indigo: "text-indigo-700 bg-indigo-50 border-indigo-200",
  rose: "text-rose-700 bg-rose-50 border-rose-200",
};

const TYPE_LABELS: Record<string, string> = {
  workflow: "Workflow",
  skill: "Skill",
  "cron-job": "Cron Job",
  "multi-agent": "Multi-Agent",
  hardware: "Hardware Setup",
};

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  twitter: Twitter,
  reddit: MessageSquare,
  youtube: Youtube,
  github: Github,
  other: Globe,
};

const PLATFORM_LABELS: Record<string, string> = {
  twitter: "Twitter/X",
  reddit: "Reddit",
  youtube: "YouTube",
  github: "GitHub",
  other: "Web",
};

interface UseCasePageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface UseCaseDetail {
  _id: string;
  _createdAt: string;
  title: string;
  slug: string;
  description: string;
  longDescription: Array<{
    _type: "block";
    children: Array<{ text: string }>;
  }>;
  category: {
    _id: string;
    name: string;
    slug: string;
    icon: string;
    color: string;
    description: string;
  };
  complexity: "beginner" | "intermediate" | "advanced";
  type: "workflow" | "skill" | "cron-job" | "multi-agent" | "hardware";
  channels: string[];
  integrations: Array<{ _id: string; name: string; slug: string }>;
  personas: string[];
  creator: { handle: string; name: string; avatar?: string };
  sourceUrl: string;
  sourcePlatform: "twitter" | "reddit" | "youtube" | "github" | "other";
  media: Array<{
    _type: "image" | "mediaEmbed";
    _key: string;
    asset?: { _ref: string };
    url?: string;
    mediaType?: string;
    caption?: string;
  }>;
  setupSteps?: unknown[];
  upvotes: number;
  featured: boolean;
  discoverySource: string;
}

export async function generateMetadata({
  params,
}: UseCasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const useCase = await client.fetch<UseCaseDetail>(USE_CASE_BY_SLUG_QUERY, {
    slug,
  });

  if (!useCase) {
    return {
      title: "Use Case Not Found",
    };
  }

  return {
    title: `${useCase.title} | ClawDex`,
    description: useCase.description,
    openGraph: {
      title: useCase.title,
      description: useCase.description,
      type: "article",
    },
  };
}

export default async function UseCasePage({ params }: UseCasePageProps) {
  const { slug } = await params;
  const useCase = await client.fetch<UseCaseDetail>(USE_CASE_BY_SLUG_QUERY, {
    slug,
  });

  if (!useCase) {
    notFound();
  }

  const relatedUseCases = await client.fetch<UseCaseCard[]>(
    RELATED_USE_CASES_QUERY,
    {
      categoryId: useCase.category._id,
      currentSlug: useCase.slug,
    }
  );

  const longDescriptionText =
    useCase.longDescription
      ?.map((block) => block.children?.map((child) => child.text).join(""))
      .join("\n\n") || useCase.description;

  const imageMedia = useCase.media.filter(
    (m) => m._type === "image" && m.asset
  );

  const PlatformIcon =
    PLATFORM_ICONS[useCase.sourcePlatform] || PLATFORM_ICONS.other;

  return (
    <div className="min-h-screen bg-[#fafaf8] flex flex-col">
      <Header />

      <main className="flex-1">
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
                href="/browse"
                className="hover:text-stone-900 transition-colors"
              >
                Browse
              </Link>
              <span>/</span>
              <Link
                href={`/browse?category=${useCase.category.slug}`}
                className="hover:text-stone-900 transition-colors"
              >
                {useCase.category.name}
              </Link>
              <span>/</span>
              <span className="text-stone-900 font-medium">{useCase.title}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-b from-white to-[#fafaf8] border-b border-stone-200">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Browse
            </Link>

            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge
                  variant="outline"
                  className={cn(
                    "font-medium",
                    CATEGORY_COLORS[useCase.category.color] ||
                      CATEGORY_COLORS.amber
                  )}
                >
                  {useCase.category.name}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "font-medium",
                    COMPLEXITY_CONFIG[useCase.complexity].className
                  )}
                >
                  {COMPLEXITY_CONFIG[useCase.complexity].label}
                </Badge>
                <Badge variant="outline" className="font-medium">
                  {TYPE_LABELS[useCase.type] || useCase.type}
                </Badge>
                {useCase.featured && (
                  <Badge
                    variant="outline"
                    className="font-medium text-amber-700 bg-amber-50 border-amber-200"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-stone-900 mb-4">
                {useCase.title}
              </h1>

              <p className="text-lg text-stone-600 leading-relaxed">
                {useCase.description}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Full Description */}
              <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-6 md:p-8">
                <h2 className="text-2xl font-semibold text-stone-900 mb-4">
                  About This Use Case
                </h2>
                <div className="prose prose-stone max-w-none">
                  {longDescriptionText.split("\n\n").map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="text-stone-700 leading-relaxed mb-4 last:mb-0"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Media Images */}
              {imageMedia.length > 0 && (
                <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-6 md:p-8">
                  <h2 className="text-2xl font-semibold text-stone-900 mb-4">
                    Media
                  </h2>
                  <div className="space-y-4">
                    {imageMedia.map((media) => (
                      <div key={media._key} className="rounded-lg overflow-hidden">
                        <Image
                          src={
                            urlFor({
                              _type: "image",
                              asset: {
                                _ref: media.asset!._ref,
                                _type: "reference",
                              },
                            })
                              .width(800)
                              .url() || ""
                          }
                          alt={media.caption || "Use case media"}
                          width={800}
                          height={450}
                          className="w-full h-auto"
                        />
                        {media.caption && (
                          <p className="text-sm text-stone-600 mt-2">
                            {media.caption}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Source Link */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg shadow-sm p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-lg border border-amber-200">
                    <PlatformIcon className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-stone-900 mb-1">
                      View Original Post
                    </h3>
                    <p className="text-sm text-stone-600 mb-4">
                      See the original discussion and community feedback on{" "}
                      {PLATFORM_LABELS[useCase.sourcePlatform]}.
                    </p>
                    <Button
                      asChild
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      <a
                        href={useCase.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2"
                      >
                        View on {PLATFORM_LABELS[useCase.sourcePlatform]}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Creator Card */}
              <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-stone-900 mb-4">Creator</h3>
                <div className="flex items-center gap-3">
                  {useCase.creator.avatar ? (
                    <Image
                      src={useCase.creator.avatar}
                      alt={useCase.creator.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center">
                      <span className="text-amber-700 font-semibold text-lg">
                        {useCase.creator.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-stone-900">
                      {useCase.creator.name}
                    </div>
                    <a
                      href={`https://twitter.com/${useCase.creator.handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-stone-600 hover:text-amber-600 transition-colors"
                    >
                      @{useCase.creator.handle}
                    </a>
                  </div>
                </div>
              </div>

              {/* Details Card */}
              <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-stone-900 mb-4">Details</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-stone-600 mb-1">Category</div>
                    <Link href={`/browse?category=${useCase.category.slug}`}>
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-medium cursor-pointer hover:opacity-80 transition-opacity",
                          CATEGORY_COLORS[useCase.category.color] ||
                            CATEGORY_COLORS.amber
                        )}
                      >
                        {useCase.category.name}
                      </Badge>
                    </Link>
                  </div>
                  <Separator />
                  <div>
                    <div className="text-sm text-stone-600 mb-1">
                      Complexity
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-medium",
                        COMPLEXITY_CONFIG[useCase.complexity].className
                      )}
                    >
                      {COMPLEXITY_CONFIG[useCase.complexity].label}
                    </Badge>
                  </div>
                  <Separator />
                  <div>
                    <div className="text-sm text-stone-600 mb-1">Type</div>
                    <Badge variant="outline" className="font-medium">
                      <Layers className="w-3 h-3 mr-1" />
                      {TYPE_LABELS[useCase.type] || useCase.type}
                    </Badge>
                  </div>
                  <Separator />
                  <div>
                    <div className="text-sm text-stone-600 mb-1">Upvotes</div>
                    <div className="font-semibold text-stone-900">
                      {useCase.upvotes.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Integrations */}
              {useCase.integrations && useCase.integrations.length > 0 && (
                <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-6">
                  <h3 className="font-semibold text-stone-900 mb-4">
                    Integrations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {useCase.integrations.map((integration) => (
                      <Badge
                        key={integration._id}
                        variant="outline"
                        className="font-medium text-stone-700 bg-stone-50 border-stone-200"
                      >
                        {integration.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Personas */}
              {useCase.personas && useCase.personas.length > 0 && (
                <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-6">
                  <h3 className="font-semibold text-stone-900 mb-4">
                    Ideal For
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {useCase.personas.map((persona, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="font-medium text-stone-700 bg-stone-50 border-stone-200"
                      >
                        {persona}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Use Cases */}
          {relatedUseCases.length > 0 && (
            <div className="mt-16">
              <div className="mb-8">
                <h2 className="text-3xl font-semibold text-stone-900 mb-2">
                  Related Use Cases
                </h2>
                <p className="text-stone-600">
                  More {useCase.category.name.toLowerCase()} examples you might
                  find interesting
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedUseCases.slice(0, 3).map((relatedCase) => (
                  <UseCaseCardComponent
                    key={relatedCase._id}
                    useCase={relatedCase}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
