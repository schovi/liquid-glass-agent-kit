---
name: liquid-glass-native-ui
description: Build authentic macOS 26 (Tahoe) Liquid Glass apps in SwiftUI or AppKit. Use when the user asks to make a real Mac app with Liquid Glass, port a web mockup to SwiftUI, or write AppKit using NSGlassEffectView / NSGlassEffectContainerView. Do not use for web HTML/CSS — that's the sibling skill `liquid-glass-web-ui`.
---

# Liquid Glass — native macOS UI

This skill turns "build a macOS 26 Liquid Glass app" into deterministic
SwiftUI or AppKit code that uses the *real* Apple APIs (`.glassEffect`,
`NSGlassEffectView`, `NavigationSplitView`, `NSSplitViewController`,
`ConcentricRectangle`, `.buttonStyle(.glassProminent)`, etc.) — not a
web approximation.

If the user wants the web profile instead, use the sibling skill
`liquid-glass-web-ui`.

## Required workflow

1. **Pick the framework.**
   - **SwiftUI** — default for new code. Modifiers: `.glassEffect`, `GlassEffectContainer`, `.backgroundExtensionEffect`, `ConcentricRectangle`, `.buttonStyle(.glass)` / `.glassProminent`, `.searchable`, `.sheet` with `.presentationDetents`, `ToolbarSpacer`, `.sharedBackgroundVisibility`.
   - **AppKit** — when the user is in an existing AppKit codebase or asks for it explicitly. APIs: `NSGlassEffectView`, `NSGlassEffectContainerView`, `NSBackgroundExtensionView`, `NSSplitViewController` with `.sidebar` / `.inspector` behaviors, `NSToolbar` unified mode, `NSButton.bezelStyle = .glass`, `NSVisualEffectView.Material` enum.
2. **Use the structural primitive.**
   - Three-column app: `NavigationSplitView { sidebar } content: { detail } detail: { inspector }` (SwiftUI) or `NSSplitViewController` with `.sidebar` / `.inspector` behaviors (AppKit).
   - Single-column app with toolbar: standard `Scene` + `.toolbar` (SwiftUI) or unified `NSToolbar`.
3. **Put glass where it belongs** — see `references/where-glass-goes.md`.
4. **Honor concentricity** — outer corner radius = inner pill radius + inset. Use `ConcentricRectangle()` + `.containerShape(...)` in SwiftUI; manual radii in AppKit.
5. **Apply tokens** — read radius, spacing, motion from `references/tokens.md`. Do not invent new values.
6. **Accessibility flags are system-driven** — AppKit / SwiftUI auto-degrade vibrancy when `reduceTransparency`, `increaseContrast`, `reduceMotion` are on. Do not fight them.
7. **Avoid every anti-pattern** in `references/anti-patterns.md`.

## Output rules

- Never invent numeric blur, saturation, or opacity. Apple publishes no portable numeric values; the material is real-time rendered.
- Prefer Regular glass. Use Clear only over rich media with a dim layer behind it.
- Never put one glass surface inside another (`GlassEffectContainer` merges into ONE shared sampling pass, not nesting).
- Never put glass behind body text, forms, dense tables, or page backgrounds.
- Use the system-provided treatment — don't hand-roll a CGAffineTransform or layer hack to imitate Liquid Glass. If the user is on macOS < 26, the answer is "this feature requires macOS 26", not "fake it".
- Never claim "Apple-official" or "Apple-certified".

## When to refuse or downgrade

- If the user asks for "Liquid Glass on macOS 14" — refuse. Liquid Glass needs macOS 26. Offer the web profile via `liquid-glass-web-ui` if they want approximation.
- If the user asks to put glass behind a long article — refuse and propose a solid surface.
- If the user asks for Clear glass without a dim layer — silently switch to Regular.
- If the user removes `.sidebar` material expecting Liquid Glass to disappear — explain: on macOS 26, *removing* the legacy `.sidebar` material is what *enables* Liquid Glass on the sidebar.

## Self-audit before returning

Before returning code, check against `references/anti-patterns.md`:

Core (A1-A10):

- A1 — glass-on-glass nesting
- A2 — glass behind body content
- A3 — invented numeric tokens
- A4 — invented component dimensions
- A5 — capsule miscalculation
- A6 — broken concentricity
- A7 — mixed Regular and Clear in one group
- A8 — unreadable Clear glass (no dim)
- A9 — fighting system accessibility flags
- A10 — Apple-endorsement claims

Web-only ID (do not raise on native code):

- A25 — renderer tier missing or invalid (web `data-tier`; covered by the web auditor)

macOS 26 gotchas (A11-A24):

- A11 — legacy `.sidebar` material retained
- A12 — `.presentationBackground(.glass)` stacked on `.presentationDetents`
- A13 — two `.toolbar` modifiers in different ancestors
- A14 — `.glassEffect` placed mid-chain
- A15 — materials wrapping the control instead of styling it
- A16 — `.interactive()` on static surfaces
- A17 — toggling glass by removing the modifier (use `.identity`)
- A18 — morph without `withAnimation`
- A19 — morph across separate `GlassEffectContainer`s
- A20 — `GlassEffectContainer(spacing:)` set to a middle value
- A21 — mixed `.soft` / `.hard` scroll edge styles on one scroll view
- A22 — scroll-edge effect with no overlapping chrome
- A23 — icon + label glued into one tap target
- A24 — `.glassProminent` + `.circle` border shape artifact

Performance budget (`references/performance-budget.md`):

- B1 — more live-blurred surfaces per pane than `material.yaml` `budget.max` (6). A `GlassEffectContainer` counts as one surface; share sampling instead of stacking.

Forbidden surfaces (`references/when-not-to-use-glass.md`, review-only):

- F1 — glass on the window background
- F2 — glass behind long-form text (catches what A2 misses)
- F3 — glass behind forms / inputs
- F4 — glass behind dense tables
- F5 — glass on glass (matches A1 conceptually; cite when the issue is *where* glass goes)

## What this skill is not

- Not an Apple-official design system.
- Not a port of Apple internal rendering values — Apple publishes none.
- Not a web HTML profile. For web, use `liquid-glass-web-ui`.
- Not a Liquid Glass polyfill for older macOS — the APIs only exist on macOS 26.

## Reference map

- `references/tokens.md` — radii, spacing, motion, typography tokens.
- `references/where-glass-goes.md` — layer rules and the canonical "yes / no" list.
- `references/when-not-to-use-glass.md` — F1–F5 forbidden surfaces with failure modes and external citations (NN/g, Infinum, JuniperPhoton).
- `references/performance-budget.md` — cap on live-blurred surfaces per pane (B1).
- `references/swiftui.md` — SwiftUI cheat-sheet with signatures.
- `references/appkit.md` — AppKit cheat-sheet with class / enum names.
- `references/anti-patterns.md` — the ten things to never ship.
- `references/example.md` — pointer to `examples/macos-native-swift/`.
- `references/components/` — one focused recipe per component:
  - `popover.md`, `menu.md`, `search-field.md`, `toggle.md`, `slider.md`,
    `progress.md`, `badge.md`.
- `references/patterns/` — one focused recipe per pattern:
  - `form-rows.md`, `inset-list.md`, `disclosure-group.md`, `stepper.md`,
    `titlebar-accessory.md`, `floating-hud.md`, `morphing.md`,
    `scroll-edge-effects.md`, `command-palette.md`,
    `sidebar.md`, `window-chrome.md`.
- `references/system-primitives.md` — alerts, confirmation dialogs,
  tooltips. "Use the system, don't restyle."
- `references/icon.md` — app-icon guidance: Icon Composer, squircle
  grid, light / dark / tinted variants.
- `references/metal-shaders.md` — `.layerEffect` / `.colorEffect` /
  `.distortionEffect` recipes for hero surfaces and brand
  transitions when `.glassEffect` is insufficient. Used by the
  `liquid-glass-native-shader-implementer` subagent.

All claims trace to `docs/resources.md` at the repo root.
