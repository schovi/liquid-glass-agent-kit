# Liquid Glass Agent Kit

Build Apple-inspired Liquid Glass web UI with AI agents, plugins, copy-paste prompts, or local tooling.

The kit ships **one canonical spec** plus **one shared plugin** that serves both Codex and Claude Code from the same skill folder. The goal is to stop agents from inventing random blur, radius, shadow, and spacing values.

## Choose your path

| I use…                                                       | Recommended path                              |
| ------------------------------------------------------------ | --------------------------------------------- |
| Codex                                                        | Install the plugin                            |
| Claude Code                                                  | Install the plugin                            |
| ChatGPT, Claude web, v0, Lovable, Figma Make, Bolt, Cursor   | Paste the compact prompt                      |
| A frontend repo with normal Node tooling                     | Run the audit script in CI                    |

## What this is

A portable Liquid Glass Web Profile:

- component sizes
- shape rules
- material approximation tokens (CSS / SVG / WebGL)
- renderer recipes
- accessibility rules
- a heuristic auditor

## What this is not

- Not an Apple-official design system.
- Not a native SwiftUI replacement.
- Not a 1:1 copy of Apple's private rendering internals.

## Quick start

### Codex

```bash
codex plugin marketplace add OWNER/liquid-glass-agent-kit --sparse .agents/plugins plugins/liquid-glass-ui
```

Open Codex and run `/plugins`. Install **Liquid Glass UI**, then:

```text
$liquid-glass-web-ui Build a settings screen in plain HTML/CSS.
```

### Claude Code

```bash
claude plugin marketplace add OWNER/liquid-glass-agent-kit --sparse .claude-plugin plugins/liquid-glass-ui
/plugin install liquid-glass-ui@liquid-glass-agent-kit
```

Then:

```text
/liquid-glass-ui:liquid-glass-web-ui Build a compact mobile onboarding screen.
```

### Copy/paste

Open `prompts/copy-paste-compact.md` and paste it before your request.

### Audit

```bash
node plugins/liquid-glass-ui/skills/liquid-glass-web-ui/scripts/audit-liquid-glass-html.mjs path/to/output
```

## Layout

```
spec/                                    canonical source of truth (tokens, components, rules, schemas)
plugins/liquid-glass-ui/                 ONE plugin, shared by Codex and Claude
├── .codex-plugin/plugin.json            Codex manifest (skills = "./skills/")
├── .claude-plugin/plugin.json           Claude manifest
├── skills/liquid-glass-web-ui/          ONE skill (SKILL.md + references + audit script)
└── agents/                              Claude subagents (Codex ignores)
.agents/plugins/marketplace.json         Codex marketplace catalog
.claude-plugin/marketplace.json          Claude marketplace catalog
prompts/                                 copy/paste prompt for plugin-less tools
examples/vanilla-html/                   reference HTML/CSS that passes the audit
docs/                                    install + usage docs
```

Why one folder? Codex reads `.codex-plugin/`, Claude reads `.claude-plugin/`. Their dotfiles do not collide, so a single plugin folder can serve both without duplicating skills or agents.

## Editing

Edit only:

- `spec/`
- `plugins/liquid-glass-ui/skills/liquid-glass-web-ui/`
- `plugins/liquid-glass-ui/agents/` (Claude-only)
- `prompts/copy-paste-compact.md`
- `examples/`
- `docs/`

There is no build step.

## License

MIT. See `LICENSE`.
