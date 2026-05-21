# Agent contributor instructions

You are an agent making changes to this repo. Read this before editing.

## Source of truth

This repo hosts **two sibling plugins** sharing one canonical spec:

- `plugins/liquid-glass-web/`    — Liquid Glass web UI (HTML, CSS, React, JSX, Tailwind).
- `plugins/liquid-glass-native/` — Liquid Glass native macOS UI (SwiftUI, AppKit).

Each plugin folder serves both Codex (`.codex-plugin/`) and Claude (`.claude-plugin/`) from one place. There is no build step.

Edit only:

- `spec/`
- `plugins/liquid-glass-web/skills/liquid-glass-web-ui/`
- `plugins/liquid-glass-web/agents/`            (Claude subagents)
- `plugins/liquid-glass-native/skills/liquid-glass-native-ui/`
- `plugins/liquid-glass-native/agents/`         (Claude subagents)
- `prompts/copy-paste-compact.md`               (web only, for now)
- `examples/`
- `docs/`
- `.claude/skills/liquid-glass-sync/`           (local sync workflow)

## Cross-cutting changes — design system inventory

The repo has three representations of the same design system and they
must never drift. The single human-readable inventory that maps
everything together lives at:

- `docs/design-system.md` — every token, component, pattern, and rule with side-by-side pointers to its spec entry, web rendering, native rendering, Apple API, and caveats.

For any change that touches tokens, components, rules, or cross-cutting
patterns, route through the local sync skill instead of editing
ad-hoc:

- `.claude/skills/liquid-glass-sync/SKILL.md`

Order of operations is fixed: **spec → docs/design-system.md → examples/macos-web → examples/macos-native-swift**, with a self-audit (`npm run validate` for web, `swift build` for native) before declaring done. Single-rendering bug fixes (CSS typo, Swift compile error that doesn't touch the design system) do NOT need this skill — fix them in place.

## After every change

If you touched the web skill, the audit script, or `examples/macos-web`, run:

```bash
npm run validate
```

That runs the heuristic auditor against `examples/macos-web`.

The native side has no audit script yet — its skill is consumed by an LLM and verified by building `examples/macos-native-swift`.

## Token discipline (web)

Never invent a blur, saturation, opacity, shadow, padding, or radius value. If a value is missing, add it to `spec/tokens/*.yaml` and `references/tokens.md` first, then reference it.

## Token discipline (native)

Use the native materials and view modifiers documented in `plugins/liquid-glass-native/skills/liquid-glass-native-ui/references/`. Do not hard-code colors or blur values — use the SwiftUI / AppKit material APIs.

## Apple

Do not claim any output is "Apple-official" or "Apple-certified". The web profile is an inspired-by approximation; the native side wraps real Apple APIs but the kit itself is not endorsed. Do not commit Apple fonts, Apple UI-kit exports, or Apple-owned screenshots.

## Why one folder per plugin for both ecosystems

Each `plugins/<plugin>/` folder contains:

- `.claude-plugin/plugin.json` — Claude reads this.
- `.codex-plugin/plugin.json` — Codex reads this; declares `skills = "./skills/"`.
- `skills/<canonical-skill>/` — ONE copy used by both Codex and Claude.
- `agents/` — Claude-only subagents; Codex ignores.

Both marketplace catalogs (`.agents/plugins/marketplace.json`, `.claude-plugin/marketplace.json`) point at the same folders. The two dotfile manifests do not collide, so there is no need to duplicate skills.

## Slash command naming

| Plugin                | Codex                       | Claude                                             |
| --------------------- | --------------------------- | -------------------------------------------------- |
| `liquid-glass-web`    | `$liquid-glass-web-ui …`    | `/liquid-glass-web:liquid-glass-web-ui …`         |
| `liquid-glass-native` | `$liquid-glass-native-ui …` | `/liquid-glass-native:liquid-glass-native-ui …`   |

The Claude form is slightly repetitive (plugin name then skill name); that is the cost of eliminating duplication.

## Subagent boundaries

- `liquid-glass-web-auditor` and `liquid-glass-native-auditor` are read-only (`disallowedTools: Write, Edit`). Keep them that way.
- `liquid-glass-web-implementer` and `liquid-glass-native-implementer` may write.
- Each pair of agents references the same-named canonical skill.
