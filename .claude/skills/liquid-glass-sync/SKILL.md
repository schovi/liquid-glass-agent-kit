---
name: liquid-glass-sync
description: Cross-cutting sync workflow for the Liquid Glass kit. Use whenever a token, component, rule, or pattern in this repo changes. Orchestrates lockstep updates across spec/, docs/design-system.md, examples/macos-web/, and examples/macos-native-swift/ so the three renderings never drift. Do not use for single-rendering bug fixes (e.g. fixing a CSS typo or a Swift compile error that doesn't touch the design system).
---

# Liquid Glass — cross-cutting sync

This skill owns the workflow for changes that affect the design system
itself — tokens, components, rules, patterns. The kit has three
representations of the system and they must move together:

1. **Spec** — `spec/tokens/*.yaml`, `spec/components/*.yaml`, `spec/rules/*.md` (structured data + rules)
2. **Inventory doc** — `docs/design-system.md` (the human-readable map)
3. **Examples** — `examples/macos-web/` (HTML/CSS approximation) and `examples/macos-native-swift/` (real SwiftUI on macOS 26)

If you change one, you change all of them — in the order below.

## When to invoke

Use this skill for:

- Adding a new token (radius, spacing, motion, type, material).
- Adding a new component (button variant, control, surface).
- Changing existing token values or component dimensions.
- Adding / changing a layout rule, anti-pattern, or accessibility rule.
- Renaming a token / component (the renames must propagate to all three).

Do **not** use this skill for:

- A pure web-only bug (CSS typo, missing class). Fix it in `examples/macos-web/` and run `npm run validate`. Don't pull the native side along.
- A pure native-only bug (Swift compile error, layout glitch). Fix it in `examples/macos-native-swift/` and run `swift build`.
- Documentation tweaks that don't change tokens or components.

If you're unsure, ask: "does this change need to be visible in both renderings?" If yes, use this skill.

## Required order

Every cross-cutting change goes through this order. Skipping a step is the bug.

### 1. Spec (`spec/`)

If the change adds or modifies a numeric token, geometry value, or component definition:

- Edit the relevant file under `spec/tokens/*.yaml` or `spec/components/*.yaml`.
- For rules / anti-patterns: edit the relevant `spec/rules/*.md`.
- For new tokens: add an entry to `spec/liquid-glass.profile.yaml` `imports` if a new file was created.

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

### 3. Web example (`examples/macos-web/`)

Edit `examples/macos-web/styles.css` and `examples/macos-web/index.html` so the new state is rendered.

- Reference CSS variables that map to spec tokens (`--lg-radius-*`, `--lg-glass-*`, etc.). Do not invent numeric values inline.
- New glass surfaces need `data-renderer="css"` and proper accessibility fallbacks.
- New components mirror the HTML structure used by existing components for the auditor's static checks.

Run the auditor:

```bash
npm run validate
```

It must pass before moving on. If it complains, fix the HTML / CSS — do not lower the standard.

### 4. Native example (`examples/macos-native-swift/`)

Edit `examples/macos-native-swift/Sources/LiquidGlassShowcase/`:

- Token changes → `Tokens.swift`.
- New section / component → add to `Sections.swift` (or split into a new file if the section gets large).
- Wire selection / navigation in `Sidebar.swift` and `ContentView.swift`.

Build:

```bash
cd examples/macos-native-swift && swift build
```

It must compile. If it doesn't, fix it — don't ship broken native code.

## Self-audit before returning

Before you say "done", state explicitly which of these four locations you touched. If a location was intentionally skipped, say why.

```
sync audit:
- spec:    <touched | not applicable: reason>
- docs:    <touched | not applicable: reason>
- web:     <touched | not applicable: reason>  (validate: pass | fail)
- native:  <touched | not applicable: reason>  (build:    pass | fail)
```

If web was touched but `npm run validate` wasn't run — that's a failure. Run it.
If native was touched but `swift build` wasn't run — that's a failure. Run it.

## Hard rules

- **No drift.** If a token exists in the spec, it must be referenced in the doc, the web example, and (where applicable) the native example. Adding a token only to spec is incomplete.
- **No improvised numerics.** Inventing a blur, radius, opacity, or shadow value in any of the three is anti-pattern A3. Add it to the spec first.
- **No Apple endorsement claims** anywhere. The kit is inspired-by, not endorsed.
- **No reverting the AGENTS.md guardrails.** That file documents the contract; if you change the workflow, update it intentionally.

## When the spec doesn't match a real Apple API

The web profile is a community approximation — numeric values are
labeled as such in `spec/tokens/material.yaml`. The native side wraps
real Apple APIs. If you need a value the spec doesn't have:

- For a web-only color or layout: add it to `spec/tokens/*.yaml` as a new entry; do not invent inline.
- For a native API the spec can't constrain (because the native side uses Apple APIs, not numeric tokens): document the API choice in the inventory doc under `apple:` and `caveats:`. The native code may reference Apple APIs directly without a corresponding spec token.

## Out of scope

This skill does not:

- Generate code from the spec. The repo has no build step; updates are LLM-orchestrated.
- Implement individual components from scratch. For that, use the per-plugin implementer agents (`liquid-glass-web-implementer`, `liquid-glass-native-implementer`).
- Review for anti-patterns in isolation. For that, use the auditor agents (`liquid-glass-web-auditor`, `liquid-glass-native-auditor`).

This skill is the *coordinator*. The plugins do the actual writing under its direction.

## Pointers

- Inventory: `docs/design-system.md`
- Spec data: `spec/tokens/`, `spec/components/`, `spec/rules/`, `spec/liquid-glass.profile.yaml`
- Web rendering: `examples/macos-web/`
- Native rendering: `examples/macos-native-swift/`
- Provenance / source URLs: `docs/resources.md`
- Per-plugin skills: `plugins/liquid-glass-web/skills/liquid-glass-web-ui/`, `plugins/liquid-glass-native/skills/liquid-glass-native-ui/`
