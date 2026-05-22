# System primitives — use them, don't restyle

Alerts, confirmation dialogs, and tooltips are system UI. They pick up
the macOS 26 treatment automatically. Reimplementing them looks worse
and breaks accessibility.

## Alert

```swift
view
    .alert("Discard changes?", isPresented: $showsAlert) {
        Button("Discard", role: .destructive) { discard() }
        Button("Cancel",  role: .cancel) { }
    } message: {
        Text("Your unsaved edits will be lost.")
    }
```

AppKit:

```swift
let alert = NSAlert()
alert.messageText = "Discard changes?"
alert.informativeText = "Your unsaved edits will be lost."
alert.alertStyle = .warning
alert.addButton(withTitle: "Discard")
alert.addButton(withTitle: "Cancel")
let response = alert.runModal()
```

Rules:

- Title is short, sentence case, ends with a question mark or period.
- Informative text is one sentence.
- Destructive action on the leading edge, cancel on the trailing edge —
  but the system places them; you don't.

## Confirmation dialog

```swift
view
    .confirmationDialog("Delete 3 items?",
                        isPresented: $showsConfirm,
                        titleVisibility: .visible) {
        Button("Delete", role: .destructive) { delete() }
        Button("Cancel", role: .cancel) { }
    } message: {
        Text("This cannot be undone.")
    }
```

Use confirmation dialogs over alerts when:
- The action is destructive and irreversible.
- More than two options are needed (alerts cap at three buttons cleanly).

## Tooltip

```swift
button.help("Reply to thread (⌘R)")
```

AppKit:

```swift
button.toolTip = "Reply to thread (⌘R)"
```

Rules:
- Tooltips supplement; they never replace a visible label.
- Keep them under 50 characters.
- Include keyboard shortcuts when relevant.

## Forbidden

- Custom alert sheets that look like the system alert. Users learn the
  shape of the system alert — mimicking it confuses origin.
- Tooltips on touch targets that aren't hoverable (e.g. inside a
  scrolling list row that selects on hover).
- Replacing `NSAlert` with a `Window`. The platform handles modality,
  focus, and accessibility; a custom window doesn't.

## Caveats

- On macOS 26, alerts and confirmation dialogs render with Liquid Glass
  on partial-detent presentation contexts. This is system-driven; do
  not opt out.
- Tooltip delay is system-configured via Accessibility prefs. Don't
  override.
- For destructive confirmation outside a single action (e.g. multi-step
  flows), use a sheet with explicit affirmative typing — not a dialog.
