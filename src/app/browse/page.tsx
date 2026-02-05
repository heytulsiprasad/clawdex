import { client } from "@/lib/sanity/client";
import { USE_CASES_QUERY, CATEGORIES_QUERY } from "@/lib/sanity/queries";
import type { UseCaseCard, CategoryView } from "@/types";
import { BrowseClient } from "./browse-client";

export default async function BrowsePage() {
  const [useCases, categories] = await Promise.all([
    client.fetch<UseCaseCard[]>(USE_CASES_QUERY),
    client.fetch<CategoryView[]>(CATEGORIES_QUERY),
  ]);

  return <BrowseClient useCases={useCases} categories={categories} />;
}
