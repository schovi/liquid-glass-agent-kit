# Titlebar accessory

Custom view in the principal toolbar slot — typically a segmented
control, breadcrumb, or path bar. Inherits the unified toolbar's glass
treatment; the accessory itself does not add another glass layer.

## Geometry

- Min-height: 32 (matches toolbar item height).
- Max-width: 360. Wider accessories belong below the titlebar.
- Padding inside accessory: 4 horizontal, 0 vertical (the toolbar
  provides the outer padding).
- Gap to neighboring toolbar items: handled by `ToolbarSpacer`.

## Apple APIs

- SwiftUI: `ToolbarItem(placement: .principal) { ... }` inside `.toolbar`.
- AppKit: `NSTitlebarAccessoryViewController` attached to the
  window controller, layout attribute `.top`.

## SwiftUI

```swift
.toolbar {
    ToolbarItem(placement: .principal) {
        Picker("View mode", selection: $mode) {
            ForEach(ViewMode.allCases) { Text($0.label).tag($0) }
        }
        .pickerStyle(.segmented)
    }
    ToolbarSpacer(.flexible)
    ToolbarItem { /* primary action */ }
}
```

## AppKit

```swift
let accessory = NSTitlebarAccessoryViewController()
accessory.view = customView
accessory.layoutAttribute = .top
window.addTitlebarAccessoryViewController(accessory)
```

## Forbidden

- Adding `.glassEffect` to the accessory itself — the toolbar already
  applies the shared glass background (A1: glass-on-glass).
- Putting body text in the accessory. It is navigation, not content.
- Stacking two accessories in `.principal` — only one principal slot
  per toolbar.

## Caveats

- The accessory shrinks and elides ahead of the primary action when
  the window narrows. Test at the minimum window width.
- A path bar accessory needs `.sharedBackgroundVisibility(.hidden)`
  on adjacent prominent buttons to keep their capsules from merging
  into the accessory's shared background.
