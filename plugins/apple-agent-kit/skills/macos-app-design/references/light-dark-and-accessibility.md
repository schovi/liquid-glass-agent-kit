# Light + dark mode and appearance

Mac users switch appearance with the system. Your app follows. Some users keep dark mode permanently; some auto-switch by time of day; some use the accessibility "Increase contrast" or "Reduce transparency" preferences. Honor all of them.

## Hard rules

- **Design both** light and dark. Don't ship one and call the other "coming."
- **Do NOT invert colors.** Dark mode is not light mode with `Color.invert()`. Real dark mode uses different hues, lower saturation, different shadow strategy, and tuned text contrast.
- **Use system semantic colors.** `Color.primary`, `Color.secondary`, `.background`, `.foreground`, `.accentColor`, `NSColor.controlAccentColor`, `NSColor.windowBackgroundColor`. These adapt to appearance automatically.
- **Respect the user's accent color.** Don't hard-code blue or override with brand color throughout — use it only where brand identity matters (logo, splash, hero illustration).

## SwiftUI

```swift
@Environment(\.colorScheme) var colorScheme

var background: Color {
    colorScheme == .dark ? Color(white: 0.10) : Color(white: 0.98)
}
```

Prefer asset-catalog colors with both `Any Appearance` and `Dark` variants over branching on `colorScheme` in code. The asset catalog catches dynamic appearance changes without view invalidation.

## AppKit

`NSColor` semantic colors (`NSColor.labelColor`, `NSColor.controlBackgroundColor`, `NSColor.separatorColor`) auto-adapt. Use them.

## Increase contrast

Honor `@Environment(\.colorSchemeContrast)` returning `.increased`, or `NSWorkspace.shared.accessibilityDisplayShouldIncreaseContrast`. System controls darken / weight automatically. For custom surfaces, increase border weight and pull tints toward higher saturation when the flag is on.

## Reduce transparency

Honor `@Environment(\.accessibilityReduceTransparency)` or `NSWorkspace.shared.accessibilityDisplayShouldReduceTransparency`. Solid backgrounds replace vibrancy. For Liquid Glass surfaces, the system handles this automatically (see `liquid-glass/references/accessibility.md`).

## Reduce motion

See `accessibility.md` (WCAG 2.3.3). Honor `@Environment(\.accessibilityReduceMotion)`.

## Testing

Switch appearance in System Settings > Appearance and walk every screen. Then turn on Increase Contrast and Reduce Transparency in System Settings > Accessibility and walk again. Three full passes minimum: light / dark / increased contrast.

## Sources

- Apple HIG — Color: <https://developer.apple.com/design/human-interface-guidelines/color>
- Apple HIG — Dark mode: <https://developer.apple.com/design/human-interface-guidelines/dark-mode>

## See also

- `accessibility.md` — WCAG mapping.
- `liquid-glass/references/accessibility.md` — glass auto-degradation.
