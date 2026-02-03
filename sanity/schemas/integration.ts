import { defineField, defineType } from "sanity";
import { PlugIcon } from "@sanity/icons";

export const integration = defineType({
  name: "integration",
  title: "Integration",
  type: "document",
  icon: PlugIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Messaging", value: "messaging" },
          { title: "Productivity", value: "productivity" },
          { title: "Dev Tools", value: "devtools" },
          { title: "Smart Home", value: "smarthome" },
          { title: "Media", value: "media" },
          { title: "Other", value: "other" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category",
      media: "icon",
    },
  },
});
