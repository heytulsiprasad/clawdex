import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-02-03",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function main() {
  const counts = await client.fetch(`{
    "twitter": count(*[_type == "submission" && status == "pending" && sourcePlatform == "twitter"]),
    "reddit": count(*[_type == "submission" && status == "pending" && sourcePlatform == "reddit"]),
    "hackernews": count(*[_type == "submission" && status == "pending" && sourcePlatform == "hackernews"]),
    "github": count(*[_type == "submission" && status == "pending" && sourcePlatform == "github"]),
    "devto": count(*[_type == "submission" && status == "pending" && sourcePlatform == "devto"]),
    "total": count(*[_type == "submission" && status == "pending"])
  }`);

  console.log("Pending submissions by platform:");
  console.log(JSON.stringify(counts, null, 2));
}

main();
