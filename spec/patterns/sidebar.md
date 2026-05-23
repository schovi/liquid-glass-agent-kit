# Sidebar

Floating Regular-glass source list. The kit codifies the geometry, inset, and section structure so the sidebar reads as "a Mac app" and not "an Electron column."

## Material role

`sidebar`. SwiftUI's `NavigationSplitView` sidebar column auto-applies the system material. AppKit uses `NSVisualEffectView.Material.sidebar`.

On macOS 26 / iOS 26 the *legacy* `.sidebar` material in plain `NSVisualEffectView` setups should be **removed** — its presence prevents the Liquid Glass automatic application. (See anti-pattern A11.)

## Geometry

| Token | Value | Note |
|---|---|---|
| Width — Mac | 220 (min) / 260 (ideal) | resizable; user remembers last width |
| Width — iPad | 320 (default), 384 (regular) | `NavigationSplitView` chooses |
| Window-edge inset | 10 | gap between window outer edge and sidebar outer edge |
| Header height | 32 | sidebar toggle / window controls row |
| Section header height | 28 | secondary subheadline, color subtle |
| Row height | 28 (compact) / 30 (regular) | matches macOS Finder |
| Row padding | 10 horizontal, 4 vertical | |
| Icon column | 22 | small SF Symbol |
| Trailing badge gap | 8 | between label and badge |
| Section gap | 16 | between sibling sections |
| Outer radius | concentric: window outer radius − window padding | usually 28 − 8 = 20 |

## Section structure

Sidebars carry **2–5 sections**. More than five reads as a directory; fewer than two doesn't need a sidebar at all.

```
┌─ Sidebar
│  ┌─ Header  (32 tall: traffic lights, sidebar toggle)
│  │
│  ├─ Section 1
│  │   "Foundations"     ← section heading, 28 tall, subheadline 500
│  │   ● Materials   2   ← row: icon, label, badge
│  │   ● Shape
│  │
│  ├─ Section 2
│  │   "Components"
│  │   ● Buttons
│  │   ● Toolbar
│  │
│  └─ Footer  (avatar + version, 40 tall, optional)
```

## Full-height sidebar window pattern

The "full-height sidebar" window pulls the sidebar up next to the traffic lights. On Mac the recipe is:

- `NSWindow.titlebarAppearsTransparent = true`
- `NSWindow.styleMask.insert(.fullSizeContentView)`
- Traffic lights placed at the top of the sidebar, vertical center aligned to the first row.

In SwiftUI, `NavigationSplitView` with `.toolbarBackground(.hidden, for: .windowToolbar)` and the right window scene modifier achieves the same. (See `window-chrome.md` for the chrome side of this.)

## Allowed surfaces inside

- Section heading (subheadline 13, weight 500, subtle color).
- Row: icon + label + optional badge.
- Disclosure-group rows for hierarchical lists (`OutlineGroup` in SwiftUI).
- Footer with avatar + secondary text (optional).

## Forbidden inside

- Glass surfaces (no glass-on-glass, A1).
- Form rows / text inputs (those belong in the detail pane).
- Action buttons (toolbar's job; if you must, use a single icon-only button bottom-aligned).

## Web approximation

`examples/macos-web/index.html` `.lg-sidebar` + `examples/macos-web/sidebar.js`. The web showcase already implements the inset / radius / row height. CSS variables: `--lg-radius-xl` for the window outer, then `calc(var(--lg-radius-xl) - var(--lg-gap-control))` for the sidebar (concentric).

## Native

- SwiftUI: `NavigationSplitView { Sidebar() } detail: { ... }` with `.listStyle(.sidebar)` inside the sidebar column.
- AppKit: `NSSplitViewController` with the first item's `behavior = .sidebar`.

## Reduced transparency

System-handled on native (the sidebar collapses to an opaque tinted background). Web emits an explicit fallback (`prefers-reduced-transparency`).

## Sources

- [Paul Bancarel — macOS full-height sidebar window](https://medium.com/@bancarel.paul/macos-full-height-sidebar-window-62a214309a80)
- WWDC25 session 323 — "Build a SwiftUI app with the new design"
- HIG — Sidebars chapter
