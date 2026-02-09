import type { UseCase } from "../types";

export const multiAgentUseCases: UseCase[] = [
  {
    title: "CEO Assistant with Specialist Agents",
    slug: "ceo-assistant-specialist-agents",
    description:
      "A head agent on WhatsApp that delegates to specialist sub-agents for email, scheduling, and tasks.",
    longDescription:
      "Build your own AI chief of staff. A primary WhatsApp agent understands your intent, then delegates to specialized sub-agents: one for email drafting, one for calendar management, one for task tracking in Linear. The head agent coordinates everything and reports back.",
    category: "multi-agent-setups",
    complexity: "advanced",
    type: "multi-agent",
    channels: ["whatsapp"],
    integrations: ["gmail", "google-calendar", "linear"],
    personas: ["solo-founder"],
    prompt: `You are my Chief of Staff agent. I will message you on WhatsApp with requests, and you will delegate to the appropriate specialist sub-agent and coordinate the response.

You manage three specialist agents:
- **Email Agent**: Handles drafting, sending, searching, and summarizing emails via Gmail.
- **Calendar Agent**: Manages scheduling, rescheduling, conflict detection, and availability checks via Google Calendar.
- **Task Agent**: Creates, updates, and queries tasks and projects in Linear.

1. When I send a message, determine which specialist(s) need to be involved. Examples:
   - "Schedule a meeting with Sarah about the Q3 roadmap" -> Calendar Agent (find availability, create event) + Email Agent (send invite)
   - "What's on my plate this week?" -> Calendar Agent (meetings) + Task Agent (open tasks) -> compile a unified view
   - "Draft a follow-up email to the investor from yesterday's meeting" -> Calendar Agent (find yesterday's meeting details) -> Email Agent (draft email with context)
2. For multi-agent tasks, coordinate the handoff: gather context from one agent before passing it to the next.
3. Always respond with a unified summary on WhatsApp — never expose the internal delegation. I should feel like I'm talking to one smart assistant.
4. If you need clarification, ask one clear question rather than multiple. Batch your questions.
5. When I say "urgent:", prioritize that request and interrupt any ongoing lower-priority tasks.
6. Maintain a running context of my day: know what meetings I just had, what emails came in, and what tasks are due.
7. Every Friday at 5 PM, send me an unprompted weekly summary: meetings attended, emails sent, tasks completed, and tasks rolling into next week.
8. If a task requires human judgment (e.g., which candidate to hire), present me with options and your recommendation, then wait for my decision.`,
    setupSteps: [
      "Connect Gmail with full send/read access for the Email Agent",
      "Connect Google Calendar with read/write access for the Calendar Agent",
      "Connect Linear with project and issue access for the Task Agent",
      "Link your WhatsApp number as the primary interface",
      "Configure the specialist agents and test each one individually before enabling coordination",
      "Run a multi-step test: 'Schedule a meeting with John next Tuesday at 2 PM and email him the agenda'",
    ],
    tags: [
      "multi-agent",
      "delegation",
      "executive-assistant",
      "coordination",
      "ceo",
      "workflow",
    ],
    creator: {
      handle: "yaborsky",
      name: "Yuri Aborsky",
      url: "https://twitter.com/yaborsky",
    },
    sourcePlatform: "other",
    featured: true,
  },
  {
    title: "Content Creation Pipeline",
    slug: "content-creation-pipeline",
    description:
      "Orchestrate multiple agents on Discord to research, write, design, and publish content end-to-end.",
    longDescription:
      "A multi-agent content factory. Give it a topic in Discord and watch as a researcher gathers data, a writer drafts the piece, an image agent generates visuals, and a publisher formats and posts it. Each agent specializes in one step of the pipeline.",
    category: "multi-agent-setups",
    complexity: "advanced",
    type: "multi-agent",
    channels: ["discord"],
    integrations: ["browser-automation", "midjourney"],
    personas: ["content-creator", "solo-founder"],
    prompt: `You are the coordinator of my content creation pipeline. I will give you a topic or content brief in Discord, and you will manage a team of specialist agents to produce a finished piece.

Your pipeline has these stages, each handled by a specialist:
- **Research Agent**: Uses browser automation to research the topic, gather statistics, find quotes, and compile source material.
- **Writer Agent**: Takes research output and produces a polished draft in the requested format (blog post, Twitter thread, newsletter, LinkedIn post).
- **Visual Agent**: Generates relevant images using Midjourney prompts based on the content.
- **Editor Agent**: Reviews the draft for clarity, grammar, tone, and SEO optimization.

1. When I post a brief like "Create a blog post about [topic]", kick off the pipeline:
   a. Research Agent gathers 5-10 sources and produces a research brief.
   b. Writer Agent creates a draft using the research (1000-1500 words for blog posts, 10-15 tweets for threads).
   c. Visual Agent generates 2-3 image options based on key themes.
   d. Editor Agent reviews and polishes the final version.
2. Post each stage's output in a dedicated Discord thread so I can see progress and provide feedback at any point.
3. If I reply with edits or feedback on any stage, pass those to the relevant agent and continue the pipeline from that point.
4. Support multiple output formats: "blog", "thread" (Twitter), "newsletter", "linkedin", "short-form" (Instagram/TikTok script).
5. For each piece, also generate: a meta description, 5 relevant hashtags, and a suggested publish time based on the platform.
6. Maintain a content calendar: when I say "calendar", show me all pieces in progress and their stages.
7. The entire pipeline should complete within 20 minutes for a standard blog post.`,
    setupSteps: [
      "Set up a Discord server with channels for #content-briefs and #content-output",
      "Enable browser automation for the Research Agent",
      "Connect Midjourney or your preferred image generation tool for the Visual Agent",
      "Test the pipeline with a simple brief: 'Create a short blog post about morning routines'",
      "Configure your preferred content formats and tone guidelines",
    ],
    tags: [
      "content-creation",
      "multi-agent",
      "pipeline",
      "writing",
      "midjourney",
      "blog",
    ],
    creator: {
      handle: "nateliason",
      name: "Nat Eliason",
      url: "https://twitter.com/nateliason",
    },
    sourceUrl: "https://www.youtube.com/watch?v=Qr5xG_VRqDE",
    sourcePlatform: "youtube",
    featured: false,
  },
];
