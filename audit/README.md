# Liquid Glass audit

Standalone static check for Liquid Glass web output. Dependency-free Node script (>=18).

## Usage

```bash
node audit/liquid-glass-audit.mjs <file-or-dir> [more...]
```

Exits 0 on clean, 1 on findings.

## What it catches

The auditor enforces the anti-patterns A1-A10 from `spec/rules/anti-patterns.md`:

- **A1** Glass-on-glass nesting
- **A2** Glass behind body text (`<p>`, `<article>`, `<section>` inside `.lg-glass`)
- **A3** Off-token blur / saturation values in CSS
- **A5** Capsule with `border-radius` other than `9999px`
- **A7** Mixed Regular and Clear glass in one group
- **A8** Clear glass without a `data-dim="true"` or `.lg-dim` sibling
- **A9** Missing `prefers-reduced-transparency` / `prefers-contrast` / `prefers-reduced-motion` fallback in CSS
- **A10** Apple endorsement phrases ("apple-official", "apple-certified", "licensed by apple")

A4 (invented component dimensions) and A6 (broken concentricity) are not statically checkable; they're enforced by the prompt at generation time and by manual review.

## What it scans

`.html`, `.htm`, `.css`, `.js`, `.mjs`. Skips `node_modules` and dotfiles.

JS/MJS scanning is intentional. Showcases that build glass markup inside template strings still match the same regexes.

## What it does not catch

- Tailwind arbitrary values (`backdrop-blur-[37px]`)
- CSS-in-JS (styled-components, emotion, vanilla-extract)
- CSS custom properties resolved from `:root`
- Inline `style` attribute variations beyond the captured patterns
- Runtime style mutation

Expanding coverage is a known gap. See top-level README "Improvements".

## Wire it into CI

```yaml
- run: node audit/liquid-glass-audit.mjs ./dist
```

Or via npm:

```bash
npm run audit
```

(See `package.json`.)
