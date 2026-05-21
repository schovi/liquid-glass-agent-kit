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
