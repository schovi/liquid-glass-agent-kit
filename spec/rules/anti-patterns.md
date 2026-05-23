# Anti-patterns the audit must flag

The agent and the `audit-liquid-glass-html.mjs` script reject the following.

## A1 — Glass on glass

Two glass surfaces stacked. The lower surface contributes no real refraction and reads as muddy. On macOS 26 / iOS 26 the inner element can outright fail to render — JuniperPhoton documented a regression in iOS 26.1 where a `Menu` inside a `GlassEffectContainer` drops its glass entirely.

Use one glass surface and let the other be solid. On native, group siblings with `GlassEffectContainer` / `NSGlassEffectContainerView` instead of nesting.

See `when-not-to-use-glass.md` F5 for the full failure case and sources.

## A2 — Glass behind body text

Glass behind paragraphs or long-form text makes the text shimmer under scroll and pushes contrast below WCAG AA on busy backdrops. NN/g documented this on iOS 26 Lock Screen; Infinum on Control Center. Glass belongs in the floating layer.

See `when-not-to-use-glass.md` F2 for the full failure case and sources.

## A3 — Random material values

Any backdrop-filter, opacity, blur, saturation, or shadow that is not in `tokens/material.yaml`. Agents must use tokens — not improvise.

## A4 — Random component dimensions

Any width, height, padding, or radius that is not in `spec/components/*.yaml`. Tab bars are 64 px tall, buttons are 44 px min-height — agents cannot improvise these.

## A5 — Capsule miscalculation

A capsule must use `border-radius: 9999px` or `radius: height / 2`. A 44 px tall button with a 12 px radius is wrong.

## A6 — Concentric break

A 28 px parent with 24 px inset child cannot also be 28 px. Child radius = parent radius − inset.

## A7 — Mixed variants

Mixing Regular and Clear glass in one surface or one group.

## A8 — Unreadable Clear glass

Clear glass without a background dim or without enforced contrast.

## A9 — Missing accessibility fallback

No `@media (prefers-reduced-transparency: reduce)` or `prefers-contrast: more` fallback.

## A10 — Invented Apple terminology

Calling something "Liquid Glass certified" or "Apple-official". The kit is portable approximation, never an Apple endorsement.

## B1 — Performance budget exceeded

More live-blurred surfaces in one pane than `material.yaml` `budget.max` allows. The auditor counts elements with class `lg-glass` per HTML file. Above the cap, share sampling (native: `GlassEffectContainer`; web: collapse capsules or downgrade non-primary surfaces to solid).

See `performance-budget.md` for the full rule, the range (recommended 3 / busy 5 / ceiling 6), and sources.

The B-prefix is intentional — anti-patterns A1–A10 (and native A11–A24) keep their meaning; the budget rule is a separate category emitted as `[B1]` by the auditor.
