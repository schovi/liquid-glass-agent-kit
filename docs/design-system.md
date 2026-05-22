# Liquid Glass — design system inventory

Unified inventory across spec, web, and native renderings. This file is
the single source of truth for cross-cutting changes. Modifications go
through `.claude/skills/liquid-glass-sync/`, which orchestrates lockstep
updates to this doc, the web prompt token block, the web showcase, the
native plugin references, and the native showcase.

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
- web: not rendered in `examples/macos-web` (macOS context); the web prompt covers iOS-style tab bars when targeted at mobile
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

### Popover

Anchored floating panel, Regular glass. Min width 220, radius 16, padding 8. Item radius 12.

- spec: `spec/components/popover.yaml`
- web: `examples/macos-web/styles.css` (`.lg-popover`, `.lg-popover__panel`, `.lg-popover__item`)
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/InputsOverlays.swift` (`PopoverDemo`) — `.popover(isPresented: arrowEdge:)`
- native plugin: `plugins/liquid-glass-native/skills/liquid-glass-native-ui/references/components/popover.md`
- apple: SwiftUI `.popover(isPresented:arrowEdge:content:)`; AppKit `NSPopover` (`behavior = .transient`)
- caveats: glass is automatic — do not stack `.glassEffect` inside the popover content. Arrow placement adapts to anchor edge; pass `arrowEdge` explicitly when the popover must point a specific direction.

### Menu

Pull-down or context menu — list of actions, optional separators, trailing keyboard shortcuts. Regular glass on macOS 26.

- spec: `spec/components/menu.yaml`
- web: `examples/macos-web/styles.css` (`.lg-menu`, `.lg-menu__item`)
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/InputsOverlays.swift` (`MenuDemo`) and `ContentView.swift` (toolbar `Menu`)
- native plugin: `plugins/liquid-glass-native/skills/liquid-glass-native-ui/references/components/menu.md`
- apple: SwiftUI `Menu { ... }`, `.contextMenu { ... }`; AppKit `NSMenu`, `NSPopUpButton`
- caveats: don't reorder destructive actions — the system places them at the bottom automatically. Mark destructive items with `role: .destructive` so the system tints them.

### Search field

Single-line search input. Capsule (32 tall) in toolbar, radius 12 (44 tall) inline. **Always solid.**

- spec: `spec/components/search-field.yaml`
- web: `examples/macos-web/styles.css` (`.lg-toolbar-search`, `.lg-search-field`)
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/ContentView.swift` (`.searchable`) and `InputsOverlays.swift` (inline demo)
- native plugin: `plugins/liquid-glass-native/skills/liquid-glass-native-ui/references/components/search-field.md`
- apple: SwiftUI `.searchable(text:placement:prompt:)`; AppKit `NSSearchField`, `NSSearchToolbarItem`
- caveats: never put `.glassEffect` behind the field. The toolbar host (titlebar) provides the surrounding glass — the field itself stays solid.

### Toggle

Boolean switch, system-rendered. Track 38×22, knob 18. Solid, used in form rows.

- spec: `spec/components/toggle.yaml`
- web: `examples/macos-web/styles.css` (`.lg-toggle`, `.lg-toggle__track`, `.lg-toggle__knob`)
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/FormsLists.swift` (`FormRowsDemo`) — `Toggle("Label", isOn: $value)`
- native plugin: `plugins/liquid-glass-native/skills/liquid-glass-native-ui/references/components/toggle.md`
- apple: SwiftUI `Toggle`; AppKit `NSSwitch`
- caveats: prefer `Toggle` inside `Form`; the system handles labeling and accessibility. Custom rendering breaks VoiceOver.

### Slider

Continuous value. Solid track (height 4), 22 pt thumb. In toolbar contexts the thumb gets glass automatically.

- spec: `spec/components/slider.yaml`
- web: `examples/macos-web/styles.css` (`.lg-slider`, `.lg-slider__track`, `.lg-slider__thumb`)
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/InputsOverlays.swift` (`SliderDemo`) — `Slider(value:in:)`
- native plugin: `plugins/liquid-glass-native/skills/liquid-glass-native-ui/references/components/slider.md`
- apple: SwiftUI `Slider(value:in:step:)` (optionally `neutralValue:` on macOS 26); AppKit `NSSlider`
- caveats: never put `.glassEffect` on the track — glass behind a value the user is reading is anti-pattern A2. The thumb's glass is system-applied in toolbar contexts only.

### Progress

Determinate or indeterminate progress. Solid. Linear track height 4; circular 16 / 24 / 32.

- spec: `spec/components/progress.yaml`
- web: `examples/macos-web/styles.css` (`.lg-progress--linear`, `.lg-progress--circular`)
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/InputsOverlays.swift` (`ProgressDemo`) — `ProgressView(value:)` and `ProgressView()`
- native plugin: `plugins/liquid-glass-native/skills/liquid-glass-native-ui/references/components/progress.md`
- apple: SwiftUI `ProgressView`; AppKit `NSProgressIndicator`
- caveats: indeterminate spinners do not honor `Color.tint` reliably — use `.tint(_:)` and accept the system fallback. Never put a glass background under either variant.

### Badge

Small solid status pill, 20 tall, capsule. Sits on content surfaces or trailing edges of list rows.

- spec: `spec/components/badge.yaml`
- web: `examples/macos-web/styles.css` (`.lg-badge`, modifiers `.lg-badge--info`, `--success`, `--warning`, `--danger`)
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/FormsLists.swift` (`BadgeRow`) — custom Capsule + `.foregroundStyle(...)`
- native plugin: `plugins/liquid-glass-native/skills/liquid-glass-native-ui/references/components/badge.md`
- apple: no single API — compose `Capsule().fill(...)` + label. For numeric counters, `.badge(_:)` on `NavigationLink` / `TabView` items.
- caveats: badges sit on solid backgrounds; placing one on a glass surface defeats its contrast purpose. Counter badges follow Apple's right-aligned trailing-edge convention.

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

### Form rows

Solid `Form` + `LabeledContent`. Never glass. Row gap 12; section gap 24.

- spec: `spec/patterns/form-rows.md`
- web: `examples/macos-web/styles.css` (`.lg-form`, `.lg-form-row`)
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/FormsLists.swift` (`FormRowsDemo`)
- native plugin: `plugins/liquid-glass-native/skills/liquid-glass-native-ui/references/patterns/form-rows.md`
- apple: SwiftUI `Form` / `Section` / `LabeledContent`; AppKit `NSGridView`
- caveats: glass on a form is anti-pattern A2. Inside a sheet, the sheet's glass is the only glass — the form stays solid.

### Inset list

`List(.inset)` with grouped sections. Solid rows, solid section backgrounds. Row min-height 32 (compact) / 44 (regular).

- spec: `spec/patterns/inset-list.md`
- web: `examples/macos-web/styles.css` (`.lg-inset-list`, `.lg-inset-list__section`)
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/FormsLists.swift` (`InsetListDemo`)
- native plugin: `plugins/liquid-glass-native/skills/liquid-glass-native-ui/references/patterns/inset-list.md`
- apple: SwiftUI `List { Section { ... } }.listStyle(.inset)`; AppKit `NSCollectionView` grouped layout
- caveats: don't mix inset and plain styles in one list. Sidebar-style lists use `.listStyle(.sidebar)` inside `NavigationSplitView` instead — the system applies glass to the sidebar, not the rows.

### Disclosure group

Collapsible row inside an inset list or inspector. Solid. Indent 16 per depth.

- spec: `spec/patterns/disclosure-group.md`
- web: `examples/macos-web/styles.css` (`.lg-disclosure-group`)
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/FormsLists.swift` (`DisclosureDemo`)
- native plugin: `plugins/liquid-glass-native/skills/liquid-glass-native-ui/references/patterns/disclosure-group.md`
- apple: SwiftUI `DisclosureGroup`, `OutlineGroup`; AppKit `NSOutlineView`
- caveats: cap visible depth at 3 in content panels. Persist expansion with `@SceneStorage` when the user expects state across window restoration.

### Stepper

Paired increment / decrement buttons. Toolbar variant uses `GlassEffectContainer` (shared glass capsule); form variant is solid.

- spec: `spec/patterns/stepper.md`
- web: `examples/macos-web/styles.css` (`.lg-stepper`)
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/FormsLists.swift` (`StepperDemo`)
- native plugin: `plugins/liquid-glass-native/skills/liquid-glass-native-ui/references/patterns/stepper.md`
- apple: SwiftUI `Stepper(value:in:step:)`; AppKit `NSStepper`
- caveats: hold-to-repeat is built into `Stepper` — don't reimplement. VoiceOver reads the current value and step; don't strip the system label.

### Titlebar accessory

Custom view in the principal toolbar slot — typically a segmented control or breadcrumb. Inherits the unified toolbar's glass; the accessory itself adds no glass.

- spec: `spec/patterns/titlebar-accessory.md`
- web: `examples/macos-web/index.html` (`.lg-titlebar__center` houses the principal segmented control)
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/ContentView.swift` (`ToolbarItem(placement: .principal)`)
- native plugin: `plugins/liquid-glass-native/skills/liquid-glass-native-ui/references/patterns/titlebar-accessory.md`
- apple: SwiftUI `ToolbarItem(placement: .principal)`; AppKit `NSTitlebarAccessoryViewController` (`layoutAttribute = .top`)
- caveats: only one principal slot per toolbar. Don't add `.glassEffect` — the toolbar already provides the shared glass (A1).

### Floating HUD

Free-floating Regular-glass control surface over media or canvas. Capsule (single row) or 16-radius (multi-row).

- spec: `spec/patterns/floating-hud.md`
- web: `examples/macos-web/styles.css` (`.lg-floating-hud`)
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/InputsOverlays.swift` (`FloatingHUDDemo`)
- native plugin: `plugins/liquid-glass-native/skills/liquid-glass-native-ui/references/patterns/floating-hud.md`
- apple: SwiftUI `GlassEffectContainer` inside `.overlay(alignment:)`; AppKit `NSGlassEffectContainerView` positioned in the content view
- caveats: never place a HUD over a form or text-heavy view (A2). For video, fade-out uses `fast` (160 ms) standard easing.

### Morphing

Glass elements morph — they don't pop — when they appear, disappear, swap shape, or move. The web side approximates the **single-capsule** flavor only.

- spec: `spec/patterns/morphing.md`
- web: `examples/macos-web/sections.js` (`morphingBody`) + `examples/macos-web/styles.css` (`.lg-morph-pill`). Single-capsule shape morph — one CSS transition on width / border-radius / contents, one `backdrop-filter` sample. Multi-capsule metaball emergence is **not** approximated (SVG goo filters fight `backdrop-filter` and oversell what the profile delivers).
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/Patterns.swift` (`MorphingSection`) — expand-into-row and capsule-swap demos.
- native plugin: `plugins/liquid-glass-native/skills/liquid-glass-native-ui/references/patterns/morphing.md`
- apple: SwiftUI `@Namespace` + `glassEffectID(_:in:)` + `glassEffectUnion(id:in:)` inside a shared `GlassEffectContainer`, with `withAnimation`; AppKit `NSGlassEffectContainerView` + `NSAnimationContext.runAnimationGroup`
- caveats: native morph requires same container, same namespace, animated transaction, and `spacing:` chosen so the resting state is either fused or fully separated (never the half-merged blob in between). The web approximation covers only the single-capsule shape change; reduced-motion drops the transition.

### Scroll edge effects

Per-edge fade / harden treatment beneath floating chrome.

- spec: `spec/patterns/scroll-edge-effects.md`
- web: `examples/macos-web/sections.js` (`scrollEdgeEffectsBody`) + `examples/macos-web/styles.css` (`.lg-edge-demo__list--soft` / `--hard`) — approximation via `mask-image: linear-gradient(...)`; web prompt names this in the "Scroll edge effects (web approximation)" section.
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/Patterns.swift` (`ScrollEdgeEffectsSection`) — side-by-side `.soft` vs `.hard` scroll views under a glass pill.
- native plugin: `plugins/liquid-glass-native/skills/liquid-glass-native-ui/references/patterns/scroll-edge-effects.md`
- apple: SwiftUI `.scrollEdgeEffectStyle(_:for:)`; AppKit `NSScrollView.topEdgeEffect.style` / `.bottomEdgeEffect` / `.leftEdgeEffect` / `.rightEdgeEffect`
- caveats: one style per edge, never mix soft + hard on adjacent edges. Apply only where chrome actually overlaps that edge. `NavigationSplitView` columns already apply hard edges to their toolbars. Reduced-transparency drops the mask in the web approximation and falls back to a solid divider.

---

## System primitives

Apple ships these as system-provided UI. Wrap, don't restyle.

### Alert / Confirmation dialog / Tooltip

`Alert` and `ConfirmationDialog` are system-rendered modals. `Tooltip` (`.help(_:)`) is a system text bubble on hover. None of them carry Liquid Glass tokens you can tweak — they pick up the system treatment.

- spec: covered as a recipe in `plugins/liquid-glass-native/skills/liquid-glass-native-ui/references/system-primitives.md`
- web: out of scope — the web prompt notes "use the platform dialog / native tooltip"
- native: `examples/macos-native-swift/Sources/LiquidGlassShowcase/InputsOverlays.swift` (`SystemPrimitivesDemo`)
- native plugin: `plugins/liquid-glass-native/skills/liquid-glass-native-ui/references/system-primitives.md`
- apple: SwiftUI `.alert(_:isPresented:actions:)`, `.confirmationDialog(_:isPresented:titleVisibility:actions:)`, `.help(_:)`; AppKit `NSAlert`, `NSToolTip`
- caveats: do not reimplement these. Custom alerts that look like the system alert mislead users about origin (system vs. app) and break accessibility.

---

## Rules

### Allowed glass surfaces

Top navigation, bottom navigation, tab bar, floating toolbar / action bar, sheet, popover, menu, floating card / panel above content, primary action surface.

- spec: `spec/rules/layout-rules.md`

### Forbidden glass surfaces

Page background, long-form text containers, forms / text fields, dense data tables, any element behind another glass element ("glass-on-glass").

- spec: `spec/rules/layout-rules.md`

### Anti-patterns (A1-A10)

The auditor in `audit/liquid-glass-audit.mjs` enforces these for the web profile. The native side relies on the implementer and auditor agents to enforce by review.

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

### Native-only bonus pitfalls

Not part of A1-A10 (the web auditor doesn't enforce them), but flagged by the native implementer / auditor on review:

- `.glassEffect` placed mid-chain — must run last, after layout / frame / padding.
- Materials around the control instead of on it — wrap a `Button` in a backdrop and the backdrop becomes the affordance.
- `.interactive()` on static surfaces — adds phantom hover targets and confuses screen readers.
- Removing `.glassEffect` conditionally instead of using `.identity` — reflows layout for no reason.
- Morph without `withAnimation` / `NSAnimationContext` — participants pop instead of morphing.
- Morph across separate `GlassEffectContainer`s — never works; use one container or `.glassEffectUnion(id:in:)`.
- `GlassEffectContainer(spacing:)` set to a middle value vs. HStack gap — produces half-merged blob tails at rest. Pick `spacing: ≥ gap` (fused pill) or `spacing: < gap` (separate capsules), never in between.
- Mixing `.soft` + `.hard` scroll edge styles on adjacent edges of one scroll view.
- Edge effect on a scroll view with no overlapping chrome — decorative noise.
- Icon + label glued into one tap target — pick icon-only or label-only.
- `.glassProminent` + `.circle` border shape painting outside the circle — add `.clipShape(Circle())`.

- native plugin: `plugins/liquid-glass-native/skills/liquid-glass-native-ui/references/anti-patterns.md` (Bonus section)

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

## Delivery map

- `prompts/web-frosted-glass.md` — paste-once prompt for any AI tool that produces web output. Compresses the spec's web tokens, geometry, and accessibility rules into one block.
- `audit/liquid-glass-audit.mjs` — standalone static check on web output (HTML/CSS/JS).
- `plugins/liquid-glass-native/` — Codex + Claude Code plugin for native macOS UI guidance (consumed by `liquid-glass-native-implementer` + `liquid-glass-native-auditor` Claude subagents).
- `.claude/skills/liquid-glass-sync/` — local repo skill that orchestrates cross-cutting changes across spec, this doc, the web prompt, the web showcase, the native plugin references, and the native showcase.
