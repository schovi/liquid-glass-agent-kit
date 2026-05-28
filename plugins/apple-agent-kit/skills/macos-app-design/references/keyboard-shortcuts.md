# Keyboard shortcuts

A Mac app is judged on its keyboard. The kit's taxonomy is in
`spec/patterns/keyboard-shortcuts.md`; this file is the
SwiftUI / AppKit how-to.

## Modifier conventions

Display order ⌃⌥⇧⌘ (SwiftUI / AppKit format automatically). Meaning:

- **⌘** — app-level actions (new, open, save, find, close, quit).
- **⇧** — inverse / extended variant (⌘W close window vs ⌘⇧W close
  tab).
- **⌥** — alternate / variant (⌘F find vs ⌘⌥F find-and-replace).
- **⌃** — system-reserved; avoid app shortcuts in this space.
- **Fn** — system-reserved; never assign.

## SwiftUI recipe

```swift
Button("New Note") { newNote() }
    .keyboardShortcut("n", modifiers: .command)

Button("Find") { showFind() }
    .keyboardShortcut("f", modifiers: .command)

Button("Find Next") { findNext() }
    .keyboardShortcut("g", modifiers: .command)

Button("Find Previous") { findPrevious() }
    .keyboardShortcut("g", modifiers: [.command, .shift])

Button("Replace") { showReplace() }
    .keyboardShortcut("f", modifiers: [.command, .option])

Button("Open Quickly") { openQuickly() }
    .keyboardShortcut("o", modifiers: [.command, .shift])
```

Scope to a window with `.commands { ... }` on the scene; scope to
a focused view with the modifier on a `Button`. App-wide shortcuts
(visible regardless of focused window) belong in
`.commands { CommandMenu("...") { ... } }`.

Special keys:

```swift
.keyboardShortcut(.return)
.keyboardShortcut(.escape)
.keyboardShortcut(.upArrow, modifiers: [])           // bare ↑
.keyboardShortcut(.downArrow)
.keyboardShortcut(.tab)
.keyboardShortcut(.delete)
.keyboardShortcut(.defaultAction)                    // matches Return on the default button
.keyboardShortcut(.cancelAction)                     // matches Esc on the cancel button
```

## AppKit recipe

```swift
let item = NSMenuItem(
    title: "Find",
    action: #selector(performFind(_:)),
    keyEquivalent: "f"
)
item.keyEquivalentModifierMask = [.command]
fileMenu.addItem(item)
```

For non-menu shortcuts, override `keyDown(with:)` on the focused
`NSView` and inspect `event.charactersIgnoringModifiers` +
`event.modifierFlags`:

```swift
override func keyDown(with event: NSEvent) {
    let chars = event.charactersIgnoringModifiers ?? ""
    let mods = event.modifierFlags.intersection(.deviceIndependentFlagsMask)
    switch (chars, mods) {
    case ("j", []): selectNext()
    case ("k", []): selectPrevious()
    default: super.keyDown(with: event)
    }
}
```

For system-wide hotkeys (Cmd-K palette globally, app launcher style),
use the [`KeyboardShortcuts` package](https://github.com/sindresorhus/KeyboardShortcuts)
or `Carbon.HIToolbox.RegisterEventHotKey`.

## What you MUST NOT override

⌘W, ⌘N, ⌘Q, ⌘H, ⌘M, ⌘\`, ⌘⇧/, ⌘, (Preferences), and the system
text-editing shortcuts (⌘A select all, ⌘C / ⌘V / ⌘X clipboard, ⌘Z /
⌘⇧Z undo / redo) belong to the system. Apps that override them break
user muscle memory across the OS.

## Discoverability

Every shortcut MUST appear in a discoverable surface:

- **Menu bar** — SwiftUI menu items / AppKit `NSMenuItem` render
  their `keyEquivalent` automatically. Build the menu even if you
  also expose actions elsewhere.
- **Command palette** — the Cmd-K palette displays each item's
  shortcut next to its label (see `command-palette.md`).
- **Help window** — Things / Linear / Arc all ship a dedicated
  keyboard-shortcuts help surface. Worth adding once a Mac app
  ships more than ~20 shortcuts.

## Anti-patterns

- **Overriding system semantics** (⌘W, ⌘N, ⌘Q, ⌘H).
- **Letter-only shortcuts when a text field has focus** — the key
  types into the input instead of firing the action. Constrain
  letter-only shortcuts to list-focused contexts (Mail, Things,
  Linear inbox).
- **Function-key shortcuts (F1–F12) without modifier** — reserved
  for Mission Control / brightness / volume.
- **Hidden destructive shortcuts** — ⌫ without confirmation in a
  list context, when undo isn't trivial.
- **Reinventing browser tab semantics** — if your app has tabs, ⌘T
  / ⌘W / ⌘⇧T must mean what Safari and Sublime mean.

## Accessibility

- VoiceOver reads the shortcut from the menu item's keyEquivalent —
  build the menu.
- Avoid shortcut conflicts with VoiceOver's `⌃⌥` commands.
- Custom modifier-only gestures (e.g. ⌥-drag to duplicate) MUST be
  reachable through a menu item or a button — never modifier-only.

## Sources

See `spec/patterns/keyboard-shortcuts.md` for HIG, Raycast, Things,
Linear, Arc, and Sublime / VS Code citations.
