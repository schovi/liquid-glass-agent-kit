# Scroll edge effects

How scrolling content fades or hardens beneath floating chrome
(toolbar, sidebar, inspector). New on macOS 26 / iOS 26.

This is a native-only pattern. The web profile has no equivalent — CSS
`mask-image` gradients are the closest analog but they do not match the
system treatment and are not part of the kit.

## When to use

The edge effect is applied to a scrollable container, **not** to the
chrome. The chrome already paints Liquid Glass; the edge effect controls
how content underneath it transitions at the edge.

- **Soft** — gentle fade. The default on iOS / iPadOS and for most macOS
  scrolling content.
- **Hard** — stronger boundary. Used on macOS for pinned headers, text
  controls, and inspector panes where the edge needs to read as a clear
  shelf.

## Apple APIs

- SwiftUI: `.scrollEdgeEffectStyle(_:for:)` on a `ScrollView`, `List`, or
  `TextEditor`. Edges: `.top`, `.bottom`, `.leading`, `.trailing`, or
  `.all`. Styles: `.soft` (default), `.hard`.
- AppKit: per-edge accessors on `NSScrollView` — `topEdgeEffect`,
  `bottomEdgeEffect`, `leftEdgeEffect`, `rightEdgeEffect`. Each carries
  a `.style` (`.soft` / `.hard`) and `.isHidden`.

## SwiftUI

```swift
ScrollView { ... }
    .scrollEdgeEffectStyle(.hard, for: .top)
```

## AppKit

```swift
scrollView.topEdgeEffect.style = .hard
scrollView.leftEdgeEffect.isHidden = true
```

## Rules

- **One style per edge.** Never stack two scroll edge styles on the same
  edge of the same view.
- **Never mix soft and hard on adjacent edges of one scroll view.** The
  visual language reads as one boundary character — pick one.
- **Only where it does work.** Edge effects are not decoration. Apply
  one only where a floating chrome element actually sits at that edge.
  An edge effect on a scroll view with no overlapping chrome is noise.

## Forbidden

- Painting your own gradient mask on the scroll content "to look like"
  an edge effect — the system effect is sampled, not blended.
- Adding a `.hard` edge to a sidebar list to make it "feel more macOS".
  Sidebars already get the correct treatment from `NavigationSplitView`
  / `NSSplitViewItem.behavior = .sidebar`.
- Hiding the system edge effect to reintroduce a legacy
  `.headerView`-style backdrop. The new treatment replaces the legacy
  one — do not double-paint.

## Caveats

- Reduced Transparency collapses the soft effect to a thin solid line.
  Hard edge becomes a solid divider. Do not branch on
  `accessibilityReduceTransparency` to add a manual divider — the system
  already inserts one.
- The effect samples the scroll content, so `.backgroundExtensionEffect`
  on the content view interacts with it. Place
  `.backgroundExtensionEffect` on the *underlying* hero view, never on
  the chrome.
- Inspector and sidebar columns of `NavigationSplitView` apply hard
  edges to their toolbars automatically on macOS 26. Adding
  `.scrollEdgeEffectStyle(.hard, for: .top)` inside the column is
  redundant.
