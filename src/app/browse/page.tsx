import type { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { USE_CASES_QUERY, CATEGORIES_QUERY } from "@/lib/sanity/queries";
import { collectionPageSchema } from "@/lib/schema";
import type { UseCaseCard, CategoryView } from "@/types";
import { BrowseClient } from "./browse-client";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://clawdex.io";

export const metadata: Metadata = {
  title: "Browse AI Workflows & Use Cases",
  description:
    "Browse and filter 90+ AI agent workflows. Find use cases by category, complexity, and integrations. Smart home, productivity, developer tools, and more.",
  openGraph: {
    title: "Browse AI Workflows | ClawDex",
    description:
      "Browse and filter 90+ AI agent workflows by category, complexity, and integrations.",
    url: `${siteUrl}/browse`,
    images: [
      {
        url: `${siteUrl}/og?title=Browse%20AI%20Workflows&subtitle=Filter%20by%20category%2C%20complexity%2C%20and%20integrations`,
        width: 1200,
        height: 630,
        alt: "Browse AI Workflows on ClawDex",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse AI Workflows | ClawDex",
    description: "Browse and filter 90+ AI agent workflows by category, complexity, and integrations.",
  },
  alternates: {
    canonical: `${siteUrl}/browse`,
  },
};

export default async function BrowsePage() {
  const [useCases, categories] = await Promise.all([
    client.fetch<UseCaseCard[]>(USE_CASES_QUERY),
    client.fetch<CategoryView[]>(CATEGORIES_QUERY),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageSchema(useCases.length)),
        }}
      />
      <BrowseClient useCases={useCases} categories={categories} />
    </>
  );
}
