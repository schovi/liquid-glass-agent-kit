# Menu bar extra (status item)

A persistent app surface anchored to the system menu bar. The right
hand side of every Mac. Apps like Bartender, Things, Fantastical,
1Password, and Raycast use it as their primary affordance.

Liquid Glass is not the material for this surface — the menu bar's
backdrop is system-owned and a custom glass overlay never matches.
The kit codifies the surface anyway because a Mac craft kit without
menu-bar guidance is incomplete.

## When to use

- The app needs to be reachable when its window is closed (clipboard
  manager, password vault, music control, system metric).
- The app's main job is a recurring quick action (Bartender's icon
  toggle, Raycast's launch).
- The app is a "menu-bar only" utility with no main window (Bartender,
  Itsycal).

## When NOT to use

- The app's primary surface is a document window (Mail, Notes, Xcode).
  A menu-bar item without a job is clutter.
- The action belongs in the Dock (long-running background processes
  that need quit / hide controls — that's a Dock app).
- The status indicator changes faster than once per second (battery
  meter at 0.1 s — that's animation in the menu bar, which violates
  HIG calmness).

## Geometry

| Token                       | Value                       | Note                                                            |
| --------------------------- | --------------------------- | --------------------------------------------------------------- |
| Status item icon size       | 16 pt (16×16 template)      | Template image; Apple's HIG forbids tinted icons here           |
| Status item width           | system-decided              | Don't pin a width; system handles spacing                       |
| Popover panel width         | 320 (compact) / 360 / 400   | `MenuBarExtra` `.window` style — feels native at 320–400        |
| Popover panel max-height    | 480                         | Above this users expect a full window — open one instead        |
| Popover inset from menu bar | 6 (system applies)          | Don't add your own; the system arrow / shadow handles it        |
| Material                    | system-owned (Regular glass) | Don't override                                                  |

## SwiftUI recipe

```swift
@main
struct ClipboardApp: App {
    var body: some Scene {
        MenuBarExtra("Clipboard", systemImage: "doc.on.clipboard") {
            ClipboardPanel()
        }
        .menuBarExtraStyle(.window)        // .window for rich UI, .menu for a list
    }
}
```

Key style choice:

- `.menuBarExtraStyle(.menu)` — a native pull-down menu. Lightweight,
  keyboard-driven, free accessibility. Pick this for "a list of
  actions."
- `.menuBarExtraStyle(.window)` — a popover panel that can host
  arbitrary SwiftUI. Pick this for rich UI (live data, search,
  multi-section panels).

Mixing both styles in one app is fine — separate `MenuBarExtra`
scenes are allowed.

## AppKit recipe

```swift
let statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
statusItem.button?.image = NSImage(systemSymbolName: "doc.on.clipboard", accessibilityDescription: "Clipboard")
statusItem.button?.image?.isTemplate = true                    // critical — see anti-patterns
statusItem.button?.action = #selector(togglePanel(_:))
statusItem.button?.target = self
```

For a popover panel, attach an `NSPopover` to the button's view:

```swift
let popover = NSPopover()
popover.contentSize = NSSize(width: 360, height: 420)
popover.behavior = .transient
popover.contentViewController = NSHostingController(rootView: ClipboardPanel())
```

## Anti-patterns

- **Custom-tinted status icon.** The template image MUST be black with
  `isTemplate = true`. The system inverts for dark mode and accent
  tinting. A custom-colored icon clashes with neighboring status
  items.
- **Glass on glass over the menu bar.** Don't try to layer a custom
  glass panel under the popover — the system already provides the
  material. Anti-pattern F5.
- **Animated status icon.** No spinners, no auto-updating progress
  rings in the menu bar. Use a notification or a Dock icon badge for
  state changes. (Itsycal's date display updating once per minute is
  fine; once per second is not.)
- **Required menu bar for core features.** The menu-bar item is an
  affordance, not the only path. Core features must also be reachable
  from a window, keyboard shortcut, or URL scheme.
- **Hover popover.** macOS menu-bar items respond to click, not
  hover. Don't simulate a hover behavior — it conflicts with
  Bartender / iStat-style hide tools.

## Keyboard

- A `MenuBarExtra` with `.menu` style honors the `keyboardShortcut`
  modifier on each item.
- A `MenuBarExtra` with `.window` style does NOT receive global
  keyboard focus until the user clicks the icon. To make the panel
  globally reachable, register a system-wide hotkey
  (`KeyboardShortcuts` package or `Carbon` `RegisterEventHotKey`) and
  open the panel programmatically.

## Sources

- [Apple HIG — The Menu Bar](https://developer.apple.com/design/human-interface-guidelines/the-menu-bar)
- [Apple — MenuBarExtra documentation](https://developer.apple.com/documentation/swiftui/menubarextra)
- [Apple — NSStatusItem documentation](https://developer.apple.com/documentation/appkit/nsstatusitem)
- [Sindre Sorhus — Why your macOS menu bar app feels off](https://sindresorhus.com/blog/menu-bar-app) — template image discipline, popover behavior.
- [Bartender 5](https://www.macbartender.com/) — the canonical "manage menu-bar items" tool; design your icon to survive being hidden by it.
