# Inset list

The macOS 26 grouped list. Solid rounded sections, never glass. Used for
settings panels, metadata lists, navigation indices that sit in the
content area.

## Geometry

- Section container radius: 12 (`sm`).
- Section inner padding: 0 horizontal, controls handle their own padding.
- Row min-height: 32 for compact, 44 for regular.
- Row inner padding: 12 horizontal, 8 vertical.
- Section header: subheadline weight 600, muted, padded 6/10/2.
- Section footer: footnote weight 400, muted, padded 8/10/4.
- Vertical gap between sections: 16 (`panelGap`).

## Apple APIs

- SwiftUI: `List { Section { ... } }` with `.listStyle(.inset)`.
- AppKit: `NSCollectionView` with a grouped section layout, or
  `NSOutlineView` for sidebar-style indented sections.

## Sidebar variant

When the same list is used as the app sidebar, use `.listStyle(.sidebar)`
inside `NavigationSplitView` instead. The system applies Liquid Glass to
the sidebar surface; rows inside stay solid.

## Forbidden

- Glass on the row backgrounds (A2: glass behind body text).
- Mixing inset and plain styles in the same list — pick one per panel.
- Custom radii beyond the token table (A3, A4).

## Caveats

- Selection highlight is system-rendered. Don't override unless the
  list is decorative (then it's a custom layout, not a `List`).
- Row dividers use `var(--lg-divider)` / `Color.primary.opacity(0.08)` —
  not full-contrast borders.
