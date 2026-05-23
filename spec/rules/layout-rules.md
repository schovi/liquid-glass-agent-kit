# Layout rules

## Surfaces that may use glass

- Top navigation, bottom navigation, tab bar.
- Floating toolbars, action bars.
- Sheets, popovers, menus.
- Floating cards or panels above content.
- Primary action surfaces (e.g., a single highlighted action button).

## Surfaces that must NOT use glass

- Page background (F1).
- Long-form text containers (F2).
- Forms and input fields (F3) — use a solid surface; see `components/text-field.yaml`.
- Dense data tables (F4).
- Any element that sits behind another glass element ("glass-on-glass", F5).

The codes (F1–F5) point to `when-not-to-use-glass.md` for the failure
mode and citations. The auditor catches F2 and F5 directly via A1 / A2;
F1 / F3 / F4 are review rules.

## Spacing

- Controls within a glass group: `spacing.controlGap` (8 px).
- Sibling groups inside a glass panel: `spacing.groupGap` (12 px).
- Glass panel to its neighbor: `spacing.panelGap` (16 px).
- Screen margin: compact 16 px, regular 24 px.

## Sizing

- Touch targets are at least 44×44 px.
- Tab-bar items: 56 px min width, 22 px icon, 11 px label.
- Toolbar item: 40 px, 20 px icon.
- Button label uses subheadline (15 px / 600).
