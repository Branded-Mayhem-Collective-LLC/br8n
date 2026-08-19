/* brain.ts — the plain-files brain: a folder of markdown, nothing else.
 * Everything here is deliberately boring: readdir, readFile, a grep.
 * "Files, not a login." If you can `cp -r` it, you own it. */
import { promises as fs } from "node:fs";
import path from "node:path";

export type BrainFile = { rel: string; bytes: number; mtime: string };

const MD = /\.(md|markdown|txt)$/i;

export async function listFiles(root: string): Promise<BrainFile[]> {
  const out: BrainFile[] = [];
  async function walk(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      if (e.name.startsWith(".") || e.name === "node_modules") continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) await walk(p);
      else if (MD.test(e.name)) {
        const st = await fs.stat(p);
        out.push({ rel: path.relative(root, p), bytes: st.size, mtime: st.mtime.toISOString() });
      }
    }
  }
  await walk(root);
  return out.sort((a, b) => a.rel.localeCompare(b.rel));
}

/** Resolve a relative path inside the brain; refuse anything that escapes it. */
export function safeResolve(root: string, rel: string): string {
  const abs = path.resolve(root, rel);
  const rootAbs = path.resolve(root) + path.sep;
  if (!(abs + path.sep).startsWith(rootAbs)) throw new Error(`refusing path outside the brain: ${rel}`);
  return abs;
}

export async function readFile(root: string, rel: string): Promise<string> {
  return fs.readFile(safeResolve(root, rel), "utf8");
}

export type Hit = { rel: string; line: number; text: string };

/** Case-insensitive literal search, line-level, capped. No vectors, no index — grep is the point. */
export async function search(root: string, query: string, limit = 50): Promise<Hit[]> {
  const q = query.toLowerCase();
  const hits: Hit[] = [];
  for (const f of await listFiles(root)) {
    const body = await readFile(root, f.rel);
    const lines = body.split(/\r?\n/);
    for (let i = 0; i < lines.length && hits.length < limit; i++) {
      if (lines[i].toLowerCase().includes(q)) hits.push({ rel: f.rel, line: i + 1, text: lines[i].trim().slice(0, 300) });
    }
    if (hits.length >= limit) break;
  }
  return hits;
}
