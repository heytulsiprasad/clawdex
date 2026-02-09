import { allUseCases } from "@clawdex/data/use-cases";
import { CATEGORIES } from "@clawdex/data/categories";
import { INTEGRATIONS } from "@clawdex/data/integrations";
import { FAQS } from "@clawdex/data/faqs";
import type { UseCase, CategorySlug } from "@clawdex/data/types";
import type { UseCaseCard, CategoryView, StatsView } from "@/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getCategoryInfo(slug: CategorySlug) {
  const cat = CATEGORIES.find((c) => c.slug === slug);
  return cat
    ? { name: cat.name, slug: cat.slug, icon: cat.icon, color: cat.color }
    : { name: "Unknown", slug: slug, icon: "zap", color: "amber" };
}

function getIntegrationInfo(slugs: string[]) {
  return slugs.map((slug) => {
    const integration = INTEGRATIONS.find((i) => i.slug === slug);
    return integration
      ? { name: integration.name, slug: integration.slug }
      : { name: slug, slug };
  });
}

function useCaseToCard(uc: UseCase): UseCaseCard {
  return {
    id: uc.slug,
    title: uc.title,
    slug: uc.slug,
    description: uc.description,
    category: getCategoryInfo(uc.category),
    complexity: uc.complexity,
    type: uc.type,
    personas: uc.personas,
    sourcePlatform: uc.sourcePlatform,
    integrations: getIntegrationInfo(uc.integrations),
    creator: uc.creator,
    upvotes: 0,
    prompt: uc.prompt,
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function getAllUseCases(): UseCaseCard[] {
  return allUseCases.map(useCaseToCard);
}

export function getUseCaseBySlug(slug: string): UseCase | undefined {
  return allUseCases.find((uc) => uc.slug === slug);
}

export function getUseCaseCardBySlug(slug: string): UseCaseCard | undefined {
  const uc = allUseCases.find((u) => u.slug === slug);
  return uc ? useCaseToCard(uc) : undefined;
}

export function getFeaturedUseCases(): UseCaseCard[] {
  return allUseCases
    .filter((uc) => uc.featured)
    .slice(0, 6)
    .map(useCaseToCard);
}

export function getUseCasesByCategory(categorySlug: string): UseCaseCard[] {
  return allUseCases
    .filter((uc) => uc.category === categorySlug)
    .map(useCaseToCard);
}

export function getRelatedUseCases(
  categorySlug: string,
  currentSlug: string,
  limit = 4
): UseCaseCard[] {
  return allUseCases
    .filter((uc) => uc.category === categorySlug && uc.slug !== currentSlug)
    .slice(0, limit)
    .map(useCaseToCard);
}

export function getUseCasesByIds(ids: string[]): UseCaseCard[] {
  return allUseCases
    .filter((uc) => ids.includes(uc.slug))
    .map(useCaseToCard);
}

export function getCategories(): CategoryView[] {
  return CATEGORIES.map((cat) => ({
    id: cat.slug,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    icon: cat.icon,
    color: cat.color,
    order: cat.order,
    useCaseCount: allUseCases.filter((uc) => uc.category === cat.slug).length,
  }));
}

export function getCategoryBySlug(slug: string) {
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return undefined;
  return {
    id: cat.slug,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    icon: cat.icon,
    color: cat.color,
  };
}

export function getAllCategorySlugs(): string[] {
  return CATEGORIES.map((c) => c.slug);
}

export function getAllUseCaseSlugs(): string[] {
  return allUseCases.map((uc) => uc.slug);
}

export function getStats(): StatsView {
  return {
    totalUseCases: allUseCases.length,
    totalCategories: CATEGORIES.length,
    totalIntegrations: INTEGRATIONS.length,
  };
}

export function getFAQs() {
  return FAQS;
}
