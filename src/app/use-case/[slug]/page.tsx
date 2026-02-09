import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import {
  ArrowLeft,
  ExternalLink,
  Sparkles,
  Layers,
  Play,
  Twitter,
  Github,
  Youtube,
  MessageSquare,
  Globe,
  Clock,
  Zap,
  MessageCircle,
  Puzzle,
} from "lucide-react";

import { TwitterVideoEmbed } from "@/components/media/twitter-video-embed";
import {
  getUseCaseBySlug,
  getRelatedUseCases,
} from "@/lib/data/adapter";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { UseCaseCardComponent } from "@/components/use-case/card";
import { UpvoteButton } from "@/components/use-case/upvote-button";
import { BookmarkButton } from "@/components/use-case/bookmark-button";
import { CopyPrompt } from "@/components/use-case/copy-prompt";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@clawdex/data/categories";
import { INTEGRATIONS } from "@clawdex/data/integrations";
import { PERSONAS } from "@clawdex/data/personas";

const COMPLEXITY_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
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

const COMPLEXITY_EFFORT: Record<string, string> = {
  beginner: "~15 minutes",
  intermediate: "~1 hour",
  advanced: "A few hours",
};

const PERSONA_LABELS: Record<string, string> = {
  developer: "Developer",
  "solo-founder": "Solo Founder",
  "family-manager": "Family Manager",
  "productivity-enthusiast": "Productivity Enthusiast",
  "smart-home-enthusiast": "Smart Home Enthusiast",
  "content-creator": "Content Creator",
};

const CHANNEL_LABELS: Record<string, string> = {
  whatsapp: "WhatsApp",
  telegram: "Telegram",
  discord: "Discord",
  slack: "Slack",
  imessage: "iMessage",
};

function DevToIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 8.5v7M10 8.5l2 3.5-2 3.5M14 8.5h3M14 12h2M14 15.5h3" />
    </svg>
  );
}

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  twitter: Twitter,
  reddit: MessageSquare,
  youtube: Youtube,
  github: Github,
  devto: DevToIcon,
  hackernews: Globe,
  other: Globe,
};

const PLATFORM_LABELS: Record<string, string> = {
  twitter: "Twitter/X",
  reddit: "Reddit",
  youtube: "YouTube",
  github: "GitHub",
  devto: "DEV Community",
  hackernews: "Hacker News",
  other: "Web",
};

interface UseCasePageProps {
  params: Promise<{
    slug: string;
  }>;
}

function getCategoryInfo(slug: string) {
  const cat = CATEGORIES.find((c: { slug: string }) => c.slug === slug);
  return cat
    ? { name: cat.name, slug: cat.slug, icon: cat.icon, color: cat.color }
    : { name: "Unknown", slug, icon: "zap", color: "amber" };
}

function getIntegrationNames(slugs: string[]) {
  return slugs.map((s: string) => {
    const integration = INTEGRATIONS.find((i: { slug: string }) => i.slug === s);
    return { name: integration?.name || s, slug: s };
  });
}

function getPersonaLabel(tag: string) {
  const persona = PERSONAS.find((p) => p.id === tag);
  return persona?.label || PERSONA_LABELS[tag] || tag;
}

export async function generateMetadata({
  params,
}: UseCasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const useCase = getUseCaseBySlug(slug);

  if (!useCase) {
    return {
      title: "Use Case Not Found",
    };
  }

  const category = getCategoryInfo(useCase.category);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.clawdex.io";
  const ogImageUrl = new URL(`${siteUrl}/og`);
  ogImageUrl.searchParams.set("title", useCase.title);
  ogImageUrl.searchParams.set("subtitle", useCase.description.slice(0, 100));
  ogImageUrl.searchParams.set("category", category.name);
  ogImageUrl.searchParams.set("complexity", useCase.complexity);

  return {
    title: useCase.title,
    description: useCase.description,
    keywords: [
      category.name,
      useCase.complexity,
      "OpenClaw",
      "AI workflow",
      ...getIntegrationNames(useCase.integrations).map((i) => i.name),
    ],
    openGraph: {
      title: useCase.title,
      description: useCase.description,
      type: "article",
      url: `${siteUrl}/use-case/${slug}`,
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: useCase.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: useCase.title,
      description: useCase.description,
      images: [ogImageUrl.toString()],
    },
    alternates: {
      canonical: `${siteUrl}/use-case/${slug}`,
    },
  };
}

export default async function UseCasePage({ params }: UseCasePageProps) {
  const { slug } = await params;
  const useCase = getUseCaseBySlug(slug);

  if (!useCase) {
    notFound();
  }

  const category = getCategoryInfo(useCase.category);
  const integrations = getIntegrationNames(useCase.integrations);
  const relatedUseCases = getRelatedUseCases(useCase.category, useCase.slug);

  const longDescriptionText = useCase.longDescription || useCase.description;

  const isTwitterSource =
    useCase.sourcePlatform === "twitter" && !!useCase.sourceUrl;

  const PlatformIcon =
    PLATFORM_ICONS[useCase.sourcePlatform || "other"] || PLATFORM_ICONS.other;

  const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.clawdex.io";

  const articleJsonLd = articleSchema({
    title: useCase.title,
    slug: useCase.slug,
    description: useCase.description,
    createdAt: new Date().toISOString(),
    creator: useCase.creator,
    categoryName: category.name,
  });

  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Browse", url: `${SITE_URL}/browse` },
    {
      name: category.name,
      url: `${SITE_URL}/browse?category=${category.slug}`,
    },
    {
      name: useCase.title,
      url: `${SITE_URL}/use-case/${useCase.slug}`,
    },
  ]);

  return (
    <div className="min-h-screen bg-[#fafaf8] flex flex-col">
      <Header />

      <main className="flex-1 pt-14">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbJsonLd),
          }}
        />

        {/* Breadcrumb */}
        <div className="border-b border-stone-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3">
            <nav className="flex items-center gap-1.5 text-[13px] text-stone-500 min-w-0 overflow-hidden">
              <Link
                href="/"
                className="shrink-0 hover:text-stone-900 transition-colors"
              >
                Home
              </Link>
              <span className="shrink-0 text-stone-300">/</span>
              <Link
                href="/browse"
                className="shrink-0 hover:text-stone-900 transition-colors"
              >
                Browse
              </Link>
              <span className="shrink-0 text-stone-300">/</span>
              <Link
                href={`/browse?category=${category.slug}`}
                className="shrink-0 hover:text-stone-900 transition-colors"
              >
                {category.name}
              </Link>
              <span className="shrink-0 text-stone-300">/</span>
              <span className="text-stone-900 font-medium truncate">{useCase.title}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-b from-white to-[#fafaf8] border-b border-stone-200">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 md:py-12">
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Browse
            </Link>

            <div className="flex items-start justify-between gap-6">
              {/* Left: title content */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-medium",
                      CATEGORY_COLORS[category.color] ||
                        CATEGORY_COLORS.amber
                    )}
                  >
                    {category.name}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-medium",
                      COMPLEXITY_CONFIG[useCase.complexity]?.className
                    )}
                  >
                    {COMPLEXITY_CONFIG[useCase.complexity]?.label}
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

              {/* Right: upvote button — Product Hunt style */}
              <div className="shrink-0 hidden md:flex flex-col items-center gap-3 pt-1">
                <UpvoteButton id={useCase.slug} initialCount={0} variant="hero" />
                <BookmarkButton useCaseId={useCase.slug} useCaseTitle={useCase.title} variant="detail" />
              </div>
            </div>

            {/* Mobile upvote — below description */}
            <div className="mt-5 md:hidden space-y-3">
              <UpvoteButton id={useCase.slug} initialCount={0} variant="detail" />
              <BookmarkButton useCaseId={useCase.slug} useCaseTitle={useCase.title} variant="detail" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Copy to Agent — the killer feature */}
              {useCase.prompt && (
                <CopyPrompt prompt={useCase.prompt} />
              )}

              {/* Full Description */}
              <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-6 md:p-8">
                <h2 className="text-2xl font-semibold text-stone-900 mb-4">
                  About This Use Case
                </h2>
                <div className="prose prose-stone max-w-none">
                  {longDescriptionText.split("\n\n").map((paragraph: string, idx: number) => (
                    <p
                      key={idx}
                      className="text-stone-700 leading-relaxed mb-4 last:mb-0"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* How to Set This Up */}
              {useCase.setupSteps && useCase.setupSteps.length > 0 && (
                <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-6 md:p-8">
                  <h2 className="text-2xl font-semibold text-stone-900 mb-4 flex items-center gap-2">
                    <Zap className="w-6 h-6 text-amber-600" />
                    How to Set This Up
                  </h2>
                  <div className="prose prose-stone max-w-none">
                    {useCase.setupSteps.map((step: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex gap-4 mb-4 last:mb-0 items-start"
                      >
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-sm font-semibold text-amber-700">
                          {idx + 1}
                        </div>
                        <p className="text-stone-700 leading-relaxed flex-1 pt-0.5">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Source Link */}
              {isTwitterSource ? (
                <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-6 md:p-8">
                  <h2 className="text-2xl font-semibold text-stone-900 mb-4">
                    Original Tweet
                  </h2>
                  <TwitterVideoEmbed
                    sourceUrl={useCase.sourceUrl!}
                    platformLabel={PLATFORM_LABELS[useCase.sourcePlatform!]}
                  />
                </div>
              ) : useCase.sourceUrl ? (
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
                        {PLATFORM_LABELS[useCase.sourcePlatform || "other"]}.
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
                          View on {PLATFORM_LABELS[useCase.sourcePlatform || "other"]}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* What You'll Need */}
              <div className="bg-gradient-to-br from-amber-50 to-stone-50 border border-amber-200 rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-stone-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-600" />
                  What You&apos;ll Need
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-stone-600 mb-0.5">Estimated effort</div>
                      <div className="font-medium text-stone-900">
                        {COMPLEXITY_EFFORT[useCase.complexity]}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Layers className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-stone-600 mb-0.5">Complexity</div>
                      <div className="font-medium text-stone-900">
                        {COMPLEXITY_CONFIG[useCase.complexity]?.label}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Layers className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-stone-600 mb-0.5">Type</div>
                      <div className="font-medium text-stone-900">
                        {TYPE_LABELS[useCase.type] || useCase.type}
                      </div>
                    </div>
                  </div>
                  {useCase.channels && useCase.channels.length > 0 && (
                    <div className="flex items-start gap-3">
                      <MessageCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-stone-600 mb-1.5">Channels</div>
                        <div className="flex flex-wrap gap-1.5">
                          {useCase.channels.map((channel: string) => (
                            <Badge
                              key={channel}
                              variant="outline"
                              className="text-[11px] font-medium text-amber-700 bg-white border-amber-200"
                            >
                              {CHANNEL_LABELS[channel] || channel}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {integrations.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Puzzle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-stone-600 mb-0.5">Integrations</div>
                        <div className="font-medium text-stone-900">
                          {integrations.map((i) => i.name).join(", ")}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Creator Card */}
              <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-stone-900 mb-4">Creator</h3>
                <div className="flex items-center gap-3">
                  <Image
                    src={
                      useCase.creator.avatar ||
                      `https://unavatar.io/twitter/${useCase.creator.handle}`
                    }
                    alt={useCase.creator.name}
                    width={48}
                    height={48}
                    className="rounded-full bg-stone-100"
                    unoptimized={!useCase.creator.avatar}
                  />
                  <div>
                    <div className="font-medium text-stone-900">
                      {useCase.creator.name}
                    </div>
                    <a
                      href={useCase.creator.url || `https://twitter.com/${useCase.creator.handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-stone-600 hover:text-amber-600 transition-colors"
                    >
                      @{useCase.creator.handle}
                      <PlatformIcon className="size-3.5 text-stone-400" />
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
                    <Link href={`/browse?category=${category.slug}`}>
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-medium cursor-pointer hover:opacity-80 transition-opacity",
                          CATEGORY_COLORS[category.color] ||
                            CATEGORY_COLORS.amber
                        )}
                      >
                        {category.name}
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
                        COMPLEXITY_CONFIG[useCase.complexity]?.className
                      )}
                    >
                      {COMPLEXITY_CONFIG[useCase.complexity]?.label}
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
                </div>
              </div>

              {/* Integrations */}
              {integrations.length > 0 && (
                <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-6">
                  <h3 className="font-semibold text-stone-900 mb-4">
                    Integrations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {integrations.map((integration) => (
                      <Badge
                        key={integration.slug}
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
                    {useCase.personas.map((persona: string, idx: number) => (
                      <Link key={idx} href={`/browse?persona=${persona}`}>
                        <Badge
                          variant="outline"
                          className="font-medium text-stone-700 bg-stone-50 border-stone-200 cursor-pointer hover:bg-stone-100 hover:border-stone-300 transition-colors"
                        >
                          {getPersonaLabel(persona)}
                        </Badge>
                      </Link>
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
                  More {category.name.toLowerCase()} examples you might
                  find interesting
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedUseCases.slice(0, 3).map((relatedCase) => (
                  <UseCaseCardComponent
                    key={relatedCase.id}
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
