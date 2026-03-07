"use client";

import { useState, useRef, useEffect } from "react";

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface Artifact {
  type: "url" | "pdf";
  label: string;
  url?: string;
  localKey?: string;
  icon?: string;
  featured?: boolean;
}

interface KnowledgeEntry {
  id: string;
  title: string;
  tags: string[];
  artifacts: Artifact[];
  content: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  artifact_ids?: string[];
}

// ─── KNOWLEDGE BASE ───────────────────────────────────────────────────────────
// Each entry has: id, title, tags (for retrieval hints), artifacts, content.
// To add a new project: copy an entry, give it a new id, fill in content + artifacts.

const KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: "index",
    title: "Jiahui Jin — Master Profile",
    tags: ["background", "about", "intro", "who", "yourself", "overview"],
    artifacts: [
      { type: "url", label: "LinkedIn", url: "https://linkedin.com/in/jiahui-jin", icon: "🔗" },
      { type: "pdf", label: "Resume (Microsoft AI)", localKey: "resume", featured: true },
    ],
    content: `I'm Jia — UBC BUCS (Business + Computer Science) graduating 2026, from Ottawa, based in Vancouver. AI PM who shipped products to over a million patients, won the world's largest student hackathon, and built original research infrastructure on health AI trust.

Numbers: NimbleRx (YC W15): Mira launched to 1M patients; LLM eval on 10K medical messages across 20+ cycles; pharmacy AI agent reducing escalations 20%, saving 150+ hrs/month; 60+ patient/pharmacist interviews. Cal Hacks: 1st of 2,500+ teams. MLH: Top 50 of 150,000+ globally. YC AI Startup School June 2025 (invitational).

Contact: jiahui.k.jin@gmail.com | 613-859-9683 | linkedin.com/in/jiahui-jin`,
  },
  {
    id: "nimblyrx",
    title: "NimbleRx — AI PM Intern",
    tags: ["nimblyrx", "mira", "pharmacy", "health", "intern", "eval", "llm", "agent", "hipaa", "work", "experience", "job"],
    artifacts: [
      { type: "url", label: "Mira AI Announcement", url: "https://www.nimblerx.com/articles/meet-mira-ai-nimblerxs-vision-for-the-future", icon: "🔗", featured: true },
      { type: "pdf", label: "Mira AI Article (PDF)", localKey: "nimblyrx" },
    ],
    content: `AI PM Intern at NimbleRx (YC W15), May–Aug 2025, Redwood City CA.

Mira AI: Launched AI health companion to 1M patients. Owned 0→1 roadmap, prioritization, HIPAA safety. Multi-language, HIPAA compliant, handles medication questions, refills, health guidance.

LLM Eval Infrastructure: Curated 10K medical messages as golden dataset. Ran 20+ eval cycles. Unclear AI responses were top drop-off driver across 60+ interviews — precise language cut friction. Framework became production gate for all AI feature launches.

Pharmacy AI Agent: Reduced escalations 20%, saved pharmacies 150+ hrs/month. Scoped behavior spec and escalation criteria.

Weekly releases coordinating engineering, UX, and pharmacy teams.`,
  },
  {
    id: "healthai",
    title: "Health AI Trust Research",
    tags: ["trust", "research", "benchmark", "microsoft", "health", "eval", "models", "copilot", "claude", "chatgpt", "gemini", "transparency", "escalation", "patient", "project"],
    artifacts: [
      { type: "url", label: "Live Research Site", url: "https://healthai-trust.vercel.app", icon: "🔬", featured: true },
      { type: "url", label: "Try the Eval Tool", url: "https://trusteval.up.railway.app", icon: "⚡", featured: true },
      { type: "pdf", label: "Research Paper (PDF)", localKey: "healthai" },
    ],
    content: `Independent research project. Live at healthai-trust.vercel.app. Eval tool at trusteval.up.railway.app.

Argument: Clinical accuracy benchmarks measure if a model is right. In consumer health AI that's not enough — trust behaviors are measurable but not systematically evaluated.

Data: Scraped 836 reviews (WebMD 225, Teladoc 225, MDLive 225, Symptomate 161) + 669 HuggingFace AI Medical Chatbot cases. Five failure modes: Paywall Dropoff, Symptom Dead End, Dangerous Confidence Gap, Cold at Worst Moment, Monetization Erodes Credibility.

Benchmark scores (1–5): ChatGPT 4.04 overall · Copilot 4.02 · Claude 3.67 · Gemini 3.63.
Transparency of Limitation worst across all models (all <4.0, three of four <3.6).
Copilot best on Transparency of Limitation (4.0) — used to open the Microsoft conversation.

Limitations stated publicly — single rater, 30 prompts insufficient, proof of concept not peer-reviewed. Shared scoring via OneDrive intentionally.`,
  },
  {
    id: "calhacks",
    title: "Cal Hacks — 1st Overall",
    tags: ["calhacks", "hackathon", "duet", "eeg", "music", "mlh", "award", "competition", "prize", "cal", "hacks"],
    artifacts: [
      { type: "url", label: "Devpost — Duet", url: "https://devpost.com/software/duet-0tbkxe", icon: "🏆", featured: true },
      { type: "url", label: "MLH Top 50 Profile", url: "https://top.mlh.io/2025/profiles/jiahui-jin", icon: "🥇" },
    ],
    content: `Cal Hacks: 1st Overall out of 2,500+ teams. World's largest student hackathon at UC Berkeley.

Project Duet: Mind-controlled music via EEG brainwaves. Stack: Python, Gemini, Sonic Pi. Full pipeline: EEG preprocessing → emotion classification (random forest, scikit-learn) → LLM-driven composition (Gemini API) → audio output. Sub-200ms latency.

MLH Top 50 globally out of 150,000+ hackers. YC AI Startup School June 2025 — invitational, OpenAI/Anthropic/Microsoft CEO keynotes.`,
  },
  {
    id: "resume",
    title: "Resume & Full Background",
    tags: ["resume", "cv", "background", "experience", "skills", "education", "blackberry", "vsp", "ottawa", "hospital", "ubc", "bucs", "hatch", "founder"],
    artifacts: [
      { type: "pdf", label: "Resume — Microsoft AI", localKey: "resume", featured: true },
      { type: "url", label: "LinkedIn", url: "https://linkedin.com/in/jiahui-jin", icon: "🔗" },
    ],
    content: `UBC BUCS (Business + CS) Class of 2026. Awards on transcript: MLH Top 50 (150,000+), Cal Hacks 1st (2,500+).

BlackBerry — Product Operations (Sep 2023–Apr 2024): Presented pricing analysis to CEO for $284M enterprise deal. Saved $30K analyzing 12,000+ SKUs. Automated competitive analysis 25% faster.

VSP — Program Manager (May–Aug 2024): 10+ large-scale events. 30+ staff interviews. KPI dashboards, 30% planning accuracy improvement.

Ottawa Hospital, Sachs Lab — Data Science Researcher (Jun–Sep 2021): 85% accuracy on Parkinson's biomarker detection. TensorFlow on 900K data points, 100K+ features.

Hatch — Founder (2024): AI Video Intelligence Platform. FastAPI + Whisper + FFmpeg, trained on 1K+ clips, reduced editing decisions 70%. 25 user interviews, 3 paid pilots. YC process; feedback from Jared Friedman.

Technical stack: Python, JS/TS, SQL, TensorFlow, scikit-learn, LangChain, FastAPI, Next.js, Pinecone, Cohere, Azure, Databricks, Docker.`,
  },
  {
    id: "microsoft",
    title: "Why Microsoft Health AI",
    tags: ["microsoft", "london", "why", "role", "health", "copilot", "bay", "gross", "adam", "gayton", "future"],
    artifacts: [
      { type: "url", label: "Live Research Site", url: "https://healthai-trust.vercel.app", icon: "🔬" },
      { type: "url", label: "Eval Tool", url: "https://trusteval.up.railway.app", icon: "⚡" },
      { type: "pdf", label: "Research Paper", localKey: "healthai" },
    ],
    content: `Copilot scored best on my benchmark's most important dimension — Transparency of Limitation (4.0, best of 4 models) and second overall (4.02). Strong foundation + clear improvement surface. Shared scoring via OneDrive intentionally.

Three things I'd build: (1) Consumer Health Trust Benchmark — 500+ health prompts, clinical raters, becomes the bar for all consumer health AI. I ran this at NimbleRx on 10K+ messages across 20+ cycles. (2) Actionable transparency — per-answer clarity on what to trust, when to escalate, what to do next. (3) Escalation in the flow — when we flag risk, next step is one tap (Teams referral, clinician message). Success metric: % who complete the next step.

Microsoft's infrastructure across Copilot, Teams, Azure Health Data Services supports clinical augmentation at real scale — not isolated chat demos.`,
  },
];

// ─── PDF PREVIEW DATA ─────────────────────────────────────────────────────────
// Mirrors the content of the actual uploaded PDFs.
// PDFs are served from /public/pdfs/ — iframe viewer enabled.

interface PdfSection { label: string; text: string; }
interface PdfPreview { heading: string; subhead: string; sections: PdfSection[]; }

const PDF_PREVIEWS: Record<string, PdfPreview> = {
  resume: {
    heading: "Jiahui Jin",
    subhead: "jiahui.k.jin@gmail.com · 613-859-9683 · linkedin.com/in/jiahui-jin",
    sections: [
      {
        label: "Education",
        text: "University of British Columbia · Class of 2026 · Vancouver BC\nCombined Major in Business and Computer Science (BUCS)\nInternational Awards: MLH Top 50 Winner (150,000+) · Cal Hacks 1st Overall (2,500+)\nYC AI Startup School · June 2025 · San Francisco (invitational)",
      },
      {
        label: "NimbleRx (YC W15) — AI Product Manager · May–Aug 2025",
        text: "• Launched Mira, AI health companion, to 1M patients — owned 0→1 roadmap, HIPAA safety\n• LLM safety eval on 10K curated medical messages, 20+ eval cycles\n• Interviewed 60+ patients and pharmacists; mapped unclear AI replies, tone issues, drop-offs\n• Deployed pharmacy support AI agent: reduced escalations 20%, saved 150+ hrs/month\n• Weekly releases across engineering, UX, and pharmacy teams",
      },
      {
        label: "VSP — Program Manager · May–Aug 2024",
        text: "• Delivered 10+ large-scale events (cross-team logistics, timelines, dependencies)\n• Interviewed 30+ staff and suppliers to identify execution risks\n• Built KPI dashboards improving planning accuracy 30%",
      },
      {
        label: "BlackBerry — Product Operations · Sep 2023–Apr 2024",
        text: "• Presented product analysis to CEO, informing pricing strategy in a $284M enterprise deal\n• Automated competitive analysis pipeline, 25% faster strategic research\n• Saved $30K analyzing 12,000+ SKUs across 50+ products",
      },
      {
        label: "Ottawa Hospital, Sachs Lab — Data Science Researcher · Jun–Sep 2021",
        text: "• Trained TensorFlow models on 900K data points, 85% accuracy on Parkinson's biomarker detection\n• Built data preprocessing pipeline with MNE and Pandas, managing 100K+ features\n• Visualized neural correlations with Matplotlib",
      },
      {
        label: "Projects",
        text: "Hatch — AI Video Intelligence Platform (FastAPI, Whisper, FFmpeg, PostgreSQL, Next.js)\n• Built AI platform predicting video performance, serving GTM teams with 100M+ reach\n• 25 user interviews, 3 paid pilots\n• Pipeline trained on 1K+ clips, reduced editing decisions 70%\n\nMind-Controlled Music — Cal Hacks 1st Overall (Python, Gemini, Sonic Pi)\n• EEG → emotion classification → LLM-driven composition at sub-200ms latency\n\nOceanTech — Government of Canada Top 3 (Pinecone, Cohere, Azure)\n• Ocean data platform with semantic search chatbot",
      },
      {
        label: "Skills",
        text: "Product: 0→1 ownership, PRDs, KPI definition, A/B testing, roadmap planning, Figma, AI prototyping\nAI & LLM: evaluation, RAG, golden datasets, prompt architecture, safety guardrails, failure monitoring\nTools: LLM APIs, LangChain, Azure, Databricks, ETL, Elastic/Kibana, Docker, Codex, Claude Code",
      },
    ],
  },
  nimblyrx: {
    heading: "Meet Mira AI: NimbleRx's Vision for the Future",
    subhead: "nimblerx.com · Industry updates and trends",
    sections: [
      {
        label: "Overview",
        text: "NimbleRx is harnessing AI to redefine how pharmacies operate, how consumers manage their health, and how pharmaceutical companies connect with their audience.",
      },
      {
        label: "Mira AI — Patient Experience",
        text: "Quick Answers to Health Questions: Immediate, reliable answers using de-identified medication history. Multi-language. HIPAA compliant.\n\nSafety & Security: Only answers health-related questions. All data de-identified. Clear disclaimers that responses are for information only, not medical advice.\n\nThe Future Health Coach: Evolving toward comprehensive AI Health Coach — medication/symptom tracking, personalized diet and exercise plans, smart daily reminders.",
      },
      {
        label: "Pharmacy Operations",
        text: "Customer Support: Handles common patient inquiries, freeing pharmacy staff to focus on complex needs. Boosts engagement, improving adherence and pharmacy relationships.\n\nPrior Authorization: AI analyzes data to streamline PA submissions, reducing delays (often 2+ hours daily).\n\nMedication Management: AI identifies potential drug interactions and discrepancies for pharmacist review.",
      },
      {
        label: "Pharma Marketing & Engagement",
        text: "Precision Messaging: AI uses de-identified data to understand patient needs, sends personalized messages at the right time.\n\nAd Targeting: AI finds the right patients and HCPs, improves ad performance in real time, keeps messaging consistent across channels.",
      },
    ],
  },
  healthai: {
    heading: "Trust is the Next Frontier in Health AI",
    subhead: "Microsoft Health AI · March 2026 · healthai-trust.vercel.app",
    sections: [
      {
        label: "The Argument",
        text: "Benchmarks like MedQA measure accuracy. Trust behaviors are less systematically evaluated.\n\nClinical accuracy tells you if the model is right. In consumer settings, outcomes also depend on whether users understand the answer, calibrate their trust appropriately, and take appropriate next steps. A model can be correct and still fail through overconfidence, unclear escalation, or poor emotional alignment.\n\n8% drop in public trust in health AI, 2025→2026. Zero existing benchmarks for consumer health AI trust.",
      },
      {
        label: "Validation 1 — User Data (836 reviews)",
        text: "Scraped 1–3 star reviews from: WebMD (225) · Teladoc (225) · MDLive (225) · Symptomate (161)\nPlus 669 flagged cases from HuggingFace AI Medical Chatbot dataset.\n\nFive failure modes:\nF01 · Dropoff at Paywall — paywalls at the moment of need destroy trust instantly\nF02 · Symptom Checker Dead End — listing possibilities without answers worsens anxiety\nF03 · Dangerous Confidence Gap — incorrect answers delivered with high confidence\nF04 · Cold at the Worst Moment — information without acknowledgment feels inhuman\nF05 · Monetization Erodes Credibility — charging patients then refusing care destroys longitudinal trust",
      },
      {
        label: "Benchmark Results (4 models × 5 dimensions)",
        text: "Dimension              Claude  ChatGPT  Gemini  Copilot\nEpistemic Calibration  4.00    4.63     3.93    4.43\nEscalation Accuracy    3.97    3.97     3.93    3.90\nTransparency of Limit  2.73    3.57     2.77    4.00  ← worst dimension overall\nFraming Sensitivity    3.63    3.73     3.47    3.93\nHarm Asymmetry         4.03    4.30     4.07    3.83\nOverall                3.67    4.04     3.63    4.02\n\nKey finding: Transparency of Limitation worst across all models — all <4.0, three of four <3.6.\nCopilot best overall (4.02) and best on Transparency (4.0).",
      },
      {
        label: "What I'd Build at Microsoft",
        text: "01 · Ship a Consumer Health Trust Benchmark\n500+ realistic health prompts, scored by clinical raters on clarity, calibration, escalation, and transparency. Becomes the bar for all consumer health AI. I ran this at NimbleRx on 10K+ medical messages across 20+ eval cycles.\n\n02 · Make Transparency Actionable\nPer-answer: what we don't know, what would change the answer, when to escalate. Unclear AI responses were the top drop-off driver in 60+ NimbleRx interviews.\n\n03 · Design for Follow-Through\nWhen escalation is recommended, next step is one tap — Teams referral, clinician message, care action. Success metric: % of users who complete the next step when escalation is recommended.",
      },
      {
        label: "Limitations (stated plainly)",
        text: "Single rater, no medical background — score deltas of 0.1–0.2 are directional, not conclusive.\n30 prompts is insufficient at scale — valid benchmark needs hundreds per category.\nStarke et al. was a conceptual paper, not designed as a scoring tool.\nScraping limited to 4 platforms. Evaluator bias possible (built by someone applying for the role).\nBlind evaluation protocols were not used.\n\nThis is a proof of concept showing the measurement infrastructure is worth building.",
      },
    ],
  },
};

const PDF_FILENAMES: Record<string, string> = {
  resume: "Jiahui_Jin_Resume____Microsoft_AI.pdf",
  nimblyrx: "NimbleRx_I_Meet_Mira_AI__NimbleRx_s_Vision_for_the_Future.pdf",
  healthai: "Trust_is_the_Frontier___Jiahui_Jin.pdf",
};

// ─── SYSTEM PROMPT ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are Jia's professional AI — a sharp, knowledgeable representative answering questions about Jiahui (Jia) with the confidence of someone who worked alongside her closely.

KNOWLEDGE BASE:
${KNOWLEDGE.map((k) => `[${k.id.toUpperCase()}]\n${k.content}`).join("\n\n---\n\n")}

ANSWER RULES:
- Lead with SIGNAL (what this reveals about Jia), back with EVIDENCE (specific numbers), end with a natural hook
- Real numbers only: 1M patients, 10K messages, 20+ eval cycles, 60+ interviews, 836 reviews, Cal Hacks 1st of 2,500+, MLH Top 50 of 150,000+, 20% escalation reduction, 150+ hrs/month, 85% Parkinson's accuracy, $284M deal
- Confident and specific. Never vague. Never "based on documents."
- Don't open with "Great question!" — just answer.
- Keep tight: 3–5 sentences for simple questions, up to 8 for complex.

CRITICAL — RESPOND ONLY WITH VALID JSON, NO MARKDOWN, NO PREAMBLE:
{"answer":"your answer text","artifact_ids":["id1"]}

artifact_ids rules (only include when the answer is primarily about that topic):
- NimbleRx/Mira/pharmacy → ["nimblyrx"]
- Health AI trust/benchmark/eval/research → ["healthai"]  
- Cal Hacks/MLH/Duet/hackathon → ["calhacks"]
- Resume/background/BlackBerry/VSP/Ottawa/Hatch/skills → ["resume"]
- Why Microsoft → ["microsoft","healthai"]
- General intro/about/background → ["resume"]
- Unknown → []`;

// ─── SUGGESTED QUESTIONS ──────────────────────────────────────────────────────

const SUGGESTED = [
  { label: "NimbleRx", q: "Walk me through NimbleRx" },
  { label: "Health AI research", q: "Tell me about the health AI trust research" },
  { label: "Cal Hacks", q: "What did you build at Cal Hacks?" },
  { label: "Why health AI?", q: "Why health AI specifically?" },
  { label: "A failure", q: "Tell me about a failure" },
  { label: "Why Microsoft?", q: "Why Microsoft for health AI?" },
  { label: "Resume", q: "Walk me through your full background" },
  { label: "With engineers", q: "How do you work with engineers?" },
];

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 3, alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 4, height: 4, borderRadius: "50%", background: "#7d766e",
            display: "inline-block",
            animation: "jdot 1.1s ease-in-out infinite",
            animationDelay: `${i * 0.18}s`,
          }}
        />
      ))}
    </span>
  );
}

function UrlCard({ artifact }: { artifact: Artifact }) {
  const domain = artifact.url ? artifact.url.replace("https://", "").split("/")[0] : "";
  return (
    <a
      href={artifact.url}
      target="_blank"
      rel="noreferrer"
      style={{
        display: "flex", alignItems: "center", gap: "0.6rem",
        padding: "0.5rem 0.75rem",
        border: "1px solid #d6cfc4",
        background: artifact.featured ? "#edebe5" : "#f8f4ee",
        textDecoration: "none", cursor: "pointer",
        transition: "border-color .12s, background .12s",
        flex: "0 0 auto",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "#111";
        (e.currentTarget as HTMLElement).style.background = "#edebe5";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "#d6cfc4";
        (e.currentTarget as HTMLElement).style.background = artifact.featured ? "#edebe5" : "#f8f4ee";
      }}
    >
      <span style={{ fontSize: 11 }}>{artifact.icon || "🔗"}</span>
      <div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "#111", lineHeight: 1.3 }}>
          {artifact.label}
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "#7d766e", marginTop: 1 }}>
          {domain}
        </div>
      </div>
      <svg style={{ marginLeft: "auto", flexShrink: 0 }} width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#7d766e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17L17 7M17 7H7M17 7v10" />
      </svg>
    </a>
  );
}

function PdfCard({ artifact, onOpen }: { artifact: Artifact; onOpen: (a: Artifact) => void }) {
  return (
    <button
      onClick={() => onOpen(artifact)}
      style={{
        display: "flex", alignItems: "center", gap: "0.6rem",
        padding: "0.5rem 0.75rem",
        border: "1px solid #d6cfc4",
        background: artifact.featured ? "#edebe5" : "#f8f4ee",
        cursor: "pointer", transition: "border-color .12s",
        flex: "0 0 auto",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#111")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#d6cfc4")}
    >
      <span style={{ fontSize: 11 }}>📄</span>
      <div style={{ textAlign: "left" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "#111", lineHeight: 1.3 }}>
          {artifact.label}
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "#7d766e", marginTop: 1 }}>
          Click to view
        </div>
      </div>
      <svg style={{ marginLeft: "auto", flexShrink: 0 }} width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#7d766e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 3H21V9M21 3L9 15M10 3H3V21H21V14" />
      </svg>
    </button>
  );
}

function ArtifactRow({ knowledgeIds, onOpenPdf }: { knowledgeIds: string[]; onOpenPdf: (a: Artifact) => void }) {
  if (!knowledgeIds?.length) return null;
  const artifacts = knowledgeIds.flatMap((id) => KNOWLEDGE.find((k) => k.id === id)?.artifacts || []);
  if (!artifacts.length) return null;
  return (
    <div style={{ marginTop: "0.85rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
      {artifacts.map((a, i) =>
        a.type === "pdf"
          ? <PdfCard key={i} artifact={a} onOpen={onOpenPdf} />
          : <UrlCard key={i} artifact={a} />
      )}
    </div>
  );
}

function PDFViewer({ localKey }: { localKey: string }) {
  const preview = PDF_PREVIEWS[localKey];
  const filename = PDF_FILENAMES[localKey];

  if (!preview) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#7d766e", fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
        Drop the PDF into <code>/public/pdfs/{filename}</code> to enable inline preview.
      </div>
    );
  }

  return (
    <div style={{ height: "100%", overflowY: "auto", background: "white", padding: "2.5rem 3rem", fontFamily: "'EB Garamond', Georgia, serif" }}>
      <div style={{ borderBottom: "2px solid #111", paddingBottom: "1rem", marginBottom: "1.75rem" }}>
        <h1 style={{ fontSize: 22, fontWeight: 400, letterSpacing: "-0.02em", color: "#111", marginBottom: 4 }}>{preview.heading}</h1>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7d766e" }}>{preview.subhead}</p>
      </div>
      {preview.sections.map((s, i) => (
        <div key={i} style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "#7d766e", marginBottom: "0.5rem", paddingBottom: "0.3rem", borderBottom: "1px solid #edebe5" }}>
            {s.label}
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.78, color: "#111", whiteSpace: "pre-line" }}>{s.text}</div>
        </div>
      ))}
      <div style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #edebe5" }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "#d6cfc4", letterSpacing: "0.06em" }}>
          SOURCE · {filename} · To enable native PDF viewing: add file to /public/pdfs/ and replace PDFViewer with &lt;iframe src="/pdfs/{filename}" /&gt;
        </p>
      </div>
    </div>
  );
}

function PdfModal({ artifact, onClose }: { artifact: Artifact; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(19,16,12,0.65)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#f8f4ee", border: "1px solid #d6cfc4", width: "100%", maxWidth: 720, maxHeight: "90vh", display: "flex", flexDirection: "column" }}
      >
        <div style={{ padding: "0.75rem 1.25rem", borderBottom: "1px solid #d6cfc4", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#111" }}>
              {artifact.label}
            </span>
            {artifact.localKey && (
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "#7d766e", marginLeft: "0.75rem" }}>
                {PDF_FILENAMES[artifact.localKey]}
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            {artifact.url && (
              <a
                href={artifact.url} target="_blank" rel="noreferrer"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", color: "#7d766e", textDecoration: "none", border: "1px solid #d6cfc4", padding: "0.2rem 0.5rem", transition: "all .12s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#111"; (e.currentTarget as HTMLElement).style.color = "#111"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#d6cfc4"; (e.currentTarget as HTMLElement).style.color = "#7d766e"; }}
              >Open ↗</a>
            )}
            <button
              onClick={onClose}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", fontSize: 16, color: "#7d766e", lineHeight: 1 }}
            >×</button>
          </div>
        </div>
        <div style={{ flex: 1, overflow: "hidden", minHeight: 0 }}>
          {artifact.localKey && <PDFViewer localKey={artifact.localKey} />}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function PortfolioChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfArtifact, setPdfArtifact] = useState<Artifact | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  }, [input]);

  const send = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    const next: Message[] = [...messages, { role: "user", content: msg }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: data.answer || "Something went wrong.",
        artifact_ids: data.artifact_ids || [],
      }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong — try again.", artifact_ids: [] }]);
    } finally {
      setLoading(false);
    }
  };

  const empty = messages.length === 0 && !loading;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#f8f4ee", color: "#111", fontFamily: "'EB Garamond', 'Georgia', serif", fontSize: 18, lineHeight: 1.55 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes jdot { 0%,80%,100%{opacity:.25;transform:translateY(0)} 40%{opacity:1;transform:translateY(-3px)} }
        @keyframes fadein { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d6cfc4; border-radius: 2px; }
        .chip:hover { border-color: #111 !important; color: #111 !important; }
        .send-btn:hover:not(:disabled) { background: #c03328 !important; }
        .msg-in { animation: fadein .18s ease both; }
        textarea::placeholder { color: #7d766e; }
        a { color: inherit; }
      `}</style>

      {/* HEADER */}
      <header style={{ borderBottom: "1px solid #d6cfc4", padding: "0 1.5rem", height: 48, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#13100c", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#f8f4ee" }}>JJ</span>
          </div>
          <div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#111" }}>Jiahui Jin</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.1em", color: "#7d766e", marginLeft: "0.75rem" }}>AI PM · HEALTH TECH</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "1.25rem" }}>
          {[["LinkedIn", "https://linkedin.com/in/jiahui-jin"], ["Research", "https://healthai-trust.vercel.app"], ["Eval →", "https://trusteval.up.railway.app"]].map(([l, h]) => (
            <a key={l} href={h} target="_blank" rel="noreferrer"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#7d766e", textDecoration: "none", transition: "color .1s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#111")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#7d766e")}
            >{l}</a>
          ))}
        </div>
      </header>

      {/* BODY */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        {empty ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem 1.5rem 1rem", textAlign: "center" }}>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 400, lineHeight: 1.08, letterSpacing: "-0.025em", color: "#4a4540", marginBottom: "2.5rem", maxWidth: 520 }}>
              Ask me anything<br /><em>about Jia.</em>
            </h1>
            <div style={{ display: "flex", gap: "2rem", marginBottom: "2.5rem", flexWrap: "wrap", justifyContent: "center" }}>
              {[["1M+", "patients reached"], ["Cal Hacks", "1st of 2,500+"], ["MLH", "Top 50 globally"], ["836", "reviews scraped"]].map(([n, l]) => (
                <div key={n} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 500, color: "#111" }}>{n}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "#7d766e", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", justifyContent: "center", maxWidth: 540, marginBottom: "2rem" }}>
              {SUGGESTED.map(({ label, q }) => (
                <button key={label} className="chip" onClick={() => send(q)}
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.08em", padding: "0.3rem 0.75rem", background: "none", border: "1px solid #d6cfc4", color: "#7d766e", cursor: "pointer", transition: "all .12s" }}
                >{label}</button>
              ))}
            </div>
            {/* Quick artifact links */}
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", justifyContent: "center" }}>
              <button
                onClick={() => setPdfArtifact({ type: "pdf", label: "Resume — Microsoft AI", localKey: "resume" })}
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: "0.08em", padding: "0.25rem 0.65rem", border: "1px solid #d6cfc4", color: "#7d766e", background: "none", cursor: "pointer", transition: "all .12s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#111"; (e.currentTarget as HTMLElement).style.color = "#111"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#d6cfc4"; (e.currentTarget as HTMLElement).style.color = "#7d766e"; }}
              >📄 Resume</button>
              {[["🔬 Research", "https://healthai-trust.vercel.app"], ["⚡ Eval Tool", "https://trusteval.up.railway.app"], ["🏆 Cal Hacks", "https://devpost.com/software/duet-0tbkxe"]].map(([l, h]) => (
                <a key={l} href={h} target="_blank" rel="noreferrer"
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: "0.08em", padding: "0.25rem 0.65rem", border: "1px solid #d6cfc4", color: "#7d766e", textDecoration: "none", transition: "all .12s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#111"; (e.currentTarget as HTMLElement).style.color = "#111"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#d6cfc4"; (e.currentTarget as HTMLElement).style.color = "#7d766e"; }}
                >{l}</a>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, maxWidth: 680, width: "100%", margin: "0 auto", padding: "2rem 1.25rem 0.5rem", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            {messages.map((m, i) => {
              const isUser = m.role === "user";
              return (
                <div key={i} className="msg-in" style={{ display: "flex", flexDirection: isUser ? "row-reverse" : "row", alignItems: "flex-start", gap: "0.75rem" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, marginTop: 2, background: isUser ? "#edebe5" : "#13100c", border: isUser ? "1px solid #d6cfc4" : "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: isUser ? "#7d766e" : "#f8f4ee" }}>{isUser ? "R" : "JJ"}</span>
                  </div>
                  <div style={{ maxWidth: "82%", minWidth: 0 }}>
                    <div style={{ fontSize: "0.95rem", lineHeight: 1.78, color: isUser ? "#4a4540" : "#111", fontStyle: isUser ? "italic" : "normal" }}>
                      {m.content}
                    </div>
                    {!isUser && (m.artifact_ids?.length ?? 0) > 0 && (
                      <ArtifactRow knowledgeIds={m.artifact_ids!} onOpenPdf={setPdfArtifact} />
                    )}
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="msg-in" style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#13100c", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "#f8f4ee" }}>JJ</span>
                </div>
                <div style={{ paddingTop: "0.45rem" }}><TypingDots /></div>
              </div>
            )}
            <div ref={bottomRef} style={{ height: 1 }} />
          </div>
        )}
      </div>

      {/* INPUT */}
      <div style={{ borderTop: "1px solid #d6cfc4", padding: "0.85rem 1.25rem 1rem", background: "#f8f4ee", flexShrink: 0 }}>
        <div
          style={{ maxWidth: 680, margin: "0 auto", display: "flex", alignItems: "flex-end", gap: "0.6rem", border: "1px solid #d6cfc4", background: "#edebe5", padding: "0.6rem 0.75rem", transition: "border-color .12s" }}
          onFocusCapture={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#111")}
          onBlurCapture={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#d6cfc4")}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Ask about experience, research, projects…"
            rows={1}
            disabled={loading}
            style={{ flex: 1, background: "none", border: "none", outline: "none", fontFamily: "'EB Garamond', Georgia, serif", fontSize: "0.95rem", color: "#111", resize: "none", lineHeight: 1.55, maxHeight: 120, overflow: "auto" }}
          />
          <button
            className="send-btn"
            onClick={() => send()}
            disabled={!input.trim() || loading}
            style={{ flexShrink: 0, width: 28, height: 28, background: input.trim() && !loading ? "#13100c" : "#d6cfc4", border: "none", cursor: input.trim() && !loading ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .12s" }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={input.trim() && !loading ? "#f8f4ee" : "#a09890"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" />
            </svg>
          </button>
        </div>
        <p style={{ textAlign: "center", marginTop: "0.55rem", fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase", color: "#d6cfc4" }}>
          Powered by Jia's knowledge base · Built with Claude
        </p>
      </div>

      {/* PDF MODAL */}
      {pdfArtifact && <PdfModal artifact={pdfArtifact} onClose={() => setPdfArtifact(null)} />}
    </div>
  );
}

// Export the system prompt so the API route can import it
export { SYSTEM_PROMPT };
