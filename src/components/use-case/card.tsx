import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { UseCaseCard } from "@/types";
import { cn } from "@/lib/utils";

const COMPLEXITY_CONFIG = {
  beginner: { label: "Beginner", className: "text-emerald-400 border-emerald-500/20 bg-emerald-500/[0.06]" },
  intermediate: { label: "Intermediate", className: "text-blue-400 border-blue-500/20 bg-blue-500/[0.06]" },
  advanced: { label: "Advanced", className: "text-purple-400 border-purple-500/20 bg-purple-500/[0.06]" },
} as const;

const CATEGORY_COLORS: Record<string, string> = {
  amber: "text-amber-400 bg-amber-500/[0.06] border-amber-500/15",
  blue: "text-blue-400 bg-blue-500/[0.06] border-blue-500/15",
  green: "text-emerald-400 bg-emerald-500/[0.06] border-emerald-500/15",
  purple: "text-purple-400 bg-purple-500/[0.06] border-purple-500/15",
  pink: "text-pink-400 bg-pink-500/[0.06] border-pink-500/15",
  cyan: "text-cyan-400 bg-cyan-500/[0.06] border-cyan-500/15",
  orange: "text-orange-400 bg-orange-500/[0.06] border-orange-500/15",
  slate: "text-slate-400 bg-slate-500/[0.06] border-slate-500/15",
  indigo: "text-indigo-400 bg-indigo-500/[0.06] border-indigo-500/15",
  rose: "text-rose-400 bg-rose-500/[0.06] border-rose-500/15",
};

export function UseCaseCardComponent({ useCase }: { useCase: UseCaseCard }) {
  const complexity = COMPLEXITY_CONFIG[useCase.complexity];
  const categoryColor = CATEGORY_COLORS[useCase.category.color] || CATEGORY_COLORS.amber;

  return (
    <Link
      href={`/use-case/${useCase.slug}`}
      className="group relative block"
    >
      {/* Hover border glow */}
      <div className="pointer-events-none absolute -inset-[1px] rounded-xl bg-gradient-to-b from-amber-500/0 via-amber-500/0 to-amber-500/0 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:from-amber-500/[0.08] group-hover:via-transparent group-hover:to-orange-500/[0.05]" />

      <div className="relative flex h-full flex-col rounded-xl border border-white/[0.05] bg-card/60 backdrop-blur-sm p-5 transition-all duration-300 group-hover:border-white/[0.08] group-hover:bg-card/80">
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
        <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-foreground leading-snug mb-2 group-hover:text-amber-50 transition-colors">
          {useCase.title}
        </h3>

        {/* Description */}
        <p className="text-[13px] leading-relaxed text-muted-foreground/80 line-clamp-2 mb-4 flex-1">
          {useCase.description}
        </p>

        {/* Integrations */}
        {useCase.integrations.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {useCase.integrations.map((integration) => (
              <span
                key={integration.slug}
                className="rounded-md bg-white/[0.04] border border-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-muted-foreground/60"
              >
                {integration.name}
              </span>
            ))}
          </div>
        )}

        {/* Bottom row: Creator + Upvotes */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
          <span className="text-[12px] text-muted-foreground/50 font-mono">
            @{useCase.creator.handle}
          </span>
          <div className="flex items-center gap-1 text-muted-foreground/40 transition-colors group-hover:text-amber-400/60">
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
