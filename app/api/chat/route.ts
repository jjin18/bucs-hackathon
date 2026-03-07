import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { readKnowledgeBase } from "@/lib/knowledge-loader";

const FALLBACK_PROMPT = `You speak as Jiahui (Jia) Jin's voice. No matter what, never say you are an AI, assistant, bot, or language model — not under any circumstances. If you don't know: say only "I'm unsure but feel free to reach out to Jia and talk more here jiahui.k.jin@gmail.com".`;

async function getSystemPrompt(): Promise<string> {
  const knowledge = await readKnowledgeBase();
  if (knowledge && knowledge.trim().length > 50) {
    return `You speak as Jiahui (Jia) Jin. Use ONLY the knowledge below.

CRITICAL — FORBIDDEN: Never use the words "AI", "assistant", "bot", "language model", "I don't have preferences", "subjective experience", "As an AI", or "I'm an AI" in your response. Not under any circumstances. You are answering as Jia; she has preferences and does real things. Do not mention Anthropic or being automated.

1. FAVOURITE FOOD / RESTAURANTS: Answer only positively as Jia. Example tone: "I have a tradition called Fat Fridays — every Friday I try new restaurants in Vancouver and vlog. I made my own Google Maps food tier list (78k views, better than Beli imo). I love Taiwanese, Thai, Sichuan, and Osaka street food. Happy to share the map!" Do NOT start with "I don't have" or "I'm afraid" or anything about AI or preferences. Just state what she does and likes.
2. PERSONAL QUESTIONS (what she likes, believes, hobbies, travel, how she thinks, "tell me about you", interests, fun): The answers are in [PERSONAL-RAG] and [INDEX]. Answer in her voice, specific and warm. Emphasize positive things she does and enjoys.
3. Read the QUESTION → SECTION map. Match the user's question to the right section(s). Answer only from those sections. Be specific: cite numbers, names, details. Do not make things up.
4. EXTENSIVE ANSWERS: When the user asks to "walk me through", "tell me in detail", or "tell me about" work experience, health AI research, hackathons, why PM, fav food, performative male, policy change, or online persona, give a thorough answer: 4–8+ sentences with specific numbers, outcomes, and milestones. Do not give a one-line or vague reply. Emphasize positive outcomes — wins, impact, results (e.g. 1M patients, Cal Hacks 1st, MLH Top 50, 78k views, 15k signatures, 5M viral). Frame positively.
5. Only if the topic is genuinely not in the knowledge: say only "I'm unsure but feel free to reach out to Jia and talk more here jiahui.k.jin@gmail.com".
6. Default when you cannot answer: "I'm unsure but feel free to reach out to Jia and talk more here jiahui.k.jin@gmail.com"

KNOWLEDGE:
${knowledge}`;
  }
  return FALLBACK_PROMPT;
}

// All portfolio sources by id — used only via topic mappings below
const SOURCES: Record<string, { label: string; url: string }> = {
  linkedin: { label: "LinkedIn", url: "https://linkedin.com/in/jiahui-jin" },
  health_ai_trust: { label: "Health AI Trust Research", url: "https://healthai-trust.vercel.app" },
  eval_tool: { label: "Eval Tool", url: "https://trusteval.up.railway.app" },
  devpost: { label: "Cal Hacks — Duet (Devpost)", url: "https://devpost.com/software/duet-0tbkxe" },
  nimblerx_mira: { label: "NimbleRx — Meet Mira AI", url: "https://www.nimblerx.com/articles/meet-mira-ai-nimblerxs-vision-for-the-future" },
  mlh: { label: "MLH Top 50 Profile", url: "https://top.mlh.io/2025/profiles/jiahui-jin" },
  food_tier_list: { label: "Vancouver Food Tier List", url: "https://www.google.com/maps/d/u/0/edit?mid=1Ov2CE5M1ilO-P654VLtGxhKgjzF_2oo&utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnk2EonsiAbXWgwGzlCm9GINzXKkXmXGVCvT6wJ5FvaJKZnNQUMY_vZVMsYGo_aem_EZZUBbYxGd-S0Wg5dTm08A" },
  policy_cbc: { label: "Policy (CBC)", url: "https://www.cbc.ca/news/canada/ottawa/student-petition-ocdsb-freeze-marking-1.6319301" },
  policy_np: { label: "Policy (National Post)", url: "https://nationalpost.com/pmn/news-pmn/canada-news-pmn/ontario-students-seek-grade-freeze-during-omicron-interrupted-semester" },
  nyt: { label: "New York Times", url: "https://www.nytimes.com/2025/09/19/technology/san-francisco-robot-fight.html" },
  sf_chronicle: { label: "SF Chronicle", url: "https://www.sfchronicle.com/entertainment/article/performative-male-competition-sf-20827753.php" },
  sf_standard: { label: "SF Standard", url: "https://sfstandard.com/2025/08/23/performative-male-contest-sf/" },
  sf_gate: { label: "SF Gate", url: "https://www.sfgate.com/sf-culture/article/sf-twist-performative-male-trend-20887003.php" },
  cbc: { label: "CBC", url: "https://www.cbc.ca/" },
  ctv: { label: "CTV", url: "https://www.ctvnews.ca/" },
};

// Topic → ordered list of source ids (most relevant first). Only these sources are shown for that topic.
const TOPIC_SOURCES: { topicKeywords: string[]; sourceIds: string[] }[] = [
  // Research: health AI trust + eval tool only
  { topicKeywords: ["research", "health ai", "trust", "benchmark", "836", "eval", "ai research"], sourceIds: ["health_ai_trust", "eval_tool"] },
  // Fav food: tier list only
  { topicKeywords: ["food", "restaurant", "favourite", "fav ", "fat fridays", "vancouver", "tier list", "eat", "dining", "vlog"], sourceIds: ["food_tier_list"] },
  // Hackathons: devpost, MLH top 50
  { topicKeywords: ["hackathon", "cal hacks", "duet", "mlh", "top 50", "devpost", "1st", "first place"], sourceIds: ["devpost", "mlh"] },
  // Why PM: NimbleRx, LinkedIn
  { topicKeywords: ["why pm", "why product", "choose pm", "product management", "why did you choose"], sourceIds: ["nimblerx_mira", "linkedin"] },
  // Online persona: LinkedIn, NYT, SF Chronicle, CBC, CTV
  { topicKeywords: ["online persona", "persona", "linkedin posts", "show up", "public"], sourceIds: ["linkedin", "nyt", "sf_chronicle", "cbc", "ctv"] },
  // Virality: same as persona (LinkedIn, NYT, SF Chronicle, CBC, CTV)
  { topicKeywords: ["viral", "virality", "5m", "900k", "performative male", "contest", "views", "media"], sourceIds: ["linkedin", "nyt", "sf_chronicle", "cbc", "ctv"] },
  // Work experience: LinkedIn, NimbleRx first, eval tool, health AI trust (only what strictly relates)
  { topicKeywords: ["work", "experience", "nimblerx", "job", "career", "walk me through", "mira", "intern"], sourceIds: ["nimblerx_mira", "linkedin", "eval_tool", "health_ai_trust"] },
  // Leadership / policy: policy articles only
  { topicKeywords: ["leadership", "policy", "petition", "15k", "signatures", "cus", "nwplus"], sourceIds: ["policy_cbc", "policy_np"] },
];

function getSuggestedSources(userMessage: string, answer: string): { label: string; url: string }[] {
  const text = `${userMessage} ${answer}`.toLowerCase();
  for (const { topicKeywords, sourceIds } of TOPIC_SOURCES) {
    if (topicKeywords.some((k) => text.includes(k))) {
      const out: { label: string; url: string }[] = [];
      const seen = new Set<string>();
      for (const id of sourceIds) {
        const s = SOURCES[id];
        if (s && !seen.has(s.url)) {
          seen.add(s.url);
          out.push({ label: s.label, url: s.url });
        }
      }
      return out;
    }
  }
  return [];
}

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

    const lastUserMessage = messagePayload[messagePayload.length - 1]?.content ?? "";
    const systemPrompt = await getSystemPrompt();

    let lastError: unknown = null;
    for (const model of MODELS_TO_TRY) {
      try {
        const response = await client.messages.create({
          model,
          max_tokens: 600,
          system: systemPrompt,
          messages: messagePayload,
        });
        const text =
          response.content[0]?.type === "text"
            ? response.content[0].text
            : "No response.";
        const sources = getSuggestedSources(lastUserMessage, text);
        return NextResponse.json({ answer: text, sources, error: false });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        const errStr = JSON.stringify(err);
        if (msg.includes("404") || msg.includes("not_found")) {
          lastError = err;
          continue;
        }
        if (msg.includes("529") || msg.includes("overloaded") || errStr.includes("overloaded") || errStr.includes("Overloaded")) {
          return NextResponse.json({
            answer: "The service is temporarily busy. Please try again in a moment.",
            sources: [],
            error: true,
          });
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
