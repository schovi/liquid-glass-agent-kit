# Floating HUD

A free-floating Regular-glass control surface sitting over media or a
large canvas. Common for media players, image editors, map controls.
Differs from the toolbar pattern because it floats inside the content
area rather than docking to the titlebar.

## Geometry

- Container radius: capsule for a single row of controls, 16 (`md`) for
  a multi-row HUD.
- Container padding: 6.
- Item size: 40.
- Gap between items: 4.
- Margin from window edge: 16 (`screenMarginCompact`).
- Shadow: the standard `--lg-glass-shadow` token; no extra elevation.

## Apple APIs

- SwiftUI: `GlassEffectContainer` wrapping the row, presented in a
  `.overlay(alignment: .bottom)` on the content view. Use
  `.glassEffect(.regular.interactive(), in: Capsule())` if the whole
  HUD should respond to hover.
- AppKit: `NSGlassEffectContainerView` hosting `NSButton`s with
  `bezelStyle = .glass`, positioned with manual constraints inside
  the content view.

## SwiftUI recipe

```swift
content
    .overlay(alignment: .bottom) {
        GlassEffectContainer(spacing: 4) {
            HStack(spacing: 4) {
                ForEach(actions) { action in
                    Button { action.run() } label: {
                        Image(systemName: action.icon)
                            .frame(width: 40, height: 40)
                    }
                    .buttonStyle(.glass)
                    .buttonBorderShape(.capsule)
                }
            }
            .padding(6)
        }
        .padding(.bottom, 16)
    }
```

## Forbidden

- Putting a HUD over a form or text-heavy view. HUDs belong over media,
  canvas, or sparse content (A2).
- Nesting two HUDs (A1).
- Inventing a custom shadow or border (A3).

## Caveats

- The HUD must clear focusable content beneath it; otherwise the
  invisible click target hides controls. Always pair with
  `.allowsHitTesting(true)` on the HUD only.
- On Reduced Transparency the HUD falls back to the opaque
  `--lg-fallback-bg-*` color. Do not hand-roll a substitute.
- For video controls, fade the HUD with `fast` (160 ms) standard easing
  on hover-end so it doesn't compete with playback.
