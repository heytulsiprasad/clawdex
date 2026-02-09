# Contributing to ClawDex

The community-driven directory of OpenClaw use cases. We welcome contributions!

## Adding a Use Case

1. Fork this repository
2. Copy `packages/data/src/use-cases/_template.ts` to a new file (e.g., `my-use-case.ts`)
3. Fill in your use case details — the `prompt` field is the most important!
4. Add your export to `packages/data/src/use-cases/index.ts`
5. Run `pnpm install && pnpm build` to verify
6. Submit a Pull Request

That's it! We'll review and merge within 24 hours.

## What Makes a Great Use Case

- **Clear prompt**: The `prompt` field should be specific, actionable instructions that another user can copy-paste directly to their OpenClaw agent
- **Real-world value**: Solves an actual problem or automates a genuine workflow
- **Complete metadata**: Category, complexity, integrations, and setup steps help users discover and implement your use case

## Project Structure

```
packages/data/src/
  use-cases/         # Community-contributed use cases (YOU ADD HERE)
    _template.ts     # Copy this to start
    index.ts         # Re-exports all use cases
  categories.ts      # Category definitions
  integrations.ts    # Integration definitions
  personas.ts        # Persona definitions
  types.ts           # TypeScript interfaces
```

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build
pnpm build
```

## Code Style

- Use TypeScript
- Follow existing patterns in the codebase
- Keep use case files focused — one theme per file
- Prompts should be written in natural language

## Reporting Issues

Found a bug? [Open an issue](https://github.com/clawdex/clawdex/issues/new?template=bug-report.yml).

Want to suggest a use case without writing code? [Submit it here](https://github.com/clawdex/clawdex/issues/new?template=new-use-case.yml).
