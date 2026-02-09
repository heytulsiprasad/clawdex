import type { UseCase } from "../types";

export const automationUseCases: UseCase[] = [
  {
    title: "Flight Check-In Automation",
    slug: "flight-checkin-automation",
    description:
      "Automatically check in to flights 24 hours before departure and send boarding passes to WhatsApp.",
    longDescription:
      "Never miss an airline check-in window again. This workflow monitors your upcoming flights via email confirmations, triggers a browser automation to complete check-in exactly when the window opens, and delivers your boarding pass directly to WhatsApp.",
    category: "automation-workflows",
    complexity: "intermediate",
    type: "workflow",
    channels: ["whatsapp"],
    integrations: ["gmail", "browser-automation"],
    personas: ["productivity-enthusiast", "solo-founder"],
    prompt: `You are my flight check-in assistant. Your job is to make sure I never miss an airline check-in window.

1. Monitor my Gmail inbox for flight confirmation and itinerary emails from airlines (look for subject lines containing "booking confirmation", "itinerary", "e-ticket").
2. Extract the flight date, time, airline, confirmation code, and passenger name from those emails.
3. Calculate exactly 24 hours before each flight's departure time and set a reminder.
4. When the check-in window opens, use browser automation to navigate to the airline's check-in page, enter my confirmation code and last name, and complete the check-in process.
5. If seat selection is available, choose a window seat when possible. Otherwise accept the assigned seat.
6. Download or screenshot the boarding pass.
7. Send me the boarding pass image on WhatsApp along with a summary: flight number, departure time, gate (if available), and seat assignment.
8. If check-in fails for any reason, immediately notify me on WhatsApp with the error so I can do it manually.`,
    setupSteps: [
      "Connect your Gmail account to allow reading flight confirmation emails",
      "Enable browser automation integration for airline check-in pages",
      "Link your WhatsApp number for boarding pass delivery",
      "Forward a test flight confirmation email to verify extraction works",
    ],
    tags: [
      "flights",
      "travel",
      "check-in",
      "automation",
      "boarding-pass",
      "airlines",
    ],
    creator: {
      handle: "marcuswei_",
      name: "Marcus Wei",
      url: "https://twitter.com/marcuswei_",
    },
    sourcePlatform: "other",
    featured: true,
  },
  {
    title: "Email Triage and Summarization",
    slug: "email-triage-summarization",
    description:
      "Categorize incoming emails by urgency and send a prioritized daily summary to Telegram.",
    longDescription:
      "Tame your inbox with an agent that reads new emails, classifies them by urgency and topic, and sends you a concise Telegram digest so you only open your email client when something truly needs attention.",
    category: "automation-workflows",
    complexity: "beginner",
    type: "cron-job",
    channels: ["telegram"],
    integrations: ["gmail"],
    personas: ["productivity-enthusiast", "solo-founder"],
    prompt: `You are my email triage assistant. Every morning at 8:00 AM and every evening at 6:00 PM, process my unread Gmail messages and send me a summary on Telegram.

1. Fetch all unread emails from my Gmail inbox since the last check.
2. For each email, classify it into one of these categories:
   - URGENT: Requires immediate action (client requests, payment issues, meeting changes within 24h)
   - ACTION NEEDED: Needs a response but not time-sensitive (project updates, questions from colleagues)
   - FYI: Informational only (newsletters, notifications, CC'd threads)
   - SPAM/LOW: Marketing, promotions, automated notifications I probably don't need
3. For each email, extract: sender name, subject, and a 1-2 sentence summary of the content.
4. Send me a Telegram message formatted as a prioritized list grouped by category, with URGENT items at the top.
5. Include a count at the top: "You have X unread emails: Y urgent, Z action needed."
6. For URGENT emails, include a direct link to open that email in Gmail.
7. Never mark emails as read — I want to decide that myself.`,
    setupSteps: [
      "Connect your Gmail account with read-only access",
      "Set up your Telegram bot and link it to your account",
      "Configure your preferred summary schedule (default: 8 AM and 6 PM)",
    ],
    tags: ["email", "triage", "summary", "inbox-zero", "daily-digest"],
    creator: {
      handle: "priya_builds",
      name: "Priya Sharma",
      url: "https://twitter.com/priya_builds",
    },
    sourcePlatform: "other",
    featured: true,
  },
  {
    title: "Expense Tracking from Receipts",
    slug: "expense-tracking-receipts",
    description:
      "Snap a photo of any receipt on WhatsApp and get it logged, categorized, and totaled automatically.",
    longDescription:
      "Simply send a photo of a receipt to your WhatsApp agent and it will extract the merchant, amount, date, and line items, categorize the expense, and keep a running monthly total. Export-ready for tax season.",
    category: "automation-workflows",
    complexity: "beginner",
    type: "skill",
    channels: ["whatsapp"],
    integrations: ["gmail"],
    personas: ["solo-founder", "productivity-enthusiast"],
    prompt: `You are my personal expense tracker. I will send you photos of receipts via WhatsApp and you will process them.

1. When I send a receipt photo, use OCR to extract: merchant/store name, date of purchase, total amount, currency, and individual line items if legible.
2. Categorize the expense into one of these buckets: Food & Dining, Transportation, Office Supplies, Software & Subscriptions, Entertainment, Healthcare, Utilities, Travel, or Other.
3. If the category is unclear, ask me to confirm before logging it.
4. Respond with a clean summary: "Logged: $XX.XX at [Merchant] on [Date] under [Category]."
5. Keep a running monthly total. When I message "monthly summary", reply with a breakdown of spending by category for the current month plus the grand total.
6. When I message "export", compile all logged expenses for the current month into a CSV format and send it to my Gmail as an attachment.
7. If the receipt image is blurry or unreadable, tell me which fields you couldn't extract and ask me to re-send or fill in manually.`,
    setupSteps: [
      "Link your WhatsApp number to start sending receipt photos",
      "Connect Gmail for monthly CSV export delivery",
      "Send your first receipt photo to test extraction",
    ],
    tags: [
      "expenses",
      "receipts",
      "ocr",
      "budgeting",
      "finance",
      "tracking",
    ],
    creator: {
      handle: "dannyvega_io",
      name: "Danny Vega",
      url: "https://twitter.com/dannyvega_io",
    },
    sourceUrl:
      "https://www.reddit.com/r/selfhosted/comments/1f8k2x/receipt_scanning_with_ai_agents/",
    sourcePlatform: "reddit",
    featured: false,
  },
];
