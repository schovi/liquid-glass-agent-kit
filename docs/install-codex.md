# Install for Codex

## Marketplace install (recommended)

```bash
codex plugin marketplace add OWNER/liquid-glass-agent-kit --sparse .agents/plugins plugins/liquid-glass-web
```

Open Codex and run:

```
/plugins
```

Install **Liquid Glass Web UI**.

## Repo-local skill install (no plugin)

If you want the skill in a single repo without committing a plugin install, copy the canonical skill into the repo's local skill scan path:

```bash
mkdir -p .agents/skills
cp -R path/to/liquid-glass-agent-kit/plugins/liquid-glass-web/skills/liquid-glass-web-ui .agents/skills/
```

Codex scans `.agents/skills` from the current directory up to the repo root.

## Usage

```text
$liquid-glass-web-ui Build a settings screen in plain HTML/CSS.
$liquid-glass-web-ui Audit this component for Liquid Glass mistakes.
$liquid-glass-web-ui Translate this Tailwind file to the Liquid Glass token set.
```

You can also invoke it implicitly — Codex selects the skill from its description when the user asks for "Liquid Glass web UI", "iOS 26 glass style", or "glass tokens". For native SwiftUI / AppKit code, install the sibling plugin `liquid-glass-native`.

## How this plugin is laid out

The plugin folder is shared with Claude: `plugins/liquid-glass-web/` contains `.codex-plugin/plugin.json` (which Codex reads) and `.claude-plugin/plugin.json` (which Claude reads). Both manifests point at the same `skills/` directory.

## Update

After the upstream repo changes, refresh the marketplace:

```bash
codex plugin marketplace update liquid-glass-agent-kit
```

Then reinstall the plugin.
