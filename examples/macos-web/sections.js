// Section descriptors + body renderers for the web showcase.
// Mirrors examples/macos-native-swift/Sources/LiquidGlassShowcase/Sections.swift.
//
// Each entry: { id, eyebrow, title, lede (HTML), body() → HTML }.
// Repeating inner content is driven from tokens.js — token rows are written
// once here and once in spec/tokens/*.yaml.

import { RADIUS, SPACING, TYPE_SCALE, MOTION } from "./tokens.js";

function materialsBody() {
  return `
    <div class="lg-materials">
      <article class="lg-material-card" aria-label="Regular glass over busy photo">
        <div class="lg-material-card__photo lg-material-card__photo--photo" aria-hidden="true"></div>
        <div class="lg-material-card__pane lg-glass--regular" data-renderer="css">
          <span class="lg-material-card__label">Regular</span>
          <span class="lg-material-card__detail">.glassEffect(.regular, in: rect)</span>
        </div>
      </article>
      <article class="lg-material-card" aria-label="Regular glass tinted indigo over calmer backdrop">
        <div class="lg-material-card__photo lg-material-card__photo--tinted" aria-hidden="true"></div>
        <div class="lg-material-card__pane lg-glass--regular lg-glass--tint-indigo" data-renderer="css">
          <span class="lg-material-card__label">Regular · tinted</span>
          <span class="lg-material-card__detail">.glassEffect(.regular.tint(.indigo))</span>
        </div>
      </article>
    </div>
    <p class="lg-section__lede">
      Clear variant is demonstrated separately at the bottom of this page —
      mixing variants in one group is an anti-pattern.
    </p>
  `;
}

function shapeBody() {
  const swatches = RADIUS.map(({ name, label }) => `
    <div class="lg-radius-swatch">
      <div class="lg-radius-swatch__shape lg-radius-swatch__shape--${name}"></div>
      <div class="lg-radius-swatch__name">${name}</div>
      <div class="lg-radius-swatch__value">${label}</div>
    </div>
  `).join("");
  return `
    <div class="lg-token-grid">${swatches}</div>
    <div class="lg-concentric" aria-label="Concentric radius example">
      <div class="lg-concentric__parent">
        <div class="lg-concentric__child"></div>
      </div>
      <p class="lg-concentric__caption">
        Parent 28, inset 8, child 20. <code>ConcentricRectangle()</code> reads
        its radius from <code>.containerShape</code>.
      </p>
    </div>
  `;
}

function spacingBody() {
  return SPACING.map(({ name, px, label }) => `
    <div class="lg-spacing-swatch">
      <div class="lg-spacing-swatch__name">${name}</div>
      <div class="lg-spacing-swatch__bar" style="width: ${px}px"></div>
      <div class="lg-spacing-swatch__value">${label}</div>
    </div>
  `).join("");
}

function typographyBody() {
  return TYPE_SCALE.map(({ token, size, leading, weight }) => `
    <div class="lg-type-row">
      <div class="lg-type-row__label">${token}</div>
      <div class="lg-type-row__sample lg-type-row__sample--${token}">Glass refraction at scroll edges.</div>
      <div class="lg-type-row__meta">${size} / ${leading} / ${weight}</div>
    </div>
  `).join("");
}

function motionBody() {
  const chips = MOTION.map(({ name, ms, easing }) => `
    <div class="lg-motion-chip lg-motion-chip--${name}">
      <span class="lg-motion-chip__name">${name}</span>
      <span class="lg-motion-chip__value">${ms} ms · ${easing}</span>
      <span class="lg-motion-chip__bar"></span>
    </div>
  `).join("");
  return `<div class="lg-motion-grid">${chips}</div>`;
}

function buttonsBody() {
  return `
    <div class="lg-component-grid">
      <article class="lg-component-card">
        <h2 class="lg-component-card__title">Glass · GlassProminent · Borderless</h2>
        <div class="lg-component-card__demo">
          <button type="button" class="lg-button lg-button--prominent lg-button--blue">Continue</button>
          <button type="button" class="lg-button" data-renderer="css">Secondary</button>
          <button type="button" class="lg-button lg-button--ghost">Ghost</button>
        </div>
      </article>
      <article class="lg-component-card">
        <h2 class="lg-component-card__title">Icon button · 44pt capsule</h2>
        <div class="lg-component-card__demo">
          <button type="button" class="lg-icon-button" data-renderer="css" aria-label="Add"><span aria-hidden="true">+</span></button>
          <button type="button" class="lg-icon-button" data-renderer="css" aria-label="Share"><span aria-hidden="true">↑</span></button>
          <button type="button" class="lg-icon-button" data-renderer="css" aria-label="More"><span aria-hidden="true">⋯</span></button>
        </div>
      </article>
      <article class="lg-component-card">
        <h2 class="lg-component-card__title">Toolbar pill · GlassEffectContainer groups items</h2>
        <div class="lg-component-card__demo">
          <div class="lg-toolbar-pill" data-renderer="css">
            <button type="button" class="lg-toolbar-pill__item" aria-label="Reply" title="Reply"><span aria-hidden="true">↩</span></button>
            <button type="button" class="lg-toolbar-pill__item" aria-label="Forward" title="Forward"><span aria-hidden="true">↪</span></button>
            <button type="button" class="lg-toolbar-pill__item" aria-label="Archive" title="Archive"><span aria-hidden="true">▤</span></button>
            <button type="button" class="lg-toolbar-pill__item" aria-label="Delete" title="Delete"><span aria-hidden="true">⌫</span></button>
          </div>
        </div>
      </article>
    </div>
  `;
}

function controlsBody() {
  return `
    <div class="lg-component-grid">
      <article class="lg-component-card">
        <h2 class="lg-component-card__title">Segmented control · 32 tall, 2-5 items</h2>
        <div class="lg-component-card__demo">
          <div class="lg-segmented" data-renderer="css" role="tablist" aria-label="Density">
            <button class="lg-segmented__item" role="tab" aria-selected="true">Compact</button>
            <button class="lg-segmented__item" role="tab" aria-selected="false">Regular</button>
            <button class="lg-segmented__item" role="tab" aria-selected="false">Large</button>
          </div>
        </div>
      </article>
      <article class="lg-component-card">
        <h2 class="lg-component-card__title">Text field · 44 min, solid</h2>
        <label class="lg-text-field-wrap">
          <span class="lg-text-field-label">Search</span>
          <input class="lg-text-field" type="search" placeholder="Type to search…" />
        </label>
      </article>
      <article class="lg-component-card">
        <h2 class="lg-component-card__title">Popover · floating Regular glass</h2>
        <div class="lg-component-card__demo">
          <details class="lg-popover">
            <summary class="lg-button" data-renderer="css">Open menu</summary>
            <div class="lg-popover__panel" data-renderer="css" role="menu">
              <div class="lg-popover__item" role="menuitem"><span aria-hidden="true">★</span> Favorite</div>
              <div class="lg-popover__item" role="menuitem"><span aria-hidden="true">⤓</span> Download</div>
              <div class="lg-popover__item" role="menuitem"><span aria-hidden="true">⌫</span> Delete</div>
            </div>
          </details>
        </div>
      </article>
    </div>
  `;
}

function surfacesBody() {
  return `
    <article class="lg-content-card">
      <h2 class="lg-content-card__title">Why cards aren't glass</h2>
      <p class="lg-content-card__body">
        Glass behind body text shimmers under scroll and pulls contrast below
        WCAG AA on busy backgrounds. The macOS 26 layout rule is the same as
        ours: glass in the navigation layer, content in the content layer.
        Cards use the radius (24) and padding (24) from the spec on a solid surface.
      </p>
      <p class="lg-content-card__body">
        In SwiftUI the card is a plain <code>RoundedRectangle</code> filled with
        <code>controlBackgroundColor</code> and a hairline overlay — no
        <code>.glassEffect()</code> in sight.
      </p>
    </article>
    <article class="lg-content-card">
      <h2 class="lg-content-card__title">Concentric children</h2>
      <p class="lg-content-card__body">
        A radius-24 card with 12 px of inset wants a radius-12 child
        (24 − 12 = 12). Anything else breaks the parallel curve the eye expects.
      </p>
      <p class="lg-content-card__body">
        Natively, <code>.containerShape(RoundedRectangle(cornerRadius: 24))</code>
        plus a child <code>ConcentricRectangle()</code> keeps the radii in lock-step
        if the parent reflows.
      </p>
    </article>
  `;
}

function sheetBody() {
  return `<a class="lg-button" href="#open-sheet" data-renderer="css">Open sheet</a>`;
}

function rulesBody() {
  return `
    <article class="lg-content-card">
      <h2 class="lg-content-card__title">Allowed</h2>
      <p class="lg-content-card__body">
        Titlebar + toolbar, sidebar, popover, menu, sheet, floating action button,
        primary action surfaces. The macOS 26 sidebar and toolbar pick up glass
        automatically from <code>NavigationSplitView</code> +
        <code>.listStyle(.sidebar)</code> and <code>.windowToolbarStyle(.unified)</code>.
      </p>
    </article>
  `;
}

function antiPatternsBody() {
  return `
    <article class="lg-content-card">
      <h2 class="lg-content-card__title">Don't</h2>
      <p class="lg-content-card__body">
        Stack two glass surfaces. Put glass behind body text. Invent a blur,
        opacity, or radius outside the token table. Use a 12 px radius on a 44 px
        capsule. Mix Regular and Clear in one group. Ship without
        reduced-transparency, reduced-motion, or increased-contrast fallbacks.
        Claim Apple endorsement.
      </p>
    </article>
  `;
}

function clearVariantBody() {
  return `
    <article class="lg-material-card lg-material-card--tall" aria-label="Clear glass with required dim">
      <div class="lg-material-card__photo lg-material-card__photo--photo" aria-hidden="true"></div>
      <div class="lg-material-card__dim" aria-hidden="true"></div>
      <div class="lg-material-card__pane lg-glass--clear" data-renderer="css" data-dim="true">
        <span class="lg-material-card__label">Clear</span>
        <span class="lg-material-card__detail">.glassEffect(.clear, in: rect)</span>
      </div>
    </article>
  `;
}

export const SECTIONS = [
  {
    id: "materials",
    eyebrow: "Foundations",
    title: "Materials",
    lede: `Two variants: <strong>Regular</strong> (default, auto-legible) and
           <strong>Clear</strong> (more transparent — requires a dim layer behind for contrast).
           The native APIs are <code>.glassEffect(.regular, in: …)</code> and
           <code>.glassEffect(.clear, in: …)</code>.`,
    body: materialsBody,
  },
  {
    id: "shape",
    eyebrow: "Foundations",
    title: "Shape",
    lede: `Fixed radii: 12, 16, 24, 28. Capsule = <code>height / 2</code>.
           Concentric: <code>child = parent − inset</code>.
           <code>ConcentricRectangle()</code> resolves its radius from the nearest
           <code>.containerShape</code> so insets stay parallel as the parent reflows.`,
    body: shapeBody,
  },
  {
    id: "spacing",
    eyebrow: "Foundations",
    title: "Spacing",
    lede: `One scale: 8 · 12 · 16 · 24 · 32. Apply by role —
           control gap, group gap, panel gap, screen margin, section gap.`,
    body: spacingBody,
  },
  {
    id: "typography",
    eyebrow: "Foundations",
    title: "Typography",
    lede: `Falls through to the system font. Eleven steps from caption2 (11) to
           largeTitle (34). Headlines and titles carry the heavier weight.`,
    body: typographyBody,
  },
  {
    id: "motion",
    eyebrow: "Foundations",
    title: "Motion",
    lede: `Hover any chip to play its duration and easing. Sheet uses spring;
           everything else defaults to the standard curve.`,
    body: motionBody,
  },
  {
    id: "buttons",
    eyebrow: "Components",
    title: "Buttons",
    lede: `Capsule shape, 44 px minimum height. Use <code>.glassProminent</code> for the
           primary action and <code>.glass</code> for secondary; <code>.borderless</code>
           for ghost. Subheadline weight 600.`,
    body: buttonsBody,
  },
  {
    id: "controls",
    eyebrow: "Components",
    title: "Controls",
    lede: `Segmented picker rides Regular glass. Text fields are
           <strong>always solid</strong> — glass behind text reduces readability.`,
    body: controlsBody,
  },
  {
    id: "surfaces",
    eyebrow: "Components",
    title: "Content surfaces",
    lede: `Cards stay <strong>solid</strong>. Glass is reserved for the floating layer —
           titlebar, sidebar, toolbar, popover, sheet. Content lives below it.`,
    body: surfacesBody,
  },
  {
    id: "sheet-section",
    eyebrow: "Components",
    title: "Sheet",
    lede: `Bottom-anchored modal that slides up with the spring easing.
           SwiftUI <code>.sheet</code> with
           <code>.presentationDetents([.medium, .large])</code> picks up Liquid Glass
           automatically.`,
    body: sheetBody,
  },
  {
    id: "rules",
    eyebrow: "Reference",
    title: "Where glass belongs",
    lede: `Glass in the functional / navigation layer. Solid in the content layer.
           One glass surface per layered region — never glass-on-glass.`,
    body: rulesBody,
  },
  {
    id: "anti-patterns",
    eyebrow: "Reference",
    title: "Anti-patterns",
    lede: `The auditor in <code>scripts/audit-liquid-glass-html.mjs</code> flags these
           for the web profile. The same rules apply natively.`,
    body: antiPatternsBody,
  },
  {
    id: "clear-variant",
    eyebrow: "Foundations · advanced",
    title: "Clear variant",
    lede: `Clear is more transparent — only safe over rich media with a dim layer
           behind it. The demo below uses Clear <strong>alone</strong>; mixing
           variants in one group is an anti-pattern.`,
    body: clearVariantBody,
  },
];

const FOOTER_HTML = `
  <footer class="lg-footer">
    Inspired by Apple's Liquid Glass, not Apple-endorsed. Tokens trace to
    <code>spec/tokens/*.yaml</code>; for the real macOS rendering see
    <code>examples/macos-native-swift/</code>.
  </footer>
`;

function sectionMarkup({ id, eyebrow, title, lede, body }) {
  return `
    <section class="lg-section" id="${id}">
      <header class="lg-section__header">
        <span class="lg-section__eyebrow">${eyebrow}</span>
        <h1 class="lg-section__title">${title}</h1>
        <p class="lg-section__lede">${lede}</p>
      </header>
      ${body()}
    </section>
  `;
}

export function renderSections(container) {
  container.innerHTML = SECTIONS.map(sectionMarkup).join("") + FOOTER_HTML;
}
