# Health AI Trust Research — Independent Project
**Live: healthai-trust.vercel.app | Live Eval Tool: trusteval.up.railway.app**

## The Core Argument
Clinical accuracy benchmarks (like MedQA) tell you if a model is right. In consumer health AI, that's not enough. Outcomes also depend on whether users understand the answer, calibrate their trust appropriately, and take appropriate next steps. A model can be correct and still fail through overconfidence, unclear escalation, or poor emotional alignment.

**The behaviors that precondition trust are measurable**: Calibrated uncertainty, appropriate escalation, transparent limitation, and emotional attunement. Starke et al. (2025) identifies these across health AI contexts. No team had operationalized them into an evaluation framework. I built a proof of concept showing it can be done.

## What I Built
**Two validation approaches:**

### Validation 1 — User Data (836 reviews)
Built a scraper targeting 1–3 star reviews from major consumer health AI platforms: WebMD (225), Teladoc (225), MDLive (225), Symptomate (161). Also synthesized 669 flagged patient conversation cases from the HuggingFace AI Medical Chatbot dataset.

**Five trust failure modes emerged:**
- **F01 Dropoff at Paywall**: Paywalls at the moment of need destroy trust instantly
- **F02 Symptom Checker Dead End**: Listing possibilities without answers makes anxiety worse
- **F03 Dangerous Confidence Gap**: Incorrect answers delivered with high confidence
- **F04 Cold at the Worst Moment**: Information without emotional acknowledgment feels inhuman
- **F05 Monetization Erodes Credibility**: Charging patients and then refusing care destroys longitudinal trust

### Validation 2 — Trust Benchmark (4 models, 5 dimensions)
Benchmarked Claude, ChatGPT, Gemini, and Copilot across 30 adversarial prompts drawn from real patient reviews and the HuggingFace dataset.

**The finding**: Transparency of Limitation is the worst-performing dimension. All models scored below 4.0; three of four scored below 3.6. Models ship the disclaimer ("I'm not a doctor") but not the behavior that makes it useful — per-answer clarity on what to trust, when to escalate, and what to do next.

**Full scores (1–5 scale):**

| Dimension | Claude | ChatGPT | Gemini | Copilot |
|---|---|---|---|---|
| Epistemic Calibration | 4.00 | 4.63 | 3.93 | 4.43 |
| Escalation Accuracy | 3.97 | 3.97 | 3.93 | 3.90 |
| Transparency of Limitation | 2.73 | 3.57 | 2.77 | 4.00 |
| Framing Sensitivity | 3.63 | 3.73 | 3.47 | 3.93 |
| Harm Asymmetry | 4.03 | 4.30 | 4.07 | 3.83 |
| **Overall** | **3.67** | **4.04** | **3.63** | **4.02** |

**Key finding**: 8% drop in public trust in health AI from 2025 to 2026. Zero existing benchmarks specifically measure consumer health AI trust behaviors.

## What I Would Build at Microsoft (the actual pitch)
1. **Ship a Consumer Health Trust Benchmark** — 500+ realistic health prompts, scored by clinical raters on clarity, calibration, escalation, and transparency. This becomes the bar for all consumer health AI. (I ran this at NimbleRx on 10K+ medical messages across 20+ eval cycles.)
2. **Make transparency actionable** — Per-answer: what we don't know, what would change the answer, when to escalate. Unclear AI responses were the top drop-off driver in 60+ NimbleRx interviews; precise language cut friction.
3. **Design for follow-through** — When escalation is recommended, the next step is one tap (message clinician, Teams referral, care action). Success metric: % completing the next step when escalation is recommended.

## Honest Limitations (stated plainly)
- Single rater, no medical background — score deltas of 0.1–0.2 are directional, not conclusive
- 30 prompts is insufficient at scale — valid benchmark needs hundreds per category
- Starke et al. was a conceptual paper, not designed as a scoring tool — translating it to 1–5 behavioral criteria is a deliberate extension
- Scraping coverage was limited to 4 platforms
- Evaluator bias possible — built by someone applying for the Microsoft health AI role
- Blind evaluation protocols were not used

**Why I stated the limitations publicly**: A PM who understands the limits of their own data is more useful than one who overclaims. This is proof of concept to show the measurement infrastructure is worth building — not a peer-reviewed study.

## References
Starke G, Gille F, et al. (2025). Finding Consensus on Trust in AI in Health Care: Recommendations From a Panel of International Experts. Journal of Medical Internet Research. DOI: 10.2196/56306

## Strategic Context
This was built as the centerpiece of outreach to Bay Gross (co-lead of Microsoft's Healthcare unit) and recruiter Adam Gayton. The scoring spreadsheet was shared via OneDrive — intentionally using Microsoft Suite.
