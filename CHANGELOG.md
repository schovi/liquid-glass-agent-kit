# Changelog

## 0.1.0 — initial v0.1

- Canonical spec (`spec/liquid-glass.profile.yaml`, tokens, components, rules, schemas).
- Single shared plugin at `plugins/liquid-glass-ui/`:
  - `.codex-plugin/plugin.json` for Codex
  - `.claude-plugin/plugin.json` for Claude
  - `skills/liquid-glass-web-ui/` shared by both
  - `agents/` with two Claude subagents (`liquid-glass-auditor`, `liquid-glass-implementer`)
- Codex and Claude marketplace catalogs pointing at the shared plugin folder.
- Compact copy/paste prompt for tools without plugin support.
- Vanilla HTML/CSS example exercising tab bar, toolbar, button, segmented control, card, and text field.
- Heuristic auditor (`scripts/audit-liquid-glass-html.mjs` inside the skill) that catches anti-patterns A1-A10.
