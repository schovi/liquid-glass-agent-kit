# Contributing

This is a spec-first monorepo with a single shared plugin folder for both Codex and Claude.

## Where to edit

- **Tokens, components, rules** — `spec/`.
- **Skill content** — `plugins/liquid-glass-ui/skills/liquid-glass-web-ui/`.
- **Claude subagents** — `plugins/liquid-glass-ui/agents/`.
- **Copy/paste prompt** — `prompts/copy-paste-compact.md`.
- **Examples** — `examples/`.
- **Docs** — `docs/`, `README.md`.

There is no build step — Codex and Claude both read from the same folder.

## Audit

Examples must pass the heuristic auditor:

```bash
npm run validate
```

CI should run this on every PR.

## Token discipline

The point of the kit is that agents (and humans) do not invent token values. If you propose a new blur, saturation, padding, or radius value, it goes in `spec/tokens/*.yaml` and `references/tokens.md` first, then everywhere else.

## Apple

Do not commit Apple-owned assets (fonts, UI kit exports, icon sets, screenshots from Apple's documentation). The kit is an inspired-by approximation, not a redistribution.
