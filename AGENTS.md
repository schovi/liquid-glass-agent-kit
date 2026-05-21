# Agent contributor instructions

You are an agent making changes to this repo. Read this before editing.

## Source of truth

This repo uses one shared plugin folder for both Codex and Claude. Edit only:

- `spec/`
- `plugins/liquid-glass-ui/skills/liquid-glass-web-ui/`
- `plugins/liquid-glass-ui/agents/` (Claude subagents; Codex ignores this folder)
- `prompts/copy-paste-compact.md`
- `examples/`
- `docs/`

There is **no build step**. The skill folder is shared by both ecosystems.

## After every change

If you touched `examples/`, `plugins/liquid-glass-ui/skills/...`, or the audit script, run:

```bash
npm run validate
```

That runs the heuristic auditor against `examples/`.

## Token discipline

Never invent a blur, saturation, opacity, shadow, padding, or radius value. If a value is missing, add it to `spec/tokens/*.yaml` and `references/tokens.md` first, then reference it.

## Apple

Do not claim any output is "Apple-official" or "Apple-certified". The kit is an inspired-by approximation. Do not commit Apple fonts, Apple UI-kit exports, or Apple-owned screenshots.

## Why one folder for both ecosystems

`plugins/liquid-glass-ui/` contains:

- `.claude-plugin/plugin.json` — Claude reads this.
- `.codex-plugin/plugin.json` — Codex reads this; declares `skills = "./skills/"`.
- `skills/liquid-glass-web-ui/` — ONE copy used by both.
- `agents/` — Claude-only subagents; Codex ignores.

Both marketplace catalogs (`.agents/plugins/marketplace.json`, `.claude-plugin/marketplace.json`) point at the same folder. The two dotfile manifests do not collide, so there is no need to duplicate skills.

## Slash command naming

Because both ecosystems share the canonical skill folder name:

- Codex:  `$liquid-glass-web-ui …`
- Claude: `/liquid-glass-ui:liquid-glass-web-ui …`

The Claude form is slightly repetitive (plugin name then skill name); that is the cost of eliminating duplication.

## Subagent boundaries

- `liquid-glass-auditor` is read-only (`disallowedTools: Write, Edit`). Keep it that way.
- `liquid-glass-implementer` may write. Both reference the canonical skill by its real name.
