# Accessibility rules

Accessibility is the kit's headline position. Apple shipped Liquid
Glass to a mixed reception — NN/g called it "cracked", Infinum
documented WCAG-AA failures on Control Center, Axess Lab flagged the
contrast collapse on dynamic backdrops, and the 45% adoption stat
reflects the friction. The kit's answer is to ship the contrast film,
the reduced-transparency tier, and the audit baked in — not as
afterthoughts.

Every Liquid Glass surface MUST ship the fallbacks below. The auditor
enforces the worst failures statically (A2, A8, A9, A26, A27); the
rest are review rules.

## Why accessibility is the kit's position

The criticism is real and well-sourced:

- [NN/g — Liquid Glass Is Cracked](https://www.nngroup.com/articles/liquid-glass/) — usability takedown; contrast failures on the iOS 26 Lock Screen.
- [Infinum — Questionably accessible](https://infinum.com/blog/apples-ios-26-liquid-glass-sleek-shiny-and-questionably-accessible/) — Control Center WCAG-AA contrast measurements.
- [Axess Lab — Glassmorphism meets accessibility](https://axesslab.com/glassmorphism-meets-accessibility-can-frosted-glass-be-inclusive/) — recommends a ≥ 30% opacity contrast film when glass is unavoidable on text.
- [Vidit B — Solving accessibility with tiered materials](https://blog.viditb.com/solving-liquid-glass-accessibility/) — proposes the tiered material model the kit adopts.
- [Iconfactory — Peeking Through the Liquid Glass](https://blog.iconfactory.com/2025/06/peeking-through-the-liquid-glass/) — practitioner notes on what breaks.
- [Geeky Gadgets — 45% adoption record low](https://www.geeky-gadgets.com/apple-liquid-glass-adoption-rate/) — adoption-friction signal.

Where Apple's own LLM prompts and Codex's Liquid Glass guide lead with
fidelity, the kit leads with the fallback ladder, the contrast
guarantee, and the audit. That's the differentiating position.

## Reduced transparency

```css
@media (prefers-reduced-transparency: reduce) {
  .lg-glass {
    background: var(--lg-fallback-bg);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}
```

The fallback colors live under `glass.fallbacks.reducedTransparency`
in `tokens/material.yaml`. They are opaque on purpose. The web
renderer-tier ladder forces T0 (solid tint + 1 px stroke) whenever
this media query matches — see `spec/rules/web-renderer-tiers.md`. On
native, AppKit / SwiftUI auto-degrade vibrancy when the system
preference is on; do not fight that behavior.

The fallback is the **escape hatch**, not the design. If a surface
needs it to be readable, you used glass in the wrong place. WCAG 1.4.8
(visual presentation) and WCAG 1.4.11 (non-text contrast) both apply.

## Increased contrast

```css
@media (prefers-contrast: more) {
  .lg-glass {
    border-color: var(--lg-fallback-border);
  }
}
```

`prefers-contrast: more` MUST emit a darker border on every glass
surface (web `--lg-fallback-border-dark / -light`). On native, the
system honors `differentiateWithoutColor` and `increaseContrast`
automatically — do not override them. WCAG 1.4.11 maps directly:
non-text UI components need a 3:1 contrast against adjacent colors,
and that's the worst case on a sampled backdrop.

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .lg-glass {
    transition: none;
    animation: none;
  }
}
```

Disable elasticity, spring easing, displacement animation, parallax,
and any auto-rotating gradients. Morph animations (single-capsule
width / radius transitions) collapse to opacity-only fades; the
command palette's spring enter falls back to a 160 ms fade. WCAG 2.3.3
(animation from interactions) and WCAG 2.2.2 (pause, stop, hide) both
apply.

## Contrast (WCAG 1.4.3)

- Text on Regular glass must clear WCAG AA (4.5:1 for normal text,
  3:1 for large text) at the worst-case background. The web token
  block enforces an opaque tint (`rgba(255,255,255,0.70)` /
  `rgba(16,16,16,0.45)`) that meets AA on a calm backdrop; busy
  backdrops still fail, which is why F2 forbids glass behind body
  text.
- Text on Clear glass requires a dim layer behind it (`backgroundDim`
  in `material.yaml`). If the dim layer is removed, the auditor fails
  with A8 and the surface must downgrade to Regular.
- Focus indicators must be visible against both light and dark
  backgrounds — use a 2 px outline (`outline: 2px solid <accent>`)
  with `outline-offset: 2px`. The auditor enforces this via A26:
  every CSS file with `.lg-glass` rules must contain at least one
  `:focus-visible` declaration with an outline.
- Apple's own materials auto-pick a legible content color (white on
  vibrant dark, black on vibrant light). On the web side that picking
  is **your** job — never rely on `mix-blend-mode` to do it.

## Touch targets (WCAG 2.5.5)

- Minimum hit area 44×44 px on macOS / iPadOS (`button.minHeight` and
  `icon-button.size` enforce this). 44 px is the AAA target; AA is
  24×24 px but the kit doesn't ship below 44 because Apple's HIG
  agrees.
- Adjacent icon-only buttons in one shared glass capsule must keep
  the 44×44 hit area on each item even when the *visible* icon is
  smaller. A23 catches the variant where an icon and label share one
  tap target.

## Accessible name (WCAG 4.1.2)

- Every interactive element MUST have an accessible name. For
  icon-only buttons (no visible text) this means `aria-label`,
  `aria-labelledby`, or `title` on the web side; `accessibilityLabel`
  on SwiftUI; `setAccessibilityLabel(_:)` on AppKit.
- The auditor enforces this via A27: an icon-only button-shaped
  element (`<button>`, `<a role="button">`, `<summary>`) declared
  inside or with a glass-related class name MUST carry one of the
  three attributes.

## Forms

- Inputs use solid backgrounds (`text-field.yaml` enforces
  `glass: forbidden`). Glass behind text fields breaks contrast
  under autocomplete and validation states (F3). Errors and
  validation text MUST be conveyed by something other than color
  (WCAG 1.4.1) — pair with an icon or a label.

## Native (SwiftUI / AppKit)

System accessibility flags drive the rendering automatically:

- `accessibilityReduceTransparency` → SwiftUI material falls to an
  opaque variant; AppKit `NSVisualEffectView` reduces vibrancy.
- `accessibilityDifferentiateWithoutColor` → state changes must not
  rely on hue alone (e.g. selection adds a checkmark, not just a
  color shift).
- `accessibilityReduceMotion` → spring animations collapse to fades;
  morph animations resolve without elasticity.
- `accessibilityIncreaseContrast` → vibrancy materials darken / lift
  toward solid tints; borders gain weight.

Do NOT override these by force. The audit anti-pattern A9 covers code
that fights the system flags (e.g. ignoring `@Environment(\.accessibilityReduceTransparency)`
and re-applying a custom blur on top).

See `plugins/apple-agent-kit/skills/liquid-glass/references/accessibility.md`
for SwiftUI / AppKit examples.

## Audit coverage

| Rule                                | Audit ID  | Where enforced                                       |
| ----------------------------------- | --------- | ---------------------------------------------------- |
| Reduced-transparency fallback emitted | A9      | CSS `@media (prefers-reduced-transparency: reduce)`  |
| Increased-contrast fallback emitted | A9        | CSS `@media (prefers-contrast: more)`                |
| Reduced-motion fallback emitted     | A9        | CSS `@media (prefers-reduced-motion: reduce)`        |
| Glass behind body text              | A2        | HTML `<p>` / `<article>` / `<section>` under glass   |
| Clear glass without dim             | A8        | HTML `lg-glass--clear` without `data-dim` / `.lg-dim` |
| Focus indicator on interactive glass | A26      | CSS file with `.lg-glass` must declare `:focus-visible { outline:... }` |
| Icon-only glass action accessible name | A27    | HTML `<button>` / `<summary>` with glass-related class needs `aria-label` / `aria-labelledby` / `title` |
| Tier ladder fallback (T0)           | A25       | HTML / JS `lg-glass` element with `data-tier`         |

Review-only (no auditor):

- F1–F5 (forbidden surfaces) in `spec/rules/when-not-to-use-glass.md`.
- A4, A6 (concentricity, component dimensions) — review or prompt-time.
- A11–A24 (native macOS 26 gotchas) — native auditor agent.
