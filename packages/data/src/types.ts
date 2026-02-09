// ─── Core Domain Types ───────────────────────────────────────────────────────

export type Complexity = "beginner" | "intermediate" | "advanced";

export type UseCaseType =
  | "workflow"
  | "skill"
  | "cron-job"
  | "multi-agent"
  | "hardware";

export type SourcePlatform =
  | "twitter"
  | "reddit"
  | "youtube"
  | "github"
  | "hackernews"
  | "devto"
  | "other";

export type SubmissionStatus = "pending" | "approved" | "rejected";

export type DiscoverySource =
  | "manual"
  | "user-submission"
  | "auto-twitter"
  | "auto-reddit"
  | "auto-github"
  | "auto-hackernews"
  | "auto-devto";

export type PersonaTag =
  | "developer"
  | "solo-founder"
  | "family-manager"
  | "productivity-enthusiast"
  | "smart-home-enthusiast"
  | "content-creator";

export type Channel =
  | "whatsapp"
  | "telegram"
  | "discord"
  | "slack"
  | "imessage";

export type IntegrationCategory =
  | "messaging"
  | "productivity"
  | "devtools"
  | "smarthome"
  | "media"
  | "other";

export type CategorySlug =
  | "automation-workflows"
  | "development-devops"
  | "smart-home-iot"
  | "productivity"
  | "family-personal"
  | "voice-communication"
  | "multi-agent-setups"
  | "hardware-edge"
  | "learning-research"
  | "creative-media";

// ─── Content Types ───────────────────────────────────────────────────────────

export interface Creator {
  handle: string;
  name: string;
  url?: string;
  avatar?: string;
}

export interface UseCase {
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  category: CategorySlug;
  complexity: Complexity;
  type: UseCaseType;
  channels: Channel[];
  integrations: string[];
  personas: PersonaTag[];
  prompt: string;
  setupSteps: string[];
  tags: string[];
  creator: Creator;
  sourceUrl?: string;
  sourcePlatform?: SourcePlatform;
  featured?: boolean;
}

export interface CategoryDef {
  name: string;
  slug: CategorySlug;
  description: string;
  icon: string;
  color: string;
  order: number;
}

export interface IntegrationDef {
  name: string;
  slug: string;
  category: IntegrationCategory;
}

export interface PersonaDef {
  id: PersonaTag;
  label: string;
  description: string;
  icon: string;
}

export interface FAQ {
  question: string;
  answer: string;
}
