import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc, increment } from "firebase/firestore";

const WINDOW_MS = 15 * 60 * 1000;
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

export async function POST(request: Request) {
  try {
    const { id } = (await request.json()) as { id?: string };

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid use case id" },
        { status: 400 }
      );
    }

    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many votes — try again later" },
        { status: 429 }
      );
    }

    const ref = doc(db, "upvotes", id);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      await setDoc(ref, { count: increment(1) }, { merge: true });
    } else {
      await setDoc(ref, { count: 1 });
    }

    const updated = await getDoc(ref);
    const upvotes = updated.data()?.count ?? 0;

    return NextResponse.json(
      { success: true, upvotes },
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
