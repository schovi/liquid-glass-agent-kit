# Liquid Glass Agent Kit

Build Apple-inspired Liquid Glass UI with any AI tool. Stop agents inventing random blur, radius, shadow, and spacing values. Fixed tokens, fixed component sizes, fixed layering rules.

Two delivery modes, one spec:

- **Web**: a paste-once prompt. Works in any AI tool, including ones that can't install plugins (ChatGPT, v0, Figma Make, Lovable).
- **Native macOS 26**: a skill/plugin installed into Claude Code or Codex. Wraps the real `glassEffect` / `NavigationSplitView` / `ConcentricRectangle` APIs.

## What this is

- **`spec/`**: canonical tokens, component dimensions, layering rules, accessibility fallbacks. Single source of truth.
- **`prompts/web-frosted-glass.md`**: paste-once block for any web-output AI tool.
- **`plugins/liquid-glass-native/`**: Codex + Claude Code plugin for SwiftUI / AppKit on macOS 26.
- **`examples/macos-web/`**: showcase of what a web design tool produces when you paste the web prompt. HTML, CSS, vanilla JS.
- **`examples/macos-native-swift/`**: showcase of what the native plugin produces. SwiftUI app using real Apple APIs.
- **`audit/`**: standalone CLI that statically checks web output for the most common hallucinations.

## What this is not

- Not Apple-official, Apple-certified, or Apple-endorsed.
- The web side is **not** a render of native Liquid Glass. It's frosted glass that obeys the same layout discipline. Real Liquid Glass needs Apple APIs on macOS 26.
- Earlier versions also shipped a `liquid-glass-web` plugin for Claude Code / Codex. That plugin was removed in v0.2 in favor of the portable web prompt; native stays a plugin because skill-supporting tools (Claude Code, Codex, Cursor) are where native devs already work.

## Quick start, web

```text
1. Open prompts/web-frosted-glass.md
2. Copy its contents into your AI tool, before your UI request
3. Ask for the UI you want
4. (Optional) audit the output: node audit/liquid-glass-audit.mjs ./output
```

Tested with: ChatGPT, Claude (web + Code), Codex, Cursor, v0, Lovable, Figma Make, Bolt, Windsurf, JetBrains AI, Xcode AI.

## Quick start, native macOS 26

### Codex

```bash
codex plugin marketplace add schovi/liquid-glass-agent-kit --sparse .agents/plugins plugins/liquid-glass-native
```

```text
$liquid-glass-native-ui Build a SwiftUI sidebar app with NavigationSplitView.
```

### Claude Code

```bash
claude plugin marketplace add schovi/liquid-glass-agent-kit --sparse .claude-plugin plugins/liquid-glass-native
/plugin install liquid-glass-native@liquid-glass-agent-kit
/liquid-glass-native:liquid-glass-native-ui Build a SwiftUI inspector pane.
```

## Run the showcases

```bash
npm run example:web              # web showcase  http://localhost:8000
npm run example:native           # native macOS showcase (requires macOS 26 + Xcode 26)
npm run example:native:xcode     # open the SwiftUI package in Xcode
```

## Audit (web)

```bash
npm run audit                              # audits examples/macos-web
node audit/liquid-glass-audit.mjs <path>   # audit arbitrary output
```

Regex-based static check, dependency-free. Catches glass-on-glass, glass behind body text, off-token blur / saturation / radius / opacity, capsule miscalculation, mixed Regular + Clear, missing accessibility fallbacks, and "Apple-official" claims. See `audit/README.md` for the full list and known gaps.

Exit 0 = clean, 1 = findings.

## Repo layout

```
spec/                            canonical tokens, components, rules
prompts/
└── web-frosted-glass.md         the portable web prompt
plugins/
└── liquid-glass-native/         native macOS 26 plugin (Codex + Claude)
examples/
├── macos-web/                   showcase: produced from the web prompt
└── macos-native-swift/          showcase: produced via the native plugin
audit/                           standalone web audit CLI
docs/                            design-system inventory + install guides + resources
```

## Editing

`spec/` is canonical. When tokens change, propagate to:

- The token block inside `prompts/web-frosted-glass.md`
- `examples/macos-web/tokens.js`
- `examples/macos-native-swift/Sources/.../Tokens.swift`
- The native plugin references under `plugins/liquid-glass-native/skills/liquid-glass-native-ui/references/`

There is no build step. The local `.claude/skills/liquid-glass-sync/` skill orchestrates these updates.

## License

MIT. See `LICENSE`.
