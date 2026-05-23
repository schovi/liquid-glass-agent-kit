# dist/ — generated token exports

These files are **generated** from `spec/tokens/*.yaml` by
`spec/build/build-tokens.mjs`. Do not hand-edit them.

To regenerate:

```bash
npm install            # one-time, for the `yaml` parser
npm run build:tokens   # writes the four files in this directory
```

To verify the committed files are still in sync with the spec
(CI / pre-merge guard):

```bash
npm run check:tokens
```

Exits non-zero if regenerating would produce different bytes.

## Files

| File | Consumer | Notes |
|---|---|---|
| `tokens.css`              | Any web project | `:root { --lg-* }` custom properties. `@import` from your stylesheet. |
| `Tokens.swift`            | SwiftUI / AppKit projects | `enum LiquidGlassTokens { … }` with nested `Radius`, `Spacing`, `Duration`, `Weight`, `TypeScale`, `Glass`, `Budget`, `Tier`. Drop into any Swift target. |
| `tailwind.tokens.js`      | Tailwind v3 / v4 projects | `export default { theme: { extend: { … } } }` — merge into your Tailwind config. |
| `tokens.tokensstudio.json` | Figma via the Tokens Studio plugin | Tokens Studio single-file JSON shape; the `kit-figma/` flow (#11) consumes it. |

## Why this exists

Before this pipeline existed, anyone using the kit on a new platform
had to hand-translate every value from the YAML. Three places to keep
in sync, drift inevitable. Now the YAML is the source and these four
files are derived — one regenerate command keeps every renderer
honest.

The pipeline is intentionally minimal (one tiny dev dependency, one
script, no Style Dictionary plugin tree). It plays the same role
Style Dictionary does in larger design systems; the issue tracker
references "Style Dictionary" as shorthand for that role.
