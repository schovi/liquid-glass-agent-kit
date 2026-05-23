# Accessibility on macOS 26 (native)

Accessibility is the kit's headline rule. The web auditor enforces it
statically; on native the system handles most of the fallback path
automatically, but the code MUST stay out of its way.

## What the system does for you

macOS 26 / SwiftUI auto-degrades `.glassEffect` and AppKit
`NSGlassEffectView` based on the user's accessibility preferences:

| User preference                         | SwiftUI signal                              | AppKit signal                                          | Effect                                                                |
| --------------------------------------- | ------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------- |
| Reduce transparency                     | `@Environment(\.accessibilityReduceTransparency)` | `NSAccessibility.shouldReduceTransparency()`         | `.glassEffect` falls to an opaque variant; vibrancy on `NSVisualEffectView` reduces. |
| Increase contrast                       | `@Environment(\.colorSchemeContrast)` returns `.increased` | `NSAccessibility.shouldIncreaseContrast()`          | Vibrancy materials darken; system borders gain weight; tints intensify. |
| Differentiate without color             | `@Environment(\.accessibilityDifferentiateWithoutColor)` | `NSWorkspace.shared.accessibilityDisplayShouldDifferentiateWithoutColor` | State changes that rely on hue alone fail this; system adds checkmarks / shape changes where it can. |
| Reduce motion                           | `@Environment(\.accessibilityReduceMotion)` | `NSAccessibility.shouldReduceMotion()`                 | Spring / morph animations collapse; `glassEffectID` transitions resolve without elasticity. |

Do **not** override these by branching on the flag and re-applying a
custom blur or shader on top — that's anti-pattern A9. The shader
surfaces (`.layerEffect`, `.colorEffect`, `.distortionEffect`) are the
one exception: they don't auto-degrade, so they MUST carry an explicit
fallback branch (see `references/metal-shaders.md`).

## What you MUST add

### Accessibility labels (WCAG 4.1.2)

Every interactive element needs an accessible name. Icon-only buttons
fail this if you forget.

```swift
// SwiftUI
Button { } label: {
    Image(systemName: "trash")
}
.accessibilityLabel("Delete")
.accessibilityHint("Removes the selected item")  // optional, when behavior is non-obvious
```

```swift
// AppKit
let button = NSButton(image: NSImage(named: "trash")!, target: nil, action: nil)
button.setAccessibilityLabel("Delete")
```

Compose with `accessibilityElement(children: .combine)` when a custom
control aggregates multiple subviews:

```swift
HStack {
    Image(systemName: "person.crop.circle")
    Text("Account")
}
.accessibilityElement(children: .combine)
.accessibilityAddTraits(.isButton)
```

### Focus visibility (WCAG 2.4.7)

The system draws focus rings on standard controls automatically. For
custom hit areas, declare focus state and reflect it visually:

```swift
@FocusState private var isFocused: Bool

Button("Run") { }
    .focused($isFocused)
    .overlay(
        ConcentricRectangle()
            .strokeBorder(.tint, lineWidth: isFocused ? 2 : 0)
    )
```

AppKit uses `acceptsFirstResponder`, `becomeFirstResponder()`, and
`drawFocusRingMask()` on `NSView` subclasses. Do not disable the
focus ring on a custom control.

### Touch / click targets (WCAG 2.5.5)

44×44 pt minimum hit area for any interactive element. Token
`buttonMinHeight = 44`. If the visual size is smaller (e.g. a 22 pt
icon), pad to reach 44.

```swift
Button { } label: {
    Image(systemName: "ellipsis")
        .frame(width: 44, height: 44)        // hit area
}
```

### Color is never the only signal (WCAG 1.4.1)

Selection, error, and warning states pair a hue change with an icon,
weight change, or shape:

```swift
HStack {
    Image(systemName: isError ? "exclamationmark.triangle" : "checkmark.circle")
        .foregroundStyle(isError ? .red : .green)
    Text(message)
}
```

## Audit-ID mapping

The web auditor IDs A2 / A8 / A9 / A26 / A27 all have native analogues
but the native auditor agent enforces them through code review, not
static scanning. When you spot a violation, cite the matching ID:

- **A2** — glass behind body content. Native: `.glassEffect` on a
  scroll container holding `Text` / `Table`.
- **A8** — Clear glass without a dim layer.
- **A9** — fighting `accessibilityReduceTransparency` /
  `accessibilityReduceMotion`. Includes shader heroes that lack a
  reduce-transparency fallback branch.
- **A26** — custom hit area with no visible focus reflection. Native
  scope: custom `NSControl` / SwiftUI `Button { } label:` that hides
  the focus ring without replacing it.
- **A27** — icon-only `Button` / `NSButton` without
  `accessibilityLabel` / `setAccessibilityLabel`.

A25 (renderer tier) is web-only and never raised on native code.

## Sources

- [Apple — Accessibility Inspector](https://developer.apple.com/accessibility/) — run every Liquid Glass scene through it before shipping.
- [Apple — UIAccessibility on iOS, NSAccessibility on macOS](https://developer.apple.com/documentation/appkit/nsaccessibility) — the canonical API surface.
- [WWDC25 session 219 — Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219/) — auto-degradation paths.
- [NN/g — Liquid Glass Is Cracked](https://www.nngroup.com/articles/liquid-glass/) — failure modes you're correcting for.
- [Infinum — Questionably accessible](https://infinum.com/blog/apples-ios-26-liquid-glass-sleek-shiny-and-questionably-accessible/) — measured WCAG-AA breakage on Control Center.
- [Axess Lab — Glassmorphism meets accessibility](https://axesslab.com/glassmorphism-meets-accessibility-can-frosted-glass-be-inclusive/) — the contrast-film recommendation.

## See also

- `spec/rules/accessibility-rules.md` — the canonical cross-cutting rule.
- `references/anti-patterns.md` — A9 (fighting system flags) and the
  full audit-ID list.
- `references/metal-shaders.md` — shader-hero reduce-transparency
  fallback (the one place where auto-degradation does not apply).
