"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface UpvoteButtonProps {
  id: string;
  initialCount: number;
  variant: "card" | "detail" | "hero";
}

const STORAGE_PREFIX = "clawdex:upvoted:";

export function UpvoteButton({ id, initialCount, variant }: UpvoteButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  // Hydrate voted state from localStorage
  useEffect(() => {
    try {
      if (localStorage.getItem(`${STORAGE_PREFIX}${id}`) === "1") {
        setVoted(true);
      }
    } catch {
      // localStorage unavailable (SSR, private browsing)
    }
  }, [id]);

  // Clear error after 2.5s
  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 2500);
    return () => clearTimeout(t);
  }, [error]);

  const handleUpvote = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (voted || animating) return;

      // Optimistic update
      setCount((c) => c + 1);
      setVoted(true);
      setAnimating(true);

      // Remove animation classes after they finish
      const timer = setTimeout(() => setAnimating(false), 450);

      try {
        const res = await fetch("/api/upvote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Vote failed");
        }

        // Persist to localStorage on confirmed success
        try {
          localStorage.setItem(`${STORAGE_PREFIX}${id}`, "1");
        } catch {
          // silent
        }
      } catch (err) {
        // Rollback
        setCount((c) => c - 1);
        setVoted(false);
        setError(err instanceof Error ? err.message : "Vote failed");
        clearTimeout(timer);
        setAnimating(false);
      }
    },
    [id, voted, animating]
  );

  // ─── Card Variant ───────────────────────────────────────────────────────────
  if (variant === "card") {
    return (
      <button
        type="button"
        onClick={handleUpvote}
        disabled={voted}
        aria-label={voted ? "Upvoted" : "Upvote this use case"}
        className={cn(
          "relative flex items-center gap-1 rounded-md border px-2 py-1",
          "transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400",
          "active:scale-[0.96] active:duration-75",
          voted
            ? "border-amber-200 bg-amber-50 text-amber-600 cursor-default"
            : "border-stone-200 bg-stone-50/80 text-stone-500 hover:border-amber-200 hover:bg-amber-50/60 hover:text-amber-600 cursor-pointer"
        )}
      >
        <ChevronUp
          ref={iconRef}
          className={cn(
            "size-3.5 transition-transform duration-150 -mr-0.5",
            animating && "animate-upvote-pulse"
          )}
          strokeWidth={voted ? 2.5 : 2}
        />
        <span
          ref={countRef}
          className={cn(
            "text-[12px] tabular-nums transition-colors duration-200",
            voted ? "font-semibold" : "font-medium",
            animating && "animate-upvote-count"
          )}
        >
          {count}
        </span>

        {/* Inline error whisper */}
        {error && (
          <span className="absolute -top-6 right-0 whitespace-nowrap rounded bg-red-50 border border-red-200 px-1.5 py-0.5 text-[10px] font-medium text-red-600 shadow-sm">
            {error}
          </span>
        )}
      </button>
    );
  }

  // ─── Hero Variant ──────────────────────────────────────────────────────────
  if (variant === "hero") {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={handleUpvote}
          disabled={voted}
          aria-label={voted ? "Upvoted" : "Upvote this use case"}
          className={cn(
            "group/upvote flex w-20 flex-col items-center gap-1 rounded-xl border py-3.5 px-2",
            "transition-all duration-200 ease-out",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2",
            "active:scale-[0.95] active:duration-75",
            voted
              ? "bg-amber-50 border-amber-300 shadow-[0_2px_8px_rgba(245,158,11,0.12)] cursor-default"
              : "bg-white border-stone-200 shadow-sm hover:border-amber-200 hover:shadow-md hover:bg-amber-50/50 cursor-pointer"
          )}
        >
          <ChevronUp
            className={cn(
              "size-5 transition-all duration-150",
              voted
                ? "text-amber-500"
                : "text-stone-500 group-hover/upvote:text-amber-500 group-hover/upvote:scale-110",
              animating && "animate-upvote-pulse"
            )}
            fill={voted ? "currentColor" : "none"}
            strokeWidth={voted ? 2.5 : 2.25}
          />
          <span
            className={cn(
              "text-lg font-bold tabular-nums leading-none tracking-tight transition-colors duration-200",
              voted ? "text-amber-700" : "text-stone-900",
              animating && "animate-upvote-count"
            )}
          >
            {count}
          </span>
          <span
            className={cn(
              "text-[10px] font-semibold uppercase tracking-widest leading-none transition-colors duration-200",
              voted ? "text-amber-600" : "text-stone-500"
            )}
          >
            {voted ? "Upvoted" : "Upvote"}
          </span>
        </button>

        {error && (
          <p className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-center text-[10px] font-medium text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }

  // ─── Detail Variant ─────────────────────────────────────────────────────────
  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleUpvote}
        disabled={voted}
        aria-label={voted ? "Upvoted" : "Upvote this use case"}
        className={cn(
          "group/upvote flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5",
          "transition-all duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1",
          "active:scale-[0.97] active:duration-75",
          voted
            ? "bg-amber-50 border-amber-300 text-amber-700 shadow-[0_0_0_1px_rgba(245,158,11,0.08)] cursor-default"
            : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 cursor-pointer"
        )}
      >
        <ChevronUp
          className={cn(
            "size-4 transition-transform duration-150",
            !voted && "group-hover/upvote:scale-110",
            animating && "animate-upvote-pulse"
          )}
          fill={voted ? "currentColor" : "none"}
          strokeWidth={voted ? 2 : 2.25}
        />
        <span
          className={cn(
            "text-[13px] font-semibold tabular-nums tracking-tight",
            animating && "animate-upvote-count"
          )}
        >
          {count}
        </span>
        <span className="text-[13px] font-medium">
          {voted ? "Upvoted" : "Upvote"}
        </span>
      </button>

      {/* Error message below button */}
      {error && (
        <p className="mt-1.5 text-center text-[11px] font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
