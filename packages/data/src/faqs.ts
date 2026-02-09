import type { FAQ } from "./types";

export const FAQS: FAQ[] = [
  {
    question: "What is ClawDex?",
    answer:
      "ClawDex is the community-driven, open-source directory of OpenClaw use cases. Browse real workflows, copy agent prompts, and discover what's possible with AI agents.",
  },
  {
    question: "What is OpenClaw?",
    answer:
      "OpenClaw is an open-source AI agent platform that lets you automate tasks via WhatsApp, Telegram, Discord, and other channels. It connects to tools like Gmail, GitHub, Home Assistant, and more.",
  },
  {
    question: "How do I add a use case?",
    answer:
      "Fork the repository, copy the template file at packages/data/src/use-cases/_template.ts, fill in your use case details, and submit a Pull Request. We'll review and merge within 24 hours.",
  },
  {
    question: "What makes a good use case?",
    answer:
      "A good use case has a clear, actionable prompt that another user can copy-paste to their agent. Include specific steps, the integrations needed, and the expected output.",
  },
  {
    question: "Is ClawDex free?",
    answer:
      "Yes! ClawDex is completely free and open source. The directory, prompts, and all use case data are available to everyone.",
  },
  {
    question: "How do I use the prompts?",
    answer:
      "Click the 'Copy Prompt' button on any use case page, then paste it into your OpenClaw agent via WhatsApp, Telegram, Discord, or any supported channel.",
  },
];
