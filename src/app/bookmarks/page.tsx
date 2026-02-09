"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, ArrowRight, LogIn } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { UseCaseCardComponent } from "@/components/use-case/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/firebase/auth-context";
import { useBookmarks } from "@/lib/firebase/use-bookmarks";
import type { UseCaseCard } from "@/types";

export default function BookmarksPage() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const { bookmarks, loading: bookmarksLoading } = useBookmarks();
  const [useCases, setUseCases] = useState<UseCaseCard[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);

  useEffect(() => {
    async function fetchBookmarkedUseCases() {
      if (!user || bookmarks.size === 0) {
        setUseCases([]);
        return;
      }

      setFetchLoading(true);
      try {
        const ids = Array.from(bookmarks);
        const response = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch bookmarks");
        }

        const data = await response.json();
        setUseCases(data.results || []);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
        setUseCases([]);
      } finally {
        setFetchLoading(false);
      }
    }

    if (!bookmarksLoading) {
      fetchBookmarkedUseCases();
    }
  }, [user, bookmarks, bookmarksLoading]);

  const isLoading = authLoading || bookmarksLoading || fetchLoading;

  return (
    <div className="min-h-screen bg-[#fafaf8] flex flex-col">
      <Header />
      <main className="flex-1 pt-14">
        {/* Header Section */}
        <div className="border-b border-stone-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 md:py-12">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                    <Bookmark className="size-6 text-amber-600" fill="currentColor" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900">
                    My Bookmarks
                  </h1>
                </div>
                <p className="text-stone-600 max-w-2xl">
                  {user
                    ? "Your saved AI workflows and use cases"
                    : "Sign in to save and organize your favorite AI workflows"}
                </p>
              </div>
              <Link href="/browse">
                <Button
                  variant="outline"
                  className="hidden md:flex items-center gap-2 border-stone-300 hover:border-amber-300 hover:bg-amber-50"
                >
                  Browse more
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 md:py-12">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
              <p className="text-stone-500 text-sm">Loading your bookmarks...</p>
            </div>
          ) : !user ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="p-4 rounded-full bg-stone-100 mb-6">
                <LogIn className="size-10 text-stone-400" />
              </div>
              <h2 className="text-2xl font-semibold text-stone-900 mb-3">
                Sign in to save your favorites
              </h2>
              <p className="text-stone-600 max-w-md mb-6">
                Create an account to bookmark use cases and build your personal collection of AI workflows.
              </p>
              <Button
                onClick={() => signInWithGoogle()}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <LogIn className="size-4 mr-2" />
                Sign in with Google
              </Button>
            </div>
          ) : bookmarks.size === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="p-4 rounded-full bg-stone-100 mb-6">
                <Bookmark className="size-10 text-stone-400" />
              </div>
              <h2 className="text-2xl font-semibold text-stone-900 mb-3">
                No bookmarks yet
              </h2>
              <p className="text-stone-600 max-w-md mb-6">
                Start exploring and bookmark your favorite AI workflows to find them here later.
              </p>
              <Link href="/browse">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                  Browse use cases
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-stone-600">
                  {bookmarks.size} {bookmarks.size === 1 ? "bookmark" : "bookmarks"}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {useCases.map((useCase) => (
                  <UseCaseCardComponent key={useCase.id} useCase={useCase} />
                ))}
              </div>
            </>
          )}

          {/* Mobile Browse Button */}
          {user && (
            <div className="mt-8 md:hidden text-center">
              <Link href="/browse">
                <Button
                  variant="outline"
                  className="w-full border-stone-300 hover:border-amber-300 hover:bg-amber-50"
                >
                  Browse more use cases
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
