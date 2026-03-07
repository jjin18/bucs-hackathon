# jia-portfolio

Personal AI portfolio for Jiahui (Jia) Jin — a RAG-powered chat site where recruiters can ask anything and get answers grounded in her actual experience, with live artifact cards (PDFs, live URLs) surfaced inline.

## Quick Start

```bash
# 1. Install
npm install

# 2. Environment
cp .env.example .env.local
# Add: ANTHROPIC_API_KEY=your_key_here

# 3. Run locally
npm run dev
# → http://localhost:3000

# 4. Deploy
vercel
# Add ANTHROPIC_API_KEY in Vercel dashboard → Settings → Environment Variables
```

## Adding Your PDFs

Drop the three PDFs into `/public/pdfs/`:
- `Jiahui_Jin_Resume____Microsoft_AI.pdf`
- `NimbleRx_I_Meet_Mira_AI__NimbleRx_s_Vision_for_the_Future.pdf`
- `Trust_is_the_Frontier___Jiahui_Jin.pdf`

Then in `components/PortfolioChat.tsx`, replace the `PDFViewer` component body with:
```tsx
<iframe
  src={`/pdfs/${PDF_FILENAMES[localKey]}`}
  style={{ width: "100%", height: "100%", border: "none" }}
/>
```

## Project Structure

```
jia-portfolio/
├── app/
│   ├── page.tsx                  ← Entry point (imports PortfolioChat)
│   ├── layout.tsx                ← Metadata, HTML shell
│   ├── globals.css               ← Minimal reset
│   └── api/chat/route.ts         ← API: receives messages → returns {answer, artifact_ids}
│
├── components/
│   └── PortfolioChat.tsx         ← THE main file. Edit KNOWLEDGE array here.
│                                    Also contains: artifact cards, PDF modal, UI
│
├── lib/
│   ├── system-prompt.ts          ← Builds the Claude system prompt from knowledge files
│   └── knowledge-loader.ts       ← Reads /knowledge/**/*.md into context
│
├── knowledge/                    ← Plain markdown. Edit these to update Jia's info.
│   ├── _index.md                 ← Always loaded. Master 500-word profile.
│   ├── achievements.md
│   ├── experience/
│   │   ├── nimblyrx.md           ← Deep dive: Mira, eval framework, pharmacy agent
│   │   ├── other-roles.md        ← BlackBerry, VSP, Ottawa Hospital
│   │   └── ubc.md
│   ├── projects/
│   │   ├── health-ai-dashboard.md
│   │   └── calhacks-and-other.md
│   ├── skills/
│   │   └── technical.md
│   └── qa/
│       ├── recruiter-faq.md      ← PRE-WRITTEN ANSWERS. Most valuable file.
│       └── behavioral.md         ← STAR format stories
│
└── public/
    └── pdfs/                     ← Drop PDFs here for inline viewing
```

## How the RAG Works

1. On every chat message, `/lib/knowledge-loader.ts` reads all `/knowledge/*.md` files into one string
2. That string is injected into the Claude system prompt in `/lib/system-prompt.ts`
3. Claude returns structured JSON: `{"answer": "...", "artifact_ids": ["nimblyrx"]}`
4. The frontend renders the answer + artifact cards (URL links, PDF viewer) for matching ids

**No vector DB needed.** All knowledge files fit in Claude's context window.
Upgrade to vector search only when you hit ~100+ files.

## Updating Knowledge

All files are plain markdown — edit like a README:
- New job → `knowledge/experience/company-name.md`
- New project → `knowledge/projects/project-name.md`
- Update artifact links → edit `KNOWLEDGE` array in `components/PortfolioChat.tsx`
- Better interview answers → edit `knowledge/qa/recruiter-faq.md`
