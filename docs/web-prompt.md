# Web prompt usage

For web Liquid Glass UI in any AI tool, paste the contents of `prompts/web-frosted-glass.md` before your UI request. No install. Works in: ChatGPT, Claude (web + Code), Codex, Cursor, v0, Lovable, Figma Make, Bolt, Windsurf, JetBrains AI, Xcode AI.

## Recommended format

```
Use the Liquid Glass web frosted-glass prompt below for this task:

<paste prompts/web-frosted-glass.md>

Task:
Build a settings screen with a bottom tab bar and a floating action button.
```

## What you get

- Token-only material values (blur, saturation, shadow, radius).
- Component geometry locked to the spec (44 px touch targets, 64 px tab bar, capsule = 9999px).
- Required `prefers-reduced-transparency`, `prefers-contrast`, and `prefers-reduced-motion` fallbacks.
- A self-check pass before the model returns code.

## What you don't get

- Real Liquid Glass. This is a frosted-glass approximation. Apple's effect samples the backdrop in real time with displacement and motion-driven parallax; `backdrop-filter` is static.
- Native APIs. For real SwiftUI / AppKit `glassEffect`, install the native plugin instead (see `docs/install-claude.md` or `docs/install-codex.md`).

## Auditing what you get back

Paste the generated HTML/CSS into a file, then:

```bash
node audit/liquid-glass-audit.mjs ./generated.html ./generated.css
```

Or audit a whole directory:

```bash
node audit/liquid-glass-audit.mjs ./dist
```

Exits non-zero on any anti-pattern. See `audit/README.md` for the full check list and known gaps (the regex won't catch Tailwind arbitrary values, CSS-in-JS, or runtime style mutation).
