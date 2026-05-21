# Quickstart

Pick the path that matches what you're building. Each path takes about a minute.

## Web UI in any AI tool

Open `prompts/web-frosted-glass.md` and paste its contents into your chat **before** your UI request. Works in: ChatGPT, Claude (web + Code), Codex, Cursor, v0, Lovable, Figma Make, Bolt, Windsurf, JetBrains AI, Xcode AI.

```text
<paste prompts/web-frosted-glass.md>

Task:
Build a settings screen with a sidebar and a floating toolbar.
```

See `docs/web-prompt.md`.

## Native macOS 26 (SwiftUI / AppKit)

### Codex

```bash
codex plugin marketplace add OWNER/liquid-glass-agent-kit --sparse .agents/plugins plugins/liquid-glass-native
```

```text
/plugins        # install "Liquid Glass Native UI"
$liquid-glass-native-ui Build a SwiftUI sidebar app with NavigationSplitView.
```

See `docs/install-codex.md`.

### Claude Code

```bash
claude plugin marketplace add OWNER/liquid-glass-agent-kit --sparse .claude-plugin plugins/liquid-glass-native
/plugin install liquid-glass-native@liquid-glass-agent-kit
/liquid-glass-native:liquid-glass-native-ui Build a SwiftUI inspector pane.
```

See `docs/install-claude.md`.

## Just the audit, locally

```bash
node audit/liquid-glass-audit.mjs path/to/output
```

Exits non-zero on any anti-pattern. Wire it into CI.

## Validate the kit itself

```bash
npm run audit
```

Runs the web auditor against `examples/macos-web`. There is no build step. The native plugin has no audit script yet; the native showcase is verified by building it (`npm run example:native:build`).
