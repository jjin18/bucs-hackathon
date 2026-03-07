# NimbleRx — AI Product Manager Intern
**May 2025 – August 2025 | Redwood City, CA | YC W15**

## The Role
AI PM intern at NimbleRx, a YC-backed tech-enabled pharmacy platform. I owned AI product features end-to-end — from patient-facing companions to backend pharmacy automation — in a HIPAA-regulated, clinically consequential environment.

## Mira AI — AI Health Companion
**What it is**: Mira is NimbleRx's conversational AI health companion. It helps patients get immediate, reliable answers about their health and medications, using de-identified medication history for personalized insights. It's multi-language, HIPAA compliant, and built with clear disclaimers that responses are for information only, not medical advice. The vision: evolve into a comprehensive AI Health Coach with medication/symptom tracking, personalized diet and exercise plans, and smart daily reminders.

**What I did**:
- Launched Mira to 1M patients — owned the full 0→1 roadmap, prioritization, and HIPAA safety architecture
- Interviewed 60+ patients and pharmacists, mapping unclear AI replies, tone issues, and task drop-off points
- Drove cross-functional execution across engineering, UX, and pharmacy teams on weekly release cycles
- Navigated HIPAA compliance, FDA AI guidance, and clinical safety constraints throughout

**The product surface**: Mira lives inside NimbleRx's patient app alongside pharmacy, refills, and messages. It handles health questions (medication side effects, interactions, refill timing), routes complex questions appropriately, and is designed to boost patient engagement and medication adherence.

**Published**: NimbleRx publicly announced Mira AI: nimblerx.com/articles/meet-mira-ai-nimblerxs-vision-for-the-future

## LLM Safety & Eval Infrastructure
**What I built**: A systematic evaluation framework for LLM outputs in pharmacy and health contexts — the gate that all AI features had to pass before reaching patients.

**The specifics**:
- Curated 10K medical messages as the golden evaluation dataset
- Ran 20+ eval cycles across model versions and feature iterations
- Mapped evaluation criteria to real failure modes found in patient/pharmacist interviews: unclear AI replies, tone mismatches, task drop-offs
- Unclear AI responses were the top drop-off driver across 60+ interviews — precise language cut friction

**Why it mattered**: This is the exact infrastructure that's missing from most consumer health AI products. My independent research (healthai-trust.vercel.app) later proved that transparency of limitation is the worst-performing dimension across all major models — which is exactly what we were catching in eval cycles at NimbleRx.

## Pharmacy Support AI Agent
**What it did**: An LLM-powered agent handling pharmacy workflow tasks — patient inquiries, refill processing, exception handling — freeing pharmacists from administrative work to focus on complex patient care.

**My contribution**: Product scoping, behavior spec, escalation criteria design, evaluation integration.

**Impact**:
- Reduced escalations 20%
- Saved pharmacies 150+ hours/month
- Boosted patient engagement and adherence

## What I Learned
Health AI requires a different product philosophy than consumer apps. Speed-to-ship has to be balanced against harm avoidance in a way that most PM frameworks don't account for. The fastest path through a regulated environment is more upfront rigor — building evaluation into the product cycle, not bolting it on at the end. I also learned that the hardest part of health AI isn't the model — it's getting clinical, engineering, and ops teams to share ownership of what "safe" means.
