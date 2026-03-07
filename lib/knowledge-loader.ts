import fs from 'fs'
import path from 'path'

const KNOWLEDGE_DIR = path.join(process.cwd(), 'knowledge')

// Files that always get included (high priority context)
const ALWAYS_INCLUDE = ['_index.md']

// Ordered sections for clean context assembly
const SECTION_ORDER = [
  '_index.md',
  'achievements.md',
  'experience/nimblyrx.md',
  'experience/other-roles.md',
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
 * For most personal portfolios, this fits well within Claude's context window.
 * 
 * If you grow to 100+ files, upgrade this to use vector search (see retrieval.ts)
 */
export async function readKnowledgeBase(): Promise<string> {
  const sections: string[] = []
  
  // First pass: load files in defined order
  for (const filePath of SECTION_ORDER) {
    const content = readFileContent(filePath)
    if (content) {
      const label = filePath.replace('.md', '').replace('/', ' / ').toUpperCase()
      sections.push(`\n\n### [${label}]\n\n${content}`)
    }
  }
  
  // Second pass: catch any files not in the ordered list
  const allFiles = getAllKnowledgeFiles()
  for (const filePath of allFiles) {
    if (!SECTION_ORDER.includes(filePath)) {
      const content = readFileContent(filePath)
      if (content) {
        const label = filePath.replace('.md', '').replace('/', ' / ').toUpperCase()
        sections.push(`\n\n### [${label}]\n\n${content}`)
      }
    }
  }
  
  return sections.join('\n')
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
