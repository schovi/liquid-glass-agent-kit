# Agent contributor instructions

You are an agent making changes to this repo. Read this before editing.

## Source of truth

This repo ships Apple-inspired Liquid Glass guidance in **two delivery modes** from one canonical spec:

- **Web** — a paste-once prompt (`prompts/web-frosted-glass.md`) that any AI tool can consume, plus a showcase (`examples/macos-web/`) and a standalone audit (`audit/`).
- **Native macOS 26** — a Codex + Claude Code plugin (`plugins/liquid-glass-native/`) wrapping the real `glassEffect` / `NavigationSplitView` / `ConcentricRectangle` APIs, plus a showcase (`examples/macos-native-swift/`).

There is no build step. The plugin folder serves both Codex (`.codex-plugin/`) and Claude Code (`.claude-plugin/`) from one place.

Edit only:

- `spec/`
- `prompts/web-frosted-glass.md`
- `plugins/liquid-glass-native/skills/liquid-glass-native-ui/`
- `plugins/liquid-glass-native/agents/` (Claude subagents)
- `examples/`
- `audit/`
- `docs/`
- `.claude/skills/liquid-glass-sync/` (local sync workflow)

## Cross-cutting changes

`docs/design-system.md` is the human-readable inventory mapping every token, component, pattern, and rule to its spec entry, web showcase pointer, native showcase pointer, native plugin reference, Apple API, and caveats.

For any change that touches tokens, components, rules, or cross-cutting patterns, route through:

- `.claude/skills/liquid-glass-sync/SKILL.md`

Order of operations: **spec → docs/design-system.md → prompts/web-frosted-glass.md (token block) → examples/macos-web → plugins/liquid-glass-native (references) → examples/macos-native-swift**. Self-audit with `npm run audit` for web and `swift build` for native before declaring done.

Single-rendering bug fixes (CSS typo in the showcase, Swift compile error that doesn't touch the design system) do NOT need this skill. Fix them in place.

## After every change

If you touched the audit, the web prompt token block, or `examples/macos-web/`, run:

```bash
npm run audit
```

That runs the standalone auditor against `examples/macos-web`.

The native side has no audit script yet. The native plugin skill is consumed by an LLM and verified by building `examples/macos-native-swift` (`swift build` or `npm run example:native:build`).

## Token discipline (web)

Never invent a blur, saturation, opacity, shadow, padding, or radius value. If a value is missing, add it to `spec/tokens/*.yaml` first, then propagate to the prompt token block and the showcase CSS.

## Token discipline (native)

Use the native materials and view modifiers documented in `plugins/liquid-glass-native/skills/liquid-glass-native-ui/references/`. Do not hard-code colors or blur values. Use the SwiftUI / AppKit material APIs.

## Apple

Do not claim any output is "Apple-official" or "Apple-certified". The web prompt produces a frosted-glass approximation; the native side wraps real Apple APIs but the kit itself is not endorsed. Do not commit Apple fonts, Apple UI-kit exports, or Apple-owned screenshots.

## Native plugin layout

`plugins/liquid-glass-native/` contains:

- `.claude-plugin/plugin.json` — Claude reads this.
- `.codex-plugin/plugin.json` — Codex reads this; declares `skills = "./skills/"`.
- `skills/liquid-glass-native-ui/` — ONE skill folder used by both Codex and Claude.
- `agents/` — Claude-only subagents; Codex ignores.

Both marketplace catalogs (`.agents/plugins/marketplace.json`, `.claude-plugin/marketplace.json`) point at this folder. The two dotfile manifests do not collide, so there is no need to duplicate the skill.

## Slash command naming

| Codex                       | Claude Code                                       |
| --------------------------- | ------------------------------------------------- |
| `$liquid-glass-native-ui …` | `/liquid-glass-native:liquid-glass-native-ui …`   |

## Subagent boundaries (native)

- `liquid-glass-native-auditor` is read-only (`disallowedTools: Write, Edit`). Keep it that way.
- `liquid-glass-native-implementer` may write.
- Both reference the canonical `liquid-glass-native-ui` skill.

## History

Earlier versions of this kit also shipped a `liquid-glass-web` plugin (Codex + Claude). That plugin was removed in v0.2 in favor of the portable web prompt; native stays a plugin because skill-supporting tools are where native devs work. See `CHANGELOG.md`.
