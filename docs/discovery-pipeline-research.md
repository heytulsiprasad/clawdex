# ClawDex Discovery Pipeline — Research & Options

> How to automatically scrape Twitter, Reddit, LinkedIn, and other platforms to find Claude Code / Claude Bot use cases and ingest them into Sanity CMS.

---

## Current State of the Codebase

ClawDex already has infrastructure designed for automated ingestion:

- **`submission` schema** — has `aiEnrichedData`, `aiConfidence`, `rawExtractedData`, and `discoverySource` fields
- **`useCase` schema** — `discoverySource` supports `"auto-twitter"`, `"auto-reddit"`, `"auto-github"`
- **`.env.local.example`** — already has placeholders for `SOCIALDATA_API_KEY`, `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`, `GITHUB_PAT`, `ANTHROPIC_API_KEY`
- **`scripts/seed-showcase.ts`** — existing proof-of-concept that scrapes tweets, extracts data, uploads media, and creates Sanity documents
- **Sanity write client** — configured in `src/lib/sanity/client.ts` with mutation token

---

## Ranked Options

### Option 1: "Lean Script Pipeline" — RECOMMENDED (Start Here)

TypeScript scripts (extending the existing `seed-showcase.ts` pattern) that run on a cron schedule via GitHub Actions. Each script targets one platform, feeds results through Claude Haiku for classification, and pushes to Sanity.

**Architecture:**

```
GitHub Actions (cron: every 6-12 hours)
  ├── scripts/discover-twitter.ts    → TwitterAPI.io ($0.15/1K tweets)
  ├── scripts/discover-reddit.ts     → Reddit API (free, OAuth2)
  ├── scripts/discover-hackernews.ts → Algolia HN API (free)
  ├── scripts/discover-github.ts     → GitHub Search API (free with PAT)
  └── scripts/discover-devto.ts      → Dev.to API (free)
           │
           ▼
    Claude Haiku (classify + enrich)
    "Is this a real Claude Code use case?
     Category? Complexity? Description?"
           │
           ▼
    Sanity CMS → createOrReplace()
    (dedup via URL-hash document IDs)
```

| Aspect | Detail |
|--------|--------|
| **Cost** | ~$10-20/month (TwitterAPI.io ~$5 + Claude Haiku tokens ~$5-10) |
| **Complexity** | Low — extends the existing `seed-showcase.ts` pattern |
| **Scheduling** | GitHub Actions cron (free for public repos, 2000 min/mo for private) |
| **Dedup** | Hash the source URL as Sanity document `_id` → `createOrReplace()` is idempotent |
| **Reliability** | High — scripts are stateless, retry-friendly |
| **Time to MVP** | Fast — pattern already proven in the codebase |

**Why #1:** The `seed-showcase.ts` script already does 80% of this for Twitter. Generalize the pattern, add Claude Haiku classification, and schedule it. No new infrastructure needed.

---

### Option 2: "Exa AI Semantic Search" — High-Signal Discovery

Instead of scraping each platform individually, use Exa AI's neural search to find Claude Code discussions across the entire internet in one query.

**Architecture:**

```
GitHub Actions cron
  └── scripts/discover-exa.ts
        │
        ├── Exa.search("people building with Claude Code agent")
        ├── Exa.search("Claude bot automation workflow")
        ├── Exa.search("OpenClaw use case")
        │
        ▼
    Claude Haiku (classify + extract structured data)
        │
        ▼
    Sanity CMS → createOrReplace()
```

| Aspect | Detail |
|--------|--------|
| **Cost** | ~$10-30/month (Exa Free tier: 1000 searches/mo, then ~$5/1K) |
| **Complexity** | Very Low — single API call replaces multiple platform scrapers |
| **Coverage** | Broad — searches across Twitter, Reddit, blogs, forums, HN simultaneously |
| **Signal quality** | High — neural/semantic search, not just keyword matching |
| **Limitations** | May miss real-time content (slight indexing lag), less platform-specific metadata |

**Why #2:** One API call can replace five platform-specific scrapers. The tradeoff is losing platform-specific metadata (engagement counts, thread context). Best used as a complement to Option 1.

---

### Option 3: "Apify Actor Marketplace" — Managed Scraping

Use pre-built Apify actors for each platform. Apify handles proxy rotation, rate limits, browser rendering, and anti-bot detection.

**Architecture:**

```
Apify Scheduler (built-in cron)
  ├── Twitter Scraper Actor → search "Claude Code"
  ├── Reddit Scraper Actor  → r/ClaudeAI, r/LocalLLaMA, etc.
  ├── LinkedIn Post Scraper → "Claude agent" posts
  ├── YouTube Comment Actor  → comments on Claude tutorials
  └── HN Scraper Actor      → "Claude" stories
           │
           ▼
    Apify Webhook → your Next.js API endpoint
           │
           ▼
    Claude Haiku (classify) → Sanity CMS
```

| Aspect | Detail |
|--------|--------|
| **Cost** | $49-149/month (Apify platform + actor compute credits) |
| **Complexity** | Medium — configure actors + webhook integration |
| **LinkedIn** | This is the **only** option that reasonably covers LinkedIn (browser automation) |
| **Reliability** | High — Apify handles proxy/rate-limit issues |
| **Maintenance** | Low — actors are maintained by the Apify community |

**Why #3:** More expensive but handles the hard stuff (LinkedIn, anti-bot). Good if LinkedIn coverage matters or if the lean script approach hits rate-limit walls.

---

### Option 4: "Claude Agent SDK Research Agent" — Most Sophisticated

Build a proper AI agent using Claude Agent SDK (or LangChain) that autonomously researches, classifies, and enriches use cases with minimal human intervention.

**Architecture:**

```
Trigger.dev / Inngest (scheduled job)
  └── Claude Agent (with tools)
        ├── Tool: search_twitter(query)
        ├── Tool: search_reddit(query)
        ├── Tool: search_exa(query)
        ├── Tool: fetch_url(url)       ← Firecrawl or Browserbase
        ├── Tool: classify_use_case(text)
        ├── Tool: create_sanity_document(data)
        └── Tool: check_duplicate(url)
           │
           ▼
    Agent autonomously:
    1. Generates search queries
    2. Evaluates results for relevance
    3. Extracts structured data
    4. Checks for duplicates
    5. Creates/updates Sanity documents
    6. Reports summary of findings
```

| Aspect | Detail |
|--------|--------|
| **Cost** | $30-100/month (Claude API for agent reasoning + tool execution) |
| **Complexity** | High — agent orchestration, tool definitions, error handling |
| **Intelligence** | Highest — agent decides what to search, adapts queries, follows threads |
| **Risk** | Agent could hallucinate, create bad entries, burn tokens on irrelevant content |
| **Maintenance** | Medium — needs prompt tuning and guardrails |

**Why #4:** Most powerful but highest risk/cost. The agent can discover things you wouldn't have searched for, follow conversation threads, and generate richer descriptions. Overkill for MVP but powerful at scale.

---

### Option 5: "Browserbase + Playwright" — Full Browser Automation

Cloud browser automation for scraping platforms that heavily rely on JS rendering or have strong anti-bot measures.

| Aspect | Detail |
|--------|--------|
| **Cost** | $50-200/month (Browserbase cloud browsers) |
| **Complexity** | High — Playwright scripts per platform |
| **Use case** | Only needed if API-based approaches get blocked |

**Why last:** This is a fallback. Only reach for this if API-based approaches are blocked. Expensive and brittle.

---

## Platform-by-Platform Breakdown

| Platform | Best Approach | API/Tool | Cost | Signal Quality |
|----------|--------------|----------|------|---------------|
| **Twitter/X** | TwitterAPI.io | REST API, $0.15/1K tweets | ~$5/mo | Highest (most discussions happen here) |
| **Reddit** | Reddit API (free) | OAuth2 app, 100 req/min | Free | High (r/ClaudeAI, r/LocalLLaMA, r/ChatGPT) |
| **Hacker News** | Algolia HN API | No auth needed | Free | High (technical audience) |
| **GitHub** | GitHub Search API | PAT, 30 req/min | Free | High (repos, discussions, issues) |
| **Dev.to** | Dev.to API | No auth needed | Free | Medium |
| **YouTube** | YouTube Data API | API key, 10K units/day | Free | Medium (comments on Claude videos) |
| **LinkedIn** | Apify actor OR skip | Browser automation | $49+/mo | Low (mostly reshares, not worth it early) |
| **Stack Overflow** | SO API | No auth needed | Free | Medium |
| **Entire web** | Exa AI | Neural search API | Free-$10/mo | Variable but broad |

---

## Recommended Implementation Plan

### Phase 1 — MVP

- Generalize `seed-showcase.ts` into per-platform discovery scripts
- Add Claude Haiku classification step to filter and enrich results
- Use Exa AI for broad web discovery alongside platform-specific scripts
- Set up GitHub Actions cron to run every 12 hours
- All results land in Sanity as `"pending"` submissions for human review
- Dedup via `_id: "auto-" + sha256(sourceUrl)` with `createOrReplace()`

### Phase 2 — Automation

- Add confidence threshold: `>0.8` auto-publish, `<0.8` pending review
- Expand to more platforms (YouTube, Dev.to, Stack Overflow)
- Add Slack/Discord notifications for new discoveries
- Build a dashboard in Sanity Studio showing pipeline stats

### Phase 3 — Agent

- Upgrade to Claude Agent SDK for intelligent, autonomous discovery
- Agent follows threads, generates richer descriptions, discovers new search terms
- Move from GitHub Actions to Trigger.dev for better observability and retry logic
- Add feedback loop: human approvals/rejections improve agent prompts over time

---

## Cost Summary

| Approach | Monthly Cost | Setup Effort | Maintenance |
|----------|-------------|-------------|-------------|
| Option 1 (Lean Scripts) | $10-20 | Low | Low |
| Option 2 (Exa AI) | $10-30 | Very Low | Very Low |
| **Option 1 + 2 Hybrid** | **$15-35** | **Low** | **Low** |
| Option 3 (Apify) | $49-149 | Medium | Low |
| Option 4 (Agent SDK) | $30-100 | High | Medium |
| Option 5 (Browser) | $50-200 | High | High |

---

## Key Technical Notes

- **URL-hash dedup:** `_id: "auto-" + sha256(sourceUrl)` means `createOrReplace()` naturally handles duplicates — if the same tweet is found twice, it overwrites with the same data.
- **Sanity batch mutations:** Sanity's mutation API supports batch transactions, so you can upsert 50 use cases in a single atomic operation instead of 50 API calls.
- **Claude Haiku for classification:** Not Sonnet or Opus — Haiku is 50x cheaper and fast enough for "is this a Claude Code use case? yes/no + extract fields."
- **GitHub Actions cron syntax:** `cron: '0 */12 * * *'` runs every 12 hours. Free for public repos.

---

## Legal Considerations

| Platform | Status | Notes |
|----------|--------|-------|
| Twitter/X | Use official API or licensed data providers (TwitterAPI.io) | Direct scraping violates ToS |
| Reddit | Reddit API is free but rate-limited (100 req/min) | Pushshift access was revoked in 2023 |
| LinkedIn | **Do not scrape directly** — use Apify actors only | HiQ v. LinkedIn ruling helps but still risky |
| Hacker News | Algolia API is fully public and free | No restrictions |
| GitHub | Public API with generous limits | Respect rate limits |
| Dev.to | Fully public API, no auth required | No restrictions |
| YouTube | YouTube Data API with daily quota | Respect ToS |
