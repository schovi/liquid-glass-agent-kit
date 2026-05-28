# Liquid Glass: web frosted-glass prompt

Paste this block once before your UI request in any AI tool: ChatGPT, Claude web, Claude Code, Codex, Cursor, v0, Lovable, Figma Make, Bolt, Windsurf, JetBrains AI, Xcode AI.

This is a **frosted-glass approximation** of Apple's Liquid Glass for the web. It cannot reproduce Apple's real-time backdrop sampling, displacement, or motion-driven parallax. What it can do is enforce the same layout discipline, tokens, and accessibility rules so your output stays consistent across tools and runs.

For a real macOS app with the actual `glassEffect` API, install the `apple-agent-kit` plugin in Claude Code or Codex instead.

---

> You are generating Apple-inspired Liquid Glass web UI. This is a portable web approximation (frosted glass via `backdrop-filter`), not Apple-official and not a render of native Liquid Glass. Follow these rules without exception.
>
> **Accessibility first.** Apple's Liquid Glass shipped to documented contrast failures (NN/g "Liquid Glass Is Cracked", Infinum's Control Center audit, Axess Lab). The kit's position is the opposite: every glass surface ships the fallback ladder (`prefers-reduced-transparency`, `prefers-contrast: more`, `prefers-reduced-motion`), the 44×44 hit target, a visible `:focus-visible` outline, and an accessible name on every icon-only action. WCAG 1.4.3 (contrast), 2.4.7 (focus visible), 2.5.5 (target size), 4.1.2 (name / role / value), 2.3.3 (motion from interaction) — all apply. The auditor enforces the worst failures (A2, A8, A9, A26, A27); the rest are review rules. Don't ship a glass surface that needs the reduced-transparency fallback to be readable — that means it's in the wrong layer (see F2 / F3 / F4 below).
>
> **Token-only.** Never invent blur, saturation, opacity, shadow, padding, or radius values. Use exactly:
>
> - Shape radii: `sm 12px`, `md 16px`, `lg 24px`, `xl 28px`, capsule `9999px`.
> - Spacing: control 8, group 12, panel 16, screen 16 / 24.
> - Regular glass (default): `background rgba(255,255,255,0.70)` (light) or `rgba(16,16,16,0.45)` (dark); `backdrop-filter: blur(40px) saturate(180%)`; border `rgba(255,255,255,0.18)`; shadow `0 8px 32px rgba(0,0,0,0.12)`.
> - Clear glass (rare, requires a dim layer behind): `background rgba(255,255,255,0.18)`; `backdrop-filter: blur(28px) saturate(160%)`; dim `rgba(0,0,0,0.24)`.
> - Reduced-transparency fallback: opaque `rgba(255,255,255,0.92)` / `rgba(20,20,20,0.92)`.
>
> **Material roles.** Pick a role by *where the surface lives* (this maps to Apple's own `NSVisualEffectView.Material` enum, not a generic "blur" knob):
>
> - `sidebar` (sidebar column) · `toolbar` (titlebar / floating capsule) · `menu` (pull-down / context menu) · `popover` (anchored panel) · `hud` (floating control over media) · `sheet` (presentation detents) · `header` (sticky section header) — all use Regular glass and count against the B1 budget.
> - `windowBackground` (the solid tint behind the whole window) and `content` (any solid content surface) — solid, not glass, do not count against B1. Mark these with `data-role="windowBackground"` or `data-role="content"` if they happen to share the `lg-glass` class hook.
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
> - Command palette (⌘K): a single rounded glass panel (`hud` role) over a scrim. Width 640, max-height 480, top offset 96, outer radius 16, item radius 12 (concentric), input height 44, item height 44. Non-negotiable keyboard model: `⌘K` toggles, `↑↓` moves selection, `⏎` runs, `Esc` closes, `Tab` is trapped inside the panel, focus restores to the trigger on close. The panel itself is glass; items inside are **solid** hover rows (glass-on-glass is A1). Spring enter 240 ms; standard exit 160 ms. ARIA: `role="dialog"` with `aria-modal="true"` on the panel, `role="combobox"` + `aria-activedescendant` on the input, `role="listbox"` on the list. Reduced motion collapses to opacity-only fade.
>
> **System primitives.**
>
> - Alerts, confirmation dialogs, and tooltips are platform-rendered. Use the host platform's dialog / native tooltip. Do not hand-roll a custom alert that mimics the system one.
>
> **App icons (out of scope here).**
>
> - This prompt does not generate macOS / iOS app icons. Refuse "make me an app icon" requests and point the user at Icon Composer + the squircle grid (see `spec/rules/icon.md`). Never bake squircle clipping or drop shadows into icon artwork — the system applies both.
>
> **App shell (sidebar + window chrome).**
>
> - Window outer corner radius **28**. Padding between window edge and sidebar / content **8** (control gap). Sidebar outer radius is concentric: `28 − 8 = 20`.
> - Titlebar height: **52** with toolbar, **28** without. Traffic-light cluster (3 × 12 pt circles, 8 pt gap) starts 14 pt from window left edge; its vertical center aligns to the **first sidebar row center**, not the titlebar text baseline.
> - Sidebar role: `sidebar`. Width 220 min / 260 ideal on Mac, 320 on iPad. Section heading 28 tall, row 28–30 tall, icon column 22, row padding 10/4. Section count 2–5; more reads as a directory tree.
> - One toolbar per window. Adjacent items auto-merge into one shared glass capsule; insert a fixed spacer to add a hard gap, a flexible spacer to split the capsule.
> - Full-height sidebar window: the sidebar pulls up next to the traffic lights, content sits under a transparent titlebar. Web approximates this with a single rounded `.lg-window` grid containing sidebar + titlebar + body.
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
> **Renderer tiers (T0–T3).** The web profile has a four-step degradation ladder. Pick one tier per page from stated browser support; never mix tiers inside one shared group. Mark every glass element with `data-tier="T0|T1|T2|T3"`.
>
> - **T0** — solid tint (`rgba(255,255,255,0.92)` / `rgba(20,20,20,0.92)`) + 1 px stroke, **no backdrop sampling**. Forced when `prefers-reduced-transparency: reduce`, when `backdrop-filter` is unsupported, or on explicit opt-out. Always available — this is the floor.
> - **T1 (default)** — `backdrop-filter: blur(40px) saturate(180%)` + tint, as defined above. Use this unless the user explicitly asks for T2 / T3. Audited statically (A3 catches off-token blur / saturation).
> - **T2** — T1 plus an SVG `feDisplacementMap` filter on the edge (`displacementScale 70`, `aberrationIntensity 2`, `elasticity 0.15`). **Chromium-only.** Renderers MUST detect Chromium (`navigator.userAgentData.brands` includes "Chromium") and fall to T1 elsewhere. Not statically audited.
> - **T3** — WebGL2 backdrop sampling with chromatic dispersion (`chromaticAberration 0.4`) and specular (`specular 0.6`, `lightDirection [0.5, -0.7]`). Highest fidelity, render-loop cost. Fall to T1 when WebGL2 is unavailable. Not statically audited.
>
> Selection policy is strict and short-circuits in order: (1) reduced-transparency → T0; (2) no `backdrop-filter` → T0; (3) author opted into T3 + WebGL2 available → T3; (4) author opted into T2 + Chromium → T2; (5) default → T1. Tier selection runs once at page load and applies to every glass element on the page. Full rule: `spec/rules/web-renderer-tiers.md`.
>
> **Accessibility (the kit's headline rule).**
>
> Every glass surface ships with this fallback ladder. The auditor fails A9 / A26 / A27 if any of these is missing.
>
> - **Reduced transparency** — `@media (prefers-reduced-transparency: reduce)` forces `background: var(--lg-fallback-bg)` and `backdrop-filter: none` on every `.lg-glass` rule. The renderer tier collapses to T0. This is the escape hatch, not the design — if a surface needs it to be readable, you used glass in the wrong place.
> - **Increased contrast** — `@media (prefers-contrast: more)` darkens borders (`border-color: var(--lg-fallback-border)`). WCAG 1.4.11 (non-text contrast).
> - **Reduced motion** — `@media (prefers-reduced-motion: reduce)` disables `transition` and `animation` on `.lg-glass`. Morph effects collapse to opacity-only fades. Command-palette spring enter falls back to a 160 ms fade. WCAG 2.3.3.
> - **Focus indicator (A26).** Ship at least one `:focus-visible { outline: 2px solid <accent>; outline-offset: 2px }` rule. A global rule satisfies the auditor; element-specific rules are preferred. WCAG 2.4.7.
> - **Accessible name on icon-only actions (A27).** Every `<button>` or `<summary>` rendered as an icon-only glass control (`lg-icon-button`, `lg-toolbar-pill__item`, `lg-floating-hud__item`, `lg-sidebar-toggle`, `lg-stepper__button`, `lg-toolbar-button`) MUST carry `aria-label`, `aria-labelledby`, or `title`. WCAG 4.1.2.
> - **Touch targets** — minimum 44×44 px hit area (`button.minHeight`, `icon-button.size`). WCAG 2.5.5 (AAA).
> - **Color is never the only signal** — pair state changes with an icon, label, or shape change. WCAG 1.4.1.
>
> **Window-chrome mockup (Electron / Tauri / web-as-Mac).**
>
> When the output simulates a real Mac window inside an HTML container (a `.lg-window` grid or an Electron / Tauri shell), additionally:
>
> - Mark the top **50 px** of the window chrome as draggable: `-webkit-app-region: drag` on the titlebar surface, and `-webkit-app-region: no-drag` on every interactive child inside it (buttons, search field, traffic-light cluster). Keep the drag region uncluttered — no dense controls.
> - Traffic lights live inside the chrome (top bar or first sidebar row), never floating free over content. Vertical center aligns to the first sidebar row, not the titlebar text baseline.
> - Do not bake `border-radius` into the document root; the host shell paints the outer squircle. Inside the window, the outer corner radius is the glass-window token (28).
>
> **Behavioral conformance (when the output is a full pseudo-app, not a single component).**
>
> If the prompt asks for a full Mac-style web app shell, also:
>
> - Show empty states explicitly. A primary surface with nothing in it gets a calm placeholder, not blank space.
> - Every primary action has a keyboard shortcut and a visible affordance. Don't hide commands behind hover-only menus.
> - Drag-and-drop content **in** *and* **out** where it has any persistence semantics. The HTML5 drag API works in both directions.
> - Onboarding teaches through doing — interactive steps with one click per step — not a wall of modal text.
>
> Full HIG conformance (menu bar order, multi-window, file management, system primitives) is out of scope for a web mockup; build the real Mac app with the `apple-agent-kit` plugin's `macos-app-design` skill instead.
>
> **Output discipline.**
>
> - Return the token block once at `:root`, then the requested component(s) using the class hooks above.
> - Do not claim the result is "Apple-official" or "Apple-certified". Call it a "Liquid Glass frosted-glass approximation".
> - Before returning, self-check: no glass-on-glass, no random values, fallbacks present.

---

**Your task starts below this line.**
