# Form rows

Forms are content — never glass. Glass behind text fields and labels
reduces contrast under autocomplete, validation, and focus states.

## Layout

- Container: `Form` (SwiftUI) or `NSGridView` (AppKit). Solid background.
- Each row: leading label (subheadline weight 400) + trailing control.
  Use `LabeledContent` for label/value rows and a plain `HStack` when the
  control needs its own header.
- Vertical gap between rows: 12 (`groupGap`). Section gap: 24
  (`screenMarginRegular`) when rows are grouped under a heading.
- Horizontal gap between label and control: 12.

## Section grouping

`Form` auto-groups its `Section` children with inset rounded backgrounds
on macOS 26. Section headers are subheadline weight 600 in a muted color.
Footers explain non-obvious behavior in footnote weight 400.

## Apple APIs

- SwiftUI: `Form`, `Section`, `LabeledContent`, `TextField`, `Toggle`,
  `Picker`, `Slider`, `Stepper`.
- AppKit: `NSGridView` rows wrapping `NSTextField` + control pairs;
  legacy `NSForm` is deprecated.

## Forbidden

- `.glassEffect(...)` on the form container, on any row, or on any control
  inside the form. This is anti-pattern A2 (glass behind body text) and
  A1 (glass-on-glass when the form sits inside a glass sheet — the sheet
  is the glass; the form stays solid).
- Custom backgrounds on individual rows when `Form { Section }` would do
  the job.

## Caveats

- Inside a sheet the form remains solid; the sheet itself is the glass
  surface. Don't add a second glass layer.
- Validation messages sit below the field at footnote scale, leading-aligned.
