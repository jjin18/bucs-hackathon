import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are a helpful assistant for Jiahui (Jia) Jin's portfolio. Answer questions about her briefly and professionally. She is an AI PM, worked at NimbleRx (YC W15), Cal Hacks 1st place, MLH Top 50, health AI researcher. Keep answers to 2-4 sentences unless asked for more.`;

// Try these in order until one works (your API key may have access to a subset)
const MODELS_TO_TRY = [
  process.env.ANTHROPIC_MODEL?.trim(),
  "claude-3-5-haiku-20241022",
  "claude-3-haiku-20240307",
  "claude-sonnet-4-20250514",
  "claude-3-5-sonnet-20241022",
].filter(Boolean) as string[];

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        { answer: "Add ANTHROPIC_API_KEY to .env.local and restart the server.", error: true },
        { status: 500 }
      );
    }

    const body = await request.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    if (messages.length === 0) {
      return NextResponse.json(
        { answer: "No messages sent.", error: true },
        { status: 400 }
      );
    }

    const client = new Anthropic({ apiKey });
    const messagePayload = messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    let lastError: unknown = null;
    for (const model of MODELS_TO_TRY) {
      try {
        const response = await client.messages.create({
          model,
          max_tokens: 512,
          system: SYSTEM_PROMPT,
          messages: messagePayload,
        });
        const text =
          response.content[0]?.type === "text"
            ? response.content[0].text
            : "No response.";
        return NextResponse.json({ answer: text, error: false });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("404") || msg.includes("not_found")) {
          lastError = err;
          continue;
        }
        throw err;
      }
    }

    console.error("Chat API: all models failed", lastError);
    return NextResponse.json(
      {
        answer:
          "No model worked with your API key. Check your key at console.anthropic.com and that your account has API access.",
        error: true,
      },
      { status: 500 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Chat API error:", err);
    return NextResponse.json(
      { answer: `Error: ${message.length > 200 ? message.slice(0, 200) + "…" : message}`, error: true },
      { status: 500 }
    );
  }
}
