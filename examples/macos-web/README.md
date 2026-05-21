# macOS Web showcase

Reference output for the **web Liquid Glass prompt** (`prompts/web-frosted-glass.md`). This is what a competent design-tool AI produces when you paste the prompt before asking for a macOS-style glass UI: titlebar, sidebar, content area, inspector, sheet, controls, typography, motion.

It is **not the kit's source of truth**. The source of truth is `spec/`. This showcase exists so you can:

- See what passing the prompt actually looks like, rendered.
- Run the audit against a known-good target (`npm run audit` runs it against this folder).
- Eyeball-compare your own output against a baseline that already obeys the rules.

## Run it

```bash
npm run example:web      # serves the showcase at http://localhost:8000
```

## Edit discipline

Any change here that touches a token, a component dimension, or a layering rule must come through `.claude/skills/liquid-glass-sync/` so the spec, the inventory doc, the prompt token block, the native plugin references, and the native showcase stay in lockstep.

Single-file CSS or HTML bugs that don't touch the design system can be fixed in place. Run `npm run audit` after.

## What this is not

- Not a starter template. Don't fork it as an app skeleton; it's a static demo.
- Not a 1:1 visual match for Apple's Liquid Glass. Apple's effect samples the backdrop in real time; this is `backdrop-filter` frosted glass.
- Not the iOS profile. iOS-style tab bars and bottom navigation are described in the prompt but not rendered here (this showcase is the macOS context).
