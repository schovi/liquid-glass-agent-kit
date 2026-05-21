# Accessibility rules

Glass effects reduce contrast and add motion. Every Liquid Glass surface must ship with these fallbacks.

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

The fallback colors live under `glass.fallbacks.reducedTransparency` in `tokens/material.yaml`. They are opaque on purpose.

## Increased contrast

```css
@media (prefers-contrast: more) {
  .lg-glass {
    border-color: var(--lg-fallback-border);
  }
}
```

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .lg-glass {
    transition: none;
    animation: none;
  }
}
```

Disable elasticity, spring easing, displacement animation, parallax, and any auto-rotating gradients.

## Contrast

- Text on Regular glass must clear WCAG AA at the worst-case background.
- Text on Clear glass requires a dim layer behind it; if the dim layer is removed, downgrade to Regular.
- Focus indicators must be visible against both light and dark backgrounds — use a 2 px outline with `outline-offset: 2px`.

## Touch targets

- Minimum hit area 44×44 px (matches `button.minHeight` and `icon-button.size`).

## Forms

- Inputs use solid backgrounds (`text-field.yaml` enforces `glass: forbidden`). Glass behind text fields breaks contrast under autocomplete and validation states.
