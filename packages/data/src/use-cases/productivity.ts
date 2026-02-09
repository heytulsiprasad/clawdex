import type { UseCase } from "../types";

export const productivityUseCases: UseCase[] = [
  {
    title: "Research Assistant with Obsidian Sync",
    slug: "research-assistant-obsidian-sync",
    description:
      "Send a topic on WhatsApp and get a structured research brief saved directly to your Obsidian vault.",
    longDescription:
      "Turn WhatsApp into your research inbox. Send any topic or question, and the agent conducts web research, synthesizes findings into a structured note with sources, and saves it to your Obsidian vault — ready for your next deep work session.",
    category: "productivity",
    complexity: "intermediate",
    type: "workflow",
    channels: ["whatsapp"],
    integrations: ["obsidian", "browser-automation"],
    personas: ["productivity-enthusiast", "developer", "solo-founder"],
    prompt: `You are my research assistant. When I send a topic or question on WhatsApp, conduct thorough research and save the results to my Obsidian vault.

1. When I send a message like "Research: [topic]" or "Look into [question]", begin a research workflow.
2. Use browser automation to search the web, visit relevant pages, and gather information from multiple reputable sources (aim for 5-8 sources minimum).
3. Synthesize the findings into a structured Obsidian-compatible Markdown note with these sections:
   - **Summary**: 3-5 sentence overview of the key findings
   - **Key Points**: Bulleted list of the most important takeaways
   - **Detailed Notes**: Organized sub-sections covering different aspects of the topic
   - **Sources**: Numbered list with titles, URLs, and a one-line description of each source
   - **Open Questions**: Things worth exploring further
4. Add YAML frontmatter with: title, date, tags (auto-generated from content), and status (draft).
5. Save the note to my Obsidian vault in the "Research" folder with a descriptive filename.
6. Reply on WhatsApp with the Summary section and a confirmation: "Research note saved to Obsidian: [filename]. Found X sources covering [brief description]."
7. If I reply with follow-up questions, append the answers to the same note under a "Follow-up" section.
8. If I say "quick lookup: [question]", skip the full research and just answer the question directly on WhatsApp without creating a note.`,
    setupSteps: [
      "Set up Obsidian vault sync (via Obsidian REST API plugin or file system access)",
      "Enable browser automation for web research",
      "Link your WhatsApp number for sending research requests",
      "Create a 'Research' folder in your Obsidian vault if it doesn't exist",
      "Test with a simple topic like 'Research: benefits of intermittent fasting'",
    ],
    tags: [
      "research",
      "obsidian",
      "knowledge-management",
      "note-taking",
      "web-research",
    ],
    creator: {
      handle: "kepano",
      name: "Steph Ango",
      url: "https://twitter.com/kepano",
    },
    sourcePlatform: "other",
    featured: true,
  },
  {
    title: "Calendar Meeting Prep",
    slug: "calendar-meeting-prep",
    description:
      "Get a Slack briefing 15 minutes before each meeting with attendee info, agenda, and context.",
    longDescription:
      "Walk into every meeting prepared. The agent checks your calendar, gathers context from recent emails with attendees, pulls in any linked documents, and delivers a concise briefing to Slack before the meeting starts.",
    category: "productivity",
    complexity: "beginner",
    type: "cron-job",
    channels: ["slack"],
    integrations: ["google-calendar", "gmail"],
    personas: ["productivity-enthusiast", "solo-founder"],
    prompt: `You are my meeting prep assistant. Before each meeting on my calendar, send me a briefing on Slack.

1. Check my Google Calendar every morning at 7 AM and identify all meetings for the day.
2. 15 minutes before each meeting, send me a Slack message with a prep briefing containing:
   - **Meeting Title** and time
   - **Attendees**: List all participants with their names and roles/companies if known
   - **Agenda**: If the calendar event has a description or attached documents, summarize the agenda
   - **Recent Context**: Search my Gmail for the last 5 emails exchanged with the meeting attendees in the past 2 weeks and provide a 2-3 sentence summary of recent discussions
   - **Action Items**: Any outstanding tasks or follow-ups I mentioned in previous emails to these people
   - **Meeting Link**: The Zoom/Meet/Teams link from the calendar event
3. For recurring 1:1 meetings, also include: "Last meeting was on [date]. You discussed: [brief summary from last prep]."
4. If it's a meeting with someone I haven't met before, note that: "First meeting with [name]. They are [role] at [company]."
5. If no agenda is available, suggest 3 potential talking points based on recent email context.
6. For back-to-back meetings, send all briefings together 15 minutes before the first one, clearly separated.`,
    setupSteps: [
      "Connect your Google Calendar for meeting access",
      "Connect Gmail for email context gathering",
      "Install the Slack bot in your workspace and select your DM or preferred channel",
      "Verify by checking tomorrow's meeting prep the next morning",
    ],
    tags: [
      "meetings",
      "calendar",
      "preparation",
      "slack",
      "briefing",
      "context",
    ],
    creator: {
      handle: "lennysan",
      name: "Lenny Rachitsky",
      url: "https://twitter.com/lennysan",
    },
    sourceUrl:
      "https://www.reddit.com/r/productivity/comments/1h3p9k/ai_meeting_prep_assistant_changed_my_workflow/",
    sourcePlatform: "reddit",
    featured: false,
  },
  {
    title: "Daily Digest Newsletter",
    slug: "daily-digest-newsletter",
    description:
      "Get a personalized morning digest on Telegram with top news, tweets, and articles on your topics.",
    longDescription:
      "Start your day informed. The agent crawls your chosen news sources, tech blogs, and social feeds overnight, curates the most relevant stories based on your interests, and delivers a beautifully formatted digest to Telegram every morning.",
    category: "productivity",
    complexity: "beginner",
    type: "cron-job",
    channels: ["telegram"],
    integrations: ["gmail", "browser-automation"],
    personas: ["productivity-enthusiast", "developer", "content-creator"],
    prompt: `You are my personal news curator. Every morning at 7:30 AM, send me a personalized daily digest on Telegram.

1. My interest areas are: AI/ML, startups, web development, productivity tools, and indie hacking. (I will update these over time.)
2. Every night, use browser automation to check these sources:
   - Hacker News front page (top 10 stories)
   - TechCrunch latest articles
   - Product Hunt top 5 products
   - Any RSS feeds or blogs I've added to my watch list
3. Curate the top 8-12 most relevant items based on my interests.
4. Send a Telegram message formatted as my daily digest:
   - A one-line "headline of the day" for the biggest story
   - Each item with: title, source, 2-sentence summary, and a link
   - Group items by topic (e.g., AI, Startups, Tools)
   - End with a "Worth Bookmarking" section for longer reads
5. Also check my Gmail for any newsletters I'm subscribed to (Substack, etc.) that arrived overnight, and include the top 3 most interesting ones in a "From Your Inbox" section with summaries.
6. If I reply with "more on [topic]", send me 5 additional articles on that specific topic.
7. Track which items I click on or ask about to improve relevance over time.
8. Keep the total digest under 800 words — be concise and link-heavy.`,
    setupSteps: [
      "Set up your Telegram bot for digest delivery",
      "Enable browser automation for web source crawling",
      "Optionally connect Gmail for newsletter summarization",
      "Customize your interest areas by sending 'interests: [topic1, topic2, ...]'",
    ],
    tags: [
      "news",
      "digest",
      "curation",
      "morning-routine",
      "newsletter",
      "rss",
    ],
    creator: {
      handle: "swyx",
      name: "Shawn Wang",
      url: "https://twitter.com/swyx",
    },
    sourcePlatform: "other",
    featured: false,
  },
];
