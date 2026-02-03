/**
 * Seed script — pushes categories and integrations into Sanity.
 *
 * Usage:  pnpm tsx scripts/seed.ts
 */

import { createClient } from "next-sanity";
import { CATEGORIES } from "../src/lib/data/categories";
import { INTEGRATIONS } from "../src/lib/data/integrations";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN");
  console.error("Make sure .env.local is loaded. Run with: pnpm tsx --env-file=.env.local scripts/seed.ts");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-02-03",
  useCdn: false,
  token,
});

async function seed() {
  console.log(`Seeding project "${projectId}" / dataset "${dataset}"...\n`);

  // ── Categories ──────────────────────────────────────────────
  console.log("→ Seeding categories...");
  const categoryTx = client.transaction();

  for (const cat of CATEGORIES) {
    categoryTx.createOrReplace({
      _id: `category-${cat.slug}`,
      _type: "category",
      name: cat.name,
      slug: { _type: "slug", current: cat.slug },
      description: cat.description,
      icon: cat.icon,
      color: cat.color,
      order: cat.order,
    });
  }

  const catResult = await categoryTx.commit();
  console.log(`  ✓ ${CATEGORIES.length} categories seeded (tx: ${catResult.transactionId})`);

  // ── Integrations ────────────────────────────────────────────
  console.log("→ Seeding integrations...");
  const integrationTx = client.transaction();

  for (const int of INTEGRATIONS) {
    integrationTx.createOrReplace({
      _id: `integration-${int.slug}`,
      _type: "integration",
      name: int.name,
      slug: { _type: "slug", current: int.slug },
      category: int.category,
    });
  }

  const intResult = await integrationTx.commit();
  console.log(`  ✓ ${INTEGRATIONS.length} integrations seeded (tx: ${intResult.transactionId})`);

  // ── Sample use cases ────────────────────────────────────────
  console.log("→ Seeding sample use cases...");
  const useCaseTx = client.transaction();

  const sampleUseCases = [
    {
      _id: "usecase-flight-checkin",
      title: "Flight Check-in Automation",
      slug: "flight-checkin-automation",
      description:
        "Finds next flight in email, runs through check-in process, selects a window seat — all while driving.",
      category: { _type: "reference" as const, _ref: "category-automation-workflows" },
      complexity: "intermediate",
      type: "workflow",
      channels: [] as string[],
      integrations: [
        { _type: "reference" as const, _ref: "integration-gmail", _key: "gmail" },
        { _type: "reference" as const, _ref: "integration-browser-automation", _key: "browser" },
      ],
      personas: ["developer", "productivity-enthusiast"],
      creator: { handle: "armanddp", name: "Armand du Plessis" },
      sourceUrl: "https://twitter.com/armanddp/status/example",
      sourcePlatform: "twitter",
      media: [] as unknown[],
      upvotes: 234,
      featured: true,
      discoverySource: "manual",
    },
    {
      _id: "usecase-multi-agent-team",
      title: "Multi-Agent Business Team",
      slug: "multi-agent-business-team",
      description:
        "CEO, CTO, and CFO agents collaborate on business decisions with shared memory and task delegation.",
      category: { _type: "reference" as const, _ref: "category-multi-agent-setups" },
      complexity: "advanced",
      type: "multi-agent",
      channels: ["slack"] as string[],
      integrations: [
        { _type: "reference" as const, _ref: "integration-slack", _key: "slack" },
        { _type: "reference" as const, _ref: "integration-notion", _key: "notion" },
      ],
      personas: ["developer", "solo-founder"],
      creator: { handle: "yohasebe", name: "Yoichiro Hasebe" },
      sourceUrl: "https://twitter.com/yohasebe/status/example",
      sourcePlatform: "twitter",
      media: [] as unknown[],
      upvotes: 189,
      featured: true,
      discoverySource: "manual",
    },
    {
      _id: "usecase-smart-home-voice",
      title: "Smart Home Voice Controller",
      slug: "smart-home-voice-controller",
      description:
        "Control Home Assistant devices, check weather, play music, and manage routines through natural conversation.",
      category: { _type: "reference" as const, _ref: "category-smart-home-iot" },
      complexity: "intermediate",
      type: "hardware",
      channels: [] as string[],
      integrations: [
        { _type: "reference" as const, _ref: "integration-home-assistant", _key: "ha" },
        { _type: "reference" as const, _ref: "integration-homepod", _key: "homepod" },
      ],
      personas: ["smart-home-enthusiast", "family-manager"],
      creator: { handle: "cjdutoit", name: "CJ du Toit" },
      sourceUrl: "https://reddit.com/r/openclaw/example",
      sourcePlatform: "reddit",
      media: [] as unknown[],
      upvotes: 167,
      featured: true,
      discoverySource: "manual",
    },
    {
      _id: "usecase-pr-review-deploy",
      title: "PR Review & Deploy Pipeline",
      slug: "pr-review-deploy-pipeline",
      description:
        "Automatically reviews PRs, runs tests, provides feedback, and triggers deployment on approval.",
      category: { _type: "reference" as const, _ref: "category-development-devops" },
      complexity: "intermediate",
      type: "workflow",
      channels: [] as string[],
      integrations: [
        { _type: "reference" as const, _ref: "integration-github", _key: "github" },
        { _type: "reference" as const, _ref: "integration-vercel", _key: "vercel" },
      ],
      personas: ["developer"],
      creator: { handle: "scottw", name: "Scott W" },
      sourceUrl: "https://github.com/scottw/example",
      sourcePlatform: "github",
      media: [] as unknown[],
      upvotes: 156,
      featured: true,
      discoverySource: "manual",
    },
    {
      _id: "usecase-family-meal-planner",
      title: "Family Meal Planner",
      slug: "family-meal-planner",
      description:
        "Plans weekly meals based on dietary preferences, generates shopping lists, and coordinates family schedules.",
      category: { _type: "reference" as const, _ref: "category-family-personal" },
      complexity: "beginner",
      type: "workflow",
      channels: [] as string[],
      integrations: [
        { _type: "reference" as const, _ref: "integration-google-calendar", _key: "gcal" },
        { _type: "reference" as const, _ref: "integration-todoist", _key: "todoist" },
      ],
      personas: ["family-manager"],
      creator: { handle: "sarahdev", name: "Sarah Developer" },
      sourceUrl: "https://reddit.com/r/openclaw/example2",
      sourcePlatform: "reddit",
      media: [] as unknown[],
      upvotes: 142,
      featured: false,
      discoverySource: "manual",
    },
    {
      _id: "usecase-youtube-research",
      title: "YouTube Research Pipeline",
      slug: "youtube-research-pipeline",
      description:
        "Transcribes videos, extracts key insights, generates summaries, and organizes research in Obsidian.",
      category: { _type: "reference" as const, _ref: "category-learning-research" },
      complexity: "intermediate",
      type: "workflow",
      channels: [] as string[],
      integrations: [
        { _type: "reference" as const, _ref: "integration-youtube", _key: "youtube" },
        { _type: "reference" as const, _ref: "integration-obsidian", _key: "obsidian" },
      ],
      personas: ["developer", "content-creator"],
      creator: { handle: "alexresearch", name: "Alex R" },
      sourceUrl: "https://twitter.com/alexresearch/example",
      sourcePlatform: "twitter",
      media: [] as unknown[],
      upvotes: 128,
      featured: false,
      discoverySource: "manual",
    },
  ];

  for (const uc of sampleUseCases) {
    useCaseTx.createOrReplace({
      ...uc,
      _type: "useCase",
      slug: { _type: "slug", current: uc.slug },
    });
  }

  const ucResult = await useCaseTx.commit();
  console.log(`  ✓ ${sampleUseCases.length} use cases seeded (tx: ${ucResult.transactionId})`);

  console.log("\n✓ Seeding complete!");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
