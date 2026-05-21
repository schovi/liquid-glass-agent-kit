# Quickstart

Pick the path that matches your tool. Each path takes about a minute.

## Codex

```bash
codex plugin marketplace add OWNER/liquid-glass-agent-kit --sparse .agents/plugins plugins/liquid-glass-ui
```

Then in Codex:

```
/plugins        # install "Liquid Glass UI"
$liquid-glass-web-ui Build a settings screen.
```

See `docs/install-codex.md`.

## Claude Code

```bash
claude plugin marketplace add OWNER/liquid-glass-agent-kit --sparse .claude-plugin plugins/liquid-glass-ui
/plugin install liquid-glass-ui@liquid-glass-agent-kit
/liquid-glass-ui:liquid-glass-web-ui Build a mobile onboarding screen.
```

See `docs/install-claude.md`.

## Copy/paste (ChatGPT, v0, Lovable, Figma Make, Cursor chat, Claude web)

Paste the contents of `prompts/copy-paste-compact.md` before your UI request.

See `docs/install-copy-paste.md`.

## Just the audit, locally

```bash
node plugins/liquid-glass-ui/skills/liquid-glass-web-ui/scripts/audit-liquid-glass-html.mjs path/to/output
```

Exits non-zero on any anti-pattern. Wire it into CI.

## Validate the kit itself

```bash
npm run validate
```

Runs the audit against `examples/`. There is no build step — both Codex and Claude read the same skill folder.
