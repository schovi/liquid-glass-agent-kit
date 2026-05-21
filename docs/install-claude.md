# Install for Claude Code

## Marketplace install (recommended)

Inside Claude Code:

```
/plugin marketplace add OWNER/liquid-glass-agent-kit
/plugin install liquid-glass-ui@liquid-glass-agent-kit
```

Or from the shell:

```bash
claude plugin marketplace add OWNER/liquid-glass-agent-kit --sparse .claude-plugin plugins/liquid-glass-ui
```

## Local development

Run the plugin straight out of this repo:

```bash
claude --plugin-dir ./plugins/liquid-glass-ui
```

Then:

```
/liquid-glass-ui:liquid-glass-web-ui Build a compact mobile onboarding screen.
```

## How this plugin is laid out

The plugin folder is shared with Codex: `plugins/liquid-glass-ui/` contains `.claude-plugin/plugin.json` (which Claude reads) and `.codex-plugin/plugin.json` (which Codex reads). Both manifests point at the same `skills/liquid-glass-web-ui` directory. Claude additionally reads `agents/`; Codex ignores that folder.

## Subagents shipped with the plugin

- `liquid-glass-auditor` — read-only review of generated UI.
- `liquid-glass-implementer` — token-strict implementer.

Both reference the canonical `liquid-glass-web-ui` skill.

## Update

```
/plugin marketplace update liquid-glass-agent-kit
/plugin install liquid-glass-ui@liquid-glass-agent-kit
```

After local skill edits, re-run `/reload-plugins`.
