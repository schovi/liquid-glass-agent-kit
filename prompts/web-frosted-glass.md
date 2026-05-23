# Liquid Glass: web frosted-glass prompt

Paste this block once before your UI request in any AI tool: ChatGPT, Claude web, Claude Code, Codex, Cursor, v0, Lovable, Figma Make, Bolt, Windsurf, JetBrains AI, Xcode AI.

This is a **frosted-glass approximation** of Apple's Liquid Glass for the web. It cannot reproduce Apple's real-time backdrop sampling, displacement, or motion-driven parallax. What it can do is enforce the same layout discipline, tokens, and accessibility rules so your output stays consistent across tools and runs.

For a real macOS app with the actual `glassEffect` API, install the `liquid-glass-native` plugin in Claude Code or Codex instead.

---

> You are generating Apple-inspired Liquid Glass web UI. This is a portable web approximation (frosted glass via `backdrop-filter`), not Apple-official and not a render of native Liquid Glass. Follow these rules without exception.
>
> **Token-only.** Never invent blur, saturation, opacity, shadow, padding, or radius values. Use exactly:
>
> - Shape radii: `sm 12px`, `md 16px`, `lg 24px`, `xl 28px`, capsule `9999px`.
> - Spacing: control 8, group 12, panel 16, screen 16 / 24.
> - Regular glass (default): `background rgba(255,255,255,0.70)` (light) or `rgba(16,16,16,0.45)` (dark); `backdrop-filter: blur(40px) saturate(180%)`; border `rgba(255,255,255,0.18)`; shadow `0 8px 32px rgba(0,0,0,0.12)`.
> - Clear glass (rare, requires a dim layer behind): `background rgba(255,255,255,0.18)`; `backdrop-filter: blur(28px) saturate(160%)`; dim `rgba(0,0,0,0.24)`.
> - Reduced-transparency fallback: opaque `rgba(255,255,255,0.92)` / `rgba(20,20,20,0.92)`.
>
> **Component geometry (do not improvise).**
>
> - Button: min-height 44, padding 16/8, icon 18, font 15/600, capsule.
> - Icon button: 44×44, icon 20, capsule.
> - Toolbar: min-height 52, padding 6, gap 4, item 40, icon 20, capsule. Inside one shared capsule, a fixed-width spacer (e.g. `width: 12px`) inserts a hard gap; a flexible spacer (`flex: 1`) splits the capsule into two visually separate groups.
> - Tab bar: height 64, padding 8/6, radius 32, item min-width 56, icon 22, label 11; 2-5 items.
> - Sheet: top radius 28, padding 24, grabber 36×5; backdrop dim 24% black.
> - Card: radius 24, padding 24, gap 12. Glass on cards is optional and only above content.
> - Segmented control: height 32, padding 2, item padding 12/4, capsule; 2-5 items.
> - Text field: min-height 44, padding 12/10, radius 12. **Solid surface, no glass.**
> - Popover: min-width 220, radius 16, padding 8; item padding 10/8, item radius 12. Regular glass.
> - Menu: min-width 200, radius 12, padding 6; item min-height 28, item padding 10/4, item radius 12, shortcut gap 24. Regular glass.
> - Search field (toolbar): min-height 32, padding 12/6, capsule, icon 14. **Solid.** Inline variant: min-height 44, radius 12. May also collapse to a 32×32 icon-only capsule that expands to the full field on focus (web translation of `searchToolbarBehavior(.minimize)`).
> - Toggle: track 38×22 capsule, knob 18 with 2 inset; label gap 12. **Solid track.**
> - Slider: track height 4 capsule, thumb 22 circle, min-width 120. **Solid track**; only the thumb gets glass when system-rendered in a toolbar.
> - Progress: linear height 4 capsule, min-width 120; circular small 16 / medium 24 / large 32, stroke 2. **Solid.**
> - Badge: min-height 20, padding 8/2, capsule, font 12/600. **Solid** — sits on content, never on glass.
>
> **Patterns (always solid).**
>
> - Form rows: `Form` container, `LabeledContent` rows, row gap 12, section gap 24. Glass on a form is forbidden.
> - Inset list: rounded section background, row min-height 32 (compact) / 44 (regular), row padding 12/8. Solid.
> - Disclosure group: header min-height 32, chevron size 12 leading, indent 16 per depth. Solid.
> - Stepper: in a toolbar wrap both buttons in one shared glass capsule (gap 4, button 28 capsule). In a form the stepper is solid.
> - Titlebar accessory: principal toolbar slot, min-height 32, max-width 360. Inherits toolbar glass — do **not** add another glass layer.
> - Floating HUD: capsule (single row) or radius-16 (multi-row) Regular-glass container in `.overlay(alignment: .bottom)`, padding 6, item 40, gap 4, margin 16 from edge. Only over media or canvas — never over forms.
> - Scroll edge effects (web approximation): fade scroll content beneath floating chrome with `mask-image: linear-gradient(...)` on the scroll container. **Soft** = wide gradient (24-32 px transparent band). **Hard** = narrow gradient (4-8 px) or a 1 px solid divider. One style per edge. Never mix soft + hard on adjacent edges of one scroll view. Apply only where chrome actually overlaps that edge — edge effects are not decoration.
> - Morphing (web approximation, single-capsule only): a single glass capsule may animate its width / border-radius and crossfade its contents on state change. Use a CSS `transition` (240 ms `standard` easing) on `width`, `border-radius`, and child `opacity`. Keep the morph inside **one** capsule. **Do not** simulate macOS 26's multi-capsule metaball emergence (one capsule sprouting several with gooey tension between them) with SVG goo filters — that's native-only and the simulation fights `backdrop-filter`.
>
> **System primitives.**
>
> - Alerts, confirmation dialogs, and tooltips are platform-rendered. Use the host platform's dialog / native tooltip. Do not hand-roll a custom alert that mimics the system one.
>
> **Layering.**
>
> - Glass lives in the floating layer only: navigation, toolbars, tab bars, sheets, menus, primary actions.
> - **Background extension.** When a floating sidebar or inspector sits over content, let hero media extend full-bleed under it. The sidebar's `backdrop-filter` does the blending. Don't crop the image at the sidebar edge.
> - **Never glass-on-glass** (F5). No glass element inside another glass element. On macOS 26 / iOS 26 the inner element can fail to render entirely.
> - **Never glass behind body text** (F2), **forms** (F3), **dense tables** (F4), or **page background** (F1). Background-layer glass measurably fails WCAG AA on busy backdrops (NN/g, Infinum). The reduced-transparency fallback is the opaque escape hatch — needing it means you used glass in the wrong place.
> - **Never mix Regular and Clear in one group.**
>
> **Shape.**
>
> - Capsule: `border-radius: 9999px` (equivalent to `height / 2`).
> - Nested shapes are concentric: `child = parent − inset`.
>
> **Budget.**
>
> - Cap live-blurred surfaces per visible pane: 3 recommended (calm) · 5 transient (popover / HUD open) · 6 hard ceiling. Above the ceiling, the auditor fails with `[B1]`. Share sampling or downgrade non-primary surfaces to solid instead of adding more glass.
>
> **Renderer.**
>
> - Default to a CSS renderer using `backdrop-filter` and `-webkit-backdrop-filter`.
> - Mark every glass element with `class="lg-glass lg-glass--regular"` (or `--clear`) and `data-renderer="css"`.
>
> **Accessibility.**
>
> Always emit `@media (prefers-reduced-transparency: reduce)`, `@media (prefers-contrast: more)`, and `@media (prefers-reduced-motion: reduce)` rules. Touch targets ≥ 44×44 px. Focus indicators visible.
>
> **Output discipline.**
>
> - Return the token block once at `:root`, then the requested component(s) using the class hooks above.
> - Do not claim the result is "Apple-official" or "Apple-certified". Call it a "Liquid Glass frosted-glass approximation".
> - Before returning, self-check: no glass-on-glass, no random values, fallbacks present.

---

**Your task starts below this line.**
