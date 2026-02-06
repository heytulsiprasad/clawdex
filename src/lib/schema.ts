const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.clawdex.io";
const SITE_NAME = "ClawDex";

// ─── WebSite + SearchAction (root layout) ─────────────────────────────────

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Discover how people are using OpenClaw. Filter by category, complexity, and integrations. 85+ real use cases from the community.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/browse?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ─── Organization (root layout) ───────────────────────────────────────────

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
  };
}

// ─── FAQPage (homepage) ──────────────────────────────────────────────────

export function faqPageSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ─── Article (use case detail pages) ──────────────────────────────────────

interface ArticleSchemaInput {
  title: string;
  slug: string;
  description: string;
  createdAt: string;
  creator: { name: string; handle: string };
  categoryName: string;
  imageUrl?: string;
}

export function articleSchema(input: ArticleSchemaInput) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: `${SITE_URL}/use-case/${input.slug}`,
    datePublished: input.createdAt,
    author: {
      "@type": "Person",
      name: input.creator.name,
      url: `https://twitter.com/${input.creator.handle}`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.png`,
      },
    },
    articleSection: input.categoryName,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/use-case/${input.slug}`,
    },
  };

  if (input.imageUrl) {
    schema.image = input.imageUrl;
  }

  return schema;
}

// ─── BreadcrumbList (use case detail pages) ───────────────────────────────

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ─── CollectionPage (browse page) ─────────────────────────────────────────

export function collectionPageSchema(totalItems: number) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Browse Use Cases",
    description:
      "Browse and filter the full directory of OpenClaw use cases by category, complexity, and integrations.",
    url: `${SITE_URL}/browse`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    numberOfItems: totalItems,
  };
}
