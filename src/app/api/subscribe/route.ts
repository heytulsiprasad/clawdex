import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface SubscribeBody {
  email: string;
  source: "hero" | "footer" | "popup";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SubscribeBody;

    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json(
        { error: "A valid email is required" },
        { status: 400 }
      );
    }

    const source = body.source || "hero";
    const emailKey = body.email.toLowerCase().replace(/[.#$/[\]]/g, "_");
    const ref = doc(db, "subscribers", emailKey);
    const existing = await getDoc(ref);

    if (existing.exists()) {
      return NextResponse.json(
        { success: true, message: "Already subscribed" },
        { status: 200 }
      );
    }

    await setDoc(ref, {
      email: body.email,
      source,
      subscribedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, message: "Subscribed" },
      { status: 201 }
    );
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
