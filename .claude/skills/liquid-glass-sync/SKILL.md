---
name: liquid-glass-sync
description: Cross-cutting sync workflow for the Liquid Glass kit. Use whenever a token, component, rule, or pattern in this repo changes. Orchestrates lockstep updates across spec/, docs/design-system.md, the web prompt token block, examples/macos-web/, the native plugin references, and examples/macos-native-swift/, so the renderings never drift. Do not use for single-rendering bug fixes (e.g. fixing a CSS typo or a Swift compile error that doesn't touch the design system).
---

# Liquid Glass — cross-cutting sync

This skill owns the workflow for changes that affect the design system
itself: tokens, components, rules, patterns. The kit has multiple
surfaces and they must move together:

1. **Spec** — `spec/tokens/*.yaml`, `spec/components/*.yaml`, `spec/rules/*.md` (structured data + rules); `spec/build/build-tokens.mjs` regenerates `dist/*` from tokens (run `npm run build:tokens`). `dist/tokens.tokensstudio.json` feeds the Figma kit (`kit-figma/`).
2. **Inventory doc** — `docs/design-system.md` (the human-readable map)
3. **Web prompt** — `prompts/web-frosted-glass.md` (token block at the top)
4. **Web showcase** — `examples/macos-web/` (HTML/CSS reference output)
5. **Audit** — `audit/liquid-glass-audit.mjs` + `audit/README.md` (paired — when you add a check, update both)
6. **Native plugin skill** — `plugins/liquid-glass-native/skills/liquid-glass-native-ui/` (`SKILL.md` reference map + `references/*.md`)
7. **Native plugin agents** — `plugins/liquid-glass-native/agents/*.md` (implementer + auditor enumerate audit IDs; refresh when IDs change)
8. **Native showcase** — `examples/macos-native-swift/` (real SwiftUI on macOS 26)
9. **Changelog** — `CHANGELOG.md` (one entry per shipped change)

If you change one, you change all of the relevant others, in the order below.

## When to invoke

Use this skill for:

- Adding a new token (radius, spacing, motion, type, material).
- Adding a new component (button variant, control, surface).
- Changing existing token values or component dimensions.
- Adding / changing a layout rule, anti-pattern, or accessibility rule.
- Renaming a token / component (the renames must propagate everywhere).

Do **not** use this skill for:

- A pure web-only bug (CSS typo, missing class). Fix it in `examples/macos-web/` and run `npm run audit`.
- A pure native-only bug (Swift compile error, layout glitch). Fix it in `examples/macos-native-swift/` and run `swift build`.
- Documentation tweaks that don't change tokens or components.
- Audit script bugs that don't change which patterns are forbidden.

If you're unsure, ask: "does this change need to be visible in every rendering of the design system?" If yes, use this skill.

## Required order

Every cross-cutting change goes through this order. Skipping a step is the bug.

### 1. Spec (`spec/`)

If the change adds or modifies a numeric token, geometry value, or component definition:

- Edit the relevant file under `spec/tokens/*.yaml` or `spec/components/*.yaml`.
- For rules / anti-patterns: edit the relevant `spec/rules/*.md`.
- For new tokens: add an entry to `spec/liquid-glass.profile.yaml` `imports` if a new file was created.
- For any token-value change: run `npm run build:tokens` to regenerate `dist/*` (CSS / Swift / Tailwind / Tokens Studio) and the showcase mirror `examples/macos-native-swift/Sources/LiquidGlassShowcase/Tokens.generated.swift`. CI runs `npm run check:tokens` and fails if you skipped this. If the build script itself needs updating (new YAML key, new output format), edit `spec/build/build-tokens.mjs`.

If the change is purely architectural (a new pattern, a renamed concept) and not a numeric value, you may skip this step. Document the choice in the doc step.

### 2. Inventory doc (`docs/design-system.md`)

Edit `docs/design-system.md` to reflect the new state. Every entry must have:

- description / values
- `spec` pointer
- `web` pointer (file path, not line number)
- `native` pointer
- `apple` pointer (API name or HIG concept)
- `caveats` if non-obvious

If a new entry is added, slot it in the right section (Tokens, Components, Patterns, Rules).

### 3. Web prompt (`prompts/web-frosted-glass.md`)

Update the token block at the top of the prompt to reflect the new spec values. Keep the block compact: this prompt gets pasted into tools with limited context, so every line must earn its place.

If the change adds a new component, add a one-line geometry entry to the "Component geometry" section.

### 4. Web showcase (`examples/macos-web/`)

Edit `examples/macos-web/styles.css` and `examples/macos-web/index.html` so the new state is rendered.

- Reference CSS variables that map to spec tokens (`--lg-radius-*`, `--lg-glass-*`). Do not invent numeric values inline.
- New glass surfaces need `data-renderer="css"` and proper accessibility fallbacks.
- New components mirror the HTML structure used by existing components for the auditor's static checks.

Run the auditor:

```bash
npm run audit
```

It must pass before moving on. If it complains, fix the HTML / CSS. Do not lower the standard.

### 5. Audit (`audit/`)

If the change adds, renames, or removes an audit ID, both files must move together:

- `audit/liquid-glass-audit.mjs` — the check function and the ID it emits.
- `audit/README.md` — the human-readable list of what each ID catches plus the prefix taxonomy.

Audit ID prefixes: **A** (anti-patterns), **B** (budget), **F** (forbidden surfaces, review-only). Pick the prefix by category and stay numerically distinct from existing IDs across all prefixes.

If only token values shifted (no new check, no new ID), this step is often unchanged.

### 6. Native plugin references (`plugins/liquid-glass-native/.../references/`)

Update the references the native skill loads on demand:

- `tokens.md` — radii, spacing, motion, typography tokens.
- `swiftui.md` / `appkit.md` — relevant API references.
- `anti-patterns.md` — if the change introduces a new anti-pattern.
- `where-glass-goes.md` — if the change affects the "yes / no" surface list.

### 7. Native plugin agents (`plugins/liquid-glass-native/agents/*.md`)

If the audit ID space or rule structure changed, update the implementer / auditor agent definitions so their `What to check` sections enumerate the new IDs. Pure value tweaks (a different blur number) often don't need this.

### 8. Native showcase (`examples/macos-native-swift/`)

Edit `examples/macos-native-swift/Sources/LiquidGlassShowcase/`:

- Token changes → `Tokens.swift`.
- New section / component → add to `Sections.swift` (or split into a new file if the section gets large).
- Wire selection / navigation in `Sidebar.swift` and `ContentView.swift`.

Build:

```bash
cd examples/macos-native-swift && swift build
```

It must compile. If it doesn't, fix it. Don't ship broken native code.

### 9. Changelog (`CHANGELOG.md`)

Add one section per shipped change at the top of the file. Bump the version. List paths touched and the user-facing effect.

## Self-audit before returning

Before you say "done", state explicitly which of these nine locations you touched. If a location was intentionally skipped, say why.

```
sync audit:
- spec:               <touched | n/a: reason>
- docs:               <touched | n/a: reason>
- web prompt:         <touched | n/a: reason>
- web showcase:       <touched | n/a: reason>  (audit: pass | fail)
- audit code+readme:  <touched | n/a: reason>
- native references:  <touched | n/a: reason>
- native agents:      <touched | n/a: reason>
- native showcase:    <touched | n/a: reason>  (build: pass | fail)
- changelog:          <touched | n/a: reason>
```

If the web showcase was touched but `npm run audit` wasn't run, that's a failure. Run it.
If the native showcase was touched but `swift build` wasn't run, that's a failure. Run it.

### Drift sweep

When adding or renaming audit IDs / rule codes / API references, grep for stale references before declaring done:

```bash
grep -rn "A1-A10\|A1–A10" --include="*.md" .                              # stale ID lists
grep -rn "\bF[1-9]\b\|\bB[1-9]\b" --include="*.md" --include="*.yaml" .   # F/B codes
```

Every place that enumerates IDs must enumerate the new one.

## Hard rules

- **No drift.** If a token exists in the spec, it must be referenced in the doc, the web prompt, the web showcase, the native references, and (where applicable) the native showcase. Adding a token only to spec is incomplete.
- **No improvised numerics.** Inventing a blur, radius, opacity, or shadow value in any surface is anti-pattern A3. Add it to the spec first.
- **No Apple endorsement claims** anywhere. The kit is inspired-by, not endorsed.
- **No reverting the AGENTS.md guardrails.** That file documents the contract; if you change the workflow, update it intentionally.

## When the spec doesn't match a real Apple API

The web side is a community approximation. Numeric values are labeled as such in `spec/tokens/material.yaml`. The native side wraps real Apple APIs. If you need a value the spec doesn't have:

- For a web-only color or layout: add it to `spec/tokens/*.yaml` as a new entry; do not invent inline.
- For a native API the spec can't constrain (because the native side uses Apple APIs, not numeric tokens): document the API choice in the inventory doc under `apple:` and `caveats:`. The native code may reference Apple APIs directly without a corresponding spec token.

## Out of scope

This skill does not:

- Generate code from the spec. The repo has no build step; updates are LLM-orchestrated.
- Implement individual components from scratch. For native, use the per-plugin implementer agent (`liquid-glass-native-implementer`). For web, the prompt is itself the implementer.
- Review for anti-patterns in isolation. For native, use the auditor agent (`liquid-glass-native-auditor`). For web, use `audit/liquid-glass-audit.mjs`.

This skill is the *coordinator*.

## Pointers

- Inventory: `docs/design-system.md`
- Spec data: `spec/tokens/`, `spec/components/`, `spec/rules/`, `spec/liquid-glass.profile.yaml`
- Web prompt: `prompts/web-frosted-glass.md`
- Web showcase: `examples/macos-web/`
- Web audit: `audit/liquid-glass-audit.mjs`
- Native plugin: `plugins/liquid-glass-native/`
- Native showcase: `examples/macos-native-swift/`
- Provenance / source URLs: `docs/resources.md`
