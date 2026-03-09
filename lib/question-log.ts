/**
 * Logs questions asked in chat to Postgres (Railway).
 * Set DATABASE_URL in Railway (or .env.local) to enable.
 * If DATABASE_URL is missing, logging is skipped silently.
 */

import { Pool } from "pg";

let pool: Pool | null = null;

function getPool(): Pool | null {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return null;
  if (!pool) {
    pool = new Pool({ connectionString: url });
  }
  return pool;
}

const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS question_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  topic text,
  country text,
  region text,
  created_at timestamptz DEFAULT now()
);
`;

export async function logQuestion(params: {
  question: string;
  topic: string;
  country: string | null;
  region: string | null;
}): Promise<void> {
  const p = getPool();
  if (!p) return;
  try {
    const client = await p.connect();
    try {
      await client.query(CREATE_TABLE);
      await client.query(
        `INSERT INTO question_logs (question, topic, country, region) VALUES ($1, $2, $3, $4)`,
        [
          params.question.slice(0, 2000),
          params.topic || null,
          params.country || null,
          params.region || null,
        ]
      );
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("question-log:", err);
  }
}
