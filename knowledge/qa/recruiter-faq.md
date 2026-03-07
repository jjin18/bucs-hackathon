# Recruiter FAQ — Pre-Written Answers

## "Tell me about yourself" / "Walk me through your background"
I'm Jia — UBC BUCS (Business + CS, graduating 2026) based in Vancouver. I've been building at the intersection of AI and health for longer than most PM candidates — I was training TensorFlow models for Parkinson's biomarker detection at the Ottawa Hospital at 17. Most recently I was an AI PM intern at NimbleRx (YC W15), where I launched Mira — an AI health companion — to over a million patients, ran LLM safety evaluation on 10K curated medical messages across 20+ eval cycles, and deployed a pharmacy AI agent that reduced escalations 20% and saved pharmacies 150+ hours a month. I've also won Cal Hacks (1st overall, 2,500+ teams), placed MLH Top 50 out of 150,000+ hackers, and attended YC AI Startup School on invitation. Right now I'm doing independent research on health AI trust — I scraped 836 patient reviews, benchmarked four models across five trust dimensions, and shipped a live eval tool. The URL is trusteval.up.railway.app if you want to try it.

---

## "Why product management?"
I became a PM because I kept finding myself at the edge of every other role — too product-focused to be a pure engineer, too technical to sit cleanly on the business side. BUCS gave me both vocabularies, but it was running the full stack at NimbleRx — user research, spec writing, eval design, cross-functional coordination, weekly releases — that confirmed it. I'm most alive when I'm holding the full context of a problem and making the call. Not optimizing one variable. Owning the whole system.

---

## "Why health AI specifically?"
It's not a pivot — it's a through-line. I was doing ML research on Parkinson's detection at 17. I went to NimbleRx specifically to work in health AI, not just AI. I built independent research on health AI trust without anyone asking me to. The reason is simple: health AI is one of the few places where getting the product right has direct consequences for real people's decisions about their bodies. Most consumer health AI products are built by researchers or engineers who are brilliant but don't have the product instinct for how patients actually interact with health information under stress. My research surfaced five trust failure modes from 836 real patient reviews — including patients describing being charged $90 and turned away, or getting confident answers that were wrong. Those aren't model problems. They're product problems. That's what I want to fix.

---

## "What's your biggest PM accomplishment?"
Launching Mira to 1M patients at NimbleRx. The scale matters, but what I'm proudest of is what it required to get there: 60+ patient and pharmacist interviews before writing a single spec, navigating HIPAA and clinical safety constraints, building the LLM eval framework that became the gate for every AI feature we shipped, and coordinating engineering, UX, and pharmacy teams on weekly release cycles. I owned the full 0→1 roadmap. That's the complete PM stack — in a regulated, high-stakes environment where the errors have real costs.

---

## "Tell me about the health AI trust research"
I built it as original research and as a job application artifact — and I'm transparent about both. I scraped 836 patient reviews from WebMD, Teladoc, MDLive, and Symptomate (plus 669 flagged cases from the HuggingFace AI Medical Chatbot dataset) and identified five recurring trust failure modes. Then I benchmarked Claude, ChatGPT, Gemini, and Copilot across 30 adversarial prompts using the Starke et al. (2025) trust framework as my evaluation taxonomy.

The finding that stood out: Transparency of Limitation is the worst-performing dimension across all models — scoring below 4.0 for every model, and below 3.6 for three of four. Models ship the generic disclaimer. They don't ship the behavior that makes it useful: per-answer clarity on what to trust, when to escalate, what to do next. That's exactly what I want to build at Microsoft.

I stated the limitations publicly and plainly — single rater, 30 prompts is insufficient, evaluator bias possible. A PM who overclaims their own data is not useful. This is a proof of concept, not a peer-reviewed study. The goal was to show the infrastructure is worth building.

---

## "Tell me about a failure"
Hatch. I built video intelligence software, got to paying customers, went through the YC process, got direct feedback from Jared Friedman to focus on traction. I heard it, moved fast to onboard paid pilots — but I should have gotten there on my own earlier. I was optimizing the pitch narrative before the traction fully warranted it. The lesson I took: distribution is the product at the early stage. I now build validation checkpoints into every product cycle, not just fundraising milestones. It also made me more honest about what I'm actually good at — I'm better in a team environment with strong engineering partners than I am running everything alone.

---

## "How do you work with engineers?"
I write tight specs and stay out of implementation decisions. My job is to make the *what* and *why* so clear that engineers can make *how* decisions confidently without coming back to me at every edge case. I also believe in being technical enough to know when a constraint is real versus when it's a prioritization question dressed as a technical constraint. The BUCS background helps — I've written the pipelines and I know what scope creep looks like from the engineering side. At NimbleRx I was shipping weekly releases, which means the feedback loop with engineering was fast and the specs had to be right.

---

## "What's your weakness?"
I can over-index on getting the framing exactly right before moving — which is a strength in regulated health AI contexts but a liability when speed is the actual priority. I've gotten better at distinguishing when precision is necessary versus when good-enough-and-shipped beats perfect-and-delayed. NimbleRx was a context where upfront rigor was right — the eval framework we built caught real regressions. Hatch was a context where I learned the cost of over-refining before executing.

---

## "Where do you see yourself in 5 years?"
Leading a health AI product team — either at a company like Microsoft where scale matters, or at a Series B health AI startup where I can apply what I've learned with more resources and credibility. The goal is to have shipped products that measurably changed how people interact with their own health information. That's the 5-year target. The path is flexible; the destination isn't.

---

## "Why Microsoft / this role?"
Microsoft is building health AI at a scale and with a seriousness that most companies aren't. The infrastructure across Copilot, Teams, and Azure Health Data Services can support safe clinical augmentation in real clinical workflows — not just isolated chat demos. My research shows that Copilot performs best on Transparency of Limitation (4.0) and second-best overall (4.02) across the four models I benchmarked — which means there's a strong foundation AND a clear improvement surface. I want to work where the foundation is serious and the problem is real. And I intentionally shared my scoring spreadsheet via OneDrive.

---

## "Do you have questions for us?"
- What does the trust/safety evaluation infrastructure look like for consumer health AI features today?
- What's the biggest gap between where Microsoft Health AI is now and where it needs to be in 18 months?
- How does the PM role interface with clinical stakeholders — is clinical review embedded in the product cycle or consulted after?
