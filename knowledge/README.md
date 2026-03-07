# Knowledge base — source files for your portfolio AI

Everything in this folder is loaded into the AI’s context. Edit these files to make answers more accurate and more “you.” The app reads them at runtime (no redeploy needed for content changes; restart the dev server if you don’t see updates).

## Files and what they’re for

| File | Purpose |
|------|--------|
| **\_index.md** | Master profile: who you are, numbers, contact, what makes you different. Start here. |
| **achievements.md** | Awards, hackathons, impact metrics, research, academic highlights. |
| **linkedin-posts.md** | Paste in LinkedIn post text. The AI uses this for voice, recent projects, and opinions. |
| **experience/nimblyrx.md** | NimbleRx / Mira / pharmacy AI role. |
| **experience/other-roles.md** | Other roles (BlackBerry, VSP, Ottawa Hospital, Hatch, etc.). |
| **experience/ubc.md** | UBC, BUCS, location, background. |
| **projects/health-ai-dashboard.md** | Health AI trust research, benchmark, eval tool. |
| **projects/calhacks-and-other.md** | Cal Hacks, Duet, MLH, other projects. |
| **skills/technical.md** | Technical skills, tools, stack. |
| **qa/recruiter-faq.md** | Common recruiter questions and how you answer them. |
| **qa/behavioral.md** | Behavioral / “tell me about a time” style answers. |

You can add new `.md` files (e.g. `experience/new-role.md` or `projects/new-project.md`). They’ll be picked up automatically and included in the knowledge base.

## How to use your LinkedIn posts

1. Open **knowledge/linkedin-posts.md**.
2. Copy the **text** of a LinkedIn post (not the image).
3. Paste it under a short heading, e.g.:
   ```markdown
   ### March 2025 — Shipping Mira to 1M patients
   [Your pasted post text here.]
   ```
4. Add more posts over time. Newer or more relevant posts near the top help the AI sound current.
5. Save the file and restart the dev server so the app reloads the knowledge.

LinkedIn doesn’t give a simple way to export posts automatically, so copying and pasting is the most reliable. You can paste full posts, quotes, or short updates — whatever you want the AI to be able to reference.

## Tips

- Use **numbers** (1M patients, 20+ cycles, etc.) — the AI will reuse them in answers.
- Keep **linkedin-posts.md** in your own voice; it helps the AI match your tone.
- For a new job or project, add a section in the right file (e.g. `experience/` or `projects/`) and, if you wrote about it on LinkedIn, add that text to **linkedin-posts.md** too.
