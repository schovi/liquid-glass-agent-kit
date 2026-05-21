# Liquid Glass Agent Kit

Build Apple-inspired Liquid Glass user interfaces with AI agents, plugins, copy-paste prompts, or local tooling. Two sibling plugins share one canonical spec:

- **`liquid-glass-web`** — Liquid Glass *web* UI in HTML, CSS, React, JSX, or Tailwind.
- **`liquid-glass-native`** — Liquid Glass *native* macOS UI in SwiftUI or AppKit (macOS 26 Tahoe).

The goal in both cases: stop agents from inventing random blur, radius, shadow, and spacing values.

## Choose your path

| I want…                                                              | Plugin                  |
| -------------------------------------------------------------------- | ----------------------- |
| HTML/CSS, React, JSX, Tailwind, or a design-tool prompt              | `liquid-glass-web`      |
| A real macOS app in SwiftUI or AppKit                                | `liquid-glass-native`   |
| ChatGPT / Claude web / v0 / Lovable / Figma Make / Cursor chat (web) | paste `prompts/copy-paste-compact.md` |
| Just the audit, in CI                                                | the web plugin ships a Node audit script |

## What this is

- Component sizes, shape rules, material approximation tokens (CSS / SVG / WebGL for web; SwiftUI / AppKit references for native).
- Renderer recipes.
- Accessibility rules.
- A heuristic auditor (web).

## What this is not

- Not an Apple-official design system.
- Not a 1:1 copy of Apple's private rendering internals.
- The **web** profile is an approximation — adaptive native material cannot be reproduced exactly in HTML.

## Quick start

### Codex — web

```bash
codex plugin marketplace add OWNER/liquid-glass-agent-kit --sparse .agents/plugins plugins/liquid-glass-web
```

Open Codex and run `/plugins`. Install **Liquid Glass Web UI**, then:

```text
$liquid-glass-web-ui Build a settings screen in plain HTML/CSS.
```

### Codex — native

```bash
codex plugin marketplace add OWNER/liquid-glass-agent-kit --sparse .agents/plugins plugins/liquid-glass-native
```

```text
$liquid-glass-native-ui Build a SwiftUI sidebar app with NavigationSplitView.
```

### Claude Code — web

```bash
claude plugin marketplace add OWNER/liquid-glass-agent-kit --sparse .claude-plugin plugins/liquid-glass-web
/plugin install liquid-glass-web@liquid-glass-agent-kit
/liquid-glass-web:liquid-glass-web-ui Build a compact mobile onboarding screen.
```

### Claude Code — native

```bash
claude plugin marketplace add OWNER/liquid-glass-agent-kit --sparse .claude-plugin plugins/liquid-glass-native
/plugin install liquid-glass-native@liquid-glass-agent-kit
/liquid-glass-native:liquid-glass-native-ui Build a SwiftUI inspector pane.
```

### Copy/paste (web only, for now)

Open `prompts/copy-paste-compact.md` and paste it before your request.

### Run the showcases (from repo root)

```bash
npm run example:web              # web showcase  →  http://localhost:8000
npm run example:native           # native macOS showcase (swift run; requires macOS 26 + Xcode 26)
npm run example:native:xcode     # open the SwiftUI package in Xcode
```

### Audit (web)

```bash
npm run validate
# or directly:
node plugins/liquid-glass-web/skills/liquid-glass-web-ui/scripts/audit-liquid-glass-html.mjs path/to/output
```

## Layout

```
spec/                                          canonical source of truth (tokens, components, rules, schemas)
plugins/
├── liquid-glass-web/                          WEB plugin (shared by Codex and Claude)
│   ├── .codex-plugin/plugin.json
│   ├── .claude-plugin/plugin.json
│   ├── skills/liquid-glass-web-ui/            HTML / CSS / React / JSX / Tailwind
│   └── agents/                                Claude subagents (Codex ignores)
└── liquid-glass-native/                       NATIVE plugin (shared by Codex and Claude)
    ├── .codex-plugin/plugin.json
    ├── .claude-plugin/plugin.json
    ├── skills/liquid-glass-native-ui/         SwiftUI / AppKit
    └── agents/                                Claude subagents (Codex ignores)
.agents/plugins/marketplace.json               Codex marketplace listing both plugins
.claude-plugin/marketplace.json                Claude marketplace listing both plugins
prompts/                                       copy/paste prompt for plugin-less web tools
examples/macos-web/                            HTML/CSS reference showcase (passes the web audit)
examples/macos-native-swift/                   SwiftUI showcase app
docs/                                          install + usage docs
```

Why one folder per plugin? Codex reads `.codex-plugin/`, Claude reads `.claude-plugin/`. Their dotfolders do not collide, so a single plugin folder can serve both without duplicating skills or agents.

## Editing

Edit:

- `spec/`
- `plugins/liquid-glass-web/skills/liquid-glass-web-ui/`
- `plugins/liquid-glass-native/skills/liquid-glass-native-ui/`
- `plugins/*/agents/` (Claude-only)
- `prompts/copy-paste-compact.md`
- `examples/`
- `docs/`

There is no build step.

## License

MIT. See `LICENSE`.
