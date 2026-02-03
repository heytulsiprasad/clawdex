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
  | "other";

export type SubmissionStatus = "pending" | "approved" | "rejected";

export type DiscoverySource =
  | "manual"
  | "user-submission"
  | "auto-twitter"
  | "auto-reddit"
  | "auto-github";

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

// ─── Sanity Document Types ───────────────────────────────────────────────────

export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

export interface SanitySlug {
  _type: "slug";
  current: string;
}

export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
}

export interface SanityReference {
  _type: "reference";
  _ref: string;
}

// ─── Content Types ───────────────────────────────────────────────────────────

export interface Creator {
  handle: string;
  name: string;
  avatar?: string;
}

export interface MediaItem {
  _type: "image" | "mediaEmbed";
  url?: string;
  mediaType?: "video" | "embed";
  caption?: string;
  asset?: SanityImage["asset"];
}

export interface Category extends SanityDocument {
  _type: "category";
  name: string;
  slug: SanitySlug;
  description: string;
  icon: string;
  color: string;
  order: number;
}

export interface Integration extends SanityDocument {
  _type: "integration";
  name: string;
  slug: SanitySlug;
  icon?: SanityImage;
  category: IntegrationCategory;
}

export interface UseCase extends SanityDocument {
  _type: "useCase";
  title: string;
  slug: SanitySlug;
  description: string;
  longDescription?: unknown[]; // Portable Text blocks
  category: Category;
  complexity: Complexity;
  type: UseCaseType;
  channels: Channel[];
  integrations: Integration[];
  personas: PersonaTag[];
  creator: Creator;
  sourceUrl: string;
  sourcePlatform: SourcePlatform;
  media: MediaItem[];
  setupSteps?: unknown[]; // Portable Text blocks
  upvotes: number;
  featured: boolean;
  aiConfidence?: number;
  discoverySource: DiscoverySource;
}

export interface Submission extends SanityDocument {
  _type: "submission";
  sourceUrl: string;
  sourcePlatform: SourcePlatform;
  rawExtractedData?: Record<string, unknown>;
  aiEnrichedData?: Record<string, unknown>;
  aiConfidence?: number;
  status: SubmissionStatus;
  submitterEmail?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface Subscriber extends SanityDocument {
  _type: "subscriber";
  email: string;
  source: "hero" | "footer" | "popup";
  subscribedAt: string;
}

// ─── View/Component Types ────────────────────────────────────────────────────

export interface UseCaseCard {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: {
    name: string;
    slug: string;
    icon: string;
    color: string;
  };
  complexity: Complexity;
  integrations: {
    name: string;
    slug: string;
  }[];
  creator: Creator;
  upvotes: number;
}

export interface FilterState {
  categories: string[];
  complexity: Complexity | null;
  channels: Channel[];
  integrations: string[];
  personas: PersonaTag[];
  sort: "popular" | "newest" | "most-upvoted";
  search: string;
}

export interface CategoryWithCount extends Category {
  useCaseCount: number;
}
