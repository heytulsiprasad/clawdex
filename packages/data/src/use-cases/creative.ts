import type { UseCase } from "../types";

export const creativeUseCases: UseCase[] = [
  {
    title: "Social Media Content Scheduler",
    slug: "social-media-content-scheduler",
    description:
      "Plan, draft, and schedule social media posts across platforms from a single Discord channel.",
    longDescription:
      "Manage your social media presence from Discord. Describe the content you want, and the agent drafts platform-specific posts (Twitter, LinkedIn, Instagram captions), suggests optimal posting times, and queues them for publishing via browser automation.",
    category: "creative-media",
    complexity: "intermediate",
    type: "workflow",
    channels: ["discord"],
    integrations: ["browser-automation"],
    personas: ["content-creator", "solo-founder"],
    prompt: `You are my social media manager. I will give you content ideas in Discord and you will help me draft, refine, and schedule posts across platforms.

1. When I send a content idea (e.g., "Post about our new feature launch" or "Share this blog post: [url]"), generate platform-specific drafts:
   - **Twitter/X**: Punchy, under 280 chars. Include a hook. Suggest 3-5 relevant hashtags.
   - **LinkedIn**: Professional tone, 150-300 words, storytelling format. End with a question for engagement.
   - **Instagram**: Casual, visual-focused caption with emoji (where appropriate). Include 20-30 hashtags in a separate comment block.
2. Present all drafts in a single Discord message so I can review them side by side.
3. If I reply with edits (e.g., "make the Twitter one more casual" or "add a CTA to LinkedIn"), revise just that version.
4. When I approve with "schedule [platform] for [day/time]" or "schedule all for tomorrow 10am":
   - Use browser automation to log into the respective platform and schedule/post the content.
   - Confirm: "Scheduled: Twitter post for Tuesday 10:00 AM EST."
5. If I say "content calendar", show me all scheduled and draft posts for the next 7 days.
6. Suggest optimal posting times based on the platform (e.g., Twitter: 9-11 AM weekdays, LinkedIn: Tuesday-Thursday mornings).
7. Track performance: if I say "how did [post] do?", use browser automation to check engagement metrics (likes, reposts, comments) and summarize.
8. Maintain my brand voice notes (I'll share these once) and ensure all content stays on-brand.`,
    setupSteps: [
      "Set up a Discord channel for content management (e.g., #social-media)",
      "Enable browser automation and log into your social media accounts",
      "Share your brand voice guidelines and target audience with the agent",
      "Test with a simple post: 'Draft a Twitter post about productivity tips'",
    ],
    tags: [
      "social-media",
      "content-scheduling",
      "twitter",
      "linkedin",
      "instagram",
      "marketing",
    ],
    creator: {
      handle: "amandanat",
      name: "Amanda Natividad",
      url: "https://twitter.com/amandanat",
    },
    sourceUrl: "https://twitter.com/amandanat/status/1891283746205812",
    sourcePlatform: "twitter",
    featured: false,
  },
  {
    title: "Podcast Research Pipeline",
    slug: "podcast-research-pipeline",
    description:
      "Research podcast guests, generate interview questions, and compile show notes automatically.",
    longDescription:
      "Streamline podcast production. Send a guest's name and the agent researches their background, recent work, social media presence, and past interviews to generate tailored questions and a full show prep document saved to Obsidian.",
    category: "creative-media",
    complexity: "intermediate",
    type: "workflow",
    channels: ["telegram"],
    integrations: ["browser-automation", "obsidian"],
    personas: ["content-creator"],
    prompt: `You are my podcast research and prep assistant. When I send a guest name on Telegram, prepare everything I need for the interview.

1. When I message "Guest: [Full Name]" or "Prep: [Full Name]", begin the research pipeline:
   a. **Background Research**: Use browser automation to find their bio, current role, company, notable achievements, and personal website.
   b. **Recent Work**: Find their latest blog posts, tweets, talks, podcast appearances (last 6 months).
   c. **Social Presence**: Check Twitter, LinkedIn, and personal blog for recurring themes, hot takes, and interests.
   d. **Past Interviews**: Find 2-3 previous podcast or video interviews they've done and note what topics were covered (so we can go deeper or avoid repetition).

2. Generate a prep document with:
   - **Guest Bio** (3-4 sentences, ready to use as an intro on air)
   - **Key Topics** (5-7 themes we could explore, based on their expertise and recent work)
   - **Interview Questions** (12-15 questions organized by topic, starting with warm-up questions and building to deeper/more provocative ones)
   - **Quotable Moments** (interesting quotes or opinions they've shared publicly that we could reference)
   - **Landmines** (any controversial topics or sensitive areas to be aware of)

3. Save the full prep document to my Obsidian vault under "Podcast/Guest Prep/[Guest Name].md" with YAML frontmatter (guest name, recording date, status: prep).

4. Send a summary to Telegram: guest bio, top 5 questions, and confirmation that the full doc is in Obsidian.

5. If I reply "more questions about [topic]", generate 5 additional questions focused on that specific area and append them to the Obsidian note.

6. After recording, when I send "show notes: [episode title]", generate show notes with: episode summary, timestamps (I'll provide these), guest links, and key takeaways.`,
    setupSteps: [
      "Set up your Telegram bot for communication",
      "Enable browser automation for guest research",
      "Connect your Obsidian vault and create a 'Podcast/Guest Prep' folder",
      "Test with a well-known public figure: 'Guest: Tim Ferriss'",
    ],
    tags: [
      "podcast",
      "research",
      "interview-prep",
      "show-notes",
      "content-creation",
      "obsidian",
    ],
    creator: {
      handle: "jayacunzo",
      name: "Jay Acunzo",
      url: "https://twitter.com/jayacunzo",
    },
    sourceUrl:
      "https://dev.to/jayacunzo/automating-podcast-prep-with-ai-agents-3k8f",
    sourcePlatform: "devto",
    featured: false,
  },
];
