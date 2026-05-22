# Changelog

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
