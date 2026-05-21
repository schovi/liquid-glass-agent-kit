// swift-tools-version: 6.0
// Liquid Glass macOS 26 showcase — native SwiftUI.
//
// Requires Xcode 26 / Swift 6.0+ and macOS 26 (Tahoe) at runtime.
// The Liquid Glass APIs (.glassEffect, GlassEffectContainer, ConcentricRectangle,
// .buttonStyle(.glass), .buttonStyle(.glassProminent), ToolbarSpacer, etc.)
// are only available on macOS 26 / iOS 26 / iPadOS 26.

import PackageDescription

let package = Package(
    name: "LiquidGlassShowcase",
    platforms: [
        .macOS("26.0"),
    ],
    products: [
        .executable(name: "LiquidGlassShowcase", targets: ["LiquidGlassShowcase"]),
    ],
    targets: [
        .executableTarget(
            name: "LiquidGlassShowcase",
            path: "Sources/LiquidGlassShowcase"
        ),
    ]
)
