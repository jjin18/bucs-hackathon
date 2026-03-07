// app/api/chat/route.ts
// Receives { messages } from the frontend, calls Claude with the system prompt,
// parses the JSON response, returns { answer, artifact_ids }.

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "@/lib/system-prompt";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey?.trim()) {
      console.error("Chat API: ANTHROPIC_API_KEY is not set");
      return NextResponse.json(
        {
          answer:
            "Chat isn't configured yet. Add your Anthropic API key to .env.local (see .env.example) and restart the dev server.",
          artifact_ids: [],
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    if (messages.length === 0) {
      return NextResponse.json(
        { answer: "No messages in request.", artifact_ids: [] },
        { status: 400 }
      );
    }

    const systemPrompt = await buildSystemPrompt();

    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const raw = response.content[0]?.type === "text" ? response.content[0].text : "";

    let parsed: { answer: string; artifact_ids: string[] };
    try {
      const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { answer: raw, artifact_ids: [] };
    }

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    console.error("Chat API error:", error);

    if (error && typeof error === "object" && "status" in error && (error as { status: number }).status === 401) {
      return NextResponse.json(
        {
          answer: "Invalid API key. Check ANTHROPIC_API_KEY in .env.local.",
          artifact_ids: [],
        },
        { status: 500 }
      );
    }
    if (message && message.toLowerCase().includes("authentication")) {
      return NextResponse.json(
        {
          answer: "Invalid API key. Check ANTHROPIC_API_KEY in .env.local.",
          artifact_ids: [],
        },
        { status: 500 }
      );
    }

    const devHint = process.env.NODE_ENV === "development" && message
      ? ` ${message}`
      : "";

    return NextResponse.json(
      {
        answer: `Something went wrong. Please try again.${devHint}`,
        artifact_ids: [],
      },
      { status: 500 }
    );
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  const o = error as Record<string, unknown>;
  if (o?.message && typeof o.message === "string") return o.message;
  if (o?.error && typeof o.error === "object" && o.error !== null) {
    const inner = (o.error as Record<string, unknown>).message;
    if (typeof inner === "string") return inner;
  }
  const s = String(error);
  if (s !== "[object Object]") return s;
  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown error";
  }
}
