"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookmarks } from "@/lib/firebase/use-bookmarks";
import { useAuth } from "@/lib/firebase/auth-context";

interface BookmarkButtonProps {
  useCaseId: string;
  useCaseTitle: string;
  variant: "card" | "detail";
}

export function BookmarkButton({
  useCaseId,
  useCaseTitle,
  variant,
}: BookmarkButtonProps) {
  const { user, signInWithGoogle } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [animating, setAnimating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bookmarked = isBookmarked(useCaseId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (animating) return;

    if (!user) {
      try {
        await signInWithGoogle();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Sign in failed");
        setTimeout(() => setError(null), 2500);
        return;
      }
    }

    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);

    try {
      await toggleBookmark(useCaseId, useCaseTitle);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bookmark failed");
      setTimeout(() => setError(null), 2500);
      setAnimating(false);
    }
  };

  if (variant === "card") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={bookmarked ? "Remove bookmark" : "Bookmark this use case"}
        className={cn(
          "relative flex items-center justify-center rounded-md border p-1.5",
          "transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400",
          "active:scale-[0.92] active:duration-75",
          animating && "scale-[0.92]",
          bookmarked
            ? "border-amber-200 bg-amber-50 text-amber-600"
            : "border-stone-200 bg-stone-50/80 text-stone-500 hover:border-amber-200 hover:bg-amber-50/60 hover:text-amber-600"
        )}
      >
        <Bookmark
          className="size-3.5"
          fill={bookmarked ? "currentColor" : "none"}
          strokeWidth={bookmarked ? 2 : 2}
        />

        {error && (
          <span className="absolute -top-6 right-0 whitespace-nowrap rounded bg-red-50 border border-red-200 px-1.5 py-0.5 text-[10px] font-medium text-red-600 shadow-sm">
            {error}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        aria-label={bookmarked ? "Remove bookmark" : "Bookmark this use case"}
        className={cn(
          "group/bookmark flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5",
          "transition-all duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1",
          "active:scale-[0.97] active:duration-75",
          animating && "scale-[0.97]",
          bookmarked
            ? "bg-amber-50 border-amber-300 text-amber-700 shadow-[0_0_0_1px_rgba(245,158,11,0.08)]"
            : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700"
        )}
      >
        <Bookmark
          className={cn(
            "size-4 transition-transform duration-150",
            !bookmarked && "group-hover/bookmark:scale-110"
          )}
          fill={bookmarked ? "currentColor" : "none"}
          strokeWidth={bookmarked ? 2 : 2.25}
        />
        <span className="text-[13px] font-medium">
          {bookmarked ? "Bookmarked" : "Bookmark"}
        </span>
      </button>

      {error && (
        <p className="mt-1.5 text-center text-[11px] font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
