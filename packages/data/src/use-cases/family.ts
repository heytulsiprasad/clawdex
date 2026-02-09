import type { UseCase } from "../types";

export const familyUseCases: UseCase[] = [
  {
    title: "Weekly Meal Planner",
    slug: "weekly-meal-planner",
    description:
      "Get a personalized weekly meal plan with recipes and a grocery list sent to WhatsApp every Sunday.",
    longDescription:
      "Simplify family meal planning. Every Sunday, the agent generates a full week of meals based on your dietary preferences and household size, provides easy recipes, and compiles a consolidated grocery list you can take straight to the store.",
    category: "family-personal",
    complexity: "beginner",
    type: "cron-job",
    channels: ["whatsapp"],
    integrations: ["browser-automation"],
    personas: ["family-manager"],
    prompt: `You are my family meal planner. Every Sunday at 9 AM, send me a complete weekly meal plan on WhatsApp.

1. Generate a 7-day meal plan (Monday through Sunday) covering dinner for each night. Optionally include lunch ideas for weekends.
2. Consider these household preferences (I will customize these):
   - Family size: 4 (2 adults, 2 kids aged 8 and 11)
   - Dietary restrictions: None, but limit red meat to 2 nights per week
   - Preferences: Kid-friendly meals on school nights (under 30 min prep), more adventurous recipes on weekends
   - Budget: Moderate — avoid expensive specialty ingredients
3. For each meal, provide:
   - Meal name
   - Prep time and cook time
   - Brief ingredient list
   - 3-4 step simple instructions (not a full recipe — just enough to cook from)
4. Use browser automation to find highly-rated recipes from popular cooking sites as inspiration.
5. After the meal plan, compile a consolidated grocery list organized by store section:
   - Produce
   - Meat & Seafood
   - Dairy & Eggs
   - Pantry & Dry Goods
   - Frozen
6. Remove duplicates and combine quantities (e.g., if two recipes need onions, list "Onions x 4" once).
7. If I reply with "swap [day]", suggest 3 alternative meals for that day and let me pick.
8. If I say "repeat last week", resend the previous week's plan.
9. Vary the cuisine throughout the week: don't do Italian three nights in a row.`,
    setupSteps: [
      "Link your WhatsApp number for weekly plan delivery",
      "Enable browser automation for recipe research",
      "Customize your family size, dietary restrictions, and preferences",
      "Send 'plan now' to generate your first meal plan immediately",
    ],
    tags: [
      "meal-planning",
      "recipes",
      "grocery-list",
      "family",
      "cooking",
      "weekly-plan",
    ],
    creator: {
      handle: "minimalistbaker",
      name: "Dana Shultz",
      url: "https://twitter.com/minimalistbaker",
    },
    sourceUrl:
      "https://www.reddit.com/r/mealprep/comments/1j4k2v/using_ai_for_weekly_family_meal_planning/",
    sourcePlatform: "reddit",
    featured: true,
  },
  {
    title: "Kids Activity Coordinator",
    slug: "kids-activity-coordinator",
    description:
      "Track your kids' activities, practices, and playdates with reminders and carpool coordination on WhatsApp.",
    longDescription:
      "Never double-book a soccer practice with a piano lesson again. This agent keeps track of all your kids' schedules, sends reminders before each activity, and helps coordinate carpools with other parents via WhatsApp.",
    category: "family-personal",
    complexity: "beginner",
    type: "workflow",
    channels: ["whatsapp"],
    integrations: ["google-calendar"],
    personas: ["family-manager"],
    prompt: `You are my kids' activity coordinator. Help me manage my children's schedules and send timely reminders on WhatsApp.

1. Sync with my Google Calendar where I tag kids' events with "[Kid Name]" in the title (e.g., "[Emma] Soccer Practice", "[Jake] Piano Lesson").
2. Every Sunday evening, send me the week's overview:
   - Day-by-day breakdown of each kid's activities
   - Any scheduling conflicts flagged in bold
   - Days with no activities marked as "Free evening"
3. Send reminders 1 hour before each activity:
   - Activity name and location
   - What to bring (I'll set these up per recurring activity: e.g., "Soccer: bring cleats, water bottle, shin guards")
   - Pickup time
4. If two activities overlap, alert me immediately and suggest solutions: "Emma's soccer (4-5:30 PM) overlaps with Jake's piano (4:30-5:30 PM). Options: A) Ask [carpool parent] for Emma's soccer ride, B) Reschedule Jake's lesson."
5. When I message "add carpool: [parent name] [phone] [activity]", save that parent as a carpool contact for that activity.
6. When I message "need a ride for [kid] on [day]", draft a WhatsApp message to the relevant carpool parents asking if they can take my kid.
7. Track attendance: if I say "[kid] is skipping [activity] on [date]", note it and don't send the reminder.
8. Monthly, send a summary of activities attended vs. skipped for each kid.`,
    setupSteps: [
      "Connect Google Calendar with your kids' activities tagged by name",
      "Link your WhatsApp for reminders and coordination",
      "Add recurring activities with what-to-bring lists",
      "Add carpool parent contacts for each activity",
    ],
    tags: [
      "kids",
      "activities",
      "scheduling",
      "carpool",
      "family",
      "reminders",
      "parenting",
    ],
    creator: {
      handle: "eloiseames",
      name: "Eloise Ames",
      url: "https://twitter.com/eloiseames",
    },
    sourcePlatform: "other",
    featured: false,
  },
];
