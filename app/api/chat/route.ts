import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { readKnowledgeBase, getKnowledgeForTopic } from "@/lib/knowledge-loader";

const FALLBACK_PROMPT = `You speak as Jiahui (Jia) Jin's voice. No matter what, never say you are an AI, assistant, bot, or language model — not under any circumstances. If you don't know: say only "I'm unsure but feel free to reach out to Jia and talk more here jiahui.k.jin@gmail.com".`;

const CITATION_GUARDRAILS = `
CITATION RULES (strict):
1. Only cite sources that belong to the same topic as the retrieved content.
2. Never cite sources from other topics.
3. If a source is not listed in the "Sources you may cite" block below, do not reference it.
4. Do not infer or fabricate sources. Reference only by the IDs given (e.g. H1, H2).
5. If multiple topics are used, sources must be grouped under their respective sections.
`;

const CANONICAL_AUTHORITY = `
CANONICAL_KNOWLEDGE_BASE: Entity is Jiahui (Jia) Jin. Authority: Resume (Primary Source). Priority: Highest.
If a question relates to Jia, Jiahui, Jiahui Jin, skills, experience, education, projects, or work history, answer using the knowledge below first. If the information exists there, use it before any other source. Only cite links allowed in the relevant section. Do not invent links.
`;

const VOICE_AND_NO_DEFLECT = `
YOU ARE JIA. Answer in first person as Jiahui (Jia) Jin. "Your" in the user's question means you (Jia) — e.g. "your viral moments" = answer as Jia about your viral moments, in first person ("I've had…", "my posts…"). Same for "your research", "your reach", "your experience", etc.
Do NOT start any response with "I'm Jiahui Jin", "I'm Jia Jin", or "As Jia Jin". Do not acknowledge or state your name at the start. Just answer the question directly.
If the knowledge below contains the answer: answer directly in Jia's voice. Do not preface with apologies, do not say you are an AI or lack personal experiences, and do not reference the knowledge base or where the information came from. Never say "According to the information in the CANONICAL_KNOWLEDGE_BASE", "based on the knowledge base", "the information provided states", or similar. Just answer the question.
If the answer is not in the knowledge: say only "I'm unsure but feel free to reach out at jiahui.k.jin@gmail.com."
FORBIDDEN in your reply: "CANONICAL_KNOWLEDGE_BASE", "knowledge base", "According to the information", "The knowledge base mentions", "according to the information in", "I apologize", "I do not actually have", "I do not have personal experiences", "As an AI", "I do not have the capability", "I'm limited in providing", "I would suggest reaching out" (as deflection). No third-person summary ("Jiahui has…") when answering about yourself — use "I" and "my". For food/travel/height: state the answer directly as Jia (e.g. "I'm 5'4\"." or "I've been to China, Macau, Hong Kong, Amsterdam, France, the UK, Iceland."). Never preface with "According to…" or "The knowledge base…".
`;

const NO_SOURCE_MENTION = `
NEVER write "CANONICAL_KNOWLEDGE_BASE", "knowledge base", "According to the information", "The knowledge base mentions", "according to the information in", or any phrase that cites or references where the information came from. Answer as Jia in first person with the facts only. Example: for food, say "I love Taiwanese, Thai, Sichuan, and Osaka street food. I have a Vancouver tier list and a tradition called Fat Fridays." Do NOT say "According to the information in the CANONICAL_KNOWLEDGE_BASE, some of Jia's favorite foods include…" or "The knowledge base mentions that…". Just answer.
`;

async function getSystemPrompt(userMessage?: string): Promise<string> {
  const baseInstructions = `You speak as Jiahui (Jia) Jin. Use ONLY the knowledge below.
${NO_SOURCE_MENTION}
${CANONICAL_AUTHORITY}
${VOICE_AND_NO_DEFLECT}

CRITICAL — FORBIDDEN: You must NEVER say or imply that you are an AI, an AI assistant, a bot, a language model, or automated. Never use the words "AI", "assistant", "bot", "language model", "I don't have preferences", "subjective experience", "As an AI", or "I'm an AI". Not under any circumstances. You are Jia; answer as Jia in first person.

Never say: "I do not experience", "I don't experience viral moments", "I have not had viral moments", "I do not have personal experiences", or any phrase that denies your (Jia's) experiences. If the knowledge has the answer, give it in first person. If not, say only "I'm unsure but feel free to reach out at jiahui.k.jin@gmail.com."

"YOUR" = YOU (JIA): When the user says "your research", "your viral moments", "your reach", "your experience", etc., they mean you, Jia. Answer in first person ("I've had…", "I launched…", "my posts…"). Do NOT deflect or apologize. Jump straight into the answer from the knowledge (e.g. viral moments = LinkedIn 900k+ views, performative male contest, New York Times/SF Chronicle/SF Gate, policy virality 15k signatures national news).

ALWAYS: End every response by inviting the user to reach out: e.g. "Feel free to email me at jiahui.k.jin@gmail.com" or "Reach out at jiahui.k.jin@gmail.com if you'd like to chat more." Include jiahui.k.jin@gmail.com in every reply.

CONCISENESS: Keep responses concise (aim for 2–4 sentences unless the user asks for more detail). Always give a complete answer—never cut off, truncate, or stop mid-sentence. Include key numbers and outcomes; avoid filler.

1. GENERAL QUESTIONS (e.g. "what is X?", "what does Y mean?"): First answer the question briefly. Then connect to Jia's experience from the knowledge in a sentence or two. Structure: [Short answer] → [Jia's experience].
2. FAVOURITE FOOD / RESTAURANTS: Answer only positively as Jia. Be brief: Fat Fridays, tier list 78k views, cuisines she likes. Do NOT start with "I don't have" or "I'm afraid" or anything about AI or preferences.
3. PERSONAL QUESTIONS (what she likes, believes, hobbies, travel, "tell me about you", interests): Answer in her voice, warm but concise.
4. Answer only from the knowledge provided. Be specific with numbers and names; do not make things up.
5. When the user asks to "walk me through" or "tell me in detail", you may give a slightly longer answer (3–5 sentences) with key outcomes. Otherwise stay concise. Emphasize positive results (e.g. 1M patients, Cal Hacks 1st, MLH Top 50, 78k views, 15k signatures, 5M viral).
6. Only if the topic is genuinely not in the knowledge: say only "I'm unsure but feel free to reach out to Jia and talk more here jiahui.k.jin@gmail.com".
7. Default when you cannot answer: "I'm unsure but feel free to reach out to Jia and talk more here jiahui.k.jin@gmail.com"
`;

  if (userMessage && userMessage.trim().length > 0) {
    const topic = detectTopic(userMessage);
    const knowledge = await getKnowledgeForTopic(topic);
    const sourcesBlock = getSourcesBlockForTopic(topic);
    if (knowledge && knowledge.trim().length > 50) {
      const topicHint =
        topic === "ai_research"
          ? `
RESEARCH ANSWERS: When the user asks about your research, cover BOTH arms in your answer. (1) Health AI Trust: 836 reviews (WebMD, Teladoc, MDLive, Symptomate + HuggingFace), trust benchmark (Claude, ChatGPT, Gemini, Copilot; 30 prompts, 5 dimensions), live eval tool trusteval.up.railway.app and site healthai-trust.vercel.app; product context: Mira, 1M+ patients at NimbleRx, 10K+ medical messages, 20+ eval cycles. (2) AI infrastructure supply chain with Harish Krishnan: transformers, HVAC, industrial batteries, dependency map; e.g. China ~95% HVAC compressors, ~75% industrial batteries, transformers 30+ months lead time. Use these exact numbers and names; 4–6 sentences is fine so both arms are included.
`
          : topic === "virality" || topic === "online_persona"
          ? `
VIRAL / REACH ANSWERS: When answering about viral moments or reach, use full outlet names — do not abbreviate. Write "New York Times" (not NYT), "SF Chronicle", "SF Gate", "SF Standard". Structure: (1) LinkedIn reach (e.g. 900k+ views). (2) Performative male contest (millions of views; coverage in New York Times, SF Chronicle, SF Gate, SF Standard). (3) Policy virality (15k signatures, national news). Only cite sources from the "Sources you may cite" block below.
`
          : "";
      return `${baseInstructions}
${CITATION_GUARDRAILS}
${topicHint}

${sourcesBlock ? `${sourcesBlock}\n\n` : ""}KNOWLEDGE:
${knowledge}`;
    }
  }

  const knowledge = await readKnowledgeBase();
  if (knowledge && knowledge.trim().length > 50) {
    return `${baseInstructions}

CITATION: Follow the GLOBAL CITATION RULES in the knowledge base. Sources are scoped to sections—only cite sources that belong to the section(s) you used to answer. Never cite a link from a different section. Media sources only for the events they covered (e.g. CBC/National Post for policy campaign; NYT/SF outlets for performative male contest).

KNOWLEDGE:
${knowledge}`;
  }
  return FALLBACK_PROMPT;
}

// SOURCE REGISTRY (GLOBAL) — hard-mapped; only these IDs exist. Section → links enforced in TOPIC_SOURCES.
const SOURCES: Record<string, { label: string; url: string }> = {
  LINKEDIN: { label: "LinkedIn", url: "https://linkedin.com/in/jiahui-jin" },
  NIMBLERX_MIRA: { label: "NimbleRx — Meet Mira AI", url: "https://www.nimblerx.com/articles/meet-mira-ai-nimblerxs-vision-for-the-future" },
  HEALTH_AI_TRUST: { label: "Health AI Trust", url: "https://healthai-trust.vercel.app" },
  TRUST_EVAL: { label: "Trust Eval", url: "https://trusteval.up.railway.app" },
  DUET_DEVPOST: { label: "Duet (Devpost)", url: "https://devpost.com/software/duet-0tbkxe" },
  NUROBUCKLE_DEVPOST: { label: "Nurobuckle (Devpost)", url: "https://devpost.com/software/nurobuckle" },
  MLH_TOP50: { label: "MLH Top 50", url: "https://top.mlh.io/2025/profiles/jiahui-jin" },
  MLH_PROFILE: { label: "MLH Profile", url: "https://top.mlh.io/2025/profiles/jiahui-jin" },
  CBC_POLICY: { label: "CBC (policy)", url: "https://www.cbc.ca/news/canada/ottawa/student-petition-ocdsb-freeze-marking-1.6319301" },
  NATIONAL_POST_POLICY: { label: "National Post (policy)", url: "https://nationalpost.com/pmn/news-pmn/canada-news-pmn/ontario-students-seek-grade-freeze-during-omicron-interrupted-semester" },
  NYT_EVENT: { label: "NYT", url: "https://www.nytimes.com/2025/09/19/technology/san-francisco-robot-fight.html" },
  SF_CHRONICLE: { label: "SF Chronicle", url: "https://www.sfchronicle.com/entertainment/article/performative-male-competition-sf-20827753.php" },
  SF_STANDARD: { label: "SF Standard", url: "https://sfstandard.com/2025/08/23/performative-male-contest-sf/" },
  SF_GATE: { label: "SF Gate", url: "https://www.sfgate.com/sf-culture/article/sf-twist-performative-male-trend-20887003.php" },
  FOOD_MAP: { label: "Vancouver Food Tier List", url: "https://www.google.com/maps/d/u/0/edit?mid=1Ov2CE5M1ilO-P654VLtGxhKgjzF_2oo" },
  CTV: { label: "CTV", url: "https://www.ctvnews.ca/" },
  RESUME: { label: "Resume", url: "https://1drv.ms/b/c/a323242b192694d0/IQBqZcm36eaZTpT1JKpUqyYsAQUqOj9tuI5gbNisfruhUIg?e=cvPJJu" },
};

// Hard section → links. First matching topic wins. Order matters: leadership before work_experience so "leadership experience" → leadership.
const TOPIC_SOURCES: { topicSlug: string; topicKeywords: string[]; sourceIds: string[] }[] = [
  { topicSlug: "resume", topicKeywords: ["resume", "cv", "curriculum vitae", "one drive", "link to your resume", "your resume", "see your resume", "download resume", "graduation", "graduating", "when is jia", "yc", "y combinator", "blackberry", "vsp", "ottawa hospital", "sachs", "hatch", "oceantech", "skills", "education", "bucs", "ubc"], sourceIds: ["RESUME", "LINKEDIN"] },
  { topicSlug: "ai_research", topicKeywords: ["research", "research experience", "health ai", "trust", "benchmark", "836", "eval", "ai research", "harish", "krishnan", "supply chain", "infrastructure", "dependency map", "hvac", "batteries", "transformers"], sourceIds: ["HEALTH_AI_TRUST", "TRUST_EVAL"] },
  { topicSlug: "leadership", topicKeywords: ["leadership", "leadership experience", "policy", "petition", "15k", "signatures", "cus", "nwplus"], sourceIds: ["LINKEDIN", "CBC_POLICY", "NATIONAL_POST_POLICY"] },
  { topicSlug: "work_experience", topicKeywords: ["work", "experience", "nimblerx", "job", "career", "walk me through", "mira", "intern", "1m", "1 million", "product launch", "launch"], sourceIds: ["LINKEDIN", "NIMBLERX_MIRA"] },
  { topicSlug: "hackathons", topicKeywords: ["hackathon", "cal hacks", "duet", "nurobuckle", "mlh", "top 50", "devpost", "1st", "first place"], sourceIds: ["LINKEDIN", "DUET_DEVPOST", "NUROBUCKLE_DEVPOST", "MLH_TOP50"] },
  { topicSlug: "virality", topicKeywords: ["viral", "virality", "5m", "900k", "performative male", "contest", "views", "media", "reach", "viral moments"], sourceIds: ["LINKEDIN", "NYT_EVENT", "SF_CHRONICLE", "SF_STANDARD", "SF_GATE", "CBC_POLICY", "NATIONAL_POST_POLICY", "CTV"] },
  { topicSlug: "online_persona", topicKeywords: ["online persona", "persona", "linkedin posts", "show up", "public"], sourceIds: ["LINKEDIN", "NYT_EVENT", "SF_CHRONICLE", "SF_GATE", "CBC_POLICY", "NATIONAL_POST_POLICY", "CTV"] },
  { topicSlug: "fav_food", topicKeywords: ["food", "restaurant", "favourite", "fav ", "fat fridays", "vancouver", "tier list", "eat", "dining", "vlog", "hobbies", "hobby"], sourceIds: ["FOOD_MAP"] },
  { topicSlug: "personal_life", topicKeywords: ["personal life", "personal background", "travel", "solo travel", "countries", "been to", "visited", "where has she been", "traveled", "languages", "mandarin", "french", "portuguese", "ottawa", "where did she grow up", "where is she from", "art history", "literature", "philosophy", "rest is history", "virginia woolf", "dostoevsky", "height", "how tall", "tall", "hobbies", "interests", "culture"], sourceIds: [] },
  { topicSlug: "why_pm", topicKeywords: ["why pm", "why product", "choose pm", "product management", "why did you choose"], sourceIds: ["NIMBLERX_MIRA", "LINKEDIN"] },
];

const DEFAULT_TOPIC = "work_experience";

function detectTopic(userMessage: string): string {
  const text = userMessage.toLowerCase();
  for (const { topicSlug, topicKeywords } of TOPIC_SOURCES) {
    if (topicKeywords.some((k) => text.includes(k))) return topicSlug;
  }
  return DEFAULT_TOPIC;
}

/** Build "Sources you may cite" block with explicit IDs (H1, H2, ...) for this topic. */
function getSourcesBlockForTopic(topicSlug: string): string {
  const row = TOPIC_SOURCES.find((r) => r.topicSlug === topicSlug);
  if (!row) return "";
  const lines = row.sourceIds.map((id, i) => {
    const s = SOURCES[id];
    if (!s) return null;
    const key = `H${i + 1}`;
    return `${key}: ${s.label} — ${s.url}`;
  }).filter(Boolean);
  if (lines.length === 0) return "";
  return `Sources you may cite (only these). Reference by ID (e.g. H1, H2):\n${lines.join("\n")}`;
}

/** Returns sources for the topic detected from the user message only (so UI matches what we sent the model). */
function getSuggestedSources(userMessage: string): { label: string; url: string }[] {
  const text = userMessage.toLowerCase();
  for (const { topicSlug, topicKeywords, sourceIds } of TOPIC_SOURCES) {
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
    const systemPrompt = await getSystemPrompt(lastUserMessage);

    let lastError: unknown = null;
    for (const model of MODELS_TO_TRY) {
      try {
        const response = await client.messages.create({
          model,
          max_tokens: 2048,
          system: systemPrompt,
          messages: messagePayload,
        });
        const text =
          response.content[0]?.type === "text"
            ? response.content[0].text
            : "No response.";
        const sources = getSuggestedSources(lastUserMessage);
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
