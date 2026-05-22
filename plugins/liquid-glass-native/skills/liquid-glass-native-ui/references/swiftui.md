# SwiftUI cheat-sheet

Confirmed APIs for SwiftUI on macOS 26 / iOS 26. Sources in
`docs/resources.md` § B–F. Do not invent API names — if you need
something not listed here, check Apple's reference first.

## Glass material

```swift
view.glassEffect(.regular, in: Capsule())            // default shape is Capsule
view.glassEffect(.clear, in: RoundedRectangle(cornerRadius: 24, style: .continuous))
view.glassEffect(.regular.tint(.indigo))             // chained tint
view.glassEffect(.regular.interactive())             // press / hover response
```

`Glass` exposes `.regular`, `.clear`, `.identity`. Chainable: `.tint(_:)`, `.interactive()`.

### Modifier order — `.glassEffect` must run last

Glass samples whatever is behind the view. The sampling pass uses the
view's final shape, so every layout / frame / padding modifier must
run *before* `.glassEffect`. Putting `.glassEffect` mid-chain samples
the wrong region.

```swift
// ✅ Correct
Text("Hello")
    .padding()
    .frame(width: 200)
    .glassEffect(.regular, in: .rect(cornerRadius: 16))

// ❌ Wrong — padding / frame apply after glass sampling
Text("Hello")
    .glassEffect()
    .padding()
    .frame(width: 200)
```

### `.identity` — the conditional off-state

`Glass.identity` is the no-op variant. Toggle glass off with it instead
of conditionally removing the `.glassEffect` modifier — `.identity`
keeps layout stable and avoids re-running the sampling pass.

```swift
button
    .glassEffect(highlighted ? .regular : .identity)
```

### `.interactive()` — only on input

`.interactive()` adds press, hover, and pointer-illumination response.
Apply it **only** to views that actually respond to user input
(buttons, sliders, tappable pills). Putting it on a static status pill
or decorative badge produces phantom hover targets and confuses screen
readers.

## Grouping glass

`GlassEffectContainer(spacing:)` groups glass elements so they share one
sampling pass and morph fluidly during animations.

```swift
GlassEffectContainer(spacing: 4) {
    HStack(spacing: 4) {
        Button { } label: { Image(systemName: "arrowshape.turn.up.left") }
            .buttonStyle(.glass).buttonBorderShape(.capsule)
        Button { } label: { Image(systemName: "arrowshape.turn.up.right") }
            .buttonStyle(.glass).buttonBorderShape(.capsule)
    }
}
```

### Morphing — `glassEffectID` + `@Namespace`

When a glass element appears, disappears, or swaps shape, give every
participant a `glassEffectID` in a shared `@Namespace` and wrap the
state change in `withAnimation`. The full pattern lives in
`references/patterns/morphing.md`.

```swift
@Namespace private var ns
@State private var expanded = false

GlassEffectContainer(spacing: 24) {
    Button(expanded ? "Collapse" : "Expand") {
        withAnimation(.bouncy) { expanded.toggle() }
    }
    .buttonStyle(.glass)
    .glassEffectID("toggle", in: ns)

    if expanded {
        Button("Action 1") { }.buttonStyle(.glass).glassEffectID("a1", in: ns)
        Button("Action 2") { }.buttonStyle(.glass).glassEffectID("a2", in: ns)
    }
}
```

Requirements: same `GlassEffectContainer`, same `@Namespace`, animated
state change. Use `.glassEffectUnion(id:in:)` when participants live
far apart (e.g. toolbar item morphing into a content-area capsule).

## Background extension

```swift
HeroImage()
    .backgroundExtensionEffect()
```

Mirrors and blurs the view outside the safe area so it shows through
floating sidebars and inspectors. Apply on the **content**, never on
the chrome — the chrome already paints Liquid Glass.

## Scroll edge effects

Controls how scrolling content fades or hardens beneath floating
chrome. Full rules in `references/patterns/scroll-edge-effects.md`.

```swift
ScrollView { ... }
    .scrollEdgeEffectStyle(.hard, for: .top)
```

- Styles: `.soft` (default), `.hard`.
- Edges: `.top`, `.bottom`, `.leading`, `.trailing`, `.all`.
- One style per edge. Never mix soft + hard on adjacent edges of the
  same scroll view.
- Only apply where a floating chrome element actually sits at that
  edge — edge effects are not decoration.

## Window chrome

```swift
WindowGroup("Title") { ContentView() }
    .windowStyle(.titleBar)
    .windowToolbarStyle(.unified(showsTitle: true))
    .defaultSize(width: 1180, height: 760)
```

The unified toolbar style is what gives you the macOS 26 single floating
glass strip across the top.

## Layout — three-column

```swift
NavigationSplitView {
    Sidebar(selection: $selection)
} content: {
    Detail()
        .navigationTitle("Showcase")
        .searchable(text: $query, placement: .toolbar)
        .toolbar { ... }
} detail: {
    Inspector()
}
```

`NavigationSplitView` picks up Liquid Glass automatically on macOS 26 —
don't add `.sidebar` background materials manually.

## Toolbar

```swift
.toolbar {
    ToolbarItem(placement: .principal) {
        Picker("View", selection: $mode) { ... }
            .pickerStyle(.segmented)
    }
    ToolbarSpacer(.flexible)             // splits the shared glass capsule
    ToolbarItem {
        Menu { ... } label: { Label("More", systemImage: "ellipsis") }
    }
    ToolbarItem {
        Button { } label: { Label("New", systemImage: "plus") }
            .buttonStyle(.glassProminent)
            .controlSize(.large)
    }
}
```

`CustomizableToolbarContent.sharedBackgroundVisibility(_:)` hides the
shared glass background per group.

## Buttons

```swift
Button("Continue") { }
    .buttonStyle(.glassProminent)         // primary
    .controlSize(.large)

Button("Secondary") { }
    .buttonStyle(.glass)                  // secondary

Button("Ghost") { }
    .buttonStyle(.borderless)             // ghost

Button { } label: { Image(systemName: "plus") }
    .buttonStyle(.glass)
    .buttonBorderShape(.capsule)          // .capsule | .circle | .roundedRectangle(radius:)
```

`.controlSize(.extraLarge)` is new on macOS 26.

## Segmented / search / popover

```swift
Picker("Density", selection: $d) { ForEach(...) }
    .pickerStyle(.segmented)

View()
    .searchable(text: $query, placement: .toolbar)

view
    .popover(isPresented: $shown, arrowEdge: .bottom) { PopoverContent() }
```

## Sheet — Liquid Glass is automatic

```swift
.sheet(isPresented: $shown) {
    NewEntry()
        .presentationDetents([.medium, .large])
}
```

Do **not** add `.presentationBackground(.glass)`; the partial detent
triggers Liquid Glass automatically.

Sheet morphing from a source control:

```swift
button.matchedTransitionSource(id: "newButton", in: ns)
sheet.navigationTransition(.zoom(sourceID: "newButton", in: ns))
```

## Concentricity

```swift
RoundedRectangle(cornerRadius: 28, style: .continuous)
    .containerShape(RoundedRectangle(cornerRadius: 28, style: .continuous))
    .overlay(
        ConcentricRectangle()             // reads parent radius automatically
            .padding(8)                   // child = 28 − 8 = 20
    )
```

## Slider with neutral value

```swift
Slider(value: $volume, neutralValue: 0.5, in: 0...1)
```

## Tinting

`.tint(_:)` flows into `.glassProminent` (sets background tint) and into
`Glass.tint(_:)` for `.glassEffect`.

## Accessibility — the system handles it

Do not implement reduced-transparency / increased-contrast / reduced-motion
fallbacks manually. SwiftUI auto-degrades vibrancy when those flags are on.
Use `@Environment(\.accessibilityReduceTransparency)` only if you need to
branch your own custom rendering.

## Gaps (don't guess)

These were not confirmed in research — look them up before using:

- `backgroundExtensionEffect()` formal parameters beyond bare invocation.
- `presentationCornerRadius` as a *new* Liquid Glass affordance.
- A new sidebar list-row API name beyond `List` in `NavigationSplitView`.
- Programmatic Default-vs-Tinted user setting hook.
