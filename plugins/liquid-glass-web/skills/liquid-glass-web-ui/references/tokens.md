# Tokens

This is the canonical token table the skill uses. Source: `spec/tokens/` in the kit. Agents must not invent values outside this set.

## CSS custom properties

Emit these once at the root of the document.

```css
:root {
  /* shape */
  --lg-radius-sm: 12px;
  --lg-radius-md: 16px;
  --lg-radius-lg: 24px;
  --lg-radius-xl: 28px;
  --lg-radius-capsule: 9999px;

  /* spacing */
  --lg-gap-control: 8px;
  --lg-gap-group: 12px;
  --lg-gap-panel: 16px;
  --lg-margin-compact: 16px;
  --lg-margin-regular: 24px;

  /* regular glass (CSS renderer) */
  --lg-glass-bg-light: rgba(255, 255, 255, 0.70);
  --lg-glass-bg-dark:  rgba(16, 16, 16, 0.45);
  --lg-glass-blur: 40px;
  --lg-glass-saturation: 180%;
  --lg-glass-border-light: rgba(255, 255, 255, 0.18);
  --lg-glass-border-dark:  rgba(255, 255, 255, 0.12);
  --lg-glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  --lg-glass-highlight: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.40) 0%,
    transparent 55%
  );

  /* clear glass (CSS renderer) */
  --lg-clear-bg-light: rgba(255, 255, 255, 0.18);
  --lg-clear-bg-dark:  rgba(16, 16, 16, 0.22);
  --lg-clear-blur: 28px;
  --lg-clear-saturation: 160%;
  --lg-clear-border-light: rgba(255, 255, 255, 0.22);
  --lg-clear-border-dark:  rgba(255, 255, 255, 0.16);
  --lg-clear-shadow: 0 6px 24px rgba(0, 0, 0, 0.10);
  --lg-clear-dim: rgba(0, 0, 0, 0.24);

  /* accessibility fallback */
  --lg-fallback-bg-light: rgba(255, 255, 255, 0.92);
  --lg-fallback-bg-dark:  rgba(20, 20, 20, 0.92);
  --lg-fallback-border-light: rgba(0, 0, 0, 0.45);
  --lg-fallback-border-dark:  rgba(255, 255, 255, 0.55);
}
```

## Renderer-specific extras

- `css-svg` adds an SVG filter using `feDisplacementMap` with `displacementScale=70`, `blurAmount=0.0625`, `saturation=140%`, `aberrationIntensity=2`, `elasticity=0.15`.
- `webgl` uses shader uniforms documented in `references/renderers.md`.

Never inline these values directly in component CSS. Reference the custom properties.
