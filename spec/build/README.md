# spec/build/ — token export pipeline

Builds `dist/*` from `spec/tokens/*.yaml`. Reads one source, writes
four downstream artifacts so every renderer can pull the same values.

## Usage

```bash
npm install            # one-time, pulls the `yaml` parser
npm run build:tokens   # regenerate dist/
npm run check:tokens   # CI guard: exit 1 if dist/ would change
```

## What it generates

| Output | Format | Consumer |
|---|---|---|
| `dist/tokens.css`               | CSS custom properties (`:root { --lg-* }`)        | Web showcase, downstream sites, Tailwind via `@theme` |
| `dist/Tokens.swift`             | `enum LiquidGlassTokens` with nested groups        | SwiftUI / AppKit, including the native showcase |
| `dist/tailwind.tokens.js`       | `export default { theme: { extend: {...} } }`      | Tailwind v3 / v4 config merge |
| `dist/tokens.tokensstudio.json` | Tokens Studio single-file JSON (`{ value, type }`) | Figma, via the Tokens Studio plugin (`kit-figma/`) |

## How it works

`build-tokens.mjs` is a single Node script:

1. Reads each YAML file in `spec/tokens/` with the `yaml` package.
2. Holds the spec values in plain JS objects.
3. For each target format, calls a `build<Target>` function that walks
   the spec and produces a string.
4. Writes the strings into `dist/` (or compares them when `--check`).

There's no Style Dictionary dependency. The pipeline plays the same
role (one-source-many-targets) without pulling a transformer tree.
Adding a fifth target (Android XML, Kotlin object, JSON-LD, etc.) is
a new `buildX()` function plus an entry in `TARGETS`.

## Adding a token

1. Add it to the relevant `spec/tokens/*.yaml` file.
2. Edit the matching `buildX()` function in `build-tokens.mjs` so the
   value flows into the output. Token sets are nested under stable
   keys (`shape.shape.fixed`, `material.glass.regular.css`, etc.) so
   the additions are usually one line per format.
3. Run `npm run build:tokens`.
4. Commit `dist/*` alongside the spec edit. CI runs
   `npm run check:tokens` and fails if you forgot.

## Adding a new YAML file

`build-tokens.mjs` imports YAML files explicitly at the top
(`loadYaml('shape.yaml')`, `loadYaml('material.yaml')`, etc.). When a
new file is added, add a `loadYaml('newfile.yaml')` line and consume
it from the relevant `buildX()` functions.

## Why not Style Dictionary?

The repo's design constraint is "no build step for the showcase /
prompt / native plugin". One dev-only script with one tiny YAML
dependency keeps that promise while still giving downstream consumers
the platform-specific files they expect. If Tokens Studio integration
grows beyond the single-file JSON output, swapping in Style Dictionary
itself becomes a clean replacement (same input shape, same output
files).
