# Apple Xcode 26 prompts — comparison

## Source

- Repo: <https://github.com/artemnovichkov/xcode-26-system-prompts>
- Commit SHA read: `c1d1a2bef0d499afc06b40d5de3091ec77c5a486` (default branch `main`, repo `pushed_at` 2026-05-04, fetched 2026-05-23).
- Caveats: unofficial, community-reverse-engineered from `Xcode.app/Contents/PlugIns/IDEIntelligenceChat.framework/Versions/A/Resources`. Not endorsed by Apple, may be stale, may include reformatting by the maintainer. Treat all language as Apple-aligned guidance, not Apple-published copy.

## Method

Files read from `AdditionalDocumentation/`:

- `SwiftUI-Implementing-Liquid-Glass-Design.md`
- `AppKit-Implementing-Liquid-Glass-Design.md`
- `UIKit-Implementing-Liquid-Glass-Design.md`
- `WidgetKit-Implementing-Liquid-Glass-Design.md`
- `SwiftUI-New-Toolbar-Features.md`
- `README.md`

Compared against (in this repo):

- `prompts/web-frosted-glass.md`
- `plugins/apple-agent-kit/skills/liquid-glass/SKILL.md`
- `plugins/apple-agent-kit/skills/liquid-glass/references/{tokens,swiftui,appkit,where-glass-goes,anti-patterns,system-primitives}.md`
- `plugins/apple-agent-kit/skills/liquid-glass/references/patterns/{scroll-edge-effects,morphing}.md`
- `spec/rules/{apple-principles,layout-rules,anti-patterns,accessibility-rules}.md`

## What Apple's prompts emphasize about Liquid Glass / SwiftUI / AppKit

Materials

- Liquid Glass is "a dynamic material" that "blurs content behind it, reflects color and light from surrounding content, and reacts to touch and pointer interactions in real time."
- It "can morph between shapes during transitions."
- API surface: SwiftUI `.glassEffect()` / `Glass.regular` / `.clear` / `.tint()` / `.interactive()`. UIKit `UIGlassEffect`, `UIGlassContainerEffect`. AppKit `NSGlassEffectView`, `NSGlassEffectContainerView`.
- `.regular` is the only named variant in the SwiftUI doc. `.clear` is NOT mentioned by Apple's SwiftUI doc — it appears as `Glass.regular` chained variants only. (UIKit/AppKit talk about `tintColor`; no `.clear` enum.)
- "Apply the `.glassEffect()` modifier after other modifiers that affect the appearance of the view."

Containers and merging

- "When applying Liquid Glass effects to multiple views, use `GlassEffectContainer` for better rendering performance and to enable blending and morphing effects."
- `spacing:` parameter "controls how the Liquid Glass effects interact with each other: smaller spacing → views need to be closer to merge; larger spacing → effects merge at greater distances."
- `glassEffectUnion(id:namespace:)` combines multiple views into a single Liquid Glass effect, "useful when creating views dynamically or with views that live outside of an HStack or VStack."

Morphing

- "Create a namespace using `@Namespace` … associate each Liquid Glass effect with a unique identifier using `glassEffectID` … use animations when changing the view hierarchy."
- "The morphing effect occurs when views with Liquid Glass appear or disappear due to view hierarchy changes."

Buttons

- `.buttonStyle(.glass)` and `.buttonStyle(.glassProminent)` are the official styles.

Background extension

- `NavigationSplitView { … } detail: { … .background { … } }` "stretch[es] content behind a sidebar or inspector with the background extension effect."
- `ScrollView(.horizontal).scrollExtensionMode(.underSidebar)` — extend horizontal scroll under sidebar / inspector.

Toolbar (the dedicated doc adds a lot)

- Customizable toolbars with `.toolbar(id: "main")` and per-`ToolbarItem` `id:`.
- `ToolbarSpacer(.fixed)` / `ToolbarSpacer(.flexible)`.
- `.searchToolbarBehavior(.minimize)` — search renders as a button-like control that expands when tapped.
- `DefaultToolbarItem(kind: .search, placement: .bottomBar)` to reposition default items.
- `ToolbarItem(placement: .largeSubtitle)` plus `.navigationSubtitle(_:)` for custom subtitle content. Largesubtitle "takes precedence over the value provided to the `navigationSubtitle(_:)` modifier."
- `.sharedBackgroundVisibility(.hidden)` "adjusts the visibility of the glass background effect, allowing items to stand out visually."
- `matchedTransitionSource(id:in:)` on a toolbar item plus `.navigationTransition(.zoom(sourceID:in:))` on the destination.
- Search minimization recommended on iPhone/small screens; toolbar customization recommended on macOS productivity apps.

AppKit specifics

- `NSGlassEffectView` exposes `cornerRadius`, `tintColor`, `contentView`. Insert with `addSubview(_:positioned:.below, relativeTo: nil)` for buttons.
- `NSGlassEffectContainerView` `spacing` "default value (0) is suitable for batch processing while avoiding distortion."
- "Only the `contentView` of `NSGlassEffectView` is guaranteed to be inside the glass effect. Arbitrary subviews may not have consistent z-order behavior."

UIKit specifics

- `UIGlassEffect()`, `glassEffect.tintColor`, `glassEffect.isInteractive = true`.
- `UIGlassContainerEffect()` with `spacing`.
- `UIScrollEdgeEffect` per-edge on `UIScrollView`: `scrollView.topEdgeEffect.style = .automatic` (or `.hard`), `scrollView.bottomEdgeEffect.style = .hard`, `.isHidden = true` to drop.
- `UIScrollEdgeElementContainerInteraction` — overlay views attached to a scroll view's edge "affect the shape of the edge effect."
- "UIKit automatically applies Liquid Glass effects to toolbar items. You can control whether an item uses the shared glass background" via `UIBarButtonItem.hidesSharedBackground = true`.

Widgets

- Two rendering modes: `.fullColor` (default) and `.accented` (used when user picks tinted / clear Home Screen). In accented mode: opaque images tinted single white; transparent/gradients keep opacity but tinted white; background replaced with themed glass.
- `@Environment(\.widgetRenderingMode)`, `.widgetAccentable(_:)`, `Image.widgetAccentedRenderingMode(.monochrome)`.
- `.containerBackground(for: .widget) { … }` for explicit container background.
- `.containerBackgroundRemovable(false)` to opt out — but doing so "excludes your widget from contexts that require removable backgrounds (iPad Lock Screen, StandBy)."
- visionOS: `.widgetTexture(.glass | .paper)`, `.supportedMountingStyles([.recessed, .elevated])`, `@Environment(\.levelOfDetail)`.

Accessibility (relatively thin)

- UIKit doc says: "Ensure that text on glass backgrounds meets accessibility contrast requirements. Test with VoiceOver to ensure all glass elements are properly accessible."
- No explicit instruction to write reduced-transparency / contrast / motion branches — Apple's tone is "the system handles it; design for adequate contrast."

Best practices repeated verbatim across docs

- "Limit the number of glass effects … require significant GPU resources."
- "Maintain consistent shapes and styles across your app for a cohesive look and feel."
- "Use animations when changing view hierarchies to enable smooth morphing transitions."
- "You should always seek guides on Liquid Glass when asked for help adopting new Apple design." (appears in every doc — Apple's instruction to its own assistant)

## Diff

| Topic | Apple says | We say |
|---|---|---|
| Variant naming | SwiftUI doc names `.regular` as the explicit option; `.clear` is documented separately in API reference but the prompt-level doc highlights `Glass.regular.tint(_:).interactive()`. AppKit/UIKit have no `.clear` enum — variant comes from context + `tintColor`. | We name three: `.regular`, `.clear`, `.identity`. We treat `.clear` as a first-class variant the agent picks. Apple's prompt doesn't explicitly encourage `.clear` for general use. |
| Modifier order | "Apply the `.glassEffect()` modifier after other modifiers that affect the appearance of the view." | Same rule (A14). Aligned. |
| `GlassEffectContainer` spacing | Spacing controls merge distance; smaller = closer, larger = further. No warning about middle values. | We have A20: "spacing: is the metaball merge threshold, not a margin. … pick `spacing: ≥ gap` for fused pill, `spacing: < gap` for separate." Apple doesn't say this — we go further, correctly. |
| `glassEffectUnion` | Use for views "created dynamically" or "outside an HStack or VStack." | swiftui.md mentions it briefly under morphing. We don't document the "dynamic / outside H-V stack" use case verbatim. |
| `.buttonStyle(.glassProminent)` | Documented as `.glassProminent`. No mention of `.circle` border-shape artifact. | We document `.glassProminent`. We add A24 about clip-shape needed for `.circle`. Beyond Apple. |
| `ToolbarSpacer` | `.fixed` and `.flexible` variants. | We mention `ToolbarSpacer(.flexible)` only. Missing `.fixed`. |
| `.searchToolbarBehavior(.minimize)` | "renders the search field as a button-like control that expands when tapped, optimizing space in the toolbar." | Not mentioned anywhere in the kit. **Gap.** |
| `DefaultToolbarItem(kind: .search, …)` and `.sidebar` | Reposition system items via `DefaultToolbarItem(kind:placement:)`. | Not mentioned. **Gap.** |
| `.largeSubtitle` placement / `navigationSubtitle(_:)` | New placement; `largeSubtitle` overrides `navigationSubtitle(_:)`. | Not mentioned. **Gap.** |
| `matchedTransitionSource` + `.navigationTransition(.zoom(…))` | Documented as the toolbar-to-sheet transition pattern. | We mention it inside the sheet section of swiftui.md and in patterns/morphing.md. Aligned. |
| `.sharedBackgroundVisibility(_:)` | "adjusts the visibility of the glass background effect, allowing items to stand out visually." Applies per-group on customizable toolbars. | We name it in swiftui.md and where-glass-goes.md, used to break up the toolbar capsule and on non-interactive titles. Aligned. |
| `scrollExtensionMode(.underSidebar)` | "extend horizontal scroll views under a sidebar or inspector." | Not mentioned. **Gap.** |
| Scroll edge effects | UIKit names `.automatic` and `.hard`. Per-edge `topEdgeEffect`, etc. `UIScrollEdgeElementContainerInteraction` lets overlay views deform the edge. | swiftui.md and appkit.md document `.soft` / `.hard` per-edge, plus our extra rule "one style per edge, never mix." No mention of the iOS `.automatic` style and no UIKit-equivalent `UIScrollEdgeElementContainerInteraction`. iOS/UIKit not in scope for the native skill (macOS-focused) — but worth a note. |
| `NSGlassEffectView` content guarantee | "Only the contentView of NSGlassEffectView is guaranteed to be inside the glass effect. Arbitrary subviews may not have consistent z-order behavior." | Not mentioned in appkit.md. **Gap.** |
| `NSGlassEffectContainerView` default spacing | "Default value (0) is suitable for batch processing while avoiding distortion." | Not mentioned. Helpful detail. |
| UIKit `hidesSharedBackground` | `UIBarButtonItem.hidesSharedBackground = true` to opt out of shared toolbar glass for a specific item. | Native skill is macOS-only — but the *concept* is the same as SwiftUI `.sharedBackgroundVisibility(.hidden)`. We're aligned. |
| Widget accented rendering mode | `@Environment(\.widgetRenderingMode)`, `.widgetAccentable()`, `widgetAccentedRenderingMode(.monochrome)`. | Not in scope of our kit (no widget guidance). **Out of scope intentionally.** |
| Accessibility | UIKit: "ensure text on glass meets accessibility contrast requirements. Test with VoiceOver." No prescriptive `reduce-transparency` branching. | Web prompt requires `@media (prefers-reduced-transparency: reduce)`, `prefers-contrast: more`, `prefers-reduced-motion: reduce`. Native skill says "system handles it, don't fight it." We're **stricter than Apple** on web (correct — web has no auto-degrade). Aligned on native. |
| "Apple-official" claim | Apple's prompt says "You should always seek guides on Liquid Glass when asked for help adopting new Apple design." Asserts authority. | We explicitly forbid "Apple-official" / "Apple-certified" claims. Different goal — Apple's IDE assistant *is* Apple; we are not. Correct divergence. |
| Custom alerts | Apple's prompts don't discuss custom alerts. | system-primitives.md forbids hand-rolling system alerts. Stronger than Apple but consistent with HIG. Correct. |
| Concentricity / `ConcentricRectangle` | Not mentioned in artemnovichkov's docs. | We have a whole rule (A6) plus `ConcentricRectangle()` usage. We go beyond Apple's IDE prompt here. |
| Background extension | Shows `NavigationSplitView { … } detail: { … .background { … } }` pattern. | We document `.backgroundExtensionEffect()` modifier and `NSBackgroundExtensionView`. Both are valid; Apple's IDE prompt shows the SwiftUI sugar; we name the explicit modifier. Worth merging both into the skill. |

## Gaps in our web prompt

`prompts/web-frosted-glass.md` is a *web approximation* — many native-API specifics don't apply. But these concepts do translate:

1. **Search-field minimize behavior**. Apple: "renders the search field as a button-like control that expands when tapped, optimizing space in the toolbar." Our prompt currently says "Search field (toolbar): min-height 32, padding 12/6, capsule, icon 14. **Solid.** Inline variant: min-height 44, radius 12." It doesn't mention the **icon-only collapsed → field expanded** interaction.

   Proposed addition (after the existing "Search field (toolbar)" line):

   > Search field can also collapse to a capsule icon button (height 32, width 32) that expands to the full field on focus. Mirror Apple's `searchToolbarBehavior(.minimize)`.

2. **Toolbar spacer variants**. Apple distinguishes `ToolbarSpacer(.fixed)` vs `ToolbarSpacer(.flexible)`. Our prompt says "Toolbar: min-height 52, padding 6, gap 4, item 40, icon 20, capsule." but does not name fixed vs flexible.

   Proposed addition:

   > Use a flexible spacer (`flex: 1`) to split one shared glass capsule into two visually separate groups; use a fixed-width spacer (e.g. `width: 12px`) to insert a hard gap within one capsule.

3. **Large subtitle placement**. Apple has `navigationSubtitle` + `.largeSubtitle` placement. Our prompt has no concept of navigation title / subtitle. Probably out of scope for a token-only block — but worth one sentence:

   > A title bar can carry an optional small subtitle below the title (font 13/400, color secondary). On wide layouts a custom view may replace the subtitle.

4. **Background extension effect (web translation)**. Apple: hero content shows through under floating sidebar / inspector. Web equivalent: the hero image extends edge-to-edge under the sidebar's blurred backdrop. Our prompt says nothing about this layering. Possible addition:

   > When a floating sidebar or inspector sits over content, let hero media extend full-bleed under it. The sidebar's `backdrop-filter` does the blending. Don't crop the image at the sidebar edge.

5. **Quote Apple's variant guidance**. Apple: "By default, this applies the regular variant of Glass." Our prompt already starts from Regular — fine — but should explicitly say Regular is the default when in doubt, Clear is rare. Current text says "Clear glass (rare, requires a dim layer behind)" — already aligned. No change needed.

## Gaps in our native skill

`plugins/apple-agent-kit/skills/liquid-glass/`:

1. **`references/swiftui.md` — add `searchToolbarBehavior(.minimize)`**. Apple quote: "renders the search field as a button-like control that expands when tapped, optimizing space in the toolbar." Currently the file only says `.searchable(text: $query, placement: .toolbar)`. Add:

   ```swift
   View()
       .searchable(text: $query, placement: .toolbar)
       .searchToolbarBehavior(.minimize)   // collapse to button, expand on tap
   ```

2. **`references/swiftui.md` — add `DefaultToolbarItem`**. Apple quote: "The `DefaultToolbarItem` with `.search` kind allows you to reposition the search field within the toolbar." Currently absent. Add to the Toolbar section:

   ```swift
   .toolbar {
       DefaultToolbarItem(kind: .search, placement: .bottomBar)
       DefaultToolbarItem(kind: .sidebar, placement: .navigationBarLeading)
   }
   ```

3. **`references/swiftui.md` — add `ToolbarSpacer(.fixed)`**. Currently we only show `.flexible`. Add one line distinguishing the two and note: `.fixed` is a hard gap inside one capsule; `.flexible` splits the capsule.

4. **`references/swiftui.md` — add `ToolbarItem(placement: .largeSubtitle)`** and `.navigationSubtitle("…")`. Apple: "The `.largeSubtitle` placement takes precedence over the value provided to the `navigationSubtitle(_:)` modifier." Worth adding under Toolbar:

   ```swift
   .navigationTitle("Title")
   .navigationSubtitle("Subtitle")
   .toolbar {
       ToolbarItem(placement: .largeSubtitle) { CustomSubtitle() }
   }
   ```

5. **`references/swiftui.md` — add `scrollExtensionMode(.underSidebar)`**. Apple quote: "To extend horizontal scroll views under a sidebar or inspector." Currently absent. Add a small block after the Background extension section. (Verify the modifier name against Apple's API reference — `scrollExtensionMode` appears in the artemnovichkov doc but is not currently in our gaps list.)

6. **`references/appkit.md` — add the `contentView` z-order caveat**. Apple quote: "Only the contentView of NSGlassEffectView is guaranteed to be inside the glass effect. Arbitrary subviews may not have consistent z-order behavior." Add a "Gotchas" subsection to appkit.md:

   > Only the `contentView` of `NSGlassEffectView` is guaranteed to be inside the glass effect. Arbitrary `addSubview(...)` calls onto the glass view itself may not z-order consistently — put your content in `contentView`, not directly on the glass view.

7. **`references/appkit.md` — add `NSGlassEffectContainerView` default spacing note**. Apple: "Default value (0) is suitable for batch processing while avoiding distortion." Currently we just say `container.subviews = [...]`. Add:

   > `NSGlassEffectContainerView.spacing` defaults to `0` — fine for grouping without merging. Raise it only when you want close siblings to fuse into one shape.

8. **`references/swiftui.md` — flesh out `glassEffectUnion`**. Apple quote: "useful when creating views dynamically or with views that live outside of an HStack or VStack." Currently we mention it under morphing only. Add a sentence to the Grouping glass section:

   > Use `.glassEffectUnion(id:namespace:)` on views created in a `ForEach` or otherwise dynamic loops, and on views that live in separate ancestors (e.g. a toolbar button and a content-area pill that should share one glass shape).

9. **`references/system-primitives.md` — confirmation dialog count**. Currently says "alerts cap at three buttons cleanly." Apple's prompts don't restate this — minor, no change.

10. **`SKILL.md` — link to artemnovichkov as one of the sources** (optional). Not necessary; the kit's `docs/resources.md` is the canonical source list. Skip.

11. **`SKILL.md` — add explicit `Glass.regular` as default**. Apple: "By default, this applies the regular variant of Glass within a Capsule shape behind the view's content." Our skill already says "Prefer Regular glass" — aligned.

12. **`references/anti-patterns.md` — broaden A2 with Apple's exact phrasing**. Apple's UIKit doc: "Ensure sufficient contrast between text and the glass background." Already covered conceptually by A2 + A8; no edit needed.

## Recommended edits (priority-ordered)

1. In `plugins/apple-agent-kit/skills/liquid-glass/references/swiftui.md`, add a `searchToolbarBehavior(.minimize)` example in the Segmented / search / popover section, because Apple's prompt says "renders the search field as a button-like control that expands when tapped, optimizing space in the toolbar."
2. In `plugins/apple-agent-kit/skills/liquid-glass/references/swiftui.md`, add a Toolbar subsection for `DefaultToolbarItem(kind:placement:)` because Apple's prompt says `DefaultToolbarItem` "allows you to reposition the search field within the toolbar" and shows it being used with `.sidebar`, `.search`.
3. In `plugins/apple-agent-kit/skills/liquid-glass/references/swiftui.md`, document both `ToolbarSpacer(.fixed)` and `ToolbarSpacer(.flexible)` (we only have `.flexible`). Apple: "fixed-width space" vs "flexible space that pushes items apart."
4. In `plugins/apple-agent-kit/skills/liquid-glass/references/swiftui.md`, add `ToolbarItem(placement: .largeSubtitle)` plus `navigationSubtitle(_:)`. Apple: "The `.largeSubtitle` placement takes precedence over the value provided to the `navigationSubtitle(_:)` modifier."
5. In `plugins/apple-agent-kit/skills/liquid-glass/references/swiftui.md`, add `scrollExtensionMode(.underSidebar)` for horizontal scrolling under sidebars/inspectors. Apple: "To extend horizontal scroll views under a sidebar or inspector."
6. In `plugins/apple-agent-kit/skills/liquid-glass/references/appkit.md`, add an `NSGlassEffectView` z-order caveat. Apple: "Only the contentView of NSGlassEffectView is guaranteed to be inside the glass effect. Arbitrary subviews may not have consistent z-order behavior."
7. In `plugins/apple-agent-kit/skills/liquid-glass/references/appkit.md`, note `NSGlassEffectContainerView.spacing` defaults to `0`. Apple: "Default value (0) is suitable for batch processing while avoiding distortion."
8. In `plugins/apple-agent-kit/skills/liquid-glass/references/swiftui.md`, expand `glassEffectUnion` with the dynamic-view use case. Apple: "useful when creating views dynamically or with views that live outside of an HStack or VStack."
9. In `prompts/web-frosted-glass.md`, add a sentence about a minimizing search field (web translation of `searchToolbarBehavior(.minimize)`) so AI tools targeting the web profile produce an icon-collapses-to-field control. Quote Apple: "renders the search field as a button-like control that expands when tapped."
10. In `prompts/web-frosted-glass.md`, add a sentence distinguishing fixed vs flexible toolbar spacers — Apple's distinction is "fixed-width space" vs "flexible space that pushes items apart" — so a single web prompt can produce both behaviors.
11. In `prompts/web-frosted-glass.md`, add one line on background extension: hero media extends full-bleed under a floating sidebar / inspector. Apple's pattern: "stretch content behind a sidebar or inspector with the background extension effect."
12. *(Optional)* In `plugins/apple-agent-kit/skills/liquid-glass/SKILL.md` reference map, add a note that the skill is macOS-focused and that iOS / iPadOS use `UIGlassEffect` / `UIGlassContainerEffect` / `UIScrollEdgeEffect`; cross-reference the UIKit doc names in case a user asks. (Today the SKILL says "Build authentic macOS 26 (Tahoe) Liquid Glass apps in SwiftUI or AppKit" — explicit macOS scope is good. Don't broaden, just acknowledge.)

## Don't adopt

- **Apple's framing "You should always seek guides on Liquid Glass when asked for help adopting new Apple design."** This is an internal directive for Xcode's own assistant. Our kit's voice is "inspired-by, not endorsed" — adopting Apple's authoritative tone would be misleading.
- **UIKit's example pattern `glassButton.insertSubview(buttonEffectView, at: 0)`** — inserts a visual-effect view at index 0 of a `UIButton`. Apple's own UIKit doc shows this, but it's a fragile hand-roll that fights `UIButton.Configuration` and breaks on state changes. Our `appkit.md` correctly steers people to `NSButton.bezelStyle = .glass` / SwiftUI `.buttonStyle(.glass)` for the same effect. Keep that.
- **The AppKit doc's `InteractiveGlassView` example** that adjusts `cornerRadius` based on mouse position (`let newRadius = 8.0 + (normalizedX * 8.0)`). That's a toy demo; it produces a non-standard interaction and breaks concentricity. We should not normalize this.
- **Apple's silence on `reduce-transparency` / `reduce-motion` accessibility branches** on the web side. On native, "system handles it" is true. On the web, `backdrop-filter` does not auto-degrade — we must keep our `@media (prefers-reduced-transparency: reduce)` rules in the web prompt. Don't remove our stricter web fallbacks just because Apple's UIKit prompt is silent on them.
- **The widget rendering modes section** (`@Environment(\.widgetRenderingMode)`, `.widgetAccentable()`, `widgetAccentedRenderingMode(.monochrome)`). Widgets are out of scope for this kit (macOS apps, not WidgetKit). Don't bolt them in just because Apple's prompts cover them — that's scope creep.
- **Visionos `widgetTexture(.paper)` / `supportedMountingStyles([...])`**. Same reason — visionOS widgets are out of scope.
- **AppKit's `NSToolbar` boilerplate-heavy delegate example** with `NSToolbarItem.Identifier` arrays. Our `appkit.md` already shows a leaner pattern using `NSGlassEffectContainerView` + buttons; we don't need Apple's verbose delegate dance copy-pasted in.

---

End of report.
