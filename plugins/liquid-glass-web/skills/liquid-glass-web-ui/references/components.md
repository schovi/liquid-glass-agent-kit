# Component geometry

Authoritative dimensions for every component. Agents must not improvise these. Source: `spec/components/`.

| Component          | Key dimensions                                                            | Glass | Shape    |
| ------------------ | ------------------------------------------------------------------------- | ----- | -------- |
| `button`           | min-height 44, padding 16/8, icon 18, gap 8, font 15/600                  | yes   | capsule  |
| `icon-button`      | 44×44, icon 20                                                            | yes   | capsule  |
| `toolbar`          | min-height 52, padding 6, gap 4, item 40, icon 20                         | yes   | capsule  |
| `tab-bar`          | height 64, padding 8/6, radius 32, item min-width 56, icon 22, label 11   | yes   | fixed 32 |
| `card`             | radius 24, padding 24, gap 12                                             | opt.  | fixed 24 |
| `sheet`            | radius 28 top, padding 24, gap 16, grabber 36×5                           | yes   | fixed 28 |
| `segmented-control`| height 32, padding 2/2, item padding 12/4                                 | yes   | capsule  |
| `text-field`       | min-height 44, padding 12/10, radius 12, icon 18                          | NO    | fixed 12 |

## Required class hooks

The audit script keys off these class names. Agents should emit them.

- `lg-glass` — every glass surface.
- `lg-glass--regular` or `lg-glass--clear` — variant marker.
- `lg-capsule` — element whose `border-radius` must equal `height / 2` (use `9999px`).
- `lg-button`, `lg-icon-button`, `lg-card`, `lg-toolbar`, `lg-tab-bar`, `lg-sheet`, `lg-segmented`, `lg-text-field`.
- `data-renderer="css|css-svg|webgl"` on the glass surface.

## Constraints

- Tab bar holds 2 to 5 items, 4 recommended.
- Segmented control holds 2 to 5 items.
- Text fields are solid surfaces. Do not add `lg-glass` to them.
- A `lg-glass` element must not contain another `lg-glass`.
