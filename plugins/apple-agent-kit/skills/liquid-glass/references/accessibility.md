# Accessibility — glass-specific (native)

This file covers the accessibility surface that is **specific to Liquid Glass**: how the system auto-degrades `.glassEffect` based on the user's preferences, and the native scope of the glass-related audit IDs.

For generic WCAG conformance on Mac apps (labels, focus, target size, color signals) see `macos-app-design/references/accessibility.md` — every Mac app needs both files.

## What the system does for you

macOS 26 / SwiftUI auto-degrades `.glassEffect` and AppKit `NSGlassEffectView` based on the user's accessibility preferences:

| User preference                         | SwiftUI signal                              | AppKit signal                                          | Effect                                                                |
| --------------------------------------- | ------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------- |
| Reduce transparency                     | `@Environment(\.accessibilityReduceTransparency)` | `NSAccessibility.shouldReduceTransparency()`         | `.glassEffect` falls to an opaque variant; vibrancy on `NSVisualEffectView` reduces. |
| Increase contrast                       | `@Environment(\.colorSchemeContrast)` returns `.increased` | `NSAccessibility.shouldIncreaseContrast()`          | Vibrancy materials darken; system borders gain weight; tints intensify. |
| Differentiate without color             | `@Environment(\.accessibilityDifferentiateWithoutColor)` | `NSWorkspace.shared.accessibilityDisplayShouldDifferentiateWithoutColor` | State changes that rely on hue alone fail this; system adds checkmarks / shape changes where it can. |
| Reduce motion                           | `@Environment(\.accessibilityReduceMotion)` | `NSAccessibility.shouldReduceMotion()`                 | Spring / morph animations collapse; `glassEffectID` transitions resolve without elasticity. |

Do **not** override these by branching on the flag and re-applying a custom blur or shader on top — that's anti-pattern A9. The shader surfaces (`.layerEffect`, `.colorEffect`, `.distortionEffect`) are the one exception: they don't auto-degrade, so they MUST carry an explicit fallback branch (see `references/metal-shaders.md`).

## Audit-ID mapping — glass-specific scope

The web auditor IDs A2 / A8 / A9 all have native analogues but the native auditor agent enforces them through code review, not static scanning. When you spot a violation, cite the matching ID:

- **A2** — glass behind body content. Native: `.glassEffect` on a scroll container holding `Text` / `Table`.
- **A8** — Clear glass without a dim layer.
- **A9** — fighting `accessibilityReduceTransparency` / `accessibilityReduceMotion`. Includes shader heroes that lack a reduce-transparency fallback branch.

A26 and A27 (generic native focus + accessible-name rules) are documented in `macos-app-design/references/accessibility.md` — they apply to any Mac app, not just glass surfaces. A25 (renderer tier) is web-only and never raised on native code.

## Sources

- [Apple — Accessibility Inspector](https://developer.apple.com/accessibility/) — run every Liquid Glass scene through it before shipping.
- [WWDC25 session 219 — Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219/) — auto-degradation paths.
- [NN/g — Liquid Glass Is Cracked](https://www.nngroup.com/articles/liquid-glass/) — failure modes you're correcting for.
- [Infinum — Questionably accessible](https://infinum.com/blog/apples-ios-26-liquid-glass-sleek-shiny-and-questionably-accessible/) — measured WCAG-AA breakage on Control Center.
- [Axess Lab — Glassmorphism meets accessibility](https://axesslab.com/glassmorphism-meets-accessibility-can-frosted-glass-be-inclusive/) — the contrast-film recommendation.

## See also

- `spec/rules/accessibility-rules.md` — the canonical cross-cutting rule.
- `references/anti-patterns.md` — A9 (fighting system flags) and the full audit-ID list.
- `references/metal-shaders.md` — shader-hero reduce-transparency fallback (the one place where auto-degradation does not apply).
- `macos-app-design/references/accessibility.md` — generic WCAG mapping (1.4.1 color, 2.4.7 focus, 2.5.5 target size, 4.1.2 name) for any Mac app.
