import { NextResponse } from "next/server";
import { writeClient } from "@/lib/sanity/client";
import type { SourcePlatform } from "@/types";

interface SubmitBody {
  sourceUrl: string;
  sourcePlatform: SourcePlatform;
  submitterEmail?: string;
  notes?: string;
}

function detectPlatform(url: string): SourcePlatform {
  if (/x\.com|twitter\.com/i.test(url)) return "twitter";
  if (/reddit\.com/i.test(url)) return "reddit";
  if (/youtube\.com|youtu\.be/i.test(url)) return "youtube";
  if (/github\.com/i.test(url)) return "github";
  return "other";
}

function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SubmitBody;

    if (!body.sourceUrl || !isValidUrl(body.sourceUrl)) {
      return NextResponse.json(
        { error: "A valid URL is required" },
        { status: 400 }
      );
    }

    const platform = body.sourcePlatform || detectPlatform(body.sourceUrl);

    const doc = {
      _type: "submission" as const,
      sourceUrl: body.sourceUrl,
      sourcePlatform: platform,
      submitterEmail: body.submitterEmail || undefined,
      rawExtractedData: body.notes ? { text: body.notes } : undefined,
      status: "pending" as const,
      submittedAt: new Date().toISOString(),
    };

    const result = await writeClient.create(doc);

    return NextResponse.json(
      { success: true, id: result._id },
      { status: 201 }
    );
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json(
      { error: "Failed to create submission" },
      { status: 500 }
    );
  }
}
