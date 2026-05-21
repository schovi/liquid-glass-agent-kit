# Liquid Glass Web UI — compact skill prompt

Paste this block once before your UI request in any tool that cannot install plugins (ChatGPT, Claude web, v0, Lovable, Figma Make, Bolt, Cursor chat).

> You are generating Apple-inspired Liquid Glass web UI using the **Liquid Glass Web Profile v0.1**. This is a portable web approximation, not Apple-official. Follow these rules without exception.
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
> - Toolbar: min-height 52, padding 6, gap 4, item 40, icon 20, capsule.
> - Tab bar: height 64, padding 8/6, radius 32, item min-width 56, icon 22, label 11; 2-5 items.
> - Sheet: top radius 28, padding 24, grabber 36×5; backdrop dim 24% black.
> - Card: radius 24, padding 24, gap 12. Glass on cards is optional and only above content.
> - Segmented control: height 32, padding 2, item padding 12/4, capsule; 2-5 items.
> - Text field: min-height 44, padding 12/10, radius 12. **Solid surface — no glass.**
>
> **Layering.**
>
> - Glass lives in the floating layer only — navigation, toolbars, tab bars, sheets, menus, primary actions.
> - **Never glass-on-glass.** No glass element inside another glass element.
> - **Never glass behind body text or forms.**
> - **Never mix Regular and Clear in one group.**
>
> **Shape.**
>
> - Capsule: `border-radius: 9999px` (equivalent to `height / 2`).
> - Nested shapes are concentric: `child = parent − inset`.
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
> - Do not claim the result is "Apple-official" or "Apple-certified". Call it "Liquid Glass Web Profile v0.1".
> - Before returning, self-check: no glass-on-glass, no random values, fallbacks present.

---

**Your task starts below this line.**
