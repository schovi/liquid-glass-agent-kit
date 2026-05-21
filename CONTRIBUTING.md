# Contributing

This is a spec-first monorepo with **two sibling plugins** that share the canonical spec:

- `plugins/liquid-glass-web/`    — web UI (HTML, CSS, React, JSX, Tailwind).
- `plugins/liquid-glass-native/` — native macOS UI (SwiftUI, AppKit).

Each plugin folder serves both Codex and Claude from one place — see `AGENTS.md` for the dotfile contract. There is no build step.

## Where to edit

- **Tokens, components, rules (shared)** — `spec/`.
- **Web skill content** — `plugins/liquid-glass-web/skills/liquid-glass-web-ui/`.
- **Native skill content** — `plugins/liquid-glass-native/skills/liquid-glass-native-ui/`.
- **Claude subagents** — `plugins/<plugin>/agents/`.
- **Copy/paste prompt** (web) — `prompts/copy-paste-compact.md`.
- **Examples** — `examples/macos-web/` (HTML/CSS), `examples/macos-native-swift/` (SwiftUI).
- **Docs** — `docs/`, `README.md`.

## Audit (web)

```bash
npm run validate
```

Runs the heuristic auditor against `examples/macos-web`. CI should run this on every PR.

## Token discipline

The point of the kit is that agents (and humans) do not invent token values. If you propose a new blur, saturation, padding, or radius value on the web side, it goes in `spec/tokens/*.yaml` and `references/tokens.md` first, then everywhere else.

## Apple

Do not commit Apple-owned assets (fonts, UI kit exports, icon sets, screenshots from Apple's documentation). The web profile is an inspired-by approximation; the native side wraps real Apple APIs but the kit itself is not endorsed.
