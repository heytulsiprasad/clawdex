/**
 * Review Twitter submissions specifically
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

// === CLASSIFICATION RULES FOR TWITTER ===

// Strong signals of a BUILD SHOWCASE
const BUILD_PATTERNS = [
  /\b(i |we |i've |we've )?(built|made|created|shipped)\b/i, // "Built", "I built", "We built"
  /\bjust (shipped|launched|released|deployed)\b/i,
  /\bmy (setup|workflow|agent|skill|automation|bot|assistant)\b/i,
  /\bhere'?s (how|what|my)\b/i,
  /\bbuilt (a|an|my|this|the)\b/i, // "Built a", "Built my", "Built this"
  /\bcheck out (my|what i)\b/i,
  /\bfinally got.*working\b/i,
  /\bshow hn\b/i,
  /\bopen.?sourc(e|ed|ing)\b/i,
  /\b(mcp|skill|plugin|extension)\b.*\b(made|built|wrote|created)\b/i,
  /\bautomated?\b.*(my|the|our|this)\b/i,
  /\bproductivity (hack|boost|tip)\b/i,
  /\bgithub\.com\/[a-z0-9_-]+\/[a-z0-9_-]+\b/i, // Personal repo link
  /\bhere'?s a demo\b/i,
  /\bvideo of (my|the)\b/i,
  /\bscreen(shot|cast|recording)\b/i,
  /\bthread on how\b/i,
  /\b(voice|chat|discord|slack|telegram) (bot|agent|assistant)\b/i,
  /\bmission control\b/i, // Common agent setup term
  /\b\d+ (specialized |)agents\b/i, // "8 specialized agents"
  /\bai agent\b.*\b(deployed|running|live)\b/i,
  /\busing @?(openclaw|clawdbot|moltbot)\b.*\bto\b/i, // "using openclaw to..."
  /\b(wrote|created|developed) (a |an |the |my )?(skill|plugin|tool)\b/i,
  /\bcomplete guide\b/i,
  /\btemplate\b.*\b(for|to)\b/i,
  /\bmeet (my|our)\b/i, // "Meet my agent"
  /\bintroduc(e|ing)\b.*\b(my|our|the)\b/i, // "Introducing my..."
  /\beasiest way to (set up|setup|run|deploy)\b/i, // Tutorials
  /\bset (up|one up)\b.*\b(on|with)\b/i, // "set one up on a Raspberry Pi"
  /\bhow to (set up|setup|run|deploy|use)\b/i, // How-to guides
  /\bstep.?by.?step\b/i,
  /\btutorial\b/i,
  /\bguide (on|to|for)\b/i,
];

// Strong REJECT signals - NOT builds, just noise
const REJECT_PATTERNS = [
  /\bgrok\b/i, // Grok AI bot responses
  /\bairdrop\b/i,
  /\bgiveaway\b/i,
  /\bpresale\b/i,
  /\bwhitelist\b/i,
  /\btoken (launch|sale)\b/i,
  /\bnft (drop|mint|sale|collection)\b/i,
  /\bsolana (token|memecoin|pump)\b/i,
  /\bdefi (protocol|yield|farming)\b/i,
  /\btrading (bot|signal|alpha)\b/i,
  /\bcrypto (news|alpha|call)\b/i,
  /\bweb3 (news|update)\b/i,
  /\bfollow (for|us|me).*(more|alpha|updates)\b/i,
  /\bretweet (to|for)\b/i,
  /\bjoin (our|the) (discord|telegram|community)\b/i,
  /\blink in bio\b/i,
  /\blearn more at\b/i,
  /\b(anthropic|openai) (announces|releases|launches)\b/i,
  /\b(sam altman|dario amodei|elon musk)\b/i, // AI leader news
  /\bbreaking\s*:/i,
  /\bnews\s*:/i,
  /\bsponsor(ed)?\b/i,
  /\bad\s*:/i,
  /\bpromoted\b/i,
  /\bwe'?re hiring\b/i,
  /\bcoming soon\b/i,
  /\bwaitlist\b/i,
  /\bearly access\b/i,
  /\bthread 🧵\b/i, // Thread intros usually not builds
  /\bopinions?\s*:\s*$/i,
  /\bthoughts\s*\?\s*$/i,
];

interface DiscoveryItem {
  sourceUrl: string;
  sourcePlatform: string;
  rawText: string;
  author?: { handle: string; name?: string };
  engagement?: { likes?: number; views?: number };
}

interface DiscoveryBatch {
  platform: string;
  items: DiscoveryItem[];
}

function classifyTweet(item: DiscoveryItem): { keep: boolean; reason: string; confidence: number } {
  const text = item.rawText || "";
  
  if (!text.trim()) {
    return { keep: false, reason: "Empty content", confidence: 1.0 };
  }
  
  // Check reject patterns first
  for (const pattern of REJECT_PATTERNS) {
    if (pattern.test(text)) {
      return { keep: false, reason: `Spam/noise: ${pattern.source.slice(0, 25)}`, confidence: 0.9 };
    }
  }
  
  // Check build patterns
  for (const pattern of BUILD_PATTERNS) {
    if (pattern.test(text)) {
      return { keep: true, reason: `Build showcase: ${pattern.source.slice(0, 25)}`, confidence: 0.85 };
    }
  }
  
  // Check if it's just a mention without substance
  const hasOpenclawMention = /\b(openclaw|claude.?code|moltbot|clawdbot)\b/i.test(text);
  const isShort = text.length < 100;
  
  if (hasOpenclawMention && isShort) {
    return { keep: false, reason: "Short mention, no build details", confidence: 0.7 };
  }
  
  // Default: reject unless there's clear value
  return { keep: false, reason: "No clear build showcase", confidence: 0.6 };
}

async function main() {
  const limit = parseInt(process.argv[2] || "50", 10);
  const execute = process.argv.includes("--execute");
  const discoveryFile = "/Users/heytulsiprasad/.openclaw/workspace/clawdex/discoveries-2026-02-06-072251.json";
  
  console.log("Loading discovery data...");
  const discoveryData: DiscoveryBatch[] = JSON.parse(await readFile(discoveryFile, "utf-8"));
  
  // Build map of sourceUrl -> item
  const itemMap = new Map<string, DiscoveryItem>();
  for (const batch of discoveryData) {
    for (const item of batch.items) {
      itemMap.set(item.sourceUrl, item);
    }
  }
  
  // Fetch Twitter submissions
  console.log(`Fetching ${limit} Twitter submissions...\n`);
  const submissions = await client.fetch(
    `*[_type == "submission" && status == "pending" && sourcePlatform == "twitter"] | order(_createdAt desc) [0...$limit] {
      _id,
      sourceUrl
    }`,
    { limit }
  );
  
  const toDelete: { id: string; url: string; text: string; reason: string }[] = [];
  const toKeep: { id: string; url: string; text: string; reason: string }[] = [];
  
  for (const sub of submissions) {
    const item = itemMap.get(sub.sourceUrl);
    
    if (!item) {
      toDelete.push({ id: sub._id, url: sub.sourceUrl, text: "[no data]", reason: "No discovery data" });
      continue;
    }
    
    const result = classifyTweet(item);
    const shortText = item.rawText?.slice(0, 100) || "";
    
    if (result.keep) {
      toKeep.push({ id: sub._id, url: sub.sourceUrl, text: shortText, reason: result.reason });
    } else {
      toDelete.push({ id: sub._id, url: sub.sourceUrl, text: shortText, reason: result.reason });
    }
  }
  
  // Print detailed results
  console.log("=== KEEPING (Build Showcases) ===\n");
  for (const item of toKeep) {
    console.log(`✅ @${item.url.split("/")[3]}`);
    console.log(`   "${item.text}..."`);
    console.log(`   Reason: ${item.reason}\n`);
  }
  
  console.log("\n=== DELETING (Not Builds) ===\n");
  for (const item of toDelete.slice(0, 30)) {
    console.log(`❌ @${item.url.split("/")[3]}`);
    console.log(`   "${item.text}..."`);
    console.log(`   Reason: ${item.reason}\n`);
  }
  if (toDelete.length > 30) {
    console.log(`   ... and ${toDelete.length - 30} more\n`);
  }
  
  console.log("\n=== SUMMARY ===");
  console.log(`Keep: ${toKeep.length} (${Math.round(toKeep.length / submissions.length * 100)}%)`);
  console.log(`Delete: ${toDelete.length} (${Math.round(toDelete.length / submissions.length * 100)}%)`);
  
  if (execute && toDelete.length > 0) {
    console.log("\nDeleting...");
    for (const item of toDelete) {
      await client.delete(item.id);
    }
    console.log("Done!");
  } else if (toDelete.length > 0) {
    console.log("\nRun with --execute to delete");
  }
}

main().catch(console.error);
