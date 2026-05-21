---
name: liquid-glass-web-ui
description: Build, audit, or adapt Apple-inspired Liquid Glass web interfaces in HTML, CSS, React, JSX, or design-agent output. Use when the user asks for Liquid Glass UI, iOS 26-style glass, glass components, glass tokens, component sizing, or visual review of generated glass UI. Do not use for native SwiftUI implementation unless the user asks to translate native glass concepts into web tokens.
---

# Liquid Glass Web UI

This skill turns vague "make it Liquid Glass" requests into deterministic HTML, CSS, or JSX that uses a fixed token set, a chosen renderer, and required accessibility fallbacks. The canonical spec lives in `references/`.

## Required workflow

1. **Identify the target output.** One of:
   - plain HTML + CSS
   - React or JSX (no specific library required)
   - Tailwind utility classes
   - design-tool prompt (Figma Make, v0, Lovable)
   - audit of existing markup
   - token extraction from screenshots or Figma exports
2. **Choose the renderer.** Pick exactly one:
   - `css` — broad compatibility, lowest fidelity. Default.
   - `css-svg` — adds SVG feDisplacementMap for refraction.
   - `webgl` — highest fidelity, only when the user accepts SSR / CORS / runtime cost.
3. **Use component tokens** from `references/components.md`. Do not invent sizes.
4. **Use material tokens** from `references/tokens.md`. Do not invent blur, saturation, or shadow values.
5. **Apply accessibility rules** from `references/accessibility.md`. Always emit `prefers-reduced-transparency`, `prefers-contrast`, and `prefers-reduced-motion` fallbacks.
6. **Avoid every anti-pattern** in `references/principles.md`.

## Output rules

- Never invent arbitrary blur, radius, shadow, or spacing values.
- Prefer Regular glass. Use Clear glass only with safe contrast and a dim layer behind it.
- Never put one glass surface inside another.
- Keep glass in navigation, controls, floating panels, sheets, and primary actions — not in body content or text fields.
- Keep content readable and not distorted.
- Capsule radius is `height / 2`. Nested shapes are concentric: `child = parent − inset`.
- Touch targets are at least 44×44 px.

## When you should refuse or downgrade

- If the user asks for a "Liquid Glass body background" — refuse and propose a solid background with glass surfaces above it.
- If the user asks for "glass behind a long article" — refuse and propose a solid card.
- If the user asks for Clear glass without a dim layer — silently switch to Regular.

## Self-audit before returning

Before returning code, run the checks listed in `references/principles.md` § "Anti-patterns". The `scripts/audit-liquid-glass-html.mjs` script implements the same checks for static HTML.

## What this skill is not

- Not an Apple-official design system.
- Not a native SwiftUI replacement.
- Not a 1:1 copy of Apple rendering internals.
