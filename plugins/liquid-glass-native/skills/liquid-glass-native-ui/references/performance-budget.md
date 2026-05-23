# Performance budget (native)

Mirrors `spec/rules/performance-budget.md`. Liquid Glass is expensive
to render and expensive to think about. Cap the number of
live-blurred surfaces an agent composes into one pane.

## Definition

A **live-blurred surface** in native code is:

- any view modified by `.glassEffect(...)` where the variant is not
  `.identity`,
- any `NSGlassEffectView`,
- the content of a `GlassEffectContainer` / `NSGlassEffectContainerView`
  — the *container* counts as one surface regardless of how many
  children it groups. That is the point of the container.

## The cap

Per top-level layout pane (sidebar / content / inspector):

| Tier | Surfaces | When |
|---|---|---|
| Calm | 2–3 | Default. Mail, Notes, Finder at rest. |
| Busy | 4–5 | Transient — popover or floating HUD on screen. |
| Ceiling | 6 | Hard maximum. Above this, share sampling. |

Numbers come from observed Apple-ship apps plus JuniperPhoton's
measurement of three offscreen textures per `CABackdropLayer` and the
iOS 26.1 regression where deep glass-on-glass drops rendering.

## Patterns that stay under

- **One container per logical group.** Toolbar items, stepper, HUD
  rows — all into one `GlassEffectContainer`. Cost: 1 surface.
- **Cross-distance morph** — `.glassEffectUnion(id:in:)` keeps two
  far-apart elements on one sample.
- **Downgrade non-primary surfaces.** A second floating panel that
  doesn't compete for attention can drop to solid (system color +
  shadow) instead of glass. Visual hierarchy improves and so does
  the budget.

## When to fail review

`liquid-glass-native-auditor` rejects a screen when:

- a single visible pane carries more than `budget.max` (6) live-blurred
  surfaces, **or**
- the screen rests above `budget.recommended` (3) with no transient
  reason (no open popover / HUD / sheet).

Recommendation is a soft rule for `liquid-glass-native-implementer`:
if the design needs more than 3 floating elements at rest, the
implementer should propose grouping (`GlassEffectContainer`) or
downgrading before adding `.glassEffect` calls.

## Sources

- [JuniperPhoton — Adopting Liquid Glass: pitfalls](https://juniperphoton.substack.com/p/adopting-liquid-glass-experiences)
- WWDC25 session 219 — "use one glass container, not several."
- Flutter Impeller blur perf issues (Skia 6 ms vs Impeller 16–24 ms per blurred frame) inform the order-of-magnitude cost.
