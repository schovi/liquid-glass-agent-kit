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
        <div class="lg-material-card__pane lg-glass--regular" data-renderer="css" data-tier="T1">
          <span class="lg-material-card__label">Regular</span>
          <span class="lg-material-card__detail">.glassEffect(.regular, in: rect)</span>
        </div>
      </article>
      <article class="lg-material-card" aria-label="Regular glass tinted indigo over calmer backdrop">
        <div class="lg-material-card__photo lg-material-card__photo--tinted" aria-hidden="true"></div>
        <div class="lg-material-card__pane lg-glass--regular lg-glass--tint-indigo" data-renderer="css" data-tier="T1">
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

function inputsOverlaysBody() {
  return `
    <div class="lg-component-grid">
      <article class="lg-component-card">
        <h2 class="lg-component-card__title">Menu · Regular glass + separators + shortcuts</h2>
        <div class="lg-component-card__demo">
          <details class="lg-menu-host" open>
            <summary class="lg-button" data-renderer="css">File</summary>
            <div class="lg-menu" role="menu" data-renderer="css">
              <div class="lg-menu__item" role="menuitem">
                <span class="lg-menu__icon" aria-hidden="true">+</span>
                <span>New</span>
                <span class="lg-menu__shortcut">⌘N</span>
              </div>
              <div class="lg-menu__item" role="menuitem">
                <span class="lg-menu__icon" aria-hidden="true">⌘</span>
                <span>Open…</span>
                <span class="lg-menu__shortcut">⌘O</span>
              </div>
              <div class="lg-menu__separator" role="separator"></div>
              <div class="lg-menu__item" role="menuitem">
                <span class="lg-menu__icon" aria-hidden="true">⤓</span>
                <span>Export tokens</span>
                <span class="lg-menu__shortcut">⌥⌘E</span>
              </div>
              <div class="lg-menu__separator" role="separator"></div>
              <div class="lg-menu__item lg-menu__item--destructive" role="menuitem">
                <span class="lg-menu__icon" aria-hidden="true">⌫</span>
                <span>Move to Trash</span>
                <span class="lg-menu__shortcut">⌘⌫</span>
              </div>
            </div>
          </details>
        </div>
      </article>

      <article class="lg-component-card">
        <h2 class="lg-component-card__title">Search field · 44 tall, solid</h2>
        <label class="lg-search-field" aria-label="Search tokens">
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" class="lg-search-field__icon">
            <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/>
            <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <input type="search" placeholder="Type to search…" />
        </label>
      </article>

      <article class="lg-component-card">
        <h2 class="lg-component-card__title">Toggle · 38×22 capsule, solid track</h2>
        <div class="lg-component-card__demo">
          <button type="button" class="lg-toggle" role="switch" aria-checked="false">
            <span class="lg-toggle__track" aria-hidden="true"><span class="lg-toggle__knob"></span></span>
            <span>Off</span>
          </button>
          <button type="button" class="lg-toggle" role="switch" aria-checked="true">
            <span class="lg-toggle__track" aria-hidden="true"><span class="lg-toggle__knob"></span></span>
            <span>On</span>
          </button>
          <button type="button" class="lg-toggle" role="switch" aria-checked="true" aria-disabled="true">
            <span class="lg-toggle__track" aria-hidden="true"><span class="lg-toggle__knob"></span></span>
            <span>Disabled</span>
          </button>
        </div>
      </article>

      <article class="lg-component-card">
        <h2 class="lg-component-card__title">Slider · 4 pt track, 22 pt thumb</h2>
        <div class="lg-slider" role="group" aria-label="Volume">
          <div class="lg-slider__track">
            <div class="lg-slider__fill" style="width: 64%"></div>
            <div class="lg-slider__thumb" style="left: 64%"></div>
          </div>
          <span class="lg-slider__value">0.64</span>
        </div>
      </article>

      <article class="lg-component-card">
        <h2 class="lg-component-card__title">Progress · linear + circular</h2>
        <div class="lg-component-card__demo" style="flex-direction: column; align-items: stretch;">
          <div class="lg-progress--linear" role="progressbar" aria-valuemin="0" aria-valuemax="1" aria-valuenow="0.42">
            <div class="lg-progress--linear__fill" style="width: 42%"></div>
          </div>
          <div class="lg-progress--linear" role="progressbar" aria-busy="true" aria-label="Loading">
            <div class="lg-progress--linear__fill"></div>
          </div>
          <div style="display: flex; gap: 16px; align-items: center;">
            <span class="lg-progress--circular" data-size="sm" role="progressbar" aria-busy="true" aria-label="Loading small">
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="20 80" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="lg-progress--circular" role="progressbar" aria-busy="true" aria-label="Loading medium">
              <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="30 120" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="lg-progress--circular" data-size="lg" role="progressbar" aria-busy="true" aria-label="Loading large">
              <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
                <circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="40 160" stroke-linecap="round"/>
              </svg>
            </span>
          </div>
        </div>
      </article>

      <article class="lg-component-card">
        <h2 class="lg-component-card__title">Badge · 20 pt capsule, never on glass</h2>
        <div class="lg-component-card__demo">
          <span class="lg-badge">Neutral</span>
          <span class="lg-badge lg-badge--info">Beta</span>
          <span class="lg-badge lg-badge--success">Passing</span>
          <span class="lg-badge lg-badge--warning">Warn</span>
          <span class="lg-badge lg-badge--danger">Error</span>
          <span class="lg-badge lg-badge--counter">12</span>
        </div>
      </article>

      <article class="lg-component-card" style="grid-column: 1 / -1;">
        <h2 class="lg-component-card__title">Floating HUD · GlassEffectContainer over media</h2>
        <div class="lg-floating-hud-stage">
          <div class="lg-floating-hud" data-renderer="css" role="toolbar" aria-label="Playback controls">
            <button type="button" class="lg-floating-hud__item" aria-label="Previous"><span aria-hidden="true">⏮</span></button>
            <button type="button" class="lg-floating-hud__item" aria-label="Play"><span aria-hidden="true">⏵</span></button>
            <button type="button" class="lg-floating-hud__item" aria-label="Next"><span aria-hidden="true">⏭</span></button>
            <button type="button" class="lg-floating-hud__item" aria-label="Mute"><span aria-hidden="true">🔊</span></button>
          </div>
        </div>
      </article>
    </div>
  `;
}

function formsListsBody() {
  return `
    <div class="lg-component-grid">
      <article class="lg-component-card" style="grid-column: 1 / -1;">
        <h2 class="lg-component-card__title">Form rows · solid, never glass</h2>
        <div class="lg-form">
          <h3 class="lg-form__heading">Notifications</h3>
          <div class="lg-form-row">
            <span class="lg-form-row__label">Email updates</span>
            <span class="lg-form-row__control">
              <button type="button" class="lg-toggle" role="switch" aria-checked="true">
                <span class="lg-toggle__track" aria-hidden="true"><span class="lg-toggle__knob"></span></span>
              </button>
            </span>
          </div>
          <div class="lg-form-row">
            <span class="lg-form-row__label">Volume</span>
            <span class="lg-form-row__control">
              <div class="lg-slider" role="group" aria-label="Volume">
                <div class="lg-slider__track">
                  <div class="lg-slider__fill" style="width: 50%"></div>
                  <div class="lg-slider__thumb" style="left: 50%"></div>
                </div>
                <span class="lg-slider__value">0.50</span>
              </div>
            </span>
          </div>
          <div class="lg-form-row">
            <span class="lg-form-row__label">Sessions</span>
            <span class="lg-form-row__control">
              <div class="lg-stepper" role="group" aria-label="Sessions">
                <button type="button" class="lg-stepper__button" aria-label="Decrement">−</button>
                <span class="lg-stepper__divider" aria-hidden="true"></span>
                <span class="lg-stepper__value">3</span>
                <span class="lg-stepper__divider" aria-hidden="true"></span>
                <button type="button" class="lg-stepper__button" aria-label="Increment">+</button>
              </div>
            </span>
          </div>
        </div>
      </article>

      <article class="lg-component-card">
        <h2 class="lg-component-card__title">Inset list · grouped sections</h2>
        <div class="lg-inset-list">
          <div class="lg-inset-list__section">
            <h3 class="lg-inset-list__heading">Recents</h3>
            <div class="lg-inset-list__row">
              <span class="lg-inset-list__row-icon" aria-hidden="true">◐</span>
              <span>Materials</span>
              <span class="lg-badge lg-badge--counter">2</span>
            </div>
            <div class="lg-inset-list__row">
              <span class="lg-inset-list__row-icon" aria-hidden="true">▤</span>
              <span>Spacing</span>
              <span class="lg-badge">8 · 12 · 16</span>
            </div>
            <div class="lg-inset-list__row">
              <span class="lg-inset-list__row-icon" aria-hidden="true">Aa</span>
              <span>Typography</span>
              <span class="lg-badge lg-badge--info">v0.1</span>
            </div>
          </div>
          <div class="lg-inset-list__section">
            <h3 class="lg-inset-list__heading">Pinned</h3>
            <div class="lg-inset-list__row lg-inset-list__row--compact">
              <span class="lg-inset-list__row-icon" aria-hidden="true">★</span>
              <span>Toolbar</span>
              <span></span>
            </div>
            <div class="lg-inset-list__row lg-inset-list__row--compact">
              <span class="lg-inset-list__row-icon" aria-hidden="true">★</span>
              <span>Sheet</span>
              <span></span>
            </div>
            <p class="lg-inset-list__footer">Compact rows are 32 tall; default rows are 44.</p>
          </div>
        </div>
      </article>

      <article class="lg-component-card">
        <h2 class="lg-component-card__title">Disclosure group · solid, 16 pt indent</h2>
        <div class="lg-form">
          <details class="lg-disclosure-group" open>
            <summary>
              <svg class="lg-disclosure-group__chevron" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                <path d="M4 2l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Advanced</span>
            </summary>
            <div class="lg-disclosure-group__body">
              Reveal-on-demand controls live inside disclosure groups.
              Body indents by 16 (panelGap). Solid surface only.
            </div>
          </details>
          <details class="lg-disclosure-group">
            <summary>
              <svg class="lg-disclosure-group__chevron" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                <path d="M4 2l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Developer</span>
            </summary>
            <div class="lg-disclosure-group__body">
              Outline groups go deeper but cap visible depth at three
              in a content panel.
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

function morphingBody() {
  return `
    <div class="lg-morph-stage">
      <div class="lg-morph-stage__backdrop" aria-hidden="true"></div>
      <button
        type="button"
        class="lg-morph-pill lg-glass--regular"
        data-renderer="css"
        data-tier="T1"
        aria-label="Toolbar — hover to expand"
      >
        <span class="lg-morph-pill__compact" aria-hidden="true">⋯</span>
        <span class="lg-morph-pill__expanded" aria-hidden="true">
          <span class="lg-morph-pill__icon">↩</span>
          <span class="lg-morph-pill__icon">↪</span>
          <span class="lg-morph-pill__icon">▤</span>
          <span class="lg-morph-pill__icon">⌫</span>
        </span>
      </button>
    </div>
    <p class="lg-section__lede">
      Web approximation. <strong>Hover</strong> the capsule — its width,
      contents, and corner radius animate together via a single CSS
      <code>transition</code>. The whole morph stays inside one glass
      surface (one <code>backdrop-filter</code> sample) — that's what
      makes it honest. Native uses
      <code>glassEffectID</code> in a shared
      <code>GlassEffectContainer</code> with a <code>@Namespace</code>.
    </p>
    <p class="lg-section__lede lg-section__lede--caveat">
      <strong>Native-only.</strong> The multi-capsule metaball emergence
      (one capsule sprouting several with gooey tail tension between
      them) is not approximated here. SVG goo filters fight
      <code>backdrop-filter</code> and produce a worse result than the
      single-capsule morph above. Use the native plugin for that.
    </p>
  `;
}

function commandPaletteBody() {
  return `
    <div class="lg-command-palette-demo">
      <p class="lg-section__lede">
        Press <span class="lg-command-palette-demo__kbd">⌘K</span> from anywhere
        on this page (or click the button below) to open the palette. Type to
        filter, <span class="lg-command-palette-demo__kbd">↑↓</span> to navigate,
        <span class="lg-command-palette-demo__kbd">⏎</span> to run,
        <span class="lg-command-palette-demo__kbd">Esc</span> to dismiss.
      </p>
      <button
        type="button"
        class="lg-button lg-button--prominent lg-button--blue lg-command-palette-demo__trigger"
        data-open-command-palette
      >Open command palette</button>
      <article class="lg-content-card">
        <h2 class="lg-content-card__title">What the kit fixes</h2>
        <p class="lg-content-card__body">
          The palette uses the <code>hud</code> material role over a scrim,
          so it never stacks glass on the underlying toolbar (anti-pattern A1).
          The geometry (640 wide, 16 outer radius, 12 item radius) is
          concentric. Keyboard model is non-negotiable —
          <code>⌘K</code> toggle, <code>↑↓</code> navigate, <code>⏎</code> run,
          <code>Esc</code> close, focus trap while open, focus restore on close.
        </p>
      </article>
      <article class="lg-content-card">
        <h2 class="lg-content-card__title">Native equivalent</h2>
        <p class="lg-content-card__body">
          On macOS 26, place the panel in
          <code>.overlay(alignment: .top)</code> with
          <code>.glassEffect(.regular, in: .rect(cornerRadius: 16))</code>,
          and toggle it with
          <code>.keyboardShortcut(.init("k"), modifiers: .command)</code>.
          Do <em>not</em> reuse <code>.searchable</code> — that one lives in
          the toolbar; the palette is its own modal surface.
        </p>
      </article>
    </div>
  `;
}

function scrollEdgeEffectsBody() {
  const ROW_COUNT = 24;
  const rows = Array.from({ length: ROW_COUNT }, (_, i) => `
    <li class="lg-edge-demo__row">
      <span>Row ${i + 1}</span>
      <span class="lg-edge-demo__meta">${60 - i * 2} min ago</span>
    </li>
  `).join("");

  function variant(title, modifier, copy) {
    return `
      <article class="lg-edge-demo lg-edge-demo--${modifier}">
        <h2 class="lg-edge-demo__title">${title}</h2>
        <div class="lg-edge-demo__frame">
          <div class="lg-toolbar-pill lg-edge-demo__pill" data-renderer="css">
            <button type="button" class="lg-toolbar-pill__item" aria-label="Filter"><span aria-hidden="true">≡</span></button>
            <span class="lg-edge-demo__pill-title">Inbox</span>
            <button type="button" class="lg-toolbar-pill__item" aria-label="More"><span aria-hidden="true">⋯</span></button>
          </div>
          <ol class="lg-edge-demo__list lg-edge-demo__list--${modifier}">${rows}</ol>
        </div>
        <p class="lg-edge-demo__note">${copy}</p>
      </article>
    `;
  }

  return `
    <div class="lg-edge-demo-grid">
      ${variant("Soft · default fade", "soft",
        "Wide <code>mask-image: linear-gradient(...)</code> with a 24 px transparent band. iOS/iPadOS default and most macOS scrolling content.")}
      ${variant("Hard · sharp shelf", "hard",
        "Narrow 6 px gradient — reads as a clear boundary. Used on macOS for pinned headers, text editors, and inspector panes.")}
    </div>
    <p class="lg-section__lede">
      Web approximation only. Native uses
      <code>.scrollEdgeEffectStyle(.soft | .hard, for: .top)</code> (SwiftUI) or
      <code>scrollView.topEdgeEffect.style</code> (AppKit). One style per edge —
      never mix soft + hard on adjacent edges. Apply only where chrome actually
      overlaps that edge.
    </p>
  `;
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
      <div class="lg-material-card__pane lg-glass--clear" data-renderer="css" data-dim="true" data-tier="T1">
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
    id: "inputs-overlays",
    eyebrow: "Components",
    title: "Inputs & overlays",
    lede: `Menu, search field, toggle, slider, progress, badge, and a floating HUD.
           Glass is automatic on the menu and HUD; the rest are <strong>solid</strong>
           because they sit in the content layer or behind text the user is reading.`,
    body: inputsOverlaysBody,
  },
  {
    id: "forms-lists",
    eyebrow: "Components",
    title: "Forms & lists",
    lede: `Form rows, inset list with grouped sections, and disclosure groups.
           Solid throughout — glass behind body content is anti-pattern A2.`,
    body: formsListsBody,
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
    id: "command-palette",
    eyebrow: "Patterns",
    title: "Command palette (⌘K)",
    lede: `Floating action launcher on the <code>hud</code> material role.
           Spotlight is the system version; Raycast / Linear / Superhuman
           are the modern app pattern. The kit codifies geometry, motion,
           and the keyboard model so the focus trap and restore are right.`,
    body: commandPaletteBody,
  },
  {
    id: "morphing",
    eyebrow: "Patterns",
    title: "Morphing",
    lede: `Single-capsule shape morph — width, border-radius, and content
           crossfade together in one CSS transition, inside one glass
           surface. Multi-capsule metaball emergence is native-only.`,
    body: morphingBody,
  },
  {
    id: "scroll-edge-effects",
    eyebrow: "Patterns",
    title: "Scroll edge effects",
    lede: `How scrolling content fades or hardens beneath floating chrome.
           Web approximation uses <code>mask-image: linear-gradient(...)</code>
           on the scroll container; native uses
           <code>.scrollEdgeEffectStyle(.soft | .hard, for:)</code>.`,
    body: scrollEdgeEffectsBody,
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
