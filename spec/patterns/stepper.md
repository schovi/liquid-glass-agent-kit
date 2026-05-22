# Stepper

Paired plus / minus increment buttons. In a toolbar they share one
glass capsule via `GlassEffectContainer`. In a form they sit beside a
solid value, and the buttons inherit the form's solid surface.

## Geometry

- Button size: 28 × 28 (toolbar) or 22 × 22 (form).
- Button radius: capsule (toolbar) or 12 (form).
- Gap between buttons: 4 (toolbar) or 0 with shared border (form).
- Gap from value to buttons: 8 (`controlGap`).
- Icon size: 14.

## Apple APIs

- SwiftUI: `Stepper(value:in:step:)` or `Stepper("Label", onIncrement:onDecrement:)`.
- AppKit: `NSStepper`.

## Toolbar variant

```swift
GlassEffectContainer(spacing: 4) {
    HStack(spacing: 4) {
        Button { } label: { Image(systemName: "minus") }
            .buttonStyle(.glass)
            .buttonBorderShape(.capsule)
        Button { } label: { Image(systemName: "plus") }
            .buttonStyle(.glass)
            .buttonBorderShape(.capsule)
    }
}
```

The container merges both buttons into one shared glass sampling pass.

## Form variant

```swift
LabeledContent("Quantity") {
    Stepper(value: $quantity, in: 0...99)
}
```

Inside a form the stepper is solid; the system handles the styling.

## Forbidden

- A glass background under the value (A2).
- Mixing `Stepper` with custom `Button` increments — pick one or the
  other so accessibility shortcuts (up/down arrows) work consistently.

## Caveats

- Hold-to-repeat is built into `Stepper`; don't reimplement.
- Long-press accessibility: VoiceOver reads the current value and the
  step amount; do not strip the system label.
