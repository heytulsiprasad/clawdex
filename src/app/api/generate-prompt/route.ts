import { NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_MODEL = "claude-sonnet-4-5-20250929";

const CATEGORY_OPTIONS = [
  "automation-workflows",
  "development-devops",
  "smart-home-iot",
  "productivity",
  "family-personal",
  "voice-communication",
  "multi-agent-setups",
  "hardware-edge",
  "learning-research",
  "creative-media",
] as const;

const SYSTEM_PROMPT = `You are a helpful assistant that converts user descriptions of OpenClaw AI agent use cases into structured, high-quality data for a community directory called ClawDex.

Given a user's description (and optionally a source URL), generate:
1. A concise title (max 80 chars)
2. A short description (max 200 chars) for card display
3. A copyable prompt that another user could paste directly to their OpenClaw agent to replicate this use case. The prompt should be clear, actionable instructions in natural language.
4. Category slug from: ${CATEGORY_OPTIONS.join(", ")}
5. Complexity: beginner, intermediate, or advanced
6. Type: workflow, skill, cron-job, multi-agent, or hardware
7. Relevant channels: whatsapp, telegram, discord, slack, imessage (array, can be empty)
8. Integration slugs (e.g. gmail, github, home-assistant, slack, notion, google-calendar)
9. Tags for search (3-6 freeform strings)
10. Setup steps (3-5 short, actionable strings)

Respond ONLY with valid JSON matching this exact shape:
{
  "title": "string",
  "description": "string",
  "prompt": "string",
  "category": "string",
  "complexity": "string",
  "type": "string",
  "channels": ["string"],
  "integrations": ["string"],
  "tags": ["string"],
  "setupSteps": ["string"]
}`;

export async function POST(request: Request) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI generation is not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { description, sourceUrl } = body;

    if (!description || typeof description !== "string" || description.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide a description of at least 10 characters" },
        { status: 400 }
      );
    }

    let userMessage = `Use case description: ${description.trim()}`;
    if (sourceUrl && typeof sourceUrl === "string") {
      userMessage += `\n\nSource URL: ${sourceUrl.trim()}`;
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", response.status, errorText);
      return NextResponse.json(
        { error: "AI generation failed. Please try again." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.content?.[0]?.text;

    if (!content) {
      return NextResponse.json(
        { error: "Empty response from AI" },
        { status: 502 }
      );
    }

    // Extract JSON from the response (handle markdown code blocks)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Could not parse AI response" },
        { status: 502 }
      );
    }

    const generated = JSON.parse(jsonMatch[0]);

    // Validate required fields exist
    const required = ["title", "description", "prompt", "category", "complexity", "type"];
    for (const field of required) {
      if (!generated[field]) {
        return NextResponse.json(
          { error: `AI response missing required field: ${field}` },
          { status: 502 }
        );
      }
    }

    // Ensure arrays default to empty
    generated.channels = generated.channels || [];
    generated.integrations = generated.integrations || [];
    generated.tags = generated.tags || [];
    generated.setupSteps = generated.setupSteps || [];

    return NextResponse.json(generated);
  } catch (error) {
    console.error("Generate prompt error:", error);
    return NextResponse.json(
      { error: "Failed to generate prompt" },
      { status: 500 }
    );
  }
}
