import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../dist/server.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..", "template", "brain");
const expectedAnnotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};

async function withClient(run) {
  const server = createServer(root);
  const client = new Client({ name: "br8n-test", version: "1.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

  await Promise.all([
    server.connect(serverTransport),
    client.connect(clientTransport),
  ]);

  try {
    await run(client);
  } finally {
    await Promise.allSettled([client.close(), server.close()]);
  }
}

function textFrom(result) {
  const item = result.content.find((content) => content.type === "text");
  assert.ok(item, "tool result includes text content");
  return item.text;
}

test("advertises all tools with explicit read-only annotations", async () => {
  await withClient(async (client) => {
    const { tools } = await client.listTools();
    const byName = Object.fromEntries(tools.map((tool) => [tool.name, tool]));

    assert.equal(client.getServerVersion()?.version, "0.1.2");

    assert.deepEqual(Object.keys(byName).sort(), [
      "brain_list",
      "brain_read",
      "brain_search",
    ]);

    for (const tool of Object.values(byName)) {
      assert.deepEqual(tool.annotations, expectedAnnotations);
    }
  });
});

test("calls brain_list, brain_read, and brain_search over MCP", async () => {
  await withClient(async (client) => {
    const listResult = await client.callTool({ name: "brain_list", arguments: {} });
    assert.notEqual(listResult.isError, true);
    const files = JSON.parse(textFrom(listResult));
    assert.ok(files.some((file) => file.rel === "README.md"));

    const readResult = await client.callTool({
      name: "brain_read",
      arguments: { path: "README.md" },
    });
    assert.notEqual(readResult.isError, true);
    assert.match(textFrom(readResult), /brain/i);

    const searchResult = await client.callTool({
      name: "brain_search",
      arguments: { query: "decision", limit: 5 },
    });
    assert.notEqual(searchResult.isError, true);
    const hits = JSON.parse(textFrom(searchResult));
    assert.ok(hits.length > 0);
    assert.ok(hits.every((hit) => hit.rel && hit.line > 0));
  });
});

test("brain_read refuses paths outside the brain over MCP", async () => {
  await withClient(async (client) => {
    const result = await client.callTool({
      name: "brain_read",
      arguments: { path: "../../etc/passwd" },
    });

    assert.equal(result.isError, true);
    assert.match(textFrom(result), /refusing path outside the brain/i);
  });
});
