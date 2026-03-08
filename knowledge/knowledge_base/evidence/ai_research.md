# AI Research (Evidence)

Topic: ai_research

## Health AI Trust

Jiahui has conducted independent research on how trust forms between humans and AI systems in consumer healthcare. The project is called **Health AI Trust**.

**What she built:**
- **836 patient reviews** scraped across major consumer health AI platforms (WebMD, Teladoc, MDLive, Symptomate) plus 669 flagged cases from the HuggingFace AI Medical Chatbot dataset. Five trust failure modes emerged from this data.
- A **trust benchmark** comparing four models (Claude, ChatGPT, Gemini, Copilot) across 30 adversarial prompts and five dimensions from the Starke et al. (2025) framework: epistemic calibration, escalation accuracy, transparency of limitation, framing sensitivity, harm asymmetry.
- A **live eval tool** so anyone can compare AI responses on real patient-style questions (trusteval.up.railway.app). The research site is at healthai-trust.vercel.app.

**Product context:** Her interest in health AI trust is grounded in product work. While working on **Mira**, an AI health companion that reached **over 1 million patients** at NimbleRx, she saw that many health AI systems optimize for correctness and safety but not for trust as a measurable dimension. She also ran LLM safety evaluation on 10K+ medical messages across 20+ eval cycles. The research bridges that gap by measuring behaviors that precondition trust (calibrated uncertainty, escalation, transparency, emotional attunement).

**Key finding:** Transparency of Limitation is the worst-performing dimension across models; all scored below 4.0 on that dimension. She stated limitations publicly (single rater, 30 prompts directional not conclusive) as part of the work.

## AI Infrastructure Supply Chain (with Harish Krishnan)

Jiahui is also conducting research with **Harish Krishnan** on **systemic vulnerabilities in AI infrastructure supply chains**.

The work looks beyond semiconductors and GPUs to the broader physical infrastructure required for large-scale AI: electrical **transformers**, **HVAC** cooling systems, **industrial batteries**, thermal management, and energy infrastructure. Many of these components have long lead times (e.g. transformers can take 30+ months to procure) and concentrated production (e.g. China produces ~95% of HVAC compressors and ~75% of industrial batteries), creating fragility.

**Goal:** Build a **dependency map of the AI infrastructure supply chain** — identifying critical components, where they are produced, bottlenecks, and how disruptions (geopolitical, export restrictions, supply chain shocks) could affect AI deployment. The methodology draws on supply chain resilience modeling and multi-tier dependency mapping; Harish Krishnan’s work on blockchain in sustainable value chains informs the approach.
