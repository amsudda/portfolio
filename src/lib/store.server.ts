/**
 * Server-only project store.
 *
 * Driver is selected by environment:
 *   - DATABASE_URL set  → PostgreSQL (production / Coolify)
 *   - otherwise         → JSON file at ${DATA_DIR:-.data}/projects.json (local dev)
 *
 * Both drivers seed from the static src/data/projects.ts on first use. This file
 * must never be imported into client code (it pulls in `pg` and `node:fs`); reach
 * it through the server functions in projects.fn.ts or the /api route handlers.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { projects as seed, type Project } from "@/data/projects";

const DATABASE_URL = process.env.DATABASE_URL;
const DATA_DIR = process.env.DATA_DIR || ".data";
const usePg = !!DATABASE_URL;

/* ----------------------------- Postgres ----------------------------- */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let poolPromise: Promise<any> | null = null;
async function getPool() {
  if (!poolPromise) {
    poolPromise = import("pg").then(({ default: pg }) => {
      const pool = new pg.Pool({ connectionString: DATABASE_URL });
      return pool;
    });
  }
  return poolPromise;
}

let ensured = false;
async function ensurePg() {
  if (ensured) return;
  const pool = await getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id         text PRIMARY KEY,
      slug       text NOT NULL,
      position   double precision NOT NULL DEFAULT 0,
      data       jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `);
  const { rows } = await pool.query("SELECT count(*)::int AS n FROM projects");
  if (rows[0].n === 0) {
    let pos = 0;
    for (const p of seed) {
      await pool.query(
        "INSERT INTO projects (id, slug, position, data) VALUES ($1,$2,$3,$4) ON CONFLICT (id) DO NOTHING",
        [p.id, p.slug, pos++, p],
      );
    }
  }
  ensured = true;
}

/* ----------------------------- JSON file ---------------------------- */

function filePath() {
  return path.isAbsolute(DATA_DIR)
    ? path.join(DATA_DIR, "projects.json")
    : path.join(process.cwd(), DATA_DIR, "projects.json");
}

async function readFileStore(): Promise<Project[]> {
  try {
    const raw = await fs.readFile(filePath(), "utf8");
    return JSON.parse(raw) as Project[];
  } catch {
    await writeFileStore(seed);
    return seed;
  }
}

async function writeFileStore(list: Project[]) {
  const fp = filePath();
  await fs.mkdir(path.dirname(fp), { recursive: true });
  await fs.writeFile(fp, JSON.stringify(list, null, 2), "utf8");
}

/* ------------------------------ API ------------------------------ */

export async function listProjects(): Promise<Project[]> {
  if (usePg) {
    await ensurePg();
    const pool = await getPool();
    const { rows } = await pool.query(
      "SELECT data FROM projects ORDER BY position ASC, updated_at ASC",
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rows.map((r: any) => r.data as Project);
  }
  return readFileStore();
}

export async function getProject(slug: string): Promise<Project | undefined> {
  const all = await listProjects();
  return all.find((p) => p.slug === slug);
}

export async function upsertProject(project: Project): Promise<void> {
  if (usePg) {
    await ensurePg();
    const pool = await getPool();
    const existing = await pool.query("SELECT position FROM projects WHERE id=$1", [project.id]);
    let position: number;
    if (existing.rows[0]) {
      position = existing.rows[0].position;
    } else {
      const m = await pool.query("SELECT COALESCE(MAX(position),-1)+1 AS p FROM projects");
      position = m.rows[0].p;
    }
    await pool.query(
      `INSERT INTO projects (id, slug, position, data, updated_at)
       VALUES ($1,$2,$3,$4, now())
       ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, data = EXCLUDED.data, updated_at = now()`,
      [project.id, project.slug, position, project],
    );
    return;
  }
  const all = await readFileStore();
  const i = all.findIndex((p) => p.id === project.id);
  if (i === -1) all.push(project);
  else all[i] = project;
  await writeFileStore(all);
}

export async function deleteProject(id: string): Promise<void> {
  if (usePg) {
    await ensurePg();
    const pool = await getPool();
    await pool.query("DELETE FROM projects WHERE id=$1", [id]);
    return;
  }
  const all = await readFileStore();
  await writeFileStore(all.filter((p) => p.id !== id));
}
