import SwiftUI

// Tokens lifted verbatim from spec/tokens/*.yaml.
// Do not invent values here; add to the spec first.

enum Tokens {
    enum Radius {
        static let sm: CGFloat = 12
        static let md: CGFloat = 16
        static let lg: CGFloat = 24
        static let xl: CGFloat = 28
    }

    enum Spacing {
        static let controlGap: CGFloat = 8
        static let groupGap: CGFloat = 12
        static let panelGap: CGFloat = 16
        static let screenMarginCompact: CGFloat = 16
        static let screenMarginRegular: CGFloat = 24
        static let sectionGap: CGFloat = 32
    }

    enum Duration {
        static let instant: Double = 0.080
        static let fast: Double = 0.160
        static let base: Double = 0.240
        static let slow: Double = 0.360
        static let sheet: Double = 0.420
    }

    enum Easing {
        // Curves come from spec/tokens/motion.yaml. Each helper returns a ready
        // SwiftUI Animation so call sites can write `.animation(Tokens.Easing.standard(duration: ...))`
        // instead of redeclaring control points.
        static func standard(duration: Double) -> Animation {
            .timingCurve(0.2, 0, 0, 1, duration: duration)
        }
        static func decelerate(duration: Double) -> Animation {
            .timingCurve(0, 0, 0, 1, duration: duration)
        }
        static func accelerate(duration: Double) -> Animation {
            .timingCurve(0.3, 0, 1, 1, duration: duration)
        }
        static let spring = Animation.spring(
            response: 0.42,
            dampingFraction: 0.65,
            blendDuration: 0
        )
    }
}

// Concentric helper — child = parent − inset.
func concentricRadius(parent: CGFloat, inset: CGFloat) -> CGFloat {
    max(0, parent - inset)
}

// Material roles — where the surface lives, not how it looks.
// Mirrors `spec/tokens/material.yaml` `roles.*`. Each role names the closest
// real Apple API for SwiftUI and AppKit. `liveBlur` decides whether the
// surface counts against the B1 performance budget.
enum MaterialRole: String, CaseIterable, Identifiable {
    case sidebar, toolbar, menu, popover, hud, sheet, header
    case windowBackground, content

    var id: String { rawValue }

    var liveBlur: Bool {
        switch self {
        case .windowBackground, .content: return false
        default: return true
        }
    }

    // SwiftUI rule-of-thumb. The real call site picks the right API; this
    // string documents the canonical choice for amateur copy-paste.
    var swiftuiHint: String {
        switch self {
        case .sidebar: return "NavigationSplitView sidebar (Glass.regular auto)"
        case .toolbar: return ".toolbar { ... } (Glass.regular auto)"
        case .menu: return "Menu / .contextMenu (system-applied)"
        case .popover: return ".popover(isPresented:arrowEdge:) (system-applied)"
        case .hud: return ".overlay(alignment:) + .glassEffect(.regular, in: .capsule)"
        case .sheet: return ".sheet { ... .presentationDetents([...]) } (system-applied)"
        case .header: return ".background(.regularMaterial) on sticky header"
        case .windowBackground: return "Color(nsColor: .windowBackgroundColor)"
        case .content: return "Color(nsColor: .controlBackgroundColor)"
        }
    }

    var appkitMaterial: String {
        switch self {
        case .sidebar: return ".sidebar"
        case .toolbar: return ".titlebar"
        case .menu: return ".menu"
        case .popover: return ".popover"
        case .hud: return ".hudWindow"
        case .sheet: return ".sheet"
        case .header: return ".headerView"
        case .windowBackground: return ".windowBackground"
        case .content: return "solid NSColor (no effect view)"
        }
    }
}
