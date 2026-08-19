# br8n

**Owned, portable working memory.** A plain-files brain template and a tiny MCP server that lets any model read it.

> Everything your team has taught a chat tool about how the work gets done is sitting inside somebody else's login. Switch tools and you're a stranger again. This repo is the other direction: the memory lives in files you own, and the model is just a reader.

br8n is the AI delivery practice of [Branded Mayhem Collective](https://brandedmayhem.com). This is the open part: the file layout and the door. The hosted install adds retrieval, governance, and someone running it with you — on the same files, which never change shape. [br8n.io](https://br8n.io)

## What's here

- `template/brain/` — the brain layout: `how-we-work/`, `decisions/`, `exceptions/`, `handoffs/`, `voice/`. Markdown only. One file, one thing. Write the *why*, so the model can push back later.
- `src/` — an MCP server (stdio) with three tools: `brain_list`, `brain_read`, `brain_search`. Search returns file + line so answers cite their source. No vectors, no index, no account. Grep is the point.

## Use it

```bash
npx @br8n/mcp ~/my-brain                         # MCP server on stdio (or: npm i -g @br8n/mcp && br8n ~/my-brain)
# template: git clone https://github.com/Branded-Mayhem-Collective-LLC/br8n && cp -r br8n/template/brain ~/my-brain
```

Claude Desktop / Claude Code / Cursor (any MCP client) — add:

```json
{ "mcpServers": { "br8n": { "command": "npx", "args": ["-y", "@br8n/mcp", "/path/to/my-brain"] } } }
```

Then ask the model something the brain knows. It answers from the file and names it. Switch the model; same answer, same file.

## Why files

- **Portable.** `cp -r brain/ new-machine/` is the whole migration. If you can't do that, you don't own it.
- **Inspectable.** You can read every byte the model reads.
- **Model-agnostic.** The folder doesn't care which model is on the other side of MCP.
- **It can push back.** A decision stored with its *why* lets a model say "this conflicts with what you decided in March." A chat history can't.

## The method is public on purpose

The layout and this server are MIT. What br8n charges for is hands on a real operation: eliciting what's actually in people's heads, shaping retrieval for the role, running it, and keeping it current. If you'd rather do it yourself, start here — most people should. The free first course is at [br8n.io/lab](https://br8n.io/lab).

## Not affiliated

`br8n` on PyPI (a context-capture engine by a different author) is not this project.

MIT © 2026 Branded Mayhem Collective LLC

## Publishing (maintainers)

```bash
npm login && npm publish --access public          # 1. publishes @br8n/mcp (org: br8n); package.json carries mcpName
mcp-publisher login github                        # 2. GitHub device-flow auth (org member)
mcp-publisher publish                             # 3. lists io.github.Branded-Mayhem-Collective-LLC/br8n in the official MCP registry
```
