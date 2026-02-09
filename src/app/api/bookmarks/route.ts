import { NextResponse } from "next/server";
import { getUseCasesByIds } from "@/lib/data/adapter";

export async function POST(request: Request) {
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ results: [] });
    }

    const results = getUseCasesByIds(ids);
    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}
