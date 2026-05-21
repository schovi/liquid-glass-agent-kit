# Liquid Glass — native SwiftUI showcase

Mirror of `examples/macos-web/` (HTML) but built with the real
macOS 26 Liquid Glass SwiftUI APIs. Use this to see what the web profile
is approximating.

## Requirements

- macOS 26 (Tahoe) — Liquid Glass APIs only exist at runtime on 26+.
- Xcode 26 toolchain (Swift 6.0+).

## Run

```bash
cd examples/macos-native-swift
./scripts/run.sh             # debug build, launches the app
./scripts/run.sh release     # optimized build
```

Or use the equivalents directly:

```bash
swift run LiquidGlassShowcase
```

Open in Xcode:

```bash
./scripts/xcode.sh           # xed Package.swift
```

Other scripts:

```bash
./scripts/build.sh           # debug build (no launch)
./scripts/build.sh release   # release build
./scripts/clean.sh           # wipe .build/
```

## What's in here

- **Window chrome** — system traffic lights, unified titlebar+toolbar, concentric outer radius.
- **`NavigationSplitView`** — sidebar (auto Liquid Glass) + detail + inspector.
- **Toolbar** — `Picker(.segmented)`, `.searchable(...)`, popover trigger, `.buttonStyle(.glassProminent)`. `ToolbarSpacer(.flexible)` splits glass capsules.
- **Materials** — `.glassEffect(.regular, in: ...)` and `.glassEffect(.clear, in: ...)` with the required dim layer for Clear.
- **Shape** — `ConcentricRectangle()` reading from `.containerShape(...)`.
- **Spacing** — visual token scale (8 / 12 / 16 / 24 / 32).
- **Typography** — `.largeTitle` → `.caption2` ramp.
- **Motion** — duration / easing chips.
- **Buttons** — `.buttonStyle(.glass)`, `.buttonStyle(.glassProminent)`, `.buttonBorderShape(.capsule)`, `.controlSize(.extraLarge)`.
- **Controls** — segmented `Picker`, `TextField`, popover.
- **Surfaces** — content cards (solid — not glass).
- **Sheet** — `.sheet(...)` with `.presentationDetents([.medium, .large])` so Liquid Glass is automatic.
- **Reference** — rules + anti-patterns.
- **Clear variant** — its own section so it isn't grouped with Regular.

## Why a separate example

The HTML showcase approximates Liquid Glass with `backdrop-filter` + `saturate` + a
highlight gradient. That's deliberate — the kit's whole point is making the
material reachable on the web where Apple's native renderer doesn't run.

This Swift example uses the *actual* Apple APIs, on the *actual* platform
they target. Same anatomy, same component vocabulary. Use it for honest
visual comparison and as a port-from-spec reference for native macOS work.

## Source map

```
Package.swift
scripts/
├── build.sh              — swift build [debug|release]
├── run.sh                — swift run [debug|release]
├── clean.sh              — swift package clean && rm -rf .build
└── xcode.sh              — xed Package.swift
Sources/LiquidGlassShowcase/
├── App.swift             — @main, Scene, WindowGroup
├── ContentView.swift     — NavigationSplitView, selection state, toolbar
├── Sidebar.swift         — source-list sidebar
├── Inspector.swift       — metadata inspector pane
├── Tokens.swift          — radius / spacing / motion constants from spec
└── Sections.swift        — every showcase section in one file
```

## Source notes

- Liquid Glass APIs documented:
  - [`.glassEffect(_:in:)`](https://developer.apple.com/documentation/swiftui/view/glasseffect(_:in:))
  - [`GlassButtonStyle`](https://developer.apple.com/documentation/swiftui/glassbuttonstyle)
  - [`GlassProminentButtonStyle`](https://developer.apple.com/documentation/swiftui/glassprominentbuttonstyle)
  - [`ConcentricRectangle`](https://developer.apple.com/documentation/swiftui/concentricrectangle)
  - [`sharedBackgroundVisibility(_:)`](https://developer.apple.com/documentation/swiftui/customizabletoolbarcontent/sharedbackgroundvisibility(_:))
- Full provenance: `docs/resources.md`.

## Not Apple-endorsed

This is community-derived. Apple publishes no numeric blur / saturation /
opacity values for Liquid Glass — the material is real-time rendered.
