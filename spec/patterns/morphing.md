# Morphing glass

When a glass element appears, disappears, swaps shape, or moves between
two locations, it should *morph* — not pop. Morphing is the signature
animation of Liquid Glass.

This is a native-only pattern. The web profile has no equivalent (the
prompt notes "no morphing in the web approximation").

## When to use

- A floating button expands into a row of related actions.
- A capsule pill swaps between two states (e.g. "Reply" → "Send").
- A glass element on one side of the toolbar should *fly across* to
  another spot when the layout changes.

## Apple APIs

- SwiftUI: `@Namespace`, `glassEffectID(_:in:)`, `glassEffectUnion(id:in:)`,
  `GlassEffectContainer(spacing:)`, and any `withAnimation { ... }` state
  change.
- AppKit: morph between `NSGlassEffectView` instances inside a shared
  `NSGlassEffectContainerView`. The container handles the shared sampling
  pass; the animation comes from standard `NSAnimationContext`.

## Requirements

The morph only happens when **all four** of these hold:

1. The participating views live in the **same** `GlassEffectContainer`
   (SwiftUI) or `NSGlassEffectContainerView` (AppKit). Cross-container
   morphs do not exist.
2. They share a **single** `@Namespace` and a **per-identity**
   `glassEffectID(_:in:)` value.
3. The state change is wrapped in `withAnimation(...)` (SwiftUI) or
   `NSAnimationContext.runAnimationGroup(...)` (AppKit). Without an
   animated transaction, the views just appear and disappear.
4. The container's `spacing:` is large enough to cover the gap between
   the participants. Tighter spacing means elements must be physically
   closer before the morph kicks in.

## Geometry

- Container `spacing:` is the **merge threshold**, not a margin. Sibling
  glass elements closer to each other than `spacing:` render with
  metaball "tail" tension between them. Elements farther apart than
  `spacing:` render as cleanly separate capsules. Pick `spacing:` so
  the **resting state** is what you want:
  - Fully merged pill (toolbar grouping): set `spacing:` ≥ the
    inter-item gap. Standard toolbar pill is `spacing: 4` with HStack
    gap `4`.
  - Cleanly separated capsules (expanded action row): set `spacing:`
    **smaller** than the inter-item gap, e.g. container `spacing: 4`
    with HStack gap `16`. The morph identity still works because the
    items share the container and namespace.
  - Don't pick a value in the middle (e.g. container `24` with gap `8`).
    That renders the awkward half-merged blob state at rest — fine
    *during* animation, wrong as a resting visual.
- Duration: `base` (240 ms) with `spring` easing for expansion, `fast`
  (160 ms) standard easing for swap.
- Reduced Motion collapses the morph to a cross-fade automatically — do
  not override.

## Forbidden

- Putting morph participants in **different** `GlassEffectContainer`s
  and expecting them to morph (they will not).
- Mixing Regular and Clear glass in the same morph (A7 — different
  variants do not share a sampling pass).
- Animating the wrong thing: morph is the *glass* moving, not the
  *content* sliding. Do not animate `offset` or `position` to fake it.
- Continuous animation loops on glass surfaces — glass at rest is
  cheap, glass mid-morph is GPU-heavy.

## Caveats

- `glassEffectUnion(id:in:)` is the cross-distance variant — use it when
  morph participants are not direct siblings (e.g. one is in the
  toolbar, one is in the content area, and they need to morph between
  each other).
- The morph reads the *resolved* shape at each end. If the start shape
  is `Capsule()` and the end shape is `RoundedRectangle(cornerRadius:
  12)`, the curve interpolates — both shapes should be visually
  intentional, not arbitrary defaults.
- On macOS 26 the unified toolbar uses morphing internally when an
  item's prominence changes (e.g. `.glassProminent` toggled on). You
  rarely need to wire morphing inside the toolbar yourself.
