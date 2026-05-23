# Keyboard shortcuts

Mac users live on the keyboard. A keyboard-first app is the
difference between feeling like a Mac app and feeling like a port.
Linear, Things, Raycast, Arc, Sublime, and Xcode all share an
unwritten taxonomy; the kit codifies it.

## Modifier conventions

| Modifier | Meaning                                                                                                |
| -------- | ------------------------------------------------------------------------------------------------------ |
| ⌘ (Cmd)  | App-level actions (new, save, find, open, close, quit). Standard menu items.                           |
| ⇧ (Shift) | Inverse / extended variant (⌘W close window vs ⌘⇧W close tab; ⌘Z undo vs ⌘⇧Z redo).                  |
| ⌥ (Option) | Variant / alternate (⌥-click reveals a hidden behavior; ⌘⌥F find-and-replace vs ⌘F find).            |
| ⌃ (Control) | System-reserved (⌃Space input switching, ⌃F1 keyboard navigation). Avoid app shortcuts here.        |
| Fn       | Reserved for system (fn-arrow keys, fn-letter dictation). Never assign.                                |

Multi-modifier shortcuts MUST be ordered ⌃⌥⇧⌘ when displayed.
SwiftUI's `keyboardShortcut(_:modifiers:)` and AppKit's
`NSMenuItem.keyEquivalentModifierMask` both auto-format.

## Shortcut taxonomy

Four scopes; each has different ownership rules.

### App-level (window-independent)

Available regardless of which window is focused. Convention:

| Shortcut | Action               | Notes                                                          |
| -------- | -------------------- | -------------------------------------------------------------- |
| ⌘N       | New (document / window) | `WindowGroup` apps get this for free                        |
| ⌘O       | Open                 | Standard file open dialog                                       |
| ⌘S       | Save                 | Saving is solved; do not invent ⌘⌥S                            |
| ⌘W       | Close window         | System-owned; do NOT override unless you really mean tab-close |
| ⌘,       | Preferences          | `Window(id: "preferences")` + this shortcut                    |
| ⌘Q       | Quit                 | System-owned; never override                                    |
| ⌘H       | Hide app             | System-owned; never override                                    |
| ⌘M       | Minimize window      | System-owned                                                    |
| ⌘`       | Cycle app windows    | System-owned                                                    |
| ⌘⇧/      | Search Help menu     | System-owned (registers as Help search)                        |
| ⌘?       | Help                 | Convention; reachable from Help menu                            |

### Document-level

Scoped to the focused document window.

| Shortcut | Action                                           |
| -------- | ------------------------------------------------ |
| ⌘F       | Find (in document)                               |
| ⌘G / ⌘⇧G | Find next / find previous                        |
| ⌘⌥F      | Find and replace (Pages / Numbers convention)    |
| ⌘+ / ⌘-  | Zoom in / zoom out                               |
| ⌘0       | Reset zoom (Apple apps and most editors)         |
| ⌘Z / ⌘⇧Z | Undo / redo                                      |
| ⌘A       | Select all                                       |
| ⌘D       | Duplicate (convention from Finder / Pages)       |
| ⌘P       | Print                                            |

### Modal / palette

Available when a modal surface (Cmd-K palette, modal sheet, focused
inspector) is up.

| Shortcut | Action                                                                  |
| -------- | ----------------------------------------------------------------------- |
| ⌘K       | Command palette toggle (Sublime / Linear / VS Code convention; see `command-palette.md`) |
| ⌘P       | File switcher (Sublime / VS Code; conflicts with print — apps making this choice usually shift print to ⌘⇧P) |
| ⌘⇧P      | Command palette (alternate; VS Code style)                              |
| Esc       | Dismiss the modal (always, in every modal)                              |
| ↑ / ↓     | Move selection                                                          |
| ⏎        | Activate                                                                |
| Tab       | Move focus inside the modal (trap; do not escape)                        |

### Letter-only (no modifier)

The danger zone. Letter-only shortcuts ONLY work when no text input
has focus — otherwise they type into the input. Use them only for:

- Single-key navigation in a list-focused app (Mail's `j` / `k` for
  next / previous; Things' `1` / `2` / `3` for Today / Anytime /
  Upcoming).
- Game-like one-key actions (rare in Mac apps).

Don't ship letter-only shortcuts for destructive actions (delete,
archive). The risk of an accidental fire-when-typing event is too
high.

## Discoverability

Every shortcut MUST appear in the menu bar or in a discoverable
help surface. Hidden shortcuts violate HIG and confuse users:

- Menu items show their keyEquivalent automatically.
- A Cmd-K palette MUST display the shortcut next to each item (the
  `command-palette.md` pattern enforces this).
- A "Keyboard Shortcuts" help window (Things, Linear, Arc all ship
  this) lists everything in one place.

SwiftUI auto-renders menu shortcuts. AppKit's `NSMenu` does too
when you set `keyEquivalent` and `keyEquivalentModifierMask`.

## SwiftUI recipe

```swift
.keyboardShortcut("n", modifiers: .command)                       // ⌘N
.keyboardShortcut("f", modifiers: [.command, .shift])             // ⌘⇧F
.keyboardShortcut(.return)                                        // bare Return
.keyboardShortcut(.escape)                                        // Esc
.keyboardShortcut(.upArrow, modifiers: [])                        // bare ↑
```

Scope a shortcut to a window with `.commands { ... }` on the scene;
scope to a view with `.keyboardShortcut(...)` on a `Button`.

## AppKit recipe

```swift
let item = NSMenuItem(
    title: "Find",
    action: #selector(performFind(_:)),
    keyEquivalent: "f"
)
item.keyEquivalentModifierMask = [.command]
```

For non-menu shortcuts, override `keyDown(with:)` on the focused
`NSView` and check `event.charactersIgnoringModifiers` +
`event.modifierFlags`.

## Anti-patterns

- **Overriding ⌘W / ⌘N / ⌘Q / ⌘H semantics.** ⌘W closes the focused
  window — not a tab, not a document body. Apps that override this
  break the user's muscle memory across the OS.
- **Letter-only shortcuts in a text-input context.** A keystroke that
  fires while the user is typing is a bug.
- **No-modifier function shortcuts (F1–F12).** Reserved for system
  keyboard navigation / Mission Control. Don't assign F1 to "Help"
  manually — the system already does that via ⌘⇧/.
- **App-specific reinvention of ⌘+T / ⌘+W / ⌘+R.** If your app has
  tabs, tab semantics must match Safari / Terminal / Sublime.
- **Hidden destructive shortcuts.** ⌫ (Delete) without a confirmation
  in a list-focused context is fine when undo is one keystroke away;
  it's catastrophic when it's not.

## Sources

- [Apple HIG — Keyboards and shortcuts](https://developer.apple.com/design/human-interface-guidelines/keyboards)
- [Apple — keyboard shortcut menu reference](https://support.apple.com/en-us/HT201236) — the canonical list of system shortcuts.
- [Raycast — A technical deep dive](https://www.raycast.com/blog/a-technical-deep-dive-into-the-new-raycast) — palette-first keyboard model.
- [Things 3 — Keyboard shortcuts](https://culturedcode.com/things/support/articles/3252620/) — letter-only navigation done right.
- [Linear — Keyboard shortcuts](https://linear.app/docs/keyboard-shortcuts) — modern web app that ships Mac-grade keyboard discipline.
- [Arc — Keyboard primer](https://arc.net/) — Arc commits hard to keyboard; useful as a reference for what's reachable.
- [Sublime / VS Code — Command palette conventions](https://code.visualstudio.com/docs/getstarted/keybindings) — ⌘P / ⌘⇧P split.
