import type { PersonaDef } from "./types";

export const PERSONAS: PersonaDef[] = [
  {
    id: "developer",
    label: "Developer",
    description: "Coding workflows, CI/CD, and dev tool integrations",
    icon: "code-2",
  },
  {
    id: "solo-founder",
    label: "Solo Founder",
    description: "Business automation, multi-agent teams, and scaling ops",
    icon: "rocket",
  },
  {
    id: "family-manager",
    label: "Family Manager",
    description: "Meal planning, household coordination, and kids' activities",
    icon: "heart",
  },
  {
    id: "productivity-enthusiast",
    label: "Productivity Enthusiast",
    description: "Research, note-taking, calendar, and task automation",
    icon: "sparkles",
  },
  {
    id: "smart-home-enthusiast",
    label: "Smart Home Enthusiast",
    description: "Home Assistant, IoT devices, and voice control",
    icon: "home",
  },
  {
    id: "content-creator",
    label: "Content Creator",
    description: "Research pipelines, editing workflows, and publishing",
    icon: "pen-tool",
  },
];
