/**
 * Discovery ingestion script — reads pre-enriched JSON and creates Sanity CMS documents.
 *
 * This script does NOT make AI API calls. It processes data that has already been
 * classified and enriched by an AI agent (Friday).
 *
 * Usage:  pnpm tsx --env-file=.env.local scripts/discover-ingest.ts --input /path/to/discoveries.json
 *
 * Routing logic:
 *   - isRelevant === false → skip entirely
 *   - confidence >= 0.8 → create useCase (auto-published)
 *   - confidence < 0.8 but isRelevant → create submission (status: pending)
 */

import { createClient } from "next-sanity";
import { createHash } from "crypto";
import { readFile } from "fs/promises";

// ── Environment & Client Setup ───────────────────────────────────────────

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error("❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-02-03",
  useCdn: false,
  token,
});

// ── Types ────────────────────────────────────────────────────────────────

interface MediaRef {
  url: string;
  type: "image" | "video" | "gif" | "thumbnail";
  width?: number;
  height?: number;
  altText?: string;
}

interface Author {
  handle: string;
  name?: string;
  avatarUrl?: string;
  profileUrl?: string;
}

interface Engagement {
  likes?: number;
  comments?: number;
  shares?: number;
  views?: number;
}

interface Enrichment {
  isRelevant: boolean;
  confidence: number;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  complexity: "beginner" | "intermediate" | "advanced";
  type: "workflow" | "skill" | "cron-job" | "multi-agent" | "hardware";
  channels: string[];
  personas: string[];
  integrations: string[];
}

interface DiscoveredItem {
  sourceUrl: string;
  sourcePlatform: string;
  rawText: string;
  title?: string;
  author: Author;
  engagement: Engagement;
  mediaUrls: MediaRef[];
  publishedAt?: string;
  discoveredAt: string;
  tags?: string[];
  parentUrl?: string;
  enrichment: Enrichment;
}

interface DiscoveryBatch {
  version: number;
  discoveredAt: string;
  runId: string;
  platform: string;
  items: DiscoveredItem[];
}

interface SanityDocument {
  _id: string;
  _type: string;
  [key: string]: unknown;
}

interface ProcessingStats {
  autoPublished: number;
  submittedForReview: number;
  skipped: number;
  errors: number;
  duplicates: number;
}

// ── Category ID Mapping ──────────────────────────────────────────────────

const CATEGORY_ID_MAP: Record<string, string> = {
  "automation-workflows": "category-automation-workflows",
  "development-devops": "category-development-devops",
  "smart-home-iot": "category-smart-home-iot",
  "productivity": "category-productivity",
  "family-personal": "category-family-personal",
  "voice-communication": "category-voice-communication",
  "multi-agent-setups": "category-multi-agent-setups",
  "hardware-edge": "category-hardware-edge",
  "learning-research": "category-learning-research",
  "creative-media": "category-creative-media",
};

// ── Helpers ──────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 96);
}

function hashUrl(url: string): string {
  return createHash("sha256").update(url).digest("hex").substring(0, 16);
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.substring(0, max - 3).replace(/\s+\S*$/, "") + "...";
}

function calculateTotalEngagement(engagement: Engagement): number {
  return (
    (engagement.likes || 0) +
    (engagement.comments || 0) +
    (engagement.shares || 0) +
    (engagement.views || 0)
  );
}

// ── Deduplication ────────────────────────────────────────────────────────

async function isUrlAlreadyIngested(url: string): Promise<boolean> {
  try {
    const query = `count(*[_type in ["useCase", "submission"] && sourceUrl == $url]) > 0`;
    const result = await client.fetch<boolean>(query, { url });
    return result;
  } catch (error) {
    console.error(`  ⚠️  Error checking duplicate for ${url}:`, error);
    return false;
  }
}

// ── Image Upload ─────────────────────────────────────────────────────────

async function uploadImage(
  imageUrl: string,
  filename: string
): Promise<string | null> {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) {
      console.error(`  ⚠️  Failed to fetch image ${imageUrl}: ${res.status}`);
      return null;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    const asset = await client.assets.upload("image", buffer, {
      filename,
      contentType: res.headers.get("content-type") || "image/jpeg",
    });
    return asset._id;
  } catch (error) {
    console.error(`  ⚠️  Error uploading image ${imageUrl}:`, error);
    return null;
  }
}

// ── Media Processing ─────────────────────────────────────────────────────

async function processMedia(
  mediaUrls: MediaRef[],
  author: Author,
  urlHash: string
): Promise<Array<Record<string, unknown>>> {
  const media: Array<Record<string, unknown>> = [];
  let imageCount = 0;
  let videoCount = 0;

  for (let i = 0; i < mediaUrls.length; i++) {
    const m = mediaUrls[i];

    // Limit: max 4 images and 2 video embeds
    if (m.type === "image" && imageCount >= 4) continue;
    if (m.type === "video" && videoCount >= 2) continue;

    if (m.type === "image" || m.type === "thumbnail") {
      const assetId = await uploadImage(
        m.url,
        `${author.handle || "unknown"}-${urlHash}-${i}.jpg`
      );
      if (assetId) {
        media.push({
          _type: "image",
          _key: `img-${i}`,
          asset: { _type: "reference", _ref: assetId },
          alt: m.altText || `Media from ${author.handle}`,
        });
        imageCount++;
      }
    } else if (m.type === "video" || m.type === "gif") {
      media.push({
        _type: "mediaEmbed",
        _key: `vid-${i}`,
        url: m.url,
        mediaType: "video",
        caption: m.altText || `Video from ${author.handle}`,
      });
      videoCount++;
    }
  }

  return media;
}

// ── Use Case Document Creation ───────────────────────────────────────────

async function createUseCaseDocument(
  item: DiscoveredItem
): Promise<SanityDocument> {
  const { enrichment, author, sourceUrl, sourcePlatform, mediaUrls } = item;

  const slug = slugify(enrichment.title);
  const categoryId = CATEGORY_ID_MAP[enrichment.category] || CATEGORY_ID_MAP["productivity"];
  const urlHash = hashUrl(sourceUrl);

  // Process media (max 4 images + 2 video embeds)
  const media = await processMedia(mediaUrls, author, urlHash);

  // Build portable text block for long description
  const longDescription = [
    {
      _type: "block",
      _key: "enriched-desc",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "s1",
          marks: [],
          text: enrichment.longDescription,
        },
      ],
    },
  ];

  // Create document
  const doc: SanityDocument = {
    _id: `usecase-${slug}`,
    _type: "useCase",
    title: truncate(enrichment.title, 100),
    slug: { _type: "slug", current: slug },
    description: truncate(enrichment.description, 200),
    longDescription,
    category: { _type: "reference", _ref: categoryId },
    complexity: enrichment.complexity,
    type: enrichment.type,
    channels: enrichment.channels,
    integrations: [], // References would need to be pre-created
    personas: enrichment.personas,
    creator: {
      handle: author.handle,
      name: author.name || author.handle,
      avatar: author.avatarUrl,
    },
    sourceUrl,
    sourcePlatform,
    media,
    upvotes: 0,
    featured: false,
    aiConfidence: enrichment.confidence,
    discoverySource: `auto-${sourcePlatform}`,
  };

  return doc;
}

// ── Submission Document Creation ─────────────────────────────────────────

function createSubmissionDocument(item: DiscoveredItem): SanityDocument {
  const { enrichment, author, sourceUrl, sourcePlatform, rawText, engagement, mediaUrls, publishedAt, discoveredAt } = item;

  const urlHash = hashUrl(sourceUrl);
  const totalEngagement = calculateTotalEngagement(engagement);

  const doc: SanityDocument = {
    _id: `submission-${urlHash}`,
    _type: "submission",
    sourceUrl,
    sourcePlatform,
    rawExtractedData: {
      text: rawText.substring(0, 5000),
      author: author.handle,
      mediaUrls: mediaUrls.map((m) => m.url),
      date: publishedAt || discoveredAt,
      engagement: totalEngagement,
    },
    aiEnrichedData: {
      title: enrichment.title,
      description: enrichment.description,
      category: enrichment.category,
      complexity: enrichment.complexity,
      integrations: enrichment.integrations,
      personas: enrichment.personas,
      slug: slugify(enrichment.title),
      metaDescription: truncate(enrichment.description, 160),
      isRelevant: enrichment.isRelevant,
    },
    aiConfidence: enrichment.confidence,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };

  return doc;
}

// ── Main Processing Function ─────────────────────────────────────────────

async function processDiscoveryBatch(batch: DiscoveryBatch): Promise<ProcessingStats> {
  const stats: ProcessingStats = {
    autoPublished: 0,
    submittedForReview: 0,
    skipped: 0,
    errors: 0,
    duplicates: 0,
  };

  const documentsToCreate: SanityDocument[] = [];

  console.log(`\n📦 Processing batch: ${batch.platform} (${batch.items.length} items)`);
  console.log(`   Run ID: ${batch.runId}`);
  console.log(`   Discovered at: ${batch.discoveredAt}\n`);

  for (let i = 0; i < batch.items.length; i++) {
    const item = batch.items[i];
    const num = `[${i + 1}/${batch.items.length}]`;

    // Skip if not relevant
    if (!item.enrichment.isRelevant) {
      console.log(`${num} ⊘ Skipped: Not relevant (${item.sourceUrl})`);
      stats.skipped++;
      continue;
    }

    // Check for duplicates
    const isDuplicate = await isUrlAlreadyIngested(item.sourceUrl);
    if (isDuplicate) {
      console.log(`${num} ⊗ Duplicate: ${item.enrichment.title}`);
      stats.duplicates++;
      continue;
    }

    try {
      // Route based on confidence
      if (item.enrichment.confidence >= 0.8) {
        // Auto-publish as use case
        const doc = await createUseCaseDocument(item);
        documentsToCreate.push(doc);
        console.log(`${num} ✓ Use Case: ${item.enrichment.title} (confidence: ${item.enrichment.confidence.toFixed(2)})`);
        stats.autoPublished++;
      } else {
        // Submit for review
        const doc = createSubmissionDocument(item);
        documentsToCreate.push(doc);
        console.log(`${num} ⊕ Submission: ${item.enrichment.title} (confidence: ${item.enrichment.confidence.toFixed(2)})`);
        stats.submittedForReview++;
      }
    } catch (error) {
      console.error(`${num} ✗ Error processing ${item.sourceUrl}:`, error);
      stats.errors++;
    }
  }

  // Batch commit to Sanity
  if (documentsToCreate.length > 0) {
    console.log(`\n→ Committing ${documentsToCreate.length} documents to Sanity...`);

    const BATCH_SIZE = 10;
    for (let i = 0; i < documentsToCreate.length; i += BATCH_SIZE) {
      const batch = documentsToCreate.slice(i, i + BATCH_SIZE);
      const tx = client.transaction();

      for (const doc of batch) {
        tx.createOrReplace(doc);
      }

      try {
        const res = await tx.commit();
        console.log(
          `  ✓ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} documents (tx: ${res.transactionId})`
        );
      } catch (error) {
        console.error(`  ✗ Batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`, error);
        stats.errors += batch.length;
      }
    }
  }

  return stats;
}

// ── CLI Argument Parsing ─────────────────────────────────────────────────

function parseArgs(): string | null {
  const args = process.argv.slice(2);

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    // Support both --input /path and --input=/path
    if (arg === "--input" && i + 1 < args.length) {
      return args[i + 1];
    } else if (arg.startsWith("--input=")) {
      return arg.substring(8);
    }
  }

  return null;
}

// ── Main Entry Point ─────────────────────────────────────────────────────

async function main() {
  console.log("🚀 ClawDex Discovery Ingestion Script\n");

  // Parse CLI arguments
  const inputPath = parseArgs();
  if (!inputPath) {
    console.error("❌ Missing required argument: --input /path/to/discoveries.json");
    console.error("\nUsage:");
    console.error("  pnpm tsx --env-file=.env.local scripts/discover-ingest.ts --input /path/to/discoveries.json");
    console.error("  pnpm tsx --env-file=.env.local scripts/discover-ingest.ts --input=/path/to/discoveries.json");
    process.exit(1);
  }

  // Read and parse input file
  let batches: DiscoveryBatch[];
  try {
    const raw = await readFile(inputPath, "utf-8");
    batches = JSON.parse(raw);

    // Handle both single batch and array of batches
    if (!Array.isArray(batches)) {
      batches = [batches as unknown as DiscoveryBatch];
    }

    console.log(`📂 Loaded ${batches.length} batch(es) from ${inputPath}\n`);
  } catch (error) {
    console.error(`❌ Failed to read or parse input file: ${inputPath}`);
    console.error(error);
    process.exit(1);
  }

  // Process all batches
  const totalStats: ProcessingStats = {
    autoPublished: 0,
    submittedForReview: 0,
    skipped: 0,
    errors: 0,
    duplicates: 0,
  };

  for (const batch of batches) {
    const stats = await processDiscoveryBatch(batch);
    totalStats.autoPublished += stats.autoPublished;
    totalStats.submittedForReview += stats.submittedForReview;
    totalStats.skipped += stats.skipped;
    totalStats.errors += stats.errors;
    totalStats.duplicates += stats.duplicates;
  }

  // Summary output
  console.log("\n" + "=".repeat(60));
  console.log("📊 INGESTION SUMMARY");
  console.log("=".repeat(60));
  console.log(`✓ Auto-published use cases:    ${totalStats.autoPublished}`);
  console.log(`⊕ Submitted for review:        ${totalStats.submittedForReview}`);
  console.log(`⊗ Duplicates skipped:          ${totalStats.duplicates}`);
  console.log(`⊘ Not relevant (skipped):      ${totalStats.skipped}`);
  console.log(`✗ Errors:                      ${totalStats.errors}`);
  console.log("=".repeat(60));
  console.log(`📈 Total processed:             ${totalStats.autoPublished + totalStats.submittedForReview + totalStats.skipped + totalStats.errors + totalStats.duplicates}`);
  console.log("=".repeat(60) + "\n");

  if (totalStats.errors > 0) {
    console.error("⚠️  Some items failed to process. Check the logs above for details.");
    process.exit(1);
  }

  console.log("✅ Ingestion complete!\n");
}

// ── Execute ──────────────────────────────────────────────────────────────

main().catch((err) => {
  console.error("\n❌ Ingestion failed:", err);
  process.exit(1);
});
