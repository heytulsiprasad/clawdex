// Re-export all types from the data package
export type {
  Complexity,
  UseCaseType,
  SourcePlatform,
  SubmissionStatus,
  DiscoverySource,
  PersonaTag,
  Channel,
  IntegrationCategory,
  CategorySlug,
  Creator,
  UseCase,
  CategoryDef,
  IntegrationDef,
  PersonaDef,
  FAQ,
} from "@clawdex/data/types";

// ─── View/Component Types ────────────────────────────────────────────────────

import type {
  Complexity,
  PersonaTag,
  UseCaseType,
  SourcePlatform,
  Creator,
  CategorySlug,
} from "@clawdex/data/types";

export interface UseCaseCard {
  id: string;
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
  type: UseCaseType;
  personas: PersonaTag[];
  sourcePlatform?: SourcePlatform;
  integrations: {
    name: string;
    slug: string;
  }[];
  creator: Creator;
  upvotes: number;
  prompt?: string;
}

export interface FilterState {
  categories: string[];
  complexity: Complexity | null;
  channels: string[];
  integrations: string[];
  personas: PersonaTag[];
  sort: "popular" | "newest" | "most-upvoted";
  search: string;
}

export interface CategoryView {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  useCaseCount: number;
}

export interface StatsView {
  totalUseCases: number;
  totalCategories: number;
  totalIntegrations: number;
}
