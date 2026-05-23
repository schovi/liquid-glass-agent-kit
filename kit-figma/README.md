# Liquid Glass — Figma kit

A token-driven Figma starter that consumes the same tokens the web prompt
and native plugin do. Designed for round-trip: edit tokens in Figma via
the Tokens Studio plugin, push changes back, run `npm run build:tokens`,
and every renderer picks up the new values.

This kit is **deliberately small**. It ships the token source and the
import recipe; the actual Figma file is community-maintained at the
links below and is best treated as a mockup baseline rather than a
canonical artifact.

## Source of truth

The token file consumed by Figma is generated:

```
spec/tokens/*.yaml
        │
        ▼
spec/build/build-tokens.mjs
        │
        ▼
dist/tokens.tokensstudio.json   ← Figma reads this via Tokens Studio
```

To regenerate after a token edit:

```bash
npm run build:tokens
```

The file at `dist/tokens.tokensstudio.json` is Tokens Studio "single
file JSON" shape — every leaf is `{ value, type }` and the top-level
groups (`radius`, `spacing`, `duration`, `easing`, `fontWeight`,
`typeScale`, `glass`) match the spec's token taxonomy.

## Install in Figma

1. **Install Tokens Studio.** From the Figma plugin menu, add
   [Tokens Studio for Figma](https://www.figma.com/community/plugin/843461159747178978/tokens-studio-for-figma)
   (free). Open it on a new Figma file.
2. **Import.** Tokens Studio → top-right `…` → *Tools* → *Import*.
   Select `dist/tokens.tokensstudio.json` from a local clone of this
   repo.
3. **Apply.** Once imported, Tokens Studio shows the seven token sets
   (radius, spacing, duration, easing, fontWeight, typeScale, glass).
   Click *Apply* to push them to Figma Variables.

That's the one-way import path. After this, the values live in your
Figma file as native Variables — you can bind them to component
properties (corner radius, padding, color) like any Figma token.

## Round-trip (designers → engineers)

If you want designers to propose token changes from Figma back to the
spec:

1. Edit tokens in Tokens Studio inside Figma.
2. *Tools* → *Export* → *Single File JSON* → save it back as
   `dist/tokens.tokensstudio.json` in a feature branch.
3. Reverse-translate to YAML manually (the script in `spec/build/` is
   one-way today; an automated reverse-translate is on the backlog).
4. Open a PR with the YAML edit. Engineers run `npm run build:tokens`
   to confirm `dist/` regenerates to exactly what Figma exported.

## Reference Figma kits (visual baseline)

These are community-maintained, not part of this repo. Use them to
mock up screens against the same shape vocabulary the kit ships.

- [Figma — Apple macOS 26 UI Kit](https://www.figma.com/community/file/1543337041090580818/macos-26) — first-party Mac kit; the closest visual baseline for Liquid Glass surfaces.
- [Figma — macOS 26 Liquid Glass Effect](https://www.figma.com/community/file/1514239434132644410/macos-26-liquid-glass-effect) — most-downloaded community Liquid Glass kit; uses Figma's blur + noise primitives to approximate the material.
- [Figma — Apple Liquid Glass Control Center (macOS 26)](https://www.figma.com/community/file/1515113236376349942/apple-liquid-glass-ui-control-center-macos-26-apple-wwdc-2025).
- [Figma — Liquid Glass plugin](https://www.figma.com/community/plugin/1513987776905738207/liquid-glass) — applies the effect to any frame.
- [Figma — macOS icon template (Liquid Glass)](https://www.figma.com/community/file/930870327989917713/macos-icon-template-updated-for-macos-26-liquid-glass) — squircle grid + layered model. Pair with `spec/rules/icon.md`.
- [Figma — Native Settings Screens Template for macOS](https://www.figma.com/community/file/1352540826859890311/native-settings-screens-template-for-macos) — comprehensive layout reference for Mac product designers.

## Frames designers should mock up

The web showcase (`examples/macos-web/`) and the native showcase
(`examples/macos-native-swift/`) are the canonical worked examples
covering this list. Mirror them in Figma so designers and engineers
look at the same surface inventory:

- Window chrome (28 px outer radius, 8 px control gap, sidebar concentric at 20 px). See `spec/patterns/window-chrome.md`.
- Sidebar (220–260 ideal, sections, footer, scroll edge). See `spec/patterns/sidebar.md`.
- Toolbar (52 / 28 heights, capsule items, fixed-vs-flexible spacers). See `spec/components/toolbar.yaml`.
- Popover and menu (radius 16 / 12, concentric items). See `spec/components/popover.yaml`, `spec/components/menu.yaml`.
- Sheet (top radius 28, grabber, partial detents). See `spec/components/sheet.yaml`.
- Command palette (640×480 panel, hud role, scrim under). See `spec/components/command-palette.yaml`.
- Material card stack (Regular vs Clear vs reduced-transparency). See `examples/macos-web/sections.js` for the markup, `spec/tokens/material.yaml` for the values.

## Known limitations

- **One-way today.** The build script is YAML → JSON; reverse is manual.
  A second `tokens-studio → yaml` script is on the backlog. Until then,
  treat the YAML as the canonical source.
- **Effect Styles (shadow, blur) don't auto-create.** Tokens Studio
  expects `boxShadow` values as a structured `{ x, y, blur, spread,
  color, type }` object; the generator currently emits a CSS string
  (`"0 8px 32px rgba(0,0,0,0.12)"`). Result: the shadow + blur values
  import into Tokens Studio's data but don't materialize as Figma
  **Effect Styles**, so they won't appear in the Effect Styles dropdown
  on a shape. Colors and dimensions work fine; for now apply Effect
  values manually from `spec/tokens/material.yaml` if you need a
  glass-looking surface in Figma. Fix is a small change to
  `spec/build/build-tokens.mjs`'s `buildTokensStudio()`.
- **No Figma `.fig` file in this repo.** Distributing a Figma file
  through git is impractical; the kit ships the tokens, the import
  recipe, and pointers to community files instead. If the project grows
  a maintained Figma file, link to it from this README.
- **Glass material is approximate in Figma.** Figma cannot run real
  `backdrop-filter` or WebGL; the linked community kits use blur +
  noise + gradient layers as a baseline. Mockups should be cross-checked
  against the web showcase or a real macOS 26 surface.
- **Apple endorsement disclaimer applies.** Even when using community
  Figma kits that include Apple marks, never label output as
  "Apple-official". The kit (and any derivative) is inspired-by, not
  endorsed.

## See also

- `dist/tokens.tokensstudio.json` — the file Tokens Studio reads.
- `spec/build/README.md` — the generator + its outputs.
- `docs/design-system.md` — full token inventory with cross-platform pointers.
- `docs/resources.md` section N.6 — Figma assets and Icon Composer.
