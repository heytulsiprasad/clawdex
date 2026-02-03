import { defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

export const subscriber = defineType({
  name: "subscriber",
  title: "Subscriber",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "source",
      title: "Signup Source",
      type: "string",
      options: {
        list: [
          { title: "Hero Section", value: "hero" },
          { title: "Footer", value: "footer" },
          { title: "Popup", value: "popup" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subscribedAt",
      title: "Subscribed At",
      type: "datetime",
    }),
  ],
  preview: {
    select: {
      title: "email",
      subtitle: "source",
    },
  },
});
