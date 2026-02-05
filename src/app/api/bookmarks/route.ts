import { NextResponse } from "next/server";
import { client } from "@/lib/sanity/client";

export async function POST(request: Request) {
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ results: [] });
    }

    const results = await client.fetch(
      `*[_type == "useCase" && _id in $ids] {
        _id,
        title,
        "slug": slug.current,
        description,
        category->{ name, "slug": slug.current, icon, color },
        complexity,
        type,
        personas,
        sourcePlatform,
        integrations[]->{ name, "slug": slug.current },
        creator,
        upvotes
      } | order(_createdAt desc)`,
      { ids }
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}
