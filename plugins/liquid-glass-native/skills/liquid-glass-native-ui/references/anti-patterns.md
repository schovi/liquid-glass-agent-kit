# Anti-patterns (native)

The ten things to never ship. Mirrors the web profile's A1-A10 with the
native-specific failure modes called out.

## A1 — Glass on glass

Two glass surfaces stacked. On native, this happens when you wrap a
`.glassEffect`-ed view inside another `.glassEffect`, or when you put an
`NSGlassEffectView` inside another `NSGlassEffectView`. The lower surface
contributes no real refraction; the upper surface samples mostly glass.

Fix: use `GlassEffectContainer` (SwiftUI) / `NSGlassEffectContainerView`
(AppKit) to *group* sibling glass elements onto one sampling pass — that
is not nesting, that is sharing.

## A2 — Glass behind body content

Glass behind paragraphs, articles, forms, dense tables. Text shimmers
under scroll and contrast drops below WCAG AA on busy backgrounds.

Native-specific:
- Glass behind `Text` inside a `ScrollView` — bad.
- Glass behind a `TextField` — bad. SwiftUI / AppKit text fields should be
  solid. If you need a tinted look, use `.background(.thinMaterial)` *not*
  `.glassEffect`.

## A3 — Invented material values

There are no published numeric blur / saturation / opacity values for
Liquid Glass. Apple renders it in real time. Do not:

- Reach for `CIFilter` or `Metal` to "tune" the look.
- Force a `.backgroundEffect(.regularMaterial)` and treat it as Liquid Glass — that's the *older* vibrancy material on Sonoma and earlier.

Use the variant API and trust the system.

## A4 — Invented component dimensions

Touch / click targets are 44 × 44 pt minimum. Button heights, paddings,
icon sizes come from `references/tokens.md` and `spec/components/*.yaml`.
Do not improvise a "looks right" size.

## A5 — Capsule miscalculation

A capsule's corner radius is `height / 2`. A 44 pt tall button with a 12
pt radius is not a capsule.

Native fix: use `.buttonBorderShape(.capsule)` (SwiftUI) or
`button.borderShape = .capsule` (AppKit). Don't hand-roll a
`RoundedRectangle(cornerRadius: 12)` for a 44 pt button.

## A6 — Broken concentricity

Window outer radius = 28 pt, toolbar inner pill radius = 24 pt, inset
between them is 4 pt → 24 + 4 = 28 ✓.

Wrong: outer 28 pt, inner pill 28 pt (no inset apparent).
Wrong: outer 28 pt, inner pill 16 pt (visible "jump" where curves diverge).

SwiftUI fix: declare `.containerShape(...)` on the parent and use
`ConcentricRectangle()` on children to inherit the resolved curvature.

## A7 — Mixed Regular and Clear in one group

`GlassEffectContainer` or any sibling glass set must use one variant.
Mixing Regular and Clear in one group breaks the unified appearance.

If a Materials demo *must* show both for comparison, put them in
*different* containers / sections clearly separated, with their own
labels.

## A8 — Unreadable Clear glass

Clear glass without a dim layer behind it on rich media (photo, video,
heavy gradient) drops contrast below WCAG AA. Either:

- Add a `Color.black.opacity(0.24)` layer behind the Clear surface, or
- Switch to Regular.

If you can't guarantee a dim layer at build time (e.g. user-supplied
media), default to Regular.

## A9 — Fighting system accessibility flags

Do not implement custom reduced-transparency, reduced-motion, or
increased-contrast fallbacks for Liquid Glass — the system does this
automatically.

What this means:

- Don't query `accessibilityReduceTransparency` and swap to a solid
  background yourself for `.glassEffect`-ed views. The system already
  did it.
- Don't override `NSAccessibility.shouldDifferentiateWithoutColor` to
  re-enable transparency.

If your *own custom rendering* (a metaball, a CAEmitterLayer, etc.) needs
fallback, branch on `@Environment(\.accessibilityReduceTransparency)`.
But your custom rendering should rarely sit in the Liquid Glass layer
anyway — it belongs in content.

## A10 — Apple endorsement claims

This kit is not Apple-official. Do not ship docs, marketing copy, or
inline comments saying "Liquid Glass certified" / "Apple-official" /
"licensed by Apple". Even in jest.

The kit is inspired-by, not endorsed. That's stated in the spec, the
plugin manifests, and every README.

## Bonus — macOS 26-specific gotchas

These aren't in the A1-A10 list but burn real engineers:

- **Removing `NSVisualEffectMaterial.sidebar`** is what *enables* Liquid Glass on sidebars in macOS 26. Many migrations look "broken" because the engineer kept the legacy material.
- **Adding `.presentationBackground(.glass)`** on a sheet is redundant when `.presentationDetents` already includes a partial detent. It can produce double-glass.
- **Stacking two `.toolbar` modifiers** in different ancestors results in two glass strips. Pick one place.
- **`.glassEffect` placed mid-chain.** Glass samples behind the view; layout / frame / padding must run *before* glass. Move `.glassEffect` to the end of the modifier chain.
- **Materials around the control, not on it.** Wrapping a `Button` in a `Capsule().fill(.regularMaterial)` makes the backdrop the affordance and the button a label on top. The button itself should be glass: `.buttonStyle(.glass)` / `.buttonStyle(.glassProminent)`.
- **`.interactive()` on static surfaces.** Press / hover / pointer-illumination is for elements that respond to input. Status pills, decorative badges, non-tappable HUDs must not carry `.interactive()` — it produces phantom hover targets and confuses screen readers.
- **Removing `.glassEffect` conditionally instead of using `.identity`.** Removing the modifier reflows the view. Use `.glassEffect(condition ? .regular : .identity)` to toggle off without layout recalc.
- **Morph without `withAnimation`.** `glassEffectID` + `@Namespace` only morph when the state change is wrapped in `withAnimation(...)`. Without it the views just pop. (Same trap in AppKit without `NSAnimationContext.runAnimationGroup`.)
- **Morph across separate `GlassEffectContainer`s.** Participants in different containers never morph. Move them into the same container, or use `.glassEffectUnion(id:in:)` for cross-distance identity.
- **Mixing `.soft` and `.hard` scroll edge styles** on adjacent edges of one scroll view. Pick one boundary character.
- **Edge effect on a scroll view with no overlapping chrome.** Edge effects are not decoration — strip the modifier.
- **Icon + label glued into one tap target.** A glyph and a label inside the same button read as one affordance with two tap zones. Pick icon-only or label-only per button. If you genuinely need both, give them their own affordances.
- **`.glassProminent` + `.circle` border shape artifact.** The prominent style can paint outside the circle. Add `.clipShape(Circle())` after `.buttonStyle(.glassProminent)`.
