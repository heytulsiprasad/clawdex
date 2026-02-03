import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { UseCaseCard } from "@/types";
import { cn } from "@/lib/utils";

const COMPLEXITY_CONFIG = {
  beginner: { label: "Beginner", className: "text-emerald-700 border-emerald-200 bg-emerald-50" },
  intermediate: { label: "Intermediate", className: "text-blue-700 border-blue-200 bg-blue-50" },
  advanced: { label: "Advanced", className: "text-purple-700 border-purple-200 bg-purple-50" },
} as const;

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
  const complexity = COMPLEXITY_CONFIG[useCase.complexity];
  const categoryColor = CATEGORY_COLORS[useCase.category.color] || CATEGORY_COLORS.amber;

  return (
    <Link
      href={`/use-case/${useCase.slug}`}
      className="group relative block"
    >
      <div className="relative flex h-full flex-col rounded-xl border border-stone-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300 group-hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] group-hover:border-stone-300/80 group-hover:-translate-y-0.5">
        {/* Top row: Category + Complexity */}
        <div className="flex items-start justify-between gap-2 mb-3">
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
              "rounded-md text-[10px] font-medium px-2 py-0.5",
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
        {useCase.integrations.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {useCase.integrations.map((integration) => (
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
          <span className="text-[12px] text-muted-foreground/70 font-mono">
            @{useCase.creator.handle}
          </span>
          <div className="flex items-center gap-1 text-stone-400 transition-colors group-hover:text-amber-600">
            <ArrowUp className="size-3" />
            <span className="text-[12px] font-medium tabular-nums">
              {useCase.upvotes}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
