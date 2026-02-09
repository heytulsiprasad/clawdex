# ClawDex

The community-driven, open-source directory of [OpenClaw](https://github.com/openclaw) use cases. Browse real AI agent workflows, copy prompts to your agent in one click, and discover what's possible.

![ClawDex Homepage](public/screenshots/homepage.png)

## What is this?

ClawDex is like [cursor.directory](https://cursor.directory) but for OpenClaw. It's a browsable directory of real-world AI agent use cases — from flight check-in automation to smart home voice control — all contributed by the community via GitHub PRs.

Every use case includes a **copyable agent prompt** you can paste directly into your OpenClaw agent via WhatsApp, Telegram, Discord, or any chat channel.

## Features

- **20+ curated use cases** across 10 categories (automation, dev workflows, smart home, productivity, and more)
- **One-click copy** — every use case has a prompt you can paste to your agent
- **AI prompt generator** — describe a use case and AI auto-generates a structured prompt
- **Community-driven** — add use cases by submitting a PR with a TypeScript file
- **Browse & filter** by category, complexity, integrations, and persona
- **Upvote & bookmark** your favorites

## Contributing

Adding a use case is simple:

1. Fork this repository
2. Copy `packages/data/src/use-cases/_template.ts` to a new file
3. Fill in your use case details (especially the `prompt` field)
4. Add your export to `packages/data/src/use-cases/index.ts`
5. Submit a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

## Tech Stack

- **Next.js 16** with React 19 and Turbopack
- **GitHub-backed data** — use cases live as TypeScript files in `packages/data/`
- **Firebase Firestore** — upvotes, bookmarks, subscribers
- **Anthropic API** — AI prompt generation on the submit page
- **Vercel** — deployment with edge runtime for OG images

## Getting Started

```bash
# Install dependencies
pnpm install

# Copy env file and add your keys
cp .env.local.example .env.local

# Run development server
pnpm dev
```

## Project Structure

```
clawdex/
  packages/data/          # Open-source data package (use cases, categories, etc.)
    src/use-cases/        # Community-contributed use case files
    src/categories.ts     # Category definitions
    src/integrations.ts   # Integration catalog
    src/types.ts          # Shared TypeScript types
  src/                    # Next.js app
    app/                  # Pages and API routes
    components/           # React components
    lib/data/adapter.ts   # Data access layer
  CONTRIBUTING.md         # How to add a use case
```

## License

MIT
