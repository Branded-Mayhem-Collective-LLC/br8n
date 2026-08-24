/* server.ts — a minimal MCP server over a folder of markdown.
 * Three tools, one resource list. Any MCP client (Claude, ChatGPT, Cursor,
 * Claude Code, your own agent) can point at the same folder; switch the model,
 * keep the memory. This is the open, GREEN-tier br8n brain: the file layout and
 * the door. The hosted br8n install adds retrieval, governance and operation
 * on top of the same files — the files never change shape. */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ToolAnnotations } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { listFiles, readFile, search } from "./brain.js";

const READ_ONLY_CLOSED_WORLD = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
} satisfies ToolAnnotations;

export function createServer(root: string): McpServer {
  const server = new McpServer({ name: "br8n", version: "0.1.2" });

  server.registerTool(
    "brain_list",
    {
      description: "List every markdown file in the brain (relative path, size, last modified).",
      inputSchema: {},
      annotations: READ_ONLY_CLOSED_WORLD,
    },
    async () => ({ content: [{ type: "text", text: JSON.stringify(await listFiles(root), null, 2) }] }),
  );

  server.registerTool(
    "brain_read",
    {
      description: "Read one file from the brain by relative path (e.g. decisions/2026-03-change-orders.md).",
      inputSchema: { path: z.string().describe("relative path inside the brain") },
      annotations: READ_ONLY_CLOSED_WORLD,
    },
    async ({ path }) => ({ content: [{ type: "text", text: await readFile(root, path) }] }),
  );

  server.registerTool(
    "brain_search",
    {
      description: "Literal, case-insensitive search across the brain. Returns file, line number and the matching line, so answers can cite the source.",
      inputSchema: {
        query: z.string().min(1),
        limit: z.number().int().min(1).max(200).optional(),
      },
      annotations: READ_ONLY_CLOSED_WORLD,
    },
    async ({ query, limit }) => ({ content: [{ type: "text", text: JSON.stringify(await search(root, query, limit ?? 50), null, 2) }] }),
  );

  return server;
}
