# Web renderer tiers (T0–T3)

The web profile is a frosted-glass approximation of Apple's Liquid Glass. It
cannot be one-size-fits-all because the gap between "no `backdrop-filter`
support" and "full WebGL backdrop sampling" is several orders of magnitude
of fidelity and cost. This rule names a four-tier ladder and the policy
that picks the right tier at render time.

The canonical values live in `spec/tokens/material.yaml` under `tiers:` and
`tierSelection:`. The auditor enforces T0 and T1 statically; T2 and T3 are
opt-in and renderer-attested.

## The four tiers

### T0 — Solid tint + 1 px stroke

No backdrop sampling. Used when:

- The user has `prefers-reduced-transparency: reduce` set (mandatory).
- The runtime does not support `backdrop-filter` (older Firefox, embedded
  webviews, restricted contexts).
- The author explicitly opted out of glass for the surface.

Consumes `fallbacks.reducedTransparency.css`. Always available. The
auditor's A9 check enforces that every CSS file containing glass also
emits the `prefers-reduced-transparency` media query — i.e. T0 is always
reachable.

### T1 — backdrop-filter blur + saturate + tint

The current default. CSS `backdrop-filter: blur(40px) saturate(180%)` plus
the tinted background and border defined in `glass.regular.css` (or
`glass.clear.css` for the Clear variant). Broad cross-browser support:
Safari 18+, Chromium 117+, Firefox 103+ with the `-webkit-` prefix.

This is what the prompt emits unless the consuming tool says otherwise.
Audited statically: A3 catches off-token blur or saturation values.

### T2 — T1 + SVG `feDisplacementMap`

T1's CSS recipe plus an SVG filter (via `backdrop-filter: url(#...)`) that
displaces backdrop pixels at the surface edge to suggest refraction. The
numeric knobs live in `glass.regular.svg` (`displacementScale`,
`blurAmount`, `saturation`, `aberrationIntensity`, `elasticity`).

Why Chromium-only:

- Safari's `feDisplacementMap` is too slow at the scale needed (`scale ≈
  70`) and pegs the main thread on scroll.
- Firefox does not support `backdrop-filter: url(...)` at all.

Renderers MUST detect Chromium (`navigator.userAgentData.brands` includes
`"Chromium"` or `"Google Chrome"`) and fall to T1 otherwise. The auditor
does not verify T2 because the SVG filter is referenced by URL and the
visible result depends on runtime layout.

### T3 — WebGL backdrop sampling + chromatic dispersion + specular

Real backdrop sampling in a WebGL2 fragment shader. Implements:

- Chromatic aberration (R, G, B sampled at different offsets) using
  `chromaticAberration: 0.4`.
- Specular highlight tracking pointer or scroll position using
  `specular: 0.6` and `lightDirection: [0.5, -0.7]`.
- Normal-based refraction using `refraction: 0.06` and the rim falloff
  values in `glass.regular.webgl`.

Cost: one offscreen render-target per glass surface, plus a render loop.
Same-origin / CORS access to whatever sits behind the surface is required.
Renderers MUST fall to T1 when WebGL2 is unavailable or when context is
lost.

T3 is the only tier that can plausibly match what a screenshot of a real
macOS 26 surface looks like. It is also the only tier that can drop
frames on a low-power Mac.

## Selection policy

The order is strict. Each step short-circuits the rest.

1. **Accessibility wins.** If `prefers-reduced-transparency: reduce` →
   force T0. No exception, no opt-out.
2. **Feature gate.** If `backdrop-filter` is unsupported → fall to T0.
3. **T3 opt-in.** If the author requested T3 and `webgl2` is available
   and a render loop can be set up → render T3.
4. **T2 opt-in.** If the author requested T2 and the user agent is
   Chromium-class → render T2; otherwise fall through.
5. **Default.** Otherwise → T1.

The selection runs once at app / page load. Once a tier is chosen, every
glass surface on the page renders at that tier. Mixing tiers inside one
shared container is forbidden — pick the lowest tier any member supports
and render the whole group at that level. (Mixing happens visibly: a T2
edge with T1 backdrop reads as a render bug.)

## Markup

Every glass element MUST carry `data-tier="T0|T1|T2|T3"`. The CSS
selectors can then key off the attribute:

```css
.lg-glass[data-tier="T1"] { backdrop-filter: blur(40px) saturate(180%); }
.lg-glass[data-tier="T0"] { backdrop-filter: none; background: var(--lg-fallback-bg); }
```

This keeps the cascade explicit and gives the auditor a hook for future
tier-mismatch checks.

## What the auditor enforces

| Tier | Static check |
|---|---|
| T0 | A9 — `prefers-reduced-transparency` media query present in CSS |
| T1 | A3 — blur / saturation values match the token |
| T2 | none — opt-in, renderer self-attests |
| T3 | none — opt-in, renderer self-attests |

The audit does not refuse T2 / T3. It refuses *missing* T0 fallback,
because that is the floor every other tier degrades to.

## When to override the default

Tools generating production HTML should leave the default at T1. Tools
generating a brand-distinctive landing page or a marketing surface may
opt into T3 with the explicit caveat that the page now has a render-loop
cost. The native side does not use the tier model — Apple's `glassEffect`
is the implementation, not an approximation.

## Sources

- [kube.io — Liquid Glass in the Browser](https://kube.io/blog/liquid-glass-css-svg/) — notes Chromium-only `feDisplacementMap` performance.
- [Max Geris — Physics-based refraction](https://dev.to/maxgeris/recreating-apples-liquid-glass-effect-on-the-web-with-css-svg-and-physics-based-refraction-5cek) — T2 reference implementation; encodes Snell's law into displacement maps.
- [naughtyduk/liquidGL](https://github.com/naughtyduk/liquidGL) — T3 reference (WebGL backdrop sampling).
- [rizroze/liquid-glass](https://github.com/rizroze/liquid-glass) — three-pass chromatic aberration via `feColorMatrix`, useful T2 reference.
- [MDN — feDisplacementMap](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feDisplacementMap), [Can I Use — backdrop-filter](https://caniuse.com/css-backdrop-filter).
