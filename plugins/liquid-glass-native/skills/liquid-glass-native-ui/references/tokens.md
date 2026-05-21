# Native tokens

The geometry tokens from `spec/tokens/*.yaml` apply to native too. Material
numerics do not — macOS 26 renders Liquid Glass in real time and Apple
publishes no portable blur / saturation / opacity values.

## Radii (points)

| Token | Value |
|---|---|
| `sm` | 12 |
| `md` | 16 |
| `lg` | 24 |
| `xl` | 28 |
| `capsule` | `height / 2` |

In SwiftUI: `RoundedRectangle(cornerRadius: ..., style: .continuous)`.
Use `ConcentricRectangle()` for children so corner curvatures stay parallel.

## Spacing (points)

| Token | Value | Use |
|---|---|---|
| `controlGap` | 8 | between controls inside one group |
| `groupGap` | 12 | between sibling groups inside a panel |
| `panelGap` | 16 | between panels |
| `screenMarginCompact` | 16 | edge inset on dense layouts |
| `screenMarginRegular` | 24 | edge inset on normal layouts |
| `sectionGap` | 32 | between top-level sections |

## Motion

| Token | Duration | Easing |
|---|---|---|
| `instant` | 80 ms | standard |
| `fast` | 160 ms | standard |
| `base` | 240 ms | standard |
| `slow` | 360 ms | standard |
| `sheet` | 420 ms | spring |

Easings:

- `standard`     — `cubic-bezier(0.2, 0, 0, 1)`
- `decelerate`   — `cubic-bezier(0, 0, 0, 1)`
- `accelerate`   — `cubic-bezier(0.3, 0, 1, 1)`
- `spring`       — `cubic-bezier(0.5, 1.6, 0.4, 0.85)` (SwiftUI: `.spring(response: 0.42, dampingFraction: 0.65)`)

## Typography

Use the SF system font (`Font.system(...)` / `NSFont.systemFont(ofSize:)`).
Eleven steps from caption2 to largeTitle — same ramp as the web profile.

| Token | Size / Line | Weight |
|---|---|---|
| `caption2` | 11 / 13 | 400 |
| `caption1` | 12 / 16 | 400 |
| `footnote` | 13 / 18 | 400 |
| `subheadline` | 15 / 20 | 400 |
| `callout` | 16 / 21 | 400 |
| `body` | 17 / 22 | 400 |
| `headline` | 17 / 22 | 600 |
| `title3` | 20 / 25 | 600 |
| `title2` | 22 / 28 | 700 |
| `title1` | 28 / 34 | 700 |
| `largeTitle` | 34 / 41 | 700 |

## Material — do not invent numerics

Apple does not publish blur / saturation / opacity numerics for Liquid Glass.
The web profile (`spec/tokens/material.yaml`) is a community approximation
labeled as such. For native code, use the variant API and let the system
render — never reach for `CIFilter` to "hand-tune" the look.

- SwiftUI: `Glass.regular`, `Glass.clear`, `.glass.tint(_:).interactive()`.
- AppKit: `NSGlassEffectView`, optional `tintColor`; or use the right `NSVisualEffectMaterial` (`.popover`, `.menu`, `.sheet`, etc.).
