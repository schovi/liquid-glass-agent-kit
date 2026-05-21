# Renderer recipes

Pick exactly one renderer per surface. Do not mix.

## css

Lowest friction. Works in every modern browser. Should be the default.

```css
.lg-glass--regular {
  background: var(--lg-glass-bg-light);
  border: 1px solid var(--lg-glass-border-light);
  box-shadow: var(--lg-glass-shadow);
  backdrop-filter: blur(var(--lg-glass-blur)) saturate(var(--lg-glass-saturation));
  -webkit-backdrop-filter: blur(var(--lg-glass-blur)) saturate(var(--lg-glass-saturation));
}

.lg-glass--regular::before {
  content: "";
  position: absolute; inset: 0;
  border-radius: inherit;
  background: var(--lg-glass-highlight);
  pointer-events: none;
}

@media (prefers-color-scheme: dark) {
  .lg-glass--regular {
    background: var(--lg-glass-bg-dark);
    border-color: var(--lg-glass-border-dark);
  }
}
```

## css-svg

Adds refraction at the glass edges using `feDisplacementMap`. Put one SVG defs block per document.

```html
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <filter id="lg-refract" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="3" />
      <feDisplacementMap in="SourceGraphic" scale="70" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </defs>
</svg>
```

Apply with `filter: url(#lg-refract)` only on the glass surface, never on text nodes.

## webgl

Uses a small WebGL2 shader to capture the background and apply refraction, chromatic aberration, and specular highlights. Use this only when:

- the user explicitly requests highest fidelity, AND
- the page is client-rendered (SSR capture is unreliable), AND
- the user accepts the runtime cost (typical 30–200 ms per surface).

Shader uniform defaults:

```ts
const webgl = {
  refraction: 0.06,
  edgeDistance: 0.04,
  rimIntensity: 0.025,
  rimDistance: 0.12,
  baseIntensity: 0.012,
  baseDistance: 0.008,
  cornerBoost: 0.02,
  blur: 4,
  chromaticAberration: 0.4,
  tint: "#ffffff",
  tintOpacity: 0.06,
  ambientTint: true,
  specular: 0.6,
  lightDirection: [0.5, -0.7],
};
```

Do not invent uniforms outside this set.

## Picking the renderer

| Goal                                       | Renderer  |
| ------------------------------------------ | --------- |
| Generated HTML for a copy/paste artifact   | `css`     |
| React app with desktop browsers            | `css-svg` |
| Marketing page that needs maximum fidelity | `webgl`   |
| Server-rendered Next.js                    | `css`     |
| Email or PDF render                        | none — drop glass entirely and use a solid card |
