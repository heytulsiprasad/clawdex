import { NextResponse } from "next/server";
import { client } from "@/lib/sanity/client";

// Role to persona mapping
const roleToPersona: Record<string, string> = {
  "business-owner": "solo-founder",
  "marketing-sales": "solo-founder",
  "developer": "developer",
  "home-enthusiast": "smart-home-enthusiast",
  "content-creator": "content-creator",
  "productivity-nerd": "productivity-enthusiast",
};

export async function POST(request: Request) {
  try {
    const { role, description } = await request.json();

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    // Fetch all use cases with necessary fields
    const useCases = await client.fetch(`
      *[_type == "useCase"] | order(upvotes desc) {
        _id,
        title,
        "slug": slug.current,
        description,
        complexity,
        "category": {
          "name": category->name,
          "slug": category->slug.current,
          "icon": category->icon,
          "color": category->color
        },
        personas,
        upvotes
      }
    `);

    // Simple matching logic:
    // 1. Filter by persona based on role
    // 2. Score by keyword overlap with description
    // 3. Return top 5

    const persona = roleToPersona[role] || "";
    const keywords = description
      .toLowerCase()
      .split(/\s+/)
      .filter((w: string) => w.length > 3);

    let scored = useCases.map((uc: any) => {
      let score = 0;

      // Persona match bonus
      if (persona && uc.personas?.includes(persona)) {
        score += 10;
      }

      // Keyword matching against title + description
      const text = `${uc.title} ${uc.description}`.toLowerCase();
      for (const kw of keywords) {
        if (text.includes(kw)) {
          score += 3;
        }
      }

      // Popularity bonus (small)
      score += Math.min(uc.upvotes / 10, 5);

      return { ...uc, score };
    });

    // Sort by score and return top 20 with score > 0
    scored.sort((a: any, b: any) => b.score - a.score);
    const results = scored.slice(0, 20).filter((r: any) => r.score > 0);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Wizard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}
