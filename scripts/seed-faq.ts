/**
 * Seed script — pushes FAQ items into Sanity.
 *
 * Usage:  pnpm tsx --env-file=.env.local scripts/seed-faq.ts
 */

import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN");
  console.error(
    "Make sure .env.local is loaded. Run with: pnpm tsx --env-file=.env.local scripts/seed-faq.ts"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-02-03",
  useCdn: false,
  token,
});

const FAQS = [
  {
    question: "What is ClawDex?",
    answer:
      "ClawDex is a community-driven directory of real-world OpenClaw use cases. It helps you discover how people are using OpenClaw for everything from development workflows to smart home automation, organized by category, complexity, and integrations.",
    order: 1,
  },
  {
    question: "What is OpenClaw?",
    answer:
      "OpenClaw is an open-source AI agent framework that enables people to build automated workflows, multi-agent teams, and tool integrations. It powers a wide range of use cases from coding assistants to household management.",
    order: 2,
  },
  {
    question: "How are use cases added to ClawDex?",
    answer:
      "Use cases are sourced from the community via multiple channels — Twitter/X, Reddit, YouTube, and GitHub. Anyone can submit a use case through our submit page. Submissions are reviewed and enriched with metadata before being published.",
    order: 3,
  },
  {
    question: "Can I submit my own use case?",
    answer:
      "Yes! Visit the Submit page and share a link to your use case. We accept posts from Twitter/X, Reddit threads, YouTube videos, GitHub repos, and blog posts. Our team will review and publish it with full credit to you.",
    order: 4,
  },
  {
    question: "How do I find use cases relevant to me?",
    answer:
      "You can browse by category (like Development, Smart Home, or Productivity), filter by complexity level (Beginner, Intermediate, Advanced), search by keyword, or select a persona that matches your role — such as Developer, Solo Founder, or Content Creator.",
    order: 5,
  },
  {
    question: "Is ClawDex free to use?",
    answer:
      "Yes, ClawDex is completely free. It is a community resource built to help people discover and share what is possible with OpenClaw.",
    order: 6,
  },
  {
    question: "How can I stay updated on new use cases?",
    answer:
      "Subscribe to our weekly newsletter to get the best new OpenClaw use cases delivered to your inbox. You can sign up via the email form on the homepage.",
    order: 7,
  },
  {
    question: "What does the upvote system do?",
    answer:
      "Upvotes help surface the most useful and interesting use cases. The community highlights section on the homepage features the most upvoted entries. Upvoting is a lightweight way to signal that a use case is valuable.",
    order: 8,
  },
];

async function seedFaq() {
  console.log(`Seeding FAQ into project "${projectId}" / dataset "${dataset}"...\n`);

  const tx = client.transaction();

  for (const faq of FAQS) {
    tx.createOrReplace({
      _id: `faq-${faq.order}`,
      _type: "faq",
      question: faq.question,
      answer: faq.answer,
      order: faq.order,
    });
  }

  const result = await tx.commit();
  console.log(`  ✓ ${FAQS.length} FAQ items seeded (tx: ${result.transactionId})`);
}

seedFaq().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
