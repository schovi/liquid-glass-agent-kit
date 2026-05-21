# Anti-patterns the audit must flag

The agent and the `audit-liquid-glass-html.mjs` script reject the following.

## A1 — Glass on glass

Two glass surfaces stacked. The lower surface contributes no real refraction and reads as muddy. Use one glass surface and let the other be solid.

## A2 — Glass behind body text

Glass behind paragraphs or long-form text makes the text shimmer and reduces contrast. Glass belongs in the floating layer.

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
