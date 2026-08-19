# This folder is the brain

Plain markdown, one idea per file, grouped by the kind of thing an operation actually needs to remember. Nothing in here requires br8n, an account, or a particular model. If you can `cp -r brain/ somewhere-else/`, you own it.

| Folder | What goes here | The test |
|---|---|---|
| `how-we-work/` | the way things actually get done here, one process per file | a new hire could follow it |
| `decisions/` | what was decided, when, by whom, and why; dated filenames | the model can say "this conflicts with what you decided in March" |
| `exceptions/` | the "we don't do it that way here" cases and the reason | the thing everyone re-explains |
| `handoffs/` | who hands what to whom, and what "done" means at each step | the gap between two people |
| `voice/` | how you write and what you refuse to say | drafts sound like you, not like a committee |

Rules that keep it portable:

1. Markdown and plain text only. No proprietary formats, no database.
2. One file = one thing. Dated filenames for decisions (`2026-03-14-change-orders-after-signoff.md`).
3. Write the *why*. A decision without its reason can't push back later.
4. The brain is the record; the model is a reader. Switch models, keep the folder.
