import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { collection, addDoc } from "firebase/firestore";
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

    const docData = {
      sourceUrl: body.sourceUrl,
      sourcePlatform: platform,
      submitterEmail: body.submitterEmail || null,
      notes: body.notes || null,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "submissions"), docData);

    return NextResponse.json(
      { success: true, id: docRef.id },
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
