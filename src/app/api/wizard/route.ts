import { NextResponse } from "next/server";
import { getAllUseCases } from "@/lib/data/adapter";

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

    const useCases = getAllUseCases();
    const persona = roleToPersona[role] || "";
    const keywords = description
      .toLowerCase()
      .split(/\s+/)
      .filter((w: string) => w.length > 3);

    const scored = useCases.map((uc) => {
      let score = 0;
      if (persona && uc.personas?.includes(persona as any)) {
        score += 10;
      }
      const text = `${uc.title} ${uc.description}`.toLowerCase();
      for (const kw of keywords) {
        if (text.includes(kw)) {
          score += 3;
        }
      }
      score += Math.min(uc.upvotes / 10, 5);
      return { ...uc, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const results = scored.slice(0, 20).filter((r) => r.score > 0);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Wizard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}
