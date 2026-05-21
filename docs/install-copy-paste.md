# Copy/paste use

For tools that cannot install plugins or read local skill folders: ChatGPT, Claude web, v0, Lovable, Figma Make, Bolt, Cursor chat, and similar.

## Compact prompt

Open `prompts/copy-paste-compact.md` and paste its contents into your chat **before** your UI request.

## Recommended format

```
Use the Liquid Glass Web UI skill below for this task:

<paste prompts/copy-paste-compact.md>

Task:
Build a settings screen with a bottom tab bar and a floating action button.
```

## What you get

- Token-only material values (blur, saturation, shadow, radius).
- Component geometry locked to the spec (44 px touch targets, 64 px tab bar, capsule = 9999px).
- Required `prefers-reduced-transparency`, `prefers-contrast`, and `prefers-reduced-motion` fallbacks.
- A self-check pass before the model returns code.

## Auditing what you get back

Paste the generated HTML/CSS into a file, then:

```bash
node plugins/liquid-glass-web/skills/liquid-glass-web-ui/scripts/audit-liquid-glass-html.mjs ./generated.html ./generated.css
```

The auditor exits non-zero on any anti-pattern.
