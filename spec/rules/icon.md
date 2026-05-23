# App icon

Picking glass right and then shipping a default Xcode placeholder icon is the most common "this app feels half-finished" smell. This rule covers the minimum an amateur needs to hit a credible macOS / iOS icon without becoming an icon designer.

The kit does **not** ship icons. It points at the right tool and the right grid.

## Tool of record: Icon Composer

Apple ships [Icon Composer](https://developer.apple.com/icon-composer/) as the canonical tool for macOS 26 / iOS 26 icons. It produces the layered `.icon` asset Xcode consumes for all sizes, light / dark / tinted variants, and the macOS Tahoe / iOS 26 system glass treatment.

Workflow:

1. Open Icon Composer, create a new icon at 1024 × 1024.
2. Add a background layer (solid color, gradient, or art).
3. Add up to two foreground layers — typically a glyph and an optional accent.
4. Specify the **light**, **dark**, and **tinted** variants explicitly. Tinted reuses your foreground over a system-tinted background.
5. Export as `.icon` and drop into the Xcode asset catalog.

The result is one asset that the system renders correctly across macOS 26 idle / Liquid-Glass-aware contexts, dock, Finder previews, and iOS 26 home screen variants.

## Squircle grid

Apple's app icon shape is a **continuous-curvature squircle** (G2 continuity), not a circle and not a rounded rectangle. Icon Composer applies the squircle automatically; if you are producing the underlying artwork in another tool:

- Canvas: 1024 × 1024 px.
- Safe area: keep meaningful glyph content within an **820 × 820** centered square. The squircle clip eats the corners — anything that lands there will be cut.
- Do not pre-clip the artwork with your own corner radius. The system applies the squircle mask.

## Layered model

macOS 26 / iOS 26 icons are layered, not flat:

| Layer | What goes here |
|---|---|
| Background | solid color, gradient, or a soft scene. No glyphs. |
| Foreground (primary) | the glyph or main mark. Keep it simple and centered. |
| Foreground (accent, optional) | a small overlay element. Keep it inside the safe area. |

The system composites the layers with a subtle inner shadow on the foreground and the Liquid-Glass-aware highlight on idle / Lock-Screen contexts. Do not bake your own drop shadow into the asset.

## Light / dark / tinted variants

All three must be authored:

- **Light** — full-color version used on a light desktop / home screen.
- **Dark** — adapted for dark mode. Often the same glyph with a darker background or higher-saturation accents.
- **Tinted** — the foreground layer alone, rendered over a system-tinted background. The system handles the tint; you only ship the foreground.

Icon Composer carries all three variants in the same `.icon` document.

## What an amateur usually gets wrong

- **Shipping a 512 × 512 PNG with no `.icon` asset.** Result: pixelated dock icon, no Liquid-Glass treatment, no tinted variant.
- **Pre-clipping the squircle in the artwork.** The system reclips, double-rounded corners appear.
- **Painting the foreground edge-to-edge.** Glyph touches the squircle clip and reads as cropped on Lock Screen contexts.
- **Skipping the dark variant.** Default flips the light asset to inverted RGB. Usually ugly.
- **Drop shadow baked into the PNG.** Stacks with the system inner shadow into a muddy outline.

## What the kit does not cover

- Icon visual design (typography of monograms, brand mark refinement, color theory). That is a graphic-design problem outside the design-system scope.
- Marketing icons (App Store hero shots, banners). Different requirements; Apple publishes those separately.

## Sources

- [Apple Icon Composer](https://developer.apple.com/icon-composer/)
- [Bjango — macOS app icon workflow](https://bjango.com/articles/macappiconworkflow/)
- [The macOS App Icon Book (Flarup)](https://www.appiconbook.com/)
- [macOS Icon Gallery](https://www.macosicongallery.com/)
- [Figma — macOS icon template for Liquid Glass](https://www.figma.com/community/file/930870327989917713/macos-icon-template-updated-for-macos-26-liquid-glass)
