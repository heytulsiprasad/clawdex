import { getTweet } from "react-tweet/api";
import { unstable_cache } from "next/cache";

/**
 * Extract tweet ID from a Twitter/X URL.
 * Handles: twitter.com, x.com, with or without query params.
 */
export function extractTweetId(url: string): string | null {
  const match = url.match(
    /(?:twitter\.com|x\.com)\/(?:#!\/)?(?:\w+)\/status(?:es)?\/(\d+)/
  );
  return match?.[1] ?? null;
}

/**
 * Fetch tweet data with Next.js cache (revalidates every hour).
 */
export const getCachedTweet = unstable_cache(
  async (tweetId: string) => getTweet(tweetId),
  ["tweet-cache"],
  { revalidate: 3600 }
);
