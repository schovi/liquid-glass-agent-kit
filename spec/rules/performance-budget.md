# Performance budget

Liquid Glass is expensive to render and expensive to think about. This
file caps the number of live-blurred surfaces an agent may compose into
one view.

The budget is *also* a usability rule — once a screen carries more than
a handful of floating glass elements, the user can no longer parse
"what is chrome, what is content." Apple's own ship apps stay tight:
Mail rests at sidebar + toolbar + (sometimes) inspector floating
elements, three surfaces at rest.

## Definition

A **live-blurred surface** is any element that performs real-time
backdrop sampling on render:

- web: any element with class `lg-glass` whose role is `liveBlur: true`
  in `spec/tokens/material.yaml` (default for unrolled elements). The
  `data-role` attribute can opt a surface out — e.g. `data-role="windowBackground"`
  marks a solid tint that does not count.
- native SwiftUI: any view with `.glassEffect(...)` where the variant
  is not `.identity`.
- native AppKit: any `NSGlassEffectView` and the content view of any
  `NSGlassEffectContainerView`.

Elements *grouped inside* a single `GlassEffectContainer` /
`NSGlassEffectContainerView` count as **one** surface — that is the
point of the container.

### Role taxonomy and the budget

`spec/tokens/material.yaml` `roles.*` carries a `liveBlur:` field.
Roles with `liveBlur: false` (`windowBackground`, `content`) are solid
tints with no backdrop sampling and never count, even if the renderer
happens to draw them with the same CSS class for layout reasons.

## The cap

Per top-level layout pane (sidebar, content, inspector, or a full
window in single-pane apps):

| Tier | Surfaces | When |
|---|---|---|
| **Calm** | 2–3 | Default. Most macOS 26 apps at rest sit here. |
| **Busy** | 4–5 | Transient — a popover or floating HUD is on screen. |
| **Ceiling** | 6 | Hard maximum. Above this, share sampling. |

The numbers come from observed Apple-ship apps (Mail, Notes, Finder)
plus the per-surface cost JuniperPhoton measured (three offscreen
textures per `CABackdropLayer`) and the iOS 26.1 regression where
glass-on-glass past a certain depth drops rendering entirely. Pushing
past 6 makes the experience expensive *and* fragile.

## How to stay under

When the design needs more floating elements than the budget allows:

- **Native** — group them. `GlassEffectContainer { ... }` (SwiftUI) or
  `NSGlassEffectContainerView` (AppKit) makes 4 siblings cost 1
  sample. Use `.glassEffectUnion(id:in:)` to add cross-distance
  members.
- **Web** — there is no shared-sampling primitive in the web profile.
  Either collapse multiple capsules into one, or downgrade non-primary
  surfaces to solid (Mica-style opaque tinted) instead.

## Enforcement

### B1 — Budget exceeded

The web auditor counts elements with class `lg-glass` per HTML file,
ignoring any element whose `data-role` resolves to a `liveBlur: false`
role (`windowBackground`, `content`). It fails when the remaining
count exceeds `material.yaml` `budget.max` (6 by default). A warning
is not emitted at the recommended threshold; the recommendation is
documentary.

The native side is review-enforced — `apple-app-reviewer`
flags screens that exceed the recommended count per pane and rejects
screens that exceed the ceiling.

The B-prefix is intentional: `B` = Budget. The anti-pattern audit IDs
(A1–A10, plus native A11–A24) keep their existing meaning. The
auditor emits `[B1]` for budget violations.

### Scope caveat (web)

The auditor counts per HTML file, not per visible pane, because pane
boundaries can't be determined statically. For multi-pane showcase
pages that legitimately render many examples, future versions of the
auditor may honor a `data-budget-scope="<name>"` attribute. Until
then, the per-file count is the proxy.

## Sources

- [JuniperPhoton — Adopting Liquid Glass: pitfalls](https://juniperphoton.substack.com/p/adopting-liquid-glass-experiences) — three offscreen textures per `CABackdropLayer`, iOS 26.1 Menu-in-`GlassEffectContainer` regression.
- [Flutter Impeller blur perf #126353](https://github.com/flutter/flutter/issues/126353), [BackdropFilter perf #161297](https://github.com/flutter/flutter/issues/161297) — 6 ms Skia vs 16–24 ms Impeller per blurred frame; informs the order of magnitude.
- WWDC25 session 219 — "use one glass container, not several."
