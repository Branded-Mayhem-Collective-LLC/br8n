#!/usr/bin/env node
/* cli.ts — `br8n [path-to-brain]` starts the MCP server on stdio.
 * Default brain = ./brain (the template layout). */
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import path from "node:path";
import { createServer } from "./server.js";

const root = path.resolve(process.argv[2] ?? process.env.BR8N_BRAIN ?? "./brain");
const server = createServer(root);
const transport = new StdioServerTransport();
await server.connect(transport);
console.error(`[br8n] serving brain at ${root} over stdio`);
