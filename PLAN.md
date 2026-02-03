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
- Twitter bot that auto-imports showcase posts from @openclaw mentions
- Integration with ClawdHub (install skills directly)
- AI-powered search ("I want to automate my email and calendar")
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

- Search for @openclaw mentions with demo screenshots
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
| **Framework** | Next.js 15 (App Router) | SSR for SEO, React ecosystem, fast dev |
| **Language** | TypeScript | Type safety, DX |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid UI development, consistent design system |
| **Database** | SQLite via Turso (libsql) | Simple, serverless, no infra overhead for MVP |
| **ORM** | Drizzle ORM | Type-safe, lightweight, works great with Turso |
| **Auth** | NextAuth.js (v5) | GitHub/Twitter OAuth when needed (post-MVP) |
| **Email** | Resend | Simple transactional + newsletter emails |
| **Search** | Built-in (SQL LIKE + client-side) | Upgrade to Algolia/Meilisearch later if needed |
| **Hosting** | Vercel | Zero-config Next.js deployment, free tier sufficient |
| **Media** | Cloudflare R2 or Vercel Blob | Screenshots/images storage |
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
        use-cases/
          route.ts                # CRUD API
        subscribe/
          route.ts                # Email collection
        upvote/
          route.ts                # Upvote endpoint
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
      ui/                         # shadcn/ui components
        button.tsx
        badge.tsx
        input.tsx
        select.tsx
        ...
    lib/
      db/
        schema.ts                 # Drizzle schema
        index.ts                  # DB connection
        seed.ts                   # Seed script
      data/
        seed-data.json            # 85+ seeded use cases
        categories.ts             # Category definitions
        integrations.ts           # Integration definitions
      utils.ts
    types/
      index.ts                    # Shared TypeScript types
  drizzle/
    migrations/                   # DB migrations
  public/
    icons/                        # Category + integration icons
    og/                           # OG images
  scripts/
    scrape-showcase.ts            # Script to parse showcase data
    import-tweets.ts              # Script to import from Twitter
```

### 7.3 Database Schema

```
use_cases
  id              TEXT PRIMARY KEY
  title           TEXT NOT NULL
  slug            TEXT UNIQUE NOT NULL
  description     TEXT NOT NULL
  long_description TEXT
  category_id     TEXT NOT NULL (FK)
  complexity      TEXT NOT NULL (beginner/intermediate/advanced)
  type            TEXT (workflow/skill/cron-job/multi-agent/hardware)
  creator_handle  TEXT
  creator_name    TEXT
  creator_avatar  TEXT
  source_url      TEXT
  upvotes         INTEGER DEFAULT 0
  status          TEXT DEFAULT 'published' (draft/published/pending)
  featured        BOOLEAN DEFAULT false
  created_at      DATETIME
  updated_at      DATETIME

use_case_channels (many-to-many)
  use_case_id     TEXT (FK)
  channel         TEXT (whatsapp/telegram/discord/slack/imessage)

use_case_integrations (many-to-many)
  use_case_id     TEXT (FK)
  integration_id  TEXT (FK)

use_case_personas (many-to-many)
  use_case_id     TEXT (FK)
  persona         TEXT (developer/founder/family/productivity/smarthome/creator)

use_case_media
  id              TEXT PRIMARY KEY
  use_case_id     TEXT (FK)
  url             TEXT NOT NULL
  type            TEXT (image/video/embed)
  caption         TEXT
  order           INTEGER

categories
  id              TEXT PRIMARY KEY
  name            TEXT NOT NULL
  slug            TEXT UNIQUE NOT NULL
  description     TEXT
  icon            TEXT
  color           TEXT
  order           INTEGER

integrations
  id              TEXT PRIMARY KEY
  name            TEXT NOT NULL
  slug            TEXT UNIQUE NOT NULL
  icon            TEXT
  category        TEXT (messaging/productivity/devtools/smarthome/media/other)

subscribers
  id              TEXT PRIMARY KEY
  email           TEXT UNIQUE NOT NULL
  subscribed_at   DATETIME
  source          TEXT (hero/footer/popup)

submissions
  id              TEXT PRIMARY KEY
  title           TEXT
  description     TEXT
  category_id     TEXT
  complexity      TEXT
  creator_handle  TEXT
  creator_email   TEXT
  source_url      TEXT
  status          TEXT DEFAULT 'pending' (pending/approved/rejected)
  submitted_at    DATETIME
  reviewed_at     DATETIME
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
- [ ] Initialize Next.js project with TypeScript, Tailwind, shadcn/ui
- [ ] Set up Drizzle ORM + Turso database
- [ ] Define database schema and run migrations
- [ ] Create seed data JSON from showcase research (50-85 entries)
- [ ] Write seed script to populate database

### Phase 2: Core Pages
- [ ] Build homepage (hero, featured, categories, email signup)
- [ ] Build browse page with filtering and search
- [ ] Build use case detail page
- [ ] Build category pages
- [ ] Implement responsive design (mobile-first)

### Phase 3: Interactivity
- [ ] Add upvoting (localStorage for MVP, no auth needed)
- [ ] Build submit form with validation
- [ ] Email collection endpoint (Resend integration)
- [ ] Search with debounced input

### Phase 4: Polish & Launch
- [ ] OG image generation
- [ ] SEO meta tags and structured data
- [ ] Analytics integration
- [ ] Performance optimization (ISR, image optimization)
- [ ] Deploy to Vercel
- [ ] Seed production database

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
2. **Admin panel:** Build a simple admin for reviewing submissions, or use a headless CMS?
3. **Should we support "Setup Guides"** as a separate content type alongside use cases?
4. **Newsletter frequency:** Weekly? Bi-weekly?
5. **Relationship with OpenClaw team:** Should we reach out to Peter Steinberger for endorsement/collaboration?
