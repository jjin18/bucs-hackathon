# Question logs (messages + region)

The chat logs each question asked, plus the **topic** and **region** (country + region from IP), to a Postgres table. No logs are written if `DATABASE_URL` is not set.

## 1. Add Postgres on Railway

1. In the **Railway dashboard**, open your project (the one that runs jia-portfolio).
2. Click **+ New** → **Database** → **PostgreSQL**.
3. Railway will create a Postgres service and give it a **DATABASE_URL** (in the service’s **Variables** tab).

## 2. Connect the app to Postgres

1. Open your **app service** (the Next.js app) in Railway.
2. Go to **Variables**.
3. Add a variable that points to the Postgres URL:
   - Either use **Reference** and select the Postgres service’s `DATABASE_URL`.
   - Or copy the **Connection URL** from the Postgres service’s **Connect** tab and add it as `DATABASE_URL` in the app’s variables.
4. Redeploy the app so the new variable is used.

The table `question_logs` is created automatically on first use (no manual migration).

## 3. Where to view the data

**Option A: Railway dashboard**

1. Open your project in Railway.
2. Click the **Postgres** service.
3. Open the **Data** tab (or **Query** if available) to browse tables and run SQL.
4. Run: `SELECT * FROM question_logs ORDER BY created_at DESC LIMIT 100;` to see recent questions, topic, country, region, and time.

**Option B: External client (TablePlus, DBeaver, psql)**

1. In the Postgres service, open **Connect** or **Variables** and copy the **Connection URL** (or build it from host, port, user, password, database).
2. Use that URL in TablePlus, DBeaver, or `psql` to connect.
3. Open the `question_logs` table or run the same `SELECT` as above.

**Columns in `question_logs`**

| Column     | Description                          |
|-----------|--------------------------------------|
| `id`      | UUID, auto-generated                 |
| `question`| The message the user sent (max 2000 chars) |
| `topic`   | Detected topic (e.g. work_experience, virality) |
| `country` | 2-letter country code (e.g. US, CA)  |
| `region`  | State/region code (e.g. CA, TX)       |
| `created_at` | When the question was logged (UTC) |

## 4. Local development

To test logging locally, add `DATABASE_URL` to `.env.local` (use the same URL from Railway Postgres or a local Postgres instance). The table will be created on the first logged question.
