import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listFiles, readFile, search, safeResolve } from "../dist/brain.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..", "template", "brain");

test("lists the template files", async () => {
  const files = await listFiles(root);
  assert.ok(files.length >= 5, "template has at least five files");
  assert.ok(files.some(f => f.rel.startsWith("decisions/")));
});
test("reads a file", async () => {
  const txt = await readFile(root, "README.md");
  assert.match(txt, /brain/i);
});
test("search cites file and line", async () => {
  const hits = await search(root, "decision");
  assert.ok(hits.length > 0);
  assert.ok(hits[0].rel && hits[0].line > 0);
});
test("refuses paths outside the brain", () => {
  assert.throws(() => safeResolve(root, "../../etc/passwd"));
});
