/**
 * ClawDex Submission Reviewer
 * Reviews pending submissions against original discovery data
 * Deletes items that aren't genuine OpenClaw/Claude Code build showcases
 */

import { createClient } from "next-sanity";
import { readFile, writeFile } from "fs/promises";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-02-03",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// === CLASSIFICATION RULES ===

// Strong signals that someone is SHOWCASING their build
const BUILD_SHOWCASE_PATTERNS = [
  /\bi built\b/i,
  /\bi made\b/i,
  /\bi created\b/i,
  /\bjust shipped\b/i,
  /\bmy (setup|workflow|agent|skill|automation)\b/i,
  /\bhere'?s (how|what) i\b/i,
  /\busing (openclaw|claude code|moltbot|clawdbot)\b.*(to|for)/i,
  /\bshow hn\b/i,
  /\bopen source\b/i,
  /\bgithub\.com\/[a-z0-9-]+\/[a-z0-9-]+\b/i, // Personal repo links
  /\bbuilt with (openclaw|claude code)\b/i,
  /\bpowered by (openclaw|claude code)\b/i,
  /\bmy mcp server\b/i,
  /\bcron job.*(runs|sends|does)\b/i,
  /\bmulti-agent.*(setup|workflow|system)\b/i,
  /\bvoice (assistant|agent) i\b/i,
  /\bautomated?.*(my|the)\b/i,
  /\bshipping\b/i,
  /\blaunched (my|a new)\b/i,
  /\bcheck out (my|what i)\b/i,
  /\bhere'?s my\b/i,
  /\bfinally got.*working\b/i,
  /\bproductivity hack\b/i,
  /\bterminal.*(setup|workflow)\b/i,
  /\bcli.*(built|made|created)\b/i,
];

// Strong signals that this is NOT a build showcase (news, promo, general AI discussion)
const REJECT_PATTERNS = [
  /\bbreaking\s*:/i,
  /\bnews\s*:/i,
  /\bannouncement\b/i,
  /\bwe'?re hiring\b/i,
  /\bgiveaway\b/i,
  /\bairdrop\b/i,
  /\btoken (launch|sale)\b/i,
  /\bpresale\b/i,
  /\bwhitelist\b/i,
  /\bnft (drop|mint|sale)\b/i,
  /\bmint now\b/i,
  /\bjoin our\b/i,
  /\bsign up\b/i,
  /\bfollow (us|me) for\b/i,
  /\bretweet to\b/i,
  /\bgrok\b/i, // Grok AI bot
  /\btrading bot\b/i,
  /\bcrypto trading\b/i,
  /\bdefi (protocol|yield|farming)\b/i,
  /\bsolana (token|memecoin)\b/i,
  /\bethereum (gas|token)\b/i,
  /\bblockchain news\b/i,
  /\bweb3 (news|update)\b/i,
  /\bnft collection\b/i,
  /\bfree trial\b/i,
  /\bsponsor\b/i,
  /\bad\s*:/i,
  /\bpromoted\b/i,
  /\b(anthropic|openai) (announces|releases|launches)\b/i, // Company news
  /\bcoming soon\b/i,
  /\bwaitlist\b/i,
  /\bearly access\b/i,
  /\b(sam altman|dario amodei) (says|said|thinks)\b/i, // AI leader quotes
  /\bai (news|update|roundup)\b/i,
  /\bthread 🧵\b/i,
  /\blearn more at\b/i,
  /\blink in bio\b/i,
];

// Neutral mentions (just talking about the tool, not showing a build)
const NEUTRAL_MENTION_PATTERNS = [
  /\b(openclaw|claude code|moltbot) is (amazing|great|good|cool)\b/i,
  /\blove (openclaw|claude code)\b/i,
  /\b(openclaw|claude code) (looks|seems)\b/i,
  /\bwhat do you think of (openclaw|claude code)\b/i,
  /\banyone (tried|using) (openclaw|claude code)\b/i,
  /\bshould i try (openclaw|claude code)\b/i,
  /\b(openclaw|claude code) vs\b/i, // Comparisons without builds
  /\bopinion on (openclaw|claude code)\b/i,
];

interface DiscoveryItem {
  sourceUrl: string;
  sourcePlatform: string;
  rawText: string;
  title?: string;
  enrichment?: {
    isRelevant: boolean;
    confidence: number;
    title: string;
    description: string;
  };
}

interface DiscoveryBatch {
  version: number;
  platform: string;
  items: DiscoveryItem[];
}

function classifyItem(item: DiscoveryItem): { keep: boolean; reason: string } {
  const text = item.rawText || "";
  const url = item.sourceUrl || "";
  
  // If empty content, reject
  if (!text.trim()) {
    return { keep: false, reason: "Empty content" };
  }
  
  // Check reject patterns first (strong negative signal)
  for (const pattern of REJECT_PATTERNS) {
    if (pattern.test(text)) {
      return { keep: false, reason: `Reject pattern: ${pattern.source.slice(0, 30)}` };
    }
  }
  
  // Check for neutral mentions (not a build, just talking about it)
  for (const pattern of NEUTRAL_MENTION_PATTERNS) {
    if (pattern.test(text) && !BUILD_SHOWCASE_PATTERNS.some(p => p.test(text))) {
      return { keep: false, reason: `Neutral mention, no build: ${pattern.source.slice(0, 30)}` };
    }
  }
  
  // Check for build showcase patterns (strong positive signal)
  for (const pattern of BUILD_SHOWCASE_PATTERNS) {
    if (pattern.test(text)) {
      return { keep: true, reason: `Build showcase: ${pattern.source.slice(0, 30)}` };
    }
  }
  
  // GitHub repos are usually builds
  if (item.sourcePlatform === "github") {
    return { keep: true, reason: "GitHub repo (likely a build)" };
  }
  
  // Dev.to articles are usually builds
  if (item.sourcePlatform === "devto") {
    return { keep: true, reason: "Dev.to article (likely a tutorial/build)" };
  }
  
  // Default: reject if no clear build signal
  return { keep: false, reason: "No clear build showcase signal" };
}

async function main() {
  const batchSize = parseInt(process.argv[2] || "100", 10);
  const execute = process.argv.includes("--execute");
  const discoveryFile = "/Users/heytulsiprasad/.openclaw/workspace/clawdex/discoveries-2026-02-06-072251.json";
  
  console.log("Loading discovery data...");
  const discoveryData: DiscoveryBatch[] = JSON.parse(await readFile(discoveryFile, "utf-8"));
  
  // Build a map of sourceUrl -> item for quick lookup
  const itemMap = new Map<string, DiscoveryItem>();
  for (const batch of discoveryData) {
    for (const item of batch.items) {
      itemMap.set(item.sourceUrl, item);
    }
  }
  console.log(`Loaded ${itemMap.size} items from discovery file\n`);
  
  // Fetch pending submissions
  console.log("Fetching pending submissions from Sanity...");
  const submissions = await client.fetch(
    `*[_type == "submission" && status == "pending"] | order(_createdAt desc) [0...$limit] {
      _id,
      sourceUrl,
      sourcePlatform
    }`,
    { limit: batchSize }
  );
  console.log(`Found ${submissions.length} pending submissions\n`);
  
  const toDelete: { id: string; url: string; reason: string }[] = [];
  const toKeep: { id: string; url: string; reason: string }[] = [];
  
  for (const sub of submissions) {
    const item = itemMap.get(sub.sourceUrl);
    
    if (!item) {
      // No discovery data - check if it's a platform we trust
      if (sub.sourcePlatform === "github" || sub.sourcePlatform === "devto") {
        toKeep.push({ id: sub._id, url: sub.sourceUrl, reason: "Trusted platform (no discovery data)" });
      } else {
        toDelete.push({ id: sub._id, url: sub.sourceUrl, reason: "No discovery data found" });
      }
      continue;
    }
    
    const result = classifyItem(item);
    
    if (result.keep) {
      toKeep.push({ id: sub._id, url: sub.sourceUrl, reason: result.reason });
    } else {
      toDelete.push({ id: sub._id, url: sub.sourceUrl, reason: result.reason });
    }
  }
  
  // Print results
  console.log("=== KEEP ===");
  for (const item of toKeep.slice(0, 20)) {
    console.log(`✅ ${item.url}`);
    console.log(`   ${item.reason}\n`);
  }
  if (toKeep.length > 20) {
    console.log(`   ... and ${toKeep.length - 20} more\n`);
  }
  
  console.log("=== DELETE ===");
  for (const item of toDelete.slice(0, 20)) {
    console.log(`❌ ${item.url}`);
    console.log(`   ${item.reason}\n`);
  }
  if (toDelete.length > 20) {
    console.log(`   ... and ${toDelete.length - 20} more\n`);
  }
  
  console.log("=== SUMMARY ===");
  console.log(`Keep: ${toKeep.length}`);
  console.log(`Delete: ${toDelete.length}`);
  
  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    batchSize,
    keep: toKeep,
    delete: toDelete,
  };
  await writeFile(
    `/Users/heytulsiprasad/.openclaw/workspace/clawdex/review-report-${Date.now()}.json`,
    JSON.stringify(report, null, 2)
  );
  
  if (execute && toDelete.length > 0) {
    console.log("\nDeleting rejected submissions...");
    let deleted = 0;
    for (const item of toDelete) {
      try {
        await client.delete(item.id);
        deleted++;
        if (deleted % 50 === 0) {
          console.log(`  Deleted ${deleted}/${toDelete.length}...`);
        }
      } catch (e) {
        console.error(`  Failed to delete ${item.id}: ${e}`);
      }
    }
    console.log(`Done! Deleted ${deleted} submissions.`);
  } else if (toDelete.length > 0) {
    console.log("\nRun with --execute to actually delete");
  }
}

main().catch(console.error);
