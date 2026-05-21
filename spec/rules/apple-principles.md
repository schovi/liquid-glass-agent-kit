# Apple Liquid Glass — principles agents must follow

Apple's public guidance is behavioral and adaptive, not a portable token table. These rules summarize the parts that translate to the web.

## Layering

- Liquid Glass lives in the **functional / navigation layer**.
- Content stays in the **content layer**.
- Do not place glass inside body content or paragraphs.

## Variants

- **Regular glass** is the default. Use it for almost every floating surface.
- **Clear glass** is more transparent. Use it only when the background and content allow safe legibility, with a dim layer behind.
- **Never mix** Regular and Clear in the same surface or group.

## Shape

- Fixed-radius shapes use the published radii from `tokens/shape.yaml`.
- Capsule shapes use `radius = height / 2`.
- Nested shapes are concentric: `childRadius = parentRadius - inset`.

## Scroll edges

- The interface separates itself from content at scroll edges.
- Do not distort text or controls underneath; glass refraction must not warp text.

## Tint, shadow, dynamic range

- The native material adapts to background, size, legibility, shadows, tint, and HDR.
- The web profile approximates this with `material.yaml` tokens — agents must not invent new blur, saturation, or shadow values.

## What the kit deliberately does not do

- It does not redistribute Apple fonts, icons, or UI kits.
- It does not claim 1:1 fidelity to private Apple rendering internals.
- It does not implement native SwiftUI behavior in JavaScript.
