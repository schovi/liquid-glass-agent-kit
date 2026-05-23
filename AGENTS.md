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

Order of operations (lockstep — skipping a step is the bug):

1. **`spec/`** — tokens, components, rules.
2. **`docs/design-system.md`** — inventory entries with `spec` / `web` / `native` / `apple` / `caveats` pointers.
3. **`prompts/web-frosted-glass.md`** — token block + rule reminders.
4. **`examples/macos-web/`** — HTML / CSS / JS that exercises the new state.
5. **`audit/`** — if a new check or audit ID is added: update `audit/liquid-glass-audit.mjs` *and* `audit/README.md` (these are paired). If only token values shifted, often unchanged.
6. **`plugins/liquid-glass-native/skills/liquid-glass-native-ui/`** — `SKILL.md` reference map + `references/*.md`.
7. **`plugins/liquid-glass-native/agents/*.md`** — if the audit ID space, anti-pattern list, or rule structure changed, update the implementer / auditor agent definitions so they enumerate the new IDs.
8. **`examples/macos-native-swift/`** — Tokens / Sections / ContentView wiring.
9. **`CHANGELOG.md`** — one entry per shipped change with paths touched.

Self-audit:

- `npm run audit` for the web side.
- `swift build` (or `npm run example:native:build`) for the native side.

Single-rendering bug fixes (CSS typo in the showcase, Swift compile error that doesn't touch the design system) do NOT need this skill. Fix them in place.

## Audit ID prefix taxonomy

The auditor (`audit/liquid-glass-audit.mjs`) and review-only rules share one ID namespace partitioned by prefix:

- **A** — anti-patterns. A1–A10 are cross-cutting (web + native); A11–A24 are macOS 26-specific (native skill only).
- **B** — budget. B1 = performance budget. New budget rules go to B2+.
- **F** — forbidden surfaces. Review-only, lives in `spec/rules/when-not-to-use-glass.md` and the native mirror. F2 and F5 overlap with A2 and A1; the auditor catches the worst statically.

When adding a new check:

- Pick the prefix by category (anti-pattern → A; budget / perf → B; surface rule → F).
- Stay numerically distinct (don't reuse a number across prefixes).
- Update **every** place that lists IDs: `audit/README.md`, `spec/rules/anti-patterns.md`, `plugins/.../references/anti-patterns.md`, the auditor agent definition, `docs/design-system.md`.

## After every change

Run the validators that match what you touched:

| If you touched | Run |
|---|---|
| `audit/`, `prompts/web-frosted-glass.md`, `examples/macos-web/`, `spec/tokens/material.yaml`, `spec/rules/*.md` | `npm run audit` |
| `examples/macos-native-swift/`, native skill references that include code blocks | `swift build` or `npm run example:native:build` |
| Anything that changes the audit ID space or rule structure | both, plus a grep for any stale ID lists (see "Drift sweep" below) |

## Drift sweep

When you add or rename rules / IDs / API references, do a final grep so nothing stale lingers:

```bash
# Stale audit ID lists (anything mentioning A1-A10 without the new code)
grep -rn "A1-A10\|A1–A10" --include="*.md" .

# Forbidden-surface code consistency
grep -rn "\bF[1-9]\b" --include="*.md" --include="*.yaml" .

# Budget code consistency
grep -rn "\bB[1-9]\b" --include="*.md" --include="*.yaml" --include="*.mjs" .

# New API references — confirm each one is mentioned in design-system.md
grep -rn "searchToolbarBehavior\|DefaultToolbarItem\|scrollExtensionMode" --include="*.md" .
```

The native side has no automated audit. The native plugin skill is consumed by an LLM and verified by building `examples/macos-native-swift`.

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
