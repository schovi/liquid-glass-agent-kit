# Multi-window

A real Mac app supports multiple windows. Cmd-N opens a new window,
closing one doesn't quit the app, closed windows restore on launch,
and unrelated work in one window doesn't block another. Electron and
cross-platform shells regularly fail at this; the kit codifies the
Mac behavior.

Liquid Glass is the chrome material on each window, but multi-window
is about *scene architecture*, not material.

## When to use

- A document-based app (Pages, Numbers, Xcode, Sublime): every
  document opens in its own window.
- A multi-instance utility (multiple notes, multiple chats, multiple
  inspectors): one main window plus auxiliary windows.
- An app with persistent secondary surfaces (Preferences,
  About, Welcome, Library) — each is a separate scene, not a sheet.

## When NOT to use

- The app is genuinely single-window (Music, System Settings,
  Activity Monitor). Forcing multi-window makes the app feel
  Electron-ish.
- The "second window" is actually a modal dialog (Save As, Open) —
  use a sheet, not a window.

## Scene types

SwiftUI exposes three scene types on macOS 26; pick by the role:

| Scene                  | Behavior                                                                 | Use for                                                                |
| ---------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| `WindowGroup`          | Multiple instances. Cmd-N opens a new one. State per-instance.            | Documents (`DocumentGroup` is a `WindowGroup` specialization), notes.  |
| `Window`               | Single instance (singleton). Reopens if user re-invokes.                  | Preferences, About, Library, Welcome.                                  |
| `MenuBarExtra`         | Status-bar scene (separate concept, see `menu-bar-extra.md`).             | Menu-bar utilities.                                                    |
| `Settings` (deprecated on 26) | Replaced by `Window(id: "settings", ...)` + `.commands(SettingsCommands())`. | Preferences (the modern path).                                |

Multi-window is `WindowGroup`. AppKit equivalent: one
`NSWindowController` subclass per window kind, instantiated per
document or per Cmd-N press.

## SwiftUI recipe

```swift
@main
struct NotesApp: App {
    var body: some Scene {
        WindowGroup(id: "note", for: Note.ID.self) { $noteID in
            NoteEditor(noteID: noteID)
        }
        .commands {
            CommandGroup(replacing: .newItem) {
                Button("New Note") { openWindow(id: "note") }
                    .keyboardShortcut("n", modifiers: .command)
            }
        }

        Window("Preferences", id: "preferences") {
            PreferencesView()
        }
        .keyboardShortcut(",", modifiers: .command)
    }
}
```

`openWindow(id:value:)` is the SwiftUI primitive for programmatic
window opening (replaces NSApplication.shared.openURL hacks).

## AppKit recipe

```swift
class NoteWindowController: NSWindowController {
    convenience init(note: Note) {
        let window = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 720, height: 480),
            styleMask: [.titled, .closable, .miniaturizable, .resizable, .fullSizeContentView],
            backing: .buffered,
            defer: false
        )
        window.titlebarAppearsTransparent = true
        window.contentViewController = NSHostingController(rootView: NoteEditor(note: note))
        self.init(window: window)
        window.windowController = self        // retains the controller
    }
}
```

For Cmd-N: implement `applicationShouldHandleReopen(_:hasVisibleWindows:)`
to open a new window when the app is reactivated with no windows
visible.

## State restoration

Mac users expect "Reopen windows when logging back in" and
"Restore last session" to work. The system primitives:

- **SwiftUI** — `SceneStorage` for per-window state; `@AppStorage`
  for app-level. `WindowGroup(for: Note.ID.self)` automatically
  restores documents.
- **AppKit** — implement `NSWindow.isRestorable = true` and
  `NSWindow.restorationClass`. `NSWindowController` subclasses
  implement `encodeRestorableState(with:)`.

Don't skip restoration. An app that opens to a blank state every
launch feels broken on macOS.

## Closed-window handling

- The app stays running when the last window closes (default macOS
  behavior). Don't fight it.
- If the app makes no sense without a window (calculator,
  single-document utility), opt into "quit on last window close":
  ```swift
  // SwiftUI
  .terminationPolicy(.afterLastWindowCloses)
  ```
  ```swift
  // AppKit
  func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool { true }
  ```

## Keyboard

- **⌘N** — new window. Always available in a `WindowGroup` app.
- **⌘⇧T** — reopen recently closed window. Convention from browsers;
  Pages, Numbers, Keynote all support it. Not free — implement via a
  closed-document stack.
- **⌘W** — close the focused window (system handles).
- **⌘`** — cycle through the app's windows (system handles).
- **⌘\\** — minimize (system handles).
- **⌘0** — focus the main window (convention; implement manually).

## Multi-window anti-patterns

- **Modal sheets that block all windows.** A sheet is window-modal
  on macOS — it blocks only the window it's attached to. Hand-rolling
  app-modal blocking across windows is anti-Mac. (Use an
  `NSAlert.runModal()` for genuinely app-modal cases like critical
  errors.)
- **Document state in `@StateObject` at the app root.** The state
  becomes singleton; opening a second window of the same document
  shares mutation. Use `@SceneStorage`, `@StateObject` at the scene
  root, or `DocumentGroup`.
- **No restoration.** Closing the last window and reopening the app
  to a fresh state confuses users who expect Mac restoration.
- **One toolbar declaration shared across windows.** Each window
  scene declares its own `.toolbar`; sharing produces A13 (two
  `.toolbar` modifiers in different ancestors).
- **Window position math.** Don't hard-code window origin; SwiftUI
  and AppKit both cascade window positions automatically. New windows
  appear offset from the previous frontmost.

## Sources

- [Apple — Window scenes in SwiftUI](https://developer.apple.com/documentation/swiftui/windowgroup)
- [Apple — NSWindowController documentation](https://developer.apple.com/documentation/appkit/nswindowcontroller)
- [Apple HIG — Windows](https://developer.apple.com/design/human-interface-guidelines/windows)
- [WWDC22 session 10054 — Bring multiple windows to your SwiftUI app](https://developer.apple.com/videos/play/wwdc2022/10054/)
- [WWDC23 session 10112 — Discover Observation in SwiftUI](https://developer.apple.com/videos/play/wwdc2023/10112/) — context for per-scene state.
