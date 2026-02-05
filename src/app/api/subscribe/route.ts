import { NextResponse } from "next/server";
import { writeClient, client } from "@/lib/sanity/client";

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

    // Check for duplicate
    const existing = await client.fetch<number>(
      `count(*[_type == "subscriber" && email == $email])`,
      { email: body.email }
    );

    if (existing > 0) {
      return NextResponse.json(
        { success: true, message: "Already subscribed" },
        { status: 200 }
      );
    }

    await writeClient.create({
      _type: "subscriber" as const,
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
