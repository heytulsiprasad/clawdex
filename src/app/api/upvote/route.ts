import { NextResponse } from "next/server";
import { writeClient } from "@/lib/sanity/client";

// ─── In-memory rate limiter ─────────────────────────────────────────────────
// Resets on cold start — acceptable soft limit for serverless.
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_VOTES = 20;

const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(fingerprint: string): boolean {
  const now = Date.now();
  const entry = hits.get(fingerprint);

  if (!entry || now > entry.resetAt) {
    hits.set(fingerprint, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_VOTES;
}

// ─── POST /api/upvote ───────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const { id } = (await request.json()) as { id?: string };

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid document id" },
        { status: 400 }
      );
    }

    // Rate limit by IP
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many votes — try again later" },
        { status: 429 }
      );
    }

    // Atomic increment in Sanity
    const result = await writeClient
      .patch(id)
      .inc({ upvotes: 1 })
      .commit();

    return NextResponse.json(
      { success: true, upvotes: result.upvotes as number },
      { status: 200 }
    );
  } catch (err) {
    console.error("Upvote error:", err);
    return NextResponse.json(
      { error: "Failed to record upvote" },
      { status: 500 }
    );
  }
}
