/**
 * Seed script — fetches all 85 OpenClaw showcase tweets via Bird CLI,
 * downloads images, uploads to Sanity, and creates use case documents.
 *
 * Usage:  pnpm tsx --env-file=.env.local scripts/seed-showcase.ts
 */

import { createClient } from "next-sanity";
import { execSync } from "child_process";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN");
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

interface TweetMedia {
  type: "photo" | "video";
  url: string;
  width: number;
  height: number;
  previewUrl?: string;
  videoUrl?: string;
  durationMs?: number;
}

interface TweetData {
  id: string;
  text: string;
  createdAt: string;
  replyCount: number;
  retweetCount: number;
  likeCount: number;
  author: { username: string; name: string };
  authorId: string;
  media?: TweetMedia[];
}

interface ShowcaseEntry {
  tweetId: string;
  cat: string;
  title: string;
  desc: string;
}

// ── Category mapping (showcase label → Sanity category ID) ───────────────

const CATEGORY_MAP: Record<string, string> = {
  automation: "category-automation-workflows",
  productivity: "category-productivity",
  developer: "category-development-devops",
  "smart-home": "category-smart-home-iot",
  integration: "category-productivity",
  personal: "category-family-personal",
  family: "category-family-personal",
  creative: "category-creative-media",
  "power-user": "category-multi-agent-setups",
  setup: "category-hardware-edge",
  hardware: "category-hardware-edge",
  general: "category-productivity",
};

// ── Type & complexity inference from showcase category ────────────────────

function inferType(cat: string): string {
  switch (cat) {
    case "smart-home":
    case "hardware":
    case "setup":
      return "hardware";
    case "power-user":
      return "multi-agent";
    default:
      return "workflow";
  }
}

function inferComplexity(cat: string, tweetText: string): string {
  if (cat === "power-user" || cat === "setup") return "advanced";
  if (cat === "hardware" || cat === "smart-home") return "intermediate";
  const mentionCount = (tweetText.match(/@\w+/g) || []).length;
  if (mentionCount >= 5) return "advanced";
  if (mentionCount >= 2) return "intermediate";
  return "beginner";
}

// ── Helpers ───────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 96);
}

function cleanTweetText(text: string): string {
  return text
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\n+/g, " ")
    .trim();
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.substring(0, max - 3).replace(/\s+\S*$/, "") + "...";
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Bird CLI wrapper ─────────────────────────────────────────────────────

function fetchTweet(tweetId: string): TweetData | null {
  try {
    const raw = execSync(
      `bird read ${tweetId} --json 2>/dev/null`,
      { timeout: 15000, encoding: "utf-8" }
    );
    return JSON.parse(raw) as TweetData;
  } catch {
    return null;
  }
}

// ── Image upload ─────────────────────────────────────────────────────────

async function uploadImage(
  imageUrl: string,
  filename: string
): Promise<string | null> {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    const asset = await client.assets.upload("image", buffer, {
      filename,
      contentType: res.headers.get("content-type") || "image/jpeg",
    });
    return asset._id;
  } catch {
    return null;
  }
}

// ── All 85 showcase entries ──────────────────────────────────────────────
// Source: https://openclaw.ai/showcase
// Each entry: { tweetId, cat (showcase category), title (curated), desc (showcase description) }

const ENTRIES: ShowcaseEntry[] = [
  { tweetId: "2012535486401671588", cat: "automation", title: "Full Personal Assistant Suite", desc: "Mail management, message handling, automated ordering, reminders, GitHub integration, Google Places sync, X bookmark discussions, PDF summaries, expense tracking, group chat automation, phone calls, 1Password integration" },
  { tweetId: "2012565160586625345", cat: "productivity", title: "Calendar Timeblocking & Morning Briefings", desc: "Calendar timeblocking, task scoring algorithm, weekly reviews from transcriptions, morning briefings with weather/health/meetings, school test notifications, project research and breakdown" },
  { tweetId: "2009487467817336895", cat: "developer", title: "Custom Agent SDK Development", desc: "Commentary on custom agent development and SDK considerations for extensibility across model providers" },
  { tweetId: "2012173452061360130", cat: "smart-home", title: "Smart Home Dashboard Setup", desc: "Smart home setup with visual dashboard" },
  { tweetId: "2009684853827281070", cat: "developer", title: "Natural Language Diagram Generation", desc: "Programmatic diagram generation from natural language requests using Excalidraw JSON format" },
  { tweetId: "2008388427180630155", cat: "developer", title: "Large-Scale X Data Aggregation", desc: "Large-scale data aggregation project pulling 4 million posts from 100 top X accounts within 24 hours" },
  { tweetId: "2008531076487246176", cat: "integration", title: "Community-Driven Platform Integrations", desc: "Community-driven development with Discord server growth, Beeper messaging support, Homey smart home integration, Fastmail support" },
  { tweetId: "2012507246874255661", cat: "developer", title: "Telegram Group Feature Implementation", desc: "Full configuration enabling feature implementation via agents accessed through Telegram group interface" },
  { tweetId: "2009070459065913806", cat: "productivity", title: "24-Hour Productivity Sprint", desc: "Cleaned up Linear issues, wrote email follow-ups, opened 3 PRs, prospected new signups within first 24 hours; automated message sending for daily prospects" },
  { tweetId: "2008994096736817624", cat: "developer", title: "Full Website Migration via Telegram", desc: "Full website migration (Notion to Astro with 18 posts) and DNS transition via Telegram while remote" },
  { tweetId: "2011965312824942772", cat: "integration", title: "Autonomous Voice Model Discovery", desc: "Voice model discovery, installation, and voice conversation capability added autonomously" },
  { tweetId: "2012313149576302746", cat: "personal", title: "Progressive Adoption Journey", desc: "Progressive adoption: family setup Week 1, non-technical friends Week 2, work implementation Week 3" },
  { tweetId: "2012028725710192741", cat: "developer", title: "GA4 Analytics Skill for ClawHub", desc: "GA4 analytics skill built in 20 minutes, packaged and published to ClawHub for community use" },
  { tweetId: "2010288787885064227", cat: "smart-home", title: "Raspberry Pi with Health Metrics", desc: "Raspberry Pi setup with Cloudflare, website building capability, WHOOP health metrics integration" },
  { tweetId: "2012081542567280964", cat: "automation", title: "Morning Gmail & Calendar Rollup", desc: "Morning rollup skill for Gmail and Calendar with customizable event/email count and frequency settings" },
  { tweetId: "2012119327147798753", cat: "developer", title: "Voice-Driven Server Deployment Review", desc: "Server-based deployment review, automated log analysis, root cause identification, config updates, PR submission, and testing—all via voice while walking" },
  { tweetId: "2007616854689280196", cat: "family", title: "Comprehensive Family Meal Planning", desc: "Comprehensive meal planning system with master templates, store-sorted shopping lists, weather-integrated suggestions, recipe cataloging, morning/evening reminders" },
  { tweetId: "2012778049406742632", cat: "power-user", title: "Multi-Agent Power User Workflow", desc: "Multi-agent coordination managing 10,000+ emails, slide reviews, CLI tools, PR refactoring, documentation updates, advertising optimization, skills development" },
  { tweetId: "2008336434827002232", cat: "developer", title: "Autonomous JIRA Skill Creation", desc: "Autonomous JIRA skill creation and integration without existing ClawHub module" },
  { tweetId: "2008970037013381165", cat: "family", title: "Home Project Management System", desc: "Home project management system with couple-initiated research and Sunday roundup delivery" },
  { tweetId: "2008203784317714847", cat: "integration", title: "Unified Telegram Command Center", desc: "Unified Telegram interface for email, Home Assistant, homelab SSH, todo list, Apple Notes, shopping list management" },
  { tweetId: "2008577043978768433", cat: "integration", title: "Discord Server Integration", desc: "Discord server integration connecting custom projects with autonomous execution" },
  { tweetId: "2009424267801485362", cat: "developer", title: "macOS Menu Bar Gateway Manager", desc: "Swift macOS menu bar application managing gateway status, Discord connections, service control, log viewing, and status notifications" },
  { tweetId: "2012820689179312278", cat: "developer", title: "Iterative Prototyping Workflow", desc: "Iterative prototyping workflow: TUI creation, file summarization, architecture optimization, implementation, and refinement cycling" },
  { tweetId: "2011260468975771862", cat: "developer", title: "Four-Agent Solo Founder System", desc: "Four-agent solo founder system with distinct roles (strategy, development, marketing, business), shared memory architecture, model-specific assignments" },
  { tweetId: "2012397507754770587", cat: "productivity", title: "Idea-to-Decision Pipeline", desc: "Idea-to-decision pipeline with skill logging, overnight experiments via cron jobs, decision record documentation with ADR-style formatting" },
  { tweetId: "2013024865393975718", cat: "integration", title: "Multi-Platform Health & Productivity Hub", desc: "Health tracking from Garmin, Obsidian vault updates, GitHub deployment, VPS access, multi-platform messaging, earthquake monitoring, schedule management" },
  { tweetId: "2011922739846898098", cat: "developer", title: "Autonomous Platform Launch via WhatsApp", desc: "Autonomous platform launch (@learnfromlenny) built and operated via WhatsApp bot messaging" },
  { tweetId: "2009577664018018425", cat: "developer", title: "WhatsApp UI Generation & Screenshots", desc: "UI creation and screenshot generation via WhatsApp with integrated skills and custom extension capabilities" },
  { tweetId: "2008767951340794245", cat: "automation", title: "Flight Check-In Automation", desc: "Flight check-in automation with seat selection, operated while driving" },
  { tweetId: "2011204271786672526", cat: "developer", title: "Tailscale-Secured Remote Dev Environment", desc: "Tailscale-secured remote development environment with status page interface and custom domain routing" },
  { tweetId: "2012646568219029586", cat: "developer", title: "Content Reformatting with Speed Reading", desc: "Content reformatting with HTML/CSS customization, adjustable sizing, and speed-reading mode" },
  { tweetId: "2012212865206272266", cat: "developer", title: "Ralph Project Plugin for Claude Code", desc: "Ralph project plugin with prompt compilation, status block validation, and Codex/Claude Code integration" },
  { tweetId: "2011586646458708138", cat: "productivity", title: "Calendar & Obsidian Productivity Suite", desc: "Calendar management, Obsidian integration, browser capability, reminders, itinerary planning, GitHub repository contributions" },
  { tweetId: "2012265108697923809", cat: "productivity", title: "Multi-Device Dynamic Daily Agenda", desc: "Multi-device coordination (NAS, PC, Mac Studio) with dynamic daily agenda auto-refreshing based on project activities" },
  { tweetId: "2009688047747764575", cat: "automation", title: "Email Summary to Team CRM via WhatsApp", desc: "Email summarization with todo creation synced to team CRM via WhatsApp daily cron delivery" },
  { tweetId: "2012027310074171550", cat: "personal", title: "Multi-Platform Personal Replacement", desc: "Multi-platform usage replacing numerous applications with significant personal reliance" },
  { tweetId: "2010148656687767803", cat: "productivity", title: "Notion Research & Calendar via WhatsApp", desc: "Notion document research and building, calendar synchronization with autonomous diary management via WhatsApp" },
  { tweetId: "2007656142105661693", cat: "smart-home", title: "Alexa Smart Home Voice Control CLI", desc: "Alexa device control CLI supporting natural language commands for Echo-enabled smart home equipment" },
  { tweetId: "2008309808164896878", cat: "developer", title: "Custom Dashboard Creation", desc: "Custom dashboard creation" },
  { tweetId: "2011077782688985233", cat: "developer", title: "Ralph-TUI Remote Terminal Multiplexing", desc: "Ralph-TUI integration with remote terminal multiplexing via Tailscale and Telegram status updates" },
  { tweetId: "2013066316467560521", cat: "automation", title: "Insurance Claim Filing Automation", desc: "Insurance claim filing and repair appointment scheduling" },
  { tweetId: "2010655467400208746", cat: "smart-home", title: "IoT Watt Meter Recalibration", desc: "IoT watt meter recalibration with guided setup and remote access troubleshooting" },
  { tweetId: "2002334394993025243", cat: "developer", title: "Language Learning Platform in 2 Days", desc: "Language learning platform with text-to-speech, speech-to-text, pronunciation feedback, progress tracking, spaced repetition built in 2 days" },
  { tweetId: "2013003345686868171", cat: "developer", title: "iOS App Submission via Telegram", desc: "iOS app submission with TestFlight automation handling via Telegram from remote location" },
  { tweetId: "2008897333874893078", cat: "developer", title: "Himalaya Email CLI Skill", desc: "Himalaya email CLI skill contribution to open-source ecosystem" },
  { tweetId: "2011807680180957383", cat: "automation", title: "Automated Weekly SEO Reports", desc: "Fully automated weekly SEO analysis reports" },
  { tweetId: "2012052022464577954", cat: "developer", title: "Custom Personal Agent Implementation", desc: "Custom personal agent implementation" },
  { tweetId: "2012058702115709160", cat: "developer", title: "Autonomous Video Generation Learning", desc: "Autonomous video generation capability learning including watermark removal and character creation without reference images" },
  { tweetId: "2010745968044732692", cat: "automation", title: "Email Summary with macOS Menu Bar App", desc: "Email summarization with todo creation, Slack delivery, Supabase storage, and macOS menu bar app interface" },
  { tweetId: "2010508094313263502", cat: "developer", title: "Personalized Article Curation Platform", desc: "Personalized article curation platform built remotely while caregiving" },
  { tweetId: "2010729667540787707", cat: "developer", title: "Claude Code Ralph Loop via Telegram", desc: "Claude Code Ralph loop feature building with autonomous progress monitoring and sleep reminders via Telegram" },
  { tweetId: "2010318448207995241", cat: "integration", title: "Slack-Based Writing System", desc: "Slack-based writing system execution via custom trigger integration" },
  { tweetId: "2011373120033095875", cat: "integration", title: "Telegram Multi-Topic Group Integration", desc: "Telegram group integration with multi-topic support" },
  { tweetId: "2011656156318744971", cat: "family", title: "Dynamic MadLibs Game Generator", desc: "Dynamic MadLibs game generator with images and history, plus TailScale configuration resolution" },
  { tweetId: "2011629550875394517", cat: "developer", title: "341 Sessions: Proposals, Research & PRs", desc: "341 sessions in 7 days producing client proposals, market research, calendar/Drive integration, and injection vulnerability scanning" },
  { tweetId: "2012458753786859872", cat: "developer", title: "Real Estate Property Search CLI", desc: "Real estate property search CLI with agent skill integration for property valuation queries" },
  { tweetId: "2012207314884075773", cat: "developer", title: "Autonomous Overnight Agent Management", desc: "Autonomous overnight agent management with project history awareness and improved decision-making" },
  { tweetId: "2012728470980420090", cat: "developer", title: "General Platform Capabilities Praise", desc: "General positive assessment of platform capabilities" },
  { tweetId: "2013089675552968761", cat: "productivity", title: "Chat-Based Calendar Management", desc: "Natural chat-based calendar management across work, personal, and family calendars with spouse sharing" },
  { tweetId: "2013089630317355014", cat: "developer", title: "Multi-Agent Mobile Orchestration", desc: "Orchestration layer enabling multi-agent coordination with cross-device mobile accessibility for remote development work" },
  { tweetId: "2013099774937911694", cat: "productivity", title: "Unified Discord Productivity Interface", desc: "Unified Discord interface for notes, emails, projects, questions, plans, and specifications eliminating tool fragmentation" },
  { tweetId: "2013158851194085388", cat: "personal", title: "Exercise Heat Map from Garmin Data", desc: "Exercise heat map generation from Garmin data with zoom navigation and location indexing across worldwide activity records" },
  { tweetId: "2013811099028557966", cat: "automation", title: "Autonomous Vehicle Dealer Negotiation", desc: "Autonomous vehicle negotiation management across multiple dealer channels using browser, email, and messaging" },
  { tweetId: "2013645067441844697", cat: "automation", title: "Autonomous Grocery Ordering", desc: "Autonomous grocery ordering with 1Password credential integration and MFA text interception via messaging bridge" },
  { tweetId: "2013650626962424047", cat: "productivity", title: "Expense Tracking & Scrum Facilitation", desc: "Expense tracking, lunch booking, scrum facilitation, financial redaction, and PR review coordination with Codex agents" },
  { tweetId: "2013549390615715905", cat: "developer", title: "Cross-System Writing Pipeline", desc: "Writing pipeline integration enabling cross-system execution workflows" },
  { tweetId: "2013499715892006998", cat: "automation", title: "Hacker News Trend Analysis & Delivery", desc: "Hacker News trend analysis with personalized article recommendation delivery" },
  { tweetId: "2013388700479058068", cat: "automation", title: "Blood Test Results to Notion Database", desc: "Blood test result organization into structured Notion database format" },
  { tweetId: "2013257743004545257", cat: "productivity", title: "AI YouTube Takeaway Summaries", desc: "YouTube video consumption habit replacement with daily AI-generated key takeaway and actionable insight summaries" },
  { tweetId: "2013196232181637500", cat: "integration", title: "External Memory with Partner Sharing", desc: "External memory layer with partner-shared context capabilities via shared-memory skill" },
  { tweetId: "2014337533178425499", cat: "general", title: "General Platform Appreciation", desc: "General appreciation for capability breadth" },
  { tweetId: "2014339212271600067", cat: "creative", title: "Music Track Audio & Chord Extraction", desc: "Music track audio extraction, GIF generation, chord PDF compilation from song references" },
  { tweetId: "2014481698369536402", cat: "integration", title: "Multi-Agent Collaborative Workflows", desc: "Multi-agent collaborative workflows within shared messaging groups" },
  { tweetId: "2014608153393168425", cat: "creative", title: "Media Creation Studio via Mobile", desc: "Media creation studio with voice synthesis, audio transcription, web automation, and multi-model fallback configured in <5 days via mobile" },
  { tweetId: "2014590075972247640", cat: "automation", title: "Reddit to Telegram Content Delivery", desc: "Reddit post fetching and content delivery via Telegram interface" },
  { tweetId: "2014797672419340435", cat: "developer", title: "Structured App Testing Pipeline", desc: "Structured app testing workflow: screenshot documentation, issue compilation, automated report generation, parallel Codex agent deployment, PR review" },
  { tweetId: "2013140793649734032", cat: "hardware", title: "Holographic Display Tamagotchi", desc: "Physical display integration using $35 holographic cube hardware" },
  { tweetId: "2014147784098681217", cat: "automation", title: "Vehicle Negotiation: $4,200 Saved", desc: "Autonomous vehicle price negotiation resulting in $4,200 savings" },
  { tweetId: "2014568799824212004", cat: "setup", title: "Dedicated Mac Mini Hardware Setup", desc: "Dedicated Mac mini with segregated accounts for messaging, email, and code repository management" },
  { tweetId: "2014880905979167005", cat: "automation", title: "Email Receipt to Parts List Converter", desc: "Email receipt-to-parts-list conversion workflow" },
  { tweetId: "2014765279650189578", cat: "hardware", title: "Pebble Ring Voice Command Integration", desc: "Pebble ring integration enabling voice command activation" },
  { tweetId: "2014763987683225685", cat: "smart-home", title: "Autonomous HomePod Discovery & Control", desc: "Autonomous HomePod discovery and control skill development" },
  { tweetId: "2013908013619319293", cat: "developer", title: "Mid-Workout Debugging via Messaging", desc: "Mid-workout debugging and code patching via messaging interface" },
  { tweetId: "2013902632276914265", cat: "integration", title: "Skill Installation Demo via WhatsApp", desc: "Skill installation demonstration video creation via WhatsApp with self-referential documentation" },
];

// ── Main seed function ───────────────────────────────────────────────────

async function seed() {
  console.log(`Seeding ${ENTRIES.length} use cases from OpenClaw showcase...\n`);

  const results: Array<{
    _id: string;
    _type: string;
    [key: string]: unknown;
  }> = [];
  let imageCount = 0;
  let failCount = 0;

  for (let i = 0; i < ENTRIES.length; i++) {
    const entry = ENTRIES[i];
    const num = `[${i + 1}/${ENTRIES.length}]`;

    // Fetch tweet via Bird
    const tweet = fetchTweet(entry.tweetId);
    if (!tweet) {
      console.log(`${num} ✗ Failed to fetch tweet ${entry.tweetId} — skipping`);
      failCount++;
      continue;
    }

    console.log(`${num} @${tweet.author.username}: ${entry.title}`);

    // Build media array — upload photos, embed videos
    const media: Array<Record<string, unknown>> = [];

    if (tweet.media && tweet.media.length > 0) {
      for (let j = 0; j < tweet.media.length; j++) {
        const m = tweet.media[j];
        if (m.type === "photo") {
          const assetId = await uploadImage(
            m.url,
            `${tweet.author.username}-${entry.tweetId}-${j}.jpg`
          );
          if (assetId) {
            media.push({
              _type: "image",
              _key: `img-${j}`,
              asset: { _type: "reference", _ref: assetId },
            });
            imageCount++;
          }
        } else if (m.type === "video") {
          // Upload video thumbnail as image
          const thumbId = await uploadImage(
            m.url,
            `${tweet.author.username}-${entry.tweetId}-thumb-${j}.jpg`
          );
          if (thumbId) {
            media.push({
              _type: "image",
              _key: `thumb-${j}`,
              asset: { _type: "reference", _ref: thumbId },
            });
            imageCount++;
          }
          // Add video embed
          if (m.videoUrl) {
            media.push({
              _type: "mediaEmbed",
              _key: `vid-${j}`,
              url: m.videoUrl,
              mediaType: "video",
              caption: `Video from @${tweet.author.username}`,
            });
          }
        }
      }
    }

    // Clean tweet text for description
    const cleanText = cleanTweetText(tweet.text);
    const description = truncate(entry.desc, 200);
    const slug = slugify(entry.title);
    const categoryRef = CATEGORY_MAP[entry.cat] || "category-productivity";

    // Build the Sanity document
    results.push({
      _id: `usecase-${slug}`,
      _type: "useCase",
      title: entry.title,
      slug: { _type: "slug", current: slug },
      description,
      longDescription: [
        {
          _type: "block",
          _key: "tweet-text",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "s1",
              marks: [],
              text: cleanText,
            },
          ],
        },
      ],
      category: { _type: "reference", _ref: categoryRef },
      complexity: inferComplexity(entry.cat, tweet.text),
      type: inferType(entry.cat),
      channels: [],
      integrations: [],
      personas: [],
      creator: {
        handle: tweet.author.username,
        name: tweet.author.name,
      },
      sourceUrl: `https://x.com/${tweet.author.username}/status/${tweet.id}`,
      sourcePlatform: "twitter",
      media,
      upvotes: 0,
      featured: false,
      discoverySource: "auto-twitter",
    });

    // Rate limit: ~500ms between Bird calls
    if (i < ENTRIES.length - 1) {
      await sleep(500);
    }
  }

  // ── Batch commit to Sanity ──────────────────────────────────────────
  console.log(`\n→ Committing ${results.length} use cases to Sanity...`);

  const BATCH_SIZE = 10;
  for (let i = 0; i < results.length; i += BATCH_SIZE) {
    const batch = results.slice(i, i + BATCH_SIZE);
    const tx = client.transaction();
    for (const doc of batch) {
      tx.createOrReplace(doc);
    }
    const res = await tx.commit();
    console.log(
      `  ✓ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} use cases (tx: ${res.transactionId})`
    );
  }

  console.log(`\n✓ Done! ${results.length} use cases seeded.`);
  console.log(`  Images uploaded: ${imageCount}`);
  if (failCount > 0) {
    console.log(`  Failed fetches: ${failCount}`);
  }
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
