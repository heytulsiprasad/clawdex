import Link from "next/link";
import {
  Zap,
  Code,
  Home,
  Target,
  Users,
  Phone,
  Network,
  Cpu,
  BookOpen,
  Palette,
  type LucideIcon,
} from "lucide-react";
import type { CategoryWithCount } from "@/types";
import { cn } from "@/lib/utils";

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

const COLOR_MAP: Record<string, { icon: string; glow: string; border: string }> = {
  amber: {
    icon: "text-amber-400",
    glow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.06)]",
    border: "group-hover:border-amber-500/15",
  },
  blue: {
    icon: "text-blue-400",
    glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.06)]",
    border: "group-hover:border-blue-500/15",
  },
  green: {
    icon: "text-emerald-400",
    glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.06)]",
    border: "group-hover:border-emerald-500/15",
  },
  purple: {
    icon: "text-purple-400",
    glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.06)]",
    border: "group-hover:border-purple-500/15",
  },
  pink: {
    icon: "text-pink-400",
    glow: "group-hover:shadow-[0_0_30px_rgba(236,72,153,0.06)]",
    border: "group-hover:border-pink-500/15",
  },
  cyan: {
    icon: "text-cyan-400",
    glow: "group-hover:shadow-[0_0_30px_rgba(34,211,238,0.06)]",
    border: "group-hover:border-cyan-500/15",
  },
  orange: {
    icon: "text-orange-400",
    glow: "group-hover:shadow-[0_0_30px_rgba(251,146,60,0.06)]",
    border: "group-hover:border-orange-500/15",
  },
  slate: {
    icon: "text-slate-400",
    glow: "group-hover:shadow-[0_0_30px_rgba(148,163,184,0.04)]",
    border: "group-hover:border-slate-500/15",
  },
  indigo: {
    icon: "text-indigo-400",
    glow: "group-hover:shadow-[0_0_30px_rgba(129,140,248,0.06)]",
    border: "group-hover:border-indigo-500/15",
  },
  rose: {
    icon: "text-rose-400",
    glow: "group-hover:shadow-[0_0_30px_rgba(251,113,133,0.06)]",
    border: "group-hover:border-rose-500/15",
  },
};

export function CategoryCard({ category }: { category: CategoryWithCount }) {
  const Icon = ICON_MAP[category.icon] || Zap;
  const colors = COLOR_MAP[category.color] || COLOR_MAP.amber;

  return (
    <Link
      href={`/browse?category=${category.slug.current}`}
      className={cn(
        "group relative block rounded-xl border border-white/[0.05] bg-card/40 p-4 transition-all duration-300",
        "hover:bg-card/70",
        colors.glow,
        colors.border
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.04] transition-colors group-hover:bg-white/[0.06]">
          <Icon className={cn("size-4", colors.icon)} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[14px] font-semibold text-foreground tracking-[-0.01em] group-hover:text-foreground/95 transition-colors">
            {category.name}
          </h3>
          <p className="mt-0.5 text-[12px] text-muted-foreground/60 line-clamp-1">
            {category.description}
          </p>
        </div>
      </div>

      {/* Count */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px] font-medium text-muted-foreground/40 tabular-nums">
          {category.useCaseCount} use cases
        </span>
        <div className="h-[1px] flex-1 mx-3 bg-gradient-to-r from-white/[0.04] to-transparent" />
      </div>
    </Link>
  );
}
