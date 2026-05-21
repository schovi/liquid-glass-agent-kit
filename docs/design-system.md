# Liquid Glass — design system inventory

Unified inventory across spec, web, and native renderings. This file is
the single source of truth for cross-cutting changes. Modifications go
through `.claude/skills/liquid-glass-sync/`, which orchestrates updates
to all three (this doc, web example, native example) in lockstep.

## How to read this doc

Each entry lists:

- **values / description** — what it is, in one or two lines.
- **spec** — the canonical YAML in `spec/`.
- **web** — file pointer into `examples/macos-web/` (the HTML / CSS approximation).
- **native** — file pointer into `examples/macos-native-swift/` (the real SwiftUI on macOS 26).
- **apple** — the closest published API or HIG concept that grounds the entry.
- **caveats** — non-obvious rules.

File paths are intentional. Line numbers rot — search for the symbol /
class instead.

Full citations and source URLs live in `docs/resources.md`.

---

## Layered model

The whole system rests on a two-layer split.

- **Navigation / functional layer** — glass lives here. Titlebar, toolbar, sidebar, popover, menu, sheet, floating action.
- **Content layer** — solid. Text, forms, tables, lists, content cards.

Never put glass behind body content. Never stack two glass surfaces.

- spec: `spec/rules/apple-principles.md`, `spec/rules/layout-rules.md`
- web: `examples/macos-web/index.html` (sidebar + titlebar are glass; content area is solid)
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/ContentView.swift` (`NavigationSplitView`)
- apple: WWDC25 session 219 "Meet Liquid Glass"; HIG materials chapter

---

## Tokens

### Material — Regular

Default variant. Auto-legible. Use for almost every floating surface.

- values (web approximation): blur 40 · saturate 180% · bg `rgba(255,255,255,0.70)` light / `rgba(16,16,16,0.45)` dark · border `rgba(255,255,255,0.18)` · shadow `0 8px 32px rgba(0,0,0,0.12)`
- spec: `spec/tokens/material.yaml` (`glass.regular`)
- web: `examples/macos-web/styles.css` (`.lg-glass--regular`)
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/Sections.swift` (`.glassEffect(.regular, in: ...)`)
- apple: SwiftUI `Glass.regular`; AppKit `NSGlassEffectView` default; `NSVisualEffectMaterial` semantic enum
- caveats: never glass-on-glass; never behind body text; tint via `.glassEffect(.regular.tint(_:))` on SwiftUI.

### Material — Clear

More transparent. Only over rich media with a dim layer behind.

- values (web approximation): blur 28 · saturate 160% · bg `rgba(255,255,255,0.18)` light / `rgba(16,16,16,0.22)` dark · requires dim layer `rgba(0,0,0,0.24)`
- spec: `spec/tokens/material.yaml` (`glass.clear`)
- web: `examples/macos-web/styles.css` (`.lg-glass--clear`) + dim sibling
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/Sections.swift` (`ClearVariantSection`)
- apple: SwiftUI `Glass.clear`
- caveats: mixing Regular and Clear in one group is an anti-pattern (A7); show them in separate sections.

### Material — accessibility fallbacks

Reduced transparency / increased contrast / reduced motion. Web emits explicit fallbacks. Native is system-driven — do not hand-roll fallbacks.

- spec: `spec/tokens/material.yaml` (`fallbacks.*`), `spec/rules/accessibility-rules.md`
- web: `examples/macos-web/styles.css` (three `@media` blocks at end)
- native: system-handled via `controlActiveState`, `accessibilityReduceTransparency`, `accessibilityReduceMotion`
- apple: HIG "Accessibility" chapter
- caveats: in native, fighting the system flags is anti-pattern A9.

### Shape

Fixed radii 12 / 16 / 24 / 28 + capsule (`height / 2`). Nested shapes are concentric (`child = parent − inset`).

- spec: `spec/tokens/shape.yaml`
- web: `examples/macos-web/styles.css` (`--lg-radius-sm` / `md` / `lg` / `xl` / `capsule`)
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/Tokens.swift` (`enum Radius`); `ConcentricRectangle()` for child shapes
- apple: SwiftUI `ConcentricRectangle` resolves from `.containerShape(...)`
- caveats: capsule miscalculation (A5) and broken concentricity (A6) are common bugs.

### Spacing

One scale: 8 · 12 · 16 · 24 · 32. Apply by role.

- values: `controlGap` 8 · `groupGap` 12 · `panelGap` 16 · `screenMarginCompact` 16 · `screenMarginRegular` 24 · `sectionGap` 32
- spec: `spec/tokens/spacing.yaml`
- web: `examples/macos-web/styles.css` (`--lg-gap-control` / `--lg-gap-group` / `--lg-gap-panel` / `--lg-margin-*` / section gap)
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/Tokens.swift` (`enum Spacing`)
- apple: not a public token table — derived from Apple UI-kit extracts.

### Typography

Falls through to the system font. Eleven steps caption2 (11) → largeTitle (34).

- spec: `spec/tokens/typography.yaml`
- web: `examples/macos-web/styles.css` (font stack + per-scale rules in the typography section)
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/Sections.swift` (`TypographySection`)
- apple: SwiftUI semantic fonts (`.largeTitle` etc.) — sizes track the SF scale; we do not ship Apple fonts.

### Motion

Five durations · four easings.

- durations: instant 80 · fast 160 · base 240 · slow 360 · sheet 420 (ms)
- easings: standard · decelerate · accelerate · spring
- spec: `spec/tokens/motion.yaml`
- web: `examples/macos-web/styles.css` (`--lg-duration-*`, `--lg-ease-*`)
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/Tokens.swift` (`enum Duration`, `enum Easing`)
- apple: HIG motion guidance; SwiftUI `.spring(...)` / `.easeInOut` / etc.
- caveats: sheet uses spring; everything else uses standard. Reduced motion collapses to linear / instant.

---

## Components

### Button

Capsule, min height 44, subheadline weight 600. Variants: primary · secondary · ghost.

- spec: `spec/components/button.yaml`
- web: `examples/macos-web/styles.css` (`.lg-button`, `.lg-button--primary`, `.lg-button--ghost`)
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/Sections.swift` (`ButtonsSection`)
- apple: AppKit `NSButton.bezelStyle = .glass`, `borderShape = .capsule`, `tintProminence`; SwiftUI `.buttonStyle(.glass)` / `.buttonStyle(.glassProminent)` / `.buttonStyle(.borderless)`
- caveats: `.tint(_:)` colors `.glassProminent` background; use `.sharedBackgroundVisibility(.hidden)` to prevent neighbor merging in toolbars.

### Icon button

Square-bound 44 capsule, icon size 20.

- spec: `spec/components/icon-button.yaml`
- web: `examples/macos-web/styles.css` (`.lg-icon-button`)
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/Sections.swift` (`ButtonsSection` icon row)
- apple: same as Button; in SwiftUI use `.labelStyle(.iconOnly)` and frame to 44×44.
- caveats: require an accessible name (`aria-label` / `.accessibilityLabel`).

### Card

Solid floating container, radius 24, padding 24. NOT glass.

- spec: `spec/components/card.yaml`
- web: `examples/macos-web/styles.css` (`.lg-content-card`)
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/Sections.swift` (`ContentCardView`)
- apple: no single API — solid content surface using `Color(nsColor: .controlBackgroundColor)` + `RoundedRectangle(cornerRadius: 24, .continuous)`.
- caveats: putting glass on a card is A2 (glass behind body text).

### Toolbar

Floating capsule group of icon-buttons. Min height 52, item 40.

- spec: `spec/components/toolbar.yaml`
- web: `examples/macos-web/styles.css` (`.lg-toolbar-pill`)
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/Sections.swift` (`ButtonsSection` toolbar-pill demo) and `ContentView.swift` (`.toolbar { ... }`)
- apple: AppKit `NSToolbar` (unified mode); SwiftUI `.toolbar { ToolbarItem(...) }` with `ToolbarSpacer(.fixed | .flexible)` to split capsules and `.sharedBackgroundVisibility(.hidden)` to opt out of the shared glass background
- caveats: adjacent items auto-merge into one glass capsule; use `ToolbarSpacer` to separate.

### Tab bar

Bottom navigation, 2-5 items, height 64, radius 32. iOS pattern — macOS uses sidebar + toolbar instead.

- spec: `spec/components/tab-bar.yaml`
- web: not rendered in `examples/macos-web` (macOS context); see `examples/vanilla-html` for the iOS-style demo
- native: not rendered in `examples/macos-native-swift` (macOS context)
- apple: SwiftUI `TabView` (iOS) — Liquid Glass tabs float in the toolbar
- caveats: don't ship a tab bar in a macOS layout; that's an iOS pattern.

### Sheet

Bottom-anchored modal. Top radius 28, padding 24, grabber 36×5. Spring easing 420 ms.

- spec: `spec/components/sheet.yaml`
- web: `examples/macos-web/index.html` (`#open-sheet`) + styles
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/ContentView.swift` (`NewEntrySheet`) — Liquid Glass auto via `.presentationDetents([.medium, .large])`
- apple: SwiftUI `.sheet { ... .presentationDetents([...]) }`; AppKit `NSWindow` sheet (material `.sheet`)
- caveats: don't add `.presentationBackground(.glass)` on top of partial detents — it's redundant and produces double-glass.

### Segmented control

2-5 mutually exclusive options on one capsule track, height 32.

- spec: `spec/components/segmented-control.yaml`
- web: `examples/macos-web/styles.css` (`.lg-segmented`)
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/Sections.swift` (`ControlsSection`) — `Picker(...).pickerStyle(.segmented)`
- apple: SwiftUI `Picker` with `.segmented` style; AppKit `NSSegmentedControl`
- caveats: track itself uses Regular glass when placed in a toolbar.

### Text field

Single-line input, min height 44, radius 12. **Always solid.** Glass behind text is forbidden.

- spec: `spec/components/text-field.yaml` (`constraints.glass: forbidden`)
- web: `examples/macos-web/styles.css` (`.lg-text-field`)
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/ContentView.swift` (`NewEntrySheet`) — `TextField(...).textFieldStyle(.roundedBorder)`
- apple: SwiftUI `TextField` / `SecureField`; AppKit `NSTextField`
- caveats: never put `.glassEffect` behind a text field. Autocomplete and validation states need full contrast.

---

## Patterns (Apple-native)

### Window chrome

Outer radius 28, traffic lights top-left, unified titlebar + toolbar.

- web: `examples/macos-web/index.html` (`.lg-window`, `.lg-titlebar`, `.lg-traffic-lights`)
- native: macOS system chrome (no code) + `.windowToolbarStyle(.unified(showsTitle: true))` in `examples/macos-native-swift/Sources/LiquidGlassShowcase/App.swift`
- apple: HIG window chapter; AppKit `NSWindow.toolbarStyle = .unified`
- caveats: outer corner radius wraps concentrically around the inner toolbar pill (concentricity rule).

### Sidebar

Floating Regular-glass source list. Section heading + rows + icons + badges.

- web: `examples/macos-web/index.html` (`.lg-sidebar`)
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/Sidebar.swift`
- apple: AppKit `NSSplitViewItem.behavior = .sidebar`; SwiftUI `NavigationSplitView` sidebar column
- caveats: on macOS 26, *remove* the legacy `.sidebar` `NSVisualEffectMaterial` — keeping it blocks Liquid Glass auto-application.

### Inspector

Solid metadata pane on the right.

- web: `examples/macos-web/index.html` (`.lg-inspector`)
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/Inspector.swift`
- apple: AppKit `NSSplitViewItem.behavior = .inspector`; SwiftUI `NavigationSplitView` detail column
- caveats: inspector is content, not chrome — keep it solid.

### Toolbar (unified)

One Regular-glass strip across the top with traffic lights, title, and toolbar items. Adjacent items share one glass capsule unless separated by `ToolbarSpacer` or `.sharedBackgroundVisibility(.hidden)`.

- web: `examples/macos-web/index.html` (`.lg-titlebar` + `.lg-toolbar-items`)
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/ContentView.swift` (`.toolbar { ... }`)
- apple: HIG toolbars; WWDC25 session 323 "Build a SwiftUI app with the new design"
- caveats: prominent action uses `.buttonStyle(.glassProminent) + .tint(_:)`; isolate it with `.sharedBackgroundVisibility(.hidden)` to prevent merge artifacts.

### Concentricity

Inner radius + inset = outer radius. SwiftUI resolves automatically via `ConcentricRectangle()` reading the nearest `.containerShape(...)`.

- web: `examples/macos-web/index.html` (`.lg-concentric` demo)
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/Sections.swift` (`ConcentricDemo`)
- apple: SwiftUI `ConcentricRectangle`; AppKit `NSView.LayoutRegion` + manual radii
- caveats: window outer corner radius is chosen to wrap concentrically around the toolbar pill.

---

## Rules

### Allowed glass surfaces

Top navigation, bottom navigation, tab bar, floating toolbar / action bar, sheet, popover, menu, floating card / panel above content, primary action surface.

- spec: `spec/rules/layout-rules.md`

### Forbidden glass surfaces

Page background, long-form text containers, forms / text fields, dense data tables, any element behind another glass element ("glass-on-glass").

- spec: `spec/rules/layout-rules.md`

### Anti-patterns (A1-A10)

The auditor in `plugins/liquid-glass-web/skills/liquid-glass-web-ui/scripts/audit-liquid-glass-html.mjs` enforces these for the web profile. The native side relies on the implementer and auditor agents to enforce by review.

- A1 Glass-on-glass
- A2 Glass behind body text
- A3 Invented material values
- A4 Invented component dimensions
- A5 Capsule miscalculation
- A6 Broken concentricity
- A7 Mixed Regular + Clear in one group
- A8 Unreadable Clear glass (no dim)
- A9 Missing accessibility fallback (web) / fighting system flags (native)
- A10 Invented Apple endorsement claims

- spec: `spec/rules/anti-patterns.md`, `plugins/liquid-glass-native/skills/liquid-glass-native-ui/references/anti-patterns.md`

---

## Accessibility

- Touch / click targets minimum 44 × 44.
- Text on Regular glass meets WCAG AA at the worst-case backdrop.
- Text on Clear glass requires a dim layer.
- Focus indicators visible against both light and dark backdrops.
- Web emits explicit fallbacks; native is system-driven.

- spec: `spec/rules/accessibility-rules.md`

---

## Resources

Full source provenance — WWDC25 sessions, Apple Newsroom, AppKit / SwiftUI docs,
independent reviews, screenshot URLs — lives in `docs/resources.md`.

---

## Plugin map

- `plugins/liquid-glass-web/` — web UI generation, auditing, design-tool prompts (consumed by `liquid-glass-web-implementer` + `liquid-glass-web-auditor` Claude subagents).
- `plugins/liquid-glass-native/` — native macOS UI guidance (consumed by `liquid-glass-native-implementer` + `liquid-glass-native-auditor` Claude subagents).
- `.claude/skills/liquid-glass-sync/` — local repo skill that orchestrates cross-cutting changes to spec + this doc + both examples.
