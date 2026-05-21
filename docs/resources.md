# Liquid Glass — research dossier

Provenance for every non-obvious design rule used by this repo. Compiled from
WWDC25 sessions, Apple Newsroom, Apple developer docs, Apple Support, the HIG
(via session transcripts), and the independent press / community write-ups
that quote them. Cite from here when adding new tokens, components, or rules.

This file is the source of truth for "where did that come from?" The plugin
references it; the HTML showcase references it; the native Swift example
references it.

---

## A. Primary Apple sources

### Marketing and HIG
- [Apple Newsroom — new software design (Liquid Glass)](https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/)
- [Apple Newsroom — macOS Tahoe 26](https://www.apple.com/newsroom/2025/06/macos-tahoe-26-makes-the-mac-more-capable-productive-and-intelligent-than-ever/)
- [Apple Support — What's new in macOS Tahoe 26](https://support.apple.com/en-us/122868)

### WWDC25 sessions
- [Session 219 — Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219/)
  Notes: [wwdcnotes.com](https://wwdcnotes.com/documentation/wwdcnotes/wwdc25-219-meet-liquid-glass/)
- [Session 310 — Build an AppKit app with the new design](https://developer.apple.com/videos/play/wwdc2025/310/)
- [Session 323 — Build a SwiftUI app with the new design](https://developer.apple.com/videos/play/wwdc2025/323/)

### Developer documentation
- [`NSVisualEffectView.Material`](https://developer.apple.com/documentation/appkit/nsvisualeffectview/material)
  — semantic material enum (`sidebar`, `popover`, `menu`, `sheet`, `hudWindow`,
  `headerView`, `windowBackground`, `selection`, `contentBackground`,
  `underWindowBackground`, `underPageBackground`, `fullScreenUI`, `toolTip`,
  `titlebar`). Unchanged since 10.14's semantic refactor; macOS 26 layers
  Liquid Glass on top.
- [`SwiftUI.View.glassEffect(_:in:)`](https://developer.apple.com/documentation/swiftui/view/glasseffect(_:in:))
  — applies Liquid Glass. Default shape: `Capsule`.
- [`SwiftUI.View.glassEffectUnion(id:namespace:)`](https://developer.apple.com/documentation/swiftui/view/glasseffectunion(id:namespace:))
  — manually merge distant glass elements.
- [`SwiftUI.GlassButtonStyle`](https://developer.apple.com/documentation/swiftui/glassbuttonstyle) (`.glass`)
- [`SwiftUI.GlassProminentButtonStyle`](https://developer.apple.com/documentation/swiftui/glassprominentbuttonstyle) (`.glassProminent`)
- [`SwiftUI.ConcentricRectangle`](https://developer.apple.com/documentation/swiftui/concentricrectangle)
  — resolves corner radius from the nearest `.containerShape`.
- [`SwiftUI.CustomizableToolbarContent.sharedBackgroundVisibility(_:)`](https://developer.apple.com/documentation/swiftui/customizabletoolbarcontent/sharedbackgroundvisibility(_:))
  — controls per-item glass background visibility.
- [Sample: Landmarks — Applying a background extension effect](https://developer.apple.com/documentation/SwiftUI/Landmarks-Applying-a-background-extension-effect)

---

## B. Anatomy of a macOS 26 window

### Window chrome
- Traffic-light controls (close / minimize / zoom), top-left, ~12 px circles. Slightly higher in the titlebar than on Sonoma.
  Source: [eclecticlight.co — appearance matters](https://eclecticlight.co/2025/09/15/appearance-matters-get-tahoe-looking-in-better-shape/)
- **Concentric corners**: outer window corner radius is selected to wrap around the inner toolbar pill, so radii align visually.
  Source: [WWDC25 session 310](https://developer.apple.com/videos/play/wwdc2025/310/),
  [lapcatsoftware.com — corner radius variations](https://lapcatsoftware.com/articles/2026/3/4.html)
- The legacy `.sidebar` `NSVisualEffectMaterial` should be **removed** from sidebar view hierarchies on macOS 26 — it blocks the new Liquid Glass treatment from being applied automatically.
  Source: [WWDC25 session 310](https://developer.apple.com/videos/play/wwdc2025/310/)

### Layout spine
- `NSSplitViewController` with sidebar + content + inspector behaviors. Sidebar and inspector pick up Liquid Glass automatically.
- `NSSplitViewItem.behavior = .sidebar` / `.inspector` is the structural hook for Liquid Glass automatic treatment.
- Set `automaticallyAdjustsSafeAreaInsets = true` on the content split item so content extends edge-to-edge under the floating sidebar.
  Source: [WWDC25 session 310](https://developer.apple.com/videos/play/wwdc2025/310/)
- New split-item accessory APIs:
  `addTopAlignedAccessoryViewController` / `addBottomAlignedAccessoryViewController` — these get the **scroll edge effect** automatically.

### Toolbar
- Lives in the unified titlebar region; visually a floating glass pill above content.
- Adjacent items auto-group into a single glass element. Non-interactive items (titles, status) should set `isBordered = false` to drop the glass.
- New (AppKit): `style = .prominent`, `backgroundTintColor`, `NSItemBadge.count` / `.text` / `.indicator`.
- New (SwiftUI): `ToolbarSpacer(_:placement:)` with `.fixed` / `.flexible` sizes splits the shared glass into separate capsules.
  Source: [createwithswift.com — toolbar Liquid Glass](https://www.createwithswift.com/adapting-toolbar-elements-to-the-liquid-glass-design-system/)
- `CustomizableToolbarContent.sharedBackgroundVisibility(_:)` hides per-item glass.
  Source: [Apple docs](https://developer.apple.com/documentation/swiftui/customizabletoolbarcontent/sharedbackgroundvisibility(_:))

---

## C. Materials

### AppKit
- `NSGlassEffectView` — single glass surface. Configurable `cornerRadius`, `tintColor`, `contentView`.
- `NSGlassEffectContainerView` — groups multiple glass elements so they share sampling and fluidly merge during animation.
- `NSBackgroundExtensionView` — mirrors and blurs content underneath floating sidebars / inspectors.
  Source: [WWDC25 session 310](https://developer.apple.com/videos/play/wwdc2025/310/),
  [createwithswift.com](https://www.createwithswift.com/exploring-a-new-visual-language-liquid-glass/)

### SwiftUI
- `.glassEffect(_:in:isEnabled:)` — applies Liquid Glass to a view. `Glass` exposes `.regular`, `.clear`, `.identity`, chainable `.tint(_:)` and `.interactive()`.
- `GlassEffectContainer(spacing:)` — SwiftUI equivalent of `NSGlassEffectContainerView`.
- `.glassEffectUnion(id:namespace:)` — manually merge distant glass elements.
- `.backgroundExtensionEffect()` — SwiftUI equivalent of `NSBackgroundExtensionView`. Mirrors and blurs content outside the safe area so it shows through floating surfaces.
  Sources: [Apple docs](https://developer.apple.com/documentation/swiftui/view/glasseffect(_:in:)),
  [dev.to — GlassEffectContainer](https://dev.to/arshtechpro/understanding-glasseffectcontainer-in-ios-26-2n8p),
  [nilcoalescing — backgroundExtensionEffect](https://nilcoalescing.com/blog/BackgroundExtensionEffectInSwiftUI/)

### Variants
- **Regular** — default. Auto-legible. Use for almost every floating surface.
- **Clear** — more transparent. Only over rich media (photo, video) and with a dim layer behind for safe contrast.
- **Default** vs **Tinted** is a *user* setting (System Settings → Appearance). Tinted increases opacity.
  Source: [Apple Support](https://support.apple.com/en-us/122868)

### What's visually distinctive vs. Sonoma vibrancy
- Edge refraction / lensing at glass rims.
- Specular highlight line tracking geometry.
- Glass gets *thicker* (deeper shadow, stronger lensing) as it grows — e.g. menu emerging from a toolbar button.
- Dynamic tint sampled from content behind.
- Auto-flips appearance with `NSAppearance` light/dark.
  Sources: [Apple Newsroom](https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/),
  [wwdcnotes session 219](https://wwdcnotes.com/documentation/wwdcnotes/wwdc25-219-meet-liquid-glass/)

### Numeric values
Apple publishes **no** numeric blur / saturation / opacity values for Liquid Glass — it's
real-time rendered and adaptive. The web profile in `spec/tokens/material.yaml`
is a community-derived approximation, not a port of internal Apple values.
Source: [Apple Newsroom](https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/) (no numeric specs published).

---

## D. Components

| Component | AppKit | SwiftUI |
|---|---|---|
| Push button (glass) | `NSButton.bezelStyle = .glass`, `borderShape = .capsule` | `.buttonStyle(.glass)` / `GlassButtonStyle` |
| Prominent button | `style = .prominent` + `backgroundTintColor` | `.buttonStyle(.glassProminent)` / `GlassProminentButtonStyle`, `.tint(_:)` for color |
| Segmented control | `NSSegmentedControl` (capsule shape) | `Picker(...).pickerStyle(.segmented)` |
| Search field | `NSSearchField` / `NSSearchToolbarItem` (renders as glass capsule in toolbar) | `.searchable(text:)` |
| Popover | `NSPopover` (material `.popover`) | `.popover(isPresented:)` |
| Menu | `NSMenu` (material `.menu`); redesigned with single-column icon-led rows | `Menu` / `Picker(.menu)` |
| Sidebar / source list | `NSOutlineView` style source-list, rows render directly on glass | `List` inside `NavigationSplitView` |
| Sheet | `NSWindow` sheet (material `.sheet`); morphs in from presenting control | `.sheet(isPresented:)` with `.presentationDetents` — Liquid Glass is automatic |
| Tab view | Floating glass tabs (Safari reference) | `TabView` with new style |
| Slider | `NSSlider` with `neutralValue` | `Slider(value:neutralValue:in:)` |
| Lists / tables | `NSTableView` rows against glass; selection uses material `.selection` | `List` |
| Concentric shape | n/a (manual radius math) | `ConcentricRectangle()` resolves from `.containerShape(...)` |

Sources: [WWDC25 session 310](https://developer.apple.com/videos/play/wwdc2025/310/),
[Apple docs (glass button styles)](https://developer.apple.com/documentation/swiftui/glassbuttonstyle),
[tanaschita.com — glass button styles](https://tanaschita.com/swiftui-glass-button-style/),
[medium / DevTechie — Slider neutralValue](https://medium.com/devtechie/the-ios-26-slider-gets-a-big-upgrade-heres-what-s-new-423a215b898a),
[nilcoalescing — sheets in Liquid Glass](https://nilcoalescing.com/blog/PresentingLiquidGlassSheetsInSwiftUI/),
[nilcoalescing — ConcentricRectangle](https://nilcoalescing.com/blog/ConcentricRectangleInSwiftUI/)

---

## E. SwiftUI toolbar specifics (WWDC25 additions)

- `ToolbarSpacer(.fixed)` / `ToolbarSpacer(.flexible)` — splits a toolbar's shared glass into separate capsules.
  Source: [createwithswift.com](https://www.createwithswift.com/adapting-toolbar-elements-to-the-liquid-glass-design-system/)
- `CustomizableToolbarContent.sharedBackgroundVisibility(_:)` — `.visible`, `.hidden`, `.automatic`.
  Source: [Apple docs](https://developer.apple.com/documentation/swiftui/customizabletoolbarcontent/sharedbackgroundvisibility(_:))
- `ToolbarItemGroup` — explicit group; items inside share one glass background.
- Placements `.confirmationAction` / `.cancellationAction` auto-promote to `.glassProminent` semantics.
  Source: [swiftwithmajid — glassifying toolbars](https://swiftwithmajid.com/2025/07/01/glassifying-toolbars-in-swiftui/)

---

## F. Sheets / presentations

- Liquid Glass on sheets is **automatic** when `.presentationDetents` includes a partial-height detent. Avoid `.presentationBackground(.glass)`; it's redundant.
  Source: [nilcoalescing](https://nilcoalescing.com/blog/PresentingLiquidGlassSheetsInSwiftUI/)
- Sheet morph in from a control: `.matchedTransitionSource(id:in:)` + `.navigationTransition(.zoom(sourceID:in:))`.

---

## G. Concentricity (matched corner radii)

- AppKit: use `safeArea(cornerAdaptation:)` on the content view and pick the toolbar pill / window radii so `outer = inner + inset`. `NSView.LayoutRegion` helps content avoid the rounder corners.
- SwiftUI: `ConcentricRectangle()` reads from the nearest `.containerShape(.rect(cornerRadius:))` so children automatically inset their corners.
  Source: [nilcoalescing — ConcentricRectangle](https://nilcoalescing.com/blog/ConcentricRectangleInSwiftUI/)

---

## H. Where glass goes (and where it does not)

Layer rules from the HIG (per session 219 quotes) and `spec/rules/layout-rules.md`:

**Glass-allowed**
- Top navigation, bottom navigation, tab bar.
- Floating toolbars, action bars.
- Sheets, popovers, menus.
- Floating cards or panels above content.
- Primary action surface (a single highlighted action button).

**Glass-forbidden**
- Page background.
- Long-form text containers.
- Forms and input fields.
- Dense data tables.
- Any element that sits behind another glass element ("glass-on-glass").

---

## I. Accessibility

- Native: `NSAccessibility` flags `reduceTransparency`, `increaseContrast`, `reduceMotion`. AppKit auto-degrades vibrancy when these are on.
- Web: emit `@media (prefers-reduced-transparency: reduce)`, `@media (prefers-contrast: more)`, `@media (prefers-reduced-motion: reduce)`. See `spec/rules/accessibility-rules.md`.

---

## J. Independent reviews & deep-dives

Useful for visual reference and for understanding *how* the material reads in
practice. None are Apple-published; treat them as community interpretation.

- [Six Colors — macOS 26 Tahoe review (power under glass)](https://sixcolors.com/post/2025/09/macos-26-tahoe-review-power-under-glass/)
- [MacStories — macOS 26 Tahoe review](https://www.macstories.net/stories/macos-26-tahoe-the-macstories-review/2/)
- [Eclectic Light Co. — appearance matters in Tahoe](https://eclecticlight.co/2025/09/15/appearance-matters-get-tahoe-looking-in-better-shape/)
- [Lapcat Software — window corner radius variations](https://lapcatsoftware.com/articles/2026/3/4.html)
- [createwithswift.com — exploring Liquid Glass](https://www.createwithswift.com/exploring-a-new-visual-language-liquid-glass/)
- [Conor Luddy — Liquid Glass reference](https://www.conor.fyi/writing/liquid-glass-reference) (also: https://github.com/conorluddy/LiquidGlassReference)
- [Swift with Majid — Glassifying toolbars](https://swiftwithmajid.com/2025/07/01/glassifying-toolbars-in-swiftui/)
- [Doran Gao — Tahoe-style Liquid Glass UI in SwiftUI](https://medium.com/@dorangao/build-a-macos-swiftui-app-with-a-tahoe-style-liquid-glass-ui-fecb8029b2d8)
- [tanaschita — glass button styles](https://tanaschita.com/swiftui-glass-button-style/)
- [DevTechie — iOS 26 Slider upgrades](https://medium.com/devtechie/the-ios-26-slider-gets-a-big-upgrade-heres-what-s-new-423a215b898a)
- [appcircle.io — Build a SwiftUI app with the new design](https://www.appcircle.io/blog/wwdc-25-build-a-swiftui-app-with-the-new-design)
- [Wikipedia — macOS Tahoe](https://en.wikipedia.org/wiki/MacOS_Tahoe)
- [Wikipedia — Liquid Glass](https://en.wikipedia.org/wiki/Liquid_Glass)

---

## K. Representative screenshots

From Apple's official macOS marketing page (`apple.com/os/macos/`). Image
URLs change with site revisions; if a link 404s, navigate via the parent page.

- Liquid Glass hero (widgets over beach):
  https://www.apple.com/v/os/e/images/macos/liquid_glass/liquid_glass_hero__e4g9pjpws8ya_xlarge.jpg
- Transparent menu bar with widgets:
  https://www.apple.com/v/os/e/images/macos/highlights/liquid_glass__f595gw1ozwi2_large.jpg
- Lock-screen Liquid Glass typography:
  https://www.apple.com/v/os/e/images/macos/liquid_glass/design__51h6pg9xusii_large.jpg
- Tinted Liquid Glass app icons:
  https://www.apple.com/v/os/e/images/shared/liquid_glass/app_icons__ghno6awtphe2_large.jpg
- Control Center custom controls:
  https://www.apple.com/v/os/e/images/macos/liquid_glass/controls__djddwinnqlqq_large.jpg
- Redesigned Safari (refreshed apps end frame):
  https://www.apple.com/v/os/e/images/shared/liquid_glass/refreshed_apps_endframe__caoxm8a8obqq_large.jpg
- Spotlight (Messages integration) end frame:
  https://www.apple.com/v/os/e/images/macos/highlights/spotlight_endframe__dp92pp9cet4y_large.jpg
- Phone app on Mac (contact poster, toolbar):
  https://www.apple.com/v/os/e/images/macos/highlights/mac_phone__e2u9ab76th8i_large.jpg
- Three Macs on Tahoe desktop:
  https://www.apple.com/v/os/e/images/macos/welcome/hero_macos_imac_screen_endframe__5l04et7rmtu6_large.jpg

Wikipedia full UI screenshot:
https://upload.wikimedia.org/wikipedia/en/thumb/f/fa/MacOS_Tahoe_screenshot.png/330px-MacOS_Tahoe_screenshot.png

---

## L. Confirmed gaps

These were investigated and not confirmed at the time of writing — do not
guess at API names if you need them, look them up first.

- `backgroundExtensionEffect()` formal parameter list (only the modifier name is documented in the cited sample).
- `presentationCornerRadius` as a *new* Liquid Glass affordance (existing modifier; unclear if its behavior changed).
- A new sidebar list-row API name beyond `List` in `NavigationSplitView`.
- Glass-aware `safeAreaInset` / `safeAreaPadding` behavior — implied, not confirmed by name.
- Programmatic Default-vs-Tinted setting hook (HIG-level user preference; no documented SwiftUI API surface in this pass).

---

## M. House rules

- Never claim "Apple-official" or "Apple-certified". The kit is inspired-by, not endorsed.
- Never invent numeric tokens. New blur / opacity / radius / spacing values go into `spec/tokens/*.yaml` first, then into rendered code.
- Apple ships no portable numeric values for Liquid Glass — the web tokens are a deliberate approximation, documented as such in `spec/tokens/material.yaml`.
