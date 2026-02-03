# ClawDex - The OpenClaw Use Case Directory

> Discover how people are using OpenClaw. Filter by category, complexity, and integrations.
> Inspired by Futurepedia. Built for the OpenClaw community.

---

## 1. Problem Statement

OpenClaw is one of the hottest AI products right now (10k+ GitHub stars, 8.9k+ community members, covered by Fireship with 978k views). Users are building incredible things - from multi-agent business teams to smart home controllers to autonomous car negotiators.

**The problem:** All these use cases live scattered across:
- The official showcase page (85+ entries, no filtering)
- Twitter/X posts (ephemeral, hard to discover)
- Discord #showcase channel (buried in chat)
- YouTube tutorials (no structured discovery)

**New users can't easily answer:** "What can I actually do with OpenClaw?" or "How do people like me use it?"

**ClawDex solves this** by creating a structured, filterable, community-driven directory of OpenClaw use cases with setup guides, making it the go-to resource for anyone exploring what's possible.

---

## 2. Target Users

| Persona | Need | How ClawDex Helps |
|---------|------|-------------------|
| **New to OpenClaw** | "What can this thing do?" | Browse by category, see real examples |
| **Developer** | "Show me dev workflows" | Filter by Developer tag, see code snippets |
| **Family User** | "Can this help my household?" | Filter by Family persona, see meal planning etc. |
| **Solo Founder** | "How do I automate my business?" | Filter by Business, see multi-agent setups |
| **Smart Home Enthusiast** | "Can it control my devices?" | Filter by Smart Home, see Home Assistant integrations |
| **Content Creator** | "Help me automate content" | Filter by Content, see research pipelines |

---

## 3. Content Taxonomy

### 3.1 Primary Categories (10)

| # | Category | Icon | Example Use Cases |
|---|----------|------|-------------------|
| 1 | **Automation & Workflows** | lightning bolt | Email triage, flight check-in, expense tracking |
| 2 | **Development & DevOps** | code | PR review, deployment, GitHub automation, skill building |
| 3 | **Smart Home & IoT** | home | Home Assistant, HomePods, air purifiers, 3D printers |
| 4 | **Productivity** | target | Research, document synthesis, todo management, calendar |
| 5 | **Family & Personal** | users | Meal planning, household projects, kids coordination |
| 6 | **Voice & Communication** | phone | Phone calls, voice assistants, transcription |
| 7 | **Multi-Agent Setups** | network | Agent teams, orchestration, shared memory |
| 8 | **Hardware & Edge** | cpu | Raspberry Pi, Mac Mini servers, dedicated hardware |
| 9 | **Learning & Research** | book | Language learning, SEO analysis, content curation |
| 10 | **Creative & Media** | palette | Image generation, video editing, music extraction |

### 3.2 Secondary Filters

- **Complexity:** Beginner / Intermediate / Advanced
- **Channel:** WhatsApp / Telegram / Discord / Slack / iMessage
- **Platform:** macOS / Linux / Raspberry Pi / Docker
- **Integrations:** Notion / GitHub / Home Assistant / Google Calendar / Obsidian / Spotify / etc.
- **Type:** Workflow / Skill / Cron Job / Multi-Agent / Hardware Setup

### 3.3 Persona Tags

Users can browse by "I am a..." to see relevant use cases:
- Developer
- Solo Founder / Indie Hacker
- Family Manager
- Productivity Enthusiast
- Smart Home Enthusiast
- Content Creator

---

## 4. Features - MVP (Launch)

### 4.1 Homepage

- **Hero section:** Tagline + search bar + stats counter (e.g., "85+ use cases, 10 categories")
- **Featured use cases:** 6 hand-picked cards (rotated)
- **Category grid:** 10 category cards with icons and counts
- **"I am a..." persona selector:** Quick filter to relevant use cases
- **Email signup:** "Get weekly use case roundups" with simple email input
- **Social proof:** "Join 8,900+ OpenClaw community members"

### 4.2 Browse / Listing Page

- **Use case cards** in a responsive grid showing:
  - Title
  - Creator handle (Twitter)
  - Category badge
  - Complexity badge (Beginner/Intermediate/Advanced)
  - Integration icons (small logos for Notion, GitHub, etc.)
  - Short description (2 lines)
  - Upvote count
- **Sidebar filters:**
  - Category (multi-select)
  - Complexity
  - Channel (WhatsApp, Telegram, etc.)
  - Integrations
  - Sort by: Popular / Newest / Most Upvoted
- **Search bar** with fuzzy matching on title, description, integrations
- **Pagination** or infinite scroll

### 4.3 Use Case Detail Page

- **Header:** Title, creator info (avatar, handle, link), date added
- **Metadata bar:** Category, complexity, channel, platform
- **Description:** Rich text explanation of the use case
- **Screenshot/Video:** Embedded media showing the use case in action
- **Integration list:** What services/tools are connected
- **Setup section:** Step-by-step guide or link to guide
- **Source link:** Link to original tweet/post/repo
- **Related use cases:** 3-4 similar entries
- **Upvote button**

### 4.4 Submit a Use Case

- Simple form (no account required for MVP):
  - Title
  - Description
  - Category (select)
  - Complexity (select)
  - Channel used
  - Integrations (multi-select)
  - Screenshot/video URL
  - Source link (tweet, repo, etc.)
  - Creator Twitter handle
  - Email (for follow-up)
- Submissions go into a review queue (admin approves)

### 4.5 Email Collection

- Newsletter signup in hero, footer, and after browsing 3+ use cases
- Value prop: "Weekly digest of the best new OpenClaw use cases"
- Store emails for future community features

---

## 5. Features - Post-MVP

### Phase 2 (After Launch Feedback)
- User accounts (sign in with Twitter/GitHub)
- Favorites/bookmarks (personal collection)
- "I use this" counter on each use case
- Comment/discussion on each use case
- Contributor profiles (see all use cases by a creator)
- RSS feed

### Phase 3 (Growth)
- Weekly automated newsletter from new submissions
- Integration with ClawdHub (install skills directly)
- AI-powered semantic search ("I want to automate my email and calendar")
- Setup difficulty ratings (community-voted)
- Video tutorial embeds with timestamps
- "Build this" guided walkthroughs

### Phase 4 (Monetization, if applicable)
- Featured listings for skill developers
- Sponsored use cases / integrations
- Premium setup guides / courses (Futurepedia model)
- Affiliate links to hardware (Raspberry Pi, etc.)

---

## 6. Data Seeding Strategy

We need 50-85 use cases at launch without manual entry. Here's the plan:

### 6.1 Source: Official Showcase (Primary)

The showcase page has 85+ entries with:
- Creator Twitter handle
- Category (inferable)
- Description (from tweet content)
- Screenshots/videos (from embedded media)

**Process:**
1. Parse the showcase page data into structured JSON
2. Categorize each entry into our taxonomy
3. Assign complexity levels
4. Tag integrations mentioned
5. Link back to original source

### 6.2 Source: Twitter/X

- Use SocialData.tools search API (~$0.0002/tweet) to find @openclaw mentions with demo screenshots
- Or use Twitter Syndication API (free) for individual tweet URLs found manually
- Extract: handle, text, media, date
- Deduplicate against showcase entries

### 6.3 Source: YouTube

- Key videos: Fireship, VelvetShark, This Week in Startups
- Extract specific use case timestamps
- Link as video embeds on detail pages

### 6.4 Seed Data Format

```json
{
  "title": "Flight Check-in Automation",
  "slug": "flight-checkin-automation",
  "description": "Finds next flight in email, runs through check-in process, selects a window seat - all while driving.",
  "creator": {
    "handle": "armanddp",
    "name": "Armand du Plessis",
    "avatar": "https://..."
  },
  "category": "automation-workflows",
  "complexity": "intermediate",
  "channels": ["whatsapp"],
  "integrations": ["gmail", "browser-automation"],
  "type": "workflow",
  "personas": ["productivity-enthusiast"],
  "sourceUrl": "https://twitter.com/armanddp/status/...",
  "mediaUrls": ["screenshot.png"],
  "setupSteps": [],
  "upvotes": 0,
  "createdAt": "2026-01-28"
}
```

---

## 7. Technical Architecture

### 7.1 Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Framework** | Next.js 15 (App Router) | SSR for SEO, React Server Components, Vercel-native |
| **Language** | TypeScript | Type safety, DX |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid UI development, consistent design system |
| **CMS** | Sanity | Content modeling, Studio dashboard for admin review, GROQ queries for filtering, generous free tier (100K API req/mo) |
| **Auth** | NextAuth.js (v5) | GitHub/Twitter OAuth when needed (post-MVP) |
| **Email** | Resend | Simple transactional + newsletter emails |
| **Search** | Sanity GROQ + client-side filtering | Sanity handles text search natively; upgrade to Algolia later if needed |
| **URL Extraction** | Platform APIs (server-side) | Twitter Syndication API, Reddit OAuth, YouTube oEmbed, GitHub REST — all free |
| **AI Enrichment** | Claude API (Sonnet + Haiku) | Structured output via `tool_use` for auto-categorization, ~$0.008/submission |
| **Social Monitoring** | SocialData.tools + Reddit/GitHub APIs | Automated mention scanning at ~$0.04/mo for Twitter, free for Reddit/GitHub |
| **Hosting** | Vercel | Zero-config Next.js deployment, free tier sufficient, cron jobs for scanning |
| **Media** | Sanity Image Pipeline + Cloudflare R2 | Sanity handles image transforms; R2 for overflow/video storage |
| **Analytics** | Plausible or Umami | Privacy-friendly, lightweight |

### 7.2 Project Structure

```
clawdex/
  src/
    app/
      page.tsx                    # Homepage
      browse/
        page.tsx                  # Browse/listing with filters
      use-case/
        [slug]/
          page.tsx                # Detail page
      submit/
        page.tsx                  # Submit form
      api/
        extract/
          route.ts                # URL extraction endpoint (Twitter, Reddit, YouTube, GitHub)
        enrich/
          route.ts                # AI enrichment endpoint (Claude tool_use)
        subscribe/
          route.ts                # Email collection
        upvote/
          route.ts                # Upvote endpoint
        cron/
          scan/
            route.ts              # Automated social scanning (Vercel Cron)
    components/
      layout/
        header.tsx
        footer.tsx
        hero.tsx
      use-case/
        card.tsx                  # Use case card for grid
        detail.tsx                # Full detail view
        filters.tsx               # Sidebar filters
        search.tsx                # Search component
      submit/
        url-input.tsx             # Smart URL paste input with platform detection
        preview-card.tsx          # Shows extracted data before submission
      ui/                         # shadcn/ui components
        button.tsx
        badge.tsx
        input.tsx
        select.tsx
        ...
    lib/
      sanity/
        client.ts                 # Sanity client configuration
        queries.ts                # GROQ queries for use cases, categories, etc.
        image.ts                  # Sanity image URL builder
      extractors/
        twitter.ts                # Twitter Syndication API extraction
        reddit.ts                 # Reddit OAuth + .json extraction
        youtube.ts                # YouTube oEmbed extraction
        github.ts                 # GitHub REST API extraction
        detect.ts                 # URL platform detection
      ai/
        enrich.ts                 # Claude Sonnet tool_use enrichment
        filter.ts                 # Claude Haiku relevance filtering
        schema.ts                 # tool_use JSON schema definitions
      data/
        categories.ts             # Category definitions with examples
        integrations.ts           # Integration definitions
      utils.ts
    types/
      index.ts                    # Shared TypeScript types
  sanity/
    schemas/
      useCase.ts                  # Use case document schema
      category.ts                 # Category document schema
      integration.ts              # Integration document schema
      submission.ts               # Pending submission schema
      subscriber.ts               # Email subscriber schema
    sanity.config.ts              # Sanity Studio configuration
    sanity.cli.ts                 # Sanity CLI config
  public/
    icons/                        # Category + integration icons
    og/                           # OG images
  scripts/
    seed-from-showcase.ts         # One-time: parse showcase page → Sanity
    seed-from-tweets.ts           # One-time: import tweets via SocialData → Sanity
```

### 7.3 Sanity Content Schemas

```ts
// useCase — Primary content type
{
  name: 'useCase',
  type: 'document',
  fields: [
    { name: 'title',            type: 'string' },
    { name: 'slug',             type: 'slug',       options: { source: 'title' } },
    { name: 'description',      type: 'text' },         // Short (2-line) description for cards
    { name: 'longDescription',  type: 'blockContent' },  // Rich text for detail page
    { name: 'category',         type: 'reference',  to: [{ type: 'category' }] },
    { name: 'complexity',       type: 'string',     options: { list: ['beginner', 'intermediate', 'advanced'] } },
    { name: 'type',             type: 'string',     options: { list: ['workflow', 'skill', 'cron-job', 'multi-agent', 'hardware'] } },
    { name: 'channels',         type: 'array',      of: [{ type: 'string' }] },  // whatsapp, telegram, etc.
    { name: 'integrations',     type: 'array',      of: [{ type: 'reference', to: [{ type: 'integration' }] }] },
    { name: 'personas',         type: 'array',      of: [{ type: 'string' }] },  // developer, founder, etc.
    { name: 'creator',          type: 'object',     fields: [
      { name: 'handle', type: 'string' },
      { name: 'name',   type: 'string' },
      { name: 'avatar', type: 'url' },
    ]},
    { name: 'sourceUrl',        type: 'url' },
    { name: 'sourcePlatform',   type: 'string',     options: { list: ['twitter', 'reddit', 'youtube', 'github', 'other'] } },
    { name: 'media',            type: 'array',      of: [{ type: 'image' }, { type: 'object', fields: [
      { name: 'url', type: 'url' },
      { name: 'type', type: 'string', options: { list: ['video', 'embed'] } },
      { name: 'caption', type: 'string' },
    ]}] },
    { name: 'setupSteps',       type: 'array',      of: [{ type: 'block' }] },
    { name: 'upvotes',          type: 'number',     initialValue: 0 },
    { name: 'featured',         type: 'boolean',    initialValue: false },
    { name: 'aiConfidence',     type: 'number' },   // 0-1 confidence from AI enrichment
    { name: 'discoverySource',  type: 'string',     options: { list: ['manual', 'user-submission', 'auto-twitter', 'auto-reddit', 'auto-github'] } },
  ]
}

// category
{
  name: 'category',
  type: 'document',
  fields: [
    { name: 'name',        type: 'string' },
    { name: 'slug',        type: 'slug',   options: { source: 'name' } },
    { name: 'description', type: 'text' },
    { name: 'icon',        type: 'string' },
    { name: 'color',       type: 'string' },
    { name: 'order',       type: 'number' },
  ]
}

// integration
{
  name: 'integration',
  type: 'document',
  fields: [
    { name: 'name',     type: 'string' },
    { name: 'slug',     type: 'slug',   options: { source: 'name' } },
    { name: 'icon',     type: 'image' },
    { name: 'category', type: 'string', options: { list: ['messaging', 'productivity', 'devtools', 'smarthome', 'media', 'other'] } },
  ]
}

// submission — Pending user/auto submissions before approval
{
  name: 'submission',
  type: 'document',
  fields: [
    { name: 'sourceUrl',        type: 'url' },
    { name: 'sourcePlatform',   type: 'string' },
    { name: 'rawExtractedData', type: 'object', fields: [/* raw platform API response */] },
    { name: 'aiEnrichedData',   type: 'object', fields: [/* AI-generated title, description, tags */] },
    { name: 'aiConfidence',     type: 'number' },
    { name: 'status',           type: 'string', options: { list: ['pending', 'approved', 'rejected'] }, initialValue: 'pending' },
    { name: 'submitterEmail',   type: 'string' },
    { name: 'submittedAt',      type: 'datetime' },
    { name: 'reviewedAt',       type: 'datetime' },
  ]
}

// subscriber
{
  name: 'subscriber',
  type: 'document',
  fields: [
    { name: 'email',        type: 'string' },
    { name: 'source',       type: 'string', options: { list: ['hero', 'footer', 'popup'] } },
    { name: 'subscribedAt', type: 'datetime' },
  ]
}
```

### 7.4 Key Pages & Routes

| Route | Purpose | Data |
|-------|---------|------|
| `/` | Homepage | Featured use cases, categories, stats |
| `/browse` | Browse with filters | Paginated use cases, filter params in URL |
| `/browse?category=smart-home` | Category filtered | Pre-filtered listing |
| `/browse?persona=developer` | Persona filtered | Pre-filtered listing |
| `/use-case/[slug]` | Detail page | Full use case data + related |
| `/submit` | Submit form | Form → creates pending submission |
| `/categories` | All categories | Category grid with descriptions |
| `/categories/[slug]` | Category page | Filtered listing + category description |

### 7.5 URL Extraction & AI Enrichment Pipeline

When a user pastes a URL (or the cron scanner finds a mention), this pipeline runs:

```
URL pasted/discovered
      │
      ▼
  Platform detection (regex on URL hostname)
      │
      ├─ twitter.com / x.com ──→ Syndication API (free, no auth)
      │    Endpoint: cdn.syndication.twimg.com/tweet-result?id={id}&token={token}
      │    Returns: tweet text, author, media URLs, likes, date
      │
      ├─ reddit.com ──→ OAuth .json endpoint (free, 100 req/min)
      │    Endpoint: oauth.reddit.com/api/info?url={url}
      │    Returns: title, selftext (markdown), author, score, media, comments
      │
      ├─ youtube.com / youtu.be ──→ oEmbed API (free, no auth)
      │    Endpoint: youtube.com/oembed?url={url}&format=json
      │    Returns: title, author, thumbnail
      │    (Optionally: YouTube Data API v3 for description/stats, free 10K/day)
      │
      └─ github.com ──→ REST API (free, 5K req/hr with PAT)
           Endpoint: api.github.com/repos/{owner}/{repo}
           Returns: name, description, stars, language, topics
      │
      ▼
  Raw extracted data
      │
      ▼
  Claude Sonnet — single tool_use call (~$0.008)
  Returns structured JSON:
    {
      title, description, category, complexity,
      integrations[], personas[], slug,
      metaDescription, confidenceScore (0-1),
      isRelevant (boolean)
    }
      │
      ▼
  Confidence-based routing:
    ≥ 0.85 → Auto-approve to Sanity as published use case
    0.60–0.84 → Light review (pre-filled in Sanity Studio)
    < 0.60 → Full manual review in Sanity Studio
```

#### Automated Social Scanning (Vercel Cron)

Runs every 6 hours via `/api/cron/scan`:

| Source | Method | Cost |
|---|---|---|
| **Twitter** | SocialData.tools Search Monitor for "@openclaw" | ~$0.04/mo |
| **Reddit** | OAuth search for "openclaw" across subreddits | Free |
| **GitHub** | Search API for repos mentioning "openclaw" | Free |

Each candidate → deduplicate by URL → Haiku relevance filter (~$0.001/call) → Sonnet enrichment → Sanity submission queue.

#### Cost Summary

| Component | Monthly Cost |
|---|---|
| URL extraction (all platform APIs) | $0 |
| Twitter monitoring (SocialData.tools) | ~$0.04 |
| AI filtering — Haiku (scanning candidates) | ~$3 |
| AI enrichment — Sonnet (submissions) | ~$4 |
| **Total pipeline cost** | **~$7/mo** |

---

## 8. Design Direction

### 8.1 Visual Identity

- **Color palette:** Dark theme primary (matches OpenClaw/developer aesthetic)
  - Background: Near-black (#0a0a0f)
  - Cards: Dark gray (#161620)
  - Accent: OpenClaw orange/amber (#f59e0b) or lobster red (#ef4444)
  - Text: White/gray hierarchy
- **Typography:** Inter or Geist (modern, clean, developer-friendly)
- **Vibe:** Technical but approachable, similar to Linear/Vercel marketing sites

### 8.2 Component Patterns

- Cards with hover states and subtle gradients
- Badges for categories, complexity, channels (color-coded)
- Small integration icons on cards (Notion, GitHub, Home Assistant logos)
- Sticky sidebar filters on browse page
- Smooth transitions and minimal animations

---

## 9. SEO Strategy

- **SSR** all pages for crawlability
- **Dynamic OG images** per use case (title + category + integration icons)
- **Structured data** (JSON-LD) for use cases
- **Sitemap** auto-generated
- **URL structure:** `/use-case/flight-checkin-automation` (human-readable slugs)
- **Meta descriptions** auto-generated from use case descriptions
- **Category landing pages** with unique descriptions for long-tail SEO
  - e.g., "Best OpenClaw Smart Home Automations" ranks for related searches

---

## 10. Implementation Phases

### Phase 1: Foundation
- [ ] Initialize Next.js 15 project with TypeScript, Tailwind, shadcn/ui
- [ ] Set up Sanity project with Studio, define content schemas (useCase, category, integration, submission, subscriber)
- [ ] Configure Sanity client + GROQ queries in `lib/sanity/`
- [ ] Seed categories and integrations into Sanity
- [ ] Create seed data from showcase research (50-85 entries) and import into Sanity

### Phase 2: Core Pages
- [ ] Build homepage (hero, featured, categories, email signup)
- [ ] Build browse page with GROQ-powered filtering and search
- [ ] Build use case detail page with related use cases
- [ ] Build category pages
- [ ] Implement responsive design (mobile-first)

### Phase 3: Smart Submission Pipeline
- [ ] Build URL extraction endpoints (`/api/extract/`) for Twitter, Reddit, YouTube, GitHub
- [ ] Build AI enrichment endpoint (`/api/enrich/`) with Claude Sonnet tool_use
- [ ] Build submit page with smart URL input → auto-extract → preview → submit flow
- [ ] Confidence-based routing to Sanity (auto-approve / light review / full review)
- [ ] Add upvoting (localStorage for MVP, no auth needed)
- [ ] Email collection endpoint (Resend integration)

### Phase 4: Automation & Launch
- [ ] Set up Vercel Cron for automated social scanning (`/api/cron/scan/`)
- [ ] SocialData.tools integration for Twitter mention monitoring
- [ ] Reddit + GitHub automated scanning
- [ ] OG image generation
- [ ] SEO meta tags and structured data (JSON-LD)
- [ ] Analytics integration (Plausible or Umami)
- [ ] Performance optimization (ISR, image optimization)
- [ ] Deploy to Vercel

---

## 11. Success Metrics

| Metric | Target (Month 1) | Target (Month 3) |
|--------|------------------|------------------|
| Use cases listed | 85+ | 200+ |
| Monthly visitors | 1,000 | 10,000 |
| Email subscribers | 100 | 1,000 |
| Community submissions | 10 | 50+ |
| Avg. session duration | >2 min | >3 min |

---

## 12. Open Questions

1. **Domain:** Going with `clawdex.dev` - confirmed available at ~$12/yr on Cloudflare
2. ~~**Admin panel:** Build a simple admin for reviewing submissions, or use a headless CMS?~~ → **Resolved: Using Sanity Studio as the admin dashboard**
3. **Should we support "Setup Guides"** as a separate content type alongside use cases?
4. **Newsletter frequency:** Weekly? Bi-weekly?
5. **Relationship with OpenClaw team:** Should we reach out to Peter Steinberger for endorsement/collaboration?
6. **Auto-approve threshold:** Start with 0.85 confidence for auto-approve, or be more conservative (0.90+) at launch?
7. **Upvotes storage:** Keep upvotes in Sanity (simpler) or add a lightweight DB like Turso for high-frequency writes?
