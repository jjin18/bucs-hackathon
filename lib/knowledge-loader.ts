import fs from 'fs'
import path from 'path'

const KNOWLEDGE_DIR = path.join(process.cwd(), 'knowledge')

// Files that always get included (high priority context)
const ALWAYS_INCLUDE = ['_index.md']

// Ordered sections for clean context assembly
const SECTION_ORDER = [
  '_index.md',
  'personal-rag.md',
  'achievements.md',
  'linkedin-posts.md',
  'virality.md',
  'leadership.md',
  'ai-research.md',
  'experience/nimblyrx.md',
  'experience/other-roles.md',
  'experience/policy-change.md',
  'experience/ubc.md',
  'projects/health-ai-dashboard.md',
  'projects/calhacks-and-other.md',
  'skills/technical.md',
  'qa/recruiter-faq.md',
  'qa/behavioral.md',
]

interface KnowledgeFile {
  path: string
  content: string
  tokens: number // rough estimate
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

function readFileContent(relativePath: string): string | null {
  const fullPath = path.join(KNOWLEDGE_DIR, relativePath)
  try {
    return fs.readFileSync(fullPath, 'utf-8')
  } catch {
    return null
  }
}

function getAllKnowledgeFiles(): string[] {
  const files: string[] = []
  try {
    if (!fs.existsSync(KNOWLEDGE_DIR) || !fs.statSync(KNOWLEDGE_DIR).isDirectory()) {
      return files
    }
  } catch {
    return files
  }

  function walkDir(dir: string, prefix = '') {
    let entries: fs.Dirent[]
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      if (entry.isDirectory()) {
        walkDir(path.join(dir, entry.name), `${prefix}${entry.name}/`)
      } else if (entry.name.endsWith('.md')) {
        files.push(`${prefix}${entry.name}`)
      }
    }
  }

  walkDir(KNOWLEDGE_DIR)
  return files
}

/**
 * Reads all knowledge files and assembles them into a single context string.
 * Format is optimized so the model can find sections quickly; no details are omitted.
 */
export async function readKnowledgeBase(): Promise<string> {
  const sectionEntries: { label: string; content: string }[] = []

  for (const filePath of SECTION_ORDER) {
    const content = readFileContent(filePath)
    if (content) {
      const label = filePath.replace('.md', '').replace(/\//g, ' / ').toUpperCase()
      sectionEntries.push({ label, content })
    }
  }

  const allFiles = getAllKnowledgeFiles()
  for (const filePath of allFiles) {
    if (!SECTION_ORDER.includes(filePath)) {
      const content = readFileContent(filePath)
      if (content) {
        const label = filePath.replace('.md', '').replace(/\//g, ' / ').toUpperCase()
        sectionEntries.push({ label, content })
      }
    }
  }

  const sectionList = sectionEntries.map((e) => `- [${e.label}]`).join('\n')
  const questionMap = `
PERSONAL QUESTIONS (answer these — do NOT say the unsure/reach-out message):
Any question about Jia as a person, what she likes, believes, does for fun, her life, interests, passions, preferences, hobbies, travel, food, philosophy, how she thinks, free time, favourite things → ALWAYS use [PERSONAL-RAG] and [INDEX]. The answers are there. Answer in her voice.

TOPIC BUTTONS (give EXTENSIVE answers — 4–8+ sentences, specific numbers and outcomes): Work experience, Health AI research, Hackathons, Why PM, Fav food, Virality, Leadership, Online persona. Use the sections below; do not give a one-line reply.

QUESTION → SECTIONS:
- Who is Jia? / tell me about you / intro / background → [INDEX], [PERSONAL-RAG] Identity
- Personal / your life / what do you like / hobbies / fun / free time / interests → [PERSONAL-RAG] Hobbies, Fat Fridays, Creative Expression, Taste, [INDEX] Personal
- Favourite food / restaurants / what does she eat → [PERSONAL-RAG] Food Exploration (Fat Fridays), [INDEX]. Answer ONLY as Jia: Fat Fridays, tier list 78k views, better than Beli, Taiwanese/Thai/Sichuan/Osaka. FORBIDDEN: "AI", "assistant", "I don't have preferences", "subjective experience". Answer positively.
- Beliefs / what does she think / healthcare / AI → [PERSONAL-RAG] Core Passions, Research Interests
- How does Jia think? / decision-making → [PERSONAL-RAG] Decision-Making Patterns
- Travel / places she's been → [PERSONAL-RAG] Solo Travel
- Courses / COMM 394 → [PERSONAL-RAG] Academic Interests, [EXPERIENCE / UBC]
- Work / NimbleRx / Cal Hacks / MLH → [INDEX] Real Numbers, [ACHIEVEMENTS], [EXPERIENCE / NIMBLYRX], [LINKEDIN-POSTS]
- Leadership / policy campaign / petition / 15k signatures / CUS / nwplus / Programs Co-Chair / student government → [LEADERSHIP]
- Policy change / petition at 17 → [LEADERSHIP], [EXPERIENCE / POLICY-CHANGE]
- UBC / BUCS / CUS / clubs → [EXPERIENCE / UBC], [LEADERSHIP]
- Virality / viral moments / reach / views / performative male contest / LinkedIn 900k / 5M / media coverage → [VIRALITY], [INDEX]
- Performative male / online persona → [VIRALITY], [PERSONAL-RAG] Creative Expression, [INDEX]
- LinkedIn / posts → [LINKEDIN-POSTS], [VIRALITY], [INDEX]
- Research / AI research / health AI trust / trust benchmark / 836 reviews / supply chain / Harish Krishnan / infrastructure → [AI-RESEARCH], [PROJECTS / HEALTH-AI-DASHBOARD], [EXPERIENCE / NIMBLYRX], [ACHIEVEMENTS]
- Only if topic is genuinely not anywhere above → say "I'm unsure but feel free to reach out to Jia and talk more here jiahui.k.jin@gmail.com"
`
  const intro = `# Jia's knowledge — use ONLY this to answer. Match the user's question to the map, then answer from that section.\n\nSections:\n${sectionList}\n${questionMap}\n---\n`

  const body = sectionEntries
    .map(({ label, content }) => `## [${label}]\n\n${content.trim()}\n`)
    .join('\n---\n\n')

  return intro + body
}

/**
 * Simple keyword-based retrieval for when you want to be selective.
 * Returns the most relevant files based on query keywords.
 * Good for faster responses or when context length is a concern.
 */
export async function retrieveRelevantChunks(query: string, maxFiles = 6): Promise<string> {
  const queryLower = query.toLowerCase()
  const allFiles = getAllKnowledgeFiles()
  
  // Score each file by keyword relevance
  const scored: { path: string; score: number; content: string }[] = []
  
  for (const filePath of allFiles) {
    const content = readFileContent(filePath)
    if (!content) continue
    
    const contentLower = content.toLowerCase()
    let score = 0
    
    // Always include _index.md
    if (filePath === '_index.md') score += 100
    
    // Score by keyword overlap
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 3)
    for (const word of queryWords) {
      const count = (contentLower.match(new RegExp(word, 'g')) || []).length
      score += count
    }
    
    // Boost FAQ and behavioral files for question-type queries
    if (queryLower.includes('?') || queryLower.startsWith('tell') || queryLower.startsWith('how') || queryLower.startsWith('why')) {
      if (filePath.includes('qa/')) score += 20
    }
    
    scored.push({ path: filePath, score, content })
  }
  
  // Sort by score, take top N
  scored.sort((a, b) => b.score - a.score)
  const topFiles = scored.slice(0, maxFiles)
  
  return topFiles.map(f => {
    const label = f.path.replace('.md', '').replace('/', ' / ').toUpperCase()
    return `### [${label}]\n\n${f.content}`
  }).join('\n\n---\n\n')
}
