# Install for Claude Code

This installs the **native macOS 26** plugin. For web Liquid Glass UI in Claude Code (or any other tool), use `prompts/web-frosted-glass.md` instead. See `docs/web-prompt.md`.

## Marketplace install (recommended)

Inside Claude Code:

```
/plugin marketplace add schovi/liquid-glass-agent-kit
/plugin install liquid-glass-native@liquid-glass-agent-kit
```

Or from the shell:

```bash
claude plugin marketplace add schovi/liquid-glass-agent-kit --sparse .claude-plugin plugins/liquid-glass-native
```

## Local development

Run the plugin straight out of this repo:

```bash
claude --plugin-dir ./plugins/liquid-glass-native
```

Then:

```
/liquid-glass-native:liquid-glass-native-ui Build a SwiftUI app with NavigationSplitView, a glass toolbar, and an inspector.
```

## How this plugin is laid out

`plugins/liquid-glass-native/` contains `.claude-plugin/plugin.json` (which Claude Code reads) and `.codex-plugin/plugin.json` (which Codex reads). Both manifests point at the same `skills/liquid-glass-native-ui` directory. Claude Code additionally reads `agents/`; Codex ignores that folder.

## Subagents shipped with the plugin

- `liquid-glass-native-auditor` — read-only review of generated SwiftUI / AppKit.
- `liquid-glass-native-implementer` — token-strict implementer.

Both reference the canonical `liquid-glass-native-ui` skill.

## Update

```
/plugin marketplace update liquid-glass-agent-kit
/plugin install liquid-glass-native@liquid-glass-agent-kit
```

After local skill edits, re-run `/reload-plugins`.
