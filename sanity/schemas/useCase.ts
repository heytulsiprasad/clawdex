import { defineField, defineType } from "sanity";
import { RocketIcon } from "@sanity/icons";

export const useCase = defineType({
  name: "useCase",
  title: "Use Case",
  type: "document",
  icon: RocketIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      rows: 3,
      description: "2-line description for cards",
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: "longDescription",
      title: "Full Description",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "complexity",
      title: "Complexity",
      type: "string",
      options: {
        list: [
          { title: "Beginner", value: "beginner" },
          { title: "Intermediate", value: "intermediate" },
          { title: "Advanced", value: "advanced" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Workflow", value: "workflow" },
          { title: "Skill", value: "skill" },
          { title: "Cron Job", value: "cron-job" },
          { title: "Multi-Agent", value: "multi-agent" },
          { title: "Hardware Setup", value: "hardware" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "channels",
      title: "Channels",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "WhatsApp", value: "whatsapp" },
          { title: "Telegram", value: "telegram" },
          { title: "Discord", value: "discord" },
          { title: "Slack", value: "slack" },
          { title: "iMessage", value: "imessage" },
        ],
      },
    }),
    defineField({
      name: "integrations",
      title: "Integrations",
      type: "array",
      of: [{ type: "reference", to: [{ type: "integration" }] }],
    }),
    defineField({
      name: "personas",
      title: "Persona Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Developer", value: "developer" },
          { title: "Solo Founder / Indie Hacker", value: "solo-founder" },
          { title: "Family Manager", value: "family-manager" },
          {
            title: "Productivity Enthusiast",
            value: "productivity-enthusiast",
          },
          {
            title: "Smart Home Enthusiast",
            value: "smart-home-enthusiast",
          },
          { title: "Content Creator", value: "content-creator" },
        ],
      },
    }),
    defineField({
      name: "creator",
      title: "Creator",
      type: "object",
      fields: [
        defineField({
          name: "handle",
          title: "Twitter Handle",
          type: "string",
        }),
        defineField({
          name: "name",
          title: "Display Name",
          type: "string",
        }),
        defineField({
          name: "avatar",
          title: "Avatar URL",
          type: "url",
        }),
      ],
    }),
    defineField({
      name: "sourceUrl",
      title: "Source URL",
      type: "url",
      description: "Link to the original tweet, post, or repo",
    }),
    defineField({
      name: "sourcePlatform",
      title: "Source Platform",
      type: "string",
      options: {
        list: [
          { title: "Twitter/X", value: "twitter" },
          { title: "Reddit", value: "reddit" },
          { title: "YouTube", value: "youtube" },
          { title: "GitHub", value: "github" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({
      name: "media",
      title: "Media",
      type: "array",
      of: [
        { type: "image", options: { hotspot: true } },
        {
          type: "object",
          name: "mediaEmbed",
          title: "Media Embed",
          fields: [
            defineField({ name: "url", title: "URL", type: "url" }),
            defineField({
              name: "mediaType",
              title: "Type",
              type: "string",
              options: {
                list: [
                  { title: "Video", value: "video" },
                  { title: "Embed", value: "embed" },
                ],
              },
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "setupSteps",
      title: "Setup Steps",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "upvotes",
      title: "Upvotes",
      type: "number",
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "aiConfidence",
      title: "AI Confidence Score",
      type: "number",
      description: "0-1 confidence from AI enrichment",
      readOnly: true,
    }),
    defineField({
      name: "discoverySource",
      title: "Discovery Source",
      type: "string",
      options: {
        list: [
          { title: "Manual", value: "manual" },
          { title: "User Submission", value: "user-submission" },
          { title: "Auto (Twitter)", value: "auto-twitter" },
          { title: "Auto (Reddit)", value: "auto-reddit" },
          { title: "Auto (GitHub)", value: "auto-github" },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category.name",
      firstMedia: "media.0",
    },
    prepare({ title, subtitle, firstMedia }) {
      return {
        title,
        subtitle,
        media:
          firstMedia && firstMedia._type === "image"
            ? firstMedia
            : RocketIcon,
      };
    },
  },
});
