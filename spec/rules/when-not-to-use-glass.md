# When not to use glass

Glass is a navigation-layer material. Putting it behind content makes
content harder to read, and on macOS 26 / iOS 26 it can outright fail
to render. Each rule below names the surface, the concrete failure
mode, and the source we trust on it.

The bullet list at the bottom of `layout-rules.md` is the short
version. This file is the long version with citations. The auditor
enforces the worst of these (A1 glass-on-glass, A2 glass behind body
text) directly; the rest are review rules.

The forbidden-surface IDs (F1–F5) are distinct from the audit IDs
(A1–A10 + native A11–A24). They name *surfaces* the design system
keeps glass off; the A-codes name *patterns* the auditor flags.

## F1 — Page background

A window-spanning glass surface samples the desktop wallpaper, turns
every other floating glass element into glass-on-glass automatically,
and costs the GPU a full-screen sampling pass for what reads as a flat
tint.

- failure: a `<body>` or root view with `backdrop-filter: blur(40px)` /
  `.glassEffect()`. The "something behind" the glass is supposed to be
  content, not desktop.
- fix: keep the page background solid (system color or media). Apply
  glass to chrome on top.

Sources: [NN/g — Glassmorphism best practices](https://www.nngroup.com/articles/glassmorphism/),
[Orizon — Glassmorphism in 2026 without killing UX](https://www.orizon.co/blog/glassmorphism-in-2026-how-to-use-frosted-glass-without-killing-ux).

## F2 — Long-form text containers

Body text on a sampled backdrop shimmers under scroll. Contrast drops
below WCAG AA on busy backdrops — NN/g documented this on the iOS 26
Lock Screen, Infinum on Control Center. The reduced-transparency
fallback is the opaque escape hatch; if you need it, you are using
glass in the wrong place.

- failure: articles, blog posts, reading panes, document bodies, hero
  copy with a glass background. Headlines over dynamic wallpaper clear
  AA on a calm image and fail on a busy one — the kit cannot promise
  either.
- fix: body text lives on the solid content layer. Surrounding chrome
  may be glass (Mail / Notes pattern).

Sources: [NN/g — Liquid Glass Is Cracked](https://www.nngroup.com/articles/liquid-glass/),
[Infinum — Questionably accessible](https://infinum.com/blog/apples-ios-26-liquid-glass-sleek-shiny-and-questionably-accessible/),
[Axess Lab — Glassmorphism meets accessibility](https://axesslab.com/glassmorphism-meets-accessibility-can-frosted-glass-be-inclusive/) (recommends ≥ 30% opacity film if absolutely required).

## F3 — Forms and input fields

Inputs stack their own surfaces — autocomplete popovers, inline
validation, system suggestion bars. Any of them landing on top of a
glass-backed field becomes glass-on-glass (F5), and validation text
fails contrast against the dynamic backdrop.

- failure: `<input>` or `TextField` with a glass background; a system
  autocomplete popover then appears and produces a glass-on-glass
  collision the kit cannot rescue.
- fix: inputs stay solid. If the panel around them is glass, the input
  is a solid pill *on* the panel. `spec/components/text-field.yaml`
  enforces `glass: forbidden`.

Sources: [Axess Lab](https://axesslab.com/glassmorphism-meets-accessibility-can-frosted-glass-be-inclusive/),
[Vidit B — Solving accessibility with tiered materials](https://blog.viditb.com/solving-liquid-glass-accessibility/).

## F4 — Dense data tables

Tables put a contrast battle on every row before glass enters the
mix. Striped rows, status pills, selection highlights, and column
dividers fight each other for legibility; sampled backdrop adds noise
to the row boundary specifically where the eye most needs an anchor.

- failure: an `NSTableView`, SwiftUI `Table`, or HTML `<table>` with
  row striping over a wallpaper-tinted glass surface. The row boundary
  disappears whenever the wallpaper has a high-frequency region
  behind the row.
- fix: tables are content. Render on a solid surface. Toolbar /
  inspector around the table may be glass.

Sources: [NN/g — Glassmorphism best practices](https://www.nngroup.com/articles/glassmorphism/),
[Orizon](https://www.orizon.co/blog/glassmorphism-in-2026-how-to-use-frosted-glass-without-killing-ux).

## F5 — Glass-on-glass

Two glass surfaces stacked. The upper surface samples a backdrop that
is itself sampled — there is no real refraction, the specular line
tracks nothing meaningful, and on macOS 26 / iOS 26 the inner element
can fail to render. JuniperPhoton documented a regression in iOS 26.1
where a `Menu` inside a `GlassEffectContainer` drops its glass
entirely; the same pitfall costs three offscreen textures per
`CABackdropLayer` in normal rendering.

- failure: nested `.glassEffect`, nested `NSGlassEffectView`, glass
  popover anchored to a glass toolbar item without separating spacers,
  HTML `.lg-glass` inside another `.lg-glass`.
- fix:
  - Native — group with `GlassEffectContainer` /
    `NSGlassEffectContainerView` instead of nesting. The container
    shares one sampling pass.
  - Web — make the outer surface solid. There is no shared-sampling
    primitive in the web profile.

Sources: [JuniperPhoton — Adopting Liquid Glass: pitfalls](https://juniperphoton.substack.com/p/adopting-liquid-glass-experiences),
WWDC25 session 219 ("don't stack").

---

## Adoption context

Apple shipped Liquid Glass to a mixed reception. NN/g published a
usability takedown; Apple's removal of the
`UIDesignRequiresCompatibility` opt-out in Xcode 27 is being treated
by some developers as a forced upgrade. The kit's position: ship
Liquid Glass on the floating layer where it works, and follow the
rules above on the content layer where it doesn't.

Adoption / criticism references:

- [NN/g — Liquid Glass Is Cracked](https://www.nngroup.com/articles/liquid-glass/)
- [Infinum — Questionably accessible](https://infinum.com/blog/apples-ios-26-liquid-glass-sleek-shiny-and-questionably-accessible/)
- [Iconfactory — Peeking Through the Liquid Glass](https://blog.iconfactory.com/2025/06/peeking-through-the-liquid-glass/)
- [Geeky Gadgets — 45% adoption record low](https://www.geeky-gadgets.com/apple-liquid-glass-adoption-rate/)
- [Donny Wals — Opting out via UIDesignRequiresCompatibility](https://www.donnywals.com/opting-your-app-out-of-the-liquid-glass-redesign-with-xcode-26/)
