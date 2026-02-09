import type { IntegrationDef } from "./types";

export const INTEGRATIONS: IntegrationDef[] = [
  // Messaging
  { name: "WhatsApp", slug: "whatsapp", category: "messaging" },
  { name: "Telegram", slug: "telegram", category: "messaging" },
  { name: "Discord", slug: "discord", category: "messaging" },
  { name: "Slack", slug: "slack", category: "messaging" },
  { name: "iMessage", slug: "imessage", category: "messaging" },

  // Productivity
  { name: "Notion", slug: "notion", category: "productivity" },
  { name: "Obsidian", slug: "obsidian", category: "productivity" },
  { name: "Google Calendar", slug: "google-calendar", category: "productivity" },
  { name: "Google Docs", slug: "google-docs", category: "productivity" },
  { name: "Todoist", slug: "todoist", category: "productivity" },
  { name: "Linear", slug: "linear", category: "productivity" },
  { name: "Airtable", slug: "airtable", category: "productivity" },

  // Dev Tools
  { name: "GitHub", slug: "github", category: "devtools" },
  { name: "VS Code", slug: "vscode", category: "devtools" },
  { name: "Docker", slug: "docker", category: "devtools" },
  { name: "Vercel", slug: "vercel", category: "devtools" },
  { name: "Supabase", slug: "supabase", category: "devtools" },
  { name: "Browser Automation", slug: "browser-automation", category: "devtools" },

  // Smart Home
  { name: "Home Assistant", slug: "home-assistant", category: "smarthome" },
  { name: "Apple HomeKit", slug: "apple-homekit", category: "smarthome" },
  { name: "HomePod", slug: "homepod", category: "smarthome" },

  // Media
  { name: "Spotify", slug: "spotify", category: "media" },
  { name: "YouTube", slug: "youtube", category: "media" },
  { name: "Midjourney", slug: "midjourney", category: "media" },

  // Other
  { name: "Gmail", slug: "gmail", category: "other" },
  { name: "Stripe", slug: "stripe", category: "other" },
  { name: "Twilio", slug: "twilio", category: "other" },
  { name: "OpenAI", slug: "openai", category: "other" },
  { name: "Anthropic", slug: "anthropic", category: "other" },
];
