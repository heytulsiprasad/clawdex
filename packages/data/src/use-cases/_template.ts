/**
 * Use Case Template
 *
 * Copy this file and rename it to match your use case (e.g., flight-checkin.ts).
 * Fill in the fields below, then add your export to ./index.ts.
 *
 * The most important field is `prompt` — this is what users copy-paste to their agent.
 * Make it actionable, specific, and written as instructions the agent can follow.
 */
import type { UseCase } from "../types";

export const myUseCases: UseCase[] = [
  {
    title: "Your Use Case Title",
    slug: "your-use-case-slug",
    description: "A short description (max 200 chars) shown on cards.",
    longDescription: "Optional longer description with more detail about what this use case does and why it's useful.",
    category: "automation-workflows",
    complexity: "beginner",
    type: "workflow",
    channels: ["whatsapp"],
    integrations: ["gmail"],
    personas: ["productivity-enthusiast"],
    prompt: `Describe the task you want the agent to do.
Be specific about:
1. What to look for or monitor
2. What actions to take
3. What tools or integrations to use
4. What the expected output should be`,
    setupSteps: [
      "Step 1: Enable required integrations in OpenClaw",
      "Step 2: Configure any necessary API keys",
      "Step 3: Copy the prompt above and paste it to your agent",
    ],
    tags: ["example", "template"],
    creator: {
      handle: "yourtwitterhandle",
      name: "Your Name",
      url: "https://twitter.com/yourtwitterhandle",
    },
    sourceUrl: "https://twitter.com/yourtwitterhandle/status/example",
    sourcePlatform: "twitter",
    featured: false,
  },
];
