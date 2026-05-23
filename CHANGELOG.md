# Changelog

## 0.3.0 — T2 pass (material roles, Cmd-K, app shell, icon)

### Added

- **Material role taxonomy (#7).** Each glass surface now picks a role by where it lives (sidebar, toolbar, menu, popover, hud, sheet, header, windowBackground, content) instead of just a thickness. Roles map to Apple's own SwiftUI Material + `NSVisualEffectView.Material` + macOS 26 Glass variant on the native side, and to a CSS approximation on the web side. `liveBlur: false` roles (`windowBackground`, `content`) are excluded from the B1 performance budget.
  - `spec/tokens/material.yaml` — new `roles.*` block.
  - `spec/rules/performance-budget.md` — B1 counts only `liveBlur: true` roles. Web auditor honors `data-role="windowBackground"` / `data-role="content"` opt-outs.
  - `audit/liquid-glass-audit.mjs`, `audit/README.md` — B1 filter by role.
  - `prompts/web-frosted-glass.md` — token block names the roles.
  - `plugins/liquid-glass-native/skills/liquid-glass-native-ui/references/tokens.md` — per-role API table (SwiftUI / AppKit / Glass).
  - `examples/macos-native-swift/Sources/LiquidGlassShowcase/Tokens.swift` — `enum MaterialRole` documenting each role's Apple API hint and live-blur status.
  - `docs/design-system.md` — Material — roles entry.
- **Command palette / Cmd-K (#4).** First-class pattern with geometry, motion, keyboard model, and ARIA wiring. Spec, web demo, and native demo all ship.
  - `spec/components/command-palette.yaml` (new) — geometry + material role (`hud`) + keyboard model.
  - `spec/patterns/command-palette.md` (new) — full pattern doc with native + AppKit recipes and source citations.
  - `examples/macos-web/command-palette.js` (new) — working ⌘K palette wired with focus trap, filter, ↑↓/⏎/Esc model, click-and-hover selection, focus restore.
  - `examples/macos-web/index.html`, `examples/macos-web/styles.css`, `examples/macos-web/app.js`, `examples/macos-web/sections.js`, `examples/macos-web/sidebar.js`, `examples/macos-web/inspector.js` — palette markup, styles, app wiring, showcase tile, sidebar entry, inspector metadata.
  - `examples/macos-native-swift/Sources/LiquidGlassShowcase/Patterns.swift` — new `CommandPaletteSection` with a working SwiftUI panel (`TextField` + `onKeyPress(.upArrow / .downArrow / .return / .escape)` + `.keyboardShortcut("k", modifiers: .command)`).
  - `examples/macos-native-swift/Sources/LiquidGlassShowcase/Sidebar.swift`, `examples/macos-native-swift/Sources/LiquidGlassShowcase/ContentView.swift`, `examples/macos-native-swift/Sources/LiquidGlassShowcase/Inspector.swift` — `commandPalette` `SectionID` case + DetailView wiring + inspector surface rule.
  - `plugins/liquid-glass-native/skills/liquid-glass-native-ui/references/patterns/command-palette.md` (new) — SwiftUI / AppKit recipe.
  - `plugins/liquid-glass-native/skills/liquid-glass-native-ui/SKILL.md` — reference map entry.
  - `spec/liquid-glass.profile.yaml` — imports `command-palette.yaml`.
  - `prompts/web-frosted-glass.md` — Patterns section adds a Cmd-K line.
  - `docs/design-system.md` — Command palette entry.
- **App shell — sidebar + window chrome (#6).** Promotes implicit numbers in the showcases to spec entries with explicit geometry (titlebar 52 / 28, traffic-light alignment to first sidebar row, sidebar 220–260 / 320, 10 inset, 28 outer radius).
  - `spec/patterns/sidebar.md` (new) — geometry + section structure + full-height sidebar pattern + anti-patterns.
  - `spec/patterns/window-chrome.md` (new) — outer radius, padding, titlebar heights, traffic-light alignment, `fullSizeContentView`, toolbar composition rules.
  - `spec/components/toolbar.yaml` — `material.role: toolbar`; `chrome:` pointer to the new window-chrome pattern.
  - `plugins/liquid-glass-native/skills/liquid-glass-native-ui/references/patterns/sidebar.md` (new) — SwiftUI `NavigationSplitView` + AppKit `NSSplitViewController` recipes.
  - `plugins/liquid-glass-native/skills/liquid-glass-native-ui/references/patterns/window-chrome.md` (new) — Mac chrome cheat-sheet.
  - `prompts/web-frosted-glass.md` — new App shell section with chrome numbers.
  - `docs/design-system.md` — Sidebar and Window chrome entries expanded with role, native plugin pointer, and caveats.
- **Mac app icon guidance (#5).** Closes the silent gap where a credible glass UI ships with a default Xcode icon.
  - `spec/rules/icon.md` (new) — Icon Composer flow, squircle grid (1024 canvas, 820 safe area), layered model, light/dark/tinted variants, common amateur mistakes.
  - `plugins/liquid-glass-native/skills/liquid-glass-native-ui/references/icon.md` (new) — native-side mirror.
  - `plugins/liquid-glass-native/skills/liquid-glass-native-ui/SKILL.md` — reference map entry.
  - `prompts/web-frosted-glass.md` — out-of-scope note pointing at the spec.
  - `docs/design-system.md` — App icon section.

### Changed

- B1 budget enforcement now filters by material role. Surfaces marked `data-role="windowBackground"` or `data-role="content"` (`liveBlur: false`) no longer count. Existing showcase pages with many demo glass tiles are unaffected because they remain `liveBlur: true`.
- The native showcase's patterns group now has three entries (command-palette, morphing, scroll-edge-effects) instead of two.

### Migration

No code or API renames. Existing tokens (`glass.regular`, `glass.clear`) are unchanged; the `roles.*` block is additive. Existing showcase markup keeps working without `data-role` attributes — defaults preserve the previous audit behavior.

## 0.2.2 — T1 rule pass (criticism, budget, Apple-prompt diff)

### Added

- **Forbidden-surface rule (F1–F5) with external citations.**
  - `spec/rules/when-not-to-use-glass.md` — five forbidden surfaces (page background, long-form text, forms, dense tables, glass-on-glass) with concrete failure cases and sources (NN/g, Infinum, JuniperPhoton, Axess Lab).
  - `plugins/liquid-glass-native/skills/liquid-glass-native-ui/references/when-not-to-use-glass.md` — native mirror.
  - `spec/rules/layout-rules.md` — forbidden list now references F-codes.
  - `spec/rules/anti-patterns.md` and `plugins/.../references/anti-patterns.md` — A1 / A2 expanded with same citations.
- **Performance-budget rule (B1) with auditor enforcement.**
  - `spec/rules/performance-budget.md` and `plugins/.../references/performance-budget.md` — cap on live-blurred surfaces per pane (recommended 3 / busy 5 / ceiling 6).
  - `spec/tokens/material.yaml` — new `budget:` block.
  - `audit/liquid-glass-audit.mjs` — new `checkBudget` function emitting `[B1]` when an HTML / JS file exceeds `GLASS_BUDGET_MAX = 6`.
  - `audit/README.md` — B1 listed + audit ID prefix taxonomy (A / B / F).
- **Apple Xcode 26 system-prompt comparison report.**
  - `docs/apple-prompt-comparison.md` — diff of `artemnovichkov/xcode-26-system-prompts` against the kit; identifies gaps and "don't adopt" items.
  - `plugins/.../references/swiftui.md` — added `searchToolbarBehavior(.minimize)`, `DefaultToolbarItem(kind:placement:)`, `ToolbarSpacer(.fixed)`, `ToolbarItem(placement: .largeSubtitle)` + `.navigationSubtitle(_:)`, `scrollExtensionMode(.underSidebar)`, expanded `glassEffectUnion` with dynamic / cross-ancestor use case.
  - `plugins/.../references/appkit.md` — `NSGlassEffectView.contentView` z-order caveat, `NSGlassEffectContainerView.spacing` default-zero note.
  - `prompts/web-frosted-glass.md` — search-minimize hint, fixed-vs-flexible spacer distinction, background extension full-bleed line, budget rule line.

### Changed

- `AGENTS.md` — expanded the order-of-operations to nine surfaces (added audit/, native agents, CHANGELOG). Added an "Audit ID prefix taxonomy" section and a "Drift sweep" command list.
- `.claude/skills/liquid-glass-sync/SKILL.md` — mirrored the AGENTS.md expansion: nine sync surfaces, new sections for audit + native agents + changelog, drift sweep at the end.
- `docs/design-system.md` — added Material — performance budget entry, expanded the Toolbar entry with the new Apple toolbar APIs, expanded the Forbidden glass surfaces rule entry.

### Migration

No code or API changes. The audit ID namespace now uses three prefixes (A / B / F) but A1–A24 are unchanged. Existing findings still pin to the same IDs.

## 0.2.1 — native auditor catches up

### Changed

- `plugins/liquid-glass-native/skills/liquid-glass-native-ui/references/anti-patterns.md` — promoted the unlabeled "Bonus — macOS 26 gotchas" section to formal IDs **A11–A24**, one heading per gotcha (legacy `.sidebar` material, `.presentationBackground(.glass)` + detents, double `.toolbar`, `.glassEffect` mid-chain, materials wrapping controls, `.interactive()` on static surfaces, conditional removal vs `.identity`, morph without `withAnimation`, morph across containers, `GlassEffectContainer(spacing:)` middle value, mixed `.soft`/`.hard` scroll edges, edge effect without chrome, icon + label glued, `.glassProminent` + `.circle` clip).
- `plugins/liquid-glass-native/skills/liquid-glass-native-ui/SKILL.md` — extended the self-audit checklist with A11–A24.
- `plugins/liquid-glass-native/agents/liquid-glass-native-auditor.md` — rewrote "What to check" to enumerate all 24 anti-patterns with concrete code signals, added a `FW —` prefix for framework-hygiene findings that have no A-ID, and updated the report format.

### Migration

No code or API changes — the audit ID space just grew. Existing
findings keyed to A1–A10 are unchanged.

## 0.2.0 — prompt-first pivot

### Changed

- **Repositioned the web side as a portable prompt, not a plugin.** Anyone targeting web Liquid Glass UI now pastes `prompts/web-frosted-glass.md` into their AI tool (ChatGPT, Claude web, Cursor, v0, Lovable, Figma Make, Bolt, Windsurf, JetBrains AI, Xcode AI, Claude Code, Codex). One artifact, every tool.
- The native side stays a Codex + Claude Code plugin (`plugins/liquid-glass-native/`). Skill-supporting tools are where native devs work, so a plugin keeps the multi-file reference loading that makes the native skill effective.
- Web prompt header reframed: it now declares itself a **frosted-glass approximation**, not a render of native Liquid Glass.

### Added

- `audit/` — standalone web audit CLI. The audit script that used to live inside the web plugin is now a top-level tool: `node audit/liquid-glass-audit.mjs <path>` or `npm run audit`.
- `audit/README.md` — documents the checks and known gaps.
- `docs/web-prompt.md` — usage guide for the portable web prompt.

### Removed

- `plugins/liquid-glass-web/` — the entire web plugin (skills, agents, Codex + Claude manifests).
- `docs/install-copy-paste.md` — superseded by `docs/web-prompt.md`.

### Migration

If you previously installed the web plugin:

- **Codex / Claude Code users:** uninstall `liquid-glass-web`. For web tasks, paste `prompts/web-frosted-glass.md` instead.
- **CI users running the audit script:** the path moved. Update `node plugins/liquid-glass-web/skills/liquid-glass-web-ui/scripts/audit-liquid-glass-html.mjs ...` to `node audit/liquid-glass-audit.mjs ...` or `npm run audit`.
- **The native plugin is unchanged.** Install paths, slash commands, and subagent names are identical.

## 0.1.1 — native sibling

### Added

- `plugins/liquid-glass-native/` — sibling plugin for native macOS Liquid Glass UI (SwiftUI / AppKit). Ships its own canonical skill `liquid-glass-native-ui` and two Claude subagents.
- `examples/macos-native-swift/` — SwiftUI showcase app exercising the native skill.
- `examples/macos-web/` — HTML/CSS showcase of macOS-style glass on the web (replaces the prior `macos-showcase`).
- `docs/resources.md` — collected external references.

### Changed

- **Renamed the existing UI plugin** to disambiguate from the new native plugin:
  - `plugins/liquid-glass-ui/` → `plugins/liquid-glass-web/`
  - Plugin name `liquid-glass-ui` → `liquid-glass-web`
  - Claude command `/liquid-glass-ui:liquid-glass-web-ui` → `/liquid-glass-web:liquid-glass-web-ui` (Codex `$liquid-glass-web-ui` unchanged).
  - Agents: `liquid-glass-auditor` → `liquid-glass-web-auditor`; `liquid-glass-implementer` → `liquid-glass-web-implementer`.
  - Plugin descriptions now make the *web* scope explicit and point at the native sibling.
- Marketplace catalogs (`.agents/plugins/marketplace.json`, `.claude-plugin/marketplace.json`) list both plugins.
- `npm run validate` now audits `examples/macos-web` (the new canonical web example).

### Removed

- `examples/vanilla-html/` — superseded by `examples/macos-web/`.

## 0.1.0 — initial v0.1 (commit 30782ef)

- Canonical spec (`spec/`).
- Single shared plugin `plugins/liquid-glass-ui/` (Codex + Claude, no duplication).
- Web canonical skill `liquid-glass-web-ui` with references and audit script.
- Two Claude subagents (auditor, implementer).
- Marketplace catalogs, copy/paste prompt, vanilla-html example, docs.
