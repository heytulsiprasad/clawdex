import type { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { USE_CASES_QUERY, CATEGORIES_QUERY } from "@/lib/sanity/queries";
import { collectionPageSchema } from "@/lib/schema";
import type { UseCaseCard, CategoryView } from "@/types";
import { BrowseClient } from "./browse-client";

export const metadata: Metadata = {
  title: "Browse Use Cases",
  description:
    "Browse and filter the full directory of OpenClaw use cases by category, complexity, and integrations.",
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
