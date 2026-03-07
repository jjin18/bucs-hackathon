# Behavioral Stories — STAR Format

## Shipping Under Constraints (NimbleRx)

**Q: Tell me about a time you navigated a hard tradeoff**

**Situation**: During Mira's development at NimbleRx, I identified through 60+ patient and pharmacist interviews that unclear AI responses were the top driver of task drop-off — patients would ask a health question, get a response that was technically accurate but tonally off or poorly framed, and disengage. This was a product problem masquerading as a model problem.

**Task**: Decide whether to delay launch to fix response quality, ship with known gaps, or find a middle path.

**Action**: I built the evaluation framework before making the call. Curated 10K medical messages, ran 20+ eval cycles, and documented the gap precisely — not as "quality feels off" but as specific failure patterns (unclear limitation statements, escalation missing, emotional misalignment). Then I proposed a phased approach: ship Mira with explicit scope constraints in the UI for the highest-risk response types, while running parallel eval cycles to close the gaps. I wrote the decision doc naming the tradeoff explicitly — speed vs. safety profile — and got clinical, engineering, and ops aligned on the same definition of "acceptable."

**Result**: Launched Mira on schedule to 1M patients. Eval framework became the gate for all AI feature launches. Clinical review time decreased because everyone reviewed against the same criteria.

---

## Building Without Authority (NimbleRx Eval Framework)

**Q: Tell me about a time you led without a formal mandate**

**Situation**: The LLM eval framework didn't exist when I arrived at NimbleRx. AI features were being tested ad-hoc. Clinical, engineering, and ops teams had different intuitions about what "safe" output looked like — and none of them were wrong, they just weren't aligned.

**Task**: Create a shared framework that three teams with different incentives would actually use.

**Action**: Instead of writing a framework from my perspective and presenting it as the answer, I ran a calibration session first. All three teams independently scored the same set of AI outputs, then I facilitated a discussion on where they diverged. The divergence was the framework — each gap represented a dimension that needed to be made explicit. I documented the failure modes each team was most afraid of, built the rubric to catch all of them simultaneously, then ran a second calibration session to validate it.

**Result**: Framework adopted as the production gate for all new AI feature launches. Calibration sessions became recurring. The fact that it emerged from their concerns, not my ideas, meant there was no political resistance.

---

## Building From Scratch (Ottawa Hospital)

**Q: Tell me about a time you worked on a technically hard problem**

**Situation**: As a data science researcher at the Ottawa Hospital's Sachs Lab, I was working on Parkinson's biomarker detection from EEG data — a domain where I had no prior clinical knowledge and a very small team.

**Task**: Build an ML pipeline that could achieve meaningful accuracy on 900K data points, 100K+ features, and achieve classification accuracy on disease progression signals.

**Action**: Started with the biology — I needed to understand what neurologists were actually looking at before I could encode it. Learned MNE for EEG preprocessing, built the data pipeline, ran feature engineering to reduce the 100K+ features to signal, then trained TensorFlow classification models. Iterated based on what the clinical team found meaningful in my Matplotlib visualizations.

**Result**: 85% accuracy on Parkinson's biomarker detection. First substantive ML project I shipped, and the moment I understood that health AI requires deep domain partnership, not just technical execution.

---

## Consumer Insight from Building in Public (Hatch)

**Q: Tell me about a time you validated (or invalidated) a product assumption**

**Situation**: I assumed Hatch's core value was video performance prediction — helping creators know if a video would perform before they posted. I built the initial prototype around that assumption.

**Task**: Validate the assumption through actual customer conversations before building further.

**Action**: Ran 25 structured user interviews with growth and marketing teams (the actual buyers, not just creators). The finding: they didn't care about prediction — they cared about reducing editing decision time and having a consistent quality bar across the team. The prediction feature was cool; the time-savings was the purchase motivation.

**Result**: Rebuilt the core pipeline around the real use case — FastAPI + Whisper + FFmpeg pipeline trained on 1K+ clips, reducing editing decisions by 70%. Secured 3 paid pilots from customer feedback. The original feature assumption was wrong; the pivot was only possible because I validated early.

---

## Adversarial Research (Health AI Trust Benchmark)

**Q: Tell me about a time you did something that required both technical and strategic thinking simultaneously**

**Situation**: I wanted to work on health AI at Microsoft. I could send a resume. Or I could do something that proved I thought at the right level about the problem.

**Task**: Build an original research artifact that was technically rigorous, strategically relevant to Microsoft, and honest about its limitations.

**Action**: Started with the research gap — no standardized benchmark for consumer health AI trust behaviors existed. Built a scraper, pulled 836 real patient reviews across 4 platforms, synthesized five failure modes. Then designed a 30-prompt adversarial test set drawn from real patient questions, scored four models (Claude, ChatGPT, Gemini, Copilot) across five Starke et al. trust dimensions. Shipped the research site at healthai-trust.vercel.app and the live eval tool at trusteval.up.railway.app. Stated the limitations publicly and plainly — single rater, 30 prompts insufficient at scale, evaluator bias possible.

**Result**: Used as the centerpiece of outreach to Bay Gross (Microsoft Healthcare co-lead) and recruiter Adam Gayton. The finding — Copilot performs best on Transparency of Limitation (4.0), second-best overall — gave me something specific to say about Microsoft's position and the clear improvement surface. Shared the scoring spreadsheet via OneDrive intentionally.
