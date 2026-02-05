import { Suspense } from "react";
import { Tweet } from "react-tweet";
import { ExternalLink, Play } from "lucide-react";
import { extractTweetId, getCachedTweet } from "@/lib/twitter";

interface TwitterVideoEmbedProps {
  sourceUrl: string;
  platformLabel: string;
}

function TweetLoadingFallback() {
  return (
    <div className="flex items-center justify-center rounded-lg border border-stone-200 bg-stone-50 p-12">
      <div className="flex flex-col items-center gap-3 text-stone-500">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-amber-600" />
        <p className="text-sm">Loading tweet...</p>
      </div>
    </div>
  );
}

function ExternalLinkFallback({
  sourceUrl,
  platformLabel,
}: {
  sourceUrl: string;
  platformLabel: string;
}) {
  return (
    <a
      href={sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-lg border border-stone-200 bg-stone-50 p-6 transition-colors hover:border-amber-300 hover:bg-amber-50/50"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white shadow-sm transition-transform group-hover:scale-105 group-hover:border-amber-300">
        <Play className="size-6 text-stone-700 ml-0.5 group-hover:text-amber-700" />
      </div>
      <div>
        <p className="text-[15px] font-semibold text-stone-900 group-hover:text-amber-800">
          Watch video on {platformLabel}
        </p>
        <p className="mt-0.5 text-[13px] text-stone-500">
          This use case includes a video demo. Click to view on the original
          platform.
        </p>
      </div>
      <ExternalLink className="ml-auto size-4 shrink-0 text-stone-400 group-hover:text-amber-600" />
    </a>
  );
}

export async function TwitterVideoEmbed({
  sourceUrl,
  platformLabel,
}: TwitterVideoEmbedProps) {
  const tweetId = extractTweetId(sourceUrl);

  if (!tweetId) {
    return (
      <ExternalLinkFallback
        sourceUrl={sourceUrl}
        platformLabel={platformLabel}
      />
    );
  }

  const tweet = await getCachedTweet(tweetId);

  if (!tweet) {
    return (
      <ExternalLinkFallback
        sourceUrl={sourceUrl}
        platformLabel={platformLabel}
      />
    );
  }

  return (
    <div className="not-prose w-full [&>div]:!mx-auto [&>div]:!max-w-full [&_article]:!border-stone-200 [&_article]:!rounded-lg">
      <Suspense fallback={<TweetLoadingFallback />}>
        <Tweet id={tweetId} />
      </Suspense>
    </div>
  );
}
