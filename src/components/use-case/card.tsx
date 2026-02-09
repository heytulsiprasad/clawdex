"use client";

import Link from "next/link";
import Image from "next/image";
import { Twitter, Github, Youtube, MessageSquare, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UpvoteButton } from "@/components/use-case/upvote-button";
import { BookmarkButton } from "@/components/use-case/bookmark-button";
import type { UseCaseCard } from "@/types";
import { cn } from "@/lib/utils";

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
  other: Globe,
};

const COMPLEXITY_CONFIG: Record<string, { label: string; className: string }> = {
  beginner: { label: "Beginner", className: "text-emerald-700 border-emerald-200 bg-emerald-50" },
  intermediate: { label: "Intermediate", className: "text-blue-700 border-blue-200 bg-blue-50" },
  advanced: { label: "Advanced", className: "text-purple-700 border-purple-200 bg-purple-50" },
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

export function UseCaseCardComponent({ useCase }: { useCase: UseCaseCard }) {
  if (!useCase.category) return null;

  const complexity = COMPLEXITY_CONFIG[useCase.complexity];
  const categoryColor = CATEGORY_COLORS[useCase.category.color] || CATEGORY_COLORS.amber;
  const PlatformIcon = PLATFORM_ICONS[useCase.sourcePlatform || "other"] || PLATFORM_ICONS.other;

  return (
    <Link
      href={`/use-case/${useCase.slug}`}
      className="group relative block"
    >
      <div className="relative flex h-full flex-col rounded-xl border border-stone-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300 group-hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] group-hover:border-stone-300/80 group-hover:-translate-y-0.5">
        {/* Top row: Category + Complexity */}
        <div className="flex flex-wrap items-start gap-2 mb-3">
          <Badge
            variant="outline"
            className={cn(
              "rounded-md text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5",
              categoryColor
            )}
          >
            {useCase.category.name}
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              "rounded-md text-[10px] font-medium px-2 py-0.5 shrink-0",
              complexity.className
            )}
          >
            {complexity.label}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-foreground leading-snug mb-2 group-hover:text-amber-700 transition-colors">
          {useCase.title}
        </h3>

        {/* Description */}
        <p className="text-[13px] leading-relaxed text-muted-foreground line-clamp-2 mb-4 flex-1">
          {useCase.description}
        </p>

        {/* Integrations */}
        {useCase.integrations?.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {useCase.integrations.filter(Boolean).map((integration) => (
              <span
                key={integration.slug}
                className="rounded-md bg-stone-50 border border-stone-200/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
              >
                {integration.name}
              </span>
            ))}
          </div>
        )}

        {/* Bottom row: Creator + Upvotes */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <div className="flex items-center gap-1.5">
            <Image
              src={`https://unavatar.io/twitter/${useCase.creator.handle}`}
              alt={useCase.creator.handle}
              width={18}
              height={18}
              className="rounded-full bg-stone-100"
              unoptimized
            />
            <span className="text-[12px] text-muted-foreground/70 font-mono">
              @{useCase.creator.handle}
            </span>
            <PlatformIcon className="size-3 text-muted-foreground/50" />
          </div>
          <div className="flex items-center gap-1.5">
            <BookmarkButton useCaseId={useCase.id} useCaseTitle={useCase.title} variant="card" />
            <UpvoteButton id={useCase.id} initialCount={useCase.upvotes} variant="card" />
          </div>
        </div>
      </div>
    </Link>
  );
}
