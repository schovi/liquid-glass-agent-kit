# Changelog

## Unreleased

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
