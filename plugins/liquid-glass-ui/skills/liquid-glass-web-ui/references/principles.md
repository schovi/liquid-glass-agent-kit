# Principles and anti-patterns

These rules come from Apple's published Liquid Glass guidance and from accessibility constraints in the web. Agents must follow them before any token-level decision.

## Principles

1. **Glass is for the floating layer.** Navigation, toolbars, tab bars, sheets, menus, primary actions. Not for body content.
2. **Regular by default.** Use Clear only with safe legibility conditions (a dim layer or controlled background).
3. **Never mix variants.** A surface or group is all Regular or all Clear.
4. **Shapes are deterministic.**
   - Fixed radii from the shape token (`sm 12`, `md 16`, `lg 24`, `xl 28`).
   - Capsules use `height / 2`.
   - Nested shapes are concentric: `child = parent − inset`.
5. **Tokens, not improvisation.** All blur, saturation, opacity, shadow, color, padding, and component dimensions come from the spec.
6. **Accessibility is required, not optional.** Always emit reduced-transparency, increased-contrast, and reduced-motion fallbacks.
7. **Honest fidelity.** The web profile is an approximation, not a reproduction of Apple's adaptive system material.

## Anti-patterns

| ID  | Failure                                | What the auditor checks                                                                                  |
| --- | -------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| A1  | Glass on glass                         | A `.lg-glass` descendant of another `.lg-glass`.                                                         |
| A2  | Glass behind body text                 | `.lg-glass` containing a `<p>`, `<article>`, or `<section>` with body copy.                              |
| A3  | Random material values                 | `backdrop-filter` / `background` / `box-shadow` not present in the token CSS.                            |
| A4  | Random component dimensions            | `height` / `width` / `padding` / `border-radius` on a known component class but not matching the token. |
| A5  | Capsule miscalculation                 | `.lg-capsule` with `border-radius` other than `9999px` or exactly `height / 2`.                          |
| A6  | Concentric break                       | Nested `.lg-glass` with a child radius greater than parent radius minus inset.                           |
| A7  | Mixed variants                         | `.lg-glass--regular` and `.lg-glass--clear` inside the same group.                                       |
| A8  | Unreadable Clear glass                 | `.lg-glass--clear` without a sibling dim layer or without `data-dim="true"`.                             |
| A9  | Missing accessibility fallback         | No `prefers-reduced-transparency`, `prefers-contrast`, or `prefers-reduced-motion` rule.                 |
| A10 | Invented Apple terminology             | Text claiming the output is "Apple-official" or "Apple-certified".                                       |
