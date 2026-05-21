// Token data for the Liquid Glass web showcase.
// Mirrors examples/macos-native-swift/Sources/LiquidGlassShowcase/Tokens.swift.
// Source values trace to spec/tokens/*.yaml — keep this file in sync with the
// CSS custom properties in styles.css :root.

export const RADIUS = [
  { name: "sm",      px: 12,   label: "12 px" },
  { name: "md",      px: 16,   label: "16 px" },
  { name: "lg",      px: 24,   label: "24 px" },
  { name: "xl",      px: 28,   label: "28 px" },
  { name: "capsule", px: 9999, label: "height / 2" },
];

export const SPACING = [
  { name: "controlGap",   px: 8,  label: "8 px" },
  { name: "groupGap",     px: 12, label: "12 px" },
  { name: "panelGap",     px: 16, label: "16 px" },
  { name: "screenMargin", px: 24, label: "24 px (regular)" },
  { name: "sectionGap",   px: 32, label: "32 px" },
];

export const TYPE_SCALE = [
  { token: "caption2",    size: 11, leading: 13, weight: 400 },
  { token: "caption1",    size: 12, leading: 16, weight: 400 },
  { token: "footnote",    size: 13, leading: 18, weight: 400 },
  { token: "subheadline", size: 15, leading: 20, weight: 400 },
  { token: "callout",     size: 16, leading: 21, weight: 400 },
  { token: "body",        size: 17, leading: 22, weight: 400 },
  { token: "headline",    size: 17, leading: 22, weight: 600 },
  { token: "title3",      size: 20, leading: 25, weight: 600 },
  { token: "title2",      size: 22, leading: 28, weight: 700 },
  { token: "title1",      size: 28, leading: 34, weight: 700 },
  { token: "largeTitle",  size: 34, leading: 41, weight: 700 },
];

export const MOTION = [
  { name: "instant", ms: 80,  easing: "standard" },
  { name: "fast",    ms: 160, easing: "standard" },
  { name: "base",    ms: 240, easing: "standard" },
  { name: "slow",    ms: 360, easing: "standard" },
  { name: "sheet",   ms: 420, easing: "spring" },
];
