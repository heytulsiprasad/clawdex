import type { CategoryDef } from "./types";

export const CATEGORIES: CategoryDef[] = [
  {
    name: "Automation & Workflows",
    slug: "automation-workflows",
    description:
      "Automate repetitive tasks like email triage, flight check-ins, expense tracking, and more.",
    icon: "zap",
    color: "amber",
    order: 1,
  },
  {
    name: "Development & DevOps",
    slug: "development-devops",
    description:
      "Streamline your dev workflow with PR reviews, deployments, GitHub automation, and skill building.",
    icon: "code",
    color: "blue",
    order: 2,
  },
  {
    name: "Smart Home & IoT",
    slug: "smart-home-iot",
    description:
      "Control your smart home with Home Assistant, HomePods, air purifiers, and 3D printers.",
    icon: "home",
    color: "green",
    order: 3,
  },
  {
    name: "Productivity",
    slug: "productivity",
    description:
      "Boost your output with research tools, document synthesis, todo management, and calendar automation.",
    icon: "target",
    color: "purple",
    order: 4,
  },
  {
    name: "Family & Personal",
    slug: "family-personal",
    description:
      "Manage household life with meal planning, household projects, and kids coordination.",
    icon: "users",
    color: "pink",
    order: 5,
  },
  {
    name: "Voice & Communication",
    slug: "voice-communication",
    description:
      "Voice assistants, phone calls, transcription, and communication automation.",
    icon: "phone",
    color: "cyan",
    order: 6,
  },
  {
    name: "Multi-Agent Setups",
    slug: "multi-agent-setups",
    description:
      "Orchestrate teams of AI agents with shared memory, task delegation, and coordination.",
    icon: "network",
    color: "orange",
    order: 7,
  },
  {
    name: "Hardware & Edge",
    slug: "hardware-edge",
    description:
      "Run on Raspberry Pi, Mac Mini servers, and other dedicated hardware setups.",
    icon: "cpu",
    color: "slate",
    order: 8,
  },
  {
    name: "Learning & Research",
    slug: "learning-research",
    description:
      "Language learning, SEO analysis, content curation, and deep research workflows.",
    icon: "book-open",
    color: "indigo",
    order: 9,
  },
  {
    name: "Creative & Media",
    slug: "creative-media",
    description:
      "Image generation, video editing, music extraction, and creative workflows.",
    icon: "palette",
    color: "rose",
    order: 10,
  },
];
