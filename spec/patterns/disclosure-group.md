# Disclosure group

Collapsible content with a leading chevron. Used inside inset lists,
inspectors, and settings panels. Always solid.

## Geometry

- Header min-height: 32.
- Header padding: 8 horizontal, 6 vertical.
- Header label: subheadline weight 500.
- Chevron size: 12, leading.
- Chevron-to-label gap: 8.
- Expand / collapse animation: `fast` (160 ms) standard easing.
- Indent of nested children: 16 per level (`panelGap`).

## Apple APIs

- SwiftUI: `DisclosureGroup` (single section), `OutlineGroup`
  (data-driven tree).
- AppKit: `NSOutlineView` with built-in disclosure triangle.

## Inside an inset list

Use `DisclosureGroup` as a `Section` row when one row needs to expand
in place; use `OutlineGroup` when the entire list is hierarchical.

## Forbidden

- Glass background on the header or on the disclosed content (A2).
- Animating layout properties other than height — opacity on the
  disclosed children is fine, but transforms on the chevron should be
  rotation only.

## Caveats

- Multi-level outlines should not exceed three depths in a content
  panel; deeper trees belong in a dedicated outline view.
- Persist expansion state with `@SceneStorage` when the user expects
  it across window restorations.
