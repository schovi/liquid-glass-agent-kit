# Command palette (Cmd-K)

A floating action-launcher. Press Cmd-K, see a search input, type to filter a list of commands, press Enter to run, Esc to dismiss. Spotlight is the system version; Raycast / Linear / Superhuman are the app-level pattern.

The kit codifies it because amateurs get the keyboard model, focus trap, and material role wrong, and the result is a palette that "kind of works" but breaks VoiceOver, traps focus permanently, or stacks glass on glass.

## When to use it

- Apps with more than a handful of actions a user invokes from the keyboard.
- Apps with deep navigation (multi-page settings, hundreds of records).
- Apps where the user expects parity with Mac power tools (Raycast / Spotlight / Alfred users).

## When **not** to use it

- Apps with fewer than ~10 actions. A toolbar covers it; a palette is overkill.
- Forms. The palette invokes; it does not edit. Use a sheet for edits.
- Inside another modal. Do not stack a palette over a sheet or alert.

## Material role

`hud` — the palette is a floating control surface over content. It sits above a scrim:

- Light backdrop: scrim `rgba(0,0,0,0.08)`. Dark: `rgba(0,0,0,0.32)`.
- Panel: Regular glass on `hud` role. Radius 16 (md).
- Items inside the panel are **solid hover rows**, not glass. Glass-on-glass is the most common mistake here (A1).

## Geometry

| Token | Value |
|---|---|
| Panel width | 640 |
| Panel max-height | 480 |
| Top offset from window edge | 96 |
| Panel radius | 16 (md) |
| Panel padding | 8 |
| Input height | 44 |
| Item height | 44 |
| Item radius | 12 (sm) — concentric: 16 outer − 4 panel padding |
| Icon size | 18 |
| Section header height | 28 |

The 12 / 16 split satisfies concentricity (A6): outer 16 panel, inner items 12 (= 16 − 4 panel padding).

## Keyboard model

Non-negotiable. Amateurs reimplement these incorrectly all the time.

| Key | Behavior |
|---|---|
| `Cmd+K` | Toggle. Open if closed, close if open. |
| `Esc` | Close. Restore focus to whatever held it before. |
| `ArrowDown` / `ArrowUp` | Move selection through the filtered list. Wrap at ends. |
| `Enter` | Run the selected item. Close the palette. |
| any character | Append to the search field. The first matching item becomes selected automatically. |
| `Tab` | Move focus inside the palette only (trap until Esc). Do **not** allow focus to escape the open palette. |

When the palette opens, focus moves to the input. When it closes, focus restores to the trigger.

## Motion

| Phase | Duration | Easing | Properties |
|---|---|---|---|
| Enter | 240 ms (base) | spring | opacity 0→1, scale 0.96→1, translateY −8→0 |
| Exit | 160 ms (fast) | standard | opacity → 0, scale → 0.96, translateY → −8 |

`prefers-reduced-motion: reduce` — collapse to opacity-only fade (no scale, no translate).

## No glass-on-glass

If the palette opens over a glassy toolbar, A1 (glass-on-glass) fires. Two fixes, in priority:

1. **Scrim it.** The scrim layer between the toolbar and the palette breaks the stacking. This is the kit's default.
2. **Drop the panel's blur** when the layer below is already glassy. Switch to the reduced-transparency variant of the panel (opaque white / opaque dark with same radius).

Do not move the palette below the toolbar; users expect it floating in the upper third of the window.

## Empty state and grouping

- Empty result: render a single solid row with caption-2 text "No matches" — not a flashy graphic. The palette is keyboard-first; visual noise distracts.
- Grouping: optional. When grouped, the section header is 28 tall, subheadline-weight, color subtle. Items inside a group stay 44 tall.
- No icons by default. Icons are 18 pt, optional. The label is what's matched.

## Accessibility

- The panel has `role="dialog"` and `aria-modal="true"`.
- The input has `role="combobox"`, `aria-expanded="true"`, `aria-controls` pointing at the list, and `aria-activedescendant` pointing at the currently selected option id.
- The list has `role="listbox"`. Each item has `role="option"` and a stable id.
- Focus trap is on while the palette is open. `Tab` cycles among focusable elements inside the panel only.
- On close, focus restores to the element that opened the palette.

## Native specifics

SwiftUI on macOS 26 wires this with:

- `.keyboardShortcut(.init("k"), modifiers: .command)` on a button or as a `.commands { ... }` `CommandMenu` entry, toggling a `@State var isPaletteOpen`.
- `.sheet` with `.presentationDetents([.medium])` works for a center-screen variant, but the canonical look is `.overlay(alignment: .top)` with `.glassEffect(.regular, in: .rect(cornerRadius: 16))` on the panel.
- `.searchable` is the wrong tool here — that lives in the toolbar. The palette uses a `TextField` inside the overlay.

AppKit:

- An `NSPanel` with `.hudWindow` material gives the right z-order behavior and key-window semantics.
- Key event capture via `NSEvent.addLocalMonitorForEvents(matching: .keyDown)` filtering for `⌘K`.

## Sources

- [Superhuman — Building a remarkable command palette](https://blog.superhuman.com/how-to-build-a-remarkable-command-palette/)
- [awesome-command-palette](https://github.com/stefanjudis/awesome-command-palette)
- [MacStories — Command-K Bars](https://www.macstories.net/linked/command-k-bars-as-a-modern-interface-pattern/)
- [Raycast plugin standardization](https://www.stijnbakker.com/how-raycast-standardises-native-mac-design-of-plugins)
