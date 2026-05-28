---
name: ios-app-design
description: Placeholder — iOS / iPadOS app design coverage is not yet implemented in this kit. Do not auto-trigger. Use the sibling skill `macos-app-design` for Mac apps and `liquid-glass` for the macOS 26 / iOS 26 glass material.
---

# iOS app design (placeholder)

This skill is reserved for iOS / iPadOS coverage in a future release. Today it is **not implemented** and should not be auto-loaded by the agent. The `description` above is intentionally narrow so trigger phrases like "build an iOS app" do not pull in an empty skill.

When iOS coverage lands here, expect parity with `macos-app-design`:

- Behavioral principles for touch-first interfaces.
- Tab bars, navigation bars, sheets, popovers, modal stacks.
- Keyboard / shortcut support for hardware-keyboard iPad use.
- Accessibility (VoiceOver, Dynamic Type, motion, contrast).
- App icon (Icon Composer — shared with macOS).
- File management (Files app, document picker).

The macOS 26 `liquid-glass` skill already covers the iOS 26 glass material — the APIs and rules are the same on both platforms.

## Status

Tracked in the repo backlog. Until shipped, refuse iOS-specific design briefs with a short pointer to Apple HIG and `macos-app-design` for cross-platform Apple conventions.
