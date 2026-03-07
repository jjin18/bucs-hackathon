# jia-portfolio

Personal AI portfolio — RAG-powered chat with artifact cards (PDFs, URLs).

## Run locally (fix for ERR_CONNECTION_REFUSED)

**Important:** The dev server must run **from this project folder**. If you run `npm run dev` from another folder, nothing will listen on port 3005 and you’ll get connection refused.

**Easiest:** Double-click **`start.bat`** (or run **`start.ps1`** in PowerShell).  
This starts the server from the correct folder and opens **http://127.0.0.1:3005** in your browser.

**Or manually:**

```bash
cd c:\Users\jiahu\Downloads\jia-portfolio   # or your actual path
npm run dev
```

Then open **http://127.0.0.1:3005** (or http://localhost:3005).

## Setup

```bash
npm install
cp .env.example .env.local
# Add ANTHROPIC_API_KEY=your_key to .env.local
```

## Deploy

`vercel` — set `ANTHROPIC_API_KEY` in Vercel → Settings → Environment Variables.
