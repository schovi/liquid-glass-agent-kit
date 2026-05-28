# Windows and full-screen

Mac windows resize, hide, show, move, minimize, zoom, and go full-screen. Users expect every one of those to work without surprise.

## General

- **Let people resize, hide, show, and move your windows** to fit their work style and device configuration.
- **Don't programmatically resize the window** after the user has sized it. Adjust internal layout subtly to use new space.
- **Help people resume where they left off** — restore window state across launches.

## Full-screen

- **Support full-screen when it makes sense.** Games, media viewing, in-depth focused tasks. Less useful for utility / picker apps.
- **Don't programmatically resize** to "full-screen-ish" — use the system full-screen entry (`toggleFullScreen(_:)`).
- **Continue to provide access to essential features and controls** so people can complete their task without exiting.
- **Let people reveal the Dock** in full screen (except in games).
- **Help people resume where they left off.** Pause games / slideshows automatically when switching away.
- **Let people choose when to exit.** Don't auto-exit when switching apps or finishing a task.
- **Prioritize content by hiding toolbars / navigation** when content is primary focus. Restore via tap, swipe-down, or pointer-to-top. Keep essentials visible.

### macOS specifics

- **Use the system-provided full-screen experience** (`toggleFullScreen(_:)`). Handles the camera housing automatically.
- **In games, don't change display mode** — user controls it.
- **Always let people choose** when to enter full-screen. Prefer the Enter Full Screen button, the View menu item, or ⌃⌘F. Avoid custom menus of window modes. Games may provide a custom full-screen toggle.

## Window menu

See `menu-bar.md` for the full standard. Required minimum:

- Minimize (⌘M)
- Zoom (no shortcut by default; ⌥ → Zoom All)
- Bring All to Front
- Open window names — listed alphabetically; skip panels / modals.

## SwiftUI

```swift
@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {                  // for document-style: multiple windows OK
            ContentView()
        }
        .windowResizability(.contentSize)
        .defaultSize(width: 900, height: 600)

        Window("Inspector", id: "inspector") {  // singleton secondary window
            InspectorView()
        }
        .keyboardShortcut("i", modifiers: [.command, .option])
    }
}
```

- `WindowGroup` — many windows.
- `Window` — one window. Use for app-specific singletons (inspector, console, debugger).
- `DocumentGroup` — document-based; see `file-management.md`.

## AppKit

`NSWindowController` per window class. `applicationShouldTerminateAfterLastWindowClosed` returns `false` for utility-style apps (the app keeps running with no windows; reopen via Dock), `true` for single-window apps.

## Sources

- Apple HIG — Going full screen: <https://developer.apple.com/design/human-interface-guidelines/going-full-screen>
- Apple HIG — Designing for macOS: <https://developer.apple.com/design/human-interface-guidelines/designing-for-macos>

## See also

- `multi-window.md` — multi-window patterns and restoration.
- `window-chrome.md` — titlebar geometry, traffic-light alignment, toolbar composition.
- `menu-bar.md` — Window menu standards.
