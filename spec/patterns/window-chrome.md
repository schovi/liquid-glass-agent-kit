# Window chrome

The numbers that separate "credible Mac app" from "Electron with a blur filter": titlebar height, traffic-light vertical alignment, sidebar inset, outer corner radius. Amateurs guess these; the system has specific answers.

## Outer geometry

| Token | Value |
|---|---|
| Window outer corner radius | 28 (xl) |
| Window padding (between outer edge and sidebar / content) | 8 (controlGap) |
| Window minimum width — narrow shell | 720 |
| Window minimum width — sidebar + content | 920 |
| Window minimum width — sidebar + content + inspector | 1180 |

The 28 outer radius wraps **concentrically** around the inner toolbar pill: 28 outer, 8 padding, 20 pill outer radius. Pick `Tokens.Radius.xl` for the window and let the inner concentric resolve from there (`ConcentricRectangle()` in SwiftUI).

## Titlebar

| Variant | Height | Use |
|---|---|---|
| Unified with toolbar | 52 | Default. Toolbar items inhabit this row. |
| Standalone (no toolbar) | 28 | Document windows with no tools. |
| Tabbed | 76 | Window has tab bar above the toolbar. Rare in macOS 26 apps. |

The titlebar is a transparent strip; toolbar items inside are individual glass capsules (Regular). Material role for the strip itself is `toolbar` — the chrome layer sits at the top of the window.

## Traffic lights

The three window-control circles (close / minimize / zoom):

- 12 × 12 each, capsule shape.
- 8 px gap between them.
- Cluster origin: 14 px from window left edge.
- **Vertical center = center of the first sidebar row.** This is the rule amateurs miss most often.

When using `fullSizeContentView` + `titlebarAppearsTransparent`, the system continues to draw the traffic lights at their default position; align the first sidebar row to match. In SwiftUI with `NavigationSplitView` this is automatic; in AppKit set the sidebar's top padding so the first row's center sits at the titlebar's vertical midpoint.

## Full-size content view

The "modern Mac app" look pulls content under the titlebar:

```swift
// SwiftUI
@main struct MyApp: App {
    var body: some Scene {
        WindowGroup { ContentView() }
            .windowToolbarStyle(.unified(showsTitle: true))
            .windowStyle(.titleBar)
    }
}
```

```swift
// AppKit
window.titlebarAppearsTransparent = true
window.styleMask.insert(.fullSizeContentView)
window.toolbarStyle = .unified
```

This combination gives:

- Glass titlebar / toolbar with the underlying content sampled through it.
- Sidebar pulled up to the traffic lights.
- Outer 28 radius wrapping everything.

## Sidebar inset

10 px between the window outer edge and the sidebar outer edge. Inside the inset:

- Top: sidebar header row (traffic-light height).
- Bottom: sidebar footer row (optional).
- Inner content: sections and rows.

The inset gives the sidebar room to breathe; without it the glass merges with the window edge and reads as "an opaque panel," not a floating sidebar.

## Toolbar inside the chrome

See `spec/components/toolbar.yaml` for toolbar item geometry. Placement inside the unified titlebar:

- Items group into one shared glass capsule by default.
- `ToolbarSpacer(.fixed)` keeps the capsule shared with a fixed gap.
- `ToolbarSpacer(.flexible)` splits the capsule into two visually separate groups.
- `.sharedBackgroundVisibility(.hidden)` on a prominent item opts that item out of the shared background so its tint reads cleanly.

## Subtitle

When the window needs a subtitle (count, status, breadcrumb), use:

```swift
.navigationTitle("Inbox")
.navigationSubtitle("142 unread")
```

The subtitle renders at a smaller weight to the right of the title. For larger app titles, use `ToolbarItem(placement: .largeSubtitle)` in SwiftUI to place a custom view there.

## Web approximation

`examples/macos-web/index.html` `.lg-window` + `.lg-titlebar` + `.lg-traffic-lights`. The showcase ships the 28 outer radius, the 8 padding, and the traffic-light cluster size. Concentric sidebar radius resolves to `calc(var(--lg-radius-xl) - var(--lg-gap-control))`.

## What an amateur gets wrong

- **Random outer radius.** 16 or 20 reads as "iOS sheet"; macOS 26 wants 28.
- **Sidebar flush against the window edge.** Drop the 10 px inset and the sidebar reads as a panel, not floating.
- **Traffic lights aligned to titlebar center.** They belong aligned to the first sidebar row, which is *below* the titlebar's text baseline.
- **Two `.toolbar` modifiers in different ancestors.** Anti-pattern A13; the second toolbar is silently dropped or duplicates the first.
- **Removing window chrome to "make it cleaner".** macOS users navigate by the traffic lights and titlebar text. Removing them hides standard affordances.

## Sources

- [Paul Bancarel — macOS full-height sidebar window](https://medium.com/@bancarel.paul/macos-full-height-sidebar-window-62a214309a80)
- [Mario Aguzman — Toolbar Guidelines](https://marioaguzman.github.io/design/toolbarguidelines/)
- WWDC25 session 323 — "Build a SwiftUI app with the new design"
- HIG — Window Anatomy
