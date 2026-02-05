import { defineQuery } from "next-sanity";

// ─── Use Case Queries ────────────────────────────────────────────────────────

export const USE_CASES_QUERY = defineQuery(`
  *[_type == "useCase"] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    category->{
      name,
      "slug": slug.current,
      icon,
      color
    },
    complexity,
    type,
    personas,
    sourcePlatform,
    integrations[]->{
      name,
      "slug": slug.current
    },
    creator,
    upvotes
  }
`);

export const FEATURED_USE_CASES_QUERY = defineQuery(`
  *[_type == "useCase" && featured == true] | order(upvotes desc) [0...6] {
    _id,
    title,
    "slug": slug.current,
    description,
    category->{
      name,
      "slug": slug.current,
      icon,
      color
    },
    complexity,
    type,
    personas,
    sourcePlatform,
    integrations[]->{
      name,
      "slug": slug.current
    },
    creator,
    upvotes
  }
`);

export const USE_CASE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "useCase" && slug.current == $slug][0] {
    _id,
    _createdAt,
    title,
    "slug": slug.current,
    description,
    longDescription,
    category->{
      _id,
      name,
      "slug": slug.current,
      icon,
      color,
      description
    },
    complexity,
    type,
    channels,
    integrations[]->{
      _id,
      name,
      "slug": slug.current,
      icon,
      category
    },
    personas,
    creator,
    sourceUrl,
    sourcePlatform,
    media,
    setupSteps,
    upvotes,
    featured,
    discoverySource
  }
`);

export const RELATED_USE_CASES_QUERY = defineQuery(`
  *[_type == "useCase" && category._ref == $categoryId && slug.current != $currentSlug] | order(upvotes desc) [0...4] {
    _id,
    title,
    "slug": slug.current,
    description,
    category->{
      name,
      "slug": slug.current,
      icon,
      color
    },
    complexity,
    sourcePlatform,
    creator,
    upvotes
  }
`);

export const FILTERED_USE_CASES_QUERY = defineQuery(`
  *[_type == "useCase"
    && ($category == "" || category->slug.current == $category)
    && ($complexity == "" || complexity == $complexity)
    && ($persona == "" || $persona in personas)
    && ($search == "" || title match $search || description match $search)
  ] | order(
    select(
      $sort == "popular" => upvotes desc,
      $sort == "newest" => _createdAt desc,
      $sort == "most-upvoted" => upvotes desc
    )
  ) [$offset...$limit] {
    _id,
    title,
    "slug": slug.current,
    description,
    category->{
      name,
      "slug": slug.current,
      icon,
      color
    },
    complexity,
    type,
    personas,
    sourcePlatform,
    integrations[]->{
      name,
      "slug": slug.current
    },
    creator,
    upvotes
  }
`);

// ─── Category Queries ────────────────────────────────────────────────────────

export const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    icon,
    color,
    order,
    "useCaseCount": count(*[_type == "useCase" && references(^._id)])
  }
`);

export const CATEGORY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    description,
    icon,
    color
  }
`);

export const USE_CASES_BY_CATEGORY_QUERY = defineQuery(`
  *[_type == "useCase" && category->slug.current == $categorySlug] | order(upvotes desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    category->{
      name,
      "slug": slug.current,
      icon,
      color
    },
    complexity,
    sourcePlatform,
    integrations[]->{
      name,
      "slug": slug.current
    },
    creator,
    upvotes
  }
`);

// ─── Integration Queries ─────────────────────────────────────────────────────

export const INTEGRATIONS_QUERY = defineQuery(`
  *[_type == "integration"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    icon,
    category
  }
`);

// ─── Stats Query ─────────────────────────────────────────────────────────────

export const STATS_QUERY = defineQuery(`{
  "totalUseCases": count(*[_type == "useCase"]),
  "totalCategories": count(*[_type == "category"]),
  "totalIntegrations": count(*[_type == "integration"])
}`);

// ─── Slug Queries (for static generation) ────────────────────────────────────

export const ALL_USE_CASE_SLUGS_QUERY = defineQuery(`
  *[_type == "useCase" && defined(slug.current)]{
    "slug": slug.current
  }
`);

export const ALL_CATEGORY_SLUGS_QUERY = defineQuery(`
  *[_type == "category" && defined(slug.current)]{
    "slug": slug.current
  }
`);

// ─── FAQ Queries ────────────────────────────────────────────────────────────

export const FAQ_QUERY = defineQuery(`
  *[_type == "faq"] | order(order asc) {
    question,
    answer
  }
`);
