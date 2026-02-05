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
import type { CategoryView } from "@/types";
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

const COLOR_MAP: Record<string, { icon: string; bg: string; border: string }> = {
  amber: {
    icon: "text-amber-600",
    bg: "group-hover:bg-amber-50/60",
    border: "group-hover:border-amber-200",
  },
  blue: {
    icon: "text-blue-600",
    bg: "group-hover:bg-blue-50/60",
    border: "group-hover:border-blue-200",
  },
  green: {
    icon: "text-emerald-600",
    bg: "group-hover:bg-emerald-50/60",
    border: "group-hover:border-emerald-200",
  },
  purple: {
    icon: "text-purple-600",
    bg: "group-hover:bg-purple-50/60",
    border: "group-hover:border-purple-200",
  },
  pink: {
    icon: "text-pink-600",
    bg: "group-hover:bg-pink-50/60",
    border: "group-hover:border-pink-200",
  },
  cyan: {
    icon: "text-cyan-600",
    bg: "group-hover:bg-cyan-50/60",
    border: "group-hover:border-cyan-200",
  },
  orange: {
    icon: "text-orange-600",
    bg: "group-hover:bg-orange-50/60",
    border: "group-hover:border-orange-200",
  },
  slate: {
    icon: "text-slate-600",
    bg: "group-hover:bg-slate-50/60",
    border: "group-hover:border-slate-200",
  },
  indigo: {
    icon: "text-indigo-600",
    bg: "group-hover:bg-indigo-50/60",
    border: "group-hover:border-indigo-200",
  },
  rose: {
    icon: "text-rose-600",
    bg: "group-hover:bg-rose-50/60",
    border: "group-hover:border-rose-200",
  },
};

export function CategoryCard({ category }: { category: CategoryView }) {
  const Icon = ICON_MAP[category.icon] || Zap;
  const colors = COLOR_MAP[category.color] || COLOR_MAP.amber;

  return (
    <Link
      href={`/browse?category=${category.slug}`}
      className={cn(
        "group relative block rounded-xl border border-stone-200/80 bg-white p-4 transition-all duration-300",
        "shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)]",
        colors.bg,
        colors.border
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-50 border border-stone-100 transition-colors group-hover:border-stone-200">
          <Icon className={cn("size-4", colors.icon)} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[14px] font-semibold text-foreground tracking-[-0.01em] transition-colors">
            {category.name}
          </h3>
          <p className="mt-0.5 text-[12px] text-muted-foreground line-clamp-1">
            {category.description}
          </p>
        </div>
      </div>

      {/* Count */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px] font-medium text-muted-foreground/60 tabular-nums">
          {category.useCaseCount} use cases
        </span>
        <div className="h-[1px] flex-1 mx-3 bg-gradient-to-r from-stone-200/60 to-transparent" />
      </div>
    </Link>
  );
}
