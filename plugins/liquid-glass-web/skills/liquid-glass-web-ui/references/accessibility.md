# Accessibility

Glass reduces contrast and adds motion. Every Liquid Glass surface ships these fallbacks.

## Required media queries

```css
@media (prefers-reduced-transparency: reduce) {
  .lg-glass {
    background: var(--lg-fallback-bg-light);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
  @media (prefers-color-scheme: dark) {
    .lg-glass { background: var(--lg-fallback-bg-dark); }
  }
}

@media (prefers-contrast: more) {
  .lg-glass { border-color: var(--lg-fallback-border-light); }
  @media (prefers-color-scheme: dark) {
    .lg-glass { border-color: var(--lg-fallback-border-dark); }
  }
}

@media (prefers-reduced-motion: reduce) {
  .lg-glass, .lg-glass * {
    transition: none !important;
    animation: none !important;
  }
}
```

## Contrast

- Text on Regular glass must clear WCAG AA against the worst-case background under the surface.
- Text on Clear glass requires a dim layer (`.lg-dim`) behind the surface.
- Use `aria-current="page"` for the selected tab; do not signal selection by glow alone.

## Focus

```css
.lg-glass :focus-visible {
  outline: 2px solid CanvasText;
  outline-offset: 2px;
  border-radius: inherit;
}
```

## Touch targets

Minimum 44×44 px (`button.minHeight`, `icon-button.size`).

## Forms

- Text fields are solid (`text-field.yaml` forbids glass).
- Error messages live outside the glass surface, with role `alert`.
