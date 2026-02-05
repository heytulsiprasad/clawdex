import { defineField, defineType } from "sanity";
import { EditIcon } from "@sanity/icons";

export const submission = defineType({
  name: "submission",
  title: "Submission",
  type: "document",
  icon: EditIcon,
  fields: [
    defineField({
      name: "sourceUrl",
      title: "Source URL",
      type: "url",
      validation: (rule) => rule.required(),
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
          { title: "Hacker News", value: "hackernews" },
          { title: "Dev.to", value: "devto" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({
      name: "rawExtractedData",
      title: "Raw Extracted Data",
      type: "object",
      fields: [
        defineField({ name: "text", type: "text", title: "Text Content" }),
        defineField({ name: "author", type: "string", title: "Author" }),
        defineField({ name: "mediaUrls", type: "array", title: "Media URLs", of: [{ type: "url" }] }),
        defineField({ name: "date", type: "string", title: "Date" }),
        defineField({ name: "engagement", type: "number", title: "Engagement" }),
      ],
    }),
    defineField({
      name: "aiEnrichedData",
      title: "AI Enriched Data",
      type: "object",
      fields: [
        defineField({ name: "title", type: "string", title: "Title" }),
        defineField({ name: "description", type: "text", title: "Description" }),
        defineField({ name: "category", type: "string", title: "Category Slug" }),
        defineField({ name: "complexity", type: "string", title: "Complexity" }),
        defineField({ name: "integrations", type: "array", title: "Integrations", of: [{ type: "string" }] }),
        defineField({ name: "personas", type: "array", title: "Personas", of: [{ type: "string" }] }),
        defineField({ name: "slug", type: "string", title: "Slug" }),
        defineField({ name: "metaDescription", type: "string", title: "Meta Description" }),
        defineField({ name: "isRelevant", type: "boolean", title: "Is Relevant" }),
      ],
    }),
    defineField({
      name: "aiConfidence",
      title: "AI Confidence Score",
      type: "number",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Approved", value: "approved" },
          { title: "Rejected", value: "rejected" },
        ],
      },
      initialValue: "pending",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "submitterEmail",
      title: "Submitter Email",
      type: "string",
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
    }),
    defineField({
      name: "reviewedAt",
      title: "Reviewed At",
      type: "datetime",
    }),
  ],
  preview: {
    select: {
      title: "aiEnrichedData.title",
      subtitle: "status",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Untitled Submission",
        subtitle: `Status: ${subtitle}`,
      };
    },
  },
});
