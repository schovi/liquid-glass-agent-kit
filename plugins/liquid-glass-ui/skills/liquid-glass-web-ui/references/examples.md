# Examples

Reference snippets the agent can paste, adapt, and audit. All examples assume the token block from `tokens.md` is loaded once at `:root`.

## Capsule button (Regular glass, CSS renderer)

```html
<button class="lg-button lg-glass lg-glass--regular lg-capsule" data-renderer="css">
  Continue
</button>
```

```css
.lg-button {
  min-height: 44px;
  padding: 8px 16px;
  font: 600 15px/1.4 system-ui, sans-serif;
  border: 1px solid var(--lg-glass-border-light);
}
.lg-capsule { border-radius: 9999px; }
```

## Bottom tab bar (Regular glass, css-svg renderer)

```html
<nav class="lg-tab-bar lg-glass lg-glass--regular" data-renderer="css-svg" aria-label="Primary">
  <a class="lg-tab" aria-current="page">Home</a>
  <a class="lg-tab">Library</a>
  <a class="lg-tab">Search</a>
  <a class="lg-tab">Profile</a>
</nav>
```

```css
.lg-tab-bar {
  display: flex; gap: 4px;
  height: 64px; padding: 6px 8px;
  border-radius: 32px;
}
.lg-tab {
  min-width: 56px;
  display: grid; place-items: center;
  font-size: 11px;
}
```

## Modal sheet (Clear glass with dim layer)

```html
<div class="lg-sheet-backdrop lg-dim" aria-hidden="true"></div>
<section class="lg-sheet lg-glass lg-glass--clear" data-renderer="css" data-dim="true" role="dialog">
  <div class="lg-grabber"></div>
  <h2>Connect a device</h2>
  <button class="lg-button lg-glass lg-glass--regular lg-capsule" data-renderer="css">
    <!-- WRONG: this is glass-on-glass. Audit will flag A1. -->
  </button>
</section>
```

The button above is intentionally wrong to show what the audit catches. The fix is to make the button solid (no `lg-glass` class) when it sits inside a glass sheet.

## Card (no glass)

```html
<article class="lg-card">
  <h3>Reading list</h3>
  <p>The body of the card. Glass would shimmer behind this text — keep the card solid.</p>
</article>
```
