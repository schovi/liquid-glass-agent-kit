# Apple Agent Kit

A native Apple-app kit for AI tools. Build Mac apps that actually feel like Mac apps — HIG conformance, menu bar order, multi-window, keyboard shortcuts, system primitives, accessibility — plus the macOS 26 Liquid Glass material with the fallback ladder baked in. iOS coverage is on the roadmap.

Two delivery surfaces, one repo:

- **Native plugin** (`plugins/apple-agent-kit/`) — installs into Claude Code or Codex. Two skills:
  - `macos-app-design` — HIG conformance, menu bar, multi-window, keyboard shortcuts, file management, system primitives, app icon, generic accessibility. macOS 14+.
  - `liquid-glass` — macOS 26 glass material wrapping the real `glassEffect` / `NSGlassEffectView` / `ConcentricRectangle` APIs. Anti-patterns, performance budget, Metal shaders.
- **Web prompt** (`prompts/web-frosted-glass.md`) — paste-once block for any AI tool that can't install plugins (ChatGPT, v0, Lovable, Figma Make). Produces a frosted-glass approximation; not a render of native Liquid Glass.

## The kit's position

Apple shipped Liquid Glass to a mixed reception. [NN/g called it "cracked"](https://www.nngroup.com/articles/liquid-glass/). [Infinum measured WCAG-AA failures on Control Center](https://infinum.com/blog/apples-ios-26-liquid-glass-sleek-shiny-and-questionably-accessible/). [45% of developers held back from the redesign](https://www.geeky-gadgets.com/apple-liquid-glass-adoption-rate/). The kit's answer: ship Liquid Glass with the contrast film, the reduced-transparency tier, and the audit baked in — accessibility-first, not as an afterthought. WCAG 1.4.3 / 2.4.7 / 2.5.5 / 4.1.2 / 2.3.3 are enforced at generation time through the prompt, at review time through `npm run audit`, and at runtime through the renderer-tier ladder (T0 solid fallback ⇢ T1 backdrop-filter ⇢ T2 displacement ⇢ T3 WebGL). See `spec/rules/accessibility-rules.md`.

The HIG side (menu bar, multi-window, shortcuts) is just as important. A Liquid Glass surface inside an otherwise-non-native app still feels off — `macos-app-design` exists to make the rest of the app feel like a Mac app.

## What this is

- **`spec/`** — canonical tokens, component dimensions, layering rules, accessibility fallbacks. Single source of truth.
- **`prompts/web-frosted-glass.md`** — paste-once block for any web-output AI tool.
- **`plugins/apple-agent-kit/`** — Codex + Claude Code plugin. Two production skills + one iOS stub.
- **`examples/macos-web/`** — showcase of what a web design tool produces when you paste the web prompt. HTML, CSS, vanilla JS.
- **`examples/macos-native-swift/`** — showcase SwiftUI app on macOS 26 demonstrating both skills.
- **`audit/`** — standalone CLI that statically checks web output for the most common hallucinations.

## What this is not

- Not Apple-official, Apple-certified, or Apple-endorsed.
- The web side is **not** a render of native Liquid Glass. It's frosted glass that obeys the same layout discipline. Real Liquid Glass needs Apple APIs on macOS 26.
- Not iOS — see the `ios-app-design` stub for status.

## Quick start, web

```text
1. Open prompts/web-frosted-glass.md
2. Copy its contents into your AI tool, before your UI request
3. Ask for the UI you want
4. (Optional) audit the output: node audit/liquid-glass-audit.mjs ./output
```

Tested with: ChatGPT, Claude (web + Code), Codex, Cursor, v0, Lovable, Figma Make, Bolt, Windsurf, JetBrains AI, Xcode AI.

## Quick start, native macOS

### Codex

```bash
codex plugin marketplace add schovi/apple-agent-kit --sparse .agents/plugins plugins/apple-agent-kit
```

```text
$macos-app-design Build a SwiftUI sidebar app with NavigationSplitView and a menu bar wired correctly.
$liquid-glass Add Liquid Glass to the toolbar of this app.
```

### Claude Code

```bash
claude plugin marketplace add schovi/apple-agent-kit --sparse .claude-plugin plugins/apple-agent-kit
/plugin install apple-agent-kit@apple-agent-kit
/apple-agent-kit:macos-app-design Build a SwiftUI inspector pane with the right keyboard shortcut.
/apple-agent-kit:liquid-glass Apply Liquid Glass to the inspector.
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

Regex-based static check, dependency-free. Catches glass-on-glass, glass behind body text, off-token blur / saturation / radius / opacity, capsule miscalculation, mixed Regular + Clear, missing accessibility fallbacks, and "Apple-official" claims. See `audit/README.md`. Exit 0 = clean, 1 = findings.

## Native review

Use the read-only `apple-app-reviewer` subagent to review SwiftUI / AppKit code against both HIG (`macos-app-design`) and Liquid Glass anti-patterns (`liquid-glass`). It does not edit files.

## Repo layout

```
spec/                            canonical tokens, components, rules
prompts/
└── web-frosted-glass.md         the portable web prompt
plugins/
└── apple-agent-kit/             Codex + Claude plugin
    ├── skills/
    │   ├── liquid-glass/        macOS 26 glass material
    │   ├── macos-app-design/    HIG / Mac craft
    │   └── ios-app-design/      placeholder
    └── agents/                  apple-app-reviewer + liquid-glass-implementer(+shader)
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
- The native plugin references under `plugins/apple-agent-kit/skills/liquid-glass/references/`

The local `.claude/skills/liquid-glass-sync/` skill orchestrates these updates.

## License

MIT. See `LICENSE`.
